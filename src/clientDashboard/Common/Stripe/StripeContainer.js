import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePaymentForm from "./StripePaymentForm";

const PUBLIC_KEY = `pk_test_51Lx6rpGJ76zzZMRvJrU7yl1HI3s2aFFZ6AzR5nCkJY3cmjXP9HEOIH1ZvSpDxmh7sftxFQVGIbvJu4Llo8TybRLd00UkW08XS5`;

export const stripePromise = loadStripe(PUBLIC_KEY);

const StripeContainer = ({ id, comp }) => {
  return (
    <Elements stripe={stripePromise} options={{clientSecret:id}}>
      <StripePaymentForm id={id} comp={comp} />
    </Elements>
  );
};

export default StripeContainer;
