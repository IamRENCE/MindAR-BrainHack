const showCta = () => {
  const ctaButton = document.querySelector("#cta-button");

  let eventListeners = []; // Array to track added listeners for cleanup

  const removeListeners = () => {
    eventListeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });
    eventListeners = []; // Clear the list
  };

  setTimeout(() => {
    ctaButton.setAttribute("visible", true);
  }, 600);

  const ctaTextClickHandler = () => {
    console.log("CTA CLICKED");
    window.location.href = "https://www.dstabrainhack.com/";
  };
  ctaButton.addEventListener("click", ctaTextClickHandler);
  eventListeners.push({
    element: ctaButton,
    type: "click",
    handler: ctaTextClickHandler,
  });

  return removeListeners;
};
