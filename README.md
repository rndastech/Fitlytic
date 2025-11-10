# 🏋️ FITLYTIC – AI-Powered Exercise Tracking & Guidance System

## 📋 Executive Summary

**Fitlytic** is a browser-based, real-time exercise tracking system that uses AI and computer vision to deliver instant feedback on workout form. It leverages **MediaPipe Pose** for 33-point landmark detection and custom **FSM logic** for rep counting and posture validation — all processed locally to ensure privacy.

---

## 🎯 Problem Statement

Conventional exercise guidance lacks real-time feedback, causing poor form and injury risk. Fitlytic provides:

- ✅ **AI-driven real-time form correction**
- ✅ **Accurate rep and angle tracking**
- ✅ **100% on-device privacy** (no video upload)
- ✅ **Accessibility** for both home fitness and rehab

---

## 👥 Target Users

- 🏠 **Home Users** – guided workouts
- 🏥 **Clinics & Therapists** – remote physiotherapy
- ⚕️ **Patients** – post-surgery recovery
- 💪 **Trainers** – remote coaching
- 🎓 **Researchers** – biomechanics data collection

---

## 🚀 Key Features

### 🔹 Real-Time Pose Analysis
- 33-point skeletal detection
- Sub-100 ms inference latency
- 3D z-coordinate support

### 🔹 Intelligent Form Validation
- FSM-based state transitions
- Angle-based rep detection with hysteresis
- Side detection for left/right analysis

### 🔹 Performance & Feedback
- Automatic rep counting
- Form scoring (0–100)
- Range-of-motion & consistency tracking
- Audio + visual cues for correction

### 🔹 Privacy-First Design
- On-device MediaPipe inference
- No video recording or upload
- Optional clinician data sharing
- HIPAA-ready architecture

### 🔹 User Experience
- Responsive UI (desktop/mobile)
- PWA installable app
- Multi-language support
- Personalized programs

### 🔹 Analytics & History
- Session history & progress charts
- Cloud sync with Firestore
- Downloadable summaries

---

## 💡 Why Fitlytic?

| Feature | Fitlytic | Commercial Apps | In-Person Trainer | Smart Mirrors |
|---------|----------|-----------------|-------------------|---------------|
| **Real-time AI Feedback** | ✅ Yes | ⚠️ Limited | ✅ Yes | ❌ No |
| **Privacy** | ✅ Local | ❌ Cloud | ✅ Yes | ✅ Yes |
| **Cost** | ✅ Free | ❌ $10–30/mo | ❌ Expensive | ❌ ₹2L+ |
| **Accessibility** | ✅ Browser | ✅ App | ❌ No | ✅ Local |
| **Clinical Integration** | ✅ Yes | ❌ No | ✅ Yes | ❌ No |

### Unique Advantages
- ⚡ On-device inference (<100ms)
- 🔐 No data leakage
- 💰 Free and open-source
- 🔧 Extensible exercise definitions

---

## 📊 Metrics Tracked

| Metric | Purpose |
|--------|---------|
| **Rep Count** | Exercise repetition tracking |
| **Form Score** | Quality of posture |
| **Range of Motion (ROM)** | Rehabilitation monitoring |
| **Stability** | Rep consistency |
| **Duration** | Session time tracking |
| **Max/Min/Avg Angles** | Biomechanical analysis |

---

## 🔧 Technical Stack

- **Frontend:** React 18, MUI 6, React-Webcam, React-Hot-Toast
- **AI/ML:** MediaPipe Tasks Vision, TensorFlow.js
- **Backend:** Firebase Auth, Firestore, Firebase Analytics
- **Deployment:** Firebase Hosting, PWA-enabled

---

## 🔐 Security & Privacy

- Google OAuth via Firebase Authentication
- Firestore Rules enforce user-level access
- No raw video stored, only numerical landmark data
- Opt-in clinician sharing with anonymized metrics
- All communication encrypted (HTTPS) – HIPAA/GDPR-aligned design

```javascript
match /users/{userId}/{document=**} {
  allow read, write: if request.auth != null &&
                     request.auth.token.email == userId;
}
```

---

## 🏋️ Supported Exercises

| Exercise | Key Joints | Rep Trigger | Status |
|----------|-----------|------------|--------|
| Push-Up | Elbows, Shoulders | 90°→150° elbow angle | ✅ |
| Squat | Knees, Hips | Knee deep→extend | ✅ |
| Bridge | Hips, Knees | Hip extension | ✅ |
| Plank | Shoulders, Hips | Hold time | ✅ |
| Leg Raise | Hips, Abs | 0°→90° leg angle | ✅ |
| Toe Touch | Hips, Hamstrings | Forward bend | ✅ |
| Lunge | Knees, Hips | Depth & angle | ✅ |
| Shoulder Press | Shoulders, Elbows | Overhead press | ✅ |

All exercises defined in modular JSON configs (angle thresholds, feedback, difficulty).

---

## 👨‍⚕️ Doctor–Patient Workflow

### Patient Workflow
1. Select exercise → webcam activates
2. AI provides live feedback & rep counting
3. Session metrics saved locally & to Firestore

### Clinician Workflow
1. Access shared anonymized metrics
2. Review ROM, form scores, trends
3. Add feedback for patient via dashboard

### Privacy-First Flow
```
Pose → Metrics Extraction → User Consent 
→ Encrypted Firestore → Clinician Review 
→ Recommendation → Patient Feedback
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 14 and npm ≥ 6
- Modern browser with WebGL support
- Webcam
- Firebase project

### Installation

```bash
# Clone repository
git clone https://github.com/rndastech/Fitlytic.git
cd Fitlytic

# Install dependencies
npm install

# Configure Firebase (.env)
REACT_APP_API_KEY=your_api_key
REACT_APP_AUTH_DOMAIN=your_auth_domain
REACT_APP_PROJECT_ID=your_project_id
REACT_APP_STORAGE_BUCKET=your_storage_bucket
REACT_APP_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_APP_ID=your_app_id
REACT_APP_MEASUREMENT_ID=your_measurement_id

# Start development
npm start

# Build for production
npm run build

# Deploy to Firebase
firebase deploy
```

---

## 🔍 How It Works

### 1. Pose Detection Pipeline
```
Webcam Input → MediaPipe Pose 
→ 33 Landmarks (x, y, z, visibility)
```

### 2. Angle Computation
```
Three landmarks (p1, p2, p3) 
→ Vectors v1, v2 
→ Dot product formula 
→ Angle in degrees
```

### 3. FSM Analysis
```
Current State + Joint Angles 
→ Transition Rules 
→ New State + Feedback
```

### 4. Rep Counting
```
INIT → DESCENDING → HOLD → FINISHED (Rep +1)
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

MIT License – free for personal, clinical, and research use.

---

## 🙏 Acknowledgments

- **MediaPipe Team** – pose detection backbone
- **Firebase** – backend infrastructure
- **React Community** – amazing ecosystem
- **Contributors & Testers** – invaluable feedback


---

## 📚 References

### Computer Vision & Pose Detection
- [MediaPipe Pose Docs](https://mediapipe.dev/solutions/pose)
- [MediaPipe Tasks Vision](https://developers.google.com/mediapipe/solutions/vision/pose_landmarker)
- [TensorFlow.js Pose Detection](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection)

### Frontend
- [React 18 Documentation](https://react.dev)
- [React Router v6](https://reactrouter.com)
- [Material-UI Docs](https://mui.com)

### Backend
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

---

**Last Updated:** November 2025  
**Version:** 0.1.0  
**Status:** Active Development

Made with ❤️ by the Fitlytic Team
