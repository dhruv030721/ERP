import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import './DropDown.css'

function DropDown(props) {

  const { list , name } = props;


  return (
      <li className='items-center h-12 flex mr-10'>
        <NavLink to={`${name.toLowerCase()}`} className={({isActive}) => `${isActive ? "text-orange-500" : "text-black"}`}>{name}</NavLink>
        <ul className={`bg-white shadow-lg text-bold drop-shadow-sm  p-2 text-sm border rounded`} >
          {list.map((item, index) => (
            <li key={item} className='translate-x-2 transition-all hover:scale-x-105 '><NavLink className={() => `text-blue-950`}>{item}</NavLink></li>
          ))}
        </ul>
      </li>
  )
}

export default DropDown
