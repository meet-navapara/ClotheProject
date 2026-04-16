module.exports = (err,req,res,next) =>{
    console.log("error",err);

    const statusCode  = err.statusCode || 500;
    const message = err.message || "Internal server error";

    res.status(statusCode).json({
        success :false,
        message
    });   
}