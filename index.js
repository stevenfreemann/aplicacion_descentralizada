const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require('cors');
const { response } = require("express");
const app = express();
var generator = require('generate-password');
const fs = require('fs');
const path = require("path");
const multer = require("multer");
const router = express.Router();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
const {promisify}=require("util");
const pipeline = promisify(require("stream").pipeline);
const upload = multer();
var util = require('util');
let fechas = require('./dates.json');

app.post('/upload', upload.single("file"), async function(req,res){
    const {file, body:{name}}= req;
    if(file.detectedFileExtension === ".jpg" || file.detectedFileExtension === ".jpeg" || file.detectedFileExtension === ".png"){
        const fileName = Math.floor(Math.random() * 1000)+file.originalName;
        await pipeline(file.stream, fs.createWriteStream(`front/src/images/${fileName}`));
        res.end(fileName);
    }else{
        res.sendStatus(500);
    }

    
})
app.post("/fechas", (req,res)=>{
    console.log(req);
    let ini =''+new Date(req.body.ini);
    let fin= ''+new Date(req.body.fin);
    let fechas={inicio:ini,fin:fin};
    var myJSON = JSON.stringify(fechas);
    console.log(fechas);
    fs.writeFileSync('dates.json', myJSON, function(err){
        if(err){
            return console.log("Json: ", err)
        }
    }) 
    return res.sendStatus(200);
});

app.post("/api/credenciales/", (req,res)=>{
    const user="adminUdec";
    const pass="admin1234.*";
    if(req.body.usuario===user && req.body.password===pass){
        var password = generator.generate({
            length: 20,
            numbers: true
          });
          fs.writeFile('encoding.txt', password, function(err){
              if(err){
                  return console.log("Txt: ", err)
              }
          })
        return res.end(password);
    }else{
        return res.sendStatus(401);
    }
});
app.get("/api/obtFechas",(req,res)=>{
    console.log(fechas);
    return res.send(fechas);
})
app.get("/api/validacion/:pass", (req,res)=>{
    fs.readFile('encoding.txt', 'utf8', function(err, data) {
        if (err) {
            throw err;
        }
        if(data===req.params.pass){
            return res.sendStatus(200);
        }else{
            return res.sendStatus(401);
        }
    });    
   
   /* 
*/
});
app.post("/api/form/", (req,res)=>{
    console.log(req);
    nodemailer.createTestAccount((err,account)=>{
        const htmlEmail = `
        <h3> E-VOTING </h3>
        <h3>Estimado estudiante utilize el siguiente enlace generado para poder acceder a la plataforma</h3>
        <h3>y realizar su voto por el candidato de su preferencia</h3>
        <h3>=======================</h3>
        <a href='${req.body.direccion}'> Click aqui </a>
        <h3>Si no puede seleccionar el enlace porfavor copiar y pegar en la barra de direcciones de tu navegador</h3>
        `;
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
              user: "evoting.blockchain@gmail.com", //El email del servicio SMTP que va a utilizar (en este caso Gmail)
              pass: "admin1234.*" // La contraseña de dicho SMTP
            }
          });
        let mailOptions = {
            from: "evoting.blockchain@gmail.com",
            to: req.body.correo,
            replyTo: "evoting.blockchain@gmail.com",
            subject: "Sistema de votacion Blockchain",
            html: htmlEmail
        };
        transporter.sendMail(mailOptions,(err,info)=>{
            if(err){
                return res.end("error es"+err);
            }else{
                return res.end('It worked!');
            }           
            console.log("Url del msj: $s", nodemailer.getTestMessageUrl(info))
        });
    });
});
const PORT = process.env.PORT || 3001;

app.listen(PORT,()=>{
    console.log(`Servidor de la escucha en el puerto ${PORT}`)
});