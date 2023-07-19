<script>

import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';
import { mainRoute } from "../../../../main";

let user_name = "";
let current_user_name = "";
let password = "";
let confirm_password = "";

document.addEventListener("keydown", (event) => {

    const keyName = event.key;

    try {
        if (keyName === "Enter") {
            document.getElementById("saveBtn").click();
        }
    } catch { }

});

export default {
    data() {
        return {
            user_name,
            password,
            confirm_password,
            current_user_name
        }
    },
    methods: {

        //Metodo que obtiene de cookies el usuario que inicio sesion
        getUserFromCookies() {
            return Cookies.get("userLogged");
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

        //Metodo que llena la informacion del usuario a editar
        async fillUserInfo() {

            await axios
                .get(mainRoute + "user/" + this.getDecodedAccessToken().sub,
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    this.user_name = res.data.data.user_name;
                    this.current_user_name = this.user_name;
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });

        },

        //Metodo que guarda cambios en el usuario (si existen)
        async saveChanges() {

            let user_flag = false;
            let password_flag = false;

            //Validamos si existen cambios validos en el nombre de usuario
            if (this.current_user_name != this.user_name && this.user_name.length > 0) {
                user_flag = true;
            };

            //Validamos si existen cambios validos en la password
            if (this.password.length >= 5) {
                password_flag = true;
            } else {
                if (this.password.length > 0) {
                    alert("La contraseña tiene que ser de al menos 5 caracteres.")
                    return
                }
            }

            //Validamos que los campos de password coincidan
            if (this.password != this.confirm_password && password_flag) {
                alert("Las contraseñas no coinciden.");
                return
            }

            let data = {};

            //Validamos si hubo cambios
            if (password_flag && user_flag)
                data = {
                    user_name: this.user_name,
                    password: this.password
                }
            else
                if (user_flag && !password_flag)
                    data = {
                        user_name: this.user_name,
                    }
                else
                    if (!user_flag && password_flag)
                        data = {
                            password: this.password
                        }
                    else
                        return



            //Guardamos los cambios
            await axios
                .put(mainRoute + "user/" + this.getDecodedAccessToken().sub,
                    data,
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    alert("Usuario actualizado con exito.");
                    //this.createLog("Usuario actualizado.");
                    window.location.reload();
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });

        },

        //Metodo que verifica si el usuario esta activo en el sistema
        async verifyToken() {
            await axios
                .get(mainRoute + "user/" + this.getDecodedAccessToken().sub,
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    return;
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                    this.$router.push('/')
                });
        },

    },
    async created() {
        await this.verifyToken();
        await this.fillUserInfo();
    }
}

</script>

<template>
    <div class="edit-user-container">
        <h1 class="center-text font-weight-bold" style="color: white;">Editar Usuario</h1>
        <form>
            <div class="form-group">
                <label for="edit_user/user_name_input" style="color: white;">Usuario:</label>
                <input class="form-control" id="edit_user/user_name_input" v-model="user_name">
            </div>
            <div class="form-group">
                <label for="edit_user/password_input" style="color: white;">Cambiar contraseña:</label>
                <input class="form-control" id="edit_user/password_input" type="password" v-model="password">
            </div>
            <div class="form-group">
                <label for="edit_user/confirm_password_input" style="color: white;">Confirmar contraseña:</label>
                <input class="form-control" id="edit_user/confirm_password_input" type="password"
                    v-model="confirm_password">
            </div>
            <div class="aling-btn">
                <button type="button" class="btn btn-primary" style="margin: 5px" id="saveBtn"
                    v-on:click="saveChanges()">Guardar cambios</button>
            </div>
        </form>
    </div>
</template>

<style>
.edit-user-container {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 18%);
    width: 450px;
    border-radius: 30px;
    padding-top: 10px;
    padding-right: 20px;
    padding-bottom: 10px;
    padding-left: 20px;
    background-color: #343a40;
}

.aling-btn {
    text-align: right;
}
</style>