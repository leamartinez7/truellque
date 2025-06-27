// src/pages/CreateTrade.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import AuthContext from '../context/AuthContext';

const CreateTrade = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [ownItems, setOwnItems] = useState([]);
  const [itemRequested, setItemRequested] = useState('');
  const [itemOffered, setItemOffered] = useState('');
  const [toUser, setToUser] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!user || !itemId) return;

    const fetchData = async () => {
  try {
    const allItemsResponse = await api.get('/items');
    console.log('/items:', allItemsResponse.data);

    const requestedItemResponse = await api.get(`/items/public/${itemId}`);
    console.log('/items/public/:id', requestedItemResponse.data);

    const allItems = allItemsResponse.data;
    const requested = requestedItemResponse.data;

    setOwnItems(
    allItems
      .filter((i) => i.createdBy && (i.createdBy._id || i.createdBy) === user._id)
    );


    setItemRequested(requested._id);
    setToUser(requested.createdBy._id || requested.createdBy);
  } catch (err) {
    console.error('Error en fetchData:', err);  
    setMessage('Error al cargar los datos del trueque');
    setIsSuccess(false);
  }
};

    fetchData();
  }, [user, itemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user._id === toUser) {
      setMessage('No puedes hacerte un trueque a ti mismo');
      setIsSuccess(false);
      return;
    }

    try {
      await api.post('/trades', { itemOffered, itemRequested, toUser });
      setMessage('Propuesta creada exitosamente');
      setIsSuccess(true);
      setTimeout(() => navigate('/trades'), 1200);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error al crear la propuesta');
      setIsSuccess(false);
    }
  };

  if (!user) return <p className="text-center mt-10">Cargando usuario…</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-teal-700 mb-6">
          Proponer Trueque
        </h2>

        {message && (
          <p
            className={`px-4 py-2 rounded mb-4 text-sm text-center ${
              isSuccess
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">
              Selecciona el ítem que ofreces:
            </label>
            <select
              value={itemOffered}
              onChange={(e) => setItemOffered(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <option value="">-- Elegí uno de tus ítems --</option>
              {ownItems.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition"
          >
            Enviar Propuesta
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTrade;
