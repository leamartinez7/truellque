import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-teal-600 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          className="text-white text-2xl font-bold tracking-wide cursor-pointer select-none"
        >
          Truellque
        </div>

        {/* Links */}
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <Link to="/items" className="text-white px-3 py-2 rounded hover:bg-teal-700 transition">
            Items
          </Link>
          <Link to="/items/new" className="text-white px-3 py-2 rounded hover:bg-teal-700 transition">
            Crear Item
          </Link>
          <Link to="/trades" className="text-white px-3 py-2 rounded hover:bg-teal-700 transition">
            Propuestas
          </Link>
        </div>

        {/* Usuario + Logout o Login/Register */}
        <div className="flex items-center space-x-3 mt-2 sm:mt-0">
          {user ? (
            <>
              <span className="text-white text-sm flex items-center gap-1">
                <span className="text-lg">👤</span>
                <span className="font-medium">{user.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-white text-teal-800 font-semibold px-4 py-1 rounded hover:bg-teal-100 transition"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-white text-teal-800 font-semibold px-4 py-1 rounded hover:bg-teal-100 transition"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="bg-white text-teal-800 font-semibold px-4 py-1 rounded hover:bg-teal-100 transition"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
