<script>

import { dashboardInfo } from '../../../../dataList';


let urgentList = [];
let notUrgentList = [];

//Llenamos la lista de urgente
const fillList = () =>{
   
   dashboardInfo.map(function(info){
      if(info.urgent == 1)
         urgentList.push(info);
      else
         notUrgentList.push(info);
   })

}

//Exports
export default {
   data() {
      return {
         urgentList,
         notUrgentList
      }
   },
   methods: {
      fillList
   }
}

</script>

<template>

   {{ fillList() }}
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
   <div class="content">
      <div class="container-fluid">
         <div class="row">
            <!--Aqui empieza la columna de la izquierda-->
            <div class="col-lg-6">
               <h2>Urgente:</h2>
               <div v-for="item in urgentList" :key="item.key" class="card card-primary card-outline">
                  <div class="card-header">
                     <h5 class="m-0">{{item.department}}</h5>
                  </div>
                  <div class="card-body">
                     <p class="card-text">Hay {{item.op_quantity}} ordenes que necesitan su atención</p>
                     <a :href="item.link" class="btn btn-primary">Revisar</a>
                  </div>
               </div>
            </div>
            <!--Aqui empieza la columna de la derecha-->
            <div class="col-lg-6">
               <h2>Revisar:</h2>
               <div v-for="item in notUrgentList" :key="item.key" class="card card-primary card-outline">
                  <div class="card-header">
                     <h5 class="m-0">{{item.department}}</h5>
                  </div>
                  <div class="card-body">
                     <p class="card-text">Hay {{item.op_quantity}} ordenes que necesitan su atención</p>
                     <a :href="item.link" class="btn btn-primary">Revisar</a>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>

</template>