import { useNavigate } from 'react-router-dom';
import { Bell, Menu, UserSquare2 } from 'lucide-react';

const Header = ({ setSidebarOpen, desktopSidebarOpen, setDesktopSidebarOpen }) => {
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-10 flex-shrink-0 flex h-20 bg-white border-b-4 border-black">
      <button
        type="button"
        className="px-6 border-r-4 border-black text-black focus:outline-none lg:hidden hover:bg-slate-100"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-8 w-8" aria-hidden="true" />
      </button>
      
      <button
        type="button"
        className="hidden lg:block px-6 border-r-4 border-black text-black focus:outline-none hover:bg-slate-100 transition-colors"
        onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
      >
        <span className="sr-only">Toggle sidebar</span>
        <Menu className="h-8 w-8" aria-hidden="true" />
      </button>

      <div className="flex-1 px-8 flex justify-between items-center">
        <div className="flex-1 flex items-center">
          <h1 className="text-2xl font-serif font-bold text-black hidden sm:block tracking-tight">Command Center</h1>
        </div>
        <div className="ml-4 flex items-center md:ml-6 space-x-6">
          <button
            type="button"
            className="bg-white p-2 border-2 border-black rounded-none text-black hover:bg-black hover:text-white transition-colors focus:outline-none ledger-shadow-sm"
            onClick={() => navigate('/settings')}
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
          </button>
          
          <div className="relative">
            <button
              className="bg-white p-1 border-2 border-black text-black hover:bg-black hover:text-white transition-colors ledger-shadow-sm focus:outline-none"
              id="user-menu-button"
              onClick={() => navigate('/settings')}
            >
              <span className="sr-only">Open user menu</span>
              <UserSquare2 className="h-7 w-7" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
