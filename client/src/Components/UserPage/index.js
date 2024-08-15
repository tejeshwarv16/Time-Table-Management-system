import React from "react";
import { useLocation , useNavigate } from 'react-router-dom';

import StudentTable from "../StudentTable";
import StaffTable from "../StaffTable";
import FreeRoom from "../FreeRoom";

import icon from "../../Images/Icon.png";
import '../../Styles/Navbar.css';

export default function UserPage(){

    const Location = useLocation();
    const Navigate = useNavigate();

    const [ timeTable, settimeTable ] = React.useState("active");
    const [ freeRoom, setfreeRoom ] = React.useState("");
    const [ expand, setexpand ] = React.useState("");

    const Back = () =>{
        Navigate("/");
    }

    const Swap = (Page) =>{
        if(Page === "T"){
            settimeTable("active");
            setfreeRoom("");
        }
        else if(Page === "F"){
            settimeTable("");
            setfreeRoom("active");
        }
    }

    return(
        <div>
            <div className="navbarBase">
                <div className="logoDiv">
                    <img src={icon} alt="Logo" className="navbarLogo"/>
                    <p className="boldTitle">Time Table System</p>
                </div>
                <div className={`menuDiv${expand}`}>
                    <div className="menuSub">
                        <ul className="menuUl">
                            <li className="menuLi">
                                <button className={`menuButton ${timeTable}`}
                                    onClick={()=>{
                                        Swap("T")
                                    }}
                                >
                                    Time Table
                                </button>
                            </li>
                            <li className="menuLi">
                                <button className={`menuButton ${freeRoom}`}
                                    onClick={()=>{
                                        Swap("F")
                                    }}
                                >
                                    Free Rooms
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={`userDiv${expand}`}>
                    <div className="userSub" onClick={()=>{Back()}}>
                        <p className="mainTitle">{Location.state.email}</p>
                        <p className="subTitle">{Location.state.type}</p>
                    </div>
                </div>
                <div className="resIcon">
                    {
                        (expand ==="Res")?<i class="fa-solid fa-chevron-up" onClick={()=>{setexpand("")}}></i>
                        :<i class="fa-solid fa-chevron-down" onClick={()=>{setexpand("Res")}}></i>
                    }
                </div>
            </div>
            {
                (timeTable === "active" && Location.state.type === "student")?
                    <StudentTable Email={Location.state.email} />
                :(timeTable === "active" && Location.state.type === "staff")?
                    <StaffTable Email={Location.state.email} />
                :(freeRoom === "active")?
                    <FreeRoom/>
                :
                <></>
            }
        </div>
    );
}