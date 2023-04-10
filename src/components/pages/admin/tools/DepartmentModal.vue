<script>

import { computed } from "@vue/reactivity";
import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';

let departmentList = [];
let departementOperator = [];

export default {
    props:[
        'infoModal'
    ],
    data(){
        return{
            departmentList,
            departementOperator
        }
    },
    methods:{

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

        //Metodo que obtiene la lista de departamentos del usuario
        async fillDepartmentOperatorList(){

            await axios
                .get("http://localhost:3000/operator-department-union/department-by-operator/" + this.infoModal.operator.id,
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    
                    let departmentsArray = [];

                    res.data.data.map(function (row){
                        departmentsArray.push({
                            id: row.id,
                            name: row.name
                        })
                    })

                    this.departementOperator = departmentsArray;
                    this.fillDepartmentList();
                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });

        },

        //Metodo que elimina un departamento de la lista
        async deleteDepartment(department_id){

            await axios
                .post("http://localhost:3000/operator-department-union/delete/by-operator-and-department",
                    { 
                        operator_id: this.infoModal.operator.id,
                        department_id: department_id
                    },
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    
                    this.fillDepartmentOperatorList();

                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });

        },

        //Metodo que determina los departamento que se pueden agregar a un operario
        fillDepartmentList(){
            this.departmentList = [];
            this.departmentList.push("Diseño Gráfico");
            this.departmentList.push("Diseño Textil");
            this.departmentList.push("Generar OP");
            this.departmentList.push("Imprimir OP");
            this.departmentList.push("Tejeduría");
            this.departmentList.push("Enrollado");
            this.departmentList.push("Corte");
            this.departmentList.push("Control de Calidad");
            this.departmentList.push("Facturación");
            this.departmentList.push("Despacho");

            let indexToDelete = [];

            for(let i = 0; i < this.departmentList.length; i++){
                for(let j = 0; j < this.departementOperator.length; j++){
                    if(this.departementOperator[j].name == this.departmentList[i]){
                        indexToDelete.push(i);
                    }
                }
            }

            for(let i = 0; i < indexToDelete.length; i++){
                delete(this.departmentList[indexToDelete[i]])
            }

            this.departmentList = this.departmentList.filter(function(x) {
                return x !== undefined;
            });
        },

        //Metodo que agrega un departamento a un operari
        async addDepartment(){
            
            if(document.getElementById("add_department").value == "SELECCIONAR")
                return;
            
            let department_id = "";
            await axios
                .post("http://localhost:3000/department/get/by-name",
                    { name: document.getElementById("add_department").value },
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    
                    department_id = res.data.data.id;

                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });

            await axios
                .post("http://localhost:3000/operator-department-union",
                    { 
                        department_id: department_id,
                        operator_id: this.infoModal.operator.id 
                    },
                    { headers: { Authorization: `Bearer ${this.getUserFromCookies()}` } }
                )
                .then((res) => {
                    
                    this.fillDepartmentOperatorList();

                })
                .catch((error) => {
                    console.log(error.message);
                    alert("Error: " + error.response.data.message);
                });
            
        }

    },
    async created(){
        await this.fillDepartmentOperatorList();
    },
    watch:{
        infoModal(){
            this.fillDepartmentOperatorList();
        }
    }

}

</script>

<template>

    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title" id="departmentModaLabel">Más Información</h2>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="">
                    <form>
                        <div class="form-group">
                            <ul class="list-group">
                                <li class="list-group-item list-group-item-secondary" v-for="department in departementOperator" :key="department.id">
                                    <p class="font-weight-bold">{{department.name}}</p>
                                    <a class="delete-btn-alignment" v-on:click="deleteDepartment(department.id, department.name)">Eliminar</a>
                                </li>
                            </ul>
                        </div>
                        <div class="form-group">
                            <label for="add_department">Asociar Departamento:</label>
                            <select class="form-select" aria-label="Default select example" id="add_department">
                                <option value="SELECCIONAR">Seleccionar...</option>
                                <option v-for="department in departmentList" :value="department">{{department}}</option>
                            </select>
                        </div>
                    </form>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" v-on:click="addDepartment()">Agregar</button>
                <button type="button" class="btn btn-danger" data-dismiss="modal">Salir</button>
            </div>
        </div>
    </div>

</template>

<style>

.delete-btn-alignment{
    text-align: right;
}
</style>