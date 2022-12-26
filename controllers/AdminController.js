'use strict'

const admin = require('../models/admin');
const bcrypt = require('bcrypt-nodejs')
const jwt = require('../helpers/jwt');
const registro_admin = async function (req,res) {
    //
    var data = req.body;
    var admin_arr = [];
    var admin_arr = await admin.find({email:data.email});
    if (admin_arr.length == 0) {
        if (data.password) {
            bcrypt.hash(data.password,null,null, async function(err,hash) {
                if (hash) {
                    data.password = hash;   
                     //registro del admin            
                    var registro = await admin.create(data);
                    res.status(200).send({data:registro});
                }else{
                    res.status(400).send({message:"Error server",data:undefined});
                }
            });
        }else{
            res.status(400).send({message:"No hay una contraseña",data:undefined});
        }
    } else {
        res.status(400).send({message:"El correo ya existe",data:undefined});
    }
}
const login_admin = async function(req,res){
    var data = req.body;
    var admin_arr = [];

    admin_arr = await admin.find({email:data.email})
    if(admin_arr.length == 0){
        res.status(400).send({message:"Credenciales invalidad",data:undefined});
    }else{
        //login
        let user = admin_arr[0];
        bcrypt.compare(data.password,user.password, async function(err,check){
            if (check) {
                res.status(200).send({
                    data:user,
                    token:jwt.createToken(user)
                });
            } else {
                res.status(400).send({message:"Credenciales invalidad",data:undefined});
            }
        });
        // res.status(200).send({data:user});
    }
}
module.exports ={
    registro_admin,
    login_admin
}