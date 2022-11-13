const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const cors = require('cors');
var fileupload = require("express-fileupload");
const PORT = 3000;
const app = express();

app.use(cors());
app.use(fileupload());
app.set('view engine', 'ejs');

app.get('/', open_index_page);
function open_index_page(req,res,next){
    if(req.method == "GET"){
        res.render('index.ejs');
    }
}

app.post('/fileupload', async (req, res) => {

  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  let file = req.files.file;

  file.mv('uploads/' + file.name, function(err) {
    if (err) {
      return res.status(500).send(err);
    }
    // res.send('File uploaded!');
  }
  );
  
  exec("bpmnlint uploads/" + file.name, (stderr, stdout) => {
  // if (!err) {
  //   // node couldn't execute the command
  //   console.log(stdout);
  //   return;
  // }

  // the *entire* stdout and stderr (buffered)
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);

  // Send the output to the browser
  res.send(stdout);
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});