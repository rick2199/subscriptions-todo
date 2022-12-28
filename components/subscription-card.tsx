import { useSession } from "@supabase/auth-helpers-react";
import axios from "axios";

const SubscriptionCard = () => {
  const session = useSession();
  const token = session?.access_token;

  const handleSubscription = async () => {
    const { data } = await axios.get(`/api/checkout-sessions?token=${token}`);
    if (data?.url) {
      window.location.replace(data.url);
    }
  };
  return (
    <div>
      <h2>Free</h2>
      <p>All the basics features</p>
      <button onClick={handleSubscription}>Subscribe</button>
    </div>
  );
};

export default SubscriptionCard;
