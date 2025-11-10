let detectPose;

export default async function getDetectPose(...args) {
  if (!detectPose) {
    // Use Tasks-Vision by default (modern MediaPipe API)
    detectPose = (await import('./PoseDetectorTasksVision')).default;
  }
  return detectPose(...args);
}