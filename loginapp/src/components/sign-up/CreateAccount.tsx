import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RegisterUser } from "./SingUpService";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: number;
  password: string;
  confirmPassword: string;
  districtName: string;
  schoolName: string;
}

const CreateAccount: React.FC = () => {

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const emlurl = searchParams.get("email");
    const fnameurl = searchParams.get("firstname");
    const lnameurl = searchParams.get("lastname");
    setValue("email", emlurl || '');
    setValue("firstName", fnameurl || '');
    setValue("lastName", lnameurl || '');
  }, []);

  const [val, setVal] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: 0,
    password: '',
    confirmPassword: '',
    districtName: '',
    schoolName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [confPassword, setConfPassword] = useState(false);
  const [btnshow, setBtnshow] = useState(false);

  //validation schema for form
  const schema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    phoneNumber: yup.number().required().positive().integer().max(9999999999, 'mobile number not more than 11 digit').min(1000000000, 'mobile number should be 10 digit'),
    password: yup.string().required().min(6, 'Password must be at least 6 characters').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{6,}$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character').max(15, 'Password must be at most 15 characters'),
    confirmPassword: yup.string().required().min(6, 'Password must be at least 6 characters').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{6,}$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character').max(15, 'Password must be at most 15 characters'),
    districtName: yup.string().required(),
    schoolName: yup.string().required()
  }).required();

  const { register, handleSubmit, setValue, clearErrors, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const haChange = (e: any) => {
    const { name, value } = e.target;
    setVal({ ...val, [name]: value })
  }

  // event handler for password show or hide
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  //event handler for confirm password show or hide
  const confPasswordVisibility = () => { setConfPassword(!confPassword) }

  //function for register user
  const handleRegister = async (data: any) => {
    if (data.password === data.confirmPassword) {
      const finalData = {
        ...data,
        roleName: "User",
        id: 0,
        phoneNumber: JSON.stringify(data.phoneNumber),
      };
  
      try {
        await RegisterUser(finalData);
  
        // Show success message even if no response
        Swal.fire({
          title: "Registration Successful!",
          text: "Your account has been registered successfully.",
          icon: "success",
        }).then(() => {
          navigate("/"); // Redirect after success
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "An unexpected error occurred. Please try again later.",
          icon: "error",
        });
      }
    } else {
      Swal.fire({
        title: "Error",
        text: "Password and Confirm Password should be the same.",
        icon: "error",
      });
    }
  };
  
  

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/@progress/kendo-theme-material/dist/all.css"></link>
      <div className="login-pg-bg">
        <div className="full-width-sm-device center-sign-signup py-3">
          <div className="grand-parent-container">
            <div className="parent-container">
              <div className="login-hold-head p-3">
                <div className="logo-space flex justify-center"><img className="img-fluid fs-5" tabIndex={0} src='/assets/Images/logo.svg' alt="logo" /></div>
              </div>
              <div className="login-cnt-signup">

                <div className="text-center">
                  <p className="mb-1 fs-4 fw-bold common-color"> New User Registration</p>
                  <small className=""> Nice to see you back. Enter your password to login. </small>
                </div>

                <div className="text-left mt-3">
                  <p className='login-page-res-text-sst mb-1 fs-6 fw-bold' tabIndex={0}>Register for an account.</p>
                  <small className='' tabIndex={0}>Enter your information below to register for an account. Your account will be submitted for review. You will be notified when your account has been approved.</small>
                </div>


                <form method='#' action='/' onSubmit={handleSubmit((data) => { handleRegister(data); })}>

                  <div className="mb-3 mt-3 row">
                    <div className="col-lg-3 col-md-3 col-sm-12 col-12 d-flex align-items-center">
                      <label className="fw-bold">FirstName</label>
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-12 col-12 position-relative">
                      <input {...register('firstName', { required: true })} tabIndex={0} title="Enter FirstName value" className='form-control form-border signup-input-box-sst' type='text' placeholder="FirstName" name={'firstName'} />
                      <div className="input-icon-sst right-icon-sst-singup" >
                        <i className="bi bi-x" onClick={() => { setValue("firstName", ""); clearErrors(['firstName']) }}></i>
                      </div>
                    </div>
                    {errors.firstName && <p className='text-danger mb-0'>First Name is required.</p>}
                  </div>

                  <div className="mb-3 mt-3 row">
                    <div className="col-lg-3 col-md-3 col-sm-12 col-12 d-flex align-items-center">
                      <label className="fw-bold">LastName</label>
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-12 col-12 position-relative">
                      <input {...register('lastName', { required: true })} tabIndex={0} title="Enter LastName value" className='form-control form-border signup-input-box-sst' type='text' placeholder="LastName" name={'lastName'} />
                      <div className="input-icon-sst right-icon-sst-singup" >
                        <i className="bi bi-x" onClick={() => { setValue("lastName", ""); clearErrors(['lastName']) }}></i>
                      </div>
                    </div>
                    {errors.lastName && <p className='text-danger mb-0'>Last Name is required.</p>}
                  </div>

                  <div className="mb-3 mt-3 row">
                    <div className="col-lg-3 col-md-3 col-sm-12 col-12 d-flex align-items-center">
                      <label className="fw-bold">Email</label>
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-12 col-12 position-relative">
                    <input {...register('email', { required: true })} tabIndex={0} title="Enter Email Address value" className='form-control form-border signup-input-box-sst' type='email' placeholder="Email Address" name={'email'} />
                    <div className="input-icon-sst right-icon-sst-singup" >
                      <i className="bi bi-x" onClick={() => { setValue("email", ""); clearErrors(['email']) }}></i>
                    </div>
                    </div>
                    {errors.email && <p className='text-danger mb-0'>Email Address is required.</p>}
                  </div>

                  <div className="mb-3 mt-3 row">
                    <div className="col-lg-3 col-md-3 col-sm-12 col-12 d-flex align-items-center">
                      <label className="fw-bold">MobileNumber</label>
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-12 col-12 position-relative">
                    <input {...register('phoneNumber', { required: true })} tabIndex={0} title="Enter Mobile Number value" className='form-control form-border signup-input-box-sst' type='number' placeholder="Mobile Number" min={0} name={'phoneNumber'} />
                    <div className="input-icon-sst right-icon-sst-singup" >
                      <i className="bi bi-x" onClick={() => { setValue("phoneNumber", 0); clearErrors(['phoneNumber']) }}></i>
                    </div>
                    </div>
                    {errors.phoneNumber && <p className='text-danger mb-0'>Mobile Number is required.</p>}
                  </div>

                  <div className="mb-3 mt-3 row">
                    <div className="col-lg-3 col-md-3 col-sm-12 col-12 d-flex align-items-center">
                      <label className="fw-bold">Password</label>
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-12 col-12 position-relative">
                    <input {...register('password', { required: true })} tabIndex={0} title="Enter Password value" className='form-control form-border signup-input-box-sst-pass' type={showPassword ? "text" : "password"} placeholder="Password" minLength={2} name={'password'} />
                    <div className="input-icon-sst right-icon-pass-sst-signup">
                      <i className="bi bi-x login-page-pass-crossicon" onClick={() => { setValue("password", ''); clearErrors(['password']) }}></i>
                      <span className="separator-pass-sst"></span>
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} login-page-pass-eyeicon`} onClick={() => togglePasswordVisibility()}></i>
                    </div>
                    </div>
                    {errors.password && <p className='text-danger mb-0'>{errors.password?.message}</p>}
                  </div>

                  <div className="mb-3 mt-3 row">
                    <div className="col-lg-3 col-md-3 col-sm-12 col-12 d-flex align-items-center">
                      <label className="fw-bold">ConfirmPassword</label>
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-12 col-12 position-relative">
                    <input {...register('confirmPassword', { required: true })} tabIndex={0} title="Enter Confirm Password value" className='form-control form-border signup-input-box-sst-pass' type={confPassword ? "text" : "password"} placeholder="Confirm Password" minLength={2} name={'confirmPassword'} />
                    <div className="input-icon-sst right-icon-pass-sst-signup">
                      <i className="bi bi-x login-page-pass-crossicon" onClick={() => { setValue("confirmPassword", ""); clearErrors(['confirmPassword']) }}></i>
                      <span className="separator-pass-sst"></span>
                      <i className={`bi ${confPassword ? 'bi-eye-slash' : 'bi-eye'} login-page-pass-eyeicon`} onClick={() => confPasswordVisibility()}></i>
                    </div>
                    </div>
                    {errors.confirmPassword && <p className='text-danger mb-0'>{errors.confirmPassword?.message}</p>}
                  </div>

                  <div className="mb-3 mt-3 row">
                    <div className="col-lg-3 col-md-3 col-sm-12 col-12 d-flex align-items-center">
                      <label className="fw-bold">DistrictName</label>
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-12 col-12 position-relative">
                    <input {...register('districtName', { required: true })} tabIndex={0} title="Enter DistrictName value" className='form-control form-border signup-input-box-sst' type='text' placeholder="District Name" name={'districtName'} />
                    <div className="input-icon-sst right-icon-sst-singup" >
                      <i className="bi bi-x" onClick={() => { setValue("districtName", ""); clearErrors(['districtName']) }}></i>
                    </div>
                    </div>
                    {errors.districtName && <p className='text-danger mb-0'>District Name is required.</p>}
                  </div>

                  <div className="mb-3 mt-3 row">
                    <div className="col-lg-3 col-md-3 col-sm-12 col-12 d-flex align-items-center">
                      <label className="fw-bold">SchoolName</label>
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-12 col-12 position-relative">
                    <input {...register('schoolName', { required: true })} tabIndex={0} title="Enter SchoolName value" className='form-control form-border signup-input-box-sst' type='text' placeholder="School Name" name={'schoolName'} />
                    <div className="input-icon-sst right-icon-sst-singup" >
                      <i className="bi bi-x" onClick={() => { setValue("schoolName", ""); clearErrors(['schoolName']) }}></i>
                    </div>
                    </div>
                    {errors.schoolName && <p className='text-danger mb-0'>School Name is required.</p>}
                  </div>


                  <div className="d-flex justify-content-end mt-4" >
                    <button className='btn btn-light p-2 m-1' onClick={()=>navigate('/')} tabIndex={0} type="button">Cancel</button>
                    <button className='btn btn-primary login-page-btn-sst w-auto p-2 m-1' tabIndex={0} type="submit">Submit Registration</button>
                  </div>
                </form>


              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


export default CreateAccount
