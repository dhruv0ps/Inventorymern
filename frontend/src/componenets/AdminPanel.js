import React from 'react'

const AdminPanel = () => {
  return (
    <div className="flex">
    
    <div className="bg-black text-white w-64 h-screen p-5">
        <h2 className="text-3xl font-semibold mb-6">Admin Panel</h2>
        <ul className='text-1xl'>
            <li className="mb-4">
                <a href="#" className=" block p-2 rounded transition duration-200   hover:text-gray-700 hover:shadow-lg ">Dashboard</a>
            </li>
            <li className="mb-4">
                <a href="#" className="hover:text-gray-300">Manage Users</a>
            </li>
            <li className="mb-4">
                <a href="#" className="hover:text-gray-300">Settings</a>
            </li>
            <li className="mb-4">
                <a href="#" className="hover:text-gray-300">Reports</a>
            </li>
            <li className="mb-4">
                <a href="#" className="hover:text-gray-300">Logout</a>
            </li>
        </ul>
    </div>

    
    <div className="flex-1 p-5">
        <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold">Dashboard</h1>
            <div>
                <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">Add User</button>
            </div>
        </header>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
            <div className="bg-white p-5 rounded-lg shadow">
                <h3 className="text-xl font-semibold">Total Users</h3>
                <p className="text-3xl">150</p>
            </div>
           
            <div className="bg-white p-5 rounded-lg shadow">
                <h3 className="text-xl font-semibold">Active Users</h3>
                <p className="text-3xl">120</p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow">
                <h3 className="text-xl font-semibold">Pending Requests</h3>
                <p className="text-3xl">30</p>
            </div>
        </div>
    </div>
</div>
  )
}

export default AdminPanel
