const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require('cors');
const { response } = require("express");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
var i =0;
app.post("/api/form/", (req,res)=>{
    nodemailer.createTestAccount((err,account)=>{
        const htmlEmail = `
        <h3> E-VOTING </h3>
        <h3>Estimado estudiante utilize el siguiente enlace generado para poder acceder a la plataforma</h3>
        <h3>y realizar su voto por el candidato de su preferencia</h3>
        <h3>=======================</h3>
        <a href='${req.body.direccion}'> Click here </a>
        <h3>Si no puede seleccionar el enlace porfavor copiar y pegar en la barra de direcciones de tu navegador</h3>
        `;
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
              user: "wilsonxXxrodri@gmail.com", //El email del servicio SMTP que va a utilizar (en este caso Gmail)
              pass: "theoffspring95" // La contraseña de dicho SMTP
            }
          });
        let mailOptions = {
            from: "wilsonxXxrodri@gmail.com",
            to: req.body.correo.correo,
            replyTo: "wilsonxXxrodri@gmail.com",
            subject: "Sistema de votacion Blockchain",
            html: htmlEmail
        };
        transporter.sendMail(mailOptions,(err,info)=>{
            if(err){
                return res.end(err);
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