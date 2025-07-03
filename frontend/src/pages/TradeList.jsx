// src/pages/TradeList.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import AuthContext from '../context/AuthContext';

const TradeList = () => {
  const { user } = useContext(AuthContext);
  const [trades, setTrades] = useState([]);
  const [activeTab, setActiveTab] = useState('received');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  /* ─────────────────────────────────────────────
     Solo llamamos a la API si el usuario existe  */
  useEffect(() => {
    if (!user) return;  

    const fetchTrades = async () => {
      try {
        const res = await api.get('/trades');
        setTrades(res.data);
      } catch (err) {
        console.error('Error al cargar trades:', err);
        setError(true);
      }
    };

    fetchTrades();
  }, [user]);            

  /* ──────────────────────────────
     Vista cuando no hay sesión    */
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-center text-gray-700">
          🔐 Debes iniciar sesión para ver tus propuestas de trueque.
        </p>
      </div>
    );
  }

  /* ──────────────────────────────
     Filtrado de propuestas        */
  const filteredTrades = trades.filter((trade) => {
    if (!trade.toUser || !trade.fromUser) return false;
    return activeTab === 'received'
      ? trade.toUser._id === user._id
      : trade.fromUser._id === user._id;
  });

  /* ──────────────────────────────
     Render                         */
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center text-teal-700 mb-6">
        Propuestas de Trueque
      </h2>

      <div className="flex justify-center mb-4">
        <button
          onClick={() => setActiveTab('received')}
          className={`px-4 py-2 rounded-l ${
            activeTab === 'received'
              ? 'bg-teal-600 text-white'
              : 'bg-white text-teal-700'
          } border border-teal-600`}
        >
          Recibidas
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`px-4 py-2 rounded-r ${
            activeTab === 'sent'
              ? 'bg-teal-600 text-white'
              : 'bg-white text-teal-700'
          } border border-teal-600`}
        >
          Enviadas
        </button>
      </div>

      {error && (
        <p className="text-center text-red-600 mb-4">
          Error al cargar tus propuestas. Inténtalo de nuevo más tarde.
        </p>
      )}

      <div className="max-w-3xl mx-auto space-y-4">
        {filteredTrades.length === 0 ? (
          <p className="text-center text-gray-600">
            No hay propuestas en esta sección.
          </p>
        ) : (
          filteredTrades.map((trade) => (
            <div key={trade._id} className="bg-white shadow rounded p-4">
              <p className="text-teal-700 font-semibold">
                {trade.fromUser?.name} ofrece "{trade.itemOffered?.title}" a{' '}
                {trade.toUser?.name} a cambio de "
                {trade.itemRequested?.title}"
              </p>
              <p className="text-gray-600 mb-2">
                Estado: <strong>{trade.status}</strong>
              </p>

              <div className="flex gap-3 flex-wrap">
                {user._id === trade.toUser?._id &&
                  trade.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAccept(trade._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                      >
                        Aceptar e ir al chat
                      </button>
                      <button
                        onClick={() => handleReject(trade._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                      >
                        Rechazar
                      </button>
                    </>
                  )}

                {trade.status === 'accepted' && (
                  <button
                    onClick={() => navigate(`/chat/${trade._id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                  >
                    Ir al chat
                  </button>
                )}

                {(user._id === trade.fromUser?._id ||
                  user._id === trade.toUser?._id) &&
                  trade.status === 'rejected' && (
                    <button
                      onClick={() => handleDelete(trade._id)}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm"
                    >
                      Eliminar
                    </button>
                  )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TradeList;
