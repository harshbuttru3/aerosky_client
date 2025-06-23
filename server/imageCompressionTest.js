const sharp = require('sharp');


sharp('input2.jpg')
  .rotate()
  .jpeg({ mozjpeg: true })
  .toBuffer()
  .then( data => { 
    sharp(data)
   .webp({ quality: 20 })
   .toFile("output3.webp",(err,info)=>console.log(err,info));
  })
  .catch( err => { console.log(err) });