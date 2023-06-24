/* eslint-disable */

const stripe = Stripe(
  'pk_test_51NLm4BFEjPrPg5e75lSa0uBuS5HawjPDruvpeiKJDiuydScHfZ2ypgYsaYWbMwRozq8U7NyvBua47WrX8urtlF7s00eaj7zGR1'
);
import { showAlert } from './alert';

export const bookTour = async (tourId) => {
  try {
    //Get checkout session from API
    const res = await fetch(`/api/v1/bookings/checkout-session/${tourId}`, {
      method: 'GET',
    });
    const session = await res.json();

    //Create checkout form + chance credit card
    await stripe.redirectToCheckout({
      sessionId: session.session.id,
    });
  } catch (error) {
    showAlert('error', error);
  }
};
