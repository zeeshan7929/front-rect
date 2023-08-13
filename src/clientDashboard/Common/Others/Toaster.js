import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const toaster = (type, message) => {
  if (type) {
    return toast.success(`${message} `, {
      position: toast.POSITION.TOP_RIGHT,
    });
  } else {
    return toast.error(`${message} `, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
};
