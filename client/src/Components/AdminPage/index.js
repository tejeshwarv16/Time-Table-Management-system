import React from "react";
import { useLocation , useNavigate } from 'react-router-dom';

import CoursePart from "../CoursesPage";
import StaffPart from "../FacultiesPage";
import StudentPart from "../StudentsPage";
import SectionPart from "../SectionsPage";

import icon from "../../Images/Icon.png";
import '../../Styles/Navbar.css';

export default function AdminPage(){

    const Location = useLocation();
    const Navigate = useNavigate();

    const [ Courses , setCourses ] = React.useState("active");
    const [ Staffs , setStaffs ] = React.useState("");
    const [ Students , setStudents ] = React.useState("");
    const [ Sections, setSections ] = React.useState("");
    const [ expand, setexpand ] = React.useState("");

    const Back = () =>{
        Navigate("/");
    }

    const Swap = (Page) =>{
        if(Page === "C"){
            setCourses("active");
            setStaffs("");
            setStudents("");
            setSections("");
        }
        else if(Page === "F"){
            setStaffs("active");
            setCourses("");
            setStudents("");
            setSections("");
        }
        else if(Page === "S"){
            setStudents("active");
            setCourses("");
            setStaffs("");
            setSections("");
        }
        else if(Page === "SE"){
            setStudents("");
            setCourses("");
            setStaffs("");
            setSections("active");
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
                                <button className={`menuButton ${Courses}`}
                                    onClick={()=>{
                                        Swap("C")
                                    }}
                                >
                                    Course
                                </button>
                            </li>
                            <li className="menuLi">
                                <button className={`menuButton ${Staffs}`}
                                    onClick={()=>{
                                        Swap("F")
                                    }}
                                >
                                    Staffs
                                </button>
                            </li>
                            <li className="menuLi">
                                <button className={`menuButton ${Students}`}
                                    onClick={()=>{
                                        Swap("S")
                                    }}
                                >
                                    Student
                                </button>
                            </li>
                            <li className="menuLi">
                                <button className={`menuButton ${Sections}`}
                                    onClick={()=>{
                                        Swap("SE")
                                    }}
                                >
                                    Section
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
                (Courses === "active")?
                    <CoursePart/>
                :
                (Staffs === "active")?
                    <StaffPart/>
                :
                (Students === "active")?
                    <StudentPart/>
                :
                (Sections === "active")?
                    <SectionPart/>
                :
                <></>
            }
        </div>
    );
}

/*
#54BAB9
<div className="Navbar">
                <ul className="NavbarUl F">
                    <li className="NavbarLi L">
                        <ul className="NavbarUl C">
                            <li className="NavbarLi">
                                <button className={`NavbarLink ${Courses}`} 
                                    onClick={()=>{
                                        Swap("C")
                                    }}
                                >Courses</button>
                            </li>
                            <li className="NavbarLi">
                                <button className={`NavbarLink ${Faculties}`}
                                    onClick={()=>{
                                        Swap("F")
                                    }}
                                >Faculties</button>
                            </li>
                            <li className="NavbarLi">
                                <button className={`NavbarLink ${Students}`}
                                onClick={()=>{
                                    Swap("S")
                                }}
                                >Students</button>
                            </li>
                        </ul>
                    </li>
                    <li className="NavbarLi R">
                        <div className="Logger" onClick={()=>{Back()}}>
                            <p className="LoggerText UP">{Location.state.email}</p>
                            <p className="LoggerText LW">{Location.state.type}</p>
                        </div>
                    </li>
                    <div className="Clear"></div>
                </ul>
                <div className="Clear"></div>
            </div>

 */