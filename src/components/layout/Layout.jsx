import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex overflow-hidden bg-canvas">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} desktopSidebarOpen={desktopSidebarOpen} />
      <div className={`flex flex-col w-0 flex-1 overflow-hidden transition-all duration-300 ${desktopSidebarOpen ? 'lg:pl-64' : 'lg:pl-0'}`}>
        <Header setSidebarOpen={setSidebarOpen} desktopSidebarOpen={desktopSidebarOpen} setDesktopSidebarOpen={setDesktopSidebarOpen} />
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
