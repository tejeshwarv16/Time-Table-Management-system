import React from "react";
import Axios from "axios";

import Loader from "../Loader";
import '../../Styles/userBody.css';

export default function StudentTable( {Email} ){

    const Url = "http://localhost:1903/"

    const [ Loading , setLoading ] = React.useState(false);

    const [ student, setstudent ] = React.useState([]);
    const [ section, setsection ] = React.useState([]);
    const [ courseStaff, setcourseStaff ] = React.useState([]);

    React.useEffect(()=>{
        setLoading(true);
        setcourseStaff([]);
        Axios.put(`${Url}filterStudent`, { mail:Email }).then(
            (response)=>{
                if(response.data.status === "404"){
                    setstudent([]);
                }
                else{
                    setstudent(response.data.student);
                    var i = 0;
                    for(i=0;i<response.data.student[0].sections.length;i++){
                        Axios.put(`${Url}filterSection`, {
                            sectionId: response.data.student[0].sections[i].slice(0,response.data.student[0].sections[i].length-2),
                            sectionYear:  response.data.student[0].sections[i].slice(response.data.student[0].sections[i].length-2,response.data.student[0].sections[i].length-1),
                            sectionSemester:  response.data.student[0].sections[i].slice(response.data.student[0].sections[i].length-1)
                        }).then(
                            (response1)=>{
                                if(response1.data.status === "404"){
                                    setsection([]);
                                }
                                else{
                                    const room = response1.data.section[0].roomNo;
                                    setsection(response1.data.section)
                                    var j = 0;
                                    for(j=0;j<response1.data.section[0].courses.length;j++){
                                        Axios.put(`${Url}filterCourseStaff`, {data:response1.data.section[0].courses[j]} ).then(
                                            (response2)=>{
                                                if(response2.data.status === "404"){
                                                    setcourseStaff( prev => [ ...prev ]);
                                                }
                                                else{
                                                    setcourseStaff( prev => [ ...prev, {det:response2.data.result,room:room} ]);
                                                }
                                            }
                                        )
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
    else if (student.length !==0 && courseStaff.length!==0){
        return(
            <div className="baseDiv1">
                <div className="infoDiv">
                    <div className="infoLine">
                        <p className="label">Name:</p>
                        <p className="data">{student[0].studentName}</p>
                    </div>
                    <div className="infoLine">
                        <p className="label">Register Number:</p>
                        <p className="data">{student[0].studentId.full}</p>
                    </div>
                    <div className="infoLine">
                        <p className="label">Mobile Number:</p>
                        <p className="data">{student[0].mobileNo}</p>
                    </div>
                    <div className="infoLine">
                        <p className="label">Email ID:</p>
                        <p className="data">{student[0].eMail}</p>
                    </div>
                    <div className="infoLine">
                        <p className="label">Year:</p>
                        <p className="data">{section[0].year}</p>
                    </div>
                    <div className="infoLine">
                        <p className="label">Semester:</p>
                        <p className="data">{section[0].semester}</p>
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
                                <th>F.Id</th>
                                <th>F.Name</th>
                                <th>F.Email</th>
                                <th>Room</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (courseStaff.length !==0)?
                                    <>
                                        {
                                            courseStaff.map((value,index)=>{
                                                return(
                                                    <tr key={index+1}>
                                                        <td>{index+1}</td>
                                                        <td>{value.det.course.courseId}</td>
                                                        <td>{value.det.course.courseName}</td>
                                                        <td>{value.det.course.courseCredit}</td>
                                                        <td>{value.det.course.courseSlot}</td>
                                                        <td>{value.det.staff.staffId}</td>
                                                        <td>{value.det.staff.staffName}</td>
                                                        <td>{value.det.staff.eMail}</td>
                                                        <td>{value.room}</td>
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