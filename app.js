const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');

//Middlewares
app.use(cors());
app.use(bodyParser.json());

//Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');



app.use('/api/posts', postRoute);
app.use('/api/user',authRoute);

app.get('/', (req,res)=>{
    res.send('Welcom To My AMH Project.')
})
 mongoose.connect(process.env.DB_CONNECTION,{useNewUrlParser:true},()=>{
    console.log('Connected To Database')
})

app.listen(process.env.PORT ||3000, ()=> console.log('Server is running '));
