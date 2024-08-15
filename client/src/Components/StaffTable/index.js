import React from "react";
import Axios from "axios";

import Loader from "../Loader";
import '../../Styles/userBody.css';

export default function StaffTable( {Email} ){

    const Url = "http://localhost:1903/"

    const [ Loading , setLoading ] = React.useState(false);

    const [ staff, setstaff ] = React.useState([]);
    // eslint-disable-next-line
    const [ section, setsection ] = React.useState([]);
    const [ course, setcourse ] = React.useState([]);

    React.useEffect(()=>{
        setLoading(true);
        setcourse([]);
        Axios.put(`${Url}filterStaff`, { mail:Email }).then(
            (response)=>{
                const staffId = response.data.staff[0].staffId;
                if(response.data.status === "404"){
                    setstaff([]);
                }
                else{
                    setstaff(response.data.staff);
                    var i = 0;
                    for(i=0;i<response.data.staff[0].courses.length;i++){
                        Axios.put(`${Url}filterSectionCourse`, {
                            sectionId: response.data.staff[0].courses[i].slice(0,response.data.staff[0].courses[i].length-2),
                            sectionYear:  response.data.staff[0].courses[i].slice(response.data.staff[0].courses[i].length-2,response.data.staff[0].courses[i].length-1),
                            sectionSemester:  response.data.staff[0].courses[i].slice(response.data.staff[0].courses[i].length-1),
                            staffId: staffId
                        }).then(
                            (response1)=>{
                                if(response1.data.status === "404"){
                                    setsection([]);
                                }
                                else{
                                    const section = response1.data.section[0].sectionId;
                                    const room = response1.data.section[0].roomNo;
                                    setsection(response1.data.section)
                                    var j = 0;
                                    for(j=0;j<response1.data.section[0].courses.length;j++){
                                        if(response1.data.section[0].courses[j].staff === staffId){
                                            Axios.put(`${Url}filterCourse`, {data:response1.data.section[0].courses[j].course} ).then(
                                                (response2)=>{
                                                    if(response2.data.status === "404"){
                                                        setcourse( prev => [ ...prev ]);
                                                    }
                                                    else{
                                                        setcourse( prev => [ ...prev, {det:response2.data.result,room:room,section:section} ]);
                                                    }
                                                }
                                            )
                                        }
                                    }
                                }
                            }
                        )
                    }
                }
                setLoading(false);
            }
        )
    // eslint-disable-next-line
    },[])

    if(Loading){
        return(
            <Loader/>
        );
    }
    else if (staff.length !==0 && course.length!==0){
        return(
            <div className="baseDiv1">
                <div className="infoDiv">
                    <div className="infoLine">
                        <p className="label">Name:</p>
                        <p className="data">{staff[0].staffName}</p>
                    </div>
                    <div className="infoLine">
                        <p className="label">Staff ID:</p>
                        <p className="data">{staff[0].staffId}</p>
                    </div>
                    <div className="infoLine">
                        <p className="label">Mobile Number:</p>
                        <p className="data">{staff[0].mobileNo}</p>
                    </div>
                    <div className="infoLine">
                        <p className="label">Email ID:</p>
                        <p className="data">{staff[0].eMail}</p>
                    </div>
                </div>
                <div className="tableDiv1">
                    <table>
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>C.Id</th>
                                <th>C.Name</th>
                                <th>C.Credit</th>
                                <th>C.Slot</th>
                                <th>Room</th>
                                <th>Section</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (course.length !==0)?
                                    <>
                                        {
                                            course.map((value,index)=>{
                                                return(
                                                    <tr key={index+1}>
                                                        <td>{index+1}</td>
                                                        <td>{value.det.courseId}</td>
                                                        <td>{value.det.courseName}</td>
                                                        <td>{value.det.courseCredit}</td>
                                                        <td>{value.det.courseSlot}</td>
                                                        <td>{value.room}</td>
                                                        <td>{value.section}</td>
                                                    </tr>
                                                );
                                            })
                                        }
                                    </>
                                :<></>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}