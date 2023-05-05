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
let processTimeLine = [];
let requestName = "";
let colorList = [];

export default {
    data() {
        return {
            counter,
            processList,
            processTimeLine,
            requestName,
            colorList,
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
        async fillProcessesList() {
            await axios
                .get("http://localhost:3000/process/get/last-active",
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    this.processList = res.data.data;

                    for (let i = 0; i < this.processList.length; i++) {
                        if (!this.processList[i].order) {
                            this.processList[i].order = { op_number: "N/A" }
                        }
                    }
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });
        },

        //Llenamos la lista de colores para los departamentos
        async fillColorList() {

            //Diseño Gráfico
            this.colorList.push("--accent-color:#41516C")

            //Diseño Textil
            this.colorList.push("--accent-color:#FBCA3E")

            //Generar OP
            this.colorList.push("--accent-color:#E24A68")

            //Imprimir OP
            this.colorList.push("--accent-color:#1B5F8C")

            //Tejeduría
            this.colorList.push("--accent-color:#4CADAD")

            //Enrollado
            this.colorList.push("--accent-color:#17A589")

            //Corte
            this.colorList.push("--accent-color:#6C3483")

            //Control de Calidad
            this.colorList.push("--accent-color:#B03A2E")

            //Facturación
            this.colorList.push("--accent-color:#9A7D0A")

            //Despacho
            this.colorList.push("--accent-color:#00FF00")

        },

        //Llenamos la linea de tiempo del pedido seleccionado
        async fillTimeLineProcess(process, requestName) {

            this.refresToken();
            this.processTimeLine = [];

            await axios
                .get("http://localhost:3000/process/get/for-time-line/" + process.id,
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {

                    this.requestName = requestName;

                    for (let i = 0; i < res.data.data.length; i++) {
                        this.processTimeLine.push({ info: res.data.data[i], color: this.colorList[i] })
                    }

                    this.fixDatesAndBugs();

                    this.processTimeLine.sort((a, b) => a.info.department.process_turn - b.info.department.process_turn )

                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });
        },

        //Arreglamos las fechas para que se vean bien en la linea de tiempo
        fixDatesAndBugs() {


            for (let i = 0; i < this.processTimeLine.length; i++) {

                if (this.processTimeLine[i].info.date_in) {
                    this.processTimeLine[i].info.date_in = new Date(this.processTimeLine[i].info.date_in).toLocaleString();
                } else {
                    this.processTimeLine[i].info.date_in = "No ha entrado al departamento.";
                }

                if (this.processTimeLine[i].info.date_out) {
                    this.processTimeLine[i].info.date_out = new Date(this.processTimeLine[i].info.date_out).toLocaleString();
                } else {
                    this.processTimeLine[i].info.date_out = "No ha salido del departamento."
                }

                if(!this.processTimeLine[i].info.operator){
                    this.processTimeLine[i].info.operator = {name: "N", last_name: "/ A"}
                }

            }
        }

    },
    async created() {
        await this.fillColorList();
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
                            <th scope="col" class="center-text">Lidea de Tiempo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="process in processList" :key="process.id">
                            <th scope="row" class="center-text">{{ incrementCounter() }}</th>
                            <td class="center-text">{{ process.request.serial + process.request.characters }}</td>
                            <td class="center-text">{{ process.request.description }}</td>
                            <td class="center-text">{{ process.department.name }}</td>
                            <td class="center-text">{{ process.order.op_number }}</td>
                            <td class="center-text">
                                <button type="button" class="btn btn-outline-info"
                                    v-on:click="fillTimeLineProcess(process, process.request.serial + process.request.characters)">
                                    Mapa
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!--AQUI EMPIEZA LA LINEA DE TIEMPO-->
    <br />
    <h1 class="center-text font-weight-bold">Pedido: {{ requestName }}</h1>
    <br />
    <ul class="ul-time-line">
        <li v-for="process in processTimeLine" :key="process.id" :style="process.color">
            <div class="date">{{ process.info.department.process_turn + "." + process.info.department.name }}</div>
            <br />
            <div class="title">Fecha de ingreso: {{ process.info.date_in }}</div>
            <div class="title">Fecha de salida: {{ process.info.date_out }}</div>
            <div class="descr">
                Este pedido fue suepervisado por {{ process.info.operator.name + " " + process.info.operator.last_name }} durante {{ process.info.hours_in }} horas que el pedido estuvo en el departamento.
            </div>
        </li>
    </ul>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap");

*,
*::before,
*::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}


.ul-time-line {
    --col-gap: 2rem;
    --row-gap: 2rem;
    --line-w: 0.25rem;
    display: grid;
    grid-template-columns: var(--line-w) 1fr;
    grid-auto-columns: max-content;
    column-gap: var(--col-gap);
    list-style: none;
    width: min(60rem, 90%);
    margin-inline: auto;
}

/* line */
.ul-time-line::before {
    content: "";
    grid-column: 1;
    grid-row: 1 / span 20;
    background: rgb(225, 225, 225);
    border-radius: calc(var(--line-w) / 2);
}

/* columns*/

/* row gaps */
.ul-time-line li:not(:last-child) {
    margin-bottom: var(--row-gap);
}

/* card */
.ul-time-line li {
    grid-column: 2;
    --inlineP: 1.5rem;
    margin-inline: var(--inlineP);
    grid-row: span 2;
    display: grid;
    grid-template-rows: min-content min-content min-content;
}

/* date */
.ul-time-line li .date {
    --dateH: 3rem;
    height: var(--dateH);
    margin-inline: calc(var(--inlineP) * -1);

    text-align: center;
    background-color: var(--accent-color);

    color: white;
    font-size: 1.25rem;
    font-weight: 700;

    display: grid;
    place-content: center;
    position: relative;

    border-radius: calc(var(--dateH) / 2) 0 0 calc(var(--dateH) / 2);
}

/* date flap */
.ul-time-line li .date::before {
    content: "";
    width: var(--inlineP);
    aspect-ratio: 1;
    background: var(--accent-color);
    background-image: linear-gradient(rgba(0, 0, 0, 0.2) 100%, transparent);
    position: absolute;
    top: 100%;

    clip-path: polygon(0 0, 100% 0, 0 100%);
    right: 0;
}

/* circle */
.ul-time-line li .date::after {
    content: "";
    position: absolute;
    width: 2rem;
    aspect-ratio: 1;
    background: var(--bgColor);
    border: 0.3rem solid var(--accent-color);
    border-radius: 50%;
    top: 50%;

    transform: translate(50%, -50%);
    right: calc(100% + var(--col-gap) + var(--line-w) / 2);
}

/* title descr */
.ul-time-line li .title,
.ul-time-line li .descr {
    background: var(--bgColor);
    position: relative;
    padding-inline: 1.5rem;
}

.ul-time-line li .title {
    overflow: hidden;
    font-weight: 500;
}

.ul-time-line li .descr {
    padding-block-end: 1.5rem;
    font-weight: 300;
}

@media (min-width: 40rem) {
    .ul-time-line {
        grid-template-columns: 1fr var(--line-w) 1fr;
    }

    .ul-time-line::before {
        grid-column: 2;
    }

    .ul-time-line li:nth-child(odd) {
        grid-column: 1;
    }

    .ul-time-line li:nth-child(even) {
        grid-column: 3;
    }

    /* start second card */
    .ul-time-line li:nth-child(2) {
        grid-row: 2/4;
    }

    .ul-time-line li:nth-child(odd) .date::before {
        clip-path: polygon(0 0, 100% 0, 100% 100%);
        left: 0;
    }

    .ul-time-line li:nth-child(odd) .date::after {
        transform: translate(-50%, -50%);
        left: calc(100% + var(--col-gap) + var(--line-w) / 2);
    }

    .ul-time-line li:nth-child(odd) .date {
        border-radius: 0 calc(var(--dateH) / 2) calc(var(--dateH) / 2) 0;
    }
}

.credits {
    margin-top: 1rem;
    text-align: right;
}

.credits a {
    color: var(--color);
}
</style>