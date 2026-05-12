import { useEffect, useMemo, useState } from "react";
import Particles from "@tsparticles/react";
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function AnimatedBackground() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  const options = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: "transparent" },
      particles: {
        number: { value: 24, density: { enable: true, area: 900 } },
        color: { value: ["#a78bfa", "#f472b6", "#7dd3fc", "#f9a8d4"] },
        shape: { type: "circle" },
        opacity: { value: { min: 0.08, max: 0.22 } },
        size: { value: { min: 12, max: 38 } },
        move: {
          enable: true,
          speed: 0.5,
          direction: "none",
          random: true,
          outModes: { default: "out" },
        },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: "repulse" },
          resize: { enable: true },
        },
        modes: {
          repulse: { distance: 70, duration: 0.3 },
        },
      },
      detectRetina: true,
    }),
    [],
  );

  if (!ready) return null;

  return (
    <Particles
      id="ambient-particles"
      className="pointer-events-none absolute inset-0 -z-10"
      options={options}
    />
  );
}
