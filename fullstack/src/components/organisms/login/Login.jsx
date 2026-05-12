import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import logo1 from "../../../assets/logo1.png";
import { loginUser } from "../../../services/authService";
import { loginWithFakeStore } from "../../../services/fakeStoreAuth";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [useAPI, setUseAPI] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;

      if (useAPI) {
        // FakeStore API login - use username instead of email
        const username = formData.email.split('@')[0]; // Extract username from email
        result = await loginWithFakeStore(username, formData.password);
      } else {
        // Local auth
        result = await loginUser(formData.email, formData.password);
      }

      if (result.success) {
        navigate('/gallery');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen p-6 lg:ml-72"
    >
      <div className="w-full max-w-md rounded-3xl border border-white/20 backdrop-blur-xl p-10 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
        }}
      >
        {/* Header con Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center mb-12"
        >
          <div className="mb-6 relative h-20 w-20">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-fuchsia-400 to-pink-500 blur-xl opacity-70" />
            <img src={logo1} alt="Luxury Store Logo" className="relative h-full w-full rounded-2xl object-cover ring-2 ring-white/30 shadow-xl" />
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-white via-pink-100 to-fuchsia-200 bg-clip-text text-transparent mb-2">
            Luxury Store
          </h1>
          <p className="text-white/60 text-sm">Sign in to your account</p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-4 p-3 bg-red-500/20 border border-red-400/50 text-red-300 rounded-xl text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* API Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex items-center gap-3 p-3 rounded-lg bg-white/5"
        >
          <label className="flex items-center gap-2 cursor-pointer text-white/70 text-sm">
            <input
              type="checkbox"
              checked={useAPI}
              onChange={(e) => setUseAPI(e.target.checked)}
              className="w-4 h-4 rounded border-white/30"
            />
            Use FakeStore API
          </label>
        </motion.div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative group"
          >
            <label className="block text-white/70 text-sm mb-2 font-semibold group-focus-within:text-fuchsia-400 transition-colors">
              {useAPI ? 'Username' : 'Email'}
            </label>
            <input
              type={useAPI ? "text" : "email"}
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={useAPI ? "e.g. johnd" : "your@email.com"}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-fuchsia-400 focus:bg-white/15 transition-all"
              required
            />
          </motion.div>

          {/* Password Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="relative group"
          >
            <label className="block text-white/70 text-sm mb-2 font-semibold group-focus-within:text-fuchsia-400 transition-colors">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-fuchsia-400 focus:bg-white/15 transition-all"
              required
            />
          </motion.div>

          {useAPI && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg text-blue-300 text-xs"
            >
              💡 Tip: Try username <strong>johnd</strong> with password <strong>m38rmF$</strong>
            </motion.div>
          )}

          {/* Login Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-8 rounded-xl font-bold text-white transition-all duration-300 bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-fuchsia-500/30"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>

        {/* Register Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6 text-white/60 text-sm"
        >
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold transition-colors"
          >
            Sign up
          </button>
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Login;
