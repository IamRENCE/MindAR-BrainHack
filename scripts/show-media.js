const showMedia = (done) => {
  const media = document.querySelector("#media-panel");
  const mediaLeftButton = document.querySelector("#media-left-button");
  const mediaRightButton = document.querySelector("#media-right-button");
  const mediaPlayButton = document.querySelector("#media-play-button");
  const brainhackVideoPreview = document.querySelector(
    "#brainhack-video-preview-button"
  );
  const brainhackVideo = document.querySelector("#brainhack-video-link");

  let y = 0;
  let currentItem = 0;
  let playing = false;
  let videoToPlay = null;
  let eventListeners = []; // Array to track added listeners for cleanup

  const removeListeners = () => {
    eventListeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });
    eventListeners = []; // Clear the list
  };

  media.setAttribute("visible", true);

  const showMediaItem = (item) => {
    for (let i = 0; i <= 2; i++) {
      document
        .querySelector("#media-item" + i)
        .setAttribute("visible", i === item);
    }

    mediaPlayButton.setAttribute("visible", item == 0);
    if (videoToPlay) {
      // Stop video
      videoToPlay.pause(); // Pause the video
      videoToPlay.currentTime = 0; // Reset playback position to the start
      playing = false;
    }

    if (item == 0) {
      brainhackVideoPreview.setAttribute("visible", true);
      brainhackVideoPreview.classList.add("clickable");
      mediaPlayButton.classList.add("clickable");
    } else {
      brainhackVideoPreview.classList.remove("clickable");
      mediaPlayButton.classList.remove("clickable");
    }
  };

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
        console.log("VIDEO ENDED");
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
      console.log("PLAYING");
      videoToPlay.play();
    } else {
      console.log("PAUSING");
      videoToPlay.pause();
    }
    playing = !playing;
    mediaPlayButton.setAttribute("visible", !playing);
    brainhackVideoPreview.setAttribute("visible", false);
  };

  const id = setInterval(() => {
    y += 0.016;
    if (y >= 0.6) {
      clearInterval(id);
      mediaLeftButton.setAttribute("visible", true);
      mediaRightButton.setAttribute("visible", true);
      mediaPlayButton.setAttribute("visible", true);
      brainhackVideoPreview.setAttribute("visible", true);

      // Add listeners with cleanup tracking
      const leftClickHandler = () => {
        currentItem = (currentItem - 1) % 3;
        showMediaItem(currentItem);
      };
      mediaLeftButton.addEventListener("click", leftClickHandler);
      eventListeners.push({
        element: mediaLeftButton,
        type: "click",
        handler: leftClickHandler,
      });

      const rightClickHandler = () => {
        currentItem = (currentItem + 1 + 3) % 3;
        showMediaItem(currentItem);
      };
      mediaRightButton.addEventListener("click", rightClickHandler);
      eventListeners.push({
        element: mediaRightButton,
        type: "click",
        handler: rightClickHandler,
      });

      const previewClickHandler = () => {
        initializeAndPlayVideo();
      };
      brainhackVideoPreview.addEventListener("click", previewClickHandler);
      eventListeners.push({
        element: brainhackVideoPreview,
        type: "click",
        handler: previewClickHandler,
      });

      const playClickHandler = () => {
        initializeAndPlayVideo();
      };
      mediaPlayButton.addEventListener("click", playClickHandler);
      eventListeners.push({
        element: mediaPlayButton,
        type: "click",
        handler: playClickHandler,
      });

      setTimeout(() => {
        done();
      }, 500);
    }
    media.setAttribute("position", "0 " + y + " -0.01");
  }, 10);

  // Return cleanup function
  return removeListeners;
};
