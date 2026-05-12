import { Outlet } from 'react-router-dom';
import NavBar from '../organisms/NavBar/NavBar';
import AnimatedBackground from '../atoms/AnimatedBackground';

export default function Layout() {
  return (
    <div className="relative min-h-screen flex overflow-hidden">
      <AnimatedBackground />
      <div className="ambient-blob ambient-blob--one pointer-events-none -z-10" />
      <div className="ambient-blob ambient-blob--two pointer-events-none -z-10" />
      <div className="ambient-blob ambient-blob--three pointer-events-none -z-10" />
      
      {/* Sidebar Navigation */}
      <NavBar />
      
      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full lg:ml-72 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
