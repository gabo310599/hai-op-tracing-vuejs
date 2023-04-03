<script>

export default {
    props:[
        'infoModal'
    ],
    data(){
        return{
        }
    },

}

</script>

<template>
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title" id="userModalLabel">Más Información</h2>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="">
                    <form>
                        <div class="form-group">
                            <label for="user/user_input">Usuario:</label>
                            <input class="form-control" id="user/user_input" :value="infoModal.user_name" readonly>
                        </div>
                        <div class="form-group">
                            <label for="user/name_input">Nombre:</label>
                            <input class="form-control" id="user/name_input" :value="infoModal.operator.name" readonly>
                        </div>
                        <div class="form-group">
                            <label for="user/last_name_input">Apellido:</label>
                            <input class="form-control" id="user/last_name_input" :value="infoModal.operator.last_name" readonly>
                        </div>
                        <div class="form-group">
                            <label for="user/roles_input">Roles:</label>
                            <input  class="form-control" id="user/roles_input" :value="infoModal.roles"
                                readonly>
                        </div>
                        <div class="form-group">
                            <label for="user/status_input">Activo:</label>
                            <input class="form-control" id="user/status_input" :value="infoModal.status"
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
</template>