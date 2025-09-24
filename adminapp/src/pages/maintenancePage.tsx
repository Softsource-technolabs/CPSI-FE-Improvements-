import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { mergeWithDefaults } from '../../../utils/utils';
// import { maintenance } from '../../../src/constants/maintenance';

const MaintenancePage: React.FC = () => {
  const [textSettings, setTextSettings] = useState<any>({});
  const navigate = useNavigate();

  // useEffect(() => {
  //   const maintenanceTextSettings = localStorage.getItem("textsetting");
  //   if (maintenanceTextSettings) {
  //     try {
  //       const parsed = JSON.parse(maintenanceTextSettings);
  //       if (parsed?.maintenance) {
  //         const customTexts = mergeWithDefaults(maintenance, parsed?.maintenance || {});
  //         setTextSettings(customTexts);
  //       } else {
  //         setTextSettings(maintenance);
  //       }
  //     } catch (error) {
  //       console.error("Error parsing text settings from localStorage:", error);
  //       setTextSettings(maintenance);
  //     }
  //   } else {
  //     setTextSettings(maintenance);
  //   }
  // }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4 sm:px-6">
      <div className="text-center w-full max-w-xl">
        {/* Title */}
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#1E1E2D] mb-4" style={{ color: ("var(--headerForeColor)"), fontSize: 'x-large' }}>
          {textSettings?.title || "SSO OneUser Admin App"}
        </h1>

        <div className="mb-6">
          <img
            src="/assets/SystemMaintenance.png"
            alt="System Maintenance"
            className="h-[100px] sm:h-[120px] md:h-[140px] lg:h-[160px] mx-auto object-contain"
            style={{ height:'200px'}}
          />
        </div>

        <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold text-[#1E1E2D] mb-3" style={{ fontSize: 'xxx-large', color: 'var(--headerForeColor)' }}>
          {textSettings?.maintenance || "The application cannot start"}
        </h2>

        <h2 className="text-base sm:text-lg md:text-xl font-medium text-gray-800 mb-2" style={{ color: "var(--subHeaderForeColor)" }}>
          {textSettings?.maintenanceInfo || "The configuration file (appsettings.json) is missing."}</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6 px-2 sm:px-0" style={{ color: "var(--subHeaderForeColor)" }}>
          {textSettings?.contactSupport || "Please ensure the file is present in the application directory and try again."}
        </p>

        {/* <p className="text-base sm:text-lg text-gray-700 mb-2">
          The service is temporarily unavailable.
        </p>
        <p className="text-base sm:text-lg text-gray-700 mb-6">
          Please try again later or contact support if the issue persists.
        </p> */}

        {/* <Button
          onClick={() => navigate('/admin/appProfiles')}
          className="bg-[#1E1E2D] hover:bg-[#2F2F3D] text-black px-6 py-3 rounded-lg text-base font-medium shadow transition"
        >
          ← Back to Homepage
        </Button> */}
      </div>
    </div>
  );
};

export default MaintenancePage;
