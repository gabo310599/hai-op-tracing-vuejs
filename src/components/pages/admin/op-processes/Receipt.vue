<script>

////// AQUI EMPIEZA EL JS DEl DATATABLE ///////////
let dataTableProcess;
let dataTableHistory;
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

const dataTableHistoryOptions = {
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
      targets: [6],
    },
    {
      searchable: false,
      targets: [6],
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
    dataTableHistory.destroy();
  }

  dataTableProcess = $("#datatable_process_graphic_design").DataTable(dataTableProcessOptions);
  dataTableHistory = $("#datatable_history_graphic_design").DataTable(dataTableHistoryOptions);

  dataTableIsInitialized = true;
};

////// AQUI TERMINA EL JS DEl DATATABLE ///////////

import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';
import ProcessModal from '../tools/ProcessModal.vue'
import TimeLine from '../tools/TimeLine.vue';

const process_type = 1;
let counter = 1;
let processList = [];
let historyList = [];
let department = {
  id: null,
  name: null,
  days_time_limit: null
};
let modalInfo = {};
  
  //Metodo que determina el delay de un pedido
  const delayColor = (date_in, days_time_limit) => {

      const today = new Date();
      const difference = today.getTime() - date_in.getTime();
      const differenceInDays = difference / 1000 / 60 / 60 / 24;

      if(differenceInDays > parseFloat(days_time_limit))
        return "right badge-pill badge-danger"
      else
        return "right badge-pill badge-success"

    }

//Exports
export default {
  data() {
    return {
      historyList,
      processList,
      department,
      process_type,
      modalInfo,
      modalProcess: false,
      modalHistory: false
    }
  },
  methods: {

    incrementCounter() {
      return counter++;
    },

    resetCounter() {
      counter = 1;
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

    //Metodo que obtiene los datos del departamento
    async getDepartmentInfo() {

      await axios
        .post("http://localhost:3000/department/get/by-name",
            { name: "Facturación" },
            { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
        )
        .then((res) => {
          this.department.id = res.data.data.id;
          this.department.name = res.data.data.name;
          this.department.days_time_limit = res.data.data.days_time_limit;

          console.log(this.department)
        })
        .catch((error) => {
          console.log(error.message);
          alert("Error: " + error.response.data.message);
        });
    },

    //Metodo que llena las lista de procesos activos e historial.
    async fillLists() {
      await axios
        .get("http://localhost:3000/process/by-department/" + this.department.id,
          { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
        )
        .then((res) => {

          const processList = [];
          const historyList = [];

          const days_time_limit = this.department.days_time_limit;

          res.data.data.map(function (row) {

            let process = {
              id: null,
              date_in: null,
              hours_in: null,
              operator: null,
              request: null,
              machine: null,
              order: null,
              date_out: null,
              color_badge: null,
              days_in: null
            }

            //Llenamos los datos de la lista con procesos activos
            if (!row.date_out) {
              process.id = row.id;
              let date_in_format = new Date(row.date_in).toLocaleString();
              process.date_in = date_in_format;
              process.operator = row.operator;
              process.request = row.request;
              process.machine = row.machine;
              process.order = row.order;
              if(row.date_out){
                date_in_format = new Date(row.date_out).toLocaleString();
                process.date_out = date_in_format;
              }
              process.color_badge = delayColor(new Date(row.date_in), days_time_limit);
              let today = new Date();
              let difference = today.getTime() - new Date(row.date_in).getTime();
              process.days_in = (difference / 1000 / 60 / 60 / 24).toFixed(2);
              processList.push(process);
            }

            //Llenamos los datos de la lista de historial
            else {
              historyList.push(row);
            }
          });

          this.processList = processList;
          this.historyList = historyList;

        })
        .catch((error) => {
          console.log(error.message);
          alert("Error: " + error.response.data.message);
        });

    },

    //Metodo que llena la informacion del modal
    fillModalInfo(data){
      this.modalInfo = data;
      this.modalProcess = true;
    }

  },
  components: {
    TimeLine,
    ProcessModal
  },
  async created() {
    await this.getDepartmentInfo();
    await this.fillLists();
    await initDataTable();
  }
}

</script>

<template>
  <h1 class="center-text font-weight-bold">Facturación</h1>
  <h2 class="font-weight-bold">En Proceso:</h2>

  <!--PROCESO-->
  {{ resetCounter() }}
  <div class="container my-4">
    <div class="row">
      <div class="col-sm-12 col-md-12 col-xl-12 col-md-12">
        <table id="datatable_process_graphic_design" class="table table-striped">
          <thead>
            <tr>
              <th scope="col" class="center-text">#</th>
              <th scope="col" class="center-text">Número OP</th>
              <th scope="col" class="center-text">Descripción</th>
              <th scope="col" class="center-text">Fecha de Ingreso</th>
              <th scope="col" class="center-text">Operador</th>
              <th scope="col" class="center-text">Más Información</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="process in processList" :key="process.id">
              <th scope="row" class="center-text"><span :class="process.color_badge">{{ incrementCounter() }}</span></th>
              <td class="center-text">{{ process.order.op_number }}</td>
              <td class="center-text">{{ process.request.description }}</td>
              <td class="center-text">{{ process.date_in }}</td>
              <td class="center-text">{{ process.operator.name + " " + process.operator.last_name }}</td>
              <td class="center-text">
                <button type="button" class="btn btn-outline-info" data-toggle="modal" data-target="#processModal" v-on:click="fillModalInfo(process)">
                  Información
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <br />

  <!--HISTORIAL-->
  {{ resetCounter() }}
  <h2 class="font-weight-bold">Historial: </h2>
  <div class="container my-4">
    <div class="row">
      <div class="col-sm-12 col-md-12 col-xl-12 col-md-12">
        <table id="datatable_history_graphic_design" class="table table-striped">
          <thead>
            <tr>
              <th scope="col" class="center-text">#</th>
              <th scope="col" class="center-text">Número OP</th>
              <th scope="col" class="center-text">Descripción</th>
              <th scope="col" class="center-text">Fecha de Salida</th>
              <th scope="col" class="center-text">Días en Proceso</th>
              <th scope="col" class="center-text">Operador</th>
              <th scope="col" class="center-text">Linea de Tiempo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" class="center-text">{{ incrementCounter() }}</th>
              <td class="center-text">serial</td>
              <td class="center-text">descripcion</td>
              <td class="center-text">fecha</td>
              <td class="center-text">dias</td>
              <td class="center-text">usuario</td>
              <td class="center-text">
                <button type="button" class="btn btn-outline-info">
                  Tracing
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Process Modal -->
  <div class="modal fade" id="processModal" tabindex="-1" role="dialog" aria-labelledby="processModalLabel" aria-hidden="true" v-if="modalProcess">
    <ProcessModal  :process_type="process_type" :modalInfo="modalInfo"/>
  </div>

  <!-- History Modal -->
  <div class="modal fade" id="historyModal" tabindex="-1" role="dialog" aria-labelledby="historyModalLabel" aria-hidden="true" v-if="modalHistory">
    <TimeLine />
  </div>

</template>

<style>
.center-text {
  text-align: center;
}

.centered {
  text-align: center !important;
  vertical-align: middle !important;
}
</style>