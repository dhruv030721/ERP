import React from 'react'
import { useState } from 'react'
import logo from '../../assets/logo/logo.png'
import collegeLogo from '../../assets/logo/collegeLogo.png'
import DropDown from './DropDown'
import DropDownBar from './DropDownBar'

function Header({dropdown}) {

    
5
    return (
        <>
            <div className='font-poppins text-black'>
                <nav className='flex w-[100%] h-28 justify-between items-center px-10'>
                    {/* campuslogo */}
                    <div className=''>
                        <img src={logo} alt="Logo" className='w-16 ' />
                    </div>
                    {/* title */}
                    <div className='flex flex-col '>
                        <h1 className='font-poppins font-black tracking-normal text-4xl text-orange-700 text-center'>SARDAR PATEL COLLEGE OF ENGINEERING</h1>
                        <p className='font-lexend tracking-tighter text-xl text-blue-950 text-center'>Managed By Tirupati Foundation Trust</p>
                    </div>
                    {/* college logo  */}
                    <div>
                        <img src={collegeLogo} alt="College Logo" className='w-20' />
                    </div>
                </nav>

                {dropdown? <DropDownBar /> : <div></div>}

            </div>

        </>

    )
}

export default Header
