import Attendance from "../models/Attendance.js";

/*
================================
MARK ATTENDANCE
================================
*/
export const markAttendance =
async (req,res)=>{

    try{

        const {
            employee,
            status,
            remarks=""
        } = req.body;

        // today's date only
        const today = new Date();
        today.setHours(0,0,0,0);

        const existing =
            await Attendance.findOne({

                employee,

                date:{
                    $gte:today,
                    $lt:new Date(
                        today.getTime()+
                        24*60*60*1000
                    )
                }
            });

        if(existing){

            existing.status = status;
            existing.remarks = remarks;

            await existing.save();

            return res.json({
                success:true,
                attendance:existing
            });
        }

        const attendance =
            await Attendance.create({

                employee,
                date:new Date(),
                status,
                remarks
            });

        res.status(201).json({
            success:true,
            attendance
        });

    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};

/*
================================
GET ATTENDANCE
================================
*/
export const getAttendance =
async(req,res)=>{

    try{

        const attendance =
            await Attendance.find()
            .populate("employee")
            .sort({
                createdAt:-1
            });

        res.json({
            success:true,
            attendance
        });

    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};

/*
================================
UPDATE
================================
*/
export const updateAttendance =
async(req,res)=>{

    try{

        const attendance =
            await Attendance.findByIdAndUpdate(
                req.params.id,
                req.body,
                {new:true}
            );

        res.json({
            success:true,
            attendance
        });

    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};

/*
================================
DELETE
================================
*/
export const deleteAttendance =
async(req,res)=>{

    try{

        await Attendance.findByIdAndDelete(
            req.params.id
        );

        res.json({
            success:true,
            message:"Attendance deleted"
        });

    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};