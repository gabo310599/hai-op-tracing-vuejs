<script>

import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';

let serial = "";
let description = "";
let character = "";
let code = "";

export default{
    data(){
        return{
            serial,
            description,
            character,
            code
        }
    },
    methods:{

        //Metodo de refresh token
        async refresToken(){
            await axios
                .get("http://localhost:3000/auth/refresh",
                    {
                        headers: {
                            Authorization: `Bearer ${this.getUserFromCookies()}`
                        }
                    })
                .then((res) => {
                    this.token = res.data.data.accessToken;
                    Cookies.set("userLogged", this.token);
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
            .post("http://localhost:3000/log",
                { user_id: this.user.id, log: msg },
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
            return Cookies.get("userLogged");
        },

        //Metodo que registra el predido en la BD
        saveRequest(){
            
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

            //FALTA EL PEDIDO AL ENDPOINT
        }


    }
}

</script>

<template>
    <div class="register-request-container">
        <h3 class="font-weight-bold title-style">Registrar Pedido</h3>
        <form>
            <div class="form-group">
                <label for="register_request/serial_input">Serial:</label>
                <input class="form-control" id="register_request/serial_input" v-model="serial">
            </div>
            <div class="form-group">
                <label for="register_request/description_input">Descripción:</label>
                <input class="form-control" id="register_request/description_input" v-model="description">
            </div>
            <div class="form-group">
                <label for="register_request/code_input">Código:</label>
                <input class="form-control" id="register_request/code_input" v-model="code">
            </div>
            <div class="form-group">
                <label for="register_request/character_input">Secuencia:</label>
                <input class="form-control" id="register_request/character_input" v-model="character">
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
    border-width: 5px;
    border-style: solid;
    padding-right: 20px;
    padding-bottom: 20px;
    padding-left: 20px;
    background-color: #eef2f3;
    margin-left: 1%;
}

</style>