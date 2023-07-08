import { useEffect, useMemo } from "react";
import { useState } from "react";
import { stripePromise } from "../Common/Stripe/StripeContainer";
import { useLocation, useNavigate } from "react-router-dom";

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function VerifyPayment() {
  let [status, setStatus] = useState("Verifying payment...");
  let nav = useNavigate();

  let query = useQuery();
  useEffect(() => {
    let verify = async () => {
      let key = query.key;
      if (!key) throw new Error("Invalid key");

      let intent = await (await stripePromise).retrievePaymentIntent(key);

      if (intent.error) {
        throw new Error(intent.error.message);
      }
      if (
        intent.paymentIntent?.status !== "processing" &&
        intent.paymentIntent?.status !== "succeeded"
      ) {
        throw new Error("Intent status is " + intent.paymentIntent?.status);
      }
      nav("/assistant-login");
    };

    verify().catch((e) => {
      console.error(e);
      alert("Failed to verify payment please try again");
      window.location = "/";
    });
  }, []);

  return status;
}
