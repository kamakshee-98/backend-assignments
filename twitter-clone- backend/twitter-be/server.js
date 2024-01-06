/* import express */
const express = require('express');
const app = express();

/* to run the server */
const PORT = 4000;

/* link between frontend and backend */
const cors = require('cors');

/* import mongoose */
const mongoose = require('mongoose');
const {MONGODB_URL} = require('./config');

global.__basedir = __dirname;

/* Connect the database */
mongoose.connect(MONGODB_URL);
mongoose.connection.on('connected', ()=>{
    console.log("DB is connected");
})

mongoose.connection.on('error', (error)=>{
    console.log("Some error occured");
})

app.use(cors());
app.use(express.json());

require('./models/user_models');
require('./models/post_models');

app.use(require('./routes/user_routes'));
app.use(require('./routes/post_routes'));
app.use(require('./routes/file_route'));


app.listen(PORT, ()=>{
    console.log("server started");
});