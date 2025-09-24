import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { isTokenExpired, clearAuthData } from "../../../utils/utils";

const TokenChecker: React.FC = () => {
    const navigate = useNavigate();
    const [hasShownModal, setHasShownModal] = useState(false);

    const showTokenExpiredModal = () => {
        Swal.fire({
            title: "Session Expired",
            text: "Your session has expired. Please log in again.",
            icon: "warning",
            confirmButtonText: "Log In",
            allowOutsideClick: false,
        }).then((result) => {
            if (result.isConfirmed) {
                clearAuthData();
                navigate("/admin/login", { replace: true });
            }
        });
    };

    useEffect(() => {
        // You can uncomment one of these lines to change the check interval for testing.
        // const interval = setInterval(() => {
        //     if (isTokenExpired() && !hasShownModal) {
        //         showTokenExpiredModal();
        //         setHasShownModal(true);
        //         clearInterval(interval);
        //     }
        // }, 1 * 60 * 1000); // Check every 1 minute

        // const interval = setInterval(() => {
        //     if (isTokenExpired() && !hasShownModal) {
        //         showTokenExpiredModal();
        //         setHasShownModal(true);
        //         clearInterval(interval);
        //     }
        // }, 2 * 60 * 1000); // Check every 2 minutes

        const interval = setInterval(() => {
            if (isTokenExpired() && !hasShownModal) {
                showTokenExpiredModal();
                setHasShownModal(true); 
                clearInterval(interval);
            }
        }, 15 * 60 * 1000); // Check every 15 minutes

        return () => clearInterval(interval);
    }, [hasShownModal, navigate]); 

    return null;
};

export default TokenChecker;