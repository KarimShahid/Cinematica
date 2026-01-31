import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, name);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-ink-200">
            <h1 className="font-serif text-3xl font-bold text-ink-900 mb-2 text-center">
              Create Account
            </h1>
            <p className="font-sans text-ink-500 text-center mb-8">
              Join Cinematica and start sharing reviews
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="font-sans text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-sans text-sm font-medium text-ink-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full font-sans px-4 py-2 rounded-lg border border-ink-300 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block font-sans text-sm font-medium text-ink-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full font-sans px-4 py-2 rounded-lg border border-ink-300 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block font-sans text-sm font-medium text-ink-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full font-sans px-4 py-2 rounded-lg border border-ink-300 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                  placeholder="••••••••"
                  required
                />
                <p className="font-sans text-xs text-ink-500 mt-1">
                  Must be at least 6 characters
                </p>
              </div>

              <div>
                <label className="block font-sans text-sm font-medium text-ink-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full font-sans px-4 py-2 rounded-lg border border-ink-300 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold-600 hover:bg-gold-700 disabled:bg-ink-300 text-white font-sans font-semibold py-2 rounded-lg transition-colors"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="font-sans text-ink-600 text-center mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-gold-600 hover:text-gold-700 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
