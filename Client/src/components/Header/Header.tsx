import logo from '../../assets/logo/logo.png'
import collegeLogo from '../../assets/logo/collegeLogo.png'
import { useNavigate } from 'react-router-dom'

function Header() {
    const navigate = useNavigate();

    function logoHandler() {
        navigate('/');
    }

    return (
        <div className=' text-black'>
            {/* Main Navigation */}
            <nav className='flex flex-col sm:flex-row w-full min-h-[80px] sm:h-28 justify-center sm:justify-between items-center px-4 sm:px-6 md:px-10 py-4 sm:py-0 gap-4 sm:gap-0'>
                {/* Logo Container for Mobile - This will contain both logos side by side */}
                <div className='flex justify-center gap-x-10 w-full sm:hidden'>
                    {/* Campus Logo */}
                    <div className='cursor-pointer' onClick={logoHandler}>
                        <img 
                            src={logo} 
                            alt="Logo" 
                            className='w-12'
                        />
                    </div>
                    {/* College Logo */}
                    <div className='cursor-pointer' onClick={logoHandler}>
                        <img 
                            src={collegeLogo} 
                            alt="College Logo" 
                            className='w-14'
                        />
                    </div>
                </div>

                {/* Desktop Logos - Hidden on Mobile */}
                {/* Campus Logo */}
                <div className='hidden sm:block cursor-pointer' onClick={logoHandler}>
                    <img 
                        src={logo} 
                        alt="Logo" 
                        className='w-14 md:w-16'
                    />
                </div>

                {/* Title Section */}
                <div className='flex flex-col'>
                    <h1 className='font-poppins font-semibold tracking-normal text-xl sm:text-2xl md:text-3xl lg:text-4xl text-orange-700 text-center px-2'>
                        SARDAR PATEL COLLEGE OF ENGINEERING
                    </h1>
                    <p className='font-karla font-semibold tracking-tighter text-sm sm:text-base md:text-lg lg:text-xl text-blue-950 text-center px-2'>
                        Managed By Tirupati Foundation Trust
                    </p>
                </div>

                {/* College Logo - Hidden on Mobile */}
                <div className='hidden sm:block cursor-pointer' onClick={logoHandler}>
                    <img 
                        src={collegeLogo} 
                        alt="College Logo" 
                        className='w-16 md:w-20'
                    />
                </div>
            </nav>

            {/* Divider */}
            <div className='bg-gradient-to-r from-white via-zinc-400 to-white h-[1px]'></div>
        </div>
    )
}

export default Header