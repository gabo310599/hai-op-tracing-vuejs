<script>

////// AQUI EMPIEZA EL JS DEl DATATABLE ///////////
let dataTableProcess;
let dataTableHistory;
let dataTableIsInitialized = false;

const dataTableOptions = {
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

  dataTableProcess = $("#datatable_process_print_op").DataTable(dataTableOptions);
  dataTableHistory = $("#datatable_history_print_op").DataTable(dataTableOptions);

  dataTableIsInitialized = true;
};

window.addEventListener("load", async () => {
  await initDataTable();
});

////// AQUI TERMINA EL JS DEl DATATABLE ///////////
import ProcessModalInfo from '../tools/ProcessModalInfo.vue'
import TimeLine from '../tools/TimeLine.vue';
import { opListFinal } from '../../../../dataList';

let counter = 1;
let opSelected = [];
let opListProcess = [];
let opListHistory = [];
let infoModalProcess = [];
let flag = true;

//Llenamos la lista de proceso
const fillProcessList = () => {

  if (flag) {
    opListFinal.map(function (op) {
      if (op.department_number == 4)
        opListProcess.push(op);
    });
  };

}

//Llenamos la lista de historial
const fillHistoryList = () => {

  if (flag) {
    opListFinal.map(function (op) {
      if (op.department_number > 4)
        opListHistory.push(op);
    });
  }
}

//Exports
export default {
  props: [
    'opList',
    'userList'
  ],
  data() {
    return {
      counter,
      opSelected,
      opListProcess,
      opListHistory,
      infoModalProcess
    }
  },
  methods: {
    incrementCounter() {
      return counter++;
    },
    resetCounter() {
      counter = 1;
    },
    fillSelectedOp(op) {
      this.opSelected = op;
    },
    fillLists() {
      fillProcessList();
      fillHistoryList();
      flag = false;
    },
    fillModalInfo(info) {
      this.infoModalProcess = info;
    },
  },
  components: {
    TimeLine,
    ProcessModalInfo
  }
}

</script>

<template>
  {{ fillLists() }}
  <h1 class="center-text font-weight-bold">Imprimir OP</h1>
  <h2 class="font-weight-bold">En Proceso:</h2>

  <!--PROCESO-->
  {{ resetCounter() }}
  <div class="container my-4">
    <div class="row">
      <div class="col-sm-12 col-md-12 col-xl-12 col-md-12">
        <table id="datatable_process_print_op" class="table table-striped">
          <thead>
            <tr>
              <th scope="col" class="center-text">#</th>
              <th scope="col" class="center-text">Nro. OP</th>
              <th scope="col" class="center-text">Descripción</th>
              <th scope="col" class="center-text">Fecha de Ingreso</th>
              <th scope="col" class="center-text">Días en Proceso</th>
              <th scope="col" class="center-text">Operario</th>
              <th scope="col" class="center-text">Más Información</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="op in opListProcess" :key="op.key">
              <th scope="row" class="center-text">{{ incrementCounter() }}</th>
              <td class="center-text">{{ op.number }}</td>
              <td class="center-text">{{ op.description }}</td>
              <td class="center-text">{{ op.date_in }}</td>
              <td class="center-text">{{ op.days }}</td>
              <td class="center-text">{{ op.operator_user }}</td>
              <td class="center-text">
                <button type="button" class="btn btn-outline-info" data-toggle="modal" data-target="#processModal"
                  v-on:click="fillModalInfo(op)">Información</button>
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
        <table id="datatable_history_print_op" class="table table-striped">
          <thead>
            <tr>
              <th scope="col" class="center-text">#</th>
              <th scope="col" class="center-text">Nro. OP</th>
              <th scope="col" class="center-text">Descripción</th>
              <th scope="col" class="center-text">Fecha de Ingreso</th>
              <th scope="col" class="center-text">Fecha de Salida</th>
              <th scope="col" class="center-text">Operario</th>
              <th scope="col" class="center-text">Linea de Tiempo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="op in opListHistory" :key="op.key">
              <th scope="row" class="center-text">{{ incrementCounter() }}</th>
              <td class="center-text">{{ op.number }}</td>
              <td class="center-text">{{ op.description }}</td>
              <td class="center-text">{{ op.date_in }}</td>
              <td class="center-text">{{ op.date_out }}</td>
              <td class="center-text">{{ op.operator_user }}</td>
              <td class="center-text">
                <button type="button" class="btn btn-outline-info" data-toggle="modal" data-target="#timeLineModal"
                  v-on:click="fillSelectedOp(op)">Tracing
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Modal Historial -->
  <div class="modal fade" id="timeLineModal" tabindex="-1" role="dialog" aria-labelledby="timeLineModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title" id="timeLineModalLabel">Tracing</h2>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <TimeLine :opSelected="opSelected" />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-dismiss="modal">Salir</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Process -->
  <div class="modal fade" id="processModal" tabindex="-1" role="dialog" aria-labelledby="processModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title" id="processModalLabel">Más Información</h2>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <ProcessModalInfo :infoModalProcess="infoModalProcess" />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-dismiss="modal">Salir</button>
        </div>
      </div>
    </div>
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