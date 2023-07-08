import React from "react";
const colors = {
  danger: "#e15656",
  dark: "#4a5c77",
  success: "#5BCD97",
};
const modalData = [
  {
    title: "Delete Document",
    deleteBtn: {
      icon: <i className="bi bi-trash3 me-2 " />,
      text: "Delete File",
      color: colors.danger,
    },
    cancalBtn: {
      icon: <i class="bi bi-x-lg me-2 " />,
      text: "Cancel",
      color: colors.dark,
    },
    content: `Are you sure you want to delete this document? Trained data tokens
    do not reduce after deletion.`,
  },
  {
    title: "Upload File",
    deleteBtn: {
      icon: <i class="bi bi-upload me-2"></i>,
      text: "Upload",
      color: "#5BCD97",
    },
    cancalBtn: {
      icon: <i class="bi bi-x-lg me-2 " />,
      text: "Cancel",
      color: colors.danger,
    },
    content: `Are you sure you want to upload? Trained data token does not reduce if you delete documents at a later stage.`,
  },
  {
    title: "Deleting DPA",
    deleteBtn: {
      icon: <i className="bi bi-trash3 me-2 " />,
      text: "Delete DPA",
      color: colors.danger,
    },
    cancalBtn: {
      icon: <i class="bi bi-x-lg me-2 " />,
      text: "Cancel",
      color: colors.dark,
    },
    content: `Are you sure you want to permanently delete this DPA & all associated documents? Trained data tokens does not reduce. This action cannot be undone.`,
  },
  {
    title: "Revoke Access",
    deleteBtn: {
      icon: (
        <i class="bi bi-person-x-fill me-2 " style={{ fontSize: "15px" }}></i>
      ),
      text: "Revoke",
      color: colors.danger,
    },
    cancalBtn: {
      icon: <i class="bi bi-x-lg me-2 " />,
      text: "Cancel",
      color: colors.dark,
    },
    content: `Are you sure you want to revoke access to this resource? This action cannot be undone.`,
  },
  {
    title: "Apply Changes",
    deleteBtn: {
      icon: <i class="bi bi-file-earmark-check me-2"></i>,
      text: "Apply",
      color: colors.success,
    },
    cancalBtn: {
      icon: <i class="bi bi-x-lg me-2 " />,
      text: "Cancel",
      color: colors.danger,
    },
    content: `Are you sure you want to apply these changes? This action cannot be undone.`,
  },
  {
    title: "Unsaved Changes",
    icon: <i class="bi bi-file-earmark me-2"></i>,
    deleteBtn: {
      icon: <span class="material-symbols-outlined me-2 fs-5">login</span>,
      text: <p>Leave Page</p>,
      color: colors.danger,
    },
    cancalBtn: {
      icon: (
        <i class="bi bi-pencil-square me-2 " style={{ fontSize: "13px" }}></i>
      ),
      text: "Stay on Page",
      color: colors.dark,
    },
    content: `You have unsaved changes. Are you sure you want to leave this page without saving?`,
  },
  {
    title: "Deleting User",
    deleteBtn: {
      icon: <i className="bi bi-trash3 me-2 " />,
      text: "Delete User",
      color: colors.danger,
    },
    cancalBtn: {
      icon: <i class="bi bi-x-lg me-2 " />,
      text: "Cancel",
      color: colors.dark,
    },
    content: `Are you sure you want to permanently delete this user? This action cannot be undone.`,
  },
  {
    title: "Update User Info",
    icon: <i class="bi bi-person-exclamation me-2 fs-4"></i>,
    deleteBtn: {
      icon: <i class="bi bi-file-earmark-check me-2 fs-6"></i>,
      text: "Apply",
      color: colors.success,
    },
    cancalBtn: {
      icon: <i class="bi bi-x-lg me-2 " />,
      text: "Cancel",
      color: colors.danger,
    },
    content: (
      <span>
        Are you sure you want to update user info? Please note that any changes
        made to the password or email address will result in a{" "}
        <strong>modification to</strong> their <strong>login details</strong>.
      </span>
    ),
  },

  {
    title: "Delete Subscription Plain",
    deleteBtn: {
      icon: <i className="bi bi-trash3 me-2 " />,
      text: "Delete ",
      color: colors.danger,
    },
    cancalBtn: {
      icon: <i class="bi bi-x-lg me-2 " />,
      text: "Cancel",
      color: colors.dark,
    },
    content: `Are you sure you want to delete this Subscription ?`,
  },
  {
    title: "Update Representative",
    icon: <i class="bi bi-person-exclamation me-2 fs-4"></i>,
    deleteBtn: {
      icon: <i class="bi bi-file-earmark-check me-2 fs-6"></i>,
      text: "Apply",
      color: colors.success,
    },
    cancalBtn: {
      icon: <i class="bi bi-x-lg me-2 " />,
      text: "Cancel",
      color: colors.danger,
    },
    content: "Are you sure you want to update representative.",
  },
  {
    title: "Update Company Info",
    icon: <i class="bi bi-person-exclamation me-2 fs-4"></i>,
    deleteBtn: {
      icon: <i class="bi bi-file-earmark-check me-2 fs-6"></i>,
      text: "Apply",
      color: colors.success,
    },
    cancalBtn: {
      icon: <i class="bi bi-x-lg me-2 " />,
      text: "Cancel",
      color: colors.danger,
    },
    content: <span>Are you sure you want to update Company info.</span>,
  },
  {
    title: "Update Password",
    icon: <i class="bi bi-person-exclamation me-2 fs-4"></i>,
    deleteBtn: {
      icon: <i class="bi bi-file-earmark-check me-2 fs-6"></i>,
      text: "Apply",
      color: colors.success,
    },
    cancalBtn: {
      icon: <i class="bi bi-x-lg me-2 " />,
      text: "Cancel",
      color: colors.danger,
    },
    content: <span>Are you sure you want to update Password.</span>,
  },
  {
    title: "Make Payment",
    icon: <i class="bi bi-credit-card me-2"></i>,
    deleteBtn: {
      icon: <i class="bi bi-credit-card me-2 "></i>,
      text: "Submit",
      color: colors.success,
    },
    cancalBtn: {
      icon: <i class="bi bi-x-lg me-2 " />,
      text: "Cancel",
      color: colors.danger,
    },
    content: (
      <span style={{ marginLeft: "8 rem", fontSize: "16px" }}>
        Are You Ready To Login.
      </span>
    ),
  },
];

const Modal = (props) => {
  const { type, modelOpen, setModelOpen, hanldeFunction } = props;
  let d = modalData?.filter(
    (el) => el?.title?.toLowerCase() == type?.toLowerCase()
  );
  let data = d[0];

  return (
    <div
      className={`modal fade ${modelOpen ? "show" : ""}`}
      id="exampleModalLive"
      tabindex="-1"
      aria-labelledby="exampleModalLiveLabel"
      style={{ display: modelOpen ? "block" : "none" }}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog">
        <div
          className="modal-content border-0"
          style={{
            borderRadius: "24px",
            backgroundColor: type == "Make Payment" ? "#e0e0e0" : "",
          }}
        >
          <div className="modal-header m-auto border-0 ">
            <h1 className="modal-title fs-5  mt-2 " id="exampleModalLabel">
              <span
                className="fw-bold ms-5"
                style={{
                  color: "#464255",
                  fontFamily: "Poppins",
                  fontWeight: 600,
                  fontSize: "24px",
                  marginRight: type == "Make Payment" ? "5rem" : "",
                }}
              >
                {data?.icon ? data?.icon : data?.deleteBtn?.icon}
                {data?.title}
              </span>
            </h1>
          </div>
          <div className="modal-body border-0 ">
            <p
              className="ps-3 ms-2"
              style={{
                color: "#4A5C77",
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: "16px",
              }}
            >
              {data?.content}
            </p>
          </div>
          <div className="modal-footer border-0 me-2">
            <button
              className="btn btn-secondary modal-cancel "
              style={{ backgroundColor: data?.cancalBtn?.color }}
              onClick={() => setModelOpen(false)}
            >
              {data?.cancalBtn?.icon}
              {data?.cancalBtn?.text}
            </button>
            <button
              className="btn btn-primary modal-delete d-flex justify-content-center"
              style={{
                backgroundColor: data?.deleteBtn?.color,
                marginRight: type == "Make Payment" ? "5rem" : "",
              }}
              onClick={() => hanldeFunction()}
            >
              {data?.deleteBtn?.icon}
              {data?.deleteBtn?.text}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
