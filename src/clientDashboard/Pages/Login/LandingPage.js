import React from "react";
import { NavLink } from "react-router-dom";

const LandingPage = () => {
  return (
    <main className="container-fluid">
      <div className="row mainInner">
        <div className="col-12 px-0 flex-fill" data-page-name="loginPage">
          <div className="container-fluid loginPageFluid">
            <div className="container loginPageContainer">
              {/* <div className="row">
                <div className="col-12">
                  <div className="loginPageMainHeading">
                    Database
                    <br />
                    Personal Assistant
                  </div>
                </div>
              </div> */}
              <div className="col-12">
                <div className="row d-flex justify-content-center loginFormRow">
                  <div className="col-lg-6 col-12">
                    <div className="row">
                      <div>
                        <div>
                          <div
                            className="col-12 my-4"
                            style={{ color: "#7d7d7d" }}
                          >
                            Already have an account?
                          </div>
                          <NavLink to="/assistant-login" className="col-12">
                            <button className="loginBtn" type="submit">
                              Login
                            </button>
                          </NavLink>
                          <div
                            className="col-12 my-4"
                            style={{ color: "#7d7d7d" }}
                          >
                            Don't have an account?
                          </div>
                          <NavLink to="/sign-up" className="col-12">
                            <button className="loginBtn" type="submit">
                              Sign Up
                            </button>
                          </NavLink>
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
    </main>
  );
};

export default LandingPage;
