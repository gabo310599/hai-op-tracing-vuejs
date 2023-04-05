<script>

/*
    Tipos de proceso:
    (1)-Sin OP, sin maquinas.
    (2)-Con OP, sin maquinas.
    (3)-Con OP, con maquinas.

*/

import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';

let processModalInfo = {
    id: null,
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

export default {
    data() {
        return {
            processModalInfo
        }
    },
    props: [
        'process_type',
        'modalInfo'
    ],
    methods: {

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

        //Metodo que organiza la data del modal
        async fillModalInfo() {

            processModalInfo = {
                id: null,
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

            //Obtenemos el id del proceso
            this.processModalInfo.id = this.modalInfo.id;

            //Obtenemos el serial del pedido
            if (this.modalInfo.request.characters)
                this.processModalInfo.serial = this.modalInfo.request.serial + this.modalInfo.request.characters;
            else
                this.processModalInfo.serial = this.modalInfo.request.serial;

            //Obtenemos la descripcion del pedido
            this.processModalInfo.description = this.modalInfo.request.description;

            //Obtenemos el codigo del pedido
            this.processModalInfo.code = this.modalInfo.request.code;

            //Obtenemos la fecha de ingreso del proceso
            this.processModalInfo.date_in = this.modalInfo.date_in;

            //Obtenemos la cantidad de dias que lleva el proceso activo
            this.processModalInfo.days_in = this.modalInfo.days_in;

            //Obtenemos el nombre del operador
            this.processModalInfo.operator = this.modalInfo.operator.name + " " + this.modalInfo.operator.last_name;

            //Obtenemos el usuario del operador
            await axios
                .get("http://localhost:3000/user/get-by-operator/"+this.modalInfo.operator.id,
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    this.processModalInfo.user = res.data.data.user_name;
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });
            
            //Obtenemos la info de la op (si existe)
            if(this.modalInfo.order){
                
                //Numero de op
                this.processModalInfo.op_number = this.modalInfo.order.op_number;

                //Urdido
                this.processModalInfo.warped = this.modalInfo.order.warped;

                //Ancho
                this.processModalInfo.width = this.modalInfo.order.width;

                //Points
                this.processModalInfo.points = this.modalInfo.order.points;

            }

            //Obtenemos la info de la maquina (si existe)
            if(this.modalInfo.machine){

                //Nombre de la maquina
                this.processModalInfo.machine = this.modalInfo.machine.name;
                
            }



        }

    }
}

</script>

<template>
    {{ fillModalInfo() }}
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
                            <input class="form-control" id="process/description_input" :value="processModalInfo.description"
                                readonly>
                        </div>
                        <div class="form-group">
                            <label for="process/code_input">Código:</label>
                            <input class="form-control" id="process/code_input" :value="processModalInfo.code" readonly>
                        </div>
                        <div class="form-group">
                            <label for="process/date_in_input">Fecha de ingreso:</label>
                            <input class="form-control" id="process/date_in_input" :value="processModalInfo.date_in"
                                readonly>
                        </div>
                        <div class="form-group">
                            <label for="process/days_in_input">Días en el proceso:</label>
                            <input class="form-control" id="process/days_in_input" :value="processModalInfo.days_in"
                                readonly>
                        </div>
                        <div class="form-group">
                            <label for="process/operator_input">Nombre operador:</label>
                            <input class="form-control" id="process/operator_input" :value="processModalInfo.operator"
                                readonly>
                        </div>
                        <div class="form-group">
                            <label for="process/user_input">Usuario:</label>
                            <input class="form-control" id="process/user_input" :value="processModalInfo.user" readonly>
                        </div>
                        <div class="form-group" v-if="process_type > 1">
                            <label for="process/op_number_input">Número OP:</label>
                            <input class="form-control" id="process/op_number_input" :value="processModalInfo.op_number"
                                readonly>
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
                            <input class="form-control" id="process/machine_input" :value="processModalInfo.machine"
                                readonly>
                        </div>
                    </form>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-dismiss="modal">Salir</button>
        </div>
    </div>
</div></template>