import React from "react";
import { Link } from "react-router-dom";

const MSuccessPassword = () => {
  return (
    <div className="container-fluid">
      <div className="row mainInner">
        <div className="col-12 px-0 flex-fill" data-page-name>
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
                    <div className="row">
                      <div className="col-12">
                        <div className="resetTxt text-center">
                          Password Reset Link successfully sent.
                          <br /> Check your spam/junk folder.
                        </div>
                      </div>
                      <div className="col-12 mt-4">
                        <Link to="/master-login">
                          <button className="loginBtn">
                            Return to login page
                          </button>
                        </Link>
                      </div>
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

export default MSuccessPassword;
