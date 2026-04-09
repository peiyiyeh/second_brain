import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex h-screen w-full bg-[#1a1a1a] text-[#e5e5e5]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto w-full">
        {/* Container with max-width to keep content readable */}
        <div className="max-w-5xl mx-auto p-4 md:p-12 w-full min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
