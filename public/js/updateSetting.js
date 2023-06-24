/* eslint-disable */
import { showAlert } from './alert';

export const updateSetting = async (data, type) => {
  try {
    let url;
    let headers;
    if (type === 'password') {
      url = '/api/v1/users/updateMyPassword';
      headers = {
        'Content-Type': 'application/json',
      };
    } else {
      url = '/api/v1/users/updateMe';
    }
    const res = await fetch(url, {
      method: 'PATCH',
      headers,
      body: data,
    });
    const response = await res.json();
    if (response.status === 'success') {
      showAlert('success', `Update ${type} sucesssfully`);
    } else {
      showAlert('error', response.message);
    }
  } catch (error) {
    // showAlert('error', error);
    console.log(error);
  }
};
