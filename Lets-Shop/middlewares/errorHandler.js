const notFound =(req,res,next)=>{
    // const error = new Error(`Not Found:${req.originalUrl}`);
    // res.status(404)
    // next(error);
    const error = new Error(`Not Found: ${req.originalUrl}`);
    res.status(404);
  
    console.error(error);
  
    next(error);
}
//error Handler

const errorHandler = (err,req,res,next)=>{
  
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Check if it's a "Not Found" error
    if (statusCode === 404) {
      res.status(statusCode).json({
        message: "Route not found",
        error: err?.message,
      });
    } else {
      res.status(statusCode).json({
        message: err?.message,
        stack: err?.stack,
      });
    }
};



module.exports={errorHandler,notFound};