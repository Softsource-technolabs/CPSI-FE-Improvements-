import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { mergeWithDefaults } from '../../..//utils/utils';
// import { notFound } from '../../../src/constants/notFound';

const NotFound: React.FC = () => {
    const [textSettings, setTextSettings] = useState<any>({});
    const navigate = useNavigate();

    // useEffect(() => {
    //     const notFoundTextSettings = localStorage.getItem("textsetting");
    //     if (notFoundTextSettings) {
    //         try {
    //             const parsed = JSON.parse(notFoundTextSettings);
    //             if (parsed?.notFound) {
    //                 const customTexts = mergeWithDefaults(notFound, parsed?.notFound || {});
    //                 setTextSettings(customTexts);
    //             } else {
    //                 setTextSettings(notFound);
    //             }
    //         } catch (error) {
    //             console.error("Error parsing text settings from localStorage:", error);
    //             setTextSettings(notFound);
    //         }
    //     } else {
    //         setTextSettings(notFound);
    //     }
    // }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-6">
            <div className="text-center max-w-xl">
                {/* Title */}
                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#1E1E2D] mb-8 mt-4" style={{ color: ("var(--headerForeColor)"), fontSize: 'x-large' }}>
                    {textSettings?.title || "SSO OneUser Admin App"}
                </h1>
                <div
                    className="font-extrabold leading-none mb-4"
                    style={{
                        fontSize: '6rem',
                        color: ("var(--headerForeColor)"),
                    }}
                >
                    {textSettings?.notFound || "404"}
                </div>

                <p className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2" style={{ color: "var(--subHeaderForeColor)" }}>
                    {textSettings?.notFoundTitle || "Oops! Page not found."}
                </p>
                <p className="text-md text-gray-500 mb-6">
                    {textSettings?.notFoundInfo || "The page you’re looking for doesn’t exist or has been moved."}
                </p>
                <Button
                    onClick={() => navigate('/admin/appProfiles')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-base font-medium shadow-md transition"
                    style={{ backgroundColor: "var(--primaryButtonBackColor)", color: "var(--primaryButtonForeColor)" }}
                >
                    {textSettings?.goBack || "← Back to Homepage"}
                </Button>
            </div>
        </div>
    );
};

export default NotFound;
