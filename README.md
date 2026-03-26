# BrainHack 2025 — AR Web Experience

A browser-based Augmented Reality experience built for DSTA BrainHack 2025. Point your phone's camera at the BrainHack poster and watch a 3D model animate into view, browse a media panel with a video and info slides, then tap a call-to-action button to visit the event website.

No app download required — it runs entirely in the browser.

---

## Demo

| Step | What happens |
|------|--------------|
| Open the page on a mobile browser | Camera feed starts; a scanning overlay appears |
| Point camera at the BrainHack poster | Target is detected; 3D model rises into frame |
| Tap the play button | Event highlight video plays |
| Tap the left/right arrows | Cycle through info slides |
| Tap the CTA banner | Opens [dstabrainhack.com](https://www.dstabrainhack.com/) |

---

## Tech Stack

| Library | Version | Purpose |
|---------|---------|---------|
| [A-Frame](https://aframe.io/) | 1.4.2 | Declarative WebXR / 3D scene |
| [MindAR](https://hiukim.github.io/mind-ar-js-doc/) | 1.2.2 | Image-target tracking |

No build step, no package manager — it is a single HTML file with vanilla JavaScript.

---

## Project Structure

```
index.html                  # Entry point — scene definition and all A-Frame markup
scripts/
  scanned-target.js         # A-Frame component: orchestrates the reveal sequence on target found/lost
  show-avatar.js            # Animates the 3D model rising into frame
  show-media.js             # Shows the media panel; handles video playback and slide navigation
  show-cta.js               # Shows the CTA button and handles the click-through
  rounded-corner-plane.js   # Custom A-Frame component for rounded rectangle planes
assets/
  brainhack-target.mind   # Compiled image-target file used by MindAR
```

---

## How It Works

1. **Target detection** — MindAR loads the `.mind` file, which encodes feature points extracted from the poster image. When the camera feed matches those features, `targetFound` fires.
2. **Reveal sequence** — `scanned-target.js` listens for `targetFound` and triggers three sequential steps:
   - `showAvatar` slides the 3D GLB model forward along the Z-axis.
   - `showMedia` makes the media panel visible and wires up the navigation buttons.
   - `showCta` fades in the CTA image button.
3. **Cleanup** — When the target leaves the frame, `targetLost` fires, event listeners are removed, and all overlaid elements are hidden.

---

## Setup & Customisation

### 1. Clone and serve locally

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

Because the page accesses the camera, browsers require a **secure context (HTTPS or localhost)**. The simplest local server options are:

```bash
# Python 3
python -m http.server 8080

# Node.js (npx, no install needed)
npx serve .
```

Then open `https://localhost:8080` (or the port shown) in your mobile browser, or use a tunnelling tool like [ngrok](https://ngrok.com/) to expose it over HTTPS for real-device testing.

### 2. Replace the scan target (poster image)

The `.mind` file encodes the feature points of your target image. If you use a different poster you must recompile it.

1. Go to the **[MindAR Image Target Compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile)**.
2. Upload your new poster image and download the generated `.mind` file.
3. Place the file in `assets/` and update the `imageTargetSrc` attribute in `index.html`:

```html
<a-scene
  mindar-image="imageTargetSrc: assets/your-new-target.mind; ..."
```

### 3. Replace the 3D model

Swap out `avatarModel` in the `<a-assets>` block with your own `.glb` file:

```html
<a-asset-item id="avatarModel" src="assets/your-model.glb"></a-asset-item>
```

Adjust the `scale` and starting `position` on `<a-gltf-model>` to fit your model.

### 4. Replace images and video

All media assets are declared inside `<a-assets>`. Update the `src` attributes to point to your own files (local paths or CDN URLs):

```html
<img id="brainhack-banner" src="assets/your-banner.png" />
<video id="brainhack-video-mp4" src="assets/your-video.mp4"></video>
<!-- etc. -->
```

### 5. Change the CTA link

In `scripts/show-cta.js`, update the URL:

```js
const ctaTextClickHandler = () => {
  window.location.href = "https://your-event-website.com/";
};
```

---

## Deploying to GitHub Pages

1. Push the repository to GitHub.
2. Go to **Settings → Pages** in your repository.
3. Under *Build and deployment*, set the source to **Deploy from a branch** and select `main` (or `master`) / `/ (root)`.
4. GitHub Pages will publish the site at `https://<your-username>.github.io/<your-repo>/`.

> **Note:** GitHub Pages serves over HTTPS by default, which is required for camera access in browsers.

If your assets are large (videos, GLB files), consider hosting them on a CDN (e.g. Cloudflare R2, or a dedicated static host) and referencing them by URL to keep the repository size manageable.

---

## Browser Compatibility

| Platform | Recommended browser |
|----------|---------------------|
| iOS (iPhone / iPad) | Safari |
| Android | Chrome |
| Desktop | Chrome or Edge (for testing) |

Camera permissions must be granted when prompted. The experience is designed for portrait mode on mobile.

---

## Acknowledgements

- [MindAR.js](https://github.com/hiukim/mind-ar-js) by hiukim
- [A-Frame](https://github.com/aframevr/aframe) by the A-Frame community
- `rounded-corner-plane.js` adapted from [thedart76/chatgpt-aframe-rounded-corner-plane](https://github.com/thedart76/chatgpt-aframe-rounded-corner-plane)
