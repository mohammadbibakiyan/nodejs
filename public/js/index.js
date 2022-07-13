import { login,logout } from './login.js';
import { displayMap } from './mapbox.js';
import {updateData} from './update.js';
 
const map =document.getElementById('map');
if (map) {
  const locations = JSON.parse(map.dataset.locations);
  displayMap(locations);
}

const form = document.querySelector('.form-login');
if (form) {
  form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.querySelector('#email.form__input').value;
      const password = document.querySelector('#password.form__input').value;
      login(email, password);
  });
}

const updateForm=document.querySelector(".form-user-data");
if(updateForm){
  updateForm.addEventListener('submit', async(e) => {
    e.preventDefault();
    const form=new FormData()
    form.append("email",document.getElementById('email').value)
    form.append("name",document.getElementById('name').value)
    form.append("photo",document.getElementById('photo').files[0])
    await updateData(form,"data");
  });
}

const logoutButton=document.querySelector(".nav__el--logout");
if(logoutButton) logoutButton.addEventListener("click",logout);

const updatePasswordForm=document.querySelector(".form-user-settings");
if(updatePasswordForm){
  updatePasswordForm.addEventListener('submit',async (e) => {
    e.preventDefault();
    const currentPassword = document.querySelector('#password-current').value;
    const newPassword = document.querySelector('#password.form__input').value;
    const passwordConfirm = document.querySelector('#password-confirm.form__input').value;
    // await updateData({currentPassword, newPassword,passwordConfirm},"password");
  })
}

