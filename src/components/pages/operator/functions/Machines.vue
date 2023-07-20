<script>

import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';
import { mainRoute } from "../../../../main";

let departmentOption = "";
let opOption = "";
let department_id = "";
let opList = [];
let machineList = [];
let processList = [];

export default{
    data(){
        return{
            departmentOption,
            opOption,
            opList,
            machineList,
            processList,
            department_id
        }
    },
    methods:{

        //Metodo de refresh token
        async refreshToken(){    
            await axios
                .get(mainRoute + "auth/refresh",
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
                .post(mainRoute + "log",
                    { user_id: this.getDecodedAccessToken().sub, log: msg },
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

        //Metodo que obtiene los procesos del departamento seleccionado
        async getProcessInDepartment(){

            this.refreshToken();

            //Obtenemos el id del departamento seleccionado
            await axios
                .post(mainRoute + "department/get/by-name/",
                    { name: this.departmentOption },
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    this.department_id = res.data.data.id;
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });

            //Obtenemos la lista de procesos activos en ese departamento.
            await axios
                .get(mainRoute + "process/get/process-without-machine/"+ this.department_id,
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    this.processList = res.data.data;
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });

            //Verificamos si se eligio tejeduria o no
            if(this.departmentOption != "Tejeduría"){

                
                //Obtenemos la lista de maquinas en el departamento
                let machineArray = []
                await axios
                    .get(mainRoute + "machine/get/by-department/"+ this.department_id,
                        { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                    )
                    .then((res) => {
                        
                        res.data.data.map(function (row){
                            machineArray.push(row)
                        })

                        this.machineList = machineArray;
                        this.machineList.sort((x, y) => x.number.localeCompare(y.number));
                        
                    })
                    .catch((error) => {
                        console.log(error.message);
                        alert("Error: " + error.response.data.message);
                    });
                
                //Llenamos la lista de op
                let opArray = [];
                this.processList.map(function (row){
                    opArray.push(row.order)
                })
                this.opList = opArray;

            }else{
                this.machineList = [];
                                
                //Llenamos la lista de op                
                let opArray = [];
                this.processList.map(function (row){
                    opArray.push(row.order)
                })
                this.opList = opArray;
            }
        },

        //En caso de ser tejeduria el departamento, se ejecuta este metodo para llenar lista de maquinas
        async fillWeavingMachines(){

            let warpedSelection = ""
            let opOption = this.opOption;

            //Ubicamos la op elegida y obtenemos su urdido
            this.opList.map( function(row){
                if(row.id === opOption){
                    warpedSelection = row.warped
                }
            })

            //Llenamos la lista de maquinas con las que correspondan a ese urdido
            let machineArray = []
                await axios
                    .get(mainRoute + "machine/get/by-warped/" + warpedSelection,
                        { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                    )
                    .then((res) => {
                        
                        res.data.data.map(function (row){
                            machineArray.push(row)
                        })

                        this.machineList = machineArray;
                        this.machineList.sort((x, y) => x.number.localeCompare(y.number));
                        
                    })
                    .catch((error) => {
                        console.log(error.message);
                        alert("Error: " + error.response.data.message);
                    });

        },

        //Metodo que asocia una maquina con un proceso
        async assignMachineToProcess(){
            
            let process_id = "";
            let machine_id = "";
            let order_id = "";

            //Obtenemos el id de la maquina a asociar
            this.machineList.map( function (row){
                if(row.id === document.getElementById("machine/machine_input").value)
                    machine_id = row.id;
            });

            //Obtenemos el id de la orden a asociar
            this.opList.map( function (row){
                if(row.id === document.getElementById("machine/order_input").value)
                    order_id = row.id;
            });

            //Obtenemos el id del proceso
            this.processList.map( function (row){
                if(row.order.id === order_id)
                    process_id = row.id;
            });

            //Verificamos que tenemos los datos necesarios.
            if( (process_id.length <= 0) || (order_id.length <= 0) || (machine_id.length <= 0) ){
                alert("Por favor llenar todos los campos.");
                return;
            }

            //Actualizamos el registro
            await axios
                .put(mainRoute + "process/" + process_id,
                    { machine_id: machine_id },
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    alert("Asociación aplicada exitosamente.")
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });

                //this.createLog("Se ha asociado la maquina " + machine_id + "con el proceso " + process_id);

                if(document.getElementById("machine/department_input").value === "Tejeduría")
                    await this.assignPoints(process_id)

                window.location.reload();
        },

        //Asignamos los puntos a la maquina asociada si se encuentra en tejeduria.
        async assignPoints(process_id){

            let process;
            let total_points = 0;

            //Obtenemos el proceso
            await axios
                .get(mainRoute + "process/" + process_id,
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    process = res.data.data;
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });
            
            //Sumamos los puntos
            total_points = +process.machine.total_points;
            total_points = total_points + process.order.points;

            //Actualizamos el registro de la maquina.
            await axios
                .put(mainRoute + "machine/" + process.machine.id,
                    { total_points: total_points },
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {

                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });
        }

    },
    watch:{
        departmentOption(){
            this.getProcessInDepartment();
            if(this.departmentOption === "Tejeduría")
            this.opOption = null;
        },
        opOption(){
            if(this.departmentOption === "Tejeduría" && this.opOption){
                this.fillWeavingMachines();
            }
        }
    }
}

</script>

<template>
    
    <div class="machine-container">

        <h3 class="font-weight-bold title-style">Asignar Maquina a Ordenes:</h3>

        <form>
            <div class="form-group">
                <label for="machine/department_input">Departamento:</label>
                <select class="form-select" aria-label="Default select example" id="machine/department_input" v-model="departmentOption">
                    <option value="Tejeduría">Tejeduría</option>
                    <option value="Enrollado">Enrollado</option>
                    <option value="Corte">Corte</option>
                </select>
            </div>
            <div class="form-group">
                <label for="machine/order_input">OP:</label>
                <select class="form-select" aria-label="Default select example" id="machine/order_input" v-model="opOption">
                    <option v-for="op in opList" :key="op.id" :value="op.id">{{op.op_number}}</option>
                </select>
            </div>
            <div class="form-group">
                <label for="machine/machine_input">Maquinas:</label>
                <select class="form-select" aria-label="Default select example" id="machine/machine_input">
                    <option v-for="machine in machineList" :key="machine.id" :value="machine.id">{{machine.number}}</option>
                </select>
            </div>
            <div class="align-btn">
                <button type="button" class="btn btn-primary" v-on:click="assignMachineToProcess()">Asignar</button>
            </div>
        </form>
        
    </div>

</template>

<style>

.machine-container{
    position:relative;
    top: 50%;
    left: 50%;
    transform:  translate(-50%, 3%);
    width: 600px;
    border-radius: 35px;
    border-color: black;
    border-style: hidden;
    padding-right: 20px;
    padding-bottom: 20px;
    padding-left: 20px;
    background-color: #eeeeee;
    margin-left: 1%;
}

</style>