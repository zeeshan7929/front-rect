import React, { useState, useRef } from "react";
import Sidebar from "../../Common/Sidebar/Sidebar";
import Header from "../../Common/Header/Header";
import { useEffect } from "react";
import { RightSidebar } from "../../Common/Sidebar/RightSidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { postData } from "../../Common/fetchservices";
import { CountConverter } from "../../Common/Others/CountConverter";
import { addBlurClass } from "../../Common/Others/AddBlurClass";
import { toaster } from "../../Common/Others/Toaster";
import { useOnClickOutside } from "../../Common/Others/useOnClickOutside";
import StripeContainer from "../../Common/Stripe/StripeContainer";

const SubscriptionPlan = ({ setSidebarOpen, sideBar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  let item = location?.state?.item;
  let id = location?.state?.id;
  const [plans, setPlans] = useState([]);
  const [isOpen, setIsOpen] = useState("");
  const [plan, setplan] = useState({});
  const [showItem, setShowItem] = useState(false);
  const [stripeId, setStripeId] = useState("");

  const ref = useRef(null);
  const handleTiers = async () => {
    const body = {
      client_id: id,
    };
    const res = await postData("get_all_tiers_info", body);
    setPlans(res?.result);
  };

  const handleUpdateTiers = async () => {
    setIsOpen("");
    const body = {
      client_id: id,
      tier_id: String(plan?.id),
    };
    const res = await postData("upgrade_subscription", body);
    setStripeId(res?.result?.secret);
  };

  useEffect(() => {
    addBlurClass();
    handleTiers();
  }, []);
  const handleOutSide = () => {
    setIsOpen("");
  };
  useOnClickOutside(ref, handleOutSide);
  return (
    <>
      <div className="container-fluid h-100">
        <div className="row mainInner h-100">
          <div
            className="col-12 px-0 flex-fill h-100"
            data-page-name="categoriesPage"
          >
            <div className="container-fluid h-100">
              <div
                className={`row main h-100 menuIcon ${
                  sideBar == "grid" ? "show" : ""
                }`}
              >
                <div className="col-auto px-0 leftPart h-100">
                  <div className="row sideBar h-100">
                    <Sidebar
                      setSidebarOpen={setSidebarOpen}
                      sideBar={sideBar}
                    />
                  </div>
                </div>
                <div className="col rightBgPart px-0 h-100">
                  <div className="row mx-0 h-100">
                    <div className="col px-0 rightPart h-100">
                      <div className="row mx-0 flex-column h-100 flex-nowrap px-3 ps-lg-0 pe-xxl-0">
                        <div className="col-12 px-0 mainContent overflow-hidden h-100 flex-fill">
                          <div className="row h-100 mx-0">
                            <div className="col-12 overflow-hidden-auto h-100 px-0 scrollPart">
                              <div className="row mx-0 sticky-top stickyHeader">
                                <Header
                                  setSidebarOpen={setSidebarOpen}
                                  textHeader={`Billing & Plans`}
                                  textSubHeader={
                                    "welcome carmen, you can find your subscription plan here."
                                  }
                                />
                              </div>
                              <div className="row py-3">
                                <div className="col-12">
                                  <div className="row flex-column mx-0 d-md-none headerHiddenDetails mb-3">
                                    <div className="col pageHeading px-0">
                                      subscription &amp; Plans
                                    </div>
                                    <div className="col pageSubheading px-0">
                                      welcome carmen, you can find all your
                                      billing history here.
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-12">
                                      {plans?.map((el) => {
                                        return (
                                          <div
                                            className="row py-sm-3 py-2"
                                            key={id}
                                          >
                                            <div className="col-12">
                                              <div
                                                className="planDetail"
                                                style={{
                                                  backgroundColor:
                                                    el?.name == "Lite Plan"
                                                      ? "#CAE6E499"
                                                      : el?.name == "Premium"
                                                      ? "#FDE4E499"
                                                      : "#FFF5E599",
                                                }}
                                              >
                                                <div className="row">
                                                  <div className="col">
                                                    <div className="row">
                                                      <div className="col-12">
                                                        <div
                                                          style={{
                                                            fontSize: "28px",
                                                          }}
                                                          className="planDetailMainHeading"
                                                        >
                                                          {el?.name}
                                                        </div>
                                                      </div>
                                                      <div className="col-12">
                                                        <div className="planDetailSubHeading">
                                                          Subscription: Monthly
                                                          ({el?.pricing_monthly}
                                                          ) or Yearly (
                                                          {el?.pricing_yearly})
                                                        </div>
                                                      </div>
                                                      <div className="col-12">
                                                        <ul className="planDetailUl">
                                                          <li
                                                            style={{
                                                              fontSize: "14px",
                                                            }}
                                                            className="planDetailLi"
                                                          >
                                                            {CountConverter(
                                                              el?.training_tokens
                                                            )}{" "}
                                                            Training Tokens
                                                          </li>
                                                          <li
                                                            style={{
                                                              fontSize: "14px",
                                                            }}
                                                            className="planDetailLi"
                                                          >
                                                            {CountConverter(
                                                              el?.database_usage
                                                            )}{" "}
                                                            Database Usage
                                                          </li>
                                                          <li
                                                            style={{
                                                              fontSize: "14px",
                                                            }}
                                                            className="planDetailLi"
                                                          >
                                                            {el?.num_of_dpa}{" "}
                                                            DPAs
                                                          </li>
                                                          <li
                                                            style={{
                                                              fontSize: "14px",
                                                            }}
                                                            className="planDetailLi"
                                                          >
                                                            {el?.num_of_users}{" "}
                                                            Users
                                                          </li>
                                                        </ul>
                                                      </div>
                                                    </div>
                                                  </div>

                                                  {item?.id === el?.id ? (
                                                    <div className="col-auto">
                                                      <a
                                                        // href="javascript:;"
                                                        className="planDetailAnchor"
                                                      >
                                                        Current Plan
                                                      </a>
                                                    </div>
                                                  ) : (
                                                    <div className="col-auto">
                                                      <button
                                                        className="upgradeBtn"
                                                        onClick={() => {
                                                          setIsOpen("model");
                                                          setplan(el);
                                                        }}
                                                      >
                                                        Upgrade{" "}
                                                        <img
                                                          src="assets/img/svg/add.svg"
                                                          alt
                                                        />
                                                      </button>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* payment mode */}
                              <div className="mt-4 w-75 ms-auto me-auto d-none">
                                {stripeId && (
                                  <StripeContainer
                                    id={stripeId}
                                    comp="billing"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <RightSidebar
                      sideBar={sideBar}
                      setSidebarOpen={setSidebarOpen}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- upgrade button offcanvas --> */}
      <div
        ref={ref}
        className={`offcanvas offcanvas-end upgradeOffcanvas ${
          isOpen == "model" ? "show" : ""
        }`}
        tabindex="-1"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header upgradeOffcanvasHeader">
          <div
            className="offcanvas-title upgradeOffcanvasHeaderTitle"
            id="offcanvasExampleLabel"
          >
            Upgrade Plan
          </div>
          <button
            onClick={() => setIsOpen("")}
            type="button"
            className="btn-close btnClose"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body upgradeOffcanvasBody">
          <div className="row">
            <div className="col-12">
              <div
                className="upgradeOffcanvasBodyHead"
                style={{
                  backgroundColor:
                    plan?.name == "Lite Plan"
                      ? "#CAE6E499"
                      : plan?.name == "Premium"
                      ? "#FDE4E499"
                      : "#FFF5E599",
                }}
              >
                {plan?.name}
              </div>
            </div>
            <div className="col-12">
              <div className="upgradeOffcanvasBodySubHead">Features</div>
            </div>
            <div className="col-12">
              <ul className="upgradebodyUl">
                <li className="upgradebodyLi">
                  {CountConverter(plan?.training_tokens)} Training Tokens
                </li>
                <li className="upgradebodyLi">
                  {CountConverter(plan?.database_usage)} Database Usage{" "}
                </li>
                <li className="upgradebodyLi">{plan?.num_of_dpa} DPAs</li>
                <li className="upgradebodyLi">{plan?.num_of_users} Users</li>
              </ul>
            </div>
          </div>
        </div>
        {!showItem ? (
          <div className="offcanvas-footer upgradeOffcanvasFooter">
            <div className="row">
              <div className="col-12 d-flex justify-content-end">
                <button
                  className="upgradeBtn"
                  onClick={() => {
                    handleUpdateTiers();
                    setShowItem(true);
                  }}
                >
                  <img src="assets/img/svg/Upgrade.svg" alt="" />
                  Upgrade
                </button>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default SubscriptionPlan;
