import React from 'react'
import Sidebar from '../componenets/Sidebar'
import { Routes, Route, Outlet } from 'react-router-dom';


const Dashboard = () => {
  return (
    <div>
          <div className="flex  h-screen">
      
<Sidebar/>

             
             <Outlet/>
    
            </div>

    </div>
  )
}

export default Dashboard
