const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
dotenv.config({ path: './config.env'});

//  console.log(process.env);

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB,{
    useNewUrlParser : true,
    useCreateIndex : true,
    useFindAndModify : false,
    useUnifiedTopology : true

}).then (() => {
    console.log('DB connection was successfull');
});

const port = 3000;
app.listen(port, ()=> {
    console.log(`app is running on port ${port}`)
})