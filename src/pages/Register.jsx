// src/pages/Register.jsx
import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/auth/register', formData);
      login(res.data.user, res.data.token);
      navigate('/items');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <div>
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
        />
        <br />
        <input
          type="text"
          name="location"
          placeholder="Ubicación (opcional)"
          value={formData.location}
          onChange={handleChange}
        />
        <br />
        <button type="submit">Registrar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        ¿Ya tenés cuenta? <Link to="/login">Iniciar Sesión</Link>
      </p>
    </div>
  );
};

export default Register;
