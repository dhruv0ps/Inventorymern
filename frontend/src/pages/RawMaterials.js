import React from 'react';

import RawMaterialForm from '../componenets/RawMaterialForm';
import RawMaterialList from '../componenets/RawMaterialList';

const RawMaterials = () => {
    const handleRawMaterialAdded = (newMaterial) => {
      
    };

    return (
        <div className="container mx-auto mt-8 p-4 max-w-xl">
            <h2 className="text-3xl flex justify-center font-semibold mb-6 text-gray-800">Raw Materials</h2>
            <RawMaterialForm onRawMaterialAdded={handleRawMaterialAdded} />
            <RawMaterialList />
        </div>
    );
};

export default RawMaterials;
