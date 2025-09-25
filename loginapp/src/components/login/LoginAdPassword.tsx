import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { adLoginService } from "./LoginService";

interface FormData {
  password: string;
}

const LoginAdPassword: React.FC = () => {

  const { state } = useLocation();
  const userData: any = state;
  const [showPassword, setShowPassword] = useState(false);
  const [providers, setProviders] = useState<any[]>([]);
  const [locationDetails, setLocationDetails] = useState<any>({})
  const [systemInfo, setSystemInfo] = useState<any>({})
  const [ipaddress, setIpAddress] = useState<any>(null)
  const isADEmail = userData?.email?.toLowerCase().endsWith('@oneuseredu.com');

  useEffect(() => {
    const sysdetail = localStorage.getItem('system') || ""
    const ipdetails = localStorage.getItem('ipaddress') || ""
    const location = localStorage.getItem('location') || ""
    setSystemInfo(JSON.parse(sysdetail))
    setIpAddress(ipdetails)
    setLocationDetails(JSON.parse(location))

    fetch('/serviceProviders.json')
      .then(res => res.json())
      .then(data => setProviders(data.providers || []));
  }, []);

  useEffect(() => {
    const loginData = localStorage.getItem('loginResponse') || sessionStorage.getItem('loginResponse');
    if (loginData) {
      window.location.href = 'http://localhost:3002/admin/appProfiles';
    } else {
      sessionStorage.clear();
      localStorage.removeItem('cross_port_login_data');
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const schema = yup.object({
    password: yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be at most 128 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
        'Password must contain uppercase, lowercase, number, and special character'
      )
  });

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const handleCheckUserPass = async (data: FormData) => {
    try {
      Swal.showLoading();

      const adProvider = providers.find(p => p.id === 3);
      const appLoginProvider = providers.find(p => p.id === 5);

      if (isADEmail && adProvider) {
        const loginData = {
          email: userData?.email,
          password: data.password
        };
        
        const response = await adLoginService(loginData);
        
        if (response && response.success) {
          Swal.fire({ 
            title: "Login Successful", 
            background: "#408000", 
            icon: "success", 
            showConfirmButton: false, 
            allowOutsideClick: false 
          });
          
          localStorage.setItem('ALoginMethod', 'AD Login');
          const loginResponseData = encodeURIComponent(JSON.stringify(response));
          window.location.href = `http://localhost:3002/admin/appProfiles?loginData=${loginResponseData}`;
          return;
        } else {
          throw new Error(response?.message || "AD Login failed");
        }
      }

      if (appLoginProvider && appLoginProvider.loginEndpoint) {
        const response = await fetch(appLoginProvider.loginEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-System-location-Info': JSON.stringify({
              location: locationDetails,
              system: systemInfo,
              ipaddress
            }),
          },
          body: JSON.stringify({
            email: userData?.email,
            password: data.password,
          }),
        });
        
        const result = await response.json();
        
        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Login failed');
        }
        
        Swal.fire({ 
          title: "Login Successful", 
          background: "#408000", 
          icon: "success", 
          showConfirmButton: false, 
          allowOutsideClick: false 
        });
        
        localStorage.setItem('ALoginMethod', 'App Login');
        const loginData = encodeURIComponent(JSON.stringify(result));
        window.location.href = `http://localhost:3002/admin/appProfiles?loginData=${loginData}`;
        return;
      }

      throw new Error("No valid login provider found.");
    } catch (error: any) {
      Swal.fire({
        title: 'Login Failed',
        text: error.message || 'Check your credentials.',
        icon: 'error',
        width: '600px',
        confirmButtonText: 'Ok',
      });
    }
  };

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/@progress/kendo-theme-material/dist/all.css" />
      <div className="login-pg-bg">
        <div className="full-width-sm-device center-sign">
          <div className="grand-parent-container">
            <div className="parent-container">
              <div className="login-hold-head">
                <div className="logo-space">
                  <img
                    className="img-fluid fs-5"
                    tabIndex={0}
                    src="/assets/Images/logo.svg"
                    alt="logo"
                  />
                </div>
              </div>

              <div className="login-cnt-signup text-center">
                <p className="mb-2 fs-4 fw-bold common-color">Hello, {userData?.email}</p>
                <small>Nice to see you back. Enter your password to login.</small>

                <form className="pt-3" onSubmit={handleSubmit(handleCheckUserPass)}>
                  <div className="mb-3 col-auto position-relative">
                    <input
                      {...register('password')}
                      className="form-control form-border-btm login-input-box-sst login-input-box-pass-sst"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      tabIndex={0}
                    />
                    <div className="input-icon-sst">
                      <i className="bi bi-key-fill border-end pe-2"></i>
                    </div>
                    <div className="input-icon-sst right-icon-pass-sst">
                      <i
                        className="bi bi-x login-page-pass-crossicon"
                        onClick={() => {
                          setValue("password", "");
                          clearErrors("password");
                        }}
                      ></i>
                      <span className="separator-pass-sst"></span>
                      <i
                        className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} login-page-pass-eyeicon`}
                        onClick={togglePasswordVisibility}
                      ></i>
                    </div>
                  </div>
                  {errors.password && (
                    <p className="text-danger">{errors.password.message}</p>
                  )}

                  <div className="d-flex justify-content-ce mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary login-page-btn-sst p-2 m-1"
                      tabIndex={0}
                    >
                      Sign In
                    </button>
                  </div>
                </form>

                <div className="row pt-4 pb-2">
                  {isADEmail ? (
                    <div className="col-12 text-center">
                      <Link
                        className="app-launch-anchor-del-underline-sst"
                        to="/admin/login"
                        tabIndex={0}
                      >
                        Cancel
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="col-6 text-start">
                        <Link
                          className="app-launch-anchor-del-underline-sst"
                          to="/admin/login"
                          tabIndex={0}
                        >
                          Cancel
                        </Link>
                      </div>
                      <div className="col-6 text-end">
                        <Link
                          className="app-launch-anchor-del-underline-sst"
                          to="/admin/forgotpassword"
                          tabIndex={0}
                        >
                          Forgot your password?
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginAdPassword;