import { Button } from "@/components/atoms/button";
import { ErrorMessage } from "@/components/atoms/error-message";
import { Heading } from "@/components/atoms/heading";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Field, Form, Formik, FieldProps } from "formik";

interface Props {
  price: number;
}

interface FormValues {
  paymentMethod: {
    collapsed: boolean;
    complete: boolean;
    elementType: string;
    empty: boolean;
  } | null;
}

const CheckoutForm: React.FC<Props> = ({ price }) => {
  const stripe = useStripe();
  const elements = useElements();
  return (
    <Formik<FormValues>
      initialValues={{
        paymentMethod: null,
      }}
      onSubmit={async ({ paymentMethod }, { setSubmitting, setErrors }) => {
        setSubmitting(true);
        if (!paymentMethod?.complete) {
          setErrors({ paymentMethod: "Please complete your information" });
          return;
        }
        if (elements) {
          try {
            await stripe?.confirmPayment({
              elements,
              confirmParams: {
                return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe-checkout-payment`,
              },
            });
          } catch (err) {
            setErrors({ paymentMethod: err as string });
          }
        }

        setSubmitting(false);
      }}
    >
      {({ status, errors, isSubmitting }) => (
        <Form className="flex flex-col gap-8">
          {status && status.error && <div>{status.error}</div>}
          {status && status.success && <div>Payment successful!</div>}
          <Heading size="lg" className="text-white">
            You Selected the {price === 15 ? "Monthly" : "Annually"} plan
          </Heading>
          <Field name="paymentMethod">
            {({ field, form }: FieldProps) => (
              <div>
                <PaymentElement
                  onChange={(event) => {
                    form.setFieldValue(field.name, event);
                    form.setFieldTouched(field.name);
                  }}
                />
                {
                  <ErrorMessage
                    error={errors.paymentMethod as string}
                    name="paymentMethod"
                  />
                }
              </div>
            )}
          </Field>
          <Button
            type="submit"
            title={`Pay${isSubmitting ? "ing" : ""} $${price}`}
            color="bg-[#85D996]"
          />
        </Form>
      )}
    </Formik>
  );
};

export default CheckoutForm;
