import React from 'react'
import Sidebar from '../componenets/Sidebar'
import { Routes, Route, Outlet } from 'react-router-dom';
import UserRegistrationForm from './UserRegistrationForm'; // Adjust the import path as necessary

const Dashboard = () => {
  return (
    <div>
          <div className="flex h-screen">
      
<Sidebar/>
             
             <Outlet/>
    
            </div>

    </div>
  )
}

export default Dashboard
