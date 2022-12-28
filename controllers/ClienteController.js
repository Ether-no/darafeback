'use strict'

const bcrypt = require('bcrypt-nodejs');
const cliente = require('../models/cliente');
const jwt = require('../helpers/jwt');
const registro_cliente = async function (req,res) {
    //
    var data = req.body;
    var clientes_arr = await cliente.find({email:data.email});
    if (clientes_arr.length == 0) {
        if (data.password) {
            bcrypt.hash(data.password,null,null, async function(err,hash) {
                if (hash) {
                    data.password = hash;   
                     //registro del cliente            
                    var registro = await cliente.create(data);
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
const login_cliente = async function(req,res){
    var data = req.body;
    var clientes_arr = [];

    clientes_arr = await cliente.find({email:data.email})
    if(clientes_arr.length == 0){
        res.status(400).send({message:"Credenciales invalidad",data:undefined});
    }else{
        //login
        let user = clientes_arr[0];
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
const listar_clientes_filtro_admin = async function(req,res) {
    let reg = await cliente.find();
    res.status(200).send({data:reg});
}
module.exports ={
    registro_cliente,
    login_cliente,
    listar_clientes_filtro_admin
}