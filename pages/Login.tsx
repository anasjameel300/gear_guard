import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/'); // Redirect to dashboard on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to manage assets"
    >
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Helper for Demo Credentials */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-semibold mb-1">Demo Credentials:</p>
            <div className="space-y-1">
              <p className="flex items-center">
                <span className="w-20 text-blue-500/80 text-xs uppercase tracking-wider font-semibold">Email:</span>
                <span className="font-mono font-medium select-all">anas@gearguard.com</span>
              </p>
              <p className="flex items-center">
                <span className="w-20 text-blue-500/80 text-xs uppercase tracking-wider font-semibold">Password:</span>
                <span className="font-mono font-medium select-all">password123</span>
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2 text-red-700 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Input
          id="email"
          type="email"
          label="Email Address"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="h-5 w-5" />}
          required
        />

        <div className="space-y-1">
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="h-5 w-5" />}
            required
          />
          <div className="flex justify-end">
            <button type="button" className="text-xs font-medium text-brand-600 hover:text-brand-700">
              Forgot password?
            </button>
          </div>
        </div>

        <Button type="submit" isLoading={loading} className="w-full">
          Sign In
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
          </div>
        </div>

        <div className="text-center">
          <Link to="/signup" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            Create an account
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};