import React from "react";
import Axios from "axios";

import Loader from "../Loader";

import "../../Styles/userBody.css";

export default function FreeRoom(){

    const Url = "http://localhost:1903/";

    const [ Loading, setLoading ] = React.useState(false);
    const [ room, setroom ] = React.useState([]);

    React.useEffect(()=>{
        setLoading(true);
        Axios.put(`${Url}fetchRoom`).then(
            (response)=>{
                if(response.data.status === "404"){
                    setroom([]);
                }
                else{
                    setroom(response.data.rooms);
                }
                setLoading(false);
            }
        )
    // eslint-disable-next-line
    },[]);

    if(Loading){
        return(
            <Loader/>
        );
    }
    else{
        return(
            <div className="baseDiv1">
                <div className="tableDiv1">
                    <table>
                        <thead>
                            <tr>
                                <th>Room</th>
                                <th>Occupied By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (room.length !==0)?
                                <>
                                    {
                                        room.map((value,index)=>{
                                            return(
                                                <tr key={index+1}>
                                                    <td>{value.roomNo}</td>
                                                    <td>
                                                        {
                                                            (value.slots.length !== 0)?
                                                            <>
                                                                {
                                                                    value.slots.map((value1)=>{
                                                                        return(
                                                                            <label>{value1.slice(0,value1.length-2)+" "}</label>
                                                                        )
                                                                    })
                                                                }
                                                            </>:<>
                                                                <label>NIL</label>
                                                            </>
                                                        }
                                                    </td>
                                                </tr>
                                            )
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