<script>

import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';
import { mainRoute } from "../../../../main";

////// AQUI EMPIEZA EL JS DEl DATATABLE ///////////

let dataTableProcess;

const dataTableProcessOptions = {
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

  dataTableProcess = $("#datatable_process_observation").DataTable(dataTableProcessOptions);

};

////// AQUI TERMINA EL JS DEl DATATABLE ///////////

let departmentOption = "";
let departmentList = [];
let processesList = [];
let counter = 1;
let observation = "";

export default{
    data(){
        return{
            departmentOption,
            departmentList, 
            counter,
            processesList,
            observation
        }
    },
    methods:{

        //Incrementamos el contador
        incrementCounter() {
            return counter++;
        },

        //Reiniciamos el contador
        resetCounter() {
            counter = 1;
        },

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

        //Metodo que obtiene la lista de departamentos.
        async fillDepartmentList(){

            await axios
                .get(mainRoute + "department",
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {

                    this.departmentList = res.data.data;
                    this.departmentList.sort((a, b) => a.process_turn - b.process_turn );

                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });

        },

        //Metodo que guarda la observacion del proceso
        async saveObservation(process){

            this.refresToken();

            if(document.getElementById(process.id).value.length <= 0)
                return

            await axios
                .put(mainRoute + "process/" + process.id,
                    { observation: document.getElementById(process.id).value },
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    alert("Observación guardada con exito.");
                    this.createLog("Se ha creado una observación para el proceso: " + process.id)
                    window.location.reload();
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });
        },

        //Metodo que obtiene los procesos terminados de un departamento
        async fillProcessesList(department_id){
            
            await axios
                .get(mainRoute + "process/get/complete-by-department/" + department_id,
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {

                    this.processesList = res.data.data;

                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });

                initDataTable();
    
        }

    },
    async created(){
        await this.fillDepartmentList();
        initDataTable();
    },
    watch:{
        departmentOption(){
            dataTableProcess.destroy();
            this.refresToken();
            this.fillProcessesList(this.departmentOption);
        }
    }
}

</script>

<template>
    <div class="observation-container">

        <h3 class="font-weight-bold title-style">Observaciones:</h3>

        <form>
            <div class="form-group">
                <label for="machine/department_input">Departamento:</label>
                <select class="form-select" aria-label="Default select example" id="machine/department_input" v-model="departmentOption">
                    <option v-for="department in departmentList" :key="department.id" :value="department.id">{{department.name}}</option>
                </select>
            </div>
            <div class="form-group">

                <br/>
                {{ resetCounter() }}
                <div class="container my-4">
                    <div class="row">
                        <div class="col-sm-12 col-md-12 col-xl-12 col-md-12">
                            <table id="datatable_process_observation" class="table table-hover">
                                <thead class="thead-dark">
                                    <tr>
                                        <th scope="col" class="center-text">#</th>
                                        <th scope="col" class="center-text">Pedido</th>
                                        <th scope="col" class="center-text">Descripción</th>
                                        <th scope="col" class="center-text">Observaciones</th>
                                        <th scope="col" class="center-text">Guardar Cambios</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="row in processesList" :key="row.id">
                                        <th scope="row" class="center-text">{{incrementCounter()}}</th>
                                        <td class="center-text">{{row.request.serial + row.request.characters}}</td>
                                        <td class="center-text">{{row.request.description}}</td>
                                        <td class="center-text">
                                            <input type="text" :id="row.id" size="50" maxlength="500">
                                        </td>
                                        <td class="center-text">
                                            <button button type="button" class="btn btn-outline-success" v-on:click="saveObservation(row)">
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
        </form>

    </div>
    <br/>
    
</template>

<style>

.observation-container{
    position:relative;
    top: 50%;
    left: 50%;
    transform:  translate(-51%, 3%);
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