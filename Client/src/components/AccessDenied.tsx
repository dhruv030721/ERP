

const AccessDenied = () => {
    return (
        (<div className="flex flex-col h-96 justify-center px-5 items-center font-DmSans">
            <h1 className="text-orange-800 font-semibold text-4xl">Access Denied!</h1>
            <p className="text-orange-900 text-md text-center md:text-xl ">You don't have permission to access this module.</p>
        </div>)
    )
}

export default AccessDenied
