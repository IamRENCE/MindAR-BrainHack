const showAvatar = (onDone) => {
  const avatar = document.querySelector("#avatar");
  let z = -0.5;
  const id = setInterval(() => {
    z += 0.008;
    if (z >= 0.5) {
      clearInterval(id);
      onDone();
    }
    avatar.setAttribute("position", "0 0 " + z);
  }, 10);
};
