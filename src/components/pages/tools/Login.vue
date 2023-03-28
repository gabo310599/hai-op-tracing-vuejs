<script>

import axios from "axios";

let input = document.getElementById("myInput");
let user_name = "";
let password = "";
let data = [];


export default{
    data(){
        return{
            data,
            user_name,
            password 
        }       
    },
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
            .post("http://localhost:3000/auth/login",{
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

}

</script>

<template>

    <div class="login-container">
        <h1 class="center-text font-weight-bold form-padding">Login</h1>
        <form>
            <div class="form-group form-padding">
                <label for="process/op_number_input">Usuario</label>
                <input class="form-control" id="user_name_input" v-model="user_name">
            </div>
            <div class="form-group form-padding" >
                <label for="process/op_number_input">Contraseña</label>
                <input type="password" class="form-control" id="password_input" v-model="password">
            </div>
            <button type="button" class="btn btn-primary" style="margin: 5px" v-on:click="login()">Ingresar</button>
            <button type="button" class="btn btn-success" style="margin: 5px">Crear usuario</button>
            <button type="button" class="btn btn-danger" style="margin: 5px" v-on:click="exit()">Salir</button>
        </form>
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
    text-align: center;
    border-radius: 10px;
    padding-top: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
  }

  .form-padding{
    padding-bottom: 10px;
  }
</style>