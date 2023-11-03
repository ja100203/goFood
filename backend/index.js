const express= require('express');
const app=express();
const port=3400;
const cors=require('cors')
const connectToMongo=require("./conn/db");

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Enable cookies and authentication headers
  })
);
connectToMongo();
app.use(express.json());

app.use('/api',require("./routes/UserData"))

app.listen(port,()=>{
    console.log(`listening to port no ${port}`)
})

