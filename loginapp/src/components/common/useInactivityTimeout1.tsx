import { useState, useEffect } from 'react';

// Define the types for the logout callback
type LogoutCallback = () => void;

const useInactivityTimeout = (
  logoutCallback: LogoutCallback | null,
  timeoutDuration: number = 15 * 60 * 1000 // Default timeout duration is 15 minutes
): void => {
  const [lastActivityTime, setLastActivityTime] = useState<number>(Date.now());

  // Reset inactivity timer whenever activity is detected
  const resetInactivityTimer = (): void => {
    setLastActivityTime(Date.now());
  };

  // Event listeners for user activity (mousemove, keydown, click, scroll)
  useEffect(() => {
    const activityEvents: string[] = ['mousemove', 'keydown'];
    
    // Attach event listeners for user activity
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetInactivityTimer)
    );

    // Cleanup event listeners on component unmount
    return () => {
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetInactivityTimer)
      );
    };
  }, []);

  useEffect(() => {
    // Check for inactivity every second
    const checkInactivity = setInterval(() => {
      if (Date.now() - lastActivityTime > timeoutDuration) {
        if (logoutCallback) logoutCallback(); // Call the logout function after the timeout duration
      }
    }, 1000); // Check every second for inactivity

    return () => clearInterval(checkInactivity); // Cleanup interval on component unmount
  }, [lastActivityTime, logoutCallback, timeoutDuration]);
};

export default useInactivityTimeout;
