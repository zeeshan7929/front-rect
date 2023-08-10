import MasterLogin from "./MasterDashboard/Master Login/MasterLogin";
import { Routes, Route, Navigate } from "react-router-dom";
import AssistantLogin from "./clientDashboard/Pages/Login/AssistantLogin";
import ChangePassword from "./clientDashboard/Pages/Password/ChangePassword";
import ResetPassword from "./clientDashboard/Pages/Password/ResetPassword";
import SuccessPassword from "./clientDashboard/Pages/Password/SuccessPassword";
import Dashboard from "./clientDashboard/Pages/Dashboard";
import UsageTrackingOverview from "./clientDashboard/Pages/Usage Tracking/UsageTrackingOverview";
import "./App.css";
import BillingPlans from "./clientDashboard/Pages/Billing & plans";
import SubscriptionPlan from "./clientDashboard/Pages/Billing & plans/SubscriptionPlan";
import BillingDetails from "./clientDashboard/Pages/Billing & plans/BillingDetails";
import { useState } from "react";
import Settings from "./clientDashboard/Pages/Settings";
import SignUp from "./clientDashboard/Pages/SignUp/SignUp";
import ManageDpaDatabase from "./clientDashboard/Pages/DPA/ManageDpaDatabase";
import CreateNewDpa from "./clientDashboard/Pages/DPA/CreateNewDpa";
import DPAOverview from "./clientDashboard/Pages/DPA/DPAOverview";
import DPASettings from "./clientDashboard/Pages/DPA/DPASettings";
import UploadDocuments from "./clientDashboard/Pages/DPA/UploadDocuments";
import UploadRequest from "./clientDashboard/Pages/DPA/UploadRequest";
import AddUser from "./clientDashboard/Pages/Users/AddUser";
import IndividualUser from "./clientDashboard/Pages/Users/IndividualUser";
import UserOverview from "./clientDashboard/Pages/Users/UserOverview";
import UserUsageTracking from "./clientDashboard/Pages/Usage Tracking/UserUsageTracking";
import UsageTrackingDPA from "./clientDashboard/Pages/Usage Tracking/UsageTrackingDPA";
import { DocumentViewer } from "./clientDashboard/Pages/DPA/DocumentViewer";
import MDashboard from "./MasterDashboard/MDashboard";
import Client from "./MasterDashboard/Client";
import Edit from "./MasterDashboard/Client/Edit";
import EditDetail from "./MasterDashboard/Client/EditDetail";
import Tier from "./MasterDashboard/Tier";
import EditTier from "./MasterDashboard/Tier/EditTier";
import AddTier from "./MasterDashboard/Tier/AddTier";
import PaymentHistory from "./MasterDashboard/Payment History/index";
import DocumentUpload from "./Chat Interface/Document Upload";
import UploadPage from "./Chat Interface/Document Upload/UploadPage";
import UploadReview from "./Chat Interface/Document Upload/UploadReview";
import DPASelection from "./Chat Interface/DPASelection";
import WorkPlaceRelation from "./Chat Interface/DPASelection/WorkPlaceRelation";
import TrackMyUsage from "./Chat Interface/TrackMyUsage";
import UserSetting from "./Chat Interface/User Settings";
import MasterVerifyOtp from "./MasterDashboard/Otp/MasterVerifyOtp";
import MChangePassword from "./MasterDashboard/MPassword/MChangePassword";
import MResetPassword from "./MasterDashboard/MPassword/MResetPassword";
import MSuccessPassword from "./MasterDashboard/MPassword/MSuccessPassword";
import AssistantVerifyOtp from "./clientDashboard/Pages/Login/AssistantVerifyOtp";
import Authentication from "./MasterDashboard/Common/Protected/Protected";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Preview from "./Chat Interface/Document Upload/Preview";
import LandingPage from "./clientDashboard/Pages/Login/LandingPage";
import MasterAuth from "./MasterDashboard/Common/Protected/MasterAuth";
import VerifyPayment from "./clientDashboard/Pages/verify-payment";
import WorkPlaceRelationDocPreview from "./Chat Interface/DPASelection/WorkPlaceRelationDocPreview";

function App() {
  const [sideBar, setSidebarOpen] = useState("");
  const token = localStorage.getItem("m_login");
  const token1 = localStorage.getItem("a_login");

  return (
    <>
      <ToastContainer autoClose={1000} />
      <Routes>
        {/* Dashboard route */}
        <Route element={<Authentication />}>
          <Route
            exact
            path="/"
            element={
              token1 ? (
                <Navigate replace to="/dashboard" />
              ) : (
                <Navigate replace to="/common" />
              )
            }
          />
          <Route
            exact
            path="/dashboard"
            element={
              <Dashboard sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />

          {/* Usage-Tracking */}

          <Route
            exact
            path="/usage-tracking"
            element={
              <UsageTrackingOverview
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
          <Route
            exact
            path="/user-usage-tracking"
            element={
              <UserUsageTracking
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
          <Route
            exact
            path="/usage-tracking-dpa"
            element={
              <UsageTrackingDPA
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />

          {/* Users */}
          <Route
            exact
            path="/add-user"
            element={
              <AddUser sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />
          <Route
            exact
            path="/individual-user"
            element={
              <IndividualUser
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />

          <Route
            path="/user-overview"
            element={
              <UserOverview sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />

          <Route
            path="/user-management"
            element={
              <IndividualUser
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />

          {/* Billing & Plans  */}
          <Route
            exact
            path="/billing-plans"
            element={
              <BillingPlans sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />
          <Route
            path="/subscription-plan"
            element={
              <SubscriptionPlan
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
          <Route
            exact
            path="/billing-details"
            element={
              <BillingDetails
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />

          {/* Setting */}
          <Route
            exact
            path="/settings"
            element={
              <Settings sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />

          <Route
            path="/dpa-managemant"
            element={
              <ManageDpaDatabase
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
          <Route
            path="/create-new-dpa"
            element={
              <CreateNewDpa sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />
          <Route
            exact
            path="/dpa-overview"
            element={
              <DPAOverview sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />
          <Route
            path="/dpa-settings"
            element={
              <DPASettings sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />
          <Route
            path="/upload-documents"
            element={
              <UploadDocuments
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
          <Route
            path="/approve-upload"
            element={
              <UploadRequest
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
          <Route
            path="/upload-request"
            element={
              <UploadRequest
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />

          <Route
            path="/document-viewer"
            element={
              <DocumentViewer
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />

          {/* User */}
          <Route path="/add-new-user" element={<AddUser />} />

          {/* Document Upload */}
          <Route
            path="/document-upload"
            element={
              <DocumentUpload
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
          <Route
            path="/upload-page"
            element={
              <UploadPage sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />
          <Route
            path="/upload-review"
            element={
              <UploadReview sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />
          <Route
            path="/document-preview"
            element={
              <Preview sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />

          {/* DPA Selection */}
          <Route
            path="/dpa-selection"
            element={
              <DPASelection sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />
          <Route
            path="/workplace-relation"
            element={
              <WorkPlaceRelation
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />

          <Route
            path="/workplace-relation-preview"
            element={
              <WorkPlaceRelationDocPreview
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
          
          {/* Track My Usage */}
          <Route
            path="/track-my-usage"
            element={
              <TrackMyUsage sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />
          {/* User Settings */}
          <Route
            path="/user-settings"
            element={
              <UserSetting sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />
        </Route>
        <Route element={<MasterAuth />}>
          <Route
            exact
            path="/"
            element={
              token ? (
                <Navigate replace to="/master-dashboard" />
              ) : (
                <Navigate replace to="/master-login" />
              )
            }
          />
          <Route
            exact
            path="/dashboard"
            element={
              <Dashboard sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />

          {/* Usage-Tracking */}

          <Route
            exact
            path="/usage-tracking"
            element={
              <UsageTrackingOverview
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
          <Route
            exact
            path="/user-usage-tracking"
            element={
              <UserUsageTracking
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
          <Route
            exact
            path="/usage-tracking-dpa"
            element={
              <UsageTrackingDPA
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />

          {/* Users */}
          <Route
            exact
            path="/add-user"
            element={
              <AddUser sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />
          <Route
            exact
            path="/individual-user"
            element={
              <IndividualUser
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />

          <Route
            path="/user-overview"
            element={
              <UserOverview sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />

          <Route
            path="/user-management"
            element={
              <IndividualUser
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />

          {/* Billing & Plans  */}
          <Route
            exact
            path="/billing-plans"
            element={
              <BillingPlans sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />
          <Route
            path="/subscription-plan"
            element={
              <SubscriptionPlan
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
          <Route
            exact
            path="/billing-details"
            element={
              <BillingDetails
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />

          {/* Setting */}
          <Route
            exact
            path="/settings"
            element={
              <Settings sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />

          {/* // DPA Routes */}
          {/* <Route
        path="/dpa-usage-tracking"
        element={
          <DpaUsageTracking sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
        }
      /> */}
          <Route
            path="/dpa-managemant"
            element={
              <ManageDpaDatabase
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
          <Route
            path="/create-new-dpa"
            element={
              <CreateNewDpa sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />
          <Route
            exact
            path="/dpa-overview"
            element={
              <DPAOverview sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />
          <Route
            path="/dpa-settings"
            element={
              <DPASettings sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />
          <Route
            path="/upload-documents"
            element={
              <UploadDocuments
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
          <Route
            path="/approve-upload"
            element={
              <UploadDocuments
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
          <Route
            path="/upload-request"
            element={
              <UploadRequest
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />

          <Route
            path="/document-viewer"
            element={
              <DocumentViewer
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />

          {/* User */}
          <Route path="/add-new-user" element={<AddUser />} />

          <Route
            path="/master-dashboard"
            element={
              <MDashboard sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />
          <Route
            path="/client"
            element={
              <Client sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />
          <Route
            path="/edit"
            element={<Edit sideBar={sideBar} setSidebarOpen={setSidebarOpen} />}
          />
          <Route
            path="/editdetail"
            element={
              <EditDetail sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />

          {/* Tier */}
          <Route
            path="/tier"
            element={<Tier sideBar={sideBar} setSidebarOpen={setSidebarOpen} />}
          />
          <Route
            path="/add-tier"
            element={
              <AddTier sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />
          <Route
            path="/edit-tier"
            element={
              <EditTier sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />

          {/* Payment History */}
          <Route
            path="/payment-history"
            element={
              <PaymentHistory
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />

          {/* Document Upload */}
          <Route
            path="/document-upload"
            element={
              <DocumentUpload
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
          <Route
            path="/upload-page"
            element={
              <UploadPage sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />
          <Route
            path="/upload-review"
            element={
              <UploadReview sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />
          <Route
            path="/document-preview"
            element={
              <Preview sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />

          {/* DPA Selection */}
          <Route
            path="/dpa-selection"
            element={
              <DPASelection sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />
          <Route
          exact
            path="/workplace-relation"
            element={
              <WorkPlaceRelation
                sideBar={sideBar}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
         

          {/* Track My Usage */}
          <Route
            path="/track-my-usage"
            element={
              <TrackMyUsage sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />
          {/* User Settings */}
          <Route
            path="/user-settings"
            element={
              <UserSetting sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
            }
          />
        </Route>
        {/* {signup & login Client-dashboard} */}
        <Route exact path="/sign-up" element={<SignUp />}></Route>
        <Route exact path="/verify-payment" element={<VerifyPayment />}></Route>
        <Route exact path="/verify-otp" element={<AssistantVerifyOtp />} />
        <Route exact path="/assistant-login" element={<AssistantLogin />} />
        <Route exact path="/common" element={<LandingPage />} />
        <Route exact path="/change-password" element={<ChangePassword />} />
        <Route exact path="/reset-password" element={<ResetPassword />}></Route>
        <Route
          exact
          path="/success-password"
          element={<SuccessPassword />}
        ></Route>
        {/* Master Dashboard Start*/}
        <Route exact path="/master-login" element={<MasterLogin />} />
        <Route exact path="/master-verify-otp" element={<MasterVerifyOtp />} />
        <Route
          exact
          path="/master-reset-password"
          element={<MResetPassword />}
        />
        <Route path="*" element={<p className="m-auto">Page not found</p>} />
        <Route path="/master-change-password" element={<MChangePassword />} />
        <Route path="/master-success-password" element={<MSuccessPassword />} />
      </Routes>
    </>
  );
}

export default App;
