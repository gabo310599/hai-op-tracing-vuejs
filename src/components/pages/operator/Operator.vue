<script>

import Login from '../tools/Login.vue';
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';
import { RouterView, RouterLink } from 'vue-router'
import axios from "axios";
import { mainRoute } from '../../../main';

let isNotLogged;
let user = [];
let token = "";

export default {
    data() {
        return {
            isNotLogged: true,
            user,
            token
        }
    },
    components: {
        Login
    },
    methods: {

        //Metodo que desactiva las funciones si el usuario no inicio sesion
        disableOptions() {
            if (this.isNotLogged)
                return false;
            else
                return true
        },

        //Metodo que obtiene los datos de un inicio de sesion
        catchLoginInfo(data) {
            this.fillUserInfo(data);
            this.isNotLogged = false;
        },

        //Metodo que guarda los datos de un inicio de sesion
        fillUserInfo(data) {
            this.user = data.user;
            this.token = data.accessToken;
            Cookies.set("userLoggedOperator", this.token)
           // this.createLog("Inicio de sesión operador.")
        },

        //Metodo que administra el log
        async createLog(msg) {

            await axios
            .post(mainRoute + "log",
               {user_id: this.user.id, log: msg},
               {headers: { Authorization: `Bearer ${this.getUserFromCookies()}` }}
            )
            .then((res) => {

            })
            .catch((error) => {
               console.log(error.message);
               alert("Error: "+error.response.data.message);
            });

        },

        //Metodo que obtiene de cookies el usuario que inicio sesion
        getUserFromCookies() {
            return Cookies.get("userLoggedOperator");
        },

        //Metodo que elimina de las cookies el usuario
        removeUserLogged() {
            Cookies.remove('userLoggedOperator');
        },

        //Metodo que cierra sesion
        logout() {
            //this.createLog("Sesión finalizada.");
            this.removeUserLogged();
        },

        //Metodo que decodifica el token
        getDecodedAccessToken(token) {
            try {
                return jwt_decode(token);
            } catch (Error) {
                return null;
            }
        },

    },
    async created() {

        const token = this.getUserFromCookies();

        //Verificamos si el token esta activo, y luego lo renovamos
        if (token) {

            await axios
                .get(mainRoute +"user/" + this.getDecodedAccessToken(token).sub,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((res) => {
                    this.user = res.data.data;
                    this.isNotLogged = false;
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });

            if (this.user) {
                await axios
                    .get(mainRoute + "auth/refresh",
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                    .then((res) => {
                        this.token = res.data.data.accessToken;
                        Cookies.set("userLoggedOperator", this.token);
                    })
                    .catch((error) => {
                        console.log(error.message);
                    });
            }

        }
    }
}

</script>

<template>
    <div class="operator-background">

        <nav class="navbar navbar-expand navbar navbar-dark bg-dark">
            <ul class="navbar-nav">
                <li class="nav-item d-none d-sm-inline-block" v-if="disableOptions()">
                    <RouterLink to="/operator/check-out">
                        <a class="nav-link font-weight-bold">INICIO</a>
                    </RouterLink>
                </li>
                <li class="nav-item d-none d-sm-inline-block" v-if="disableOptions()">
                    <RouterLink to="/operator/register-request">
                        <a class="nav-link font-weight-bold">REGISTRAR PEDIDO</a>
                    </RouterLink>
                </li>
                <li class="nav-item d-none d-sm-inline-block" v-if="disableOptions()">
                    <RouterLink to="/operator/register-op">
                        <a class="nav-link font-weight-bold">REGISTRAR OP</a>
                    </RouterLink>
                </li>
                <li class="nav-item d-none d-sm-inline-block" v-if="disableOptions()">
                    <RouterLink to="/operator/machines">
                        <a class="nav-link font-weight-bold">MAQUINAS</a>
                    </RouterLink>
                </li>
                <li class="nav-item d-none d-sm-inline-block" v-if="disableOptions()">
                    <RouterLink to="/operator/observation">
                        <a class="nav-link font-weight-bold">OBSERVACIONES</a>
                    </RouterLink>
                </li>
                <li class="nav-item d-none d-sm-inline-block" v-if="disableOptions()">
                    <RouterLink to="/operator/edit-request-order">
                        <a class="nav-link font-weight-bold">EDITAR</a>
                    </RouterLink>
                </li>
                <li class="nav-item d-none d-sm-inline-block">
                    <RouterLink to="/">
                        <a class="nav-link font-weight-bold" v-on:click="logout()">SALIR</a>
                    </RouterLink>
                </li>
            </ul>
            <ul class="navbar-nav ml-auto">
                <li class="nav-item dropdown">
                    <a class="nav-link" data-widget="fullscreen" role="button">
                        <i class="fas fa-expand-arrows-alt"></i>
                    </a>
                </li>
            </ul>
        </nav>

        <h1 class="font-weight-bold title-style">Operadores</h1>

        <Login v-if="isNotLogged" v-on:success="catchLoginInfo" />
        <RouterView v-if="disableOptions()" />

    </div>
</template>

<style>
.operator-background {
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
    background: #2980B9;
    /* fallback for old browsers */
    background: -webkit-linear-gradient(to top, #FFFFFF, #6DD5FA, #2980B9);
    /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to top, #FFFFFF, #6DD5FA, #2980B9);
    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.center-text {
    text-align: center;
}

.title-style {
    text-align: center;
    padding-top: 20px;
}
</style>