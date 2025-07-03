import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import AuthContext from '../context/AuthContext';

const Items = () => {
  const [items, setItems] = useState([]);
  const { user } = useContext(AuthContext);
  const [modalItem, setModalItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get('/items');
        setItems(res.data);
      } catch (err) {
        console.error('Error cargando items:', err);
      }
    };
    if (user) fetchItems();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-center text-red-600 text-lg">
          🔒 Debes iniciar sesión para ver los ítems publicados.
        </p>
      </div>
    );
  }

  const propios = items.filter((item) => item.createdBy && item.createdBy._id === user._id);
  const ajenos = items.filter((item) => item.createdBy && item.createdBy._id !== user._id);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Publicaciones de otros */}
      <section className="mb-12">
        <h3 className="text-xl font-semibold text-center text-teal-600 mb-6">
          Publicaciones de otros usuarios
        </h3>
        <div className="max-w-5xl mx-auto grid gap-6 grid-cols-1 md:grid-cols-2">
          {ajenos.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-md border-l-4 border-teal-500 rounded p-4 flex flex-col justify-between"
            >
              <div>
                <h4 className="text-lg font-bold text-teal-700">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Categoría: {item.category} | Ubicación: {item.location || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">Uso: {item.uso || 'N/A'}</p>
                <p className="text-sm text-gray-500">
                  Precio: {item.price ? `$${item.price}` : 'Sin precio'}
                </p>
                {item.image && (
                  <img
                    src={`http://localhost:5000${item.image}`}
                    alt={item.title}
                    className="w-full h-40 object-cover mt-2 rounded cursor-zoom-in transition hover:opacity-80"
                    onClick={() => setModalItem(item)}
                  />
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Publicado por: {item.createdBy.name}
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <Link
                  to={`/trades/new/${item._id}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                >
                  Proponer trueque
                </Link>
              </div>
            </div>
          ))}
          {ajenos.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">
              No hay publicaciones de otros usuarios disponibles.
            </p>
          )}
        </div>
      </section>

      {/* Tus publicaciones */}
      <section>
        <h3 className="text-xl font-semibold text-center text-gray-700 mb-6">
          Tus publicaciones
        </h3>
        <div className="max-w-5xl mx-auto grid gap-6 grid-cols-1 md:grid-cols-2">
          {propios.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-md border-l-4 border-gray-400 rounded p-4 flex flex-col justify-between"
            >
              <div>
                <h4 className="text-lg font-bold text-gray-800">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Categoría: {item.category} | Ubicación: {item.location || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">Uso: {item.uso || 'N/A'}</p>
                <p className="text-sm text-gray-500">
                  Precio: {item.price ? `$${item.price}` : 'Sin precio'}
                </p>
                {item.image && (
                  <img
                    src={`http://localhost:5000${item.image}`}
                    alt={item.title}
                    className="w-full h-40 object-cover mt-2 rounded cursor-zoom-in transition hover:opacity-80"
                    onClick={() => setModalItem(item)}
                  />
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Publicado por: {item.createdBy.name}
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={async () => {
                    if (window.confirm('¿Eliminar este ítem?')) {
                      try {
                        await api.delete(`/items/${item._id}`);
                        setItems((prev) => prev.filter((i) => i._id !== item._id));
                      } catch (err) {
                        console.error(err);
                        alert('Error al eliminar el ítem');
                      }
                    }
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          {propios.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">
              Aún no creaste publicaciones.
            </p>
          )}
        </div>
      </section>

      {/* Modal */}
      {modalItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
          onClick={() => setModalItem(null)}
        >
          <div
            className="bg-white rounded-lg max-w-lg w-full p-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`http://localhost:5000${modalItem.image}`}
              alt={modalItem.title}
              className="w-full h-auto object-contain rounded"
            />
            <h3 className="mt-4 text-lg font-bold text-gray-800">{modalItem.title}</h3>
            <p className="text-sm text-gray-600">{modalItem.description}</p>
            <p className="text-sm text-gray-500 mt-1">
              Categoría: {modalItem.category} | Uso: {modalItem.uso} | Precio:{' '}
              {modalItem.price ? `$${modalItem.price}` : 'Sin precio'}
            </p>
            <button
              onClick={() => setModalItem(null)}
              className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-opacity-80"
              aria-label="Cerrar modal"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Items;
