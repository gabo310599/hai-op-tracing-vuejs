<script>

import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';

let departmentOption = "";
let opList = [];
let machineList = [];
let processList = [];

export default{
    data(){
        return{
            departmentOption,
            opList,
            machineList,
            processList
        }
    },
    methods:{

        //Metodo de refresh token
        async refresToken(){    
            await axios
                .get("http://localhost:3000/auth/refresh",
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

        //Metodo que obtiene de cookies el usuario que inicio sesion
        getUserFromCookies() {
            return Cookies.get("userLoggedOperator");
        },

        //Metodo que obtiene los procesos del departamento seleccionado
        async getProcessInDepartment(){

            //Obtenemos el id del departamento seleccionado
            let department_id = "";
            await axios
                .post("http://localhost:3000/department/get/by-name/",
                    { name: this.departmentOption },
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    department_id = res.data.data.id;
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });

            //Obtenemos la lista de procesos activos en ese departamento.
            await axios
                .get("http://localhost:3000/process/get/process-without-machine/"+department_id,
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    this.processList = res.data.data;
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });
            
            //Obtenemos la lista de maquinas en el departamento
            let machineArray = []
            await axios
                .get("http://localhost:3000/machine/get/by-department/"+department_id,
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
        }

    },
    watch:{
        departmentOption(){
            this.getProcessInDepartment();
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
                <select class="form-select" aria-label="Default select example" id="machine/order_input">
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
                <button type="button" class="btn btn-primary">Asignar</button>
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
    border-width: 5px;
    border-style: solid;
    padding-right: 20px;
    padding-bottom: 20px;
    padding-left: 20px;
    background-color: #eef2f3;
    margin-left: 1%;
}

</style>