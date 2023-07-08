import React, { useState } from "react";
import { Form, Formik, Field } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import * as Yup from "yup";
import { postData } from "../../Common/fetchservices";
import "react-toastify/dist/ReactToastify.css";
import { toaster } from "../../Common/Others/Toaster";

const AssistantLogin = () => {
  const [show, setShow] = useState(true);
  const [Email, setEmail] = useState("");
  const navigate = useNavigate();
  const [initialValue, setInitialValue] = useState({
    email: "",
    password: "",
  });
  const handleSignUp = () => {
    navigate("/common");
  };
  const validationschema = yup.object().shape({
    email: Yup.string().email().required("Please Enter Email"),

    password: Yup.string().required("Please Enter the password"),
    // .min(6, "Password is too short - should be 6 chars minimum"),
  });
  const submitHandler = async (value, { resetForm }) => {
    const data = {
      email: value?.email,
      password: value?.password,
    };
    const res = await postData("login", data);
    if (res?.result !== undefined) {
      localStorage.setItem("a_login", JSON.stringify(res?.result));
    }

    if (res.result.login !== "failed") {
      const data = {
        email: value.email,
        user_id: res.result.user_id,
      };
      const res2 = await postData("request_otp", data);
      if (res2.result == "OTP sent!") {
        resetForm();
        toaster(true, res2.result);
        setTimeout(() => {
          navigate("/verify-otp", {
            state: { email: value.email, ids: res.result },
          });
        }, 1000);
      }
    } else {
      toaster(false, res?.result?.reason);
    }
  };
  const handle = () => {
    navigate("/reset-password", { state: { item: Email } });
  };

  const onEmailChange = (e, setFieldValue) => {
    const domain = e.target.value;
    setEmail(domain);
    setFieldValue("email", domain);
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
                    Database
                    <br />
                    Personal Assistant
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
                            <Form>
                              <div className="col-12">
                                <Field
                                  type="email"
                                  className="loginInp form-control mb-4"
                                  name="email"
                                  onChange={(ev) =>
                                    onEmailChange(ev, formik.setFieldValue)
                                  }
                                  id
                                  placeholder="Email"
                                />
                                <p className="text-danger text-start">
                                  {formik.touched.email && formik.errors.email
                                    ? formik.errors.email
                                    : ""}
                                </p>
                              </div>
                              <div className="col-12 position-relative mb-2">
                                <Field
                                  type={show == false ? "text" : "password"}
                                  className="loginInp form-control"
                                  name="password"
                                  id
                                  placeholder="Password"
                                />
                                <p className="text-danger text-start">
                                  {formik.touched.password &&
                                  formik.errors.password
                                    ? formik.errors.password
                                    : ""}
                                </p>
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
                              <div className="col-12">
                                <div className="forgotSection row">
                                  <div className="col-auto forgotSection1 d-none">
                                    <div>Incorrect login details</div>
                                  </div>
                                  <p className="col forgotSection2">
                                    <div
                                      className="pointer"
                                      onClick={() => handle()}
                                    >
                                      Forgot your login details?
                                    </div>
                                  </p>
                                </div>
                              </div>
                              <div className="col-12">
                                <button className="loginBtn" type="submit">
                                  GET OTP
                                </button>
                              </div>
                              
                              <div
                                // to="/master-reset-password"
                                // state={{ email: formik.values.email }}
                                className="col forgotSection2  mt-4"
                              >
                                <div style={{ color: "#7d7d7d" }}>
                                  Don't have an account?{" "}
                                  <span
                                    className="pointer text-primary"
                                    onClick={handleSignUp}
                                  >
                                    Sign up
                                  </span>
                                </div>
                              </div>
                            </Form>
                            
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

export default AssistantLogin;
