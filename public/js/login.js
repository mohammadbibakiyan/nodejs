import {showAlert} from "./alert.js"


export const login = async (email, password) => {
  try {
    const res=await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    console.log(res);
    if(res.data.status==="success"){
      showAlert("success","loged in successfully "),
        window.setTimeout(()=>{
            location.assign("/")
        },1500)
    }
  } catch (err) {
    showAlert("error",err.message);
  }
};

export const logout=async()=>{
  try{
    const res=await axios({
      method:"GET",
      url:"http://127.0.0.1:3000/api/v1/users/logout"
    })
    if(res.status="success") location.reload(true);
  }catch(err){
    console.log(err.response.data);
    showAlert("error","cheack your connection");
  }
}

