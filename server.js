const express = require('express');
const path = require('path');
//const formidable = require('formidable');
const fs = require('fs');
const { exec } = require('child_process');
//const xmlparser = require('express-xml-bodyparser');
const cors = require('cors');
//const busboy = require('connect-busboy');
var fileupload = require("express-fileupload");
const PORT = 3000;
const app = express();

//app.use(xmlparser());
app.use(cors());
//app.use(busboy());
app.use(fileupload());
app.set('view engine', 'ejs');

app.get('/', open_index_page);
function open_index_page(req,res,next){
    if(req.method == "GET"){
        res.render('index.ejs');
    }
}

app.post('/fileupload', async (req, res) => {
  try {
    //const body = req.rawBody;
    //await fs.writeFile('diagram2.bpmn', body, 'utf8');

    if(!req.files)
    {
        res.send("File was not found");
        return;
    }
    let file = req.files.filefield;
    file.mv('./uploads/' + file.name);


    exec('bpmnlint uploads/'+file.name, (err, stdout, stderr) => {
        console.log(stdout);
        res.send(JSON.stringify(stdout));
      });
  } catch (error) {
    console.error(error);
    res.status(500).send(JSON.stringify(error));
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});