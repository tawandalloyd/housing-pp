const crypto = require('crypto');
const {promisify} = require('util');
const Users = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
const sendEmail = require('./../utils/email');


//creating a jwt token
const signToken = id => {
    return jwt.sign({id }, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES_IN
    })
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };
    //if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  
    res.cookie('jwt', token, cookieOptions);
  
    // Remove password from output
    user.password = undefined;
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  };

//signing users into our app
exports.signup = catchAsync( async(req,res)=>{
    const user = await Users.create({
        name: req.body.name,
        email : req.body.email,
        password : req.body.password,
        confirmPassword : req.body.confirmPassword
    });

   createSendToken(user,201,res);
});

//login users to the app
exports.login = catchAsync(async(req,res,next) =>{

     const {email, password} =  req.body;
    //check if email and password exist
    if(!email || !password){
       return next(new AppError('please provide email or password', 400))
    }

    //check if user exist and password is correct
   const user = await Users.findOne({email}).select('+password');
   
   if(!user || !(await user.correctPassword(password,user.password))){
    return next(new AppError('invalid email or password', 401));
   }
createSendToken(user,201,res);
});

//protectingour routes from unauthenticated users
exports.protect = catchAsync( async (req, res, next) =>{
// check if token exists 
let token;
if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
{
   token = req.headers.authorization.split(' ')[1];
}
if(!token){
    return next (new AppError('please login to get access', 401));
}
// verfying the token 
const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);

//check if user still exists
const freshUser = await Users.findById(decoded.id);
if(!freshUser){
    return next(new AppError('this user no longer exists', 401)
    )
}

//check if user changed password
if(freshUser.changedPasswordAfter(decoded.iat)){
    return next (new AppError ('user recently changed password. Please login again', 401));
}

req.user = freshUser;
 next();
} );

//restricting users
exports.restrictTo =  (...roles) => {
    return (req, res,next) =>{
        if(!roles.includes(req.user.role)){
            return next(new AppError('user does not have the rights',403));
        };
      next();
    }
};

//forgot password 
exports.forgotPassword = catchAsync( async(req,res,next) => {
    // getting the user based on email address
    const user = await Users.findOne({email : req.body.email});

    if (!user){
        return next(new AppError('invalid email',404));
    }

    //generate the reset token
    const setToken = user.createToken();
    await user.save({validateBeforeSave : false});

      // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${setToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL} .\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }

});


exports.resetPassword = catchAsync( async(req,res,next) =>{
    // get user based on token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await Users.findOne({
        passwordResetToken :hashedToken,
        passwordResetExpires : { $gt: Date.now()} 
    
    });

    if(!user){
        return next(new AppError('the token has expired or it is invalid',404))
    }
    //updating the new password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // generating the token and login the user
    createSendToken(user,200,res);
});

//updating user password
exports.updatePassword = catchAsync( async(req, res, next) => {
    //get user from collection
    const user = await Users.findById(req.user.id).select('+password');
    
    //check if posted current password is correct
    

    if (!(await user.correctPassword(req.body.currentPassword,user.password))){
        return next(new AppError('your current password is wrong password is invalid ',401));
    }
    //updating the password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    //generating token and user signup
    createSendToken(user,200,res);
});