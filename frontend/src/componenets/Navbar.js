import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ token, setToken }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    setToken(''); 
    localStorage.removeItem('token');  
    navigate('/login');  
  };

  return (
    <nav className="bg-teal-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="#" className="text-xl font-bold text-white">
              MyApp
            </a>
          </div>

          <div className="hidden md:flex space-x-4 items-center">
            <a href="#" className="text-white hover:text-gray-600 transition duration-300">
              Dashboard
            </a>
            <a href="#" className="text-white hover:text-gray-600 transition duration-300">
              About
            </a>
            <a href="#" className="text-white hover:text-gray-600 transition duration-300">
              Services
            </a>
            <a href="#" className="text-white hover:text-gray-600 transition duration-300">
              Contact
            </a>
            {token && (
              <button onClick={handleLogout} className="text-white hover:text-gray-600 transition duration-300">
                Logout
              </button>
            )}
          </div>

          <div className="flex md:hidden items-center">
            <button onClick={toggleMenu} type="button" className="text-white hover:text-gray-600 focus:outline-none">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <a href="#" className="block px-4 py-2 text-white hover:bg-gray-900">Dashboard</a>
          <a href="#" className="block px-4 py-2 text-white hover:bg-gray-900">About</a>
          <a href="#" className="block px-4 py-2 text-white hover:bg-gray-900">Services</a>
          <a href="#" className="block px-4 py-2 text-white hover:bg-gray-900">Contact</a>
          {token && (
            <button onClick={handleLogout} className="block px-4 py-2 text-white hover:bg-gray-900 w-full text-left">
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
