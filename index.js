const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();

mongoose.connect( process.env.MONGO , 
    {
        useNewUrlParser:true,
    }
);

const accountModel = require('./Models/accountModel');
const courseModel = require('./Models/courseModel');
const staffModel = require('./Models/staffModel');
const studentModel = require('./Models/studentModel');
const sectionModel = require('./Models/sectionModel');
const roomModel = require('./Models/roomModel');

app.listen(process.env.port, () => {
    console.log(`Server On @ ${process.env.port}`);
} );

/* -----------------------------------------------------Accounts-API------------------------------------------------------------------------ */

app.put("/addAccount" , async (req , res)=>{
    const accounts = await accountModel.find({ eMail:req.body.email})
    if(accounts.length == 0){
        const newAccount = new accountModel({
            eMail: req.body.email,
            password: req.body.password,
            role: "student", 
            type: "user",
        });
        try{
            await newAccount.save();
            const accounts = await accountModel.find({ eMail:req.body.email , password:req.body.password})
            res.send({
                status: "200",
                APIresponse: "Account created",
                id: accounts[0]._id,
                email: accounts[0].eMail,
                type: accounts[0].type,
                
            });
        }
        catch(error){
            res.send({
                status: "404",
                APIresponse: `${error}-Could not create account`,
            })
        }
    }
    else{
        res.send({
            status: "404",
            APIresponse: "Account exist",
        })
    }
});

app.put("/accountCheck" , async (req,res)=>{
    const accounts = await accountModel.find({ eMail:req.body.email , password: req.body.password })
    if(accounts.length != 0){
        if(accounts[0].type == "admin"){
            res.send({
                status: "200",
                APIresponse: "Admin account found",
                id: accounts[0]._id,
                email: accounts[0].eMail,
                type: accounts[0].type,            
            })
        }
        else{
            res.send({
                status: "200",
                APIresponse: "User account found",
                id: accounts[0]._id,
                email: accounts[0].eMail,
                type: accounts[0].type,
                role: accounts[0].role,            
            }) 
        }
    }
    else{
        res.send({
            status: "404",
            APIresponse: "No account found",
        })
    }
});

/* -----------------------------------------------------Couses-API------------------------------------------------------------------------- */

app.put("/courseFetch" , async (req , res) =>{
    const courses = await courseModel.find()
    if(courses.length != 0){
        res.send({
            status: "200",
            APIresponse: "Course found",
            courses: courses,            
        })
    }
    else{
        res.send({
            status: "404",
            APIresponse: "No course found",
        })
    }
});

app.put("/addCourse" , async(req , res) =>{
    const Course = new courseModel({
        courseId: req.body.id,
        courseName: req.body.name,
        courseSlot: req.body.slot, 
        courseCredit: req.body.credit,
    });
    try{
        await Course.save();
        res.send({
            status: "200",
            APIresponse: "Course added",
        });
    }
    catch(error){
        res.send({
            status: "404",
            APIresponse: `${error}-Could not add course`,
        })
    }
});

app.put("/updateCourse" , async(req , res) =>{
    try{
        await courseModel.updateOne({ courseId:req.body.id } , {$set :{ courseName: req.body.name, courseSlot: req.body.slot, courseCredit: req.body.credit }})
        res.send({
            status: "200",
            APIresponse: "Course updated",
        });
    }
    catch(error){
        res.send({
            status: "404",
            APIresponse: `${error}-Course not updated`,
        });
    }
});

app.put("/deleteCourse" , async (req , res) =>{
    try{
        await courseModel.deleteOne({courseId:req.body.id})
        res.send({
            status: "200",
            APIresponse: "Course deleted",
        });
    }
    catch(error){
        res.send({
            status: "404",
            APIresponse: `${error}-Course not deleted`,
        });
    }
});

/* -----------------------------------------------------Faculties-API---------------------------------------------------------------------- */

app.put("/staffFetch" , async (req , res) =>{
    try{
        const staffs = await staffModel.find()
        if(staffs.length != 0){
            res.send({
                status: "200",
                APIresponse: "Faculty found",
                staffs: staffs,
            })
        }
        else{
            res.send({
                status: "404",
                APIresponse: "No Faculty Found",
            })
        }
    }
    catch(error){
        res.send({
            status: "404",
            APIresponse: `${error}-API-Error`,
        })
    }
})

app.put("/addStaff" , async(req , res) =>{
    const Faculty = new staffModel({
        staffId: req.body.id,
        staffName: req.body.name,
        eMail: req.body.email,
        mobileNo: req.body.mobileNo,
    });
    try{
        await Faculty.save();
        res.send({
            status: "200",
            APIresponse: "Faculty added",
        });
    }
    catch(error){
        res.send({
            status: "404",
            APIresponse: `${error}-Could not add Faculty`,
        })
    }
});

app.put("/updateStaff" , async(req , res) =>{
    try{
        await staffModel.updateOne({ staffId:req.body.id } , {$set :{ staffName: req.body.name, eMail: req.body.email, mobileNo: req.body.mobileNo }})
        res.send({
            status: "200",
            APIresponse: "Faculty updated",
        });
    }
    catch(error){
        res.send({
            status: "404-Error",
            APIresponse: `${error}-Faculty not updated`,
        });
    }
});

app.put("/deleteStaff" , async (req , res) =>{
    try{
        await staffModel.deleteOne({staffId:req.body.id})
        res.send({
            status: "200",
            APIresponse: "Faculty deleted",
        });
    }
    catch(error){
        res.send({
            status: "404",
            APIresponse: `${error}Faculty not deleted`,
        });
    }
});

/* -----------------------------------------------------Students-API---------------------------------------------------------------------- */

app.put("/studentFetch" , async (req , res) =>{
    try{
        const students = await studentModel.find().sort({"studentId.rollNo":1});
        if(students.length != 0){
            res.send({
                status: "200",
                APIresponse: "Student found",
                students: students,
            })
        }
        else{
            res.send({
                status: "404",
                APIresponse: "No Student Found",
            })
        }
    }
    catch(error){
        res.send({
            status: "404",
            APIresponse: `${error}-API-Error`,
        })
    }
});

app.put("/addStudent" , async(req , res) =>{
    const newStudent = new studentModel({
        studentId: req.body.id,
        studentName: req.body.name,
        eMail: req.body.email,
        mobileNo: req.body.mobileNo,
    });
    try{
        await newStudent.save();
        res.send({
            status: "200",
            APIresponse: "Student added",
        });
    }
    catch(error){
        res.send({
            status: "404-Error",
            APIresponse: `${error}-Could not add student`,
        })
    }
});

app.put("/updateStudent" , async(req , res) =>{
    try{
        await studentModel.updateOne({ "studentId.full": req.body.id } 
        , {$set :{ studentName: req.body.name , eMail: req.body.email, mobileNo:req.body.mobileNo }})
        res.send({
            status: "200",
            APIresponse: "Student updated",
        });
    }
    catch(error){
        res.send({
            status: "404-Error",
            APIresponse: `${error}-Student not updated`,
        });
    }
});

app.put("/deleteStudent" , async (req , res) =>{
    try{
        await studentModel.deleteOne({"studentId.full": req.body.id})
        res.send({
            status: "200",
            APIresponse: "Student deleted",
        });
    }
    catch(error){
        res.send({
            status: "404",
            APIresponse: `${error}-Student not deleted`,
        });
    }
});

/* -----------------------------------------------------Sections-API-------------------------------------------------------------------- */

app.put("/sectionFetch" , async (req,res) =>{
    try{
        const sections = await sectionModel.find()
        if(sections.length != 0){
            res.send({
                status: "200",
                APIresponse: "Sections found",
                sections: sections,
            })
        }
        else{
            res.send({
                status: "404",
                APIresponse: "No Sections Found",
            })
        }
    }
    catch(error){
        res.send({
            status: "404",
            APIresponse: `${error}-API-Error`,
        })
    }
});

app.put("/deleteStudentSection", async(req,res)=>{
    try{
        await studentModel.updateMany({ "studentId.prefix": req.body.from[1],
            "studentId.year": req.body.from[2],
            "studentId.body": req.body.from[3],
            "studentId.dept": req.body.from[4],
            "studentId.rollNo":{$gte:req.body.from[5]},
            "studentId.rollNo":{$lte:req.body.to[5]} } 
        , {$pull :{ sections: req.body.id  }});
        res.send({
            status: "200",
            APIresponse: `deleted student section`,
        });
    }
    catch(error){
        res.send({
            status: "404",
            APIresponse: `${error}-Could not delete student section`,
        });
    }
});

app.put("/deleteStaffSection", async(req,res)=>{
    try{
        await staffModel.updateOne({ staffId:req.body.staff } , {$pull :{ courses: req.body.section }});
        res.send({
            status: "200",
            APIresponse: `deleted staff section`,
        })
    }
    catch(error){
        res.send({
            status: "404",
            APIresponse: `${error}-Could not delete staff section`,
        });
    }
});

app.put("/updateStudentSection", async(req,res)=>{
    try{
        await studentModel.updateMany({ "studentId.prefix": req.body.from[1],
            "studentId.year": req.body.from[2],
            "studentId.body": req.body.from[3],
            "studentId.dept": req.body.from[4],
            "studentId.rollNo":{$gte:req.body.from[5]},
            "studentId.rollNo":{$lte:req.body.to[5]} } 
        , {$addToSet :{ sections: req.body.id  }});
        res.send({
            status: "200",
            APIresponse: `updated student section`,
        });
    }
    catch(error){
        res.send({
            status: "404",
            APIresponse: `${error}-Could not update student section`,
        });
    }
});

app.put("/updateStaffSection", async(req,res)=>{
    try{
        await staffModel.updateOne({ staffId:req.body.staff } , {$addToSet :{ courses: req.body.section }});
        res.send({
            status: "200",
            APIresponse: `updated staff section`,
        });
    }
    catch(error){
        res.send({
            status: "404",
            APIresponse: `${error}-Could not update staff section`,
        });
    }
});

app.put("/fetchRoom", async(req,res)=>{
    try{
        const rooms = await roomModel.find();
        if(rooms.length != 0){
            res.send({
                status: "200",
                APIresponse: "Rooms foud",
                rooms: rooms,
            })
        }
        else{
            res.send({
                status: "404",
                APIresponse: "No rooms foud",
            })
        }
    }
    catch(error){
        res.send({
            status: "404",
            APIresponse: `${error}-Room fetch failed`
        })
    }
})

app.put("/addRoom", async(req,res)=>{
    const Room = new roomModel({
        roomNo: req.body.roomNo,
        slots: [req.body.slot],
    })
    try{
        await Room.save();
        res.send({
            status: "200",
            APIresponse: "Room added"
        });
    }
    catch(error){
        res.send({
            status:"404",
            APIresponse:`${error}-Room not Added`,
        });
    }
} );

app.put("/updateRoom", async(req,res)=>{
    try{
        await roomModel.updateOne({roomNo:req.body.roomNo},{$addToSet:{slots:req.body.slot}});
        res.send({
            status: "200",
            APIresponse: "Room updated",
        })
    }
    catch(error){
        res.send({
            status:"404",
            APIresponse: `${error}-Room not updated`,
        })
    }
});

app.put("/deleteRoom", async(req,res)=>{
    try{
        await roomModel.updateOne({roomNo: req.body.roomNo},{$pull:{slots:req.body.slot}});
        res.send({
            status:"200",
            APIresponse:"Room deleted",
        });
    }
    catch(error){
        res.send({
            status:"404",
            APIresponse:`${error}-Room not deleted`,
        });
    }
})

app.put("/addSection" , async(req , res) =>{
    const Course = new sectionModel({
        sectionId: req.body.id,
        year: req.body.year,
        semester: req.body.semester,
        incharge: req.body.incharge, 
        roomNo: req.body.room,
        students: req.body.students,
        courses: req.body.courses,
    });
    try{
        await Course.save();
        res.send({
            status: "200",
            APIresponse: "Section added",
        });
    }
    catch(error){
        res.send({
            status: "404",
            APIresponse: `${error}-Could not add section`,
        })
    }
});

app.put("/updateSection" , async(req , res) =>{
    try{
        await sectionModel.updateOne({ sectionId:req.body.id, year:req.body.year, semester:req.body.semester } , {$set :{ room:req.body.room, incharge:req.body.incharge, students:req.body.students,  courses: req.body.courses }});
        res.send({
            status: "200",
            APIresponse: "Section updated",
        });
    }
    catch(error){
        res.send({
            status: "404",
            APIresponse: `${error}-Could not update section`,
        })
    }
});

app.put("/deleteSection", async(req,res)=>{
    try{
        await sectionModel.deleteOne({sectionId: req.body.id, year:req.body.year, semester:req.body.semester});
        res.send({
            status: "200",
            APIresponse: "Section deleted",
        });
    }
    catch(error){
        res.send({
            status: "404",
            APIresponse: `${error}-Could not delete section`,
        })
    }
})

/* -----------------------------------------------------StudentTable-API-------------------------------------------------------------------- */

app.put("/filterStudent", async(req,res)=>{
    try{
        const student = await studentModel.find({eMail: req.body.mail});
        if(student.length !=0){
            res.send({
                status: "200",
                APIresponse: "Student Found",
                student: student,
            })
        }
        else{
            res.send({
                status: "404",
                APIresponse: "No student found",
            })
        }
    }
    catch(error){
        res.send({
            status:"404",
            APIresponse:`${error}-No student found`
        })
    }
});

app.put("/filterSection", async(req,res)=>{
    try{
        const section = await sectionModel.find({
            sectionId: req.body.sectionId,
            year: req.body.sectionYear,
            semester: req.body.sectionSemester
        });
        if(section.length !=0){
            res.send({
                status: "200",
                APIresponse: "Section Found",
                section: section,
            })
        }
        else{
            res.send({
                status: "404",
                APIresponse: "No section found",
            })
        }
    }
    catch(error){
        res.send({
            status:"404",
            APIresponse:`${error}-No section found`
        })
    }
});

app.put("/filterCourseStaff", async(req,res)=>{
    try{
        const course = await courseModel.find({courseId:req.body.data.course});
        const staff = await staffModel.find({staffId:req.body.data.staff});
        res.send({
            status:"200",
            APIresponse:"Course Staff Found",
            result: { course:course[0], staff:staff[0] }
        })
    }
    catch(error){
        res.send({
            status:"404",
            APIresponse: `${error}-Course Staff No Found`
        })
    }
});

app.put("/filterStaff", async(req,res)=>{
    try{
        const staff = await staffModel.find({eMail: req.body.mail});
        if(staff.length !=0){
            res.send({
                status: "200",
                APIresponse: "Staff Found",
                staff: staff,
            })
        }
        else{
            res.send({
                status: "404",
                APIresponse: "No staff found",
            })
        }
    }
    catch(error){
        res.send({
            status:"404",
            APIresponse:`${error}-No staff found`
        })
    }
});

app.put("/filterSectionCourse", async(req,res)=>{
    try{
        const section = await sectionModel.find({
            sectionId: req.body.sectionId,
            year: req.body.sectionYear,
            semester: req.body.sectionSemester,
            "courses.staff": req.body.staffId,
        });
        if(section.length !=0){
            res.send({
                status: "200",
                APIresponse: "Section Found",
                section: section,
            })
        }
        else{
            res.send({
                status: "404",
                APIresponse: "No section found",
            })
        }
    }
    catch(error){
        res.send({
            status:"404",
            APIresponse:`${error}-No section found`
        })
    }
});

app.put("/filterCourse", async(req,res)=>{
    try{
        const course = await courseModel.find({courseId:req.body.data});
        res.send({
            status:"200",
            APIresponse:"Course Found",
            result: course[0]
        })
    }
    catch(error){
        res.send({
            status:"404",
            APIresponse: `${error}-Course No Found`
        })
    }
});