// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
      <Link to="/items" style={{ marginRight: '15px' }}>Items</Link>
      <Link to="/items/new" style={{ marginRight: '15px' }}>Crear Item</Link>
      <Link to="/trades" style={{ marginRight: '15px' }}>Propuestas</Link>
      <Link to="/trades/new" style={{ marginRight: '15px' }}>Crear Propuesta</Link>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </nav>
  );
};

export default Navbar;
