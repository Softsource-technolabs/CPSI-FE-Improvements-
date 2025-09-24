import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate("/login");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
            <h1 className="text-4xl font-bold mb-4">Welcome to Our App</h1>
            <p className="text-lg mb-8 text-center max-w-xl">
                This is the home page. Explore our amazing features and navigate to the login page to get started.
            </p>
            <button
                onClick={goToLogin}
                className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300"
            >
                Go to Login
            </button>
        </div>
    );
};

export default Home;
