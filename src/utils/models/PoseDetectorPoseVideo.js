import {DrawingUtils, FilesetResolver, PoseLandmarker} from '@mediapipe/tasks-vision';

import poseLandmarkerTask from '../../shared/models/pose_landmarker_lite.task';

const POSE_CONNECTIONS_NON_FACE = [
  {start: 11, end: 12}, {start: 12, end: 14}, {start: 14, end: 16},
  {start: 11, end: 13}, {start: 13, end: 15}, {start: 11, end: 23},
  {start: 12, end: 24}, {start: 23, end: 24}, {start: 23, end: 25},
  {start: 24, end: 26}, {start: 25, end: 27}, {start: 26, end: 28},
  {start: 27, end: 29}, {start: 28, end: 30}, {start: 29, end: 31},
  {start: 30, end: 32}
];

let poseLandmarker;

async function createPoseLandmarker() {
  try {
    const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/wasm');
    poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {modelAssetPath: poseLandmarkerTask},
      runningMode: 'VIDEO',
      numPoses: 1,
    });
  } catch (e) {
    console.error('ERROR creating PoseLandmarker:', e);
  }
  return poseLandmarker;
}

const startPoseDetection =
    async (videoElement, canvasRef, onResultsCallback) => {
  if (!poseLandmarker) {
    poseLandmarker = await createPoseLandmarker();
  }

  const detectPose = async () => {
    if (videoElement.paused || videoElement.ended) {
      return;
    }

    if (videoElement.readyState >= 2) {
      try {
        poseLandmarker.detectForVideo(
            videoElement, performance.now(), (result) => {
              if (!result || !result.landmarks || result.landmarks.length === 0)
                return;
              if (!canvasRef.current) return;

              const canvasElement = canvasRef.current;
              canvasElement.width = videoElement.videoWidth;
              canvasElement.height = videoElement.videoHeight;

              const canvasCtx = canvasElement.getContext('2d');
              const drawingUtils = new DrawingUtils(canvasCtx);

              canvasCtx.save();
              canvasCtx.clearRect(
                  0, 0, canvasElement.width, canvasElement.height);

              const pose = result.landmarks[0];
              if (pose) {
                const nonFaceLandmarks = pose.filter(
                    (_, index) => index > 10 && (index < 17 || index > 22));

                // Draw landmarks and connections
                drawingUtils.drawConnectors(
                    pose, POSE_CONNECTIONS_NON_FACE,
                    {color: 'blue', lineWidth: 5});
                drawingUtils.drawLandmarks(
                    nonFaceLandmarks, {color: 'red', radius: 2.5});

                onResultsCallback(pose);
              }

              canvasCtx.restore();
            });
      } catch (e) {
        console.error('Pose detection error:', e);
      }
    }

    requestAnimationFrame(detectPose);
  };

  detectPose();  // Start the detection loop
};

export default startPoseDetection;