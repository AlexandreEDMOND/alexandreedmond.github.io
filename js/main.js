const revealItems = document.querySelectorAll("[data-reveal]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hero = document.querySelector(".hero");
const nameZone = document.querySelector("[data-name-zone]");
const modelViewers = document.querySelectorAll(".hero-object model-viewer");
let pointerFrame;

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

if (hero && nameZone && !reducedMotion) {
  nameZone.addEventListener("pointerenter", () => hero.classList.add("is-name-active"));
  nameZone.addEventListener("pointerleave", () => {
    hero.classList.remove("is-name-active");
  });

  document.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || pointerFrame) return;

    pointerFrame = requestAnimationFrame(() => {
      const x = (event.clientX / window.innerWidth - .5) * 2;
      const y = (event.clientY / window.innerHeight - .5) * 2;

      document.body.classList.add("is-fluid-active");
      document.body.style.setProperty("--cursor-x", `${event.clientX}px`);
      document.body.style.setProperty("--cursor-y", `${event.clientY}px`);
      hero.style.setProperty("--pointer-shift-x", `${(x * 7).toFixed(1)}px`);
      hero.style.setProperty("--pointer-shift-y", `${(y * 7).toFixed(1)}px`);
      hero.style.setProperty("--pointer-rotate-x", `${(y * -11).toFixed(1)}deg`);
      hero.style.setProperty("--pointer-rotate-y", `${(x * 14).toFixed(1)}deg`);
      pointerFrame = undefined;
    });
  });
}

if (!reducedMotion) {
  modelViewers.forEach((modelViewer) => {
    const object = modelViewer.parentElement;
    const azimuth = Number(modelViewer.dataset.azimuth);
    const polar = Number(modelViewer.dataset.polar);
    const radius = Number(modelViewer.dataset.radius);
    const speed = Number(modelViewer.dataset.speed);

    const resetModel = () => {
      object.classList.remove("is-object-active");
      modelViewer.setAttribute("camera-orbit", `${azimuth}deg ${polar}deg ${radius}%`);
      modelViewer.setAttribute("rotation-per-second", `${speed}deg`);
    };

    object.addEventListener("pointerenter", () => object.classList.add("is-object-active"));
    object.addEventListener("pointerleave", resetModel);
    object.addEventListener("pointermove", (event) => {
      const bounds = object.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
      const y = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
      const boostedSpeed = speed + Math.sign(speed || 1) * 13;

      modelViewer.setAttribute("camera-orbit", `${(azimuth + x * 20).toFixed(1)}deg ${(polar - y * 14).toFixed(1)}deg ${radius}%`);
      modelViewer.setAttribute("rotation-per-second", `${boostedSpeed}deg`);
    });
  });
}
