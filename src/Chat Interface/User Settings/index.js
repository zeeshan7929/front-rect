import React, { useState } from "react";
import Sidebar from "../Common/Sidebar/Sidebar";
import { postData } from "../../clientDashboard/Common/fetchservices";
import { Formik, Form, Field } from "formik";
import { useImageToBase64 } from "../Common/blob/blob";
import * as yup from "yup";
import * as Yup from "yup";
import Header from "../Common/Header/Header";
import Modal from "../../clientDashboard/Common/Modal";
import { toaster } from "../../clientDashboard/Common/Others/Toaster";
function UserSetting({ sideBar, setSidebarOpen }) {
  const { base64Image, convertToBase64 } = useImageToBase64();
  let ids = JSON.parse(localStorage.getItem("a_login"));

  const [images, setimages] = useState([]);
  const [modalOpen, setModelOpen] = useState(false);
  const [modalOpen1, setModelOpen1] = useState(false);
  const [bodyState, setBodyState] = useState({});
  const [showOP, setShowOP] = useState(false);
  const [showNP, setShowNP] = useState(false);
  const [showCP, setShowCP] = useState(false);

  const [passwordvalue, setpasswordvalue] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const validationschemas = yup.object().shape({
    old_password: Yup.string().required("Please Enter Old Password"),
    new_password: Yup.string().required("Password is required"),
    confirm_password: Yup.string().oneOf(
      [Yup.ref("new_password"), null],
      "Passwords must match"
    ),
  });

  const passwordfun = (val) => {
    const body = {
      user_id: String(ids.user_id),
      old_password: val.old_password,
      new_password: val.new_password,
    };
    setModelOpen1(true);
    setBodyState(body);
  };

  const handleUpdatePassword = async () => {
    const res = await postData("u_update_user_auth_info", bodyState);
    if (res.result == "success") {
      toaster(true, "Success");
    } else {
      toaster(false, "Something went wrong");
    }
    setBodyState({});
    setModelOpen1(false);
  };

  const [initialValue, setInitialValue] = useState({
    name: "",
    email: "",
    profile_image: "",
  });
  const validationschema = yup.object().shape({
    name: Yup.string().required("Please Enter Name"),
    email: Yup.string().email().required("Please Enter Email"),
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    convertToBase64(file);
  };

  const submitHandler = (val) => {
    const body = {
      user_id: String(ids.user_id),
      name: val.name,
      email: val.email,
      profile_image: base64Image,
    };
    setModelOpen(true);
    setBodyState(body);
  };

  const hanldeUpdateUserInfo = async () => {
    const res = await postData("u_update_user_info", bodyState);
    if (res.result == "success") {
      toaster(true, "Success");
    } else {
      toaster(false, "Something went wrong");
    }
    setBodyState({});
    setModelOpen(false);
  };
  return (
    <main className="container-fluid h-100">
      <div className="row chatbotMainInner h-100">
        <div className="col-12 px-0 h-100" data-page-name="Homepage">
          <div className="container-fluid h-100">
            <div
              className={`row h-100 mx-0 menuIcon ${
                sideBar == "cgrid" ? "show" : ""
              }`}
            >
              <Sidebar sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
              <div className="col-auto rightPart px-0 h-100">
                <div className="row mx-0 h-100 flex-column flex-nowrap overflow-hidden">
                  <div className="col-12 topPart ">
                    <div className="row h-100 mx-0 align-items-center">
                      <Header
                        title={"Users Settings"}
                        setSidebarOpen={setSidebarOpen}
                      />
                    </div>
                  </div>
                  <div className="col-12 mainPart flex-fill overflow-hidden-auto carmenDashboard">
                    {
                      <Formik
                        initialValues={initialValue}
                        onSubmit={(value, resetForm) =>
                          submitHandler(value, resetForm)
                        }
                        validationSchema={validationschema}
                      >
                        {(formik) => {
                          return (
                            <Form>
                              <div className="row mx-0 marginClass">
                                <div className="col-12 ps-md-5 px-0 pe-lg-3 position-relative">
                                  <div className="sideTxt">
                                    Basic Information
                                  </div>
                                  <div className="profileSection mt-md-5 mt-2">
                                    <div className="row align-items-center">
                                      <div className="col-sm-auto col-12 mb-2 mb-sm-0 position-relative">
                                        <div className="profileImg">
                                          <img
                                            src={
                                              base64Image
                                                ? images
                                                : "./../assets/img/Avatar2.png"
                                            }
                                            alt=""
                                          />
                                        </div>
                                        <label for="aa" className="fileLbl">
                                          <img
                                            src="./../assets/img/svg/edit.svg"
                                            alt=""
                                          />
                                        </label>
                                        <input
                                          type="file"
                                          className="d-none"
                                          name="profile_image"
                                          id="aa"
                                          onChange={(event) => {
                                            formik.setTouched({
                                              ...formik.touched,
                                              file: true,
                                            });
                                            formik.setFieldValue(
                                              "profile_image",
                                              event.target.files[0],
                                              setimages(
                                                URL.createObjectURL(
                                                  event.target.files[0]
                                                )
                                              ),
                                              handleImageUpload(event)
                                            );
                                          }}
                                        />
                                      </div>
                                      <div className="col">
                                        <div className="row">
                                          <div className="col-12">
                                            <div className="profileName">
                                              Profile photo
                                            </div>
                                          </div>
                                          <div className="col-12">
                                            <div className="profileDescription">
                                              This will be displayed on your
                                              profile.
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="row pt-3">
                                      <div className="col-sm-6 col-12 position-relative">
                                        <label for="" className="userLbl">
                                          Name
                                        </label>
                                        <Field
                                          type="text"
                                          className="userInp form-control shadow-none"
                                          name="name"
                                          id=""
                                          placeholder="Carmen"
                                        />
                                        <div className="userImg">
                                          <img
                                            src="./../assets/img/svg/userdark.svg"
                                            alt=""
                                          />
                                          <p className="text-danger mt-3">
                                            {formik.touched.name &&
                                            formik.errors.name
                                              ? formik.errors.name
                                              : ""}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="col-sm-6 col-12 position-relative">
                                        <label
                                          for=""
                                          className="userLbl mt-2 mt-sm-0"
                                        >
                                          Email Address
                                        </label>
                                        <Field
                                          type="email"
                                          className="userInp form-control shadow-none"
                                          name="email"
                                          id=""
                                          placeholder="carmen@teams.co"
                                        />
                                        <div className="userImg">
                                          <img
                                            src="./../assets/img/svg/mailDark.svg"
                                            alt=""
                                          />
                                          <p className="text-danger mt-3">
                                            {formik.touched.email &&
                                            formik.errors.email
                                              ? formik.errors.email
                                              : ""}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="col-12 d-flex justify-content-end mt-4">
                                        <button
                                          className="updateBtn"
                                          type="submit"
                                          // data-bs-toggle="modal"
                                          // data-bs-target="#exampleModal"
                                        >
                                          Update
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Form>
                          );
                        }}
                      </Formik>
                    }
                    <div className="row mx-0 marginClass">
                      <div className="col-12 ps-md-5 px-0 pe-lg-3 position-relative">
                        <div className="sideTxt1">Password</div>
                        {
                          <Formik
                            initialValues={passwordvalue}
                            onSubmit={(value, resetForm) =>
                              passwordfun(value, resetForm)
                            }
                            validationSchema={validationschemas}
                          >
                            {(formik) => {
                              return (
                                <Form>
                                  <div className="profileSection">
                                    <div className="row pt-3">
                                      <div className="col-sm-6 col-12 position-relative">
                                        <Field
                                          type={showOP ? "text" : "password"}
                                          className="passInp form-control shadow-none"
                                          name="old_password"
                                          id=""
                                          placeholder="Enter Current Password"
                                        />
                                        <div className="passImg">
                                          <img
                                            src="./../assets/img/svg/key.svg"
                                            alt=""
                                          />
                                          <p className="text-danger mt-3">
                                            {formik.touched.old_password &&
                                            formik.errors.old_password
                                              ? formik.errors.old_password
                                              : ""}
                                          </p>
                                        </div>
                                        <div
                                          className="openEye"
                                          onClick={() =>
                                            setShowOP((prev) => !prev)
                                          }
                                        >
                                          {showOP ? (
                                            <i class="bi bi-eye"></i>
                                          ) : (
                                            <i class="bi bi-eye-slash"></i>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-sm-6 col-12 mt-3 mt-sm-0 position-relative">
                                        <Field
                                          type={showNP ? "text" : "password"}
                                          className="passInp form-control shadow-none"
                                          name="new_password"
                                          id=""
                                          placeholder="Enter new Password"
                                        />
                                        <div className="passImg">
                                          <img
                                            src="./../assets/img/svg/key.svg"
                                            alt=""
                                          />
                                          <p className="text-danger mt-3">
                                            {formik.touched.new_password &&
                                            formik.errors.new_password
                                              ? formik.errors.new_password
                                              : ""}
                                          </p>
                                        </div>
                                        <div
                                          className="openEye"
                                          onClick={() =>
                                            setShowNP((prev) => !prev)
                                          }
                                        >
                                          {showNP ? (
                                            <i class="bi bi-eye"></i>
                                          ) : (
                                            <i class="bi bi-eye-slash"></i>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-12 mt-5">
                                        <div className="row d-flex justify-content-end">
                                          <div className="col-sm-6 col-12 position-relative">
                                            <Field
                                              type={
                                                showCP ? "text" : "password"
                                              }
                                              className="passInp form-control shadow-none"
                                              name="confirm_password"
                                              id=""
                                              placeholder="Confirm new password"
                                            />

                                            <div className="passImg">
                                              <img
                                                src="./../assets/img/svg/key.svg"
                                                alt=""
                                              />
                                              <p className="text-danger mt-3">
                                                {formik.touched
                                                  .confirm_password &&
                                                formik.errors.confirm_password
                                                  ? formik.errors
                                                      .confirm_password
                                                  : ""}
                                              </p>
                                            </div>
                                            <div
                                              className="openEye"
                                              onClick={() =>
                                                setShowCP((prev) => !prev)
                                              }
                                            >
                                              {showCP ? (
                                                <i class="bi bi-eye"></i>
                                              ) : (
                                                <i class="bi bi-eye-slash"></i>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-12 d-flex justify-content-end mt-3">
                                        <button
                                          className="updateBtn "
                                          type="submit"
                                        >
                                          Update
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </Form>
                              );
                            }}
                          </Formik>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        type={modalOpen ? "Update User Info" : "Update Password"}
        modelOpen={modalOpen ? modalOpen : modalOpen1}
        setModelOpen={modalOpen ? setModelOpen : setModelOpen1}
        hanldeFunction={modalOpen ? hanldeUpdateUserInfo : handleUpdatePassword}
      />
    </main>
  );
}

export default UserSetting;
