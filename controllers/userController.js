 const User = require('./../models/userModel');
 const catchAsync = require('./../utils/catchAsync');
 const AppError = require('./../utils/AppError');
 
const filteredObj = (obj, ...allowedFileds) => {
    const newObj = {};
    Object.keys(obj).forEach( el => {
        if(allowedFileds.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

 exports.getAllUsers = (req, res) =>{
    res.status(500).json({
        error : "error",
        message: "route not yet defined "
    });
}

exports.updateMe = catchAsync( async (req,res , next) =>{
    //check and produce error if user tries to update password in thise route
    if(req.body.password || req.body.confirmPassword){
        return next (new AppError('this route is not for updating password please use updat password'));
    }

    //update the document
 const filteredBody =  filteredObj(req.body, 'name','email');
 const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody,{
    new : true,
    runValidators :true
 });

    res.status(200).json({
        status :"success",
        data : {
            user : updateUser
        }
    })

});

exports.deleteMe =  async (req,res,next) => {
    await User.findByIdAndUpdate(req.user.id, {active : false});

    res.status(204).json({
        status : "success",
        data : null
    });
}

exports.getUser = (req, res) =>{
    res.status(500).json({
        error : "error",
        message: "route not yet defined "
    });
}

exports.createNewUser = (req, res) =>{
    res.status(500).json({
        error : "error",
        message: "route not yet defined "
    });
}

exports.updateUser = (req, res) =>{
    res.status(500).json({
        error : "error",
        message: "route not yet defined "
    });
}

exports.deleteUser  = (req, res) =>{
    res.status(500).json({
        error : "error",
        message: "route not yet defined "
    });
}
