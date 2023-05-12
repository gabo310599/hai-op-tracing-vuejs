<script>

import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';

let user = [];
let urgentList = [];
let listDG = [];
let listDT = [];
let listGOP = [];
let listIOP = [];
let listT = [];
let listE = [];
let listC = [];
let listCC = [];
let listF = [];
let listD = [];
let newRequestsList = [];
let emptyPage = true;
let modalData = {}


//Exports
export default {
   data() {
      return {
         user,
         urgentList,
         listDG,
         listDT,
         listGOP,
         listIOP,
         listT,
         listE,
         listC,
         listCC,
         listF,
         listD,
         emptyPage,
         modalData,
         newRequestsList
      }
   },
   methods: {
      
      //Metodo que obtiene el id del proceso a revisar
      async fillModalInfo(id){

         this.modalData = {   
            epartment: null,
            request: null,
            description: null,
            order: null,
            date_in: null,
            operator: null,
            machine: null
         }

         await axios
         .get("http://localhost:3000/process/"+id,
            {headers: { Authorization: `Bearer ${this.getUserFromCookies()}` }}
         )
         .then((res) => {
            
            //Llenamos la data del modal

            //Nombre del departamento
            this.modalData.department = res.data.data.department.name;

            //Llenamos la orden (si existe) y los datos del pedido
            if(res.data.data.order){
               this.modalData.order = res.data.data.order.op_number;
               this.modalData.request = res.data.data.request.serial + res.data.data.request.characters;
               this.modalData.description = res.data.data.request.description;
            }else{
               this.modalData.request = res.data.data.request.serial + res.data.data.request.characters;
               this.modalData.description = res.data.data.request.description;
            }

            //Llenamos la fecha de ingreso
            let date_in_format = new Date(res.data.data.date_in).toLocaleString();
            this.modalData.date_in = date_in_format;

            //Llenamos el operario
            this.modalData.operator = res.data.data.operator.name + " " + res.data.data.operator.last_name;

            //Llenamos la maquina (si existe)
            if(res.data.data.machine)
               this.modalData.machine = res.data.data.machine.name;

         })
         .catch((error) => {
            console.log(error.message);
            alert("Error: "+error.response.data.message);
         });

      },

      //Metodo que verifica si las listas de departamentos estan iniciadas
      verifyLists(){
            if(this.listDG.length === 0)
               this.listDG = null;
            else
               this.emptyPage = false;

            if(this.listDT.length === 0)
               this.listDT = null;
            else
               this.emptyPage = false;

            if(this.listGOP.length === 0)
               this.listGOP = null;
            else
               this.emptyPage = false;

            if(this.listIOP.length === 0)
               this.listIOP = null;
            else
               this.emptyPage = false;

            if(this.listT.length === 0)
               this.listT = null;
            else
               this.emptyPage = false;

            if(this.listE.length === 0)
               this.listE = null;
            else
               this.emptyPage = false;

            if(this.listC.length === 0)
               this.listC = null;
            else
               this.emptyPage = false;

            if(this.listCC.length === 0)
               this.listCC = null;
            else
               this.emptyPage = false;

            if(this.listF.length === 0)
               this.listF = null;
            else
               this.emptyPage = false;

            if(this.listD.length === 0)
               this.listD = null;
            else
               this.emptyPage = false;
            
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

      //Metodo que administra el log
      async createLog(msg){

         await axios
         .post("http://localhost:3000/log",
            {user_id: this.user.id, log: msg},
            {headers: { Authorization: `Bearer ${this.getUserFromCookies()}` }}
         )
         .then((res) => {

         })
         .catch((error) => {
            console.log(error.message);
            alert("Error: "+error.response.data.message);
         });

      },

      //Metodo que obtiene la lista de nuevos pedidos
      async fillNewOrdersList(){

      }
      
   },
   async created(){

      await this.fillNewOrdersList();
      
      await axios
         .get("http://localhost:3000/user/"+this.getDecodedAccessToken().sub,
            {headers: { Authorization: `Bearer ${this.getUserFromCookies()}` }}
         )
         .then((res) => {
            this.user = res.data.data;
         })
         .catch((error) => {
            console.log(error.message);
            alert("Error: "+error.response.data.message);
         });
      
      if(this.user){
         await axios
            .get("http://localhost:3000/process/delay/list-by-department",
               {headers: { Authorization: `Bearer ${this.getUserFromCookies()}` }}
            )
            .then((res) => {
               this.urgentList = res.data.data;
               this.listDG = this.urgentList.DG;
               this.listDT = this.urgentList.DT;
               this.listGOP = this.urgentList.GOP;
               this.listIOP = this.urgentList.IOP;
               this.listT = this.urgentList.T;
               this.listE = this.urgentList.E;
               this.listC = this.urgentList.C;
               this.listCC = this.urgentList.CC;
               this.listF = this.urgentList.F;
               this.listD = this.urgentList.D;
               this.verifyLists();
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
   <div class="content-header">
      <div class="container-fluid">
         <div class="row mb-2">
            <div class="col-sm-6">
               <h1 class="m-0 font-weight-bold">Tablero</h1>
            </div>
            <div class="col-sm-6">
               <ol class="breadcrumb float-sm-right">
                  <li class="breadcrumb-item"><a href="/admin/dashboard">Home</a></li>
                  <li class="breadcrumb-item active">Tablero</li>
               </ol>
            </div>
         </div>
      </div>
   </div>


   <div class="new-request-container">
      <div class="small-box bg-info">
         <div class="inner">
            <h3>Nuevos Pedidos</h3>
            <p>150</p>
         </div>
         <div class="icon">
            <i class="fa-solid fa-bag-shopping" />
         </div>
      </div>
   </div>

   <div class="container-dashboard">

         <!--DISEÑO GRAFICO-->
         <div class="card card-primary card-outline" v-if="listDG">
            <div class="card-header">
               <h3 class="m-0 font-weight-bold">Diseño Gráfico</h3>
            </div>
            <div class="card-body">
               <h5>Pedidos con retrasos:</h5>
               <br/>
               <ul class="list-group">
                  <li class="list-group-item list-group-item-danger" v-for="item in listDG" :key="item.id">
                     <a class="card-text font-weight-bold" data-toggle="modal" data-target="#DashboardModal" v-on:click="fillModalInfo(item.id)">
                        {{item.request}} 
                     </a>
                     <p>
                        Retraso de {{ item.delay }} días 
                     </p>
                  </li>
               </ul>
            </div>
         </div>

         <!--Diseño Textil-->
         <div class="card card-primary card-outline" v-if="listDT">
            <div class="card-header">
               <h3 class="m-0 font-weight-bold">Diseño Textil</h3>
            </div>
            <div class="card-body">
               <h5>Pedidos con retrasos:</h5>
               <br/>
               <ul class="list-group">
                  <li class="list-group-item list-group-item-danger" v-for="item in listDT" :key="item.id">
                     <a class="card-text font-weight-bold" data-toggle="modal" data-target="#DashboardModal" v-on:click="fillModalInfo(item.id)">
                        {{item.request}} 
                     </a>
                     <p>
                        Retraso de {{ item.delay }} días 
                     </p>
                  </li>
               </ul>
            </div>
         </div>

         <!--Generar OP-->
         <div class="card card-primary card-outline" v-if="listGOP">
            <div class="card-header">
               <h3 class="m-0 font-weight-bold">Generar OP</h3>
            </div>
            <div class="card-body">
               <h5>Pedidos con retrasos:</h5>
               <br/>
               <ul class="list-group">
                  <li class="list-group-item list-group-item-danger" v-for="item in listGOP" :key="item.id">
                     <a class="card-text font-weight-bold" data-toggle="modal" data-target="#DashboardModal" v-on:click="fillModalInfo(item.id)">
                        {{item.request}} 
                     </a>
                     <p>
                        Retraso de {{ item.delay }} días 
                     </p>
                  </li>
               </ul>
            </div>
         </div>

         <!--Imprimir OP-->
         <div class="card card-primary card-outline" v-if="listIOP">
            <div class="card-header">
               <h3 class="m-0 font-weight-bold">Imprimir OP</h3>
            </div>
            <div class="card-body">
               <h5>Ordenes con retrasos:</h5>
               <br/>
               <ul class="list-group">
                  <li class="list-group-item list-group-item-danger" v-for="item in listIOP" :key="item.id">
                     <a class="card-text font-weight-bold" data-toggle="modal" data-target="#DashboardModal" v-on:click="fillModalInfo(item.id)">
                        {{item.request}} 
                     </a>
                     <p>
                        Retraso de {{ item.delay }} días 
                     </p>
                  </li>
               </ul>
            </div>
         </div>

         <!--Tejeduría-->
         <div class="card card-primary card-outline" v-if="listT">
            <div class="card-header">
               <h3 class="m-0 font-weight-bold">Tejeduría</h3>
            </div>
            <div class="card-body">
               <h5>Ordenes con retrasos:</h5>
               <br/>
               <ul class="list-group">
                  <li class="list-group-item list-group-item-danger" v-for="item in listT" :key="item.id">
                     <a class="card-text font-weight-bold" data-toggle="modal" data-target="#DashboardModal" v-on:click="fillModalInfo(item.id)">
                        {{item.request}} 
                     </a>
                     <p>
                        Retraso de {{ item.delay }} días 
                     </p>
                  </li>
               </ul>
            </div>
         </div>

         <!--Enrollado-->
         <div class="card card-primary card-outline" v-if="listE">
            <div class="card-header">
               <h3 class="m-0 font-weight-bold">Enrollado</h3>
            </div>
            <div class="card-body">
               <h5>Ordenes con retrasos:</h5>
               <br/>
               <ul class="list-group">
                  <li class="list-group-item list-group-item-danger" v-for="item in listE" :key="item.id">
                     <a class="card-text font-weight-bold" data-toggle="modal" data-target="#DashboardModal" v-on:click="fillModalInfo(item.id)">
                        {{item.request}} 
                     </a>
                     <p>
                        Retraso de {{ item.delay }} días 
                     </p>
                  </li>
               </ul>
            </div>
         </div>
         
         <!--Corte-->
         <div class="card card-primary card-outline" v-if="listC">
            <div class="card-header">
               <h3 class="m-0 font-weight-bold">Corte</h3>
            </div>
            <div class="card-body">
               <h5>Ordenes con retrasos:</h5>
               <br/>
               <ul class="list-group">
                  <li class="list-group-item list-group-item-danger" v-for="item in listC" :key="item.id">
                     <a class="card-text font-weight-bold" data-toggle="modal" data-target="#DashboardModal" v-on:click="fillModalInfo(item.id)">
                        {{item.request}} 
                     </a>
                     <p>
                        Retraso de {{ item.delay }} días 
                     </p>
                  </li>
               </ul>
            </div>
         </div>

         <!--Control de Calidad-->
         <div class="card card-primary card-outline" v-if="listCC">
            <div class="card-header">
               <h3 class="m-0 font-weight-bold">Control de Calidad</h3>
            </div>
            <div class="card-body">
               <h5>Ordenes con retrasos:</h5>
               <br/>
               <ul class="list-group">
                  <li class="list-group-item list-group-item-danger" v-for="item in listCC" :key="item.id">
                     <a class="card-text font-weight-bold" data-toggle="modal" data-target="#DashboardModal" v-on:click="fillModalInfo(item.id)">
                        {{item.request}} 
                     </a>
                     <p>
                        Retraso de {{ item.delay }} días 
                     </p>
                  </li>
               </ul>
            </div>
         </div>

         <!--Facturación-->
         <div class="card card-primary card-outline" v-if="listF">
            <div class="card-header">
               <h3 class="m-0 font-weight-bold">Facturación</h3>
            </div>
            <div class="card-body">
               <h5>Ordenes con retrasos:</h5>
               <br/>
               <ul class="list-group">
                  <li class="list-group-item list-group-item-danger" v-for="item in listF" :key="item.id">
                     <a class="card-text font-weight-bold" data-toggle="modal" data-target="#DashboardModal" v-on:click="fillModalInfo(item.id)">
                        {{item.request}} 
                     </a>
                     <p>
                        Retraso de {{ item.delay }} días 
                     </p>
                  </li>
               </ul>
            </div>
         </div>

         <!--Despacho-->
         <div class="card card-primary card-outline" v-if="listD">
            <div class="card-header">
               <h3 class="m-0 font-weight-bold">Despacho</h3>
            </div>
            <div class="card-body">
               <h5>Ordenes con retrasos:</h5>
               <br/>
               <ul class="list-group">
                  <li class="list-group-item list-group-item-danger" v-for="item in listD" :key="item.id">
                     <a class="card-text font-weight-bold" data-toggle="modal" data-target="#DashboardModal" v-on:click="fillModalInfo(item.id)">
                        {{item.request}} 
                     </a>
                     <p>
                        Retraso de {{ item.delay }} días 
                     </p>
                  </li>
               </ul>
            </div>
         </div>

         <div v-if="emptyPage">
            <br/>
            <h5 class="font-weight-light">No hay ningun pedido u orden con retraso.</h5>
         </div>
  
   </div>

   <!--MODAL-->
   <div class="modal fade" id="DashboardModal" tabindex="-1" role="dialog" aria-labelledby="DashboardModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
         <div class="modal-content">
             <div class="modal-header">
                 <h2 class="modal-title font-weight-bold" id="DashboardModalLabel">{{modalData.department}}</h2>
                 <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                 </button>
             </div>
             <div class="modal-body">
                 <div>
                     <form>
                         <div class="form-group">
                             <label for="dashboard/request_input">Pedido:</label>
                             <input class="form-control" id="dashboard/request_input" :value="modalData.request" readonly>
                         </div>
                         <div class="form-group">
                             <label for="dashboard/description_input">Descripción:</label>
                             <input class="form-control" id="dashboard/description_input" :value="modalData.description" readonly>
                         </div>
                         <div class="form-group" v-if="modalData.order">
                             <label for="dashboard/order_input">Orden de producción:</label>
                             <input class="form-control" id="dashboard/order_input" :value="modalData.order" readonly>
                         </div>
                         <div class="form-group">
                             <label for="dashboard/date_in_input">Fecha de ingreso:</label>
                             <input class="form-control" id="dashboard/date_in_input" :value="modalData.date_in" readonly>
                         </div>
                         <div class="form-group">
                             <label for="dashboard/operator_input">Operario:</label>
                             <input class="form-control" id="dashboard/operator_input" :value="modalData.operator" readonly>
                         </div>
                         <div class="form-group" v-if="modalData.machine">
                             <label for="dashboard/machine_input">Maquina:</label>
                             <input class="form-control" id="dashboard/machine_input" :value="modalData.machine" readonly>
                         </div>
                     </form>
                 </div>
             </div>
             <div class="modal-footer">
                 <button type="button" class="btn btn-danger" data-dismiss="modal">Salir</button>
             </div>
         </div>
     </div>
  </div>

   
</template>

<style>
.container-dashboard {

   display: grid;
   grid-template-columns: repeat(3, 1fr);
   grid-gap: 10px;
   padding-left: 20px;
   padding-right: 20px;
   justify-content: space-evenly;
 }

.new-request-container{
   position:relative;
   top: 50%;
   left: 50%;
   transform:  translate(-50%, 3%);
   width: 400px;
   padding-right: 20px;
   padding-bottom: 20px;
   padding-left: 20px;
   margin-left: 1%;
}

</style>