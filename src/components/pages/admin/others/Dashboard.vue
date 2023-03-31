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
let emptyPage = true;

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
         emptyPage
      }
   },
   methods: {
      
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
      
   },
   props: [

   ],
   async created(){

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

   <div class="container-dashboard">

         <!--DISEÑO GRAFICO-->
         <div class="card card-primary card-outline" v-if="listDG">
            <div class="card-header">
               <h3 class="m-0 font-weight-bold">Diseño Gráfico</h3>
            </div>
            <div class="card-body">
               <h5>Pedidos con retrasos:</h5>
               <br/>
               <ol>
                  <li v-for="item in listDG" :key="item.id">
                     <p class="card-text font-weight-bold">{{item.request}} </p>
                     <p>
                        Retraso de {{ item.delay }} días <a class="btn btn-outline-danger btn-sm">revisar</a>
                     </p>
                  </li>
               </ol>
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
               <ol>
                  <li v-for="item in listDT" :key="item.id">
                     <p class="card-text font-weight-bold">{{item.request}} </p>
                     <p>
                        Retraso de {{ item.delay }} días <a class="btn btn-outline-danger btn-sm">revisar</a>
                     </p>
                  </li>
               </ol>
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
               <ol>
                  <li v-for="item in listGOP" :key="item.id">
                     <p class="card-text font-weight-bold">{{item.request}} </p>
                     <p>
                        Retraso de {{ item.delay }} días <a class="btn btn-outline-danger btn-sm">revisar</a>
                     </p>
                  </li>
               </ol>
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
               <ol>
                  <li v-for="item in listIOP" :key="item.id">
                     <p class="card-text font-weight-bold">{{item.order}} </p>
                     <p>
                        Retraso de {{ item.delay }} días <a class="btn btn-outline-danger btn-sm">revisar</a>
                     </p>
                  </li>
               </ol>
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
               <ol>
                  <li v-for="item in listT" :key="item.id">
                     <p class="card-text font-weight-bold">{{item.order}} </p>
                     <p>
                        Retraso de {{ item.delay }} días <a class="btn btn-outline-danger btn-sm">revisar</a>
                     </p>
                  </li>
               </ol>
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
               <ol>
                  <li v-for="item in listE" :key="item.id">
                     <p class="card-text font-weight-bold">{{item.order}} </p>
                     <p>
                        Retraso de {{ item.delay }} días <a class="btn btn-outline-danger btn-sm">revisar</a>
                     </p>
                  </li>
               </ol>
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
               <ol>
                  <li v-for="item in listC" :key="item.id">
                     <p class="card-text font-weight-bold">{{item.order}} </p>
                     <p>
                        Retraso de {{ item.delay }} días <a class="btn btn-outline-danger btn-sm">revisar</a>
                     </p>
                  </li>
               </ol>
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
               <ol>
                  <li v-for="item in listCC" :key="item.id">
                     <p class="card-text font-weight-bold">{{item.order}} </p>
                     <p>
                        Retraso de {{ item.delay }} días <a class="btn btn-outline-danger btn-sm">revisar</a>
                     </p>
                  </li>
               </ol>
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
               <ol>
                  <li v-for="item in listF" :key="item.id">
                     <p class="card-text font-weight-bold">{{item.order}} </p>
                     <p>
                        Retraso de {{ item.delay }} días <a class="btn btn-outline-danger btn-sm">revisar</a>
                     </p>
                  </li>
               </ol>
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
               <ol>
                  <li v-for="item in listD" :key="item.id">
                     <p class="card-text font-weight-bold">{{item.order}} </p>
                     <p>
                        Retraso de {{ item.delay }} días <a class="btn btn-outline-danger btn-sm">revisar</a>
                     </p>
                  </li>
               </ol>
            </div>
         </div>

         <div v-if="emptyPage">
            <br/>
            <h5 class="font-weight-light">No hay ningun pedido u orden con retraso.</h5>
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

</style>