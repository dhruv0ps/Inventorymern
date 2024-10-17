import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { CiLogout } from 'react-icons/ci';
import { MdDashboard } from 'react-icons/md';
import logo from "../assests/alora.png";
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
    <nav className="bg-navbar shadow-lg">
      <div className="w-full mx-auto">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center ml-7 ">
            <img 
              src={logo}
              alt="Logo" 
              className="h-10 mr-3" 
            />
          </div>

          <div className="hidden md:flex space-x-4 items-center mr-6">
            <NavLink to="/" className="text-navbar-text hover:text-black hover:bg-gray-200 transition duration-300 px-2 py-1 rounded" label={<><MdDashboard className="inline mr-1 mt-1.5" />Dashboard</>} />
            {token && (
              <button 
                onClick={handleLogout} 
                className="text-navbar-text hover:text-black hover:bg-gray-200 transition duration-300 px-4 py-2 rounded"
              >
                <CiLogout className="inline mr-1" /> Logout
              </button>
            )}
          </div>

          <div className="flex md:hidden items-center">
            <button 
              onClick={toggleMenu} 
              type="button" 
              aria-label="Toggle Menu"
              className="text-navbar-text hover:text-gray-300 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-navbar">
          <NavLink to="/" label={<><MdDashboard className="inline mr-1" />Dashboard</>} mobile />
          {token && (
            <button 
              onClick={handleLogout} 
              className="block px-4 py-2 text-navbar-text hover:bg-gray-900 w-full text-left"
            >
              <CiLogout className="inline mr-1" /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, label, mobile }) => (
  <Link
    to={to}
    className={`block px-4 py-2 text-navbar-text hover:text-black hover:bg-gray-200 transition duration-300 rounded ${mobile ? 'md:hidden' : 'md:flex'}`}
  >
    {label}
  </Link>
);

export default Navbar;
