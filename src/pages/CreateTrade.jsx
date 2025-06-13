// src/pages/CreateTrade.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CreateTrade = () => {
  const [items, setItems] = useState([]);
  const [itemOffered, setItemOffered] = useState('');
  const [itemRequested, setItemRequested] = useState('');
  const [toUser, setToUser] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    // Traer todos los items para que el usuario elija qué ofrece y qué pide
    axios.get('/api/items', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setItems(res.data))
      .catch(() => setMessage('Error al cargar items'));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/trades', {
        itemOffered,
        itemRequested,
        toUser,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Propuesta creada correctamente');
      setItemOffered('');
      setItemRequested('');
      setToUser('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error al crear propuesta');
    }
  };

  return (
    <div>
      <h2>Crear Propuesta de Trueque</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Item que ofreces:
          <select value={itemOffered} onChange={e => setItemOffered(e.target.value)} required>
            <option value="">Selecciona un item</option>
            {items.map(item => (
              <option key={item._id} value={item._id}>{item.title}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Item que deseas:
          <select value={itemRequested} onChange={e => setItemRequested(e.target.value)} required>
            <option value="">Selecciona un item</option>
            {items.map(item => (
              <option key={item._id} value={item._id}>{item.title}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Usuario destino (ID):
          <input
            type="text"
            value={toUser}
            onChange={e => setToUser(e.target.value)}
            placeholder="ID usuario a quien le haces la propuesta"
            required
          />
        </label>
        <br />
        <button type="submit">Enviar propuesta</button>
      </form>
    </div>
  );
};

export default CreateTrade;
