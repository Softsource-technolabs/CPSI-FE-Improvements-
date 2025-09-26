import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { getUiStyle, adLoginService } from "./LoginService";
import { manageJSONParse } from "../../../../utils/utils";
import ApiService from "../../../../services/api-service";

interface AppSettings {
  AppSettings: {
    BaseUrlPath: string;
    WebServicePath: string;
  };
  GoogleSettings?: { client_id?: string };
  AzureAd?: { ClientId?: string };
}

let FileFound: AppSettings | "error" = "error";

const fetchAppSettings = async () => {
  FileFound = await axios
    .get("/appSettings.json")
    .then((response: AxiosResponse<AppSettings>) => response.data)
    .catch(() => {
      Swal.fire({
        title: "Oops, Something Went Wrong",
        text: "Issue loading app settings. Please try again later.",
        icon: "error",
        width: "600px",
        confirmButtonText: "Ok",
      });
      return "error";
    });
};

fetchAppSettings();

function convertKeysToLowerFirst(input: any): { success: boolean; message?: string } {
  return { success: true, message: "Example" };
}

// Yup validation schema for email
const schema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .test(
      "starts-with-letter",
      (value) => {
        if (!value) return true; 
        if (!/^[a-zA-Z]/.test(value)) {
          return "Email must start with a letter";
        }
        return true;
      },
      (value) => !!value && /^[a-zA-Z]/.test(value)
    )
    .test(
      "valid-email-format",
      (value) => {
        if (!value) return true;
        const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) {
          return "Please enter a valid email address";
        }
        return true;
      },
      (value) => !!value && /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
    ),
});

const LoginStart: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [val, setVal] = useState<{ email?: string }>({});
  const [btnshow, setBtnshow] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [providers, setProviders] = useState<any[]>([]);
  const [locationDetails, setLocationDetails] = useState<any>({})
  const [systemInfo, setSystemInfo] = useState<any>({})
  const [ipaddress, setIpAddress] = useState<any>(null)

  useEffect(() => {
    const sysdetail = localStorage.getItem('system') || ""
    const ipdetails = localStorage.getItem('ipaddress') || ""
    const location = localStorage.getItem('location') || ""
    setSystemInfo(manageJSONParse(sysdetail))
    setIpAddress(ipdetails)
    setLocationDetails(manageJSONParse(location))

    fetch("/serviceProviders.json")
      .then((res) => res.json())
      .then((data) => setProviders(data.providers || []));
  }, []);

  const haChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "email") {
      setBtnshow(!!value && value.includes("@"));
      setVal({ ...val, [name]: value });
    }
  };

  const callSSOApi = async (email: string) => {
    try {
      const adProvider = providers.find((p) => p.id === 3);
      const appLoginProvider = providers.find((p) => p.id === 5);

      const isADEmail = email.toLowerCase().endsWith('@oneuseredu.com');

      console.log("Provider check:", { adProvider, appLoginProvider, isADEmail, email });

      if (isADEmail && adProvider) {
        Swal.close();
        setTimeout(() => {
          navigate("/admin/loginPass", { state: { email } });
        }, 100);
        return;
      }

      if (adProvider && adProvider.loginEndpoint) {
        const response = await axios.post(adProvider.loginEndpoint, { email }, {
          headers: {
            'Content-Type': 'application/json',
            'X-System-location-Info': JSON.stringify({
              location: locationDetails,
              system: systemInfo,
              ipaddress
            }),
          }
        });
        
        console.log('AD Provider Response', response.data);

        if (response.data?.success) {
          const serviceId = response.data.data?.serviceProviderId;
          if (serviceId === 3 || serviceId === 5) {
            Swal.close();
            setTimeout(() => {
              navigate("/admin/loginPass", { state: { email } });
            }, 100);
            return;
          } else {
            await Swal.fire({
              title: "Invalid Service Provider",
              text: `Service Provider ID ${serviceId} is not allowed. Please contact support.`,
              icon: "error",
              confirmButtonText: "Ok",
            });
            setVal({ email: "" });
            return;
          }
        }
      }

      if (appLoginProvider && appLoginProvider.loginEndpoint) {
        const response = await axios.post(appLoginProvider.loginEndpoint, { email }, {
          headers: {
            'Content-Type': 'application/json',
            'X-System-location-Info': JSON.stringify({
              location: locationDetails,
              system: systemInfo,
              ipaddress
            }),
          }
        });
        
        console.log('App Provider Response', response.data);
        
        if (response.data?.success) {
          Swal.close();
          setTimeout(() => {
            navigate("/admin/loginPass", { state: { email } });
          }, 100);
          return;
        } else {
          await Swal.fire("Error", response.data?.message || "Login failed", "error");
          setVal({ email: "" });
          throw new Error("Login failed");
        }
      }

      await Swal.fire("Error", "No valid login provider found.", "error");
      setVal({ email: "" });
    } catch (error: any) {
      console.error("SSO API Error:", error);
      await Swal.fire("Error", error.message || "API call failed", "error");
      setVal({ email: "" });
      throw error;
    }
  };

  const NormalLogin = async (data: any) => {
    const email = data.email?.trim();

    if (providers.length === 0) {
      await Swal.fire({
        title: "Please wait",
        text: "Loading login providers, please try again shortly.",
        icon: "info",
        confirmButtonText: "Ok",
      });
      return;
    }

    if (FileFound === "error" || !FileFound.AppSettings.BaseUrlPath) {
      await Swal.fire({
        title: "Oops, Something Went Wrong",
        text: "App settings could not be loaded properly.",
        icon: "error",
        width: "600px",
        confirmButtonText: "Ok",
      });
      setVal({ email: "" });
      return;
    }

    Swal.showLoading();
    try {
      await callSSOApi(email);
    } catch (error) {
      setVal({ email: "" });
    }
  };

  useEffect(() => {
    const samlResponse = searchParams.get("token");
    const msloginSuccessFun = async () => {
      if (samlResponse) {
        localStorage.setItem("customStyle", JSON.stringify({}));
        await getUiStyle();
        const changeObj = convertKeysToLowerFirst(JSON.parse(samlResponse));
        if (!changeObj?.success) {
          Swal.fire({
            title: changeObj?.message,
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      }
    };
    msloginSuccessFun();
  }, [searchParams]);

  const handleSignInClick = () => {
    handleSubmit(NormalLogin)();
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/@progress/kendo-theme-material/dist/all.css"
      ></link>
      <div className="login-pg-bg no-scrollbar">
        <div className="full-width-sm-device center-sign overflow-hidden">
          <div className="grand-parent-container">
            <div className="parent-container">
              <div className="login-hold-head">
                <div className="logo-space">
                  <img
                    className="img-fluid"
                    tabIndex={0}
                    src="/assets/Images/logo.svg"
                    alt="logo"
                  />
                </div>
              </div>
              <div className="login-cnt">
                <div className="text-center">
                  <p className="mb-2 fs-4 fw-bold common-color" tabIndex={0}>
                    One User Admin App
                  </p>
                  <small className="" tabIndex={0}>
                    Welcome back. Enter your email to continue.
                  </small>
                </div>
                <form
                  method="#"
                  action="/"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="mb-3 mt-3 col-auto position-relative">
                    <input
                      {...register("email")}
                      onChange={(e) => haChange(e)}
                      tabIndex={0}
                      title="Enter email value"
                      className="form-control form-border-btm login-input-box-sst"
                      value={val?.email}
                      type="email"
                      placeholder="Email Address"
                      minLength={2}
                      name={"email"}
                    />
                    <div className="input-icon-sst">
                      <i className="bi bi-envelope-fill border-end pe-2"></i>
                    </div>
                    <div
                      className="input-icon-sst right-icon-sst"
                      onClick={() => setVal({ ...val, ["email"]: "" })}
                    >
                      <i className="bi bi-x"></i>
                    </div>
                  </div>
                  {errors.email?.message && (
                    <p className="text-danger">{errors.email.message}</p>
                  )}
                  <div className="d-md-flex justify-content-md-center mt-4 text-center">
                    <button
                      className="btn btn-primary login-page-btn-sst p-2"
                      tabIndex={0}
                      type="button"
                      onClick={handleSignInClick}
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


export default LoginStart;
