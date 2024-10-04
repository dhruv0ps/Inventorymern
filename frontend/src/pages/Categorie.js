import React from 'react'
import AddCategory from '../componenets/AddCategory'
import CategoryList from '../componenets/CategoryList'

const Categorie = () => {
  return (
    <div className='flex space-x-52'>
      <AddCategory/>
      <CategoryList/>
    </div>
  )
}

export default Categorie


