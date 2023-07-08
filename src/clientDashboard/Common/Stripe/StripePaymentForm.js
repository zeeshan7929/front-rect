import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toaster } from "../../Common/Others/Toaster";
import { useStripe,PaymentElement } from "@stripe/react-stripe-js";

const StripePaymentForm = ({ id, comp }) => {
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const stripe = useStripe();

  const confirmPayment = async () => {
    try {
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        `${id}`
      );
      if (error) {
        // Handle error here
        console.log("error:", error.message);
        toaster(false, error.message);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Handle successful payment here
        toaster(true, "Payment succeeded");
        if (comp == "billing") {
          setTimeout(() => {
            navigate("/billing-plans");
          }, 2000);
        } else {
          setTimeout(() => {
            navigate("/assistant-login");
          }, 2000);
        }
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return <form>
          <PaymentElement id="payment-element"  />

  </form>
};

export default StripePaymentForm;
