const showMedia = (done) => {
  const media = document.querySelector("#media-panel");
  const mediaPlayButton = document.querySelector("#media-play-button");
  const brainhackVideoPreview = document.querySelector(
    "#brainhack-video-preview-button"
  );
  const brainhackVideo = document.querySelector("#brainhack-video-link");

  let y = 0;
  let playing = false;
  let videoToPlay = null;
  let animationId = null;
  let eventListeners = [];

  const removeListeners = () => {
    // Stop animation interval if still running
    if (animationId !== null) {
      clearInterval(animationId);
      animationId = null;
    }
    // Always pause the underlying video elements directly
    const videoMp4 = document.querySelector("#brainhack-video-mp4");
    const videoWebm = document.querySelector("#brainhack-video-webm");
    if (videoMp4 && !videoMp4.paused) videoMp4.pause();
    if (videoWebm && !videoWebm.paused) videoWebm.pause();
    playing = false;
    mediaPlayButton.setAttribute("visible", true);
    brainhackVideoPreview.setAttribute("visible", true);
    eventListeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });
    eventListeners = [];
  };

  media.setAttribute("visible", true);

  const initializeAndPlayVideo = () => {
    if (!videoToPlay) {
      const testVideo = document.createElement("video");
      const canplayWebm = testVideo.canPlayType(
        'video/webm; codecs="vp8, vorbis"'
      );

      if (canplayWebm === "") {
        brainhackVideo.setAttribute("src", "#brainhack-video-mp4");
        videoToPlay = document.querySelector("#brainhack-video-mp4");
      } else {
        brainhackVideo.setAttribute("src", "#brainhack-video-webm");
        videoToPlay = document.querySelector("#brainhack-video-webm");
      }

      const onVideoEnded = () => {
        playing = false;
        console.log("[show-media] Video ended");
        mediaPlayButton.setAttribute("visible", true);
        brainhackVideoPreview.setAttribute("visible", true);
      };

      videoToPlay.addEventListener("ended", onVideoEnded);
      eventListeners.push({
        element: videoToPlay,
        type: "ended",
        handler: onVideoEnded,
      });
    }

    if (!playing) {
      console.log("[show-media] Playing video");
      videoToPlay.play();
    } else {
      console.log("[show-media] Pausing video");
      videoToPlay.pause();
    }
    playing = !playing;
    mediaPlayButton.setAttribute("visible", !playing);
    brainhackVideoPreview.setAttribute("visible", false);
  };

  animationId = setInterval(() => {
    y += 0.016;
    if (y >= 0.6) {
      clearInterval(animationId);
      animationId = null;
      mediaPlayButton.setAttribute("visible", true);
      brainhackVideoPreview.setAttribute("visible", true);

      // THREE.js canvas raycasting — bypasses A-Frame cursor/raycaster
      const scene = document.querySelector("a-scene");
      const raycaster = new THREE.Raycaster();

      const canvasClickHandler = (evt) => {
        const canvas = scene.canvas;
        const rect = canvas.getBoundingClientRect();
        const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
        const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
        const mouse = new THREE.Vector2(
          ((clientX - rect.left) / rect.width) * 2 - 1,
          -((clientY - rect.top) / rect.height) * 2 + 1
        );
        raycaster.setFromCamera(mouse, scene.camera);

        // Collect meshes from all interactive elements — preview, play button, and video all trigger the same action
        const interactiveMeshes = [];
        [brainhackVideoPreview, mediaPlayButton, brainhackVideo].forEach((el) => {
          el.object3D.traverse((node) => {
            if (node.isMesh) interactiveMeshes.push(node);
          });
        });
        if (raycaster.intersectObjects(interactiveMeshes).length > 0) {
          console.log("[show-media] Video area tapped");
          initializeAndPlayVideo();
        }
      };

      scene.canvas.addEventListener("click", canvasClickHandler);
      eventListeners.push({
        element: scene.canvas,
        type: "click",
        handler: canvasClickHandler,
      });

      setTimeout(() => {
        done();
      }, 500);
    }
    media.setAttribute("position", "0 " + y + " -0.01");
  }, 10);

  return removeListeners;
};
