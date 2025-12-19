# Hand-Particle
An interactive hand-tracking generative art project built with JavaScript, HTML5 Canvas, and MediaPipe Hands.
The system creates fluid, glowing particles that react in real time to hand movement, speed, and gestures.

Inspired by modern creative coding and interactive visual art often seen in experimental Instagram Reels.

🎥 Demo

Move your hand in front of the camera and watch particles follow your fingers.

Slow movement → smooth, calm flow

Fast movement → energetic motion & color shifts

Open hand ✋ → Flow mode

Closed fist ✊ → Explosion mode

🚀 Features

🖐 Real-time hand tracking using MediaPipe Hands

🌊 Flow-field based particle motion

🧈 Smooth hand easing for cinematic movement

🎨 Dynamic color system (HSL) based on hand speed

✨ Glow & additive blending effects

🧠 Gesture-based modes

Flow Mode (open hand)

Explosion Mode (closed fist)

⚡ Optimized for performance (particle limits, lightweight math)

🛠 Tech Stack

JavaScript (ES6)

HTML5 Canvas

MediaPipe Hands

Web Camera API

No external rendering libraries (pure Canvas).

📂 Project Structure
├── index.html
├── main.js
└── README.md

▶️ How to Run

Clone the repository:

git clone https://github.com/your-username/hand-particle-flow.git


Open index.html in a local server

⚠️ Camera access requires HTTPS or localhost

Example:

npx serve


Allow camera access and start interacting ✨

🧠 How It Works (Concept)

MediaPipe detects 21 hand landmarks

Finger tips emit particles

Hand speed controls:

particle force

size

color transitions

Gesture detection switches between visual modes

Flow field adds organic, fluid motion

This project blends creative coding, computer vision, and interactive design.

🎯 Use Cases

Creative coding experiments

Interactive installations

Portfolio projects

Instagram / TikTok visual content

Generative art research
