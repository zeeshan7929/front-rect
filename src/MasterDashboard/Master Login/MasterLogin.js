import React, { useState } from "react";
import { NavLink, json, useNavigate } from "react-router-dom";
import { Form, Formik, Field } from "formik";
import * as yup from "yup";
import * as Yup from "yup";
import { postData } from "../../clientDashboard/Common/fetchservices";
import "react-toastify/dist/ReactToastify.css";
import { toaster } from "../../clientDashboard/Common/Others/Toaster";
const MasterLogin = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const [initialValue, setInitialValue] = useState({
    email: "",
    password: "",
  });

  const validationschema = yup.object().shape({
    email: Yup.string().email().required("Please Enter Email"),
    password: Yup.string()
      .required("Please Enter the password")
      .min(6, "Password is too short - should be 6 chars minimum"),
  });
  const submitHandler = async (value, { resetForm }) => {
    const data = {
      email: value?.email,
      password: value?.password,
    };

    const res = await postData("m_login", data);
    if (res !== undefined) {
      localStorage.setItem("m_login", JSON.stringify(res?.result));
    }

    if (res?.result?.logged) {
      const body = {
        email: value?.email,
      };
      const res2 = await postData("m_request_otp", body);
      if (res2?.result == "OTP sent!") {
        toaster(true, "Success");
        setTimeout(() => {
          navigate("/master-verify-otp");
        }, 2000);
      } else {
        toaster(false, "OTP Did Not Match");
      }
    } else {
      toaster(false, "Email & Password din't Match");
    }
    resetForm();
  };

  const handleSignUp = () => {
    navigate("/common");
  };
  return (
    <main className="container-fluid">
      <div className="row mainInner">
        <div className="col-12 px-0 flex-fill" data-page-name="loginPage">
          <div className="container-fluid loginPageFluid">
            <div className="container loginPageContainer">
              <div className="row">
                <div className="col-12">
                  <div className="loginPageMainHeading">
                    DPA
                    <br />
                    Master Dashboard
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="row d-flex justify-content-end loginFormRow">
                  <div className="col-lg-6 col-12">
                    <div className="row">
                      <Formik
                        initialValues={initialValue}
                        onSubmit={(value, resetForm) =>
                          submitHandler(value, resetForm)
                        }
                        validationSchema={validationschema}
                        enableReinitialize={true}
                      >
                        {(formik) => {
                          return (
                            <>
                              {" "}
                              <Form>
                                <div className="col-12">
                                  <Field
                                    type="email"
                                    className="loginInp form-control mb-4"
                                    name="email"
                                    id
                                    placeholder="Email"
                                  />
                                </div>
                                <p className="text-danger text-start">
                                  {formik.touched.email && formik.errors.email
                                    ? formik.errors.email
                                    : ""}
                                </p>
                                <div className="col-12 position-relative mb-2">
                                  <Field
                                    type={show == false ? "text" : "password"}
                                    className="loginInp form-control"
                                    name="password"
                                    id
                                    placeholder="Password"
                                  />

                                  <div
                                    className="openEye"
                                    role="button"
                                    onClick={() => setShow((prev) => !prev)}
                                  >
                                    <img
                                      src="assets/img/svg/eye-open.svg"
                                      className
                                      alt
                                    />
                                  </div>
                                </div>
                                <p className="text-danger text-start">
                                  {formik.touched.password &&
                                  formik.errors.password
                                    ? formik.errors.password
                                    : ""}
                                </p>
                                <div className="col-12">
                                  <div className="forgotSection row">
                                    <div className="col-auto forgotSection1 d-none">
                                      <div>Incorrect login details</div>
                                    </div>
                                    <NavLink
                                      to="/master-reset-password"
                                      state={{ email: formik.values.email }}
                                      className="col forgotSection2 pointer"
                                    >
                                      <div>Forgot your login details?</div>
                                    </NavLink>
                                  </div>
                                </div>
                                <div className="col-12">
                                  <button className="loginBtn" type="submit">
                                    Login
                                  </button>
                                </div>
                              </Form>
                              
                            </>
                          );
                        }}
                      </Formik>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MasterLogin;
