import React from "react";
import Axios from "axios";

import Loader from "../Loader";

import Illu from "../../Images/sectionsIllu.png";
import '../../Styles/Body.css';

export default function Students(){

    const Url = "http://localhost:1903/";

    const [ Loading , setLoading ] = React.useState(false);
    const [ Warning , setWarning ] = React.useState(false);
    const [ Content , setContent ] = React.useState("");

    const [ lock, setlock ] = React.useState(false);
    const [ disable, setdisable ] = React.useState(true);
    const [ status, setstatus ] = React.useState("SAVE");

    const [ availableCourses, setavailableCourses ] = React.useState([]);
    const [ availableStaffs, setavailableStaffs ] = React.useState([]);
    const [ availableStudents, setavailableStudents ] = React.useState([]);
    const [ availableSections,setavailableSections ] = React.useState([]);
    const [ availableRooms, setavailableRooms ] = React.useState([]);

    const [ sectionID, setsectionID ] = React.useState("");
    const [ sectionRoom, setsectionRoom ] = React.useState("");
    const [ sectionYear, setsectionYear ] = React.useState("");
    const [ sectionSemester, setsectionSemester ] = React.useState("");
    const [ sectionIncharge, setsectionIncharge ] = React.useState("");
    const [ sectionStudents, setsectionStudents ] = React.useState([]);
    const [ sectionCourses, setsectionCourses ] = React.useState([]);

    const [ roomStatus, setroomStatus ] = React.useState(false);
    const [ updatedRoom, setupdatedRoom ] = React.useState("");
    const [ deletedStudents, setdeletedStudents ] = React.useState([]);
    const [ deletedCourses, setdeletedCourses ] = React.useState([]);
    
    const [ tempFrom, settempFrom ] = React.useState("");
    const [ tempTo, settempTo ] = React.useState("");
    const [ tempCourse, settempCourse ] = React.useState("");
    const [ tempStaff, settempStaff ] = React.useState("");

    const roomUpdate = (e) =>{
        if(status === "SAVE"){
            setupdatedRoom(e);
            setroomStatus(true);
        }
        else if(status === "UPDATE"){
            if(e.length === sectionRoom.length){
                if(sectionRoom !== e){
                    setupdatedRoom(e);
                    setroomStatus(true);
                }
                else if( sectionRoom === e ){
                    setupdatedRoom(e);
                    setroomStatus(false);
                }
            }
            else{
                setupdatedRoom(e);
                setroomStatus(true);
            }
        }
    }

    const addStu = () =>{
        if( (tempFrom.slice(0,11) !== tempTo.slice(0,11))){
            setWarning(true);
            setContent("Students should belong to same group")
        }
        else{
        setsectionStudents( ( prev ) => [ ...prev, { from:
            [tempFrom,tempFrom.slice(0,2), tempFrom.slice(2,6),tempFrom.slice(9,11),tempFrom.slice(6,9),parseInt(tempFrom.slice(11,15))], 
            to:[
            tempTo, tempTo.slice(0,2),tempTo.slice(2,6),tempTo.slice(9,11),tempTo.slice(6,9),parseInt(tempTo.slice(11,15))] } ] );
        }
    }
    

    const addCor = () =>{
        setsectionCourses( ( prev ) => [ ...prev, { course: tempCourse, staff:tempStaff } ] );
    }

    const remStu = ( delStu ) =>{
        setdeletedStudents( sectionStudents.filter( value  => value.from[0] === delStu) );
        setsectionStudents( sectionStudents.filter( value  => value.from[0] !== delStu) );
    }

    const remCor = ( delCor ) =>{
        setdeletedCourses( sectionCourses.filter( value  => value.course === delCor) )
        setsectionCourses( sectionCourses.filter( value  => value.course !== delCor) );
    }

    const Delete = () =>{
        setLoading(true);
        Axios.put(`${Url}deleteSection`, { id:sectionID , year: sectionYear, semester: sectionSemester}).then(
            ( response ) =>{
                if(response.data.status === "200"){
                    Axios.put(`${Url}deleteRoom`, { roomNo: sectionRoom, slot:sectionID });
                    var k=0;
                    for(k=0;k<sectionStudents.length;k++){
                        Axios.put(`${Url}deleteStudentSection`,{ id:sectionID, from:sectionStudents[k].from, to:sectionStudents[k].to });
                    }
                    var l=0;
                    for(l=0;l<sectionCourses.length;l++){
                        Axios.put(`${Url}deleteStaffSection`,{ staff: sectionCourses[l].staff, section:sectionID })
                    }
                    Axios.put(`${Url}sectionFetch`).then(
                        ( response )=>{
                            if(response.data.status === "404"){
                                setavailableSections([]);
                                setlock(false);
                                setdisable(false);
                                setstatus("SAVE");
                            }
                            else{
                                setavailableSections(response.data.sections  );
                                setlock(false);
                                setdisable(true);
                                setstatus("SAVE")
                            }
                            setsectionID("");
                            setsectionRoom("");
                            setsectionYear("");
                            setsectionSemester("");
                            setsectionIncharge("");
                            setsectionCourses([]);
                            setsectionStudents([]);
                            setdeletedCourses([]);
                            setdeletedStudents([]);
                            setupdatedRoom("");
                            setroomStatus(false);
                            setLoading(false);
                            setWarning(true);
                            setContent("Section Deleted Successfuly");
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
            if( sectionID ==="" || updatedRoom==="" || sectionYear==="" || sectionSemester==="" || sectionIncharge==="" || sectionCourses.length === 0 || sectionStudents.length === 0 ){
                setWarning(true);
                setContent("Complete the form");
            }
            else if(sectionID.length<1){
                setWarning(true);
                setContent("Invalid sectionID");
            }
            else{
                setLoading(true);
                Axios.put(`${Url}addSection`, { 
                    id : sectionID,
                    room : updatedRoom,
                    year : sectionYear,
                    semester : sectionSemester,
                    incharge : sectionIncharge,
                    students : sectionStudents,
                    courses : sectionCourses,
                 }).then(
                    ( response )=>{
                        if( response.data.status === "200" ){
                            if(availableRooms.length !== 0) {
                                const find = availableRooms.filter(room  => ((room.roomNo === updatedRoom)));
                                if(find.length === 0){
                                    Axios.put(`${Url}addRoom`, { roomNo: updatedRoom, slot: sectionID+sectionYear+sectionSemester });
                                }
                                else{
                                    Axios.put(`${Url}updateRoom`, { roomNo: updatedRoom, slot: sectionID+sectionYear+sectionSemester });
                                }
                            }
                            else{
                                Axios.put(`${Url}addRoom`, { roomNo: updatedRoom, slot: sectionID+sectionYear+sectionSemester });
                            }
                            var i=0;
                            for(i=0;i<sectionStudents.length;i++){
                                Axios.put(`${Url}updateStudentSection`,{ id:sectionID+sectionYear+sectionSemester, from:sectionStudents[i].from, to:sectionStudents[i].to });
                            }
                            var j=0;
                            for(j=0;j<sectionCourses.length;j++){
                                Axios.put(`${Url}updateStaffSection`,{ staff: sectionCourses[j].staff, section:sectionID+sectionYear+sectionSemester })
                            }
                            Axios.put(`${Url}sectionFetch`).then(
                                ( response )=>{
                                    if(response.data.status === "404"){
                                        setavailableSections([]);
                                        setlock(false);
                                        setdisable(false);
                                        setstatus("SAVE");
                                    }
                                    else{
                                        setavailableSections(response.data.sections);
                                        setlock(false);
                                        setdisable(true);
                                        setstatus("SAVE")
                                    }
                                    setsectionID("");
                                    setsectionRoom("");
                                    setsectionYear("");
                                    setsectionSemester("");
                                    setsectionIncharge("");
                                    setsectionCourses([]);
                                    setsectionStudents([]);
                                    setdeletedCourses([]);
                                    setdeletedStudents([]);
                                    setupdatedRoom("");
                                    setroomStatus(false);
                                    setLoading(false);
                                    setWarning(true);
                                    setContent("Section Added Successfuly");
                                }
                            );
                        }
                        else{
                            setLoading(false);
                            setWarning(true);
                            setContent("Failed to Add Section");
                        }
                    }
                )
            }
        }
        else{
            if( sectionID ==="" || sectionYear==="" || sectionSemester==="" || sectionIncharge==="" || sectionCourses.length === 0 || sectionStudents.length === 0 ){
                setWarning(true);
                setContent("Complete the form");
            }
            else if(sectionID.length<1){
                setWarning(true);
                setContent("Invalid sectionID");
            }
            else{
                setLoading(true);
                Axios.put(`${Url}updateSection`, { 
                    id : sectionID,
                    room : updatedRoom,
                    year : sectionYear,
                    semester : sectionSemester,
                    incharge : sectionIncharge,
                    students : sectionStudents,
                    courses : sectionCourses,
                 }).then(
                    (response)=>{
                        if( response.data.status === "200" ){
                            const find = availableRooms.filter(room  => ((room.roomNo === sectionRoom)));
                            if(find.length === 0){
                                Axios.put(`${Url}addRoom`, { roomNo: updatedRoom, slot: sectionID+sectionYear+sectionSemester });
                            }
                            else{
                                Axios.put(`${Url}updateRoom`, { roomNo: updatedRoom, slot: sectionID+sectionYear+sectionSemester });
                            }
                            if(roomStatus){
                                Axios.put(`${Url}deleteRoom`, { roomNo: sectionRoom, slot:sectionID+sectionYear+sectionSemester });
                            }
                            var k=0;
                            for(k=0;k<deletedStudents.length;k++){
                                Axios.put(`${Url}deleteStudentSection`,{ id:sectionID+sectionYear+sectionSemester, from:deletedStudents[k].from, to:deletedStudents[k].to });
                            }
                            var l=0;
                            for(l=0;l<deletedCourses.length;l++){
                                Axios.put(`${Url}deleteStaffSection`,{ staff: deletedCourses[l].staff, section:sectionID+sectionYear+sectionSemester })
                            }
                            var i = 0;
                            for(i=0;i<sectionStudents.length;i++){
                                Axios.put(`${Url}updateStudentSection`,{ id:sectionID+sectionYear+sectionSemester, from:sectionStudents[i].from, to:sectionStudents[0].to });
                            }
                            var j=0;
                            for(j=0;j<sectionCourses.length;j++){
                                Axios.put(`${Url}updateStaffSection`,{ staff: sectionCourses[j].staff, section:sectionID+sectionYear+sectionSemester })
                            }
                            Axios.put(`${Url}sectionFetch`).then(
                                ( response )=>{
                                    if(response.data.status === "404"){
                                        setavailableSections([]);
                                        setlock(false);
                                        setdisable(false);
                                        setstatus("SAVE");
                                    }
                                    else{
                                        setavailableSections(response.data.sections);
                                        setlock(false);
                                        setdisable(true);
                                        setstatus("SAVE")
                                    }
                                    setsectionID("");
                                    setsectionRoom("");
                                    setsectionYear("");
                                    setsectionSemester("");
                                    setsectionIncharge("");
                                    setsectionCourses([]);
                                    setsectionStudents([]);
                                    setdeletedCourses([]);
                                    setdeletedStudents([]);
                                    setupdatedRoom("");
                                    setroomStatus(false);
                                    setLoading(false);
                                    setWarning(true);
                                    setContent("Section details Updated Successfuly");
                                }
                            );
                        }
                        else{
                            setLoading(false);
                            setWarning(true);
                            setContent("Failed to Update Section Details");
                        }
                    }
                )
            }
        }
    }

    React.useEffect(()=>{
        if(sectionID.length>=3 && sectionYear !=="" && sectionSemester !==""){
            const find = availableSections.filter(section  => ((section.sectionId === sectionID) && (section.year === sectionYear) && (section.semester === sectionSemester)));
            if(find.length !== 0){
                setsectionID(find[0].sectionId);
                setsectionRoom(find[0].roomNo);
                setsectionYear(find[0].year);
                setsectionSemester(find[0].semester);
                setsectionIncharge(find[0].incharge);
                setsectionStudents(find[0].students);
                setsectionCourses(find[0].courses);
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
    },[sectionID,sectionYear,sectionSemester]);

    React.useEffect(()=>{

        setLoading(true);
        Axios.put(`${Url}sectionFetch`).then(
            ( response )=>{
                if(response.data.status === "404"){
                    setavailableSections([]);
                    setlock(false);
                    setdisable(false);
                    setstatus("SAVE");
                }
                else{
                    setavailableSections(response.data.sections);
                    setlock(false);
                    setdisable(true);
                    setstatus("SAVE")
                }
                Axios.put(`${Url}staffFetch`).then(
                    (response1)=>{
                        if(response1.data.status === "404"){
                            setavailableStaffs([]);
                        }
                        else{
                            setavailableStaffs(response1.data.staffs);
                        }
                        Axios.put(`${Url}studentFetch`).then(
                            (response2)=>{
                                if(response2.data.status === "404"){
                                    setavailableStudents([]);
                                }
                                else{
                                    setavailableStudents(response2.data.students);
                                }
                                Axios.put(`${Url}courseFetch`).then(
                                    (response3)=>{
                                        if(response3.data.status === "404"){
                                            setavailableStudents([]);
                                        }
                                        else{
                                            setavailableCourses(response3.data.courses);
                                        }
                                        Axios.put(`${Url}fetchRoom`).then(
                                            (response4)=>{
                                                if(response4.data.status === "404"){
                                                    setavailableRooms([]);
                                                }
                                                else{
                                                    setavailableRooms(response4.data.rooms);
                                                }
                                                setLoading(false);
                                            }
                                        );
                                    }
                                )
                            }
                        )
                    }
                )
            }
        );
    // eslint-disable-next-line
    },[]);

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
                                    <p>Section :</p>
                                </div>
                                <div className="inputsDiv">
                                    <div className="inputDiv">
                                        <label className="inputLabel">Section ID:</label>
                                        <input type="text"
                                            className="contentInput"
                                            placeholder="eg: AI-B"
                                            onChange={(e)=>{setsectionID(e.target.value.toUpperCase())}}
                                            disabled={lock}
                                            list="sectionList"
                                        />
                                        {
                                            (availableSections.length !== 0)?
                                                <datalist id="sectionList">
                                                    {
                                                        availableSections.map( (values)=>{
                                                            return(
                                                                <option key={values._id} value={values.sectionId}>{values.sectionId}</option>
                                                            )
                                                        } )
                                                    }
                                                </datalist>
                                            :<></>
                                        }
                                    </div>
                                    <div className="inputDiv">
                                        <label className="inputLabel">Year:</label>
                                        <input type="text"
                                            className="contentInput"
                                            placeholder="eg: 1"
                                            onChange={(e)=>{setsectionYear(e.target.value.toLowerCase())}}
                                            defaultValue={sectionYear}
                                            disabled={lock}
                                        />
                                    </div>
                                    <div className="inputDiv">
                                        <label className="inputLabel">Semester:</label>
                                        <input type="text"
                                            className="contentInput"
                                            placeholder="eg: 2"
                                            onChange={(e)=>{setsectionSemester(e.target.value)}}
                                            disabled={lock}
                                            defaultValue={sectionSemester}
                                        />
                                    </div>
                                    <div className="inputDiv">
                                        <label className="inputLabel">Room No:</label>
                                        <input type="text"
                                            className="contentInput"
                                            placeholder="eg: UB1011"
                                            onChange={(e)=>{roomUpdate(e.target.value.toUpperCase())}}
                                            disabled={disable}
                                            defaultValue={sectionRoom}
                                        />
                                    </div>
                                    <div className="inputDiv">
                                        <label className="inputLabel">Incharge ID:</label>
                                        <select
                                            className="contentInput"
                                            onChange={(e)=>{setsectionIncharge(e.target.value)}}
                                            disabled={disable}
                                            defaultValue={sectionIncharge}
                                        >
                                            {
                                                (status === "UPDATE")?
                                                <option value={sectionIncharge}>{sectionIncharge}</option>
                                                :<option>Select</option>
                                            }
                                            {
                                                (availableStaffs.length !== 0)?
                                                <>
                                                    {
                                                        availableStaffs.map( (values)=>{
                                                            return(
                                                                <option key={values._id} value={values.staffId}>{values.staffId}</option>
                                                            )
                                                        } )
                                                    }
                                                </>
                                                :<option></option>
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="tableDiv">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>From</th>
                                                <th>To</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                (sectionStudents.length !== 0)?
                                                <>
                                                    {
                                                        sectionStudents.map( (values,index) =>{
                                                            return(
                                                                <tr key={index}>
                                                                    <td>{values.from[0]}</td>
                                                                    <td>{values.to[0]}</td>
                                                                    <td>
                                                                        <button className="deleteButton" onClick={()=>{remStu(values.from[0])}}><i class="fa-solid fa-minus"></i></button>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        } )
                                                    }
                                                </>
                                                :<></>
                                            }
                                            <tr>
                                                <td>
                                                    <select
                                                        className="contentInput"
                                                        onChange={(e)=>{settempFrom(e.target.value)}}
                                                        disabled={disable}
                                                    >
                                                        <option>Select</option>
                                                        {
                                                            (availableStudents.length !== 0)?
                                                            <>
                                                                {
                                                                    availableStudents.map( (values)=>{
                                                                        return(
                                                                            <option key={values._id} value={values.studentId.full}>{values.studentId.full}</option>
                                                                        )
                                                                    } )
                                                                }
                                                            </>
                                                            :<option></option>
                                                        }
                                                    </select>
                                                </td>
                                                <td>
                                                    <select
                                                        className="contentInput"
                                                        onChange={(e)=>{settempTo(e.target.value)}}
                                                        disabled={disable}
                                                    >
                                                        <option>Select</option>
                                                        {
                                                            (availableStudents.length !== 0)?
                                                            <>
                                                                {
                                                                    availableStudents.map( (values)=>{
                                                                        return(
                                                                            <option key={values._id} value={values.studentId.full}>{values.studentId.full}</option>
                                                                        )
                                                                    } )
                                                                }
                                                            </>
                                                            :<option></option>
                                                        }
                                                    </select>
                                                </td>
                                                <td>
                                                    <button className="addButton" onClick={()=>{addStu()}}><i class="fa-solid fa-plus"></i></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="tableDiv">
                                    <table>
                                        <tr>
                                            <th>Course</th>
                                            <th>Staff</th>
                                            <td></td>
                                        </tr>
                                        {
                                            (sectionCourses.length !== 0)?
                                            <>
                                                {
                                                    sectionCourses.map( (values,index) =>{
                                                        return(
                                                            <tr key={index}>
                                                                <td>{values.course}</td>
                                                                <td>{values.staff}</td>
                                                                <td>
                                                                    <button className="deleteButton" onClick={()=>{remCor(values.course)}}><i class="fa-solid fa-minus"></i></button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    } )
                                                }
                                            </>
                                            :<></>
                                        }
                                        <tr>
                                            <td>
                                                <select
                                                    className="contentInput"
                                                    onChange={(e)=>{settempCourse(e.target.value)}}
                                                    disabled={disable}
                                                >
                                                    <option>Select</option>
                                                    {
                                                        (availableCourses.length !== 0)?
                                                        <>
                                                            {
                                                                availableCourses.map( (values)=>{
                                                                    return(
                                                                        <option key={values._id} value={values.courseId}>{values.courseId}</option>
                                                                    )
                                                                } )
                                                            }
                                                        </>
                                                        :<option></option>
                                                    }
                                                </select>
                                            </td>
                                            <td>
                                                <select
                                                    className="contentInput"
                                                    onChange={(e)=>{settempStaff(e.target.value)}}
                                                    disabled={disable}
                                                >
                                                    <option>Select</option>
                                                    {
                                                        (availableStaffs.length !== 0)?
                                                        <>
                                                            {
                                                                availableStaffs.map( (values)=>{
                                                                    return(
                                                                        <option key={values._id} value={values.staffId}>{values.staffId}</option>
                                                                    )
                                                                } )
                                                            }
                                                        </>
                                                        :<option></option>
                                                    }
                                                </select>
                                            </td>
                                            <td>
                                                <button className="addButton" onClick={()=>{addCor()}}><i class="fa-solid fa-plus"></i></button>
                                            </td>
                                        </tr>
                                    </table>
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