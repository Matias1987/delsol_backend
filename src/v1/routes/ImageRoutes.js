const express = require("express");
const router = express.Router();
const imgController = require("../../controllers/ImageController")

const multer = require("multer")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname)
    }
  })

const upload = multer({ storage: storage })

//const upload = multer({dest:"uploads/"})

router.post("/upload/", upload.single("file") ,(req,res)=>{
    return res.json(req.file);
    //console.log(JSON.stringify(req.body));
   // imgController.register_image(req, res)
})

router.post("/register/",(req,res)=>{
    imgController.register_image(req,res)
})

router.post("/",(req,res)=>{
    imgController.get_images_ref(req, res)
})

router.get("/def/:idproducto",(req,res)=>{
    imgController.get_default_image(req, res)

})
module.exports = router