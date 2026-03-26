AFRAME.registerComponent("scanned-target", {
  init: function () {
    let removeMediaListeners = null;
    let removeCtaListeners = null;

    const targetFoundListener = () => {
      console.log("[scanned-target] Target found");

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
      console.log("[scanned-target] Target lost");

      if (removeMediaListeners) {
        removeMediaListeners();
        removeMediaListeners = null;
      }
      if (removeCtaListeners) {
        removeCtaListeners();
        removeCtaListeners = null;
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
