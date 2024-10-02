import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import Login from './componenets/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './componenets/Navbar';
import Dashboard from './pages/Dashboard';
import UserRegistrationForm from './pages/UserRegistrationForm';
import AddUser from './pages/AddUser';
import ShowUsers from './pages/ShowUsers';

function App() {
 const [token, setToken] = useState(localStorage.getItem('token') || ''); 

  return (
    <Router>
      <div>
       
        <Navbar token={token} setToken={setToken} />

        {token ? (
          <Routes>
            <Route path="/" element={<Dashboard token={token} />}>
              <Route path="user-register" element={<AddUser />} />
              <Route path="manage-users" element={<ShowUsers />} />
            </Route>
          </Routes>
        ) : (
          <Routes>
           
            <Route path="*" element={<Login setToken={setToken} />} />
          </Routes>
        )}
      </div>
    </Router>
  
  );
}

export default App;
