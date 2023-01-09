import { CheckoutModal } from "@/components/organisms/modals";
import { Users } from "@/utils/database.types";
import { SubscriptionPrice } from "@/utils/stripe.types";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "../../atoms/button";
import { Heading } from "../../atoms/heading";
import { Text } from "../../atoms/text";

interface Props {
  name: string;
  prices: SubscriptionPrice[];
  description: string;
  user: Users;
}

const SubscriptionCard: React.FC<Props> = ({
  name,
  description,
  prices,
  user,
}) => {
  const [isCheckoutModalOpen, setCheckoutModalOpen] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState<string>("");
  const price = {
    amount: prices[0].unit_amount / 100,
    currency: prices[0].currency.toUpperCase(),
    id: prices[0].id,
  };

  const handleSubscription = async () => {
    if (user.plan === "annually" || user.plan === "monthly") {
      alert("already Already Premium");
      return;
    }
    try {
      const { data } = await axios({
        url: `/api/create-payment-intent?priceId=${price.id}&userId=${user.id}`,
        method: "GET",
      });
      console.log({ data });

      setClientSecret(data);
    } catch (err) {
      console.log({ err });
    }
  };

  useEffect(() => {
    if (clientSecret) {
      setCheckoutModalOpen(true);
    }
  }, [clientSecret]);

  return (
    <div className="bg-primary-dark text-white text-center gap-8 flex flex-col max-w-xs py-8 px-4 rounded-md">
      <CheckoutModal
        price={price.amount}
        clientSecret={clientSecret}
        isModalOpen={isCheckoutModalOpen}
        setModalOpen={setCheckoutModalOpen}
      />
      <Heading size="xl">{name}</Heading>
      <Heading size="xl">
        {(price.amount === 0 ? "0" : price.amount) + " " + price.currency}
      </Heading>
      <Text>{description}</Text>
      <Button
        color="bg-primary-light"
        handleClick={handleSubscription}
        title={
          user.plan === "free" && name === "Free Plan"
            ? "Subscribed"
            : user.plan === "annually" || user.plan === "monthly"
            ? "Already Premium"
            : "Subscribe"
        }
        disabled={
          user.plan === "free" && name === "Free Plan"
            ? true
            : (user.plan === "annually" || user.plan === "monthly") && true
        }
      />
    </div>
  );
};

export default SubscriptionCard;
