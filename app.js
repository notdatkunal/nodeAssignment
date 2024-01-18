require('dotenv').config();
const { API_PORT } = process.env;
const port = 8080;
var express = require('express');
var app = express();
var multer = require('multer');
var upload = multer()
;
const bodyParser = require('body-parser');



const path = require("path");
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/assignmentdb');
const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection  errror :"));
db.once('connection', (stream) => {
    console.log('Ah, we have our first user!');
  });




  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended : true}));
var userController = require('./controllers/userController.js');
var productController = require('./controllers/productController');
const auth = require("./middleware/auth");



app.get('/',function(req,res){
    res.status(200).json({
        message: 'welcome to project'
    })
})

app.post('/createUser',userController.createUser);
app.get('/activateUser/:email',userController.activateUser);
app.post('/login',userController.login);
app.post('/createproduct',auth, productController.createproduct);
app.get('/getAllproducts',productController.getAllproducts);
app.get('/getproduct',auth,productController.getproduct);
app.put('/updateproduct',auth,productController.updateproduct);
app.delete('/deleteproduct',auth,productController.deleteproduct);
    

  
app.listen(port,function(){
    console.log('listening on port '+port);
})