import React from "react";
import { useNavigate } from "react-router-dom"
import Axios from "axios";

import Logo from "../../Images/Logo.png";
import '../../Styles/LoginPage.css';

function Login() {

  const Url = "http://localhost:1903/"
  const Navigate = useNavigate();

  const [ Warning , setWarning ] = React.useState(false);
  const [ Email , setEmail ] = React.useState();
  const [ Password , setPassword ] = React.useState();

  /* To create an account and get status, APIresponse, objectId, email, type as response

  const AccountCreate = () =>{
    Axios.put(`${Url}AddAccount`, { email : Email , password : Password }).then(
      (response) =>{
        console.log(response.data.status , response.data.response)
      }
    )
  }

  */

  /* To find an account and get status, APIresponse, objectId, email, type as response */

  const AccountCheck = () =>{
    Axios.put(`${Url}accountCheck`, { email : Email , password : Password }).then(
      (response)=>{
        if(response.data.status === "200"){
          if(response.data.type === "admin"){
            Navigate("/adminPage" , { state: {
              id: response.data.id,
              email: response.data.email,
              type: response.data.type,}
            })
          }
          else if(response.data.type === "user"){
            Navigate("/userPage" , { state: {
              id: response.data.id,
              email: response.data.email,
              type: response.data.role,}
            })
          }
        }
        else{
          setWarning(true);
        }
      }
    );
  }

  return (
    <div>
      {
        (Warning)?
          <div className="WarningBox">
            <p className="Warning">Invalid Login</p>
            <button className="Button Close" onClick={() =>{setWarning(false)}}>X</button>
          </div>
        :<></>
      }
      <div className="Row BaseBox">
        <div className="Column AddBox">
          <div className="AddArea">
            <img src={Logo} alt="Icon" className="Logo"/>
          </div>
        </div>
        <div className="Column FormBox">
          <div className="InputArea">
            <div className="InputBox">
              <p className="Title">LOGIN</p>
            </div>
            <div className="InputBox">
              <input type="email" className="Input" placeholder="Username..." onChange={(e)=>{setWarning(false);setEmail(e.target.value)}}></input>
            </div>
            <div className="InputBox">
              <input type="password" className="Input" placeholder="Password..." onChange={(e)=>{setWarning(false);setPassword(e.target.value)}}></input>
            </div>
            <div className="InputBox">
              <button className="Button Main" onClick={()=>{AccountCheck()}}>GET IN</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  
export default Login;


/*

<div className="InputArea">
            <input type="email" className="Inputs" placeholder="Username..." onChange={(e)=>{setEmail(e.target.value)}}></input>
            <input type="password" className="Inputs" placeholder="Password..." onChange={(e)=>{setPassword(e.target.value)}}></input>
            <button className="Inputs Green" onClick={()=>{AccountCheck()}}>LOG IN</button>
          </div>

*/