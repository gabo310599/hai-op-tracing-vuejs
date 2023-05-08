<script>

import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';

let counter = 1;
let checkInList = [];
let checkOutList = [];

export default{
    data(){
        return{
            counter,
            checkInList,
            checkOutList
        }
    },
    emits:[
        "reload"
    ],
    async created(){
        await this.fillCheckInList();
        await this.fillCheckOutList();
    },
    props:[
        "modalInfoType3"
    ],
    watch:{
        modalInfoType3(){
            this.fillCheckInList();
            this.fillCheckOutList();
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
                    Cookies.set("userLoggedOperator", this.token);
                })
                .catch((error) => {
                    console.log(error.message);
                });
        },

        //Incrementamos el contador
        incrementCounter() {
            return counter++;
        },

        //Reiniciamos el contador
        resetCounter() {
            counter = 1;
        },

        //Metodo que obtiene de cookies el usuario que inicio sesion
        getUserFromCookies() {
            return Cookies.get("userLoggedOperator");
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

        //Llenamos la lista de pedidos disponibles para este departamento
        async fillCheckInList(){

            this.checkInList = [];
            await axios
                .get("http://localhost:3000/process/list/check-in/" + this.modalInfoType3.department.id,
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    this.checkInList = res.data.data;
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });
        },

        //Metodo que acepta un pedido en el departamento
        async checkIn(process){

            this.refresToken();

            //Verificamos que el proceso  este asociado a una maquina
            let machine = false;
            await axios
                .get("http://localhost:3000/process/" + process.id ,
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                        if(res.data.data.machine)
                            machine = true;
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });
            
            if(!machine){
                alert("Por favor asignarle maquina al pedido.")
                return;
            }

            //Obtenemos el id del operario a traves del usuario
            let operator_id = "";
            await axios
                .get("http://localhost:3000/user/" + this.getDecodedAccessToken().sub ,
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                        operator_id = res.data.data.operator.id;
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });

            //Actualizamos el registro del proceso
            await axios
                .put("http://localhost:3000/process/" + process.id,
                    {
                        date_in: new Date(),
                        operator_id: operator_id
                    },
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    this.fillCheckInList();
                    this.fillCheckOutList();
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });

                this.createLog("El pedido " + process.request.serial + process.request.characters + " ha sido ingresado a " + process.department.name + ".")
                this.$emit('reload');
        },

        //Llenamos la lista de pedidos en este departamento
        async fillCheckOutList(){

            this.checkOutList = [];
            await axios
                .get("http://localhost:3000/process/list/check-out/" + this.modalInfoType3.department.id,
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    this.checkOutList = res.data.data;
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });
        },

        //Metodo de marca la salida de un pedido en el departamento.
        async checkOut(process){

            this.refresToken();
            
            //Obtenemos el id del operador que esta ejecutando la accion
            let operator_id = "";
            await axios
                .get("http://localhost:3000/user/" + this.getDecodedAccessToken().sub ,
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                        operator_id = res.data.data.operator.id;
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });

            //Actualizamos el registro del proceso
            await axios
                .put("http://localhost:3000/process/" + process.id,
                    {
                        date_out: new Date(),
                        operator_id: operator_id
                    },
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    this.fillCheckInList();
                    this.fillCheckOutList();
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });
            
            //Creamos el nuevo registro del siguiente departamento si existe
            if(this.modalInfoType3.next_department_id){
                await axios
                .post("http://localhost:3000/process",
                    {
                        request_id: process.request.id,
                        department_id: this.modalInfoType3.next_department_id,
                        order_id: process.order.id
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
            this.createLog("El pedido " + process.request.serial + process.request.characters + " ha saldio de " + process.department.name + ".")
            this.$emit('reload');
        }

    }
}

</script>

<template>
    
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title font-weight-bold" id="checkOutModalType3Label">{{modalInfoType3.department.name}}</h2>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">

                {{ resetCounter() }}
                <h4 class="font-weight-bold">Pedidos en espera para ingresar:</h4>
                <table class="table table-hover table-sm ">
                    <thead class="thead-dark">
                        <tr>
                            <th scope="col" class="center-text">#</th>
                            <th scope="col" class="center-text">Serial</th>
                            <th scope="col" class="center-text">Descripción</th>
                            <th scope="col" class="center-text">Código</th>
                            <th scope="col" class="center-text">OP</th>
                            <th scope="col" class="center-text">Marcar Entrada</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in checkInList" :key="row.request.id">
                            <th scope="row" class="center-text">{{incrementCounter()}}</th>
                            <td class="center-text">{{row.request.serial + row.request.characters}}</td>
                            <td class="center-text">{{row.request.description}}</td>
                            <td class="center-text">{{row.request.code}}</td>
                            <td class="center-text">{{row.order.op_number}}</td>
                            <td class="center-text">
                                <button button type="button" class="btn btn-outline-success" v-on:click="checkIn(row)">
                                    Entrada
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <br/>

                {{ resetCounter() }}
                <h4 class="font-weight-bold">Pedidos en espera para salir:</h4>
                    <table class="table table-hover table-sm ">
                        <thead class="thead-dark">
                            <tr>
                                <th scope="col" class="center-text">#</th>
                                <th scope="col" class="center-text">Serial</th>
                                <th scope="col" class="center-text">Descripción</th>
                                <th scope="col" class="center-text">Código</th>
                                <th scope="col" class="center-text">OP</th>
                                <th scope="col" class="center-text">Maquina</th>
                                <th scope="col" class="center-text">Marcar Salida</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in checkOutList" :key="row.request.id">
                                <th scope="row" class="center-text">{{incrementCounter()}}</th>
                                <td class="center-text">{{row.request.serial + row.request.characters}}</td>
                                <td class="center-text">{{row.request.description}}</td>
                                <td class="center-text">{{row.request.code}}</td>
                                <td class="center-text">{{row.order.op_number}}</td>
                                <td class="center-text">{{row.machine.number}}</td>
                                <td class="center-text">
                                    <button button type="button" class="btn btn-outline-danger" v-on:click="checkOut(row)" >
                                        Salida
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-dismiss="modal">Salir</button>
            </div>
        </div>
    </div>
</template>