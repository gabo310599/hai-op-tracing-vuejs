<script>

import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';
import { mainRoute } from "../../../../main";

let counter = 1;
let checkInList = [];
let checkOutList = [];
let request_whithout_op = "";
let op_number = "";
let width = "";
let points = "";

export default{
    data(){
        return{
            counter,
            checkInList,
            checkOutList,
            request_whithout_op,
            op_number,
            width,
            points
        }
    },
    async created(){
        await this.fillCheckInList();
        await this.fillCheckOutList();
    },
    props:[
        "modalInfoType1"
    ],
    watch:{
        modalInfoType1(){
            this.fillCheckInList();
            this.fillCheckOutList();
        }
    },
    emits: [
        'reload'
    ],
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

        //Llenamos la lista de pedidos disponibles para este departamento
        async fillCheckInList(){

            this.checkInList = [];
            await axios
                .get(mainRoute + "process/list/check-in/" + this.modalInfoType1.department.id,
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    this.checkInList = res.data.data;
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message + "HOLA");
                });
        },

        //Metodo que acepta un pedido en el departamento
        async checkIn(process){

            this.refresToken();

            let operator_id = "";

            await axios
                .get(mainRoute + "user/" + this.getDecodedAccessToken().sub ,
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
                .put(mainRoute + "process/" + process.id,
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

            //this.createLog("El pedido " + process.request.serial + process.request.characters + " ha sido ingresado a " + process.department.name + ".")
            this.$emit('reload');
        },

        //Llenamos la lista de pedidos en este departamento
        async fillCheckOutList(){

            this.checkOutList = [];
            await axios
                .get(mainRoute + "process/list/check-out/" + this.modalInfoType1.department.id,
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

        //Metodo que marca la salida de un pedido en el departamento
        async checkOut(process){

            this.refresToken();

            //En el caso que sea el ultimo caso tipo 1
            let orders_ids = [{id: null}];
            if(this.modalInfoType1.department.name == "Generar OP"){

                let opArray = [];

                //Verificamos que el pedido este asociado a una orden
                await axios
                    .post(mainRoute + "production-order/get/orders-by-request",
                        {
                            serial: process.request.serial,
                            characters: process.request.characters
                        },
                        { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                    )
                    .then((res) => {
                            opArray =  res.data.data
                    })
                    .catch((error) => {
                        console.log(error.message);
                        alert("Error: " + error.response.data.message);
                    });

                if(opArray.length <= 0){
                    this.request_whithout_op = process.request;
                    alert("Por favor asociar una OP antes de marcar la salida del pedido.")
                    $('#generateOPModal').modal('show');
                    return
                }else{
                    orders_ids = opArray
                }
            }

            let operator_id = "";
            await axios
                .get(mainRoute + "user/" + this.getDecodedAccessToken().sub ,
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
                .put(mainRoute + "process/" + process.id,
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
            
            //Creamos el nuevo registro del siguiente departamento
            for(let i = 0; i < orders_ids.length; i++){
                if(this.modalInfoType1.next_department_id){
                    await axios
                    .post( mainRoute + "process",
                        {
                            request_id: process.request.id,
                            department_id: this.modalInfoType1.next_department_id,
                            order_id: orders_ids[i].id
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
            }

            this.createLog("El pedido " + process.request.serial + process.request.characters + " ha saldio de " + process.department.name + ".")
            this.$emit('reload');
        },

        //Metodo que cierra el modal de registrar una op
        closeGenerateOPModal(){
            $('#generateOPModal').modal('hide');

            $('#generateOPModal').on('hidden.bs.modal', function () {
                $(this).find('form').trigger('reset');
            });
        },

        //Metodo que guarda el registro de op con la asociacion al pedido
        async saveOP(){
            this.refresToken();

            //Verificamos que los campos esten completos

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
            if(document.getElementById("check-out/register_op/warped_input").value == "SELECCIONAR"){
                alert("Por favor selecciona el tipo de urdido.");
                return;
            }

            //Creamos la orden
            let order_id = "";
            await axios
                .post(mainRoute + "production-order",
                    { 
                        op_number: this.op_number,
                        warped: document.getElementById("check-out/register_op/warped_input").value,
                        points: this.points,
                        width: this.width
                    },
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {

                    if(res.data.msg === "Error"){
                        alert(res.data.data)
                        return
                    }
                    order_id = res.data.data.id;

                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });


            //Actualizamos el registro del proceso
            await axios
                .put(mainRoute + "process/"+ this.request_whithout_op.id,
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
                        request_id: this.request_whithout_op.id
                    },
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {

                    alert("OP registrada con exito.");
                    //this.createLog("Se ha creado la OP " + this.op_number + " asociada al id de pedido: " + document.getElementById("register_op/request_input").value)
                    this.op_number = "";
                    this.points = "";
                    this.width = "";
                    this.closeGenerateOPModal();
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });

        }
    }
}

</script>

<template>
    
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title font-weight-bold" id="checkOutModalType1Label">{{modalInfoType1.department.name}}</h2>
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
                            <th scope="col" class="center-text">Pedido</th>
                            <th scope="col" class="center-text">Descripción</th>
                            <th scope="col" class="center-text">Código</th>
                            <th scope="col" class="center-text">Marcar Entrada</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in checkInList" :key="row.request.id">
                            <th scope="row" class="center-text">{{incrementCounter()}}</th>
                            <td class="center-text">{{row.request.serial + row.request.characters}}</td>
                            <td class="center-text">{{row.request.description}}</td>
                            <td class="center-text">{{row.request.code}}</td>
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
                                <th scope="col" class="center-text">Pedido</th>
                                <th scope="col" class="center-text">Descripción</th>
                                <th scope="col" class="center-text">Código</th>
                                <th scope="col" class="center-text">Marcar Salida</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in checkOutList" :key="row.request.id">
                                <th scope="row" class="center-text">{{incrementCounter()}}</th>
                                <td class="center-text">{{row.request.serial + row.request.characters}}</td>
                                <td class="center-text">{{row.request.description}}</td>
                                <td class="center-text">{{row.request.code}}</td>
                                <td class="center-text">
                                    <button button type="button" class="btn btn-outline-danger" v-on:click="checkOut(row)">
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

    <!-- Modal para ingresar una OP -->
    <div class="modal fade" id="generateOPModal" tabindex="-1" role="dialog" aria-labelledby="generateOPModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="generateOPModalLabel">Registrar Orden de Producción</h5>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="check-out/register_op/request_input">Pedido:</label>
                            <input class="form-control" id="check-out/register_op/request_input" :value="request_whithout_op.serial+request_whithout_op.characters" readonly>
                        </div>
                        <div class="form-group">
                            <label for="check-out/register_op/op_number_input">Número de OP:</label>
                            <input class="form-control" id="check-out/register_op/op_number_input" v-model="op_number"/>
                        </div>
                        <div class="form-group">
                            <label for="check-out/register_op/width_input">Ancho:</label>
                            <input type="number" class="form-control" id="check-out/register_op/width_input" v-model="width"/>
                        </div>
                        <div class="form-group">
                            <label for="check-out/register_op/points_input">Puntos:</label>
                            <input type="number" class="form-control" id="check-out/register_op/points_input" v-model="points"/>
                        </div>
                        <div class="form-group">
                            <label for="check-out/register_op/warped_input">Urdido:</label>
                            <select class="form-select" aria-label="Default select example" id="check-out/register_op/warped_input">
                                <option value="SELECCIONAR">Seleccionar...</option>
                                <option value="blanco">Blanco</option>
                                <option value="negro">Negro</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" v-on:click="saveOP()">Guardar</button>
                    <button type="button" class="btn btn-primary" v-on:click="closeGenerateOPModal()">Salir</button>
                </div>
            </div>
        </div>
    </div>

</template>