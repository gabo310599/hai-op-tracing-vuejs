<script>

import axios from "axios";
import Sign_Up from "./Sign_Up.vue"
import { mainRoute } from "../../../main";

let input = document.getElementById("myInput");
let user_name = "";
let password = "";
let data = [];

document.addEventListener("keydown", (event) => {

    const keyName = event.key;
    
    try{
        if(keyName === "Enter"){
            document.getElementById("loginBtn").click();
    }
    }catch{}


});


export default{
    data(){
        return{
            data,
            user_name,
            password 
        }       
    },
    emits :[
        "success"
    ],
    methods:{
        async login(){

            if(!this.user_name){
                alert("Por favor ingresa el usuario")
                return
            }

            if(!this.password){
                alert("Por favor ingresa la contraseña")
                return
            }

            await axios
            .post(mainRoute + "auth/login",{
                user_name: this.user_name,
                password: this.password
            })
            .then((res) => {
                this.data = res.data.data;
                this.$emit('success', this.data);
            })
            .catch((error) => {
                console.log(error.message);
                alert(error.response.data.message);
            });

        },
        exit(){
            this.$router.push('/')
        }
    },
    components:{
        Sign_Up
    }

}

</script>

<template>

    <div class="login-container">
        <h1 class="center-text font-weight-bold form-padding" style="color: white;">Login</h1>
        <form>
            <div class="form-group form-padding">
                <label for="process/op_number_input" style="color: white;">Usuario:</label>
                <input class="form-control" id="user_name_input" v-model="user_name">
            </div>
            <div class="form-group form-padding" >
                <label for="process/op_number_input" style="color: white;">Contraseña:</label>
                <input type="password" class="form-control" id="password_input" v-model="password">
            </div>
            <div class="btn-center">
                <button type="button" class="btn btn-primary" style="margin: 5px" v-on:click="login()" id="loginBtn">Ingresar</button>
                <button type="button" class="btn btn-success" style="margin: 5px" data-toggle="modal" data-target="#CreateUserModal">Crear usuario</button>
                <button type="button" class="btn btn-danger" style="margin: 5px" v-on:click="exit()">Salir</button>
            </div>
        </form>
    </div>

    <!--MODAL-->
    <div class="modal fade" id="CreateUserModal" tabindex="-1" role="dialog" aria-labelledby="CreateUserModalLabel" aria-hidden="true">
        <Sign_Up />
    </div>

</template>

<style>
.center-text {
  text-align: center;
}

.login-container{
    position:relative;
    top: 50%;
    left: 50%;
    transform:  translate(-50%, 20%);
    width: 400px;
    border-radius: 30px;
    padding-top: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
    background-color: #343a40;
    margin-left: 1%;
}

  .form-padding{
    padding-bottom: 10px;
  }

  .btn-center{
    margin-left: 14%;
  }

</style>