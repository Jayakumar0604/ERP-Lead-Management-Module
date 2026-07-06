import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Settings } from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen, desktopSidebarOpen }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const NavLinks = () => (
    <nav className="flex-1 px-4 py-8 space-y-4">
      {navigation.map((item) => {
        const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => setSidebarOpen && setSidebarOpen(false)}
            className={`
              group flex items-center px-4 py-3 text-sm font-mono font-bold uppercase tracking-wider rounded-none border-2 transition-all
              ${isActive 
                ? 'bg-black text-white border-black ledger-shadow-sm' 
                : 'bg-white text-black border-transparent hover:border-black hover:bg-slate-50'}
            `}
          >
            <Icon
              className={`
                mr-4 flex-shrink-0 h-5 w-5
                ${isActive ? 'text-white' : 'text-black group-hover:text-black'}
              `}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div 
            className="fixed inset-0 bg-slate-900 opacity-75" 
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white border-r-4 border-black">
            <div className="flex items-center justify-between h-20 flex-shrink-0 px-6 border-b-4 border-black bg-primary-600">
              <span className="text-2xl font-serif font-black text-white uppercase tracking-tighter">Ledger.</span>
              <button
                type="button"
                className="flex items-center justify-center h-8 w-8 border-2 border-white bg-transparent focus:outline-none hover:bg-white group transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <span className="text-white group-hover:text-primary-600 font-bold font-mono">X</span>
              </button>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <NavLinks />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 z-20 transition-all duration-300 ${desktopSidebarOpen ? 'lg:w-64' : 'lg:w-0 overflow-hidden'}`}>
        <div className={`flex-1 flex flex-col min-h-0 bg-white ${desktopSidebarOpen ? 'border-r-4' : 'border-r-0'} border-black w-64`}>
          <div className="flex items-center h-20 flex-shrink-0 px-6 border-b-4 border-black bg-primary-600">
            <span className="text-2xl font-serif font-black text-white uppercase tracking-tighter">Ledger.</span>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <NavLinks />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
