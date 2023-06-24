/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { renderMap } from './mapbox';
import { updateSetting } from './updateSetting';
import { bookTour } from './stripe';

//DOM elements
const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const updatePasswordForm = document.querySelector('.form-user-settings');
const updateDataForm = document.querySelector('.form-user-data');
const bookBtn = document.getElementById('book-tour');

//Delegation
if (mapbox) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );
  renderMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (updateDataForm) {
  updateDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', document.getElementById('name').value);
    data.append('email', document.getElementById('email').value);
    data.append('photo', document.getElementById('photo').files[0]);
    updateSetting(data, 'data');
  });
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-pasword').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSetting(
      JSON.stringify({ passwordCurrent, password, passwordConfirm }),
      'password'
    );

    document.querySelector('.btn--save-pasword').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
