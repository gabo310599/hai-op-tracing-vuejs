<script>

import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';


let user = [];
let token = "";
let urgentList = []



//Exports
export default {
   data() {
      return {
         user,
         urgentList
      }
   },
   methods: {
      
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
               <h1 class="m-0">Tablero</h1>
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
      <div class="card card-primary card-outline" v-for="item in urgentList" :key="item.id">
         <div class="card-header">
            <h5 class="m-0">{{item.department}}</h5>
         </div>
         <div class="card-body">
            <p class="card-text">{{item.request}}</p>
            <a class="btn btn-primary">Revisar</a>
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
</style>