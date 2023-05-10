<script>

import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';

////// AQUI EMPIEZA EL JS DEl DATATABLE ///////////

let dataTableRequest;
let dataTableOrder;

let dataTableIsInitialized = false;
const dataTableRequestOptions = {
    //scrollX: "2000px",
    lengthMenu: [5, 10, 15, 20, 25],

    // Centrado de datos dentro de la columna
    columnDefs: [
        {
            className: "centered",
            targets: [0, 1, 2, 3, 4, 5],
        },
        {
            orderable: false,
            targets: [5],
        },
        {
            searchable: false,
            targets: [5],
        },
        //{ width: "50%", targets: [0], },
    ],
    // Cantidad inicial por pagina 
    pageLength: 5,
    destroy: true,
    // Señalizacion en español
    language: {
        lengthMenu: "Mostrar _MENU_ registros por página",
        zeroRecords: "Ningún registro encontrado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ningún registro encontrado",
        infoFiltered: "(filtrados desde _MAX_ registros totales)",
        search: "Buscar: ",
        loadingRecords: "Cargando... ",
        paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior",
        },
    }
};

const dataTableOrderOptions = {
    //scrollX: "2000px",
    lengthMenu: [5, 10, 15, 20, 25],

    // Centrado de datos dentro de la columna
    columnDefs: [
        {
            className: "centered",
            targets: [0, 1, 2, 3, 4, 5],
        },
        {
            orderable: false,
            targets: [5],
        },
        {
            searchable: false,
            targets: [5],
        },
        //{ width: "50%", targets: [0], },
    ],
    // Cantidad inicial por pagina 
    pageLength: 5,
    destroy: true,
    // Señalizacion en español
    language: {
        lengthMenu: "Mostrar _MENU_ registros por página",
        zeroRecords: "Ningún registro encontrado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ningún registro encontrado",
        infoFiltered: "(filtrados desde _MAX_ registros totales)",
        search: "Buscar: ",
        loadingRecords: "Cargando... ",
        paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior",
        },
    }
};

const initDataTable = async () => {
    if (dataTableIsInitialized) {
        dataTableRequest.destroy();
        dataTableOrder.destroy();
    }

    dataTableRequest = $("#datatable_request").DataTable(dataTableRequestOptions);
    dataTableOrder = $("#datatable_order").DataTable(dataTableOrderOptions);


    dataTableIsInitialized = true;
};

////// AQUI TERMINA EL JS DEl DATATABLE ///////////

let counter = 1;
let requestList = [];
let orderList = [];

export default {
    data() {
        return {
            counter,
            requestList,
            orderList
        }
    },
    methods: {

        //Incrementamos el contador
        incrementCounter() {
            return counter++;
        },

        //Reiniciamos el contador
        resetCounter() {
            counter = 1;
        },

        //Metodo de refresh token
        async refresToken() {
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

        //Metodo que obtiene de cookies el usuario que inicio sesion
        getUserFromCookies() {
            return Cookies.get("userLoggedOperator");
        },

        //Metodo que llena las listas de pedidos y ordenes
        async fillLists() {
            await axios
                .get("http://localhost:3000/process/get/request-without-check-in",
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {

                    this.requestList = res.data.data;

                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });

            await axios
                .get("http://localhost:3000/process/get/order-without-check-in",
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {

                    this.orderList = res.data.data;

                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });
        },

        //Metodo que guarda los cambios de un pedido u orden
        async save(type, process){

            this.refresToken();

            //Revisamos si estamos guardando una orden o un pedido
            if(type === 1){

                let change = false;

                //Verificamos si existen cambios en alguno de los campos
                if(document.getElementById(process.request.id+process.request.serial).value != process.request.serial)
                    change = true;
                
                if(document.getElementById(process.request.id+process.request.description).value != process.request.description)
                    change = true;

                if(document.getElementById(process.request.id+process.request.code).value != process.request.code)
                    change = true;
                
                if(document.getElementById(process.request.id+process.request.characters).value != process.request.characters)
                    change = true;

                //Si hay cambios, actualizamos el registro
                if(change){

                    await axios
                        .put("http://localhost:3000/request-note/" + process.request.id,
                            {
                                serial: document.getElementById(process.request.id+process.request.serial).value.toUpperCase(),
                                description: document.getElementById(process.request.id+process.request.description).value.toUpperCase(),
                                code: document.getElementById(process.request.id+process.request.code).value.toUpperCase(),
                                characters: document.getElementById(process.request.id+process.request.characters).value.toUpperCase()
                            },
                            { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                        )
                        .then((res) => {

                            this.createLog("Se ha modificado el pedido: " + process.request.id );
                            alert("Pedido actualizado con exito")
                            window.location.reload();

                        })
                        .catch((error) => {
                            console.log(error.message);
                            alert("Error: " + error.response.data.message);
                        });
                }

            }else if( type === 2){

                let change = false;

                //Verificamos si existen cambios en alguno de los campos
                if(document.getElementById(process.order.id+process.order.op_number).value != process.order.op_number)
                    change = true;
                
                if(document.getElementById(process.order.id+process.order.points).value != process.order.points)
                    change = true;

                if(document.getElementById(process.order.id+process.order.width).value != process.order.width)
                    change = true;
                
                if(document.getElementById(process.order.id+process.order.warped).value != process.order.warped)
                    change = true;

                console.log(process.order.id)
                //Si hay cambios, actualizamos el registro
                if(change){

                    await axios
                        .put("http://localhost:3000/production-order/" + process.order.id,
                            {
                                op_number: document.getElementById(process.order.id+process.order.op_number).value.toUpperCase(),
                                points: +document.getElementById(process.order.id+process.order.points).value,
                                width: +document.getElementById(process.order.id+process.order.width).value,
                                warped: document.getElementById(process.order.id+process.order.warped).value.toLowerCase()
                            },
                            { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                        )
                        .then((res) => {

                            this.createLog("Se ha modificado la orden: " + process.order.id );
                            alert("Orden actualizada con exito")
                            window.location.reload();

                        })
                        .catch((error) => {
                            console.log(error.message);
                            alert("Error: " + error.response.data.message);
                        });
                }
            }
        }

    },
    async created(){
        await this.fillLists();
        await initDataTable();
    }
}

</script>

<template>
    <div class="edit-request-order-container">

        <!--Pedidos-->
        <br />
        <h2 class="font-weight-bold">Editar pedidos:</h2>
        {{ resetCounter() }}
        <div class="container my-4">
            <div class="row">
                <div class="col-sm-12 col-md-12 col-xl-12 col-md-12">
                    <table id="datatable_request" class="table table-striped table-hover">
                        <thead class="thead-dark">
                            <tr>
                                <th scope="col" class="center-text">#</th>
                                <th scope="col" class="center-text">Serial</th>
                                <th scope="col" class="center-text">Descripción</th>
                                <th scope="col" class="center-text">Código</th>
                                <th scope="col" class="center-text">Secuencia</th>
                                <th scope="col" class="center-text">Guardar</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="process in requestList" :key="process.id">
                                <th scope="row" class="center-text">{{ incrementCounter() }}</th>
                                <td class="center-text">
                                    <textarea class="form-control" rows="2" :id="process.request.id + process.request.serial">{{process.request.serial}}</textarea>
                                </td>
                                <td class="center-text">
                                    <textarea class="form-control" rows="2" :id="process.request.id + process.request.description">{{process.request.description}}</textarea>
                                </td>
                                <td class="center-text">
                                    <textarea class="form-control" rows="2" :id="process.request.id + process.request.code">{{process.request.code}}</textarea>
                                </td>
                                <td class="center-text">
                                    <textarea class="form-control" rows="2" :id="process.request.id + process.request.characters">{{process.request.characters}}</textarea>
                                </td>
                                <td class="center-text">
                                    <button type="button" class="btn btn-success" v-on:click="save(1, process)">
                                        Guardar
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!--Ordenes-->
        <br />
        <h2 class="font-weight-bold">Editar ordenes:</h2>
        {{ resetCounter() }}
        <div class="container my-4">
            <div class="row">
                <div class="col-sm-12 col-md-12 col-xl-12 col-md-12">
                    <table id="datatable_order" class="table table-striped table-hover">
                        <thead class="thead-dark">
                            <tr>
                                <th scope="col" class="center-text">#</th>
                                <th scope="col" class="center-text">Número OP</th>
                                <th scope="col" class="center-text">Puntos</th>
                                <th scope="col" class="center-text">Ancho</th>
                                <th scope="col" class="center-text">Urdido</th>
                                <th scope="col" class="center-text">Guardar</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="process in orderList" :key="process.id">
                                <th scope="row" class="center-text">{{ incrementCounter() }}</th>
                                <td class="center-text">
                                    <textarea class="form-control" rows="2" :id="process.order.id + process.order.op_number">{{process.order.op_number}}</textarea>
                                </td>
                                <td class="center-text">
                                    <textarea class="form-control" rows="2" :id="process.order.id + process.order.points">{{process.order.points}}</textarea>
                                </td>
                                <td class="center-text">
                                    <textarea class="form-control" rows="2" :id="process.order.id + process.order.width">{{process.order.width}}</textarea>
                                </td>
                                <td class="center-text">
                                    <textarea class="form-control" rows="2" :id="process.order.id + process.order.warped">{{process.order.warped}}</textarea>
                                </td>
                                <td class="center-text">
                                    <button type="button" class="btn btn-success" v-on:click="save(2, process)">
                                        Guardar
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>
    <br />
</template>

<style>
.edit-request-order-container {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-51%, 3%);
    width: 1300px;
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