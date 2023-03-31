<script>

import Cookies from "js-cookie";
import axios from "axios";
import { isGloballyWhitelisted } from "@vue/shared";

let process_id = "";
let process = {}

export default{
    data(){
        return{
            process_id,
            process
        }
    },
    props:[
        "procces_id"
    ],
    methods:{
        
        //Metodo que llena la informacion del modal
        fillModalInfo(proccess_id){

            if(proccess_id){
                this.proccess_id = proccess_id;
                this.getProcessInfo();
            }
        },

        //Metodo que obtiene de cookies el usuario que inicio sesion
        getUserFromCookies(){
            return Cookies.get("userLogged");
        },

        //Metodo que decodifica el token
        getDecodedAccessToken() {
            try {
                return jwt_decode(this.getUserFromCookies());
            } catch(Error) {
                return null;
            }
        },

        //Metodo que obtiene la data del proceso en la base de datos
        async getProcessInfo(){
            await axios
            .get("http://localhost:3000/process/"+this.procces_id,
                {headers: { Authorization: `Bearer ${this.getUserFromCookies()}` }}
            )
            .then((res) => {
                console.log(res.data.data)
            })
            .catch((error) => {
                console.log(error.message);
                alert("Error: "+error.response.data.message);
            });
        }
    }
}

</script>

<template>

    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title font-weight-bold" id="DashboardModalLabel">Departamento</h2>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div>
                    <form>
                        <div class="form-group">
                            <label for="dashboard/request_input">Pedido:</label>
                            <input class="form-control" id="dashboard/request_input" readonly>
                        </div>
                        <div class="form-group">
                            <label for="dashboard/description_input">Descripción:</label>
                            <input class="form-control" id="dashboard/description_input" readonly>
                        </div>
                        <div class="form-group">
                            <label for="dashboard/order_input">Orden de producción:</label>
                            <input type="password" class="form-control" id="dashboard/order_input" readonly>
                        </div>
                        <div class="form-group">
                            <label for="dashboard/date_in_input">Fecha de ingreso:</label>
                            <input class="form-control" id="dashboard/date_in_input" readonly>
                        </div>
                        <div class="form-group">
                            <label for="dashboard/operator_input">Operario:</label>
                            <input type="password" class="form-control" id="dashboard/operator_input" readonly>
                        </div>
                        <div class="form-group">
                            <label for="dashboard/machine_input">Maquina:</label>
                            <input type="password" class="form-control" id="dashboard/machine_input" readonly>
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