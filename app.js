const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/ums');


const express = require('express');
const app = express();

require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false}))


const path = require('path')
app.use(express.static(path.join(__dirname, 'public')));

const userRoute = require('./routes/userRoute')
app.use('/',userRoute);

const adminRoute = require('./routes/adminRoute')
app.use('/admin',adminRoute);



const port = process.env.PORT
const jsonParser = bodyParser.json();
app.use(jsonParser);

app.listen(port,()=>{
    console.log(`server started listen to the port ${port}`);


})