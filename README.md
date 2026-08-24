# YOGSANG Returnable India - Packaging as a Service (PaaS)

> High-performance 60FPS Apple-style canvas scroll showcase and sustainable packaging landing page.

![Yogsang Banner](public/frames/ezgif-frame-240.jpg)

## 🚀 Features

- **60FPS Canvas Scroll Animation**: Smooth inertial lerp scrubbing across 240 high-resolution sequence frames.
- **Aspect-Fit Rendering**: Automatically scales for desktop, tablet, and mobile screens without cropping essential details.
- **Fixed Glassmorphic Navigation Bar**: Translucent blurred header with smooth section anchors.
- **Comprehensive Landing Page**: Industrial challenge breakdowns, Packaging as a Service (PaaS) value pillars, industry applications, and enterprise consultation CTAs.
- **Deploy Ready**: Fully optimized for Vercel, Netlify, or any static/Node CDN with Vite bundling.

---

## 🛠️ Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Dev Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
The production bundle will be generated in the `dist/` directory.

---

## ☁️ Deploy to Vercel (1-Click)

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import this GitHub repository (`paithanpagareparth-ctrl/yogsang`).
3. Vercel will automatically detect **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**.

---

## 📁 Project Structure

```
├── public/
│   └── frames/          # 240 sequence animation frames (ezgif-frame-001.jpg -> 240.jpg)
├── frames/              # Frame source directory
├── index.html           # Main semantic HTML structure
├── style.css            # Tailwind + custom CSS styling
├── scrollEngine.js      # 60FPS canvas scroll engine
├── main.js              # Application entry point & animations
├── package.json         # Dependencies & scripts
└── vercel.json          # Vercel deployment & caching configuration
```

---

## 📄 License
MIT © 2026 YOGSANG Returnable India.
