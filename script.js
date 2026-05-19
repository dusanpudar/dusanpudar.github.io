document.getElementById("y").textContent = new Date().getFullYear();

tsParticles.load("particlesCanvas", {
  fpsLimit: 60,
  background: { color: "transparent" },
  particles: {
    number: { value: 55, density: { enable: true, area: 900 } },
    color: { value: ["#7c5cfc", "#a78bfa", "#c4b5fd", "#ffffff"] },
    shape: { type: "circle" },
    opacity: {
      value: { min: 0.08, max: 0.45 },
      animation: { enable: true, speed: 0.6, sync: false },
    },
    size: { value: { min: 1, max: 2.5 } },
    move: {
      enable: true,
      speed: 0.5,
      direction: "none",
      outModes: "out",
      random: true,
    },
    links: {
      enable: true,
      distance: 140,
      color: "#7c5cfc",
      opacity: 0.08,
      width: 1,
    },
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: "grab" },
      onClick: { enable: true, mode: "push" },
    },
    modes: {
      grab: { distance: 150, links: { opacity: 0.25, color: "#a78bfa" } },
      push: { quantity: 3 },
    },
  },
  detectRetina: true,
});
