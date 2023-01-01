const Apartment = require('./../models/apartmentsModel');

exports.getAllApartments = async (req, res) =>{
    try {
        const apartments = await Apartment.find();
         res.status(200).json({
            status: 'success',
            data:{
                apartments
            }
         });
    } catch (error) {
        res.status(400).json({
            status : "error",
            message: error
        });
    }  
}

exports.getApartment = async (req, res) =>{
    try{
   const apartments=  await Apartment.findById(req.params.id);
    res.status(200).json({
        status : "success",
         data : {
            apartments
         }
    });
  }  catch (error){
    res.status(404).json({
      status : 'fail',
      message : error
    })
  }
}

exports.createApartment = async (req, res) =>{
   try {
    const apartment =  await  Apartment.create(req.body);
    res.status(200).json({
        status: 'success',
        data :{
            apartment
        }
    });
   } catch (error) {
    res.status(404).json({
        status : 'fail',
        message : error
    })
   }
}

exports.updateApartment = async (req, res) =>{
try {
  const apartments =  await Apartment.findByIdAndUpdate(req.params.id,req.body,{
    new :true,
    runValidators
   });
   res.status(200).json({
    status: 'success',
     data : {
        apartments
     }
   });
} 
catch (error) {
    res.status(404).json({
    error
    });
}
}

exports.deleteApartment  = async(req, res) =>{
    try {
        await Apartment.findByIdAndDelete(req.params.id);
        res.status(200).json({
           status : 'success',
           message: 'apartment successfully deleted' 
        });
    } catch (error) {
        res.status(404).json({
            status : 'fail',
            message: 'invalid Id!!!'
        })
    }
}