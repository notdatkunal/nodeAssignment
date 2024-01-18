var productModel = require('../models/product.js');
var multer = require('multer');
const path = require("path");
var userModel = require('../models/user.js');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, "uploads")
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+"-"+file.originalname)
    }
  })
       

const maxSize = 1 * 1000 * 1000;
    
var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb){
        var filetypes = /jpeg|jpg|png|pdf/;
        var mimetype = filetypes.test(file.mimetype);
  
        var extname = filetypes.test(path.extname(
                    file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
      
        cb("Error: File upload only supports the "
                + "following filetypes - " + filetypes);
      } 
  
}).single("image");   

exports.createproduct = async function(req, res,next){
   var user_id ;
    try {
        upload(req,res,function(err) {
  
            if(err) {
                 res.send(err)
            }else {
                if (!(req.body.title && req.body.body )) {
                    return res.status(400).send("All input is required");
                }

                user_id = req.user.user_id
                var createproduct = new productModel({
                    title: req.body.title,
                    body: req.body.body,
                    image: req.file.filename,
                   userId : user_id
                })

                createproduct.save().then((product)=>{
                    console.log("new product created===>"+product);
                    res.status(200).json({
                        message:"Success, product created!"
                    })
                })

               
            }
        })
      } catch (error) {
        res.json({
          error,
        });
      }
}

exports.deleteproduct = async function(req, res,next){
    productModel.findByIdAndRemove({_id : req.body.productId}).exec().then((result)=>{
        if(result){
            res.json({
                result:"ok",
                message:"deleted"
            })
        }
    })
}

exports.updateproduct = async function(req, res,next){
    const filter = { _id: req.body.productId };
    const update = { title: req.body.title,
    body : req.body.body };

    let doc = await productModel.findOneAndUpdate(filter, update, {
    new: true
    });
    console.log(doc);
    res.status(200).json(doc);
}

exports.getAllproducts = async function(req, res,next){
    var allproducts = productModel.find().exec().then((products)=>{
        res.json(products);
    })
}

exports.getproduct = async function(req, res,next){
    var products = productModel.find({
        userId : req.user.user_id
    }).exec().then((product)=>{
        res.status(200).json(product);
    })   
}
