<script>

////// AQUI EMPIEZA EL JS DEl DATATABLE ///////////
let dataTableProcess;
let dataTableCheckInProcess;
let dataTableIsInitialized = false;

const dataTableProcessOptions = {
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

const dataTableCheckInProcessOptions = {
  //scrollX: "2000px",
  lengthMenu: [5, 10, 15, 20, 25],

  // Centrado de datos dentro de la columna
  columnDefs: [
    {
      className: "centered",
      targets: [0, 1, 2],
    },
    {
      orderable: false,
      targets: [],
    },
    {
      searchable: false,
      targets: [],
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
    dataTableCheckInProcess.destroy();
  }

  dataTableProcess = $("#datatable_process_weaving").DataTable(dataTableProcessOptions);
  dataTableCheckInProcess = $("#datatable_process_check_in_weaving").DataTable(dataTableCheckInProcessOptions);

  dataTableIsInitialized = true;
};

////// AQUI TERMINA EL JS DEl DATATABLE ///////////

import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';
import ProcessModal from '../tools/ProcessModal.vue';
import MachineInfoModal from '../tools/MachineInfoModal.vue';
import { mainRoute } from "../../../../main";

const process_type = 3;
let checkInProcesses = [];
let machineList = [];
let counter = 1;
let processList = [];
let department = {
  id: null,
  name: null,
  days_time_limit: null
};
let modalInfo = {};
let machineInfo = {};
let blackMachinesList = [];
let whiteMachinesList = [];

//Metodo que determina el delay de un pedido
const delayColor = (date_in, days_time_limit) => {

  const today = new Date();
  const difference = today.getTime() - date_in.getTime();
  const differenceInDays = difference / 1000 / 60 / 60 / 24;

  if (differenceInDays > parseFloat(days_time_limit))
    return "right badge-pill badge-danger"
  else
    return "right badge-pill badge-success"

}

//Exports
export default {
  data() {
    return {
      processList,
      department,
      process_type,
      modalInfo,
      modalProcess: false,
      machineList,
      checkInProcesses,
      machineInfo,
      machineModal: false,
      blackMachinesList,
      whiteMachinesList
    }
  },
  methods: {

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
        .post(mainRoute + "department/get/by-name",
          { name: "Tejeduría" },
          { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
        )
        .then((res) => {
          this.department.id = res.data.data.id;
          this.department.name = res.data.data.name;
          this.department.days_time_limit = res.data.data.days_time_limit;
        })
        .catch((error) => {
          console.log(error.message);
          alert("Error: " + error.response.data.message);
        });
    },

    //Metodo que llena las lista de procesos activos e historial.
    async fillLists() {
      await axios
        .get(mainRoute + "process/by-department/" + this.department.id,
          { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
        )
        .then((res) => {

          const processList = [];

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
              if (row.date_out) {
                date_in_format = new Date(row.date_out).toLocaleString();
                process.date_out = date_in_format;
              }
              process.color_badge = delayColor(new Date(row.date_in), days_time_limit);
              let today = new Date();
              let difference = today.getTime() - new Date(row.date_in).getTime();
              process.days_in = (difference / 1000 / 60 / 60 / 24).toFixed(2);
              processList.push(process);
            }

          });

          this.processList = processList;

        })
        .catch((error) => {
          console.log(error.message);
          alert("Error: " + error.response.data.message);
        });

    },

    //Metodo que llena la informacion del modal
    fillModalInfo(data) {
      this.modalInfo = data;
      this.modalProcess = true;
      this.refresToken();
    },

    //Metodo que obtiene todas las maquinas de un departamento
    async fillMachineList() {

      await axios
        .get(mainRoute + "machine/get/by-department/" + this.department.id,
          { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
        )
        .then((res) => {
          this.machineList = res.data.data;
          this.machineList.sort((x, y) => x.number.localeCompare(y.number));

          for (let i = 0; i < this.machineList.length; i++) {
            if (this.machineList[i].warped_color === "negro")
              this.blackMachinesList.push(this.machineList[i])
            else
              if (this.machineList[i].warped_color === "blanco")
                this.whiteMachinesList.push(this.machineList[i])
          }

          this.blackMachinesList.sort((x, y) => x.number.localeCompare(y.number));
          this.whiteMachinesList.sort((x, y) => x.number.localeCompare(y.number));
        })
        .catch((error) => {
          console.log(error.message);
          alert("Error: " + error.response.data.message);
        });

    },

    //Metodo que obtiene la lista de procesos en espera para entrar a un departamento.
    async fillCheckInProcesses() {

      await axios
        .get(mainRoute + "process/list/check-in/" + this.department.id,
          { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
        )
        .then((res) => {
          this.checkInProcesses = res.data.data;
        })
        .catch((error) => {
          console.log(error.message);
          alert("Error: " + error.response.data.message);
        });

    },

    //Metodo que llena la informacion de la maquina elegida.
    async fillMachineInfoModal(machine) {
      this.refresToken();
      this.machineInfo = machine;
      this.machineModal = true;
    },

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

  },
  components: {
    ProcessModal,
    MachineInfoModal
  },
  async created() {
    await this.verifyToken();
    await this.getDepartmentInfo();
    await this.fillLists();
    await this.fillMachineList();
    await this.fillCheckInProcesses();
    await initDataTable();
  }
}

</script>

<template>
  <h1 class="center-text font-weight-bold">Tejeduría</h1>

  <h2 class="font-weight-bold">Maquinas:</h2>
  <div class="admin-machine-container">

    <!-- <div class="grid-item" v-for="machine in machineList" :key="machine.id">
      <span class="fa-regular fa-square-minus span-style" data-toggle="modal" data-target="#machineModal" v-on:click="fillMachineInfoModal(machine)">
        {{ " " + machine.number }}
      </span>
    </div> -->

    <div class="black-grid-item" v-for="machine in blackMachinesList" :key="machine.id">
      <span class="fa-regular fa-square-minus span-style" data-toggle="modal" data-target="#machineModal"
        v-on:click="fillMachineInfoModal(machine)">
        {{ " " + machine.number }}
      </span>
    </div>

    <div class="white-grid-item" v-for="machine in whiteMachinesList" :key="machine.id">
      <span class="fa-regular fa-square-minus span-style" data-toggle="modal" data-target="#machineModal"
        v-on:click="fillMachineInfoModal(machine)">
        {{ " " + machine.number }}
      </span>
    </div>

  </div>


  <!--PROCESO-->
  <br />
  <h2 class="font-weight-bold">En Proceso:</h2>
  {{ resetCounter() }}
  <div class="container my-4">
    <div class="row">
      <div class="col-sm-12 col-md-12 col-xl-12 col-md-12">
        <table id="datatable_process_weaving" class="table table-striped">
          <thead>
            <tr>
              <th scope="col" class="center-text">#</th>
              <th scope="col" class="center-text">Pedido</th>
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
              <td class="center-text">{{ process.request.serial + process.request.characters }}</td>
              <td class="center-text">{{ process.order.op_number }}</td>
              <td class="center-text">{{ process.request.description }}</td>
              <td class="center-text">{{ process.date_in }}</td>
              <td class="center-text">{{ process.operator.name + " " + process.operator.last_name }}</td>
              <td class="center-text">
                <button type="button" class="btn btn-outline-info" data-toggle="modal" data-target="#processModal"
                  v-on:click="fillModalInfo(process)">
                  Información
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!--ESPERANDO ENTRADA-->
  <br />
  <h2 class="font-weight-bold">Esperando Entrada:</h2>
  {{ resetCounter() }}
  <div class="container my-4">
    <div class="row">
      <div class="col-sm-12 col-md-12 col-xl-12 col-md-12">
        <table id="datatable_process_check_in_weaving" class="table table-striped">
          <thead>
            <tr>
              <th scope="col" class="center-text">#</th>
              <th scope="col" class="center-text">Pedido</th>
              <th scope="col" class="center-text">Descripción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="process in checkInProcesses" :key="process.id">
              <th scope="row" class="center-text"><span :class="process.color_badge">{{ incrementCounter() }}</span></th>
              <td class="center-text">{{ process.request.serial + process.request.characters }}</td>
              <td class="center-text">{{ process.request.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Process Modal -->
  <div class="modal fade" id="processModal" tabindex="-1" role="dialog" aria-labelledby="processModalLabel"
    aria-hidden="true" v-if="modalProcess">
    <ProcessModal :process_type="process_type" :modalInfo="modalInfo" />
  </div>

  <!-- Machine Modal -->
  <div class="modal fade" id="machineModal" tabindex="-1" role="dialog" aria-labelledby="machineModalLabel"
    aria-hidden="true" v-if="machineModal">
    <MachineInfoModal :machineInfo="machineInfo" />
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

.admin-machine-container {
  display: grid;
  grid-template-columns: repeat(3, 200px);
  grid-gap: 5px;
  grid-auto-rows: minmax(50px, auto);
  position: static;
  top: 50%;
  left: 50%;
  transform: translate(30%, 3%);
  height: fit-content;
  width: 700px;
  margin-left: 1%;
  grid-template-rows: repeat(3, 40px);
}

.grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0.2em;
  border-radius: 35px;
  border-color: black;
  border-width: 5px;
  border-style: solid;
  background-color: powderblue;
}

.black-grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0.2em;
  border-radius: 35px;
  border-color: black;
  color: white;
  border-width: 5px;
  border-style: solid;
  background-color: #272626;
}

.white-grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0.2em;
  border-radius: 35px;
  border-color: black;
  border-width: 5px;
  border-style: solid;
  background-color: rgb(228, 221, 221);
}

.grid-item:hover {
  background-color: rgb(23, 159, 177);
}

.black-grid-item:hover {
  background-color: black;
}

.white-grid-item:hover {
  background-color: white;
}

.span-style {
  text-align: center;
  font-size: large;
  width: 300px;
  height: 43px;
  object-fit: fill;
}
</style>