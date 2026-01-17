

const error =  (err, req, res, next) => {
    
    if(err.name === "ValidationError"){
        err.statusCode =400,
        err.message = Object.values(err.errors).map((ele) => ele.message)
         
    }

   
if (err.name === "JsonWebTokenError") {
    err.statusCode = 401;
    err.message = "Please login again!";
}

if(err.name === "MulterError"){
    err.statusCode = 500
    err.message = 'A Multer error occurred when uploading.'
}



    err.message = err.message,
    err.statusCode = err.statusCode || 500

    res.status(err.statusCode).json({
        success: false,
        message: err.message,

    })
}



export default error


