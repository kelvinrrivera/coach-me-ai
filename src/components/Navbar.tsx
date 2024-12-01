import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-gray-900/50 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold">Coach-me.ai</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/goals">Goals</NavLink>
                <NavLink to="/settings">Settings</NavLink>
                <button
                  onClick={signOut}
                  className="px-4 py-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <Link
                  to="/signup"
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition-opacity"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 py-2 space-y-2">
          {user ? (
            <>
              <MobileNavLink to="/dashboard">Dashboard</MobileNavLink>
              <MobileNavLink to="/goals">Goals</MobileNavLink>
              <MobileNavLink to="/settings">Settings</MobileNavLink>
              <button
                onClick={signOut}
                className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <MobileNavLink to="/login">Login</MobileNavLink>
              <MobileNavLink to="/signup">Get Started</MobileNavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-gray-300 hover:text-white transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg"
    >
      {children}
    </Link>
  );
}

export default Navbar;