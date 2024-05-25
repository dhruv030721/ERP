import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { Loading } from "../../components/index";
import { jwtDecode } from "jwt-decode";
import { login } from "../../slices/auth";

export default function AdminProtected({ children, authentication = true }) {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const authStatus = useSelector((state) => state.auth.status);
    const dispatch = useDispatch();

    const getCookie = (name) => {
        const cookieString = document.cookie;
        const cookies = cookieString.split('; ');

        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');
            if (cookieName === name) {
                return decodeURIComponent(cookieValue)
            }
        }
        return null
    }

    const decodedData = () => {
        const token = getCookie("token");
        if (token !== null) {
            const data = jwtDecode(token)
            return data
        }
        return null
    }

    const tokenAuth = useCallback(() => {
        const data = decodedData();
        if (data) {
            dispatch(login(data));
        }
    }, [dispatch])

    useEffect(() => {
        if (getCookie("token")) {
            tokenAuth();
        } else {
            if (authentication && !authStatus) {
                navigate("/login");
            } else if (!authentication && authStatus) {
                navigate("/");
            }
        }

        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, [authStatus, navigate])

    if (loading) {
        return (
            <>
                <Loading size="max-w-[20%]" />
            </>
        )
    }

    return <>{children}</>
}
