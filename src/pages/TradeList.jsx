import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../api/axiosConfig';

const TradesList = () => {
  const { token } = useContext(AuthContext);
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const res = await api.get('/trades', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrades(res.data);
      } catch (err) {
        console.error('Error al obtener los trueques:', err);
      }
    };

    fetchTrades();
  }, [token]);

  return (
    <div>
      <h2>Mis Trueques</h2>
      <ul>
        {trades.map((trade) => (
          <li key={trade._id}>
            {trade.offeredItem.title} por {trade.requestedItem.title} - Estado: {trade.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TradesList;
