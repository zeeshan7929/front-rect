import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { postData } from "../../Common/fetchservices";
import { ErrorText } from "../../Common/Others/ErrorText";

const AssistantVerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let ids = location?.state?.ids;
  const [countDown, setCountDown] = useState(180);
  useEffect(() => {
    const count = setInterval(() => setCountDown((prev) => prev - 1), 1000);
    return () => {
      return clearInterval(count);
    };
  }, []);

  const formatTimer = (seconds) => {
    const minuts = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minuts.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const hanldleLogin = async (otp) => {
    const body = {
      otp: otp.otp,
      user_id: String(ids?.user_id),
    };
    const res = await postData("verify_otp ", body);
    if (!res.verified) {
      navigate("/dashboard", { state: { ids } });
    }
  };

  const otpSchema = yup.object().shape({
    otp: yup
      .string()
      .min(6, "OTP must be 6 digit")
      .max(6, "OTP must be 6 digit")
      .required("Incorrect OTP !"),
  });
  return (
    <div className="container-fluid">
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
                    <Formik
                      initialValues={{ otp: "" }}
                      validationSchema={otpSchema}
                      onSubmit={hanldleLogin}
                    >
                      {({ values, touched, errors }) => {
                        return (
                          <Form>
                            <div className="row">
                              <div className="col-12 position-relative">
                                <div className="formTopTxt">
                                  A 2FA One-Time-Password was sent to your
                                  e-mail
                                </div>
                                <button className="resendBtn">Resend</button>
                              </div>
                              <div className="col-12">
                                <Field
                                  type="number"
                                  className="loginInp form-control mb-1"
                                  name="otp"
                                  // onChange={(e) => setOtp("1234")}
                                  placeholder="Enter OTP"
                                />
                              </div>

                              <div className="col-12">
                                <div className="forgotSection row">
                                  <div className="col-auto forgotSection1 forgotSection1Colour">
                                    {/* <div>Incorrect OTP</div> */}
                                    {touched.otp && errors.otp ? (
                                      <ErrorMessage
                                        name="otp"
                                        component={ErrorText}
                                      />
                                    ) : null}
                                  </div>
                                  <div className="col forgotSection2 forgotSection2Colour">
                                    {countDown > 0 ? (
                                      <div>
                                        Resend OTP after{" "}
                                        {formatTimer(countDown)} mins
                                      </div>
                                    ) : (
                                      <div>OTP has expired</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="col-12">
                                <button type="submit" className="loginBtn">
                                  Login
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
export default AssistantVerifyOtp;
