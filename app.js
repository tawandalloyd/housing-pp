const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const errorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const rentalRouter = require('./routes/rentalRoutes');
const houseRouter = require('./routes/houseRoutes');
const apartmentsRouter = require('./routes/apartmentsRoutes');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use((req,res,next) =>{
    console.log("hello from middleware");
    next();
})

app.get('/',(req,res)=>{
    res.status(200).json({message:'hello from server side', app : 'housing'})
})



app.use('/api/v1/apartments',apartmentsRouter);
app.use('/api/v1/houses',houseRouter);
app.use('/api/v1/rentals', rentalRouter);
app.use('/api/v1/users', userRouter);

app.all('*',(req, res, next) =>{
    next(new AppError(`can't find this ${req.originalUrl} on this server!`,404));
});

app.use(errorHandler);

module.exports = app;