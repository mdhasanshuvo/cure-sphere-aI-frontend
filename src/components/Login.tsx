import { useState } from 'react';
import { Mail, Lock, AlertCircle, Loader2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Page } from '../App';

interface LoginProps {
  onNavigate: (page: Page) => void;
}

export function Login({ onNavigate }: LoginProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState<'patient' | 'doctor' | 'admin'>('patient');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password, userRole);
      if (success) {
        onNavigate('dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-320px)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Login to access your health dashboard</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-3 font-semibold text-sm">Login As *</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setUserRole('patient')}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  userRole === 'patient'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-blue-300'
                }`}
              >
                <User className="w-5 h-5 mx-auto mb-1" />
                <p className="text-xs font-medium">Patient</p>
              </button>
              <button
                type="button"
                onClick={() => setUserRole('doctor')}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  userRole === 'doctor'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-blue-300'
                }`}
              >
                <User className="w-5 h-5 mx-auto mb-1" />
                <p className="text-xs font-medium">Doctor</p>
              </button>
              <button
                type="button"
                onClick={() => setUserRole('admin')}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  userRole === 'admin'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-blue-300'
                }`}
              >
                <User className="w-5 h-5 mx-auto mb-1" />
                <p className="text-xs font-medium">Admin</p>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span className="text-gray-700">Remember me</span>
              </label>
              <button type="button" className="text-blue-600 hover:text-blue-700">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => onNavigate('signup')}
                className="text-blue-600 hover:text-blue-700"
              >
                Sign up now
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
