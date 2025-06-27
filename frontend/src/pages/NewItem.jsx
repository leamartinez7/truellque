// src/pages/NewItem.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const NewItem = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    uso: '',
    price: '',
    location: '',
    currency: 'ARS', 
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.price && form.price < 0) {
      return setError('El precio no puede ser negativo');
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await api.post('/items', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Ítem creado correctamente');
      setTimeout(() => navigate('/items'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el ítem');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-teal-700 mb-6">
          Crear nuevo ítem
        </h2>

        {message && (
          <p className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-sm text-center">
            {message}
          </p>
        )}
        {error && (
          <p className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Título del ítem"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />

          <textarea
            name="description"
            placeholder="Descripción"
            value={form.description}
            onChange={handleChange}
            required
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded"
          >
            <option value="">Seleccionar categoría</option>
            <option value="Tecnología">Tecnología</option>
            <option value="Ropa">Ropa</option>
            <option value="Hogar">Hogar</option>
            <option value="Libros">Libros</option>
            <option value="Deportes">Deportes</option>
            <option value="Otros">Otros</option>
          </select>

          <select
            name="uso"
            value={form.uso}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded"
          >
            <option value="">Condición del ítem</option>
            <option value="Nuevo">Nuevo</option>
            <option value="Usado - como nuevo">Usado - como nuevo</option>
            <option value="Usado">Usado</option>
            <option value="Para repuesto">Para repuesto</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />

          <div className="flex gap-2">
            <input
              type="number"
              name="price"
              placeholder="Precio estimado"
              value={form.price}
              onChange={handleChange}
              min="0"
              className="flex-1 px-4 py-2 border border-gray-300 rounded"
            />
            <select
              name="currency"
              value={form.currency}
              onChange={handleChange}
              className="w-28 px-2 py-2 border border-gray-300 rounded"
            >
              <option value="ARS">$ ARS</option>
              <option value="USD">USD</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition"
          >
            Crear ítem
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewItem;
