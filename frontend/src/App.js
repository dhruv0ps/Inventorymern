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
import  Categorie from './pages/Categorie';
import RawMaterials from './pages/RawMaterials'
import ProductTags from './pages/ProductTags';
import NewProduct from './pages/NewProduct';
import ProductList from './pages/ProductList';
import About from './pages/About';
import Contact from './pages/Contact';
import Service from './pages/Service';
function App() {
 const [token, setToken] = useState(localStorage.getItem('token') || ''); 

  return (
    <Router>
      <div>
       
        <Navbar token={token} setToken={setToken} />
        <Routes>
                        <Route path='about' element={<About />} />
                        <Route path='services' element={<Service />} />
                        <Route path='contact' element={<Contact />} />
                    </Routes>
        {token ? (
          <Routes>
            <Route path="/" element={<Dashboard token={token} />}>
              <Route path="user-register" element={<AddUser />} />
              <Route path="manage-users" element={<ShowUsers />} />
              <Route path='categorie' element={<Categorie/>}/>
              <Route path ="rawmaterial" element={<RawMaterials/>}/>
              <Route path='producttags' element={<ProductTags/>}/>
              <Route path='newproduct' element={<NewProduct/>}/>
              <Route path='productlist' element={<ProductList/>}/>
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
