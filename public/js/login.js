/* eslint-disable */
import { showAlert } from './alert';

export const login = async function (email, password) {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/v1/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const response = await res.json();
    if (response.status === 'success') {
      showAlert('success', 'Loggin sucesssfully');
      window.setTimeout(location.assign('/'), 1500);
    } else {
      showAlert('error', response.message);
    }
  } catch (error) {
    showAlert('error', error);
  }
};

export const logout = async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/v1/users/logout', {
      method: 'GET',
    });

    const response = await res.json();
    if (response.status === 'success') location.reload(true);
  } catch (error) {
    showAllert('error', 'Error logging out! Please try again!');
  }
};
