<script>

import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';
import CheckOutModalType1 from "../tools/CheckOutType1Modal.vue";

let completeAccess = false;
let permissions = {
   DG: false,
   DT: false,
   GOP: false,
   IOP: false,
   T: false,
   E: false,
   C: false,
   CC: false,
   F: false,
   D: false
};
let operator_id = "";
let count = [];
let modalType1 = false;
let departmentList = {
    DG:{
        id: null,
        name: "Diseño Gráfico",
    },
    DT:{
        id: null, 
        name: "Diseño Textil",
    },
    GOP:{ 
        id: null,
        name: "Generar OP",
    },
    IOP:{
        id: null, 
        name: "Imprimir OP",
    },
    T:{ 
        id: null,
        name: "Tejeduría",
    },
    E:{ 
        id: null,
        name: "Enrollado",
    },
    C:{
        id: null, 
        name: "Corte",
    },
    CC:{
        id: null,
        name: "Control de Calidad",
    },
    F:{ 
        id: null,
        name: "Facturación",
    },
    D:{ 
        id: null,
        name: "Despacho",
    }
}
let modalInfoType1 = {}

export default{
    data(){
        return{
            completeAccess,
            permissions,
            operator_id,
            count,
            departmentList,
            modalType1,
            modalInfoType1
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
                    Cookies.set("userLogged", this.token);
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
            return Cookies.get("userLogged");
        },

        //Metodo que verifica los permisos del usuario
        async verifyUser(){

            //Verificamos si es admin
            await axios
                .get("http://localhost:3000/user/"+ this.getDecodedAccessToken().sub,
                    {
                        headers: {
                            Authorization: `Bearer ${this.getUserFromCookies()}`
                        }
                    })
                .then((res) => {

                    let flag = false;
                    this.operator_id = res.data.data.operator.id;

                    res.data.data.roles.map(function (role){
                        if(role == "ADMIN")
                            flag = true
                    })
                    
                    this.completeAccess = flag;
                })
                .catch((error) => {
                    console.log(error.message);
                });
            
            //Otorgamos los permisos
            if(this.completeAccess){
                this.permissions.DG = true;
                this.permissions.DT = true;
                this.permissions.GOP = true;
                this.permissions.IOP = true;
                this.permissions.T = true;
                this.permissions.E = true;
                this.permissions.C = true;
                this.permissions.CC = true;
                this.permissions.F = true;
                this.permissions.D = true;
            }else{

                //Verificamos los departamentos en que trabaja el usuario
                await axios
                    .get("http://localhost:3000/operator-department-union/department-by-operator/"+ this.operator_id,
                        {
                            headers: {
                                Authorization: `Bearer ${this.getUserFromCookies()}`
                            }
                        })
                    .then((res) => {
                        console.log(res.data.data[0].name)
                        for(let i = 0; i < res.data.data.length; i++){
                            switch(res.data.data[i].name){
                                case "Diseño Gráfico":{
                                    this.permissions.DG = true;
                                    break;
                                };
                                case "Diseño Textil":{
                                    this.permissions.DT = true;
                                    break;
                                };
                                case "Generar OP":{
                                    this.permissions.GOP = true;
                                    break;
                                };
                                case "Imprimir OP":{
                                    this.permissions.IOP = true;
                                    break;
                                };
                                case "Tejeduría":{
                                    this.permissions.T = true;
                                    break;
                                };
                                case "Enrollado":{
                                    this.permissions.E = true;
                                    break;
                                };
                                case "Corte":{
                                    this.permissions.C = true;
                                    break;
                                };
                                case "Control de Calidad":{
                                    this.permissions.CC = true;
                                    break;
                                };
                                case "Facturación":{
                                    this.permissions.F = true;
                                    break;
                                };
                                case "Despacho":{
                                    this.permissions.D = true;
                                    break;
                                };
                            }
                        }
                    })
                    .catch((error) => {
                        console.log(error.message);
                    });

            }

        },

        //Metodo que calcula la cantidad de procesos que hay por departamento
        async getProcessCountByDepartment(){
         
            await axios
                .get("http://localhost:3000/process/count/by-department",
                    {
                        headers: {
                            Authorization: `Bearer ${this.getUserFromCookies()}`
                        }
                    }
                )
                .then((res) => {

                this.count = res.data.data;

                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: "+error.response.data.message);
                });
        },

        //Metodo que llena la informacion del modal tipo 1
        async fillModalType1(department, next_department_id){
            
            this.modalInfoType1 = {
                department:{
                    id: null,
                    name: null,
                    next_department_id: null
                },
                
            }            

            this.modalInfoType1.department.id = department.id;
            this.modalInfoType1.department.name = department.name;
            this.modalInfoType1.next_department_id = next_department_id;

            this.modalType1 = true;
            
        },

        //Metodo que obtiene los id de los departamentos
        async getDepartmentsIds(){

            await axios
                .get("http://localhost:3000/department",
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    
                    for(let i = 0; i < res.data.data.length; i++){
                        
                        switch(res.data.data[i].name){

                            case this.departmentList.DG.name: {
                                this.departmentList.DG.id = res.data.data[i].id;
                                break;
                            }
                            
                            case this.departmentList.DT.name: {
                                this.departmentList.DT.id = res.data.data[i].id;
                                break;
                            }

                            case this.departmentList.GOP.name: {
                                this.departmentList.GOP.id = res.data.data[i].id;
                                break;
                            }

                            case this.departmentList.IOP.name: {
                                this.departmentList.IOP.id = res.data.data[i].id;
                                break;
                            }

                            case this.departmentList.T.name: {
                                this.departmentList.T.id = res.data.data[i].id;
                                break;
                            }

                            case this.departmentList.E.name: {
                                this.departmentList.E.id = res.data.data[i].id;
                                break;
                            }

                            case this.departmentList.C.name: {
                                this.departmentList.C.id = res.data.data[i].id;
                                break;
                            }

                            case this.departmentList.CC.name: {
                                this.departmentList.CC.id = res.data.data[i].id;
                                break;
                            }

                            case this.departmentList.F.name: {
                                this.departmentList.F.id = res.data.data[i].id;
                                break;
                            }

                            case this.departmentList.D.name: {
                                this.departmentList.D.id = res.data.data[i].id;
                                break;
                            }
                        }
                    }
                    
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });
            
        }

    },
    async created(){
        await this.getDepartmentsIds();
        await this.verifyUser();
        await this.getProcessCountByDepartment();


    },
    components:{
        CheckOutModalType1
    },
    
}

</script>

<template>
    <div class="check-out-container">

        <!--Diseño Gráfico-->
        <div class="card card-primary card-outline" v-if="permissions.DG">
            <div class="card-header">
               <h3 class="m-0 font-weight-bold">Diseño Gráfico</h3>
            </div>
            <div class="card-body">
               <ul class="list-group">
                  <li class="list-group-item list-group-item-secondary">
                    <p>
                        Total pedidos en el departamento: {{ count.DG }}
                    </p>
                    <a class="card-text font-weight-bold" 
                    data-toggle="modal" data-target="#checkOutModalType1" v-on:click="fillModalType1(departmentList.DG, departmentList.DT.id)"> 
                        REVISAR
                    </a>
                  </li>
               </ul>
            </div>
        </div>

        <!--Diseño Textil-->
        <div class="card card-primary card-outline" v-if="permissions.DT">
            <div class="card-header">
               <h3 class="m-0 font-weight-bold">Diseño Textil</h3>
            </div>
            <div class="card-body">
               <ul class="list-group">
                  <li class="list-group-item list-group-item-secondary">
                    <p>
                        Total pedidos en el departamento: {{ count.DT }}
                    </p>
                    <a class="card-text font-weight-bold" 
                    data-toggle="modal" data-target="#checkOutModalType1" v-on:click="fillModalType1(departmentList.DT, departmentList.GOP.id)">
                        REVISAR
                    </a>
                  </li>
               </ul>
            </div>
        </div>

        <!--Generar OP-->
        <div class="card card-primary card-outline" v-if="permissions.GOP">
            <div class="card-header">
               <h3 class="m-0 font-weight-bold">Generar OP</h3>
            </div>
            <div class="card-body">
               <ul class="list-group">
                  <li class="list-group-item list-group-item-secondary">
                    <p>
                        Total pedidos en el departamento: {{ count.GOP }}
                    </p>
                    <a class="card-text font-weight-bold" 
                    data-toggle="modal" data-target="#checkOutModalType1" v-on:click="fillModalType1(departmentList.GOP, departmentList.IOP.id)">
                        REVISAR
                    </a>
                  </li>
               </ul>
            </div>
        </div>

        <!--Imprimir OP-->
        <div class="card card-primary card-outline" v-if="permissions.IOP">
            <div class="card-header">
               <h3 class="m-0 font-weight-bold">Imprimir OP</h3>
            </div>
            <div class="card-body">
               <ul class="list-group">
                  <li class="list-group-item list-group-item-secondary">
                    <p>
                        Total pedidos en el departamento: {{ count.IOP }}
                    </p>
                    <a class="card-text font-weight-bold" data-toggle="modal" data-target="#checkOutModal">
                        REVISAR
                    </a>
                  </li>
               </ul>
            </div>
        </div>

        <!--Tejeduría-->
        <div class="card card-primary card-outline" v-if="permissions.T">
            <div class="card-header">
               <h3 class="m-0 font-weight-bold">Tejeduría</h3>
            </div>
            <div class="card-body">
               <ul class="list-group">
                  <li class="list-group-item list-group-item-secondary">
                    <p>
                        Total pedidos en el departamento: {{ count.T }}
                    </p>
                    <a class="card-text font-weight-bold" data-toggle="modal" data-target="#checkOutModal">
                        REVISAR
                    </a>
                  </li>
               </ul>
            </div>
        </div>

        <!--Enrollado-->
        <div class="card card-primary card-outline" v-if="permissions.E">
            <div class="card-header">
               <h3 class="m-0 font-weight-bold">Enrollado</h3>
            </div>
            <div class="card-body">
               <ul class="list-group">
                  <li class="list-group-item list-group-item-secondary">
                    <p>
                        Total pedidos en el departamento: {{ count.E }}
                    </p>
                    <a class="card-text font-weight-bold" data-toggle="modal" data-target="#checkOutModal">
                        REVISAR
                    </a>
                  </li>
               </ul>
            </div>
        </div>

        <!--Corte-->
        <div class="card card-primary card-outline" v-if="permissions.C">
            <div class="card-header">
               <h3 class="m-0 font-weight-bold">Corte</h3>
            </div>
            <div class="card-body">
               <ul class="list-group">
                  <li class="list-group-item list-group-item-secondary">
                    <p>
                        Total pedidos en el departamento: {{ count.C }}
                    </p>
                    <a class="card-text font-weight-bold" data-toggle="modal" data-target="#checkOutModal">
                        REVISAR
                    </a>
                  </li>
               </ul>
            </div>
        </div>

        <!--Control de Calidad-->
        <div class="card card-primary card-outline" v-if="permissions.CC">
            <div class="card-header">
               <h3 class="m-0 font-weight-bold">Control de Calidad</h3>
            </div>
            <div class="card-body">
               <ul class="list-group">
                  <li class="list-group-item list-group-item-secondary">
                    <p>
                        Total pedidos en el departamento: {{ count.CC }}
                    </p>
                    <a class="card-text font-weight-bold" data-toggle="modal" data-target="#checkOutModal">
                        REVISAR
                    </a>
                  </li>
               </ul>
            </div>
        </div>

        <!--Facturación-->
        <div class="card card-primary card-outline" v-if="permissions.F">
            <div class="card-header">
               <h3 class="m-0 font-weight-bold">Facturación</h3>
            </div>
            <div class="card-body">
               <ul class="list-group">
                  <li class="list-group-item list-group-item-secondary">
                    <p>
                        Total pedidos en el departamento: {{ count.F }}
                    </p>
                    <a class="card-text font-weight-bold" data-toggle="modal" data-target="#checkOutModal">
                        REVISAR
                    </a>
                  </li>
               </ul>
            </div>
        </div>

        <!--Despacho-->
        <div class="card card-primary card-outline" v-if="permissions.D">
            <div class="card-header">
               <h3 class="m-0 font-weight-bold">Despacho</h3>
            </div>
            <div class="card-body">
               <ul class="list-group">
                  <li class="list-group-item list-group-item-secondary">
                    <p>
                        Total pedidos en el departamento: {{ count.D }}
                    </p>
                    <a class="card-text font-weight-bold" data-toggle="modal" data-target="#checkOutModal">
                        REVISAR
                    </a>
                  </li>
               </ul>
            </div>
        </div>


    </div>

    <!-- Modal -->
    <div class="modal fade" id="checkOutModalType1" tabindex="-1" role="dialog" aria-labelledby="checkOutModalType1Label" aria-hidden="true" v-if="modalType1">
        <CheckOutModalType1 :modalInfoType1="modalInfoType1" />
    </div>

</template>

<style>

.check-out-container {

    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    padding-left: 20px;
    padding-right: 20px;
    justify-content: space-evenly;

}

</style>