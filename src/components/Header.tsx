import { Stethoscope, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Page } from '../App';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    onNavigate('home');
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <Stethoscope className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900">CureSphere AI</h1>
              <p className="text-gray-500">Virtual Healthcare System</p>
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-gray-900 font-semibold text-sm sm:text-base">{user.name}</p>
                    <p className="text-gray-500 text-xs hidden sm:block">{user.bloodGroup}</p>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-gray-900">{user.name}</p>
                      <p className="text-gray-600">{user.email}</p>
                      <p className="text-gray-500">Blood Group: {user.bloodGroup}</p>
                    </div>
                    <button
                      onClick={() => {
                        onNavigate('profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <User className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">My Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('dashboard');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <Stethoscope className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">My Dashboard</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center space-x-2 border-t border-gray-200"
                    >
                      <LogOut className="w-5 h-5 text-red-600" />
                      <span className="text-red-600">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-6 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
