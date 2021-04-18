import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

function Paypal({ orderData, orderResponse, getTotal }) {
  const dispatch = useDispatch();
  const paypal = useRef();
  // useEffect(() => {
  //   window.paypal
  //     .Buttons({
  //       createOrder: (data, actions) => {
  //         return actions.order.create({
  //           intent: "CAPTURE",
  //           purchase_units: [
  //             {
  //               description: "Cool looking table",
  //               amount: {
  //                 value: 500.0,
  //                 currency_code: "INR",
  //               },
  //             },
  //           ],
  //         });
  //       },
  //       onApprove: async (data, actions) => {
  //         const order = await actions.order.capture();
  //         console.log("Successful order: " + order);
  //       },
  //       onError: (error) => {
  //         console.log(error);
  //       },
  //     })
  //     .render(paypal.current);
  // }, []);

  useEffect(() => {
    window.paypal.Button.render(
      {
        // Configure environment
        env: "sandbox",
        client: {
          sandbox: process.env.REACT_APP_PAYPAL_CLIENT_ID,
          production: "demo_production_client_id",
        },
        // Customize button (optional)
        locale: "en_IN",
        style: {
          size: "medium",
          color: "gold",
          shape: "pill",
        },

        // Enable Pay Now checkout flow (optional)
        commit: true,

        // Set up a payment
        payment: function (data, actions) {
          return actions.payment.create({
            redirect_urls: {
              return_url:
                process.env.REACT_APP_SERVER_API + "/payment/paypal/execute/",
            },
            transactions: [
              {
                amount: {
                  total: getTotal,
                  currency: "INR",
                  details: {
                    // bill details
                    // tax: "30",
                    // subtotal: "100",
                    // shipping: "20",
                  },
                },
                description:
                  "Once the payment is successful, it cannot be cancled. Incase of emergency please contact us manually.",
                custom: orderResponse.response.order_id, // replace by order Id
              },
            ],
            note_to_payer: "Contact us for any questions on your order.",
          });
        },
        // Execute the payment
        onAuthorize: function (data, actions) {
          // return actions.payment.execute().then(function () {
          //   // Show a confirmation message to the buyer
          //   window.alert("Thank you for your purchase!");
          // });
          dispatch({
            type: "CLEAR_CART",
          });
          return actions.redirect();
        },
      },
      paypal.current
    );
  }, [dispatch, getTotal, orderResponse]);
  return <div ref={paypal}></div>;
}

export default Paypal;
