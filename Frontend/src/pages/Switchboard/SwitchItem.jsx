import React, { cloneElement } from 'react'
import { Link } from 'react-router-dom'

function SwitchItem({ name, icon, bgcolor }) {
    return (
        <Link to={`/${name.toLowerCase()}`} className={`cursor-pointer border-[0.5px] border-black shadow-md space-y-3 flex flex-col items-center p-5 rounded-xl font-bold text-sm  ${bgcolor} hover:scale-110 transition-all`}
        >
            {icon}
            <h1>{name}</h1>
        </Link>
    )
}

export default SwitchItem   
