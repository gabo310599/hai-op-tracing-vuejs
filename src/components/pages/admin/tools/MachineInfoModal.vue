<script>

import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';
import { mainRoute } from "../../../../main";

let counter = 1;
let ordersList = [];

export default {
    data() {
        return {
            counter,
            ordersList
        }
    },
    props: [
        'machineInfo'
    ],
    methods: {

        //Incrementamos el contador
        incrementCounter() {
            return counter++;
        },

        //Reiniciamos el contador
        resetCounter() {
            counter = 1;
        },

        //Metodo que decodifica el token
        getDecodedAccessToken() {
            try {
                return jwt_decode(this.getUserFromCookies());
            } catch (Error) {
                return null;
            }
        },

        //Metodo que obtiene de cookies el usuario que inicio sesion
        getUserFromCookies() {
            return Cookies.get("userLogged");
        },

        //Llenamos la lista de pedidos en esta maquina
        async fillOrderList() {

            await axios
                .get(mainRoute + "process/get/by-machine/" + this.machineInfo.id,
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {

                    this.ordersList = res.data.data;

                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });

        }

    },
    created() {
        this.fillOrderList();
    },
    watch:{
        machineInfo(){
            this.fillOrderList();
        }
    }
}

</script>

<template>
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title font-weight-bold" id="machineModalLabel">{{ machineInfo.number }}</h3>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="form-group">
                        <label for="process/serial_input">Modelo:</label>
                        <input class="form-control" id="process/serial_input" :value="machineInfo.model" readonly>
                    </div>
                    <div class="form-group">
                        <label for="process/serial_input">Marca:</label>
                        <input class="form-control" id="process/serial_input" :value="machineInfo.brand" readonly>
                    </div>
                    <div class="form-group" v-if="machineInfo.total_points > 0">
                        <label for="process/serial_input">Total Puntos Tejidos:</label>
                        <input class="form-control" id="process/serial_input" :value="machineInfo.total_points" readonly>
                    </div>
                    <div class="form-group" v-if="machineInfo.total_white_hours > 0">
                        <label for="process/serial_input">Total Horas Blancas:</label>
                        <input class="form-control" id="process/serial_input" :value="machineInfo.total_white_hours"
                            readonly>
                    </div>
                    <div class="form-group" v-if="machineInfo.total_black_hours > 0">
                        <label for="process/serial_input">Total Horas Negras:</label>
                        <input class="form-control" id="process/serial_input" :value="machineInfo.total_black_hours"
                            readonly>
                    </div>
                    <div class="form-group">
                        <label for="process/serial_input">Área:</label>
                        <input class="form-control" id="process/serial_input" :value="machineInfo.area" readonly>
                    </div>
                    <div class="form-group">
                        <label>Pedidos en la maquina:</label>
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
                                                <th scope="col" class="center-text">OP</th>
                                                <th scope="col" class="center-text">Urdido</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="order in ordersList" :key="order.id">
                                                <th scope="row" class="center-text">{{ incrementCounter() }}</th>
                                                <td class="center-text">{{order.request.serial + order.request.characters}}</td>
                                                <td class="center-text">{{order.request.description}}</td>
                                                <td class="center-text">{{order.order.op_number}}</td>
                                                <td class="center-text">{{order.order.warped}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-dismiss="modal">Salir</button>
            </div>
        </div>
    </div>
</template>