import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import { googleLoginWithData, microsoftLoginwithdata } from '../common/RedirectPathMange'
import { getUiStyle, } from './LoginService';
import { MsalProvider, useMsal } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, loginRequest } from './msalConfig';

// Define an interface for AppSettings
interface AppSettings {
    AppSettings: {
        BaseUrlPath: string;
    };
    GoogleSettings?: { client_id?: string };
    AzureAd?: { ClientId?: string };
}

let FileFound: AppSettings | "error" = "error";

const fetchAppSettings = async () => {
    FileFound = await axios
        .get("/appSettings.json")
        .then((response: AxiosResponse<AppSettings>) => {
            return response.data;
        })
        .catch(() => {
            Swal.fire({
                title: "Oops, Something Went Wrong",
                text: "We encountered an issue while trying to complete your request. This might be due to a system error. Please try again later, or reach out to your system administrator or support team for assistance.",
                icon: "error",
                width: "600px",
                confirmButtonText: "Ok",
            });
            return "error";
        });
};

fetchAppSettings();

// Microsoft login configuration initialization
const msalInstance = new PublicClientApplication(msalConfig);

const LoginOptions: React.FC = () => {

    const { state } = useLocation();
    const userData: any = state;

    const navigate = useNavigate();

    // function for google oauth login
    // const googleOauthLogin = useGoogleOauthLogin()
    // end of google oauth login

    const GoogleOAuthLogin = async () => {
        console.log('=========Google Login===========');
    }

    //error message for if credential is not available in /AppLauncher/appSettings.json file
    const ErrorSetting = (service: any) => {
        Swal.fire({
            title: service + ` Service Not Available`,
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    }

    // function for Microsoft oauth login
    const MicrosoftOauthLogin = async () => {

        console.log('=========Microsoft Login===========');

        // await msalInstance.loginPopup(loginRequest).then(async (response) => {
        //     localStorage.setItem('microsoft', JSON.stringify(response))
        //     localStorage.setItem('MicroAcc', JSON.stringify(response.account))
        //     // localStorage.setItem('customStyle', JSON.stringify({}));
        //     await getUiStyle();
        //     localStorage.setItem('Aname', response.account.name || 'Anonymous');
        //     microsoftLoginwithdata(response)
        // }).catch((error) => {
        //     console.error('Login failed:', error);
        // });
    };
    // const microsoftOauthLogin = useMicrosoftOauthLogin()
    //End of Microsoft oauth login

    return (
        <>
            <link rel="stylesheet" href="https://unpkg.com/@progress/kendo-theme-material/dist/all.css"></link>
            <div className="login-pg-bg">
                <div className="full-width-sm-device center-sign">
                    <div className="grand-parent-container">
                        <div className="parent-container">
                            <div className="login-hold-head">
                                <div className="logo-space flex justify-center"><img className="img-fluid fs-5" tabIndex={0} src='/assets/Images/logo.svg' alt="logo" /></div>
                            </div>
                            <div className="login-cnt-signup">

                                <div className="text-center">
                                    <p className="mb-2 fs-4 fw-bold common-color"> Select how you would like to login.</p>
                                    <small className=""> Click More to see more option. </small>
                                </div>

                                <div className="d-flex justify-content-ce mt-4" >
                                    <button className='btn btn-primary login-page-btn-sst p-2 m-1' onClick={() => navigate('/loginPass', { state: userData })} tabIndex={0} type="button">Sign in Using Password</button>
                                </div>

                                <div className="divider-with-text pt-4 pb-4">
                                    <div className="line"></div>
                                    <span className="text text-muted">OR CONTINUE WITH</span>
                                    <div className="line"></div>
                                </div>

                                <div className="container py-3">
                                    <div className="row g-3 justify-content-center">
                                        <div className="col-6 d-flex justify-content-center">
                                            <button className='btn login-page-btn-sst-social p-2 m-1 fw-bold w-100' onClick={GoogleOAuthLogin}>
                                                <img className="w-5 h-5 mr-3 inline-block align-middle" alt='GoogleLogin' src='https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png' width={20} height={20} />Google OAuth/SAML
                                            </button>
                                        </div>
                                        <div className="col-6 d-flex justify-content-center">
                                            <button
                                                className="btn login-page-btn-sst-social p-2 m-1 fw-bold w-100"
                                                tabIndex={0}
                                                onClick={() => {
                                                    if (
                                                        FileFound !== "error" &&
                                                        (FileFound.AzureAd?.ClientId === undefined ||
                                                            FileFound.AzureAd?.ClientId === "" ||
                                                            FileFound.AzureAd?.ClientId === null)
                                                    ) {
                                                        ErrorSetting("Microsoft OAuth");
                                                    } else {
                                                        MicrosoftOauthLogin();
                                                    }
                                                }}
                                                type="button"
                                            >
                                                <img
                                                    className="w-5 h-5 mr-3 inline-block align-middle"
                                                    alt="MicrosoftLogin"
                                                    src="https://www.microsoft.com/favicon.ico"
                                                    width={20}
                                                    height={20}
                                                />
                                                Microsoft OAuth/SAML
                                            </button>
                                        </div>
                                        <div className="col-6 d-flex justify-content-center">
                                            <button className='btn login-page-btn-sst-social p-2 m-1 fw-bold w-100' tabIndex={0} onClick={() => ErrorSetting('AD Login')} type="button">
                                                <img className="w-5 h-5 mr-3 inline-block align-middle" alt="ADLogin" src='https://portal.azure.com/Content/favicon.ico' width={20} height={20} /> AD Login
                                            </button>
                                        </div>
                                        <div className="col-6 d-flex justify-content-center">
                                            <button className='btn login-page-btn-sst-social p-2 m-1 fw-bold w-100' tabIndex={0} onClick={() => ErrorSetting('ADFS Login')} type="button">
                                                <img className="w-5 h-5 mr-3 inline-block align-middle" alt="ADFSLogin" src='https://portal.azure.com/Content/favicon.ico' width={20} height={20} /> ADFS Login
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="login-page-forgot-sst pt-4 pb-2">
                                    <Link
                                        className="app-launch-anchor-del-underline-sst border border-[#272b2f] rounded px-4 py-2 inline-block"
                                        to="/"
                                        tabIndex={0}
                                    >
                                        Cancel
                                    </Link>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginOptions;
