<script>

import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';
import { mainRoute } from "../../../../main";

let serial = "";
let description = "";
let character = "";
let code = "";
let department_id = "";
let token = "";

export default{
    data(){
        return{
            serial,
            description,
            character,
            code,
            department_id,
            token
        }
    },
    methods:{

        //Metodo de refresh token
        async refresToken(){
            await axios
                .get(mainRoute + "auth/refresh",
                    {
                        headers: {
                            Authorization: `Bearer ${this.getUserFromCookies()}`
                        }
                    })
                .then((res) => {
                    this.token = res.data.data.accessToken;
                    Cookies.set("userLoggedOperator", this.token);
                })
                .catch((error) => {
                    console.log(error.message);
                });
        },

        //Metodo que decodifica el token
        getDecodedAccessToken() {
        try {
            return jwt_decode(this.getUserFromCookies());
        } catch (Error) {
            return null;
        }
        },

        //Metodo que administra el log
        async createLog(msg) {

            await axios
            .post(mainRoute + "log",
                { user_id: this.getDecodedAccessToken().sub, log: msg },
                { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
            )
            .then((res) => {

            })
            .catch((error) => {
                console.log(error.message);
                alert("Error: " + error.response.data.message);
            });

        },

        //Metodo que obtiene de cookies el usuario que inicio sesion
        getUserFromCookies() {
            return Cookies.get("userLoggedOperator");
        },

        //Metodo que registra el predido en la BD
        async saveRequest(){
            
            this.refresToken();

            if(this.serial.length == 0){
                alert("Por favor ingresar el serial del pedido.");
                return;
            }

            if(this.description.length == 0){
                alert("Por favor ingresar la descripción del pedido.");
                return;
            }

            if(this.code.length == 0){
                alert("Por favor ingresar el código del pedido.");
                return;
            }

            if(this.character.length == 0 ){
                alert("Por favor ingresar la secuencia del pedido.");
                return;
            }

            //Guardamos en la base de datos
            let request_id = "";
            await axios
                .post(mainRoute + "request-note",
                    {
                    serial: this.serial.toUpperCase(),
                    description: this.description.toUpperCase(),
                    code: this.code.toUpperCase(),
                    characters: this.character.toUpperCase()
                    },
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    alert("Pedido registrado con exito.");
                    request_id = res.data.data.id;
                    //this.createLog("Se ha creado el pedido " + this.serial.toUpperCase() + this.character.toUpperCase() + "." )

                    this.serial = "";
                    this.description = "";
                    this.code = "";
                    this.character = "";
                    if(res.data.msg == "Error."){
                        alert(res.data.type)
                        return
                    }
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: "+error.response.data.message);
                });

            //Creamos un proceso en la base de datos
            await axios
                .post(mainRoute + "process",
                    {
                        request_id: request_id,
                        department_id: this.department_id,
                    },
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {

                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: "+error.response.data.message);
                });

                    
            }


    },
    async created(){

        //Obtengo el id del primer departamento en la cadena de procesos
        await axios
            .post(mainRoute + "department/get/by-name/",
                { name: "Diseño Gráfico" },
                { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
            )
            .then((res) => {
                this.department_id = res.data.data.id;
            })
            .catch((error) => {
                console.log(error.message);
                alert("Error: " + error.response.data.message);
            });
    }
}

</script>

<template>
    <div class="register-request-container">
        <h3 class="font-weight-bold title-style">Registrar Pedido</h3>
        <form>
            <div class="form-group">
                <label for="register_request/serial_input">Pedido:</label>
                <input class="form-control" id="register_request/serial_input" v-model="serial">
            </div>
            <div class="form-group">
                <label for="register_request/character_input">Secuencia:</label>
                <input class="form-control" id="register_request/character_input" v-model="character">
            </div>
            <div class="form-group">
                <label for="register_request/code_input">Código del producto:</label>
                <input class="form-control" id="register_request/code_input" v-model="code">
            </div>
            <div class="form-group">
                <label for="register_request/description_input">Descripción:</label>
                <input class="form-control" id="register_request/description_input" v-model="description">
            </div>
            <div class="align-btn">
                <button type="button" class="btn btn-primary" v-on:click="saveRequest()" >Registrar</button>
            </div>
        </form>
    </div>
</template>

<style>

.align-btn{
    text-align: right;
}

.register-request-container{
    position:relative;
    top: 50%;
    left: 50%;
    transform:  translate(-50%, 3%);
    width: 600px;
    border-radius: 35px;
    border-color: black;
    border-style: hidden;
    padding-right: 20px;
    padding-bottom: 20px;
    padding-left: 20px;
    background-color: #eeeeee;
    margin-left: 1%;
}

</style>