const express = require('express')

const fs = require('fs')
const util = require('util')

// fs.link --> removes the file or link from the filesystem 
// util.promisify --> enables the callback function to enable promise() 
const unlinkFile = util.promisify(fs.unlink)

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const { uploadFile, getFileStream } = require('./s3')

const app = express()

app.get('/images/:key', (req, res) => {
  console.log(req.params)
  const key = req.params.key
  const readStream = getFileStream(key)

  // returniing the image 
  readStream.pipe(res)
})

app.post('/images', upload.single('image'), async (req, res) => {
  const file = req.file
  console.log(file)

  // apply filter
  // resize 

  const result = await uploadFile(file)

  // after upload, disconnect the file from filesystem 
  await unlinkFile(file.path)
  console.log(result)
  
  const description = req.body.description
  res.send({imagePath: `/images/${result.Key}`})
})

app.listen(8080, () => console.log("listening on port 8080"))
