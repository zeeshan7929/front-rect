import React, { useState } from "react";
import { Form, Formik, Field } from "formik";
import * as yup from "yup";
import * as Yup from "yup";

const ChangePassword = () => {
  const [show, setShow] = useState(true);
  const [show1, setShow1] = useState(true);
  const [initialValue, setInitialValue] = useState({
    password: "",
    confirmPassword: "",
  });

  const validationschema = yup.object().shape({
    confirmPassword: Yup.string()
      .required("Please Enter the password")
      .min(6, "Password is too short - should be 6 chars minimum"),

    password: Yup.string()
      .required("Please Enter the password")
      .min(6, "Password is too short - should be 6 chars minimum"),
  });
  const submitHandler = (value, { resetForm }) => {
    resetForm();
  };

  return (
    <div class="container-fluid">
      <div class="row mainInner">
        <div class="col-12 px-0 flex-fill" data-page-name="loginPage">
          <div class="container-fluid loginPageFluid">
            <div class="container loginPageContainer">
              <div class="row">
                <div class="col-12">
                  <div class="loginPageMainHeading">Password Reset</div>
                </div>
              </div>
              <div class="col-12">
                <div class="row d-flex justify-content-end loginFormRow">
                  <div class="col-lg-6 col-12">
                    <div class="row">
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
                                <div class="col-12">
                                  <div class="resetTxt">
                                    * Password needs to contain numbers &
                                    letters
                                  </div>
                                </div>
                                <div class="col-12 position-relative mb-4 mt-2">
                                  <Field
                                    type={show == false ? "text" : "password"}
                                    class="loginInp form-control"
                                    name="password"
                                    id=""
                                    placeholder="Password"
                                  />
                                  <div
                                    class="openEye"
                                    role="button"
                                    onClick={() => setShow((prev) => !prev)}
                                  >
                                    <img
                                      src="assets/img/svg/eye-open.svg"
                                      class=""
                                      alt=""
                                    />
                                  </div>
                                  <p className="text-danger text-start">
                                    {formik.touched.password &&
                                    formik.errors.password
                                      ? formik.errors.password
                                      : ""}
                                  </p>
                                </div>
                                <div class="col-12 position-relative mb-2">
                                  <Field
                                    type={show1 == false ? "text" : "password"}
                                    class="loginInp form-control"
                                    name="confirmPassword"
                                    id=""
                                    placeholder="Password"
                                  />
                                  <div
                                    class="openEye"
                                    role="button"
                                    onClick={() => setShow1((prev) => !prev)}
                                  >
                                    <img
                                      src="assets/img/svg/eye-open.svg"
                                      class=""
                                      alt=""
                                    />
                                  </div>
                                  <p className="text-danger text-start">
                                    {formik.touched.confirmPassword &&
                                    formik.errors.confirmPassword
                                      ? formik.errors.confirmPassword
                                      : ""}
                                  </p>
                                </div>
                                <div class="col-12 d-none">
                                  <div class="forgotSection row">
                                    <div class="col-auto forgotSection1">
                                      <div></div>
                                    </div>
                                    <a
                                      href="javascript:;"
                                      class="col forgotSection2 text-danger"
                                    >
                                      <div>Password does not match</div>
                                    </a>
                                  </div>
                                </div>
                                <div class="col-12">
                                  <button class="loginBtn" type="submit">
                                    Change Password
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
    </div>
  );
};

export default ChangePassword;
