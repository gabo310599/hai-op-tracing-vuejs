<script>

import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';
import { mainRoute } from "../../../../main";

let counter = 1;
let checkInList = [];
let checkOutList = [];
let departmentOption = "";
let opOption = "";
let department_id = "";
let opList = [];
let machineList = [];
let processList = [];

export default{
    data(){
        return{
            counter,
            checkInList,
            checkOutList,
            departmentOption,
            opOption,
            opList,
            machineList,
            processList,
            department_id
        }
    },
    emits:[
        "reload"
    ],
    async created(){
        await this.fillCheckInList();
        await this.fillCheckOutList();
    },
    props:[
        "modalInfoType3"
    ],
    watch:{
        modalInfoType3(){
            this.fillCheckInList();
            this.fillCheckOutList();
        },
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
    },
    methods:{
        
        //Metodo de refresh token
        async refresToken(){
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

        //Incrementamos el contador
        incrementCounter() {
            return counter++;
        },

        //Reiniciamos el contador
        resetCounter() {
            counter = 1;
        },

        //Metodo que obtiene de cookies el usuario que inicio sesion
        getUserFromCookies() {
            return Cookies.get("userLoggedOperator");
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

        //Llenamos la lista de pedidos disponibles para este departamento
        async fillCheckInList(){

            this.checkInList = [];
            await axios
                .get(mainRoute + "process/list/check-in/" + this.modalInfoType3.department.id,
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    this.checkInList = res.data.data;
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });
        },

        //Metodo que acepta un pedido en el departamento
        async checkIn(process){

            this.refresToken();

            //Verificamos que el proceso  este asociado a una maquina
            let machine = false;
            await axios
                .get(mainRoute +"process/" + process.id ,
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                        if(res.data.data.machine)
                            machine = true;
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });
            
            if(!machine){
                alert("Por favor asignarle maquina al pedido.")
                this.opList = [];
                this.machineList = []
                $('#machineAssociationModal').modal('show');
                return;
            }

            //Obtenemos el id del operario a traves del usuario
            let operator_id = "";
            await axios
                .get(mainRoute + "user/" + this.getDecodedAccessToken().sub ,
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                        operator_id = res.data.data.operator.id;
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });

            //Actualizamos el registro del proceso
            await axios
                .put(mainRoute + "process/" + process.id,
                    {
                        date_in: new Date(),
                        operator_id: operator_id
                    },
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    this.fillCheckInList();
                    this.fillCheckOutList();
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });

                //this.createLog("El pedido " + process.request.serial + process.request.characters + " ha sido ingresado a " + process.department.name + ".")
                this.$emit('reload');
        },

        //Llenamos la lista de pedidos en este departamento
        async fillCheckOutList(){

            this.checkOutList = [];
            await axios
                .get(mainRoute + "process/list/check-out/" + this.modalInfoType3.department.id,
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    this.checkOutList = res.data.data;
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });
        },

        //Metodo de marca la salida de un pedido en el departamento.
        async checkOut(process){

            this.refresToken();
            
            //Obtenemos el id del operador que esta ejecutando la accion
            let operator_id = "";
            await axios
                .get(mainRoute + "user/" + this.getDecodedAccessToken().sub ,
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                        operator_id = res.data.data.operator.id;
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });

            //Actualizamos el registro del proceso
            await axios
                .put(mainRoute + "process/" + process.id,
                    {
                        date_out: new Date(),
                        operator_id: operator_id
                    },
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    this.fillCheckInList();
                    this.fillCheckOutList();
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });
            
            //Creamos el nuevo registro del siguiente departamento si existe
            if(this.modalInfoType3.next_department_id){
                await axios
                .post(mainRoute + "process",
                    {
                        request_id: process.request.id,
                        department_id: this.modalInfoType3.next_department_id,
                        order_id: process.order.id
                    },
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {

                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: "+error.response.data.message);
                });
            }
            //this.createLog("El pedido " + process.request.serial + process.request.characters + " ha saldio de " + process.department.name + ".");

            if(process.department.name === "Tejeduría")
                this.assignHours(process.id);

            this.$emit('reload');
        },

        //Metodo que asigna la cantidad de horas trabajas a las maquinas de tejeduria
        async assignHours(process_id){

            let process;

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

            //Calculamos las horas dependiendo del urdido
            if(process.order.warped === "negro"){

                let total_hours = +process.machine.total_black_hours;
                const difference = new Date(process.date_out).getTime() - new Date(process.date_in).getTime();
                const hours_to_add = difference / 1000 / 60 / 60;
                total_hours = total_hours + hours_to_add;


                //Actualizamos las horas del registro de la maquina
                await axios
                    .put(mainRoute + "machine/" + process.machine.id,
                        { total_black_hours: total_hours },
                        { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                    )
                    .then((res) => {

                    })
                    .catch((error) => {
                        console.log(error.message);
                        alert("Error: " + error.response.data.message);
                    });

            }else if(process.order.warped === "blanco"){

                let total_hours = +process.machine.total_white_hours;
                const difference = new Date(process.date_out).getTime() - new Date(process.date_in).getTime();
                const hours_to_add = difference / 1000 / 60 / 60;
                total_hours = total_hours + hours_to_add;

                //Actualizamos las horas del registro de la maquina
                await axios
                    .put(mainRoute +"machine/" + process.machine.id,
                        { total_white_hours: total_hours },
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

        //Metodo que cierra el modal de asociar maquina
        closeMachineAssociationModal(){
            $('#machineAssociationModal').modal('hide');
            this.departmentOption = ""
        },

        //Metodo que obtiene los procesos del departamento seleccionado
        async getProcessInDepartment(){

            this.refresToken();

            if(this.departmentOption.length <= 0)
                return

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
                if(row.id === document.getElementById("check-out/machine/machine_input").value)
                    machine_id = row.id;
            });

            //Obtenemos el id de la orden a asociar
            this.opList.map( function (row){
                if(row.id === document.getElementById("check-out/machine/order_input").value)
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
                    this.closeMachineAssociationModal();
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });

                //this.createLog("Se ha asociado la maquina " + machine_id + "con el proceso " + process_id);

                if(document.getElementById("check-out/machine/department_input").value === "Tejeduría")
                    await this.assignPoints(process_id)

                
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
}

</script>

<template>
    
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title font-weight-bold" id="checkOutModalType3Label">{{modalInfoType3.department.name}}</h2>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">

                {{ resetCounter() }}
                <h4 class="font-weight-bold">Pedidos en espera para ingresar:</h4>
                <table class="table table-hover table-sm ">
                    <thead class="thead-dark">
                        <tr>
                            <th scope="col" class="center-text">#</th>
                            <th scope="col" class="center-text">Pedido</th>
                            <th scope="col" class="center-text">Descripción</th>
                            <th scope="col" class="center-text">Código</th>
                            <th scope="col" class="center-text">OP</th>
                            <th scope="col" class="center-text">Marcar Entrada</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in checkInList" :key="row.request.id">
                            <th scope="row" class="center-text">{{incrementCounter()}}</th>
                            <td class="center-text">{{row.request.serial + row.request.characters}}</td>
                            <td class="center-text">{{row.request.description}}</td>
                            <td class="center-text">{{row.request.code}}</td>
                            <td class="center-text">{{row.order.op_number}}</td>
                            <td class="center-text">
                                <button button type="button" class="btn btn-outline-success" v-on:click="checkIn(row)">
                                    Entrada
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <br/>

                {{ resetCounter() }}
                <h4 class="font-weight-bold">Pedidos en espera para salir:</h4>
                    <table class="table table-hover table-sm ">
                        <thead class="thead-dark">
                            <tr>
                                <th scope="col" class="center-text">#</th>
                                <th scope="col" class="center-text">Pedido</th>
                                <th scope="col" class="center-text">Descripción</th>
                                <th scope="col" class="center-text">Código</th>
                                <th scope="col" class="center-text">OP</th>
                                <th scope="col" class="center-text">Maquina</th>
                                <th scope="col" class="center-text">Marcar Salida</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in checkOutList" :key="row.request.id">
                                <th scope="row" class="center-text">{{incrementCounter()}}</th>
                                <td class="center-text">{{row.request.serial + row.request.characters}}</td>
                                <td class="center-text">{{row.request.description}}</td>
                                <td class="center-text">{{row.request.code}}</td>
                                <td class="center-text">{{row.order.op_number}}</td>
                                <td class="center-text">{{row.machine.number}}</td>
                                <td class="center-text">
                                    <button button type="button" class="btn btn-outline-danger" v-on:click="checkOut(row)" >
                                        Salida
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-dismiss="modal">Salir</button>
            </div>
        </div>
    </div>

        <!-- Modal para asociar maquinas -->
        <div class="modal fade" id="machineAssociationModal" tabindex="-1" role="dialog" aria-labelledby="machineAssociationModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="machineAssociationModalLabel">Asociar Maquina</h5>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-group">
                                <label for="check-out/machine/department_input">Departamento:</label>
                                <select class="form-select" aria-label="Default select example" id="check-out/machine/department_input" v-model="departmentOption">
                                    <option value="Tejeduría">Tejeduría</option>
                                    <option value="Enrollado">Enrollado</option>
                                    <option value="Corte">Corte</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="check-out/machine/order_input">OP:</label>
                                <select class="form-select" aria-label="Default select example" id="check-out/machine/order_input" v-model="opOption">
                                    <option v-for="op in opList" :key="op.id" :value="op.id">{{op.op_number}}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="check-out/machine/machine_input">Maquinas:</label>
                                <select class="form-select" aria-label="Default select example" id="check-out/machine/machine_input">
                                    <option v-for="machine in machineList" :key="machine.id" :value="machine.id">{{machine.number}}</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" v-on:click="assignMachineToProcess()">Guardar</button>
                        <button type="button" class="btn btn-primary" v-on:click="closeMachineAssociationModal()">Salir</button>
                    </div>
                </div>
            </div>
        </div>
</template>