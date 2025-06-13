import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CreateTradePage = () => {
  const [myItems, setMyItems] = useState([]);
  const [otherItems, setOtherItems] = useState([]);
  const [selectedOffered, setSelectedOffered] = useState('');
  const [selectedRequested, setSelectedRequested] = useState('');
  const [toUser, setToUser] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get('/api/items', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userId = JSON.parse(atob(token.split('.')[1])).id;

        const mine = res.data.filter((item) => item.createdBy._id === userId);
        const others = res.data.filter((item) => item.createdBy._id !== userId);

        setMyItems(mine);
        setOtherItems(others);
      } catch (err) {
        console.error('Error al cargar items', err);
      }
    };

    fetchItems();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOffered || !selectedRequested || !toUser) {
      setMessage('Por favor seleccioná ambos objetos');
      return;
    }

    try {
      const res = await axios.post(
        '/api/trades',
        {
          itemOffered: selectedOffered,
          itemRequested: selectedRequested,
          toUser: toUser,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Propuesta enviada con éxito ✅');
      setSelectedOffered('');
      setSelectedRequested('');
      setToUser('');
    } catch (err) {
      console.error(err);
      setMessage('Error al enviar propuesta');
    }
  };

  const handleRequestedChange = (e) => {
    const itemId = e.target.value;
    const item = otherItems.find((i) => i._id === itemId);
    setSelectedRequested(itemId);
    setToUser(item?.createdBy._id || '');
  };

  return (
    <div>
      <h2>Crear Propuesta de Trueque</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Tu objeto ofrecido:</label>
          <select
            value={selectedOffered}
            onChange={(e) => setSelectedOffered(e.target.value)}
          >
            <option value="">-- Seleccionar --</option>
            {myItems.map((item) => (
              <option key={item._id} value={item._id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Objeto que querés:</label>
          <select value={selectedRequested} onChange={handleRequestedChange}>
            <option value="">-- Seleccionar --</option>
            {otherItems.map((item) => (
              <option key={item._id} value={item._id}>
                {item.title} (de {item.createdBy.name})
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Enviar propuesta</button>
      </form>
    </div>
  );
};

export default CreateTradePage;
