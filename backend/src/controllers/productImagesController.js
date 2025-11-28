const pool = require('../db/pool');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req,file,cb){ cb(null,'backend/src/uploads'); },
  filename: function(req,file,cb){ cb(null, Date.now() + path.extname(file.originalname)); }
});

const upload = multer({storage});

async function uploadImages(req,res){
  const files = req.files;
  if(!files || files.length===0) return res.status(400).json({message:'No files uploaded'});
  for(const file of files){
    await pool.query('INSERT INTO product_images (product_id,file_name) VALUES ($1,$2)',[req.params.id,file.filename]);
  }
  res.json({message:'Images uploaded'});
}

module.exports = { uploadImages, upload };
