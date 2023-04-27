<script>

import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';

////// AQUI EMPIEZA EL JS DEl DATATABLE ///////////

let dataTableOrder;

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

    dataTableOrder = $("#datatable_order_observation").DataTable(dataTableOrderOptions);
    console.log(dataTableOrder)
};

////// AQUI TERMINA EL JS DEl DATATABLE ///////////

let counter = 0;

export default{
    data(){
        return{
            counter
        }
    },
    created(){
        initDataTable();
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
            return Cookies.get("userLoggedOperator");
        },

    }
}

</script>

<template>

    <br/>
    <h1 class="font-weight-bold">Observaciones:</h1>

    <br/>
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
                            <th scope="col" class="center-text">Observaciones</th>
                            <th scope="col" class="center-text">Guardar Cambios</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row" class="center-text">{{incrementCounter()}}</th>
                            <td class="center-text">HOLA</td>
                            <td class="center-text">HOLA</td>
                            <td class="center-text">
                                <input type="text" size="50" maxlength="500">
                            </td>
                            <td class="center-text">
                                <button button type="button" class="btn btn-outline-success">
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