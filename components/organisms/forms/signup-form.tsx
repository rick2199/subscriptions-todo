import React, { useState } from "react";
import { Formik, Form } from "formik";
import { emailRegex, passwordRegex } from "@/utils/helpers";
import { Button } from "@/components/atoms/button";
import { TextField } from "@/components/molecules/form-fields";
import { useRouter } from "next/router";
import { FormDescription, FormInfo } from "./form-stuff";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const SignupForm = () => {
  const supabase = useSupabaseClient();
  const [isEmailSent, setEmailSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  return (
    <div className=" w-full md:px-6 lg:px-0 bg-white text-center">
      {!isEmailSent ? (
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validate={async ({ email, password }) => {
            const errors: any = {};

            if (!email) {
              errors.email = "Please enter an email";
            } else if (!emailRegex.test(email)) {
              errors.email = "This isn’t a valid email address";
            }

            if (!password) {
              errors.password = "Please enter a password";
            } else if (!passwordRegex.test(password)) {
              errors.password = "This password is too short";
            }

            return errors;
          }}
          onSubmit={async ({ password, email }, { resetForm, setErrors }) => {
            setLoading(true);
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  email,
                },
              },
            });
            if (error) {
              setErrors({ password: error.message });
            }
            if (data.user) {
              resetForm();
              setEmailSent(true);
            }
            setLoading(false);
          }}
        >
          {({ errors, touched, values }) => {
            const isCompleted = !!values.email && !!values.password;

            return (
              <Form className="mt-8 flex flex-col gap-6 md:h-full md:w-full">
                <TextField
                  label="Email"
                  type="email"
                  error={errors.email as string}
                  touched={touched.email as boolean}
                />
                <TextField
                  label="Password"
                  type="password"
                  error={errors.password as string}
                  touched={touched.password as boolean}
                />
                <div>
                  <Button
                    disabled={!isCompleted}
                    title={`Creat${loading ? "ing" : "e"} Account`}
                    className={`mt-5 ${loading ? "opacity-50" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    handleClick={() => router.push("/login")}
                    disabled={false}
                    title="Go to Login"
                  />
                </div>
              </Form>
            );
          }}
        </Formik>
      ) : (
        <div className="flex flex-col gap-6 mt-8">
          <FormDescription
            title="Check your inbox"
            content="You are only one step away! You should have received an email. Click
            on the link provided and you’ll be able to activate your account."
          />
          <FormInfo />
          <Button
            handleClick={() => router.push("/login")}
            disabled={false}
            title="Return to Login"
          />
        </div>
      )}
    </div>
  );
};

export default SignupForm;
