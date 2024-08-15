import React from "react";
import Axios from "axios";

import Loader from "../Loader";

import Illu from "../../Images/studentIllu.png";
import '../../Styles/Body.css';

export default function Students(){

    const Url = "http://localhost:1903/";

    const [ Loading , setLoading ] = React.useState(false);
    const [ Warning , setWarning ] = React.useState(false);
    const [ Content , setContent ] = React.useState("");

    const [ lock, setlock ] = React.useState(false);
    const [ disable, setdisable ] = React.useState(true);
    const [ status, setstatus ] = React.useState("SAVE");

    const [ availableStudent, setavailabeStudents ] = React.useState([]);
    const [ studentID, setstudentID ] = React.useState("");
    const [ studentName, setstudentName ] = React.useState("");
    const [ studentEmail, setstudentEmail ] = React.useState("");
    const [ studentcontactNo, setstudentcontactNo ] = React.useState("");

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const Delete = () =>{
        setLoading(true);
        Axios.put(`${Url}deleteStudent`, { id:studentID }).then(
            ( response ) =>{
                if(response.data.status === "200"){
                    Axios.put(`${Url}studentFetch`).then(
                        ( response )=>{
                            if(response.data.status === "404"){
                                setavailabeStudents([]);
                                setlock(false);
                                setdisable(false);
                                setstatus("SAVE");
                            }
                            else{
                                setavailabeStudents(response.data.students  );
                                setlock(false);
                                setdisable(true);
                                setstatus("SAVE")
                            }
                            setstudentID("");
                            setstudentName("");
                            setstudentEmail("");
                            setstudentcontactNo("");
                            setLoading(false);
                            setWarning(true);
                            setContent("student Deleted Successfuly");
                        }
                    );
                }
                else{
                    setLoading(false);
                    setWarning(true);
                    setContent("Failed to Delete student");
                }
            }
        )
    }

    const Save = () =>{
        if(status === "SAVE"){
            if( studentID ==="" || studentName==="" || studentEmail==="" || studentcontactNo==="" ){
                setWarning(true);
                setContent("Complete the form");
            }
            else if(studentID.length<15){
                setWarning(true);
                setContent("Invalid studentID");
            }
            else{
                setLoading(true);
                Axios.put(`${Url}addStudent`, { id:{full:studentID, prefix:studentID.slice(0,2), year: studentID.slice(2,6), body: studentID.slice(9,11),dept:studentID.slice(6,9),rollNo:parseInt(studentID.slice(11,15))}, name:studentName, email:studentEmail, mobileNo:studentcontactNo }).then(
                    ( response )=>{
                        if( response.data.status === "200" ){
                            Axios.put(`${Url}studentFetch`).then(
                                ( response )=>{
                                    if(response.data.status === "404"){
                                        setavailabeStudents([]);
                                        setlock(false);
                                        setdisable(false);
                                        setstatus("SAVE");
                                    }
                                    else{
                                        setavailabeStudents(response.data.students);
                                        setlock(false);
                                        setdisable(true);
                                        setstatus("SAVE")
                                    }
                                    setstudentID("");
                                    setstudentName("");
                                    setstudentEmail("");
                                    setstudentcontactNo("");
                                    setLoading(false);
                                    setWarning(true);
                                    setContent("student Added Successfuly");
                                }
                            );
                        }
                        else{
                            setLoading(false);
                            setWarning(true);
                            setContent("Failed to Add student");
                        }
                    }
                )
            }
        }
        else{
            if( studentID ==="" || studentName==="" || studentEmail==="" || studentcontactNo==="" ){
                setWarning(true);
                setContent("Complete the form");
            }
            else if(studentID.length<15){
                setWarning(true);
                setContent("Invalid studentID");
            }
            else{
                setLoading(true);
                Axios.put(`${Url}updateStudent`, { id:studentID, name:studentName, eMail:studentEmail, mobileNo:studentcontactNo }).then(
                    (response)=>{
                        if( response.data.status === "200" ){
                            Axios.put(`${Url}studentFetch`).then(
                                ( response )=>{
                                    if(response.data.status === "404"){
                                        setavailabeStudents([]);
                                        setlock(false);
                                        setdisable(false);
                                        setstatus("SAVE");
                                    }
                                    else{
                                        setavailabeStudents(response.data.students);
                                        setlock(false);
                                        setdisable(true);
                                        setstatus("SAVE")
                                    }
                                    setstudentID("");
                                    setstudentName("");
                                    setstudentEmail("");
                                    setstudentcontactNo("");
                                    setLoading(false);
                                    setWarning(true);
                                    setContent("student details Updated Successfuly");
                                }
                            );
                        }
                        else{
                            setLoading(false);
                            setWarning(true);
                            setContent("Failed to Update student Details");
                        }
                    }
                )
            }
        }
    }

    React.useEffect(()=>{
        if(studentID.length>=15){
            const find = availableStudent.filter(student  => student.studentId.full === studentID);
            if(find.length !== 0){
                setstudentName(find[0].studentName);
                setstudentEmail(find[0].eMail);
                setstudentcontactNo(find[0].mobileNo);
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
    },[studentID]);// eslint-disable-next-line

    React.useEffect(()=>{

        setLoading(true);
        Axios.put(`${Url}studentFetch`).then(
            ( response )=>{
                if(response.data.status === "404"){
                    setavailabeStudents([]);
                    setlock(false);
                    setdisable(false);
                    setstatus("SAVE");
                }
                else{
                    setavailabeStudents(response.data.students);
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
                                    <p>Student :</p>
                                </div>
                                <div className="inputDiv">
                                    <label className="inputLabel">Student ID:</label>
                                    <input type="text"
                                        className="contentInput"
                                        placeholder="eg: 182037"
                                        onChange={(e)=>{setstudentID(e.target.value.toUpperCase())}}
                                        disabled={lock}
                                        list="studentList"
                                    />
                                    {
                                        (availableStudent.length !== 0)?
                                            <datalist id="studentList">
                                                {
                                                    availableStudent.map( (values)=>{
                                                        return(
                                                            <option key={values._id} value={values.studentId.full}>{values.studentId.full}</option>
                                                        )
                                                    } )
                                                }
                                            </datalist>
                                        :<></>
                                    }
                                </div>
                                <div className="inputDiv">
                                    <label className="inputLabel">Name:</label>
                                    <input type="text"
                                        className="contentInput"
                                        placeholder="eg: Vinay R"
                                        onChange={(e)=>{setstudentName(capitalizeFirstLetter(e.target.value))}}
                                        disabled={disable}
                                        defaultValue={studentName}
                                    />
                                </div>
                                <div className="inputDiv">
                                    <label className="inputLabel">Email ID:</label>
                                    <input type="text"
                                        className="contentInput"
                                        placeholder="eg: vxxxx@srmist.edu.in"
                                        onChange={(e)=>{setstudentEmail(e.target.value.toLowerCase())}}
                                        defaultValue={studentEmail}
                                        disabled={disable}
                                    />
                                </div>
                                <div className="inputDiv">
                                    <label className="inputLabel">Contact No:</label>
                                    <input type="text"
                                        className="contentInput"
                                        placeholder="eg: 9xx2xxxxx5"
                                        onChange={(e)=>{setstudentcontactNo(e.target.value)}}
                                        disabled={disable}
                                        defaultValue={studentcontactNo}
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