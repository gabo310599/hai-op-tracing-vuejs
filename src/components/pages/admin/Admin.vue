<script>

import { RouterView, RouterLink } from 'vue-router'
import Login  from '../tools/Login.vue'
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';
import axios from "axios";
import { mainRoute } from '../../../main';

let user = [];
let token = "";
let isNotLogged;
let count = [];
let delayList = [];
let delayColors = {
   DG: "right badge-pill badge-success",
   DT: "right badge-pill badge-success",
   GOP: "right badge-pill badge-success",
   IOP: "right badge-pill badge-success",
   T: "right badge-pill badge-success",
   E: "right badge-pill badge-success",
   C: "right badge-pill badge-success",
   CC: "right badge-pill badge-success",
   F: "right badge-pill badge-success",
   D: "right badge-pill badge-success"
};

//Exports
export default {
   data() {
      return {
         RouterView,
         user,
         token,
         isNotLogged: true,
         Cookies,
         count,
         delayList,
         delayColors
         
      }
   },
   methods:{

      //Metodo que regresa el color del badge por departamento
      getBadgeColor(){
         
            if(this.delayList.DG)
               this.delayColors.DG = "right badge-pill badge-danger";

            if(this.delayList.DT)
               this.delayColors.DT = "right badge-pill badge-danger";
            
            if(this.delayList.GOP)
               this.delayColors.GOP = "right badge-pill badge-danger";

            if(this.delayList.IOP)
               this.delayColors.IOP = "right badge-pill badge-danger";

            if(this.delayList.T)
               this.delayColors.T = "right badge-pill badge-danger";

            if(this.delayList.E)
               this.delayColors.E = "right badge-pill badge-danger";

            if(this.delayList.C)
               this.delayColors.C = "right badge-pill badge-danger";

            if(this.delayList.CC)
               this.delayColors.CC = "right badge-pill badge-danger";

            if(this.delayList.F)
               this.delayColors.F = "right badge-pill badge-danger";

            if(this.delayList.D)
               this.delayColors.D = "right badge-pill badge-danger";
      
      },

      //Metodo que administra el log
      async createLog(msg){

         await axios
         .post(mainRoute + "log",
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

      //Metodo que desactiva las funciones si el usuario no inicio sesion
      disableOptions(){

         if(this.isNotLogged)         
            return false;
         else
            return true
      },

      //Metodo que obtiene los datos de un inicio de sesion
      catchLoginInfo(data){

         let flag = false;

         if(data.user.roles)
            data.user.roles.map(function(row){
               if(row === "ADMIN")
                  flag = true;
            })

         if(!flag){
            alert("El usuario no tiene acceso de administrador.")
            return
         }
         
         this.fillUserInfo(data);
         this.getProcessCountByDepartment();
         this.isNotLogged = false;

      },

      //Metodo que guarda los datos de un inicio de sesion
      fillUserInfo(data){

         this.user = data.user;
         this.token = data.accessToken;
         Cookies.set("userLogged", this.token)
         //this.createLog("Inicio de sesión admin.")
      },

      //Metodo que obtiene de cookies el usuario que inicio sesion
      getUserFromCookies(){
         return Cookies.get("userLogged");   
      },

      //Metodo que elimina de las cookies el usuario
      removeUserLogged(){
         Cookies.remove('userLogged');
      },

      //Metodo que cierra sesion
      logout(){
         //this.createLog("Sesión finalizada.");
         this.removeUserLogged();
      },

      //Metodo que decodifica el token
      getDecodedAccessToken(token) {
         try {
            return jwt_decode(token);
         } catch(Error) {
            return null;
         }
      },

      //Metodo que calcula la cantidad de procesos que hay por departamento
      async getProcessCountByDepartment(){
         
         await axios
         .get(mainRoute + "process/count/by-department",
            {headers: { Authorization: `Bearer ${this.token}` }}
         )
         .then((res) => {

            this.count = res.data.data;

         })
         .catch((error) => {
            console.log(error.message);
            alert("Error: "+error.response.data.message);
         });

         await axios
         .get(mainRoute + "process/delay/by-department",
            {headers: { Authorization: `Bearer ${this.token}` }}
         )
         .then((res) => {

            this.delayList = res.data.data;
            this.getBadgeColor();

         })
         .catch((error) => {
            console.log(error.message);
            alert("Error: "+error.response.data.message);
         });

      }

   },
   components:{
      Login
   },
   async created(){

      const token = this.getUserFromCookies();

      //Verificamos si el token esta activo, y luego lo renovamos
      if(token){

         await axios
         .get(mainRoute + "user/"+this.getDecodedAccessToken(token).sub,
            {headers: { Authorization: `Bearer ${token}` }}
         )
         .then((res) => {
            this.user = res.data.data;
            this.isNotLogged = false;
         })
         .catch((error) => {
            console.log(error.message);
            alert("Error: "+error.response.data.message);
         });

         if(this.user){
            await axios
            .get(mainRoute + "auth/refresh",
            {
               headers: { 
                  Authorization: `Bearer ${token}`
               }
            })
            .then((res) => {
               this.token = res.data.data.accessToken;
               Cookies.set("userLogged", this.token);
            })
            .catch((error) => {
               console.log(error.message);
            });

            this.getProcessCountByDepartment();
         }

      }
      
   }
}

</script>

<template>
   <div class="wrapper" id="admin">

      <!--Aqui comienza el nav bar-->
      <nav class="main-header navbar navbar-expand navbar-white navbar-light">
         <ul class="navbar-nav">
            <li class="nav-item" >
               <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
            </li>
            <li class="nav-item d-none d-sm-inline-block" v-if="disableOptions()">
               <RouterLink to="/admin/dashboard">
                  <a class="nav-link">Home</a>
               </RouterLink>
            </li>
            <li class="nav-item d-none d-sm-inline-block" v-if="disableOptions()">
               <RouterLink to="/admin/info">
                  <a class="nav-link" >Info</a>
               </RouterLink>
            </li>
         </ul>
         <ul class="navbar-nav ml-auto">
            <li class="nav-item dropdown">
               <a class="nav-link" data-widget="fullscreen" href="#" role="button">
                  <i class="fas fa-expand-arrows-alt"></i>
               </a>
            </li>
            <li class="nav-item" v-if="disableOptions()">
               <a class="nav-link" data-widget="control-sidebar" data-slide="true" href="#" role="button">
                  <i class="fas fa-th-large"></i>
               </a>
            </li>
         </ul>
      </nav>

      <!--Aqui comienza la sidebar de la izquierda -->
      <aside class="main-sidebar sidebar-dark-primary elevation-4">
         <RouterLink to="/admin/info">
            <a class="brand-link">
               <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAnFBMVEUALYYAOI4AOIwAN40AMooAJoQAGH4jSpZ4k78xUZkAFH8AIoJefrPw8/r////4+vu+y+FVdq9viLjf5vGGnce0wtxOa6rX3+4ACHymttQSRpbDz+M4YqTc5exRhq1zmrqhvM+GpsNplLa3ytpij7OAo8DH1uKnvtJ1mbhYpc/MbFf/MAD/PQCUO00AN5cAL5m+Zzv/ggD/ewD/lkigttq0AAABIklEQVR4AYSOBYKEMAxFk+IUwrjPlMrI/U+44a/7g8aN/oXZsD58AM5LTAVlgDnjSUFAvQqCfE0zBFygihB7yeZFzgYZBHRTxoRa1HBZ1U1rM5QYzmAwIYdhbdfLMJvbcgpp83MlvWQ5twsBy1VmCw3x85KXFYbKtbzSrze2zI1BCY7U9c1WPrKsK1vkjBXMJt91g3xl1lFLjCNzu5KfWO4PZa4FhT3Kzwz9tiHenZbPnr7zp03nixs9lasXL/QiLoriowwRIRccrXq0DS5dhz6Fm8iY0j1e/FluTiEfLnfN++CSv6nYjsm5oH94BBRMIt6mENCE+wQKUnJPhco3EQBADMAww/le+XMLgpw1K0URVEETdMEQHqZgCbbgCK7gCb4IBxJnZk5jZUwAAAAASUVORK5CYII=" alt="AdminLTE Logo"
                  class="brand-image img-circle elevation-3" style="opacity: .8">
               <span class="brand-text font-weight-light">Hai OP Tracing</span>
            </a>
         </RouterLink>
         <div class="sidebar">
            <div class="user-panel mt-3 pb-3 mb-3 d-flex">
               <div class="image">
                  <img src="https://t4.ftcdn.net/jpg/00/65/77/27/360_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg" class="img-circle elevation-2"
                     alt="User Image">
               </div>
               <div class="info" v-if="disableOptions()">
                  <RouterLink to="/admin/edit-user">
                     <a class="d-block" >{{user.user_name}}</a>
                  </RouterLink>
               </div>
            </div>

            <nav class="mt-2">
               <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

                  <!-- Tablero -->
                  <li class="nav-item">
                     <RouterLink to="/admin/dashboard">
                        <a class="nav-link" v-if="disableOptions()">
                           <i class="nav-icon fas fa-tachometer-alt"></i>
                           <p>
                              Tablero
                           </p>
                        </a>
                     </RouterLink>
                  </li>

                  <!-- Usuario -->
                  <li class="nav-item">
                     <RouterLink to="/admin/users-list/">
                        <a class="nav-link" v-if="disableOptions()">
                           <i class="nav-icon fas fa-solid fa-user"></i>
                           <p>
                              Usuarios Registrados
                           </p>
                        </a>
                     </RouterLink>
                  </li>

                  <!-- Historial -->
                  <li class="nav-item">
                     <RouterLink to="/admin/history">
                        <a class="nav-link" v-if="disableOptions()">
                           <i class="nav-icon fas fa-solid fa-book"></i>
                           <p>
                              Historial
                           </p>
                        </a>
                     </RouterLink>
                  </li>

                  <!-- Linea de tiempo -->
                  <li class="nav-item">
                     <RouterLink to="/admin/time-line">
                        <a class="nav-link" v-if="disableOptions()">
                           <i class="nav-icon fas fa-solid fa-clock"></i>
                           <p>
                              Linea de Tiempo
                           </p>
                        </a>
                     </RouterLink>
                  </li>

                  <!-- Observaciones -->
                  <li class="nav-item">
                     <RouterLink to="/admin/order-observations">
                        <a class="nav-link" v-if="disableOptions()">
                           <i class="nav-icon fas fa-solid fa-clipboard"></i>
                           <p>
                              Observaciones
                           </p>
                        </a>
                     </RouterLink>
                  </li>

                  <!-- Salir -->
                  <li class="nav-item">
                     <RouterLink to="/">
                        <a class="nav-link" v-if="disableOptions()" v-on:click="logout()">
                           <i class="nav-icon fas fa-solid fa-door-open"></i>
                           <p>
                              Salir
                           </p>
                        </a>
                     </RouterLink>
                  </li>

                  <div class="hr_for_sidebar"></div>

                  <!-- Diseño Gráfico -->
                  <li class="nav-item">
                     <RouterLink to="/admin/graphic-design">
                        <a class="nav-link" v-if="disableOptions()">
                           <i class="nav-icon fas fa-regular fa-pen"></i>
                           <p>
                              Diseño Gráfico
                              <span :class="delayColors.DG">{{count.DG}}</span>
                           </p>
                        </a>
                     </RouterLink>
                  </li>

                  <!-- Diseño Textil -->
                  <li class="nav-item">
                     <RouterLink to="/admin/textile-design">
                        <a class="nav-link" v-if="disableOptions()">
                           <i class="nav-icon fas fa-solid fa-ruler-vertical"></i>
                           <p>
                              Diseño Textil
                              <span :class="delayColors.DT">{{count.DT}}</span>
                           </p>
                        </a>
                     </RouterLink>
                  </li>

                  <!-- Generar OP -->
                  <li class="nav-item">
                     <RouterLink to="/admin/generate-op">
                        <a class="nav-link" v-if="disableOptions()">
                           <i class="nav-icon fas fa-solid fa-plus"></i>
                           <p>
                              Generar OP
                              <span :class="delayColors.GOP">{{count.GOP}}</span>
                           </p>
                        </a>
                     </RouterLink>
                  </li>

                  <!-- Imprimir OP -->
                  <li class="nav-item">
                     <RouterLink to="/admin/print-op">
                        <a class="nav-link" v-if="disableOptions()">
                           <i class="nav-icon fas fa-solid fa-print"></i>
                           <p>
                              Imprimir OP
                              <span :class="delayColors.IOP">{{count.IOP}}</span>
                           </p>
                        </a>
                     </RouterLink>
                  </li>

                  <!-- Tejeduría MQ-->
                  <li class="nav-item">
                     <RouterLink to="/admin/weaving">
                        <a class="nav-link" v-if="disableOptions()">
                           <i class="nav-icon fas fa-solid fa-tag"></i>
                           <p>
                              Tejeduría
                              <span :class="delayColors.T">{{count.T}}</span>
                           </p>
                        </a>
                     </RouterLink>
                  </li>

                  <!-- Enrollado MQ-->
                  <li class="nav-item">
                     <RouterLink to="/admin/rolled-up">
                        <a class="nav-link" v-if="disableOptions()">
                           <i class="nav-icon fas fa-solid fa-spinner"></i>
                           <p>
                              <span :class="delayColors.E">{{count.E}}</span>
                              Enrollado
                           </p>
                        </a>
                     </RouterLink>
                  </li>

                  <!-- Corte MQ-->
                  <li class="nav-item">
                     <RouterLink to="/admin/cuting">
                        <a class="nav-link" v-if="disableOptions()">
                           <i class="nav-icon fas fa-solid fa-hand-scissors"></i>
                           <p>
                              Corte
                              <span :class="delayColors.C">{{count.C}}</span>
                           </p>
                        </a>
                     </RouterLink>
                  </li>

                  <!-- Control de calidad -->
                  <li class="nav-item">
                     <RouterLink to="/admin/quality">
                        <a class="nav-link" v-if="disableOptions()">
                           <i class="nav-icon fas fa-solid fa-check"></i>
                           <p>
                              Control de Calidad
                              <span :class="delayColors.CC">{{count.CC}}</span>
                           </p>
                        </a>
                     </RouterLink>
                  </li>

                  <!-- Facturación -->
                  <li class="nav-item">
                     <RouterLink to="/admin/receipt">
                        <a class="nav-link" v-if="disableOptions()">
                           <i class="nav-icon fas fa-solid fa-receipt"></i>
                           <p>
                              Facturación
                              <span :class="delayColors.F">{{count.F}}</span>
                           </p>
                        </a>
                     </RouterLink>
                  </li>

                  <!-- Despacho -->
                  <li class="nav-item">
                     <RouterLink to="/admin/dispatch">
                        <a class="nav-link" v-if="disableOptions()">
                           <i class="nav-icon fas fa-solid fa-truck"></i>
                           <p>
                              Despacho
                              <span :class="delayColors.D">{{count.D}}</span>
                           </p>
                        </a>
                     </RouterLink>
                  </li>
               </ul>
            </nav>
         </div>
      </aside>

      <div class="content-wrapper" >
         <RouterView v-if="disableOptions()" />
         <Login v-if="isNotLogged" v-on:success="catchLoginInfo"/>
      </div>

      <aside class="control-sidebar control-sidebar-dark">
         <div class="p-3">
            <h5>Title</h5>
            <p>Sidebar content</p>
         </div>
      </aside>

      <footer class="main-footer">
         <div class="float-right d-none d-sm-inline">
            Todos los derechos reservados Industrias Textiles Hai, C.A. Rif: J-002385448
         </div>
         <strong>Copyright &copy; 2014-2021 <a href="https://adminlte.io">AdminLTE.io</a>.</strong> All rights reserved.
      </footer>
   </div>
</template>

<style>

.hr_for_sidebar{
   border-top: 1px solid #6c757d;
}

</style>