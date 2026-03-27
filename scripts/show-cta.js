const showCta = () => {
  const ctaButton = document.querySelector("#cta-button");

  let eventListeners = [];

  const removeListeners = () => {
    eventListeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });
    eventListeners = [];
  };

  setTimeout(() => {
    ctaButton.setAttribute("visible", true);
    ctaButton.emit("fadeIn");
  }, 600);

  // THREE.js canvas raycasting — bypasses A-Frame cursor/raycaster
  const scene = document.querySelector("a-scene");
  const raycaster = new THREE.Raycaster();

  const ctaCanvasClickHandler = (evt) => {
    const canvas = scene.canvas;
    const rect = canvas.getBoundingClientRect();
    const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
    const mouse = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );
    raycaster.setFromCamera(mouse, scene.camera);

    const ctaMeshes = [];
    ctaButton.object3D.traverse((node) => {
      if (node.isMesh) ctaMeshes.push(node);
    });
    if (raycaster.intersectObjects(ctaMeshes).length > 0) {
      console.log("[show-cta] CTA tapped");
      window.location.href = "https://www.dsta.gov.sg/brainhack";
    }
  };

  scene.canvas.addEventListener("click", ctaCanvasClickHandler);
  eventListeners.push({
    element: scene.canvas,
    type: "click",
    handler: ctaCanvasClickHandler,
  });

  return removeListeners;
};
