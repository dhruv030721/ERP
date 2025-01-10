import { useCallback, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../slices/store";
import { UserDataType } from "../../slices/auth";
import { Loading } from "../index";
import { jwtDecode } from "jwt-decode";
import { login } from "../../slices/auth";

interface AdminProtectedProps {
    children: ReactNode;
    authentication?: boolean;
}

export default function AuthProtected({
    children,
    authentication = true,
}: AdminProtectedProps) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const authStatus = useSelector((state: RootState) => state.auth.status);
    const dispatch = useDispatch();

    // const getCookie = (name: string): string | null => {
    //     const cookieString = document.cookie;
    //     const cookies = cookieString.split("; ");

    //     for (const cookie of cookies) {
    //         const [cookieName, cookieValue] = cookie.split("=");
    //         if (cookieName === name) {
    //             return decodeURIComponent(cookieValue);
    //         }
    //     }
    //     return null;
    // };

    const getToken = () => {
        const token = localStorage.getItem("erp_auth_token");
        return token;
    }

    const decodedData = (): UserDataType | null => {
        // From Cookie
        // const token = getCookie("erp_auth_token");
        // From Localstorage
        const token = localStorage.getItem('erp_auth_token');
        if (token !== null) {
            const data = jwtDecode<UserDataType>(token);
            return data;
        }
        return null;
    };

    const tokenAuth = useCallback(() => {
        const data = decodedData();
        if (data) {
            dispatch(login(data));
        }
    }, []);

    useEffect(() => {
        if (getToken()) {
            tokenAuth();
        } else {
            if (authentication && !authStatus) {
                navigate("/login");
            } else if (!authentication && authStatus) {
                navigate("/academics/dashboard");
            }
        }
        setLoading(false);
    }, [authStatus, navigate, tokenAuth, authentication]);

    if (loading) {
        return (
            <>
                <Loading message="" size="max-w-[20%]" />
            </>
        );
    }

    return <>{children}</>;
}
