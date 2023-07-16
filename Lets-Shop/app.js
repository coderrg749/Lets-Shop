 'use strict';
const bodyParser = require('body-parser');
const Express = require('express');
require('dotenv').config();
const userRouter = require('./routes/user')
const productRouter = require('./routes/product')
const blogRouter = require('./routes/blog')
const blogcategoryRouter = require('./routes/blogCategory')
const couponRouter = require('./routes/coupon')
const brandRouter = require('./routes/brand')
const dbConnect = require('./startup/dbConnect');
const morgan = require('morgan')
const { errorHandler ,notFound} = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser')

let url = process.env.MONGODB;
let port =process.env.PORT||6000
const app = Express();
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/api/v1/user',userRouter)
app.use('/api/v1/product',productRouter)
app.use('/api/v1/blog',blogRouter)
app.use('/api/v1/blogcategory',blogcategoryRouter)
app.use('/api/v1/brand',brandRouter)
app.use('/api/v1/coupon',couponRouter)

app.use(notFound);
app.use(errorHandler);

dbConnect();

//SERVER LISTENING 
app.listen(port,()=>{
    console.log(`server is up and running at http://127.0.0.1:${port}`);
})
