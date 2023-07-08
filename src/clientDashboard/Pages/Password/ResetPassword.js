import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import * as Yup from "yup";
import { useLocation } from "react-router-dom";
import { postData } from "../../Common/fetchservices";
import { toaster } from "../../Common/Others/Toaster";
import { ToastContainer } from "react-toastify";
const ResetPassword = () => {
  const location = useLocation();
  const [Email, setEmail] = useState("");
  const [initialValue, setInitialValue] = useState({
    email: "",
  });

  const validationschema = yup.object().shape({
    email: Yup.string().email().required("Please Enter Email"),
  });

  const submitHandler = async (value, { resetForm }) => {
    const body = {
      email: Email,
    };
    const res = await postData("reset_user_password", body);
    if (res) {
      resetForm();
      toaster(true);
    } else {
      toaster(false);
    }
  };
  const onEmailChange = (e, setFieldValue) => {
    const domain = e.target.value;
    setEmail(domain);
    setFieldValue("email", domain);
  };
  return (
    <div className="container-fluid">
         <ToastContainer autoClose={1000}></ToastContainer>
      <div className="row mainInner">
        <div className="col-12 px-0 flex-fill" data-page-name="loginPage">
          <div className="container-fluid loginPageFluid">
            <div className="container loginPageContainer">
              <div className="row">
                <div className="col-12">
                  <div className="loginPageMainHeading">Password Reset</div>
                </div>
              </div>
              <div className="col-12">
                <div className="row d-flex justify-content-end loginFormRow">
                  <div className="col-lg-6 col-12">
                    <Formik
                      initialValues={initialValue}
                      validationSchema={validationschema}
                      onSubmit={(value, resetForm) =>
                        submitHandler(value, resetForm)
                      }
                      enableReinitialize={true}
                    >
                      {(formik) => {
                        return (
                          <Form>
                            <div className="row">
                              <div className="col-12">
                                <Field
                                  type="email"
                                  className="loginInp form-control mb-1"
                                  name="email"
                                  onChange={(ev) =>
                                    onEmailChange(ev, formik.setFieldValue)
                                  }
                                  id
                                  placeholder="Key in your e-mail"
                                />
                                <p className="text-danger text-start">
                                  {formik.touched.email && formik.errors.email
                                    ? formik.errors.email
                                    : ""}
                                </p>
                              </div>
                              <div className="col-12">
                                <div className="resetTxt">
                                  You will receive an e-mail with a reset link
                                  if you are registered with us.
                                </div>
                              </div>
                              <div className="col-12 mt-5">
                                <button className="loginBtn" type="submit">
                                  Send Reset Link
                                </button>
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
  );
};

export default ResetPassword;
