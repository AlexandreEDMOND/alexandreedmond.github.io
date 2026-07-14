const revealItems = document.querySelectorAll("[data-reveal]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hero = document.querySelector(".hero");
const nameZone = document.querySelector("[data-name-zone]");
const heroArt = document.querySelector(".hero-art");
const heroObjects = document.querySelectorAll(".hero-object");
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

if (heroArt && heroObjects.length && !reducedMotion) {
  const objects = [...heroObjects].map((element, index) => ({
    element,
    index,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 0,
    dragging: false,
    pointerId: null,
    grabX: 0,
    grabY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0
  }));
  let arena = { left: 0, top: 0, width: 0, height: 0 };
  let lastFrame = 0;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const measureArena = () => {
    const bounds = heroArt.getBoundingClientRect();
    arena = { left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height };
    objects.forEach((object) => {
      object.radius = object.element.getBoundingClientRect().width / 2;
    });
  };
  const draw = (object) => {
    object.element.style.transform = `translate3d(${(object.x - object.radius).toFixed(1)}px, ${(object.y - object.radius).toFixed(1)}px, 0)`;
  };
  const keepInsideArena = (object) => {
    if (object.x - object.radius < 0) {
      object.x = object.radius;
      object.vx = Math.abs(object.vx) * .58;
      object.vy *= .72;
    }
    if (object.x + object.radius > arena.width) {
      object.x = arena.width - object.radius;
      object.vx = -Math.abs(object.vx) * .58;
      object.vy *= .72;
    }
    if (object.y - object.radius < 0) {
      object.y = object.radius;
      object.vy = Math.abs(object.vy) * .58;
      object.vx *= .72;
    }
    if (object.y + object.radius > arena.height) {
      object.y = arena.height - object.radius;
      object.vy = -Math.abs(object.vy) * .58;
      object.vx *= .72;
    }
  };
  const resolveCollision = (first, second) => {
    const dx = second.x - first.x;
    const dy = second.y - first.y;
    const distance = Math.hypot(dx, dy) || .001;
    const minimumDistance = first.radius + second.radius;

    if (distance >= minimumDistance) return;

    const nx = dx / distance;
    const ny = dy / distance;
    const overlap = minimumDistance - distance;
    const firstShare = first.dragging ? 0 : second.dragging ? 1 : .5;
    const secondShare = second.dragging ? 0 : first.dragging ? 1 : .5;
    first.x -= nx * overlap * firstShare;
    first.y -= ny * overlap * firstShare;
    second.x += nx * overlap * secondShare;
    second.y += ny * overlap * secondShare;

    const relativeVelocity = (second.vx - first.vx) * nx + (second.vy - first.vy) * ny;
    if (relativeVelocity >= 0) return;

    const impulse = -(1.48 * relativeVelocity) / 2;
    first.vx -= impulse * nx;
    first.vy -= impulse * ny;
    second.vx += impulse * nx;
    second.vy += impulse * ny;

    const tx = -ny;
    const ty = nx;
    const tangentVelocity = (second.vx - first.vx) * tx + (second.vy - first.vy) * ty;
    const friction = clamp(-tangentVelocity / 2, -Math.abs(impulse) * .38, Math.abs(impulse) * .38);
    first.vx -= friction * tx;
    first.vy -= friction * ty;
    second.vx += friction * tx;
    second.vy += friction * ty;
  };
  const resetObjects = () => {
    measureArena();
    objects.forEach((object) => {
      object.x = arena.width + object.radius + object.index * 28;
      object.y = clamp(arena.height * (.5 + (object.index - 1) * .24), object.radius, arena.height - object.radius);
      object.vx = -920 + object.index * 150;
      object.vy = (object.index - 1) * 310;
      draw(object);
    });
  };
  const animate = (time) => {
    const delta = Math.min((time - lastFrame) / 1000 || 0, .032);
    lastFrame = time;

    objects.forEach((object) => {
      if (!object.dragging) {
        object.x += object.vx * delta;
        object.y += object.vy * delta;
        const speed = Math.hypot(object.vx, object.vy);
        const drag = Math.min(speed * speed * .00055, 1200) * delta;
        if (speed > 0) {
          object.vx -= object.vx / speed * drag;
          object.vy -= object.vy / speed * drag;
        }
        keepInsideArena(object);
      }
    });
    objects.forEach((first, index) => {
      objects.slice(index + 1).forEach((second) => resolveCollision(first, second));
    });
    objects.forEach((object) => {
      keepInsideArena(object);
      draw(object);
    });
    requestAnimationFrame(animate);
  };

  objects.forEach((object) => {
    const moveDraggedObject = (event) => {
      if (!object.dragging || event.pointerId !== object.pointerId) return;

      const now = performance.now();
      const x = clamp(event.clientX - arena.left - object.grabX, object.radius, arena.width - object.radius);
      const y = clamp(event.clientY - arena.top - object.grabY, object.radius, arena.height - object.radius);
      const elapsed = Math.max((now - object.lastTime) / 1000, .001);

      object.vx = (x - object.lastX) / elapsed;
      object.vy = (y - object.lastY) / elapsed;
      object.x = x;
      object.y = y;
      object.lastX = x;
      object.lastY = y;
      object.lastTime = now;
    };
    const releaseObject = (event) => {
      if (event.pointerId !== object.pointerId) return;
      object.dragging = false;
      object.pointerId = null;
      object.element.classList.remove("is-dragging");
      object.element.releasePointerCapture(event.pointerId);
    };

    object.element.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      object.dragging = true;
      object.pointerId = event.pointerId;
      object.grabX = event.clientX - arena.left - object.x;
      object.grabY = event.clientY - arena.top - object.y;
      object.lastX = object.x;
      object.lastY = object.y;
      object.lastTime = performance.now();
      object.element.classList.add("is-dragging");
      object.element.setPointerCapture(event.pointerId);
    });
    object.element.addEventListener("pointermove", moveDraggedObject);
    object.element.addEventListener("pointerup", releaseObject);
    object.element.addEventListener("pointercancel", releaseObject);
  });

  requestAnimationFrame(() => {
    resetObjects();
    requestAnimationFrame(animate);
  });
  window.addEventListener("resize", () => {
    measureArena();
    objects.forEach((object) => {
      object.x = clamp(object.x, object.radius, arena.width - object.radius);
      object.y = clamp(object.y, object.radius, arena.height - object.radius);
    });
  });
}
