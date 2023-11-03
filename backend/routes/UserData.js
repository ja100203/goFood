const express = require('express');
const router = express.Router();
const user = require('../models/Users');
const { body, validationResult } = require('express-validator');
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const order = require('../models/Orders');
const jwtSecret="HelloIamlearningbackendtryingtodoprojectsinitsprectrumprojectlastdatesubmissionis3"

router.post("/createuser",[
body('email','incorrect email').isEmail(),
body('name').isLength({min:5}),
body('password','incorrect password').isLength({min:5})],

async (req, res) => {
const errors=validationResult(req);
if(!errors.isEmpty()){
    return res.status(400).send({errors:errors.array()})
}

const salt=await bcrypt.genSalt(10);
let secPassword=await bcrypt.hash(req.body.password,salt)

    try{
    await user.create({
        name: req.body.name,
        password: secPassword,
        email: req.body.email,
        location: req.body.location
    }).then(res.send({success:true}));
}catch(err){
    console.log(err);
    res.send({success:false});
}
})


router.post("/loginuser",
    async (req, res) => {
        
let email=req.body.email;
        try{
      let userData=  await user.findOne({email});
      if(!userData){
        return res.status(400).send({errors:"Invalid login credentials"});
      }
      const pwdCompare=await bcrypt.compare(req.body.password,userData.password)
      if(!pwdCompare){
        return res.status(400).send({errors:"Invalid login credentials"});
      }

const data={
    user:{
        id:userData.id
    }
}
const authToken=jwt.sign(data,jwtSecret)

       return res.send({success:true,authToken:authToken});
    }catch(err){
        console.log(err);
        res.send({success:false});
    }
    })

    router.post('/getuser', fetch, async (req, res) => {
        try {
            const userId = req.user.id;
            const users = await user.findById(userId).select("-password") // -password will not pick password from db.
            res.send(users)
        } catch (error) {
            console.error(error.message)
            res.send("Server Error")
    
        }
    })
    
    router.post("/foodData", (req, res) => {
        try {
            res.send([global.food_items,global.foodCategory]);
        } catch (error) {
            console.log(error);
            res.send("server error");
        }
    })
    
    router.post('/orderData', async (req, res) => {
        let data = req.body.order_data;
        
        if (!Array.isArray(data)) {
            data = [data]; // Convert to an array if it's not already
        }
    
        data.unshift({ Order_date: req.body.order_date });
    
        console.log("Email:", req.body.email);
    
        try {
            let eId = await order.findOne({ 'email': req.body.email });
            console.log(eId);
    
            if (eId === null) {
                await order.create({
                    email: req.body.email,
                    order_data: data
                }).then(() => {
                    res.json({ success: true });
                });
            } else {
                await order.findOneAndUpdate({ email: req.body.email }, { $push: { order_data: data } }).then(() => {
                    res.json({ success: true });
                });
            }
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Server Error: " + error.message);
        }
    });
    
    
    router.post('/myorder', async (req, res) => {
        try {
            console.log(req.body.email)
            let eId = await order.findOne({ 'email': req.body.email })
            //console.log(eId)
            res.json({orderData:eId})
        } catch (error) {
            res.send("Error",error.message)
        }
        
    
    });

module.exports=router;