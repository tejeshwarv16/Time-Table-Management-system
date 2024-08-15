import React from "react";
import Axios from "axios";

import Loader from "../Loader";
import '../../Styles/Body.css';
import Illu from '../../Images/courseIllu.png'

export default function Courses(){

    const Url = "http://localhost:1903/";

    const [ Loading , setLoading ] = React.useState(false);
    const [ Warning , setWarning ] = React.useState(false);
    const [ Content , setContent ] = React.useState("");

    const [ lock, setlock ] = React.useState(false);
    const [ disable, setdisable ] = React.useState(true);
    const [ status, setstatus ] = React.useState("SAVE");

    const [ availableCourses, setavailabeCourses ] = React.useState([]);
    const [ courseID, setcourseID ] = React.useState("");
    const [ courseName, setcourseName ] = React.useState("");
    const [ courseSlot, setcourseSlot ] = React.useState("");
    const [ courseCredit, setcourseCredit ] = React.useState("");

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const Delete = () =>{
        setLoading(true);
        Axios.put(`${Url}deleteCourse`, { id:courseID }).then(
            ( response ) =>{
                if(response.data.status === "200"){
                    Axios.put(`${Url}courseFetch`).then(
                        ( response )=>{
                            if(response.data.status === "404"){
                                setavailabeCourses([]);
                                setlock(false);
                                setdisable(false);
                                setstatus("SAVE");
                            }
                            else{
                                setavailabeCourses(response.data.courses);
                                setlock(false);
                                setdisable(true);
                                setstatus("SAVE")
                            }
                            setcourseID("");
                            setcourseName("");
                            setcourseSlot("");
                            setcourseCredit("");
                            setLoading(false);
                            setWarning(true);
                            setContent("Course Deleted Successfuly");
                        }
                    );
                }
                else{
                    setLoading(false);
                    setWarning(true);
                    setContent("Failed to Delete Course");
                }
            }
        )
    }

    const Save = () =>{
        if(status === "SAVE"){
            if( courseID ==="" || courseName==="" || courseSlot==="" || courseCredit==="" ){
                setWarning(true);
                setContent("Complete the form");
            }
            else if(courseID.length<9){
                setWarning(true);
                setContent("Invalid CourseID");
            }
            else{
                setLoading(true);
                Axios.put(`${Url}addCourse`, { id:courseID, name:courseName, slot:courseSlot, credit:courseCredit }).then(
                    ( response )=>{
                        if( response.data.status === "200" ){
                            Axios.put(`${Url}courseFetch`).then(
                                ( response )=>{
                                    if(response.data.status === "404"){
                                        setavailabeCourses([]);
                                        setlock(false);
                                        setdisable(false);
                                        setstatus("SAVE");
                                    }
                                    else{
                                        setavailabeCourses(response.data.courses);
                                        setlock(false);
                                        setdisable(true);
                                        setstatus("SAVE")
                                    }
                                    setcourseID("");
                                    setcourseName("");
                                    setcourseSlot("");
                                    setcourseCredit("");
                                    setLoading(false);
                                    setWarning(true);
                                    setContent("Course Added Successfuly");
                                }
                            );
                        }
                        else{
                            setLoading(false);
                            setWarning(true);
                            setContent("Failed to Add Course");
                        }
                    }
                )
            }
        }
        else{
            if( courseID ==="" || courseName==="" || courseSlot==="" || courseCredit==="" ){
                setWarning(true);
                setContent("Complete the form");
            }
            else if(courseID.length<9){
                setWarning(true);
                setContent("Invalid CourseID");
            }
            else{
                setLoading(true);
                Axios.put(`${Url}updateCourse`, { id:courseID, name:courseName, slot:courseSlot, credit:courseCredit }).then(
                    (response)=>{
                        if( response.data.status === "200" ){
                            Axios.put(`${Url}courseFetch`).then(
                                ( response )=>{
                                    if(response.data.status === "404"){
                                        setavailabeCourses([]);
                                        setlock(false);
                                        setdisable(false);
                                        setstatus("SAVE");
                                    }
                                    else{
                                        setavailabeCourses(response.data.courses);
                                        setlock(false);
                                        setdisable(true);
                                        setstatus("SAVE")
                                    }
                                    setcourseID("");
                                    setcourseName("");
                                    setcourseSlot("");
                                    setcourseCredit("");
                                    setLoading(false);
                                    setWarning(true);
                                    setContent("Course Updated Successfuly");
                                }
                            );
                        }
                        else{
                            setLoading(false);
                            setWarning(true);
                            setContent("Failed to Update Course");
                        }
                    }
                )
            }
        }
    }

    React.useEffect(()=>{
        if(courseID.length>=9){
            const find = availableCourses.filter(course  => course.courseId === courseID);
            if(find.length !== 0){
                setcourseName(find[0].courseName);
                setcourseSlot(find[0].courseSlot);
                setcourseCredit(find[0].courseCredit);
                setstatus("UPDATE")
                setlock(false);
                setdisable(false);
            }
            else{
                setstatus("SAVE")
                setlock(false);
                setdisable(false);
            }
        }
        // eslint-disable-next-line
    },[courseID]);// eslint-disable-next-line

    React.useEffect(()=>{

        setLoading(true);
        Axios.put(`${Url}courseFetch`).then(
            ( response )=>{
                if(response.data.status === "404"){
                    setavailabeCourses([]);
                    setlock(false);
                    setdisable(false);
                    setstatus("SAVE");
                }
                else{
                    setavailabeCourses(response.data.courses);
                    setlock(false);
                    setdisable(true);
                    setstatus("SAVE")
                }
                setLoading(false);
            }
        );
        // eslint-disable-next-line

    },[]);// eslint-disable-next-line

    if(Loading){
        return(
            <Loader/>
        );
    }
    else{
        return(
            <div className="MainBox">
                {
                    (Warning)?
                    <div className="WarningBox">
                        <p className="Warning">{Content}</p>
                        <button className="Button Close" onClick={() =>{setWarning(false)}}>X</button>
                    </div>
                    :<></>
                }
                <div className="baseDiv">
                    <div className="illuDiv">
                        <img src={Illu} alt="Illustration for course page" className="illuImg"/>
                    </div>
                    <div className="contentDiv">
                        <div>
                            <div className="headerDiv">
                                <p>Course :</p>
                            </div>
                            <div className="inputDiv">
                                <label className="inputLabel">Course ID:</label>
                                <input type="text"
                                    className="contentInput"
                                    placeholder="eg: 18MAB101T"
                                    onChange={(e)=>{setcourseID(e.target.value.toUpperCase())}}
                                    disabled={lock}
                                    list="courseList"
                                />
                                {
                                    (availableCourses.length !== 0)?
                                        <datalist id="courseList">
                                            {
                                                availableCourses.map( (values)=>{
                                                    return(
                                                        <option key={values._id} value={values.courseId}>{values.courseId}</option>
                                                    )
                                                } )
                                            }
                                        </datalist>
                                    :<></>
                                }
                            </div>
                            <div className="inputDiv">
                                <label className="inputLabel">Course Name:</label>
                                <input type="text"
                                    className="contentInput"
                                    placeholder="eg: CALCULUS AND LINEAR ALGEBRA"
                                    onChange={(e)=>{setcourseName(capitalizeFirstLetter(e.target.value))}}
                                    disabled={disable}
                                    defaultValue={courseName}
                                />
                            </div>
                            <div className="inputDiv">
                                <label className="inputLabel">Course Slot:</label>
                                <input type="text"
                                    className="contentInput"
                                    placeholder="eg: A"
                                    onChange={(e)=>{setcourseSlot(e.target.value.toUpperCase())}}
                                    defaultValue={courseSlot}
                                    disabled={disable}
                                />
                            </div>
                            <div className="inputDiv">
                                <label className="inputLabel">Course Credit:</label>
                                <input type="text"
                                    className="contentInput"
                                    placeholder="eg: 4"
                                    onChange={(e)=>{setcourseCredit(e.target.value)}}
                                    disabled={disable}
                                    defaultValue={courseCredit}
                                />
                            </div>
                            <div className="buttonDiv">
                                <button className="button" onClick={()=>{Save()}}> {status} </button>
                                {
                                    (status === "UPDATE")?<button className="button del" onClick={()=>{Delete()}}>DELETE</button>:<></>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}