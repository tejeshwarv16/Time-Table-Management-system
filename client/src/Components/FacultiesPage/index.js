import React from "react";
import Axios from "axios";

import Loader from "../Loader";

import Illu from "../../Images/staffIllu.png";
import '../../Styles/Body.css';

export default function Faculties(){

    const Url = "http://localhost:1903/";

    const [ Loading , setLoading ] = React.useState(false);
    const [ Warning , setWarning ] = React.useState(false);
    const [ Content , setContent ] = React.useState("");

    const [ lock, setlock ] = React.useState(false);
    const [ disable, setdisable ] = React.useState(true);
    const [ status, setstatus ] = React.useState("SAVE");

    const [ availableStaffs, setavailabeStaffs ] = React.useState([]);
    const [ staffID, setstaffID ] = React.useState("");
    const [ staffName, setstaffName ] = React.useState("");
    const [ staffEmail, setstaffEmail ] = React.useState("");
    const [ staffcontactNo, setstaffcontactNo ] = React.useState("");

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const Delete = () =>{
        setLoading(true);
        Axios.put(`${Url}deleteStaff`, { id:staffID }).then(
            ( response ) =>{
                if(response.data.status === "200"){
                    Axios.put(`${Url}staffFetch`).then(
                        ( response )=>{
                            if(response.data.status === "404"){
                                setavailabeStaffs([]);
                                setlock(false);
                                setdisable(false);
                                setstatus("SAVE");
                            }
                            else{
                                setavailabeStaffs(response.data.staffs  );
                                setlock(false);
                                setdisable(true);
                                setstatus("SAVE")
                            }
                            setstaffID("");
                            setstaffName("");
                            setstaffEmail("");
                            setstaffcontactNo("");
                            setLoading(false);
                            setWarning(true);
                            setContent("Staff Deleted Successfuly");
                        }
                    );
                }
                else{
                    setLoading(false);
                    setWarning(true);
                    setContent("Failed to Delete Staff");
                }
            }
        )
    }

    const Save = () =>{
        if(status === "SAVE"){
            if( staffID ==="" || staffName==="" || staffEmail==="" || staffcontactNo==="" ){
                setWarning(true);
                setContent("Complete the form");
            }
            else if(staffID.length<6){
                setWarning(true);
                setContent("Invalid StaffID");
            }
            else{
                setLoading(true);
                Axios.put(`${Url}addStaff`, { id:staffID, name:staffName, email:staffEmail, mobileNo:staffcontactNo }).then(
                    ( response )=>{
                        if( response.data.status === "200" ){
                            Axios.put(`${Url}staffFetch`).then(
                                ( response )=>{
                                    if(response.data.status === "404"){
                                        setavailabeStaffs([]);
                                        setlock(false);
                                        setdisable(false);
                                        setstatus("SAVE");
                                    }
                                    else{
                                        setavailabeStaffs(response.data.staffs);
                                        setlock(false);
                                        setdisable(true);
                                        setstatus("SAVE")
                                    }
                                    setstaffID("");
                                    setstaffName("");
                                    setstaffEmail("");
                                    setstaffcontactNo("");
                                    setLoading(false);
                                    setWarning(true);
                                    setContent("Staff Added Successfuly");
                                }
                            );
                        }
                        else{
                            setLoading(false);
                            setWarning(true);
                            setContent("Failed to Add Staff");
                        }
                    }
                )
            }
        }
        else{
            if( staffID ==="" || staffName==="" || staffEmail==="" || staffcontactNo==="" ){
                setWarning(true);
                setContent("Complete the form");
            }
            else if(staffID.length<6){
                setWarning(true);
                setContent("Invalid StaffID");
            }
            else{
                setLoading(true);
                Axios.put(`${Url}updateStaff`, { id:staffID, name:staffName, eMail:staffEmail, mobileNo:staffcontactNo }).then(
                    (response)=>{
                        if( response.data.status === "200" ){
                            Axios.put(`${Url}staffFetch`).then(
                                ( response )=>{
                                    if(response.data.status === "404"){
                                        setavailabeStaffs([]);
                                        setlock(false);
                                        setdisable(false);
                                        setstatus("SAVE");
                                    }
                                    else{
                                        setavailabeStaffs(response.data.staffs);
                                        setlock(false);
                                        setdisable(true);
                                        setstatus("SAVE")
                                    }
                                    setstaffID("");
                                    setstaffName("");
                                    setstaffEmail("");
                                    setstaffcontactNo("");
                                    setLoading(false);
                                    setWarning(true);
                                    setContent("Staff details Updated Successfuly");
                                }
                            );
                        }
                        else{
                            setLoading(false);
                            setWarning(true);
                            setContent("Failed to Update Staff Details");
                        }
                    }
                )
            }
        }
    }

    React.useEffect(()=>{
        if(staffID.length>=6){
            const find = availableStaffs.filter(staff  => staff.staffId === staffID);
            if(find.length !== 0){
                setstaffName(find[0].staffName);
                setstaffEmail(find[0].eMail);
                setstaffcontactNo(find[0].moblileNo);
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
    },[staffID])

    React.useEffect(()=>{

        setLoading(true);
        Axios.put(`${Url}staffFetch`).then(
            ( response )=>{
                if(response.data.status === "404"){
                    setavailabeStaffs([]);
                    setlock(false);
                    setdisable(false);
                    setstatus("SAVE");
                }
                else{
                    setavailabeStaffs(response.data.staffs);
                    setlock(false);
                    setdisable(true);
                    setstatus("SAVE")
                }
                setLoading(false);
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
                                    <p>Staff :</p>
                                </div>
                                <div className="inputDiv">
                                    <label className="inputLabel">Staff ID:</label>
                                    <input type="text"
                                        className="contentInput"
                                        placeholder="eg: 182037"
                                        onChange={(e)=>{setstaffID(e.target.value.toUpperCase())}}
                                        disabled={lock}
                                        list="staffList"
                                    />
                                    {
                                        (availableStaffs.length !== 0)?
                                            <datalist id="staffList">
                                                {
                                                    availableStaffs.map( (values)=>{
                                                        return(
                                                            <option key={values._id} value={values.staffId}>{values.staffId}</option>
                                                        )
                                                    } )
                                                }
                                            </datalist>
                                        :<></>
                                    }
                                </div>
                                <div className="inputDiv">
                                    <label className="inputLabel">Staff Name:</label>
                                    <input type="text"
                                        className="contentInput"
                                        placeholder="eg: Rama Swamy K"
                                        onChange={(e)=>{setstaffName(capitalizeFirstLetter(e.target.value))}}
                                        disabled={disable}
                                        defaultValue={staffName}
                                    />
                                </div>
                                <div className="inputDiv">
                                    <label className="inputLabel">Email ID:</label>
                                    <input type="text"
                                        className="contentInput"
                                        placeholder="eg: zxxxx@srmist.edu.in"
                                        onChange={(e)=>{setstaffEmail(e.target.value.toLowerCase())}}
                                        defaultValue={staffEmail}
                                        disabled={disable}
                                    />
                                </div>
                                <div className="inputDiv">
                                    <label className="inputLabel">Contact No:</label>
                                    <input type="text"
                                        className="contentInput"
                                        placeholder="eg: 9xx2xxxxx5"
                                        onChange={(e)=>{setstaffcontactNo(e.target.value)}}
                                        disabled={disable}
                                        defaultValue={staffcontactNo}
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