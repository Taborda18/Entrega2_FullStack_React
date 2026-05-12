import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerFullUser } from "../../../services/authService";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cellphone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validar contraseñas coinciden
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    /*
    // Validar email único
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const allUsers = [...MOCK_USERS, ...existingUsers];
    const emailExists = allUsers.some(user => user.email === formData.email);
    if (emailExists) {
      setError('El email ya está registrado.');
      return;
    }

    // Crear nuevo usuario
    const newUser = {
      id: Date.now(), // ID único basado en timestamp
      name: formData.name,
      email: formData.email,
      cellphone: formData.cellphone,
      address: formData.address,
      password: formData.password
    };

    // Guardar en localStorage
    existingUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

    // Navegar a login
    navigate('/login');
    */

    const respuesta = await registerFullUser(formData);

    if (respuesta.success) {
      navigate('/login');
    } else {
      setError(respuesta.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-purple-100 to-fuchsia-50 p-4">
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur rounded-2xl shadow-2xl border border-purple-100 overflow-hidden animate-slide-up">
        <div className="p-6 md:p-10">

          <header className="mb-8 text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Create Account</h2>
            <p className="text-gray-600 text-base mt-2">Join our community today</p>
          </header>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg animate-slide-down">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Left Column: Personal Information */}
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="form-input"
                    placeholder="John Doe"
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="form-input"
                    placeholder="john@example.com"
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label text-sm">Phone</label>
                    <input
                      type="tel"
                      name="cellphone"
                      className="form-input"
                      placeholder="+1 555..."
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label text-sm">Address</label>
                    <input
                      type="text"
                      name="address"
                      className="form-input"
                      placeholder="123 Main St..."
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Security */}
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    className="form-input"
                    placeholder="••••••••"
                    onChange={handleChange}
                  />
                  <p className="text-xs text-text-secondary mt-1">Min. 8 characters (letters & numbers)</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    className="form-input"
                    placeholder="••••••••"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 space-y-4">
              <button
                type="submit"
                className="form-btn w-full"
              >
                Create Account
              </button>

              <p className="text-center text-text-secondary">
                Already have an account? <Link to="/login" className="text-purple-600 font-semibold hover:text-purple-700">Sign in</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;