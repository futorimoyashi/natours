/* eslint-disable */

const stripe = Stripe(
  'pk_test_51NLm4BFEjPrPg5e75lSa0uBuS5HawjPDruvpeiKJDiuydScHfZ2ypgYsaYWbMwRozq8U7NyvBua47WrX8urtlF7s00eaj7zGR1'
);
import { showAlert } from './alert';

export const bookTour = async (tourId) => {
  try {
    //Get checkout session from API
    const res = await fetch(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`,
      {
        method: 'GET',
      }
    );
    const session = await res.json();

    console.log(session);
    //Create checkout form + chance credit card
    await stripe.redirectToCheckout({
      sessionId: session.session.id,
    });
  } catch (error) {
    console.log(error);
    showAlert('error', error);
  }
};
