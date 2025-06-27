// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import TradeList from './pages/TradeList';
import CreateTrade from './pages/CreateTrade';
import Items from './pages/Items';
import NewItem from './pages/NewItem';
import EditItem from './pages/EditItem';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<TradeList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<CreateTrade />} />

          {/* Rutas para ítems */}
          <Route path="/items" element={<Items />} />
          <Route path="/items/new" element={<NewItem />} />
          <Route path="/items/edit/:id" element={<EditItem />} />
          <Route path="/trades/new/:itemId" element={<CreateTrade />} />

          {/* Alias de rutas para trades */}
          <Route path="/trades" element={<TradeList />} />
          <Route path="/trades/new" element={<CreateTrade />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}



export default App;
