<script>

import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';
import { mainRoute } from "../../../../main";

////// AQUI EMPIEZA EL JS DEl DATATABLE ///////////

let dataTableOrder;
let dataTableIsInitialized = false;

const dataTableOrderOptions = {
    //scrollX: "2000px",
    lengthMenu: [5, 10, 15, 20, 25],

    // Centrado de datos dentro de la columna
    columnDefs: [
        {
            className: "centered",
            targets: [0, 1, 2, 3, 4],
        },
        {
            orderable: false,
            targets: [4],
        },
        {
            searchable: false,
            targets: [4],
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
        dataTableOrder.destroy();
    }

    dataTableOrder = $("#datatable_order_observation").DataTable(dataTableOrderOptions);

    dataTableIsInitialized = true;
};

////// AQUI TERMINA EL JS DEl DATATABLE ///////////

let counter = 0;
let processList = [];

export default {
    data() {
        return {
            counter,
            processList
        }
    },
    async created() {
        await this.verifyToken();
        await this.getProcessList();
        await initDataTable();
    },
    methods: {

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

        //Metodo que obtiene de cookies el usuario que inicio sesion
        getUserFromCookies() {
            return Cookies.get("userLogged");
        },

        //Metodo que obtiene la lista de procesos con sus observaciones
        async getProcessList() {
            await axios
                .get(mainRoute + "process/get/by-observation",
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    this.processList = res.data.data;
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
    <br />
    <h1 class="font-weight-bold">Observaciones:</h1>

    <br />
    {{ resetCounter() }}
    <div class="container my-4">
        <div class="row">
            <div class="col-sm-12 col-md-12 col-xl-12 col-md-12">
                <table id="datatable_order_observation" class="table table-hover">
                    <thead class="thead-dark">
                        <tr>
                            <th scope="col" class="center-text">#</th>
                            <th scope="col" class="center-text">Pedido</th>
                            <th scope="col" class="center-text">Descripción</th>
                            <th scope="col" class="center-text">Departamento</th>
                            <th scope="col" class="center-text">Observaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="process in processList" :key="process.id">
                            <th scope="row" class="center-text">{{ incrementCounter() }}</th>
                            <td class="center-text">{{ process.request.serial + process.request.characters }}</td>
                            <td class="center-text">{{ process.request.description }}</td>
                            <td class="center-text">{{ process.department.name }}</td>
                            <td class="center-text">
                                <textarea class="form-control" id="exampleFormControlTextarea3" rows="3"
                                    readonly>{{ process.observation }}</textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>