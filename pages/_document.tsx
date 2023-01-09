import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        {/* <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
        <stripe-pricing-table
          pricing-table-id="prctbl_1MMx36LHXrZvZlCFOdYaUjff"
          publishable-key="pk_test_51MJhjCLHXrZvZlCFIy1fPKaFrKINxAAsXpBG41BZM3XVaj6I7lE8WHH6MsrkKbfXK61vYnU3eXYaUMENjgJYRZxG003Tf4t7j3"
          customer-email="richardrojasa+test@gmail.com"
        ></stripe-pricing-table> */}
        <NextScript />
      </body>
    </Html>
  );
}
