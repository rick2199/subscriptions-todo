import { useRouter } from "next/router";
import { useEffect } from "react";
import cookies from "js-cookie";
import SubscriptionCard from "@/components/subscription-card";

const Home = () => {
  const router = useRouter();
  useEffect(() => {
    const sessionCookie = cookies.get("supabase-auth-token");
    if (!sessionCookie) {
      router.replace("/login", undefined, { shallow: true });
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center flex-col h-screen">
      <h1>To access the best todo list app</h1>
      <p>You need to select a plan</p>
      <SubscriptionCard />
    </div>
  );
};

export default Home;
