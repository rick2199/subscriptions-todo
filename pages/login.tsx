import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const Login = () => {
  const supabase = useSupabaseClient();
  return (
    <div className="max-w-sm mx-auto">
      <Auth
        providers={["github"]}
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="light"
      />
    </div>
  );
};

export default Login;
