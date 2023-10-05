const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const cors = require("cors");

app.use(bodyParser.json())
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

require("dotenv").config();

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendMail = async (msg) =>{
    try {
        await sgMail.send(msg);
        console.log("Message sent successfully!");
        
    } catch (error) {
        console.error(error);

        if(error.response){
            console.error(error.response.body);
        }
    }
};


app.get('/', (req,res)=> {
    res.sendFile(__dirname + "/index.html")
})

app.post('/Newsletter', (req,res)=>{
    const Email = req.body.email
    sendMail({
        to: Email,
        from: "ohazam79@gmail.com",
        subject: "Welcome Email",
        text: "Its great having you here",
    });

    res.send("Email Sent");
})


app.listen(4000, (req,res)=>{
    console.log("Server is running on port 4000")
})