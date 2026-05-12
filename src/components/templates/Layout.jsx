import { Outlet } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import NavBar from '../organisms/NavBar/NavBar';

export default function Layout() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const particlesOptions = useMemo(() => ({
    fullScreen: { enable: true, zIndex: 0 },
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    particles: {
      number: { value: 40, density: { enable: true, area: 800 } },
      color: { value: ["#9333ea", "#d946ef", "#ec4899", "#7e22ce", "#a855f7"] },
      shape: { type: "circle" },
      opacity: {
        value: { min: 0.1, max: 0.3 },
        animation: { enable: true, speed: 0.3, startValue: "random", sync: false }
      },
      size: {
        value: { min: 8, max: 55 },
        animation: { enable: true, speed: 1.5, startValue: "random", sync: false }
      },
      move: {
        enable: true,
        speed: { min: 0.3, max: 1 },
        direction: "none",
        random: true,
        straight: false,
        outModes: { default: "out" }
      }
    },
    detectRetina: true
  }), []);

  return (
    <>
      {init && <Particles id="tsparticles" options={particlesOptions} />}

      <NavBar />

      <div className="min-h-screen lg:ml-64 relative z-10">
        <main className="flex-1 w-full p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </>
  );
}
