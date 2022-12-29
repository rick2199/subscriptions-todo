import { Button } from "@/components/atoms/button";
import { Text } from "@/components/atoms/text";
import { emailRegex, passwordRegex } from "@/utils/helpers";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { TextField } from "@/components/molecules/form-fields";
import { useState } from "react";
import Link from "next/link";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = useSupabaseClient();

  return (
    <div className="h-full md:px-6 lg:px-0 bg-white text-center pt-[42px]">
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validate={async ({ email, password }) => {
          const errors: any = {};
          if (!email) {
            errors.email = "Please enter an email or email";
          }
          if (!emailRegex.test(email)) {
            errors.email = "This isn´t a valid email";
          }
          if (!password) {
            errors.password = "Please enter a password";
          } else if (!passwordRegex.test(password)) {
            errors.password = "This isn’t a valid password";
          }

          return errors;
        }}
        onSubmit={async ({ email, password }, { setErrors, resetForm }) => {
          setLoading(true);
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
            options: {},
          });
          if (data.user) {
            resetForm();
            router.replace("/", undefined, { shallow: true });
          }
          if (error) {
            const { error: dbUserError } = await supabase
              .from("users")
              .select("email")
              .eq("email", email.toLowerCase())
              .single();
            if (dbUserError) {
              setErrors({ password: "User not found, please signup first" });
            } else {
              setErrors({ password: error.message });
            }
          }
          setLoading(false);
        }}
      >
        {({ errors, touched, values }) => {
          const isCompleted = !!values.password && !!values.email;
          return (
            <Form className="relative flex flex-col gap-6 text-center">
              <TextField
                label="Email"
                type="email"
                placeHolder="Enter your email"
                error={errors.email as string}
                touched={touched.email as boolean}
              />

              <div>
                <TextField
                  label="Password"
                  type="password"
                  error={errors.password as string}
                  touched={touched.password as boolean}
                />
                <div className=" mt-1 flex flex-row items-start justify-between">
                  <Link href="/forgot-password" className="cursor-pointer">
                    <Text className="w-max text-end underline">
                      Forgot your password?
                    </Text>
                  </Link>
                </div>
              </div>

              <div className="mt-6 w-full md:static">
                <Button
                  title={`Log${loading ? "ging In" : "in"} `}
                  disabled={!isCompleted}
                />
                <Button
                  type="button"
                  variant="secondary"
                  handleClick={() => router.push("/signup")}
                  disabled={false}
                  title="Create your account"
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default LoginForm;
