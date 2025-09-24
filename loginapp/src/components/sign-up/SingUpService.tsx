import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";

interface AppSettings {
  AppSettings: {
    BaseUrlPath: string;
  };
}

let FileFound: AppSettings | "error" = "error";

// Fetch settings
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

// Function to register a user
export const RegisterUser = async (data: any): Promise<boolean> => {
if(FileFound == 'error' || FileFound.AppSettings.BaseUrlPath == '' || FileFound.AppSettings.BaseUrlPath == undefined || FileFound.AppSettings.BaseUrlPath == null){ 
      Swal.fire({
          title: 'Oops, Something Went Wrong',
          text: 'We encountered an issue while trying to complete your request. This might be due to a system error.Please try again later, or reach out to your system administrator or support team for assistance.',
          icon: 'error',
          width: '600px',
          confirmButtonText: 'Ok'
      });
  } else {
    Swal.showLoading();
    return axios.post(`${(FileFound as AppSettings).AppSettings.BaseUrlPath}api/Account/Register`, data)
      .then((response: AxiosResponse<any>) => {
        if (response.data.success === true) {
          Swal.fire({
            title: 'User Registered Successfully, Please Login to continue',
            icon: 'success',
            timer: 3000,
          });
          return true;
        } else {
          Swal.fire({
            title: response.data.message,
            icon: 'warning',
            showConfirmButton: false,
          });
          return false;
        }
      }).catch((err: any) => {
        Swal.fire({
          text: err.response?.data?.errors?.message[0]?.errors[0],
          icon: 'error'
        });
        return false;
      });
  }
  return false;
};