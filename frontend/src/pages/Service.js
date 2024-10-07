import React from 'react';

const Service = () => {
    return (
        <div className="container mx-auto p-6 bg-card shadow-md rounded-lg mt-10">
            <h2 className="text-2xl font-semibold text-text mb-4">Our Services</h2>
            <ul className="list-disc list-inside text-muted">
                <li>Service 1: Description of service 1.</li>
                <li>Service 2: Description of service 2.</li>
                <li>Service 3: Description of service 3.</li>
            </ul>
        </div>
    );
};

export default Service;