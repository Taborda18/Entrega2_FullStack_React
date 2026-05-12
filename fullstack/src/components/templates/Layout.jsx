import { Outlet } from 'react-router-dom';
import NavBar from '../organisms/NavBar/NavBar';
import AnimatedBackground from '../atoms/AnimatedBackground';

export default function Layout() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <AnimatedBackground />
      <div className="ambient-blob ambient-blob--one pointer-events-none -z-10" />
      <div className="ambient-blob ambient-blob--two pointer-events-none -z-10" />
      <div className="ambient-blob ambient-blob--three pointer-events-none -z-10" />
      <NavBar />
      <main className="relative z-10 flex-1 w-full">
        <Outlet />
      </main>
    </div>
  );
}
