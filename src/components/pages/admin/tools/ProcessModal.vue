<script>

/*
    Tipos de proceso:
    (1)-Sin OP, sin maquinas.
    (2)-Con OP, sin maquinas.
    (3)-Con OP, con maquinas.

*/

let processModalInfo = {
    serial: null,
    description: null,
    code: null,
    date_in: null,
    days_in: null,
    operator: null,
    user: null,
    op_number: null,
    warped: null,
    width: null,
    points: null,
    machine: null
}

export default{
    data(){
        return{
            processModalInfo
        }
    },
    props:[
        'process_type',
        'modalInfo'
    ],
    methods:{
        
        //Metodo que organiza la data del modal
        fillModalInfo(data){
            console.log(data)
        }

    }
}

</script>

<template>
    {{ fillModalInfo(modalInfo) }}
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title" id="processModalLabel">Más Información</h2>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="">
                    <form>
                        <div class="form-group">
                            <label for="process/serial_input">Serial:</label>
                            <input class="form-control" id="process/serial_input" :value="processModalInfo.serial" readonly>
                        </div>
                        <div class="form-group">
                            <label for="process/description_input">Descripción:</label>
                            <input class="form-control" id="process/description_input" :value="processModalInfo.description" readonly>
                        </div>
                        <div class="form-group">
                            <label for="process/code_input">Código:</label>
                            <input class="form-control" id="process/code_input" :value="processModalInfo.code" readonly>
                        </div>
                        <div class="form-group">
                            <label for="process/date_in_input">Fecha de ingreso:</label>
                            <input class="form-control" id="process/date_in_input" :value="processModalInfo.date_in" readonly>
                        </div>
                        <div class="form-group">
                            <label for="process/days_in_input">Días en el proceso:</label>
                            <input class="form-control" id="process/days_in_input" :value="processModalInfo.days_in" readonly>
                        </div>
                        <div class="form-group">
                            <label for="process/operator_input">Nombre operador:</label>
                            <input class="form-control" id="process/operator_input" :value="processModalInfo.operator" readonly>
                        </div>
                        <div class="form-group">
                            <label for="process/user_input">Usuario:</label>
                            <input class="form-control" id="process/user_input" :value="processModalInfo.user" readonly>
                        </div>
                        <div class="form-group" v-if="process_type > 1">
                            <label for="process/op_number_input">Número OP:</label>
                            <input class="form-control" id="process/op_number_input" :value="processModalInfo.op_number" readonly>
                        </div>
                        <div class="form-group" v-if="process_type > 1">
                            <label for="process/warped_input">Urdido:</label>
                            <input class="form-control" id="process/warped_input" :value="processModalInfo.warped" readonly>
                        </div>
                        <div class="form-group" v-if="process_type > 1">
                            <label for="process/width_input">Ancho:</label>
                            <input class="form-control" id="process/width_input" :value="processModalInfo.width" readonly>
                        </div>
                        <div class="form-group" v-if="process_type > 1">
                            <label for="process/points_input">Puntos:</label>
                            <input class="form-control" id="process/points_input" :value="processModalInfo.points" readonly>
                        </div>
                        <div class="form-group" v-if="process_type === 3">
                            <label for="process/machine_input">Máquina:</label>
                            <input class="form-control" id="process/machine_input" :value="processModalInfo.machine" readonly>
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