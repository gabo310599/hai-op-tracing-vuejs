<script>

////// AQUI EMPIEZA EL JS DEl DATATABLE ///////////
let dataTableProcess;
let dataTableIsInitialized = false;

const dataTableOptions = {
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
        dataTableProcess.destroy();
    }

    dataTableProcess = $("#datatable_user").DataTable(dataTableOptions);

    dataTableIsInitialized = true;
};

window.addEventListener("load", async () => {
    await initDataTable();
});

////// AQUI TERMINA EL JS DEl DATATABLE ///////////
import { userList } from '../../../../dataList';

let infoModal = [];
let counter = 1;

//Exports
export default {
    data() {
        return {
            infoModal,
            userList
        }
    },
    methods: {
        fillModalInfo(info) {
            this.infoModal = info;
        },
        incrementCounter() {
            return counter++;
        },
        resetCounter() {
            counter = 1;
        }
    }
}

</script>

<template>
    <h1 class="center-text font-weight-bold">Lista de Usuarios</h1>
    <br />

    {{ resetCounter() }}
    <div class="container my-4">
        <div class="row">
          <div class="col-sm-12 col-md-12 col-xl-12 col-md-12">
            <table id="datatable_user" class="table table-striped">
              <thead>
                <tr>
                    <th scope="col" class="center-text">#</th>
                    <th scope="col" class="center-text">Usuario</th>
                    <th scope="col" class="center-text">Nombre</th>
                    <th scope="col" class="center-text">Apellido</th>
                    <th scope="col" class="center-text">Más Información</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in userList" :key="user.key">
                    <th scope="row" class="center-text">{{ incrementCounter() }}</th>
                    <td class="center-text">{{ user.user }}</td>
                    <td class="center-text">{{ user.name }}</td>
                    <td class="center-text">{{ user.last_name }}</td>
                    <td class="center-text">
                        <button type="button" class="btn btn-outline-info" data-toggle="modal" data-target="#userModal"
                            v-on:click="fillModalInfo(user)">Información
                        </button>
                    </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    <!-- Modal -->
    <div class="modal fade" id="userModal" tabindex="-1" role="dialog" aria-labelledby="userModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title" id="userModalLabel">Más Información</h2>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="center-text">
                        <form>
                            <div class="form-group">
                                <label for="user/user_input">Usuario</label>
                                <input class="form-control" id="user/user_input" :value="infoModal.user" readonly>
                            </div>
                            <div class="form-group">
                                <label for="user/name_input">Nombres</label>
                                <input class="form-control" id="user/name_input" :value="infoModal.name" readonly>
                            </div>
                            <div class="form-group">
                                <label for="user/last_name_input">Apellidos</label>
                                <input class="form-control" id="user/last_name_input" :value="infoModal.last_name" readonly>
                            </div>
                            <div class="form-group">
                                <label for="user/last_name_input">Correo</label>
                                <input type="email" class="form-control" id="user/last_name_input" value="user@email.com"
                                    readonly>
                            </div>
                        </form>
                    </div>
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
</style>