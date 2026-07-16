const revealItems = document.querySelectorAll("[data-reveal]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hero = document.querySelector(".hero");
const lifeField = document.querySelector("[data-life-field]");
let pointerFrame;

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }),
    { threshold: 0.14 }
  );
  revealItems.forEach((item) => observer.observe(item));
}

if (!reducedMotion) {
  document.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      document.body.classList.add("is-fluid-active");
      document.body.style.setProperty("--cursor-x", `${event.clientX}px`);
      document.body.style.setProperty("--cursor-y", `${event.clientY}px`);
      pointerFrame = undefined;
    });
  });
}

if (hero && lifeField) {
  const context = lifeField.getContext("2d");
  const cells = Array.from({ length: 170 }, (_, index) => ({
    x: Math.random(),
    y: Math.random(),
    seed: Math.random() * Math.PI * 2,
    size: 1.2 + Math.random() * 2.7,
    hue: index % 7 === 0 ? 8 : index % 5 === 0 ? 218 : 52
  }));
  const colonies = Array.from({ length: 4 }, (_, index) => ({
    phase: index * Math.PI / 2,
    x: .2 + (index % 2) * .58,
    y: .24 + Math.floor(index / 2) * .5
  }));
  const pointer = { x: -.5, y: -.5, lastPulse: 0 };
  const pulses = [];
  let width = 0;
  let height = 0;
  let lastBloom = 0;

  const resize = () => {
    const bounds = hero.getBoundingClientRect();
    const density = Math.min(window.devicePixelRatio, 2);
    width = bounds.width;
    height = bounds.height;
    lifeField.width = Math.round(width * density);
    lifeField.height = Math.round(height * density);
    context.setTransform(density, 0, 0, density, 0, 0);
  };
  const position = (cell, time) => ({
    x: (cell.x + Math.sin(time * .00015 + cell.seed) * .08 + Math.sin(time * .00006 + cell.seed * 2.3) * .05) * width,
    y: (cell.y + Math.cos(time * .00013 + cell.seed * 1.4) * .07 + Math.sin(time * .00008 + cell.seed) * .06) * height
  });
  const vitality = (x, y, time) => colonies.reduce((strongest, colony) => {
    const centerX = (colony.x + Math.sin(time * .00011 + colony.phase) * .1) * width;
    const centerY = (colony.y + Math.cos(time * .00009 + colony.phase * 1.7) * .08) * height;
    const radius = 150 + Math.sin(time * .0008 + colony.phase) * 48;
    return Math.max(strongest, Math.max(0, 1 - Math.hypot(x - centerX, y - centerY) / radius));
  }, 0);
  const draw = (time) => {
    context.clearRect(0, 0, width, height);
    const points = cells.map((cell) => {
      const point = position(cell, time);
      return { cell, ...point, life: vitality(point.x, point.y, time) };
    });
    if (!reducedMotion && time - lastBloom > 2200) {
      const colony = colonies[Math.floor(time / 2200) % colonies.length];
      pulses.push({
        x: (colony.x + Math.sin(time * .00011 + colony.phase) * .1) * width,
        y: (colony.y + Math.cos(time * .00009 + colony.phase * 1.7) * .08) * height,
        time
      });
      lastBloom = time;
    }
    while (pulses.length && time - pulses[0].time >= 2600) pulses.shift();

    context.lineWidth = 1;
    for (let index = 0; index < points.length; index += 1) {
      for (let next = index + 1; next < points.length; next += 1) {
        const distance = Math.hypot(points[index].x - points[next].x, points[index].y - points[next].y);
        if (distance < 96) {
          const energy = (points[index].life + points[next].life) / 2;
          context.strokeStyle = `rgba(21,21,21,${(.018 + energy * .11 * (1 - distance / 96)).toFixed(3)})`;
          context.beginPath();
          context.moveTo(points[index].x, points[index].y);
          context.lineTo(points[next].x, points[next].y);
          context.stroke();
        }
      }
    }

    points.forEach(({ cell, x, y, life }) => {
      const response = Math.max(0, 1 - Math.hypot(x - pointer.x * width, y - pointer.y * height) / 180);
      const wave = pulses.reduce((value, pulse) => {
        const edge = Math.abs(Math.hypot(x - pulse.x, y - pulse.y) - (time - pulse.time) * .19);
        return Math.max(value, Math.max(0, 1 - edge / 42));
      }, 0);
      context.fillStyle = `hsla(${cell.hue}, 90%, 54%, ${(.11 + life * .52 + response * .32 + wave * .22).toFixed(2)})`;
      context.beginPath();
      context.arc(x, y, cell.size * (.72 + life * 1.55) + response * 3 + wave * 4, 0, Math.PI * 2);
      context.fill();
    });

    if (!reducedMotion) requestAnimationFrame(draw);
  };

  hero.addEventListener("pointermove", (event) => {
    const bounds = hero.getBoundingClientRect();
    pointer.x = (event.clientX - bounds.left) / bounds.width;
    pointer.y = (event.clientY - bounds.top) / bounds.height;
    if (event.timeStamp - pointer.lastPulse > 900) {
      pulses.push({ x: event.clientX - bounds.left, y: event.clientY - bounds.top, time: event.timeStamp });
      pointer.lastPulse = event.timeStamp;
    }
  });
  hero.addEventListener("pointerleave", () => { pointer.x = -.5; pointer.y = -.5; });
  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(draw);
}
