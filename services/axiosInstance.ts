//@ts-nocheck
import axios from 'axios';
import { manageJSONParse } from '../utils/utils';
import appSettings from '../utils/appSettings.json'


const axiosInstance = axios.create({
    // baseURL: 'https://portal4all.com/AuthBridgeDev',
    baseURL: appSettings.AppSettings.BaseUrlPath,
    headers: {
        'Content-Type': 'application/json',
    },
});

const sysdetail = localStorage.getItem('system') || ""
const ipdetails = localStorage.getItem('ipaddress') || ""
const location = localStorage.getItem('location') || ""

// Add interceptors if needed (for auth tokens, logging, etc.)
axiosInstance.interceptors.request.use(
    (config) => {
        // Example: Attach token
        const loginResponse = localStorage.getItem('loginResponse');
        const locationDetails = manageJSONParse(location);
        const systemInfo = manageJSONParse(sysdetail);
        const ipaddress = ipdetails
        const resJson = manageJSONParse(loginResponse || '');
        const token = resJson?.data?.token || null;

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        config.headers['X-System-location-Info'] = JSON.stringify({
            location: {...locationDetails, macaddress: null, ipaddress },
            system: systemInfo,
            userId: 16,
            IsAdminApp: true,
        })
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        // Handle error response

        // You can access the error response details like:
        if (error.response) {
            // The request was made, and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error Response:', error.response);

            const { status, statusText, data } = error.response;
            console.error('Status:', status);
            console.error('Status Text:', statusText);
            console.error('Response Data:', data);

            // URL of the request that failed
            console.error('Failed URL:', error.config.url);

        } else if (error.request) {
            // The request was made, but no response was received
            console.error('Error Request:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error Message:', error.message);
        }

        return Promise.reject(error);
    }
)

export default axiosInstance;