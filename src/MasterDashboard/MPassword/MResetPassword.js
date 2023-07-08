import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import * as Yup from "yup";
import { postData } from "../../clientDashboard/Common/fetchservices";
import { useLocation, useNavigate } from "react-router-dom";

export const MResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [initialValue, setInitialValue] = useState({
    email: location.state.email ? location.state.email : "",
  });

  const validationschema = yup.object().shape({
    email: Yup.string().email().required("Please Enter Email"),
  });

  const submitHandler = async (value, { resetForm }) => {
    const body = {
      email: value.email,
    };
    const res = await postData("m_reset_password", body);
    navigate("/master-change-password");
    resetForm();
  };
  return (
    <div className="container-fluid">
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

export default MResetPassword;
