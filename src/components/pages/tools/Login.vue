<script>

import axios from "axios";
import { RouterLink } from 'vue-router';

let user_name = "";
let password = "";
let token = "";

export default{
    data(){
        return{
            token,
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
                this.token = res.data.data.accessToken;

                this.$router.push({ path: this.path, query: {token: this.token} })
            })
            .catch((error) => {
                console.log(error);
                alert(error.response.data.message);
            });

        }
    },
    props:[
        'path'
    ]
}

</script>

<template>

    
    <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title font-weight-bold" id="loginModalLabel">Login</h2>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
                <div class="form-group">
                    <label for="process/op_number_input">Usuario</label>
                    <input class="form-control" id="user_name_input" v-model="user_name">
                </div>
                <div class="form-group">
                    <label for="process/op_number_input">Contraseña</label>
                    <input type="password" class="form-control" id="password_input" v-model="password">
                </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" v-on:click="login()" data-dismiss="modal">Ingresar</button>
            <button type="button" class="btn btn-success" data-dismiss="modal">Crear usuario</button>
            <button type="button" class="btn btn-danger" data-dismiss="modal">Salir</button>
          </div>
        </div>
      </div>
    
    

</template>

<style>
.center-text {
  text-align: center;
}
</style>