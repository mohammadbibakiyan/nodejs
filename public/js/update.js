import { showAlert } from './alert.js';

export const updateData = async (data, type) => {
  try {
    let url;
    type === 'password'
      ? url = 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
      : url ='http://127.0.0.1:3000/api/v1/users/updateMe';
    const res=await axios({
      method: 'PATCH',
      url,
      data
    });
    if(res.data.status==="success"){
      showAlert("success",`${type}  update successfully`)
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
