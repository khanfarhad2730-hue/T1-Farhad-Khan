import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const { login, traditionalLogin, devLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSuccess = async (credentialResponse: any) => {
    try {
      await login(credentialResponse.credential);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  const handleTraditionalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setIsSubmitting(true);
    try {
      await traditionalLogin({ email, password });
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDevLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail) {
      toast.error('Please enter an admin email');
      return;
    }

    try {
      await devLogin(adminEmail);
      toast.success('Admin Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Admin Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary-600/10 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-secondary-600/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md bg-surface-800/50 backdrop-blur-xl border border-surface-700/50 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg transform rotate-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white -rotate-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-surface-400">Sign in to continue to Quiz Portal</p>
        </div>

        <form onSubmit={handleTraditionalLogin} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-900/50 border border-surface-700 text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-900/50 border border-surface-700 text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="relative flex items-center mb-6">
          <div className="flex-grow border-t border-surface-700"></div>
          <span className="flex-shrink-0 mx-4 text-surface-500 text-xs uppercase tracking-wider font-semibold">Or continue with</span>
          <div className="flex-grow border-t border-surface-700"></div>
        </div>

        {/* Google Login Button */}
        <div className="flex flex-col items-center gap-4">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => toast.error('Google login failed')}
            theme="filled_black"
            shape="pill"
            size="large"
            width="300"
          />
          
          {import.meta.env.DEV && !showAdminPrompt && (
            <button
              onClick={() => setShowAdminPrompt(true)}
              type="button"
              className="px-6 py-2 rounded-full border border-primary-500/50 text-primary-400 text-sm font-medium hover:bg-primary-500/10 transition-colors w-full max-w-[300px] cursor-pointer"
            >
              Admin Login
            </button>
          )}

          {import.meta.env.DEV && showAdminPrompt && (
            <form onSubmit={handleDevLogin} className="w-full max-w-[300px] flex flex-col gap-2 mt-2 animation-fade-in text-left">
              <label className="text-xs text-primary-300 font-medium px-1">Admin Email Verification</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@example.com"
                  autoFocus
                  required
                  className="flex-grow px-4 py-2 text-sm rounded-xl bg-surface-900/80 border border-primary-500/30 text-white placeholder-surface-500 focus:outline-none focus:border-primary-500 transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-colors"
                >
                  Go
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminPrompt(false)}
                className="text-xs text-surface-400 hover:text-white text-center mt-1 outline-none"
              >
                Cancel
              </button>
            </form>
          )}
        </div>

        <p className="text-sm text-surface-400 text-center mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
