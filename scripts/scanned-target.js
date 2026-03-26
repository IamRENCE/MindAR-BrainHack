AFRAME.registerComponent("scanned-target", {
  init: function () {
    let removeMediaListeners = null;
    let removeCtaListeners = null;

    const targetFoundListener = () => {
      console.log("Target found");

      showAvatar(() => {
        setTimeout(() => {
          removeMediaListeners = showMedia(() => {
            setTimeout(() => {
              removeCtaListeners = showCta();
            }, 300);
          });
        }, 300);
      });
    };

    const targetLostListener = () => {
      console.log("Target lost");

      // Clean up listeners
      if (removeMediaListeners) {
        removeMediaListeners(); // Call the cleanup function
        removeMediaListeners = null; // Reset cleanup function reference
      }
      if (removeCtaListeners) {
        removeCtaListeners(); // Call the cleanup function
        removeCtaListeners = null; // Reset cleanup function reference
      }

      const media = document.querySelector("#media-panel");
      media.setAttribute("visible", "false");
      media.setAttribute("position", "0 0 -0.01");

      const ctaButton = document.querySelector("#cta-button");
      ctaButton.setAttribute("visible", "false");
    };

    this.el.addEventListener("targetFound", targetFoundListener);
    this.el.addEventListener("targetLost", targetLostListener);
  },
});
