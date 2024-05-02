const express = require('express')
const mysql = require('mysql')
const jwt = require('jsonwebtoken')
const path = require('path')
const rateLimit = require('express-rate-limit')
const axios = require('axios')

const app = express();
const port = 3000;
const secretkey = "MYSQLWEBAPI_3000!";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // máximo de 100 solicitudes por IP
});

app.use(limiter);

//PARAMETROS DE CONEXION MYSQL
const connection = mysql.createConnection({
    "host" : "localhost",
    "user" : "root",
    "password" : "root",
    "database" : "testwork"
});


//CONEXION MYSQL
connection.connect((error)=>{
    if(error) {
        console.log("Error al conectar con la base de datos: ", error);
        return;
    }
    console.log("Conexion exitosa a la base de datos MySQL");
});


//FUNCION PARA VALIDAR EL JSON WEB TOKEN
function validarToken(req, res, next){
    const token = req.headers["authorization"];

    if(!token){
        return res.status(403).json({error: "Token de authenticacion no proporcionado"});
    }

    jwt.verify(token, secretkey, (error,decode) => {
        if(error){
            return res.status(401).json({error: "Token de authenticacion invalido"});
        }
        req.usuario = decode;
        next();
    })
}




//RUTA HOME
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
});


//OBTENER LISTA DE USUARIOS
app.post('/users', validarToken , (req,res)=>{

    connection.query("SELECT * FROM USERS",(error,results,fields)=>{
        if(error){
            console.log("Error al realizar la consulta: ",error);
            res.status(500).json({error: "Error al obtener registros de la tabla users de la base de datos"});
            return;
        }

        res.json(results);
        
    });

});

app.post('/user', validarToken , (req,res)=>{

    const {id} = req.query;
    const query = "SELECT * FROM USERS WHERE ID = ?";

    connection.query(query, [parseInt(id)], (error, results, fields)=>{
        if(error){
            console.log("Error al realizar la consulta: ",error);
            res.status(500).json({error: "Error al obtener registros de la tabla usuarios de la base de datos"});
            return;
        }

        res.json(results);
        
    });

});


app.post("/countries", validarToken, (req,res)=>{

    console.log(req.query);
    const {page = 1, pageSize = 5} = req.query;
    const offset = (page - 1) * pageSize;

    const query = "SELECT * FROM COUNTRIES LIMIT ? OFFSET ?";
    connection.query(query, [parseInt(pageSize), parseInt(offset)], (error, results, fields)=>{
        if(error){
            console.log("Error al realizar la consulta: ",error);
            res.status(500).json({error: "Error al obtener registros de la tabla countries de la base de datos"});
            return;
        }

        res.json(results);
    });

});


// AXIOS EXAMPLE
axios.post('http://localhost:3000/countries',{},{
    headers: {
        'Content-Type': 'application/json',
        "Authorization" : ` eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTYyMzkwMjJ9.FfXezAKOt1KBOPzoyuh48CP5w9J1_7sxVEgblxRnO44`
    },
    params: {
        page: 3,
    }
}).then(response => {
    console.log(response.data);
})



app.listen(port,()=>{
    console.log("Servidor en linea!")
})
