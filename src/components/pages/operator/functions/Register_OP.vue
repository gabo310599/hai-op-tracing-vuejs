<script>

import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';
import { mainRoute } from "../../../../main";

let processList = [];
let op_number = "";
let width = "";
let points = ""

export default{
    data(){
        return{
            processList,
            op_number,
            width,
            points
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

        //Metodo que obtine la lista de pedidos sin op en Generar OP
        async getRequestWithoutOP(){

            let department_id = "";

            //Obtengo el id del departamento Generar OP
            await axios
                .post(mainRoute + "department/get/by-name/",
                    { name: "Generar OP" },
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    department_id = res.data.data.id;
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });

            //Obtengo la lista de procesos activos en dicho departamento sin una OP asociada
            await axios
                .get(mainRoute + "process/get/request-whithout-op/generate-op/"+department_id,
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    this.processList = res.data.data;
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });
            
        },

        //Metodo que guarda el registro de op con la asociacion al pedido
        async saveOP(){
            this.refresToken();

            //Verificamos que los campos esten completos

            //Verificamos que se seleccionara un pedido
            if(document.getElementById("register_op/request_input").value == "SELECCIONAR"){
                alert("Por favor seleccionar un pedido de la lista.");
                return;
            }

            //Verificamos que se rellenara el numero de op
            if(this.op_number.length == 0){
                alert("Por favor ingresar el número de la op.");
                return;
            }

            //Verificamos que se rellenara el ancho de la op
            if(this.width.length == 0){
                alert("Por favor ingresa el ancho de la op.");
                return;
            }

            //Verificamos que se rellenara la cantidad de puntos
            if(this.points.length == 0){
                alert("Por favor ingresa la cantidad de puntos.");
                return;
            }

            //Verificamos que se seleccionara el tipo de urdido
            if(document.getElementById("register_op/warped_input").value == "SELECCIONAR"){
                alert("Por favor selecciona el tipo de urdido.");
                return;
            }

            //Creamos la orden
            let order_id = "";
            await axios
                .post(mainRoute + "production-order",
                    { 
                        op_number: this.op_number,
                        warped: document.getElementById("register_op/warped_input").value,
                        points: this.points,
                        width: this.width
                    },
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {

                    order_id = res.data.data.id;

                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });


            //Actualizamos el registro del proceso
            let process_id = "";
            this.processList.map(function (row){
                if(row.request.id == document.getElementById("register_op/request_input").value)
                    process_id = row.id;
            })
            await axios
                .put(mainRoute + "process/"+ process_id,
                    { order_id: order_id },
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {

                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });

            //Creamos la union entre orden y pedido
            await axios
                .put(mainRoute + "production-order/request-note/union",
                    { 
                        order_id: order_id,
                        request_id: document.getElementById("register_op/request_input").value
                    },
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {

                    alert("OP registrada con exito.");
                    //this.createLog("Se ha creado la OP " + this.op_number + " asociada al id de pedido: " + document.getElementById("register_op/request_input").value)
                    this.op_number = "";
                    this.points = "";
                    this.width = "";
                    window.location.reload();
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });

        }

    },
    created(){
        this.getRequestWithoutOP();
    }
}

</script>

<template>
    
    <div class="register-op-container"> 
        <h3 class="font-weight-bold title-style">Registrar Orden de Producción</h3>
        <form>
            <div class="form-group">
                <label for="register_op/request_input">Pedidos:</label>
                <select class="form-select" aria-label="Default select example" id="register_op/request_input">
                    <option value="SELECCIONAR">Seleccionar...</option>
                    <option v-for="process in processList" :value="process.request.id">{{process.request.serial + process.request.characters}}</option>
                </select>
            </div>
            <div class="form-group">
                <label for="register_op/op_number_input">Número de OP:</label>
                <input class="form-control" id="register_op/op_number_input" v-model="op_number"/>
            </div>
            <div class="form-group">
                <label for="register_op/width_input">Ancho:</label>
                <input type="number" class="form-control" id="register_op/width_input" v-model="width"/>
            </div>
            <div class="form-group">
                <label for="register_op/points_input">Puntos:</label>
                <input type="number" class="form-control" id="register_op/points_input" v-model="points"/>
            </div>
            <div class="form-group">
                <label for="register_op/warped_input">Urdido:</label>
                <select class="form-select" aria-label="Default select example" id="register_op/warped_input">
                    <option value="SELECCIONAR">Seleccionar...</option>
                    <option value="blanco">Blanco</option>
                    <option value="negro">Negro</option>
                </select>
            </div>
            <div class="align-btn">
                <button type="button" class="btn btn-primary" v-on:click="saveOP()" >Registrar</button>
            </div>
        </form>
    </div>

    <br/>
</template>

<style>

.register-op-container{
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
    margin-bottom: 3%;
}

</style>