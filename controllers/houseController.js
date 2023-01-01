const House = require('../models/houseModel'); 

//getting all new houses in the database
exports.getAllHouses = async (req, res) =>{
    try {
        const houses = await House.find();
        res.status(200).json({
            status : "success",
            results : houses.length,
            data : {
                 houses
            }
            
        });
    } catch (error) {
        res.status(404).json({
            status : "fail",
            message : error
        });
        
    }
   
}

// getting a house with ID
exports.getHouse = async (req, res) =>{
   try {
       const house = await House.findById(req.params.id);
       res.status(200).json({
        status: "success",
        data:{
            house
        }
       });
   }
    catch (error) {
    res.status(404).json({
        status : "fail",
        message : error
    });
   }
}

// adding a new house to the database
exports.createHouse = async(req, res) =>{
    try{
    
        const newHouse = await House.create(req.body);
     
         res.status(201).json({
             status : "success",
             data :{
                 house : newHouse
             }
         });
     }
     catch (err)  {
         res.status(400).json({
             error : "fail",
             message: "invalid data!!! "
         });
     }
}

exports.updateHouse = async(req, res) =>{
   try {
    const house = await House.findByIdAndUpdate(req.params.id, req.body,{
        new : true,
        runValidators : true
    });

    res.status(200).json({
        status : 'success',
        data :{
            house
        }
    })
    } 
   catch (error) {
    res.status(400).json({
        error : "fail",
        message: error
    });
   }

   
}

exports.deleteHouse  = async (req, res) =>{
    try{
     await House.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status :"success",
        message :"document successfully deleted"
    });

    }
    catch (error){
        res.status(400).json({
            status : "fail",
            error : error
        });
    }
}