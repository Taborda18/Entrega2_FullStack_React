import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import smile from "../../../assets/smile.png";
import { loginUser } from "../../../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    /*
    // Obtener usuarios registrados
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const allUsers = [...MOCK_USERS, ...registeredUsers];

    // Buscar usuario
    const user = allUsers.find(u => u.email === formData.email && u.password === formData.password);
    if (user) {
      // Login exitoso
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      navigate('/gallery');
    } else {
      setError('Credenciales incorrectas.');
    }
      */
    const result = await loginUser(formData.email, formData.password);
    if (result.success) {
      navigate('/gallery');
    } else {
      setError(result.error);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-fuchsia-50 p-6">
      <div className="form-container">
        {/* Header con Icono */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4">
            <img src={smile} alt="Smile Icon" className="w-16 h-16 animate-bounce-in" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">Welcome!</h1>
          <p className="text-gray-600 text-base">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg animate-slide-down">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Input de Email */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="form-input"
              required
            />
          </div>

          {/* Input de Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="form-input"
              required
            />
          </div>

          {/* Opciones de Remember y Forgot */}
          <div className="flex items-center justify-between text-gray-600 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-purple-300"
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-purple-600 hover:text-purple-700 transition-colors">
              Forgot password?
            </a>
          </div>

          {/* Botón de Login */}
          <button
            type="submit"
            className="form-btn w-full"
          >
            Login
          </button>

        </form>

        {/* Link to Register */}
        <div className="mt-6 text-center text-gray-600">
          <p>Don't have an account? <a href="/register" className="text-purple-600 hover:text-purple-700 font-semibold">Register</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;