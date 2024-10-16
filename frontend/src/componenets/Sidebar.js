import React, { useState } from 'react';
import { FaUser, FaBox, FaWarehouse, FaUsers, FaHandshake, FaFileInvoice, FaDollarSign, FaChevronUp, FaChevronDown } from 'react-icons/fa';

import { Link } from 'react-router-dom';

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isUsersMenuOpen, setIsUsersMenuOpen] = useState(false);
    const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
    const [isInventoryMenuOpen, setIsInventoryMenuOpen] = useState(false);
    const [isCustomersMenuOpen, setIsCustomersMenuOpen] = useState(false);
    const [isAgentsMenuOpen, setIsAgentsMenuOpen] = useState(false);
    const [isInvoicesMenuOpen, setIsInvoicesMenuOpen] = useState(false);
    const [isPaymentsMenuOpen, setIsPaymentsMenuOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className={`flex flex-col bg-navbar p-5 text-navbar-text transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`} style={{ minHeight: '100vh', overflowY: 'auto' }}>
            <div className="flex justify-end mb-4 ">
                <button onClick={toggleSidebar} className="text-navbar-text focus:outline-none">
                    {isSidebarOpen ? '<' : '>'}
                </button>
            </div>

            <nav>
                <ul>
                    <li className="mb-6">
                        <div onClick={() => setIsUsersMenuOpen(!isUsersMenuOpen)} className="flex items-center justify-between p-2 hover:bg-navbar-hover rounded cursor-pointer">
                            <div className="flex items-center">
                                <FaUser size={20} className="text-gray-500" />
                                {isSidebarOpen && <span className="ml-4">Users</span>}
                            </div>
                            {isSidebarOpen && (isUsersMenuOpen ? <FaChevronUp /> : <FaChevronDown />)}
                        </div>
                        {isUsersMenuOpen && isSidebarOpen && (
                            <ul className="ml-6 mt-2">
                                <li className="mb-2">
                                    <Link to='/user-register' className="block p-2 hover:bg-navbar-hover rounded">Add User</Link>
                                </li>
                                <li>
                                    <Link to='/manage-users' className="block p-2 hover:bg-navbar-hover rounded">Manage Users</Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li className="mb-6">
                        <div onClick={() => setIsProductsMenuOpen(!isProductsMenuOpen)} className="flex items-center justify-between p-2 hover:bg-navbar-hover rounded cursor-pointer">
                            <div className="flex items-center">
                                <FaBox size={20} className="text-gray-500" />
                                {isSidebarOpen && <span className="ml-4">Products</span>}
                            </div>
                            {isSidebarOpen && (isProductsMenuOpen ? <FaChevronUp /> : <FaChevronDown />)}
                        </div>
                        {isProductsMenuOpen && isSidebarOpen && (
                            <ul className="ml-6 mt-2">
                                <li>
                                    <Link to='/productlist' className="block p-2 hover:bg-navbar-hover rounded">Product List</Link>
                                </li>
                                <li>
                                    <Link to='/category' className="block p-2 hover:bg-navbar-hover rounded">Manage Category</Link>
                                </li>
                                <li>
                                    <Link to='/rawmaterial' className="block p-2 hover:bg-navbar-hover rounded">Raw Material</Link>
                                </li>
                                <li>
                                    <Link to='/producttags' className="block p-2 hover:bg-navbar-hover rounded">Product Tags</Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li className="mb-6">
                        <div onClick={() => setIsInventoryMenuOpen(!isInventoryMenuOpen)} className="flex items-center justify-between p-2 hover:bg-navbar-hover rounded cursor-pointer">
                            <div className="flex items-center">
                                <FaWarehouse size={20} className="text-gray-500" />
                                {isSidebarOpen && <span className="ml-4">Inventory</span>}
                            </div>
                            {isSidebarOpen && (isInventoryMenuOpen ? <FaChevronUp /> : <FaChevronDown />)}
                        </div>
                        {isInventoryMenuOpen && isSidebarOpen && (
                            <ul className="ml-6 mt-2">
                                <li className="mb-2">
                                    <Link to='/track-inventory' className="block p-2 hover:bg-navbar-hover rounded">Track Inventory</Link>
                                </li>
                                <li>
                                    <Link to='/inventory-reports' className="block p-2 hover:bg-navbar-hover rounded">Inventory Reports</Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li className="mb-6">
                        <div onClick={() => setIsCustomersMenuOpen(!isCustomersMenuOpen)} className="flex items-center justify-between p-2 hover:bg-navbar-hover rounded cursor-pointer">
                            <div className="flex items-center">
                                <FaUsers size={20} className="text-gray-500" />
                                {isSidebarOpen && <span className="ml-4">Customers</span>}
                            </div>
                            {isSidebarOpen && (isCustomersMenuOpen ? <FaChevronUp /> : <FaChevronDown />)}
                        </div>
                        {isCustomersMenuOpen && isSidebarOpen && (
                            <ul className="ml-6 mt-2">
                                <li>
                                    <Link to='/managecustomers' className="block p-2 hover:bg-navbar-hover rounded">Manage Customers</Link>
                                </li>
                                <li>
                                    <Link to='/categories' className="block p-2 hover:bg-navbar-hover rounded">Manage Category</Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li className="mb-6">
                        <div onClick={() => setIsAgentsMenuOpen(!isAgentsMenuOpen)} className="flex items-center justify-between p-2 hover:bg-navbar-hover rounded cursor-pointer">
                            <div className="flex items-center">
                                <FaHandshake size={20} className="text-gray-500" />
                                {isSidebarOpen && <span className="ml-4">Agents</span>}
                            </div>
                            {isSidebarOpen && (isAgentsMenuOpen ? <FaChevronUp /> : <FaChevronDown />)}
                        </div>
                        {isAgentsMenuOpen && isSidebarOpen && (
                            <ul className="ml-6 mt-2">
                                <li className="mb-2">
                                    <Link to='/addagent' className="block p-2 hover:bg-navbar-hover rounded">Add Agent</Link>
                                </li>
                                <li>
                                    <Link to='/agentlist' className="block p-2 hover:bg-navbar-hover rounded">Manage Agents</Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li className="mb-6">
                        <div onClick={() => setIsInvoicesMenuOpen(!isInvoicesMenuOpen)} className="flex items-center justify-between p-2 hover:bg-navbar-hover rounded cursor-pointer">
                            <div className="flex items-center">
                                <FaFileInvoice size={20} className="text-gray-500" />
                                {isSidebarOpen && <span className="ml-4">Invoices</span>}
                            </div>
                            {isSidebarOpen && (isInvoicesMenuOpen ? <FaChevronUp /> : <FaChevronDown />)}
                        </div>
                        {isInvoicesMenuOpen && isSidebarOpen && (
                            <ul className="ml-6 mt-2">
                                <li className="mb-2">
                                    <Link to='/create-invoice' className="block p-2 hover:bg-navbar-hover rounded">Create Invoice</Link>
                                </li>
                                <li>
                                    <Link to='/manage-invoices' className="block p-2 hover:bg-navbar-hover rounded">Manage Invoices</Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li className="mb-6">
                        <div onClick={() => setIsPaymentsMenuOpen(!isPaymentsMenuOpen)} className="flex items-center justify-between p-2 hover:bg-navbar-hover rounded cursor-pointer">
                            <div className="flex items-center">
                                <FaDollarSign size={20} className="text-gray-500" />
                                {isSidebarOpen && <span className="ml-4">Payments</span>}
                            </div>
                            {isSidebarOpen && (isPaymentsMenuOpen ? <FaChevronUp /> : <FaChevronDown />)}
                        </div>
                        {isPaymentsMenuOpen && isSidebarOpen && (
                            <ul className="ml-6 mt-2">
                                <li>
                                    <Link to='/managepayments' className="block p-2 hover:bg-navbar-hover rounded">Manage Payments</Link>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;


