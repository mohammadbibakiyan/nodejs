// import '@babel/polyfill';
import { login,logout } from './login.js';
import { displayMap } from './mapbox.js';

const map =document.getElementById('map');
if (map) {
  const locations = JSON.parse(map.dataset.locations);
  displayMap(locations);
}

const form = document.querySelector('.form');
if (form) {
  form.addEventListener('submit', (e) => {
      e.preventDefault();
    const email = document.querySelector('#email.form__input').value;
    const password = document.querySelector('#password.form__input').value;
    login(email, password);
  });
}

const logoutButton=document.querySelector(".nav__el--logout");
if(logoutButton) logoutButton.addEventListener("click",logout)