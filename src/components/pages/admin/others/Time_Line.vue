<script>

////// AQUI EMPIEZA EL JS DEl DATATABLE ///////////

let dataTableProcess;
let dataTableIsInitialized = false;

const dataTableProcessOptions = {
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
        dataTableProcess.destroy();
    }

    dataTableProcess = $("#datatable_time_line").DataTable(dataTableProcessOptions);

    dataTableIsInitialized = true;
};

////// AQUI TERMINA EL JS DEl DATATABLE ///////////

import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';

let counter = 1;
let processList = [];

export default {
    data() {
        return {
            counter,
            processList
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
                    Cookies.set("userLogged", this.token);
                })
                .catch((error) => {
                    console.log(error.message);
                });
        },

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

        //Llenamos la lista de procesos
        async fillProcessesList(){
            await axios
                .get("http://localhost:3000/process/get/last-active",
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    this.processList = res.data.data;

                    console.log(this.processList)
                    
                    for(let i=0; i < this.processList.length; i++){
                        if(!this.processList[i].order){
                            this.processList.order = { op_number: "N/A" } 
                            console.log("entre")
                        }
                    }
                    
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });
        }
    },
    async created() {
        await this.fillProcessesList();
        await initDataTable();
    }
}

</script>

<template>
    <h1 class="center-text font-weight-bold">Linea de Tiempo</h1>

    <h2 class="font-weight-bold">Pedidos:</h2>

    <!--PROCESO-->
    {{ resetCounter() }}
    <div class="container my-4">
        <div class="row">
            <div class="col-sm-12 col-md-12 col-xl-12 col-md-12">
                <table id="datatable_time_line" class="table table-hover">
                    <thead class="thead-dark">
                        <tr>
                            <th scope="col" class="center-text">#</th>
                            <th scope="col" class="center-text">Pedido</th>
                            <th scope="col" class="center-text">Descripción</th>
                            <th scope="col" class="center-text">Departamento</th>
                            <th scope="col" class="center-text">OP</th>
                            <th scope="col" class="center-text">Más Información</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="process in processList" :key="process.id">
                            <th scope="row" class="center-text">{{ incrementCounter() }}</th>
                            <td class="center-text">{{process.request.serial + process.request.characters}}</td>
                            <td class="center-text">{{process.request.description}}</td>
                            <td class="center-text">{{process.department.name}}</td>
                            <td class="center-text">{{process.order.op_number}}</td>
                            <td class="center-text">
                                <button type="button" class="btn btn-outline-info">
                                    HOLA
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>