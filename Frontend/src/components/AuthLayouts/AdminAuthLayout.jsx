import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function AdminProtected({ children, authentication = true }) {

    const navigate = useNavigate();
    const authStatus = true;

    console.log("Executed");

    useEffect(() => {
        if (authentication && !authStatus) {
            navigate('/login');
        } else if (!authentication && authStatus) {
            navigate("/switchboard");
        }
    }, [authStatus, navigate, authentication])




    return <>{children}</>
}