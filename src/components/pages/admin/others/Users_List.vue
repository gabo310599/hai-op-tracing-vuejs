<script>

////// AQUI EMPIEZA EL JS DEl DATATABLE ///////////

let dataTableActive;
let dataTableSuspended;
let dataTableIsInitialized = false;

//Opciones de la data table
const dataTableOptionsActive = {
    //scrollX: "2000px",
    lengthMenu: [5, 10, 15, 20, 25],

    // Centrado de datos dentro de la columna
    columnDefs: [
        {
            className: "centered",
            targets: [0, 1, 2, 3, 4, 5, 6],
        },
        {
            orderable: false,
            targets: [4, 5, 6],
        },
        {
            searchable: false,
            targets: [4, 5, 6],
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

//Opciones de la data table
const dataTableOptionsSuspended = {
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
            targets: [4, 5],
        },
        {
            searchable: false,
            targets: [4, 5],
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

//Inicializo la data table
const initDataTable = async () => {
    if (dataTableIsInitialized) {
        dataTableActive.destroy();
        dataTableSuspended.destroy();
    }

    dataTableActive = $("#datatable_active").DataTable(dataTableOptionsActive);
    dataTableSuspended = $("#datatable_suspended").DataTable(dataTableOptionsSuspended);

    dataTableIsInitialized = true;
};

////// AQUI TERMINA EL JS DEl DATATABLE ///////////

import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';
import UserInfoModal from '../tools/UserInfoModal.vue';
import DepartmentModal from '../tools/DepartmentModal.vue';
import { mainRoute } from "../../../../main";

let infoModal = {
    user_name: null,
    operator: {
        name: null,
        last_name: null,
    },
    roles: null
};
let counter = 1;
let activeList = [];
let suspendedList = [];
let modal = false;
let modalInstance = null;


//Exports
export default {
    data() {
        return {
            infoModal,
            activeList,
            suspendedList,
            modal,
            modalInstance
        }
    },
    methods: {

        fillModalInfo(info) {
            this.infoModal = info;
            this.modal = true;
            this.refresToken();
        },

        incrementCounter() {
            return counter++;
        },

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

        //Metodo que llena las listas de usuarios
        async fillUserList() {

            await axios
                .get(mainRoute + "user",
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {

                    const activeList = [];
                    const suspendedList = [];

                    res.data.data.map(function (row) {
                        if (row.status)
                            activeList.push(row);
                        else
                            suspendedList.push(row);
                    });

                    this.activeList = activeList;
                    this.suspendedList = suspendedList;

                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });

        },

        //Metodo que modifica el estado de un usuario
        async updateStatusUser(status, user) {

            await axios
                .put(mainRoute + "user/" + user.id,
                    { status: status },
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    if (this.getDecodedAccessToken().sub === user.id) {
                        alert("El usuario ha sido suspendido.")
                        this.$router.push('/')
                    }

                    if (status) {
                        this.createLog("Se ha activado el usuario: " + user.user_name);
                    } else {
                        this.createLog("Se ha desactivado el usuario: " + user.user_name);
                    }

                    window.location.reload();
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });
        }

    },
    async created() {
        await this.fillUserList();
        await initDataTable();
    },
    components: {
        UserInfoModal,
        DepartmentModal
    },
}

</script>

<template>
    <h1 class="center-text font-weight-bold">Lista de Usuarios</h1>
    <br />

    <!--ACTIVOS-->
    {{ resetCounter() }}
    <h2 class="font-weight-bold">Usuarios Activos:</h2>
    <div class="container my-4">
        <div class="row">
            <div class="col-sm-12 col-md-12 col-xl-12 col-md-12">
                <table id="datatable_active" class="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col" class="center-text">#</th>
                            <th scope="col" class="center-text">Usuario</th>
                            <th scope="col" class="center-text">Nombre</th>
                            <th scope="col" class="center-text">Apellido</th>
                            <th scope="col" class="center-text">Más Información</th>
                            <th scope="col" class="center-text">Departamentos</th>
                            <th scope="col" class="center-text">Suspender</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in activeList" :key="user.id">
                            <th scope="row" class="center-text">{{ incrementCounter() }}</th>
                            <td class="center-text">{{ user.user_name }}</td>
                            <td class="center-text">{{ user.operator.name }}</td>
                            <td class="center-text">{{ user.operator.last_name }}</td>
                            <td class="center-text">
                                <button type="button" class="btn btn-outline-info" data-toggle="modal"
                                    data-target="#userModal" v-on:click="fillModalInfo(user)">Información
                                </button>
                            </td>
                            <td class="center-text">
                                <button type="button" class="btn btn-success" data-toggle="modal"
                                    data-target="#departmentModal" v-on:click="fillModalInfo(user)">Depatamentos
                                </button>
                            </td>
                            <td class="center-text">
                                <button type="button" class="btn btn-danger"
                                    v-on:click="updateStatusUser(false, user)">Suspender</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <br />

    <!--SUSPENDIDOS-->
    {{ resetCounter() }}
    <h2 class="font-weight-bold">Usuarios Suspendidos:</h2>
    <div class="container my-4">
        <div class="row">
            <div class="col-sm-12 col-md-12 col-xl-12 col-md-12">
                <table id="datatable_suspended" class="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col" class="center-text">#</th>
                            <th scope="col" class="center-text">Usuario</th>
                            <th scope="col" class="center-text">Nombre</th>
                            <th scope="col" class="center-text">Apellido</th>
                            <th scope="col" class="center-text">Más Información</th>
                            <th scope="col" class="center-text">Activar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in suspendedList" :key="user.id">
                            <th scope="row" class="center-text">{{ incrementCounter() }}</th>
                            <td class="center-text">{{ user.user_name }}</td>
                            <td class="center-text">{{ user.operator.name }}</td>
                            <td class="center-text">{{ user.operator.last_name }}</td>
                            <td class="center-text">
                                <button type="button" class="btn btn-outline-info" data-toggle="modal"
                                    data-target="#userModal" v-on:click="fillModalInfo(user)">Información
                                </button>
                            </td>
                            <td class="center-text">
                                <button type="button" class="btn btn-success"
                                    v-on:click="updateStatusUser(true, user)">Activar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="userModal" tabindex="-1" role="dialog" aria-labelledby="userModalLabel" aria-hidden="true"
        v-if="modal">
        <UserInfoModal :infoModal="infoModal" />
    </div>

    <!-- Modal -->
    <div class="modal fade" id="departmentModal" tabindex="-1" role="dialog" aria-labelledby="departmentModalLabel"
        aria-hidden="true" v-if="modal">
        <DepartmentModal :infoModal="infoModal" />
    </div>
</template>

<style>
.center-text {
    text-align: center;
}</style>