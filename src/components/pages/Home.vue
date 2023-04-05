<script>

import { RouterLink } from 'vue-router';
import Cookies from "js-cookie";
import Sign_Up from "./tools/Sign_Up.vue"

let path = "default";


//Exportar
export default{
  data(){
    return{
      path
    }
  },
  methods:{
    fillPath(path, token){
      this.path = path;
    }  
  },
  created(){
    Cookies.remove('userLogged');
  },
  components:{
    Sign_Up
  }
}
</script>

<template>
    
  <div class="wrapper" id="home">
    <div class="panel-body">

      <!--Aqui comienza el nav bar-->
      <nav class="navbar navbar-expand navbar navbar-dark bg-dark">
        <ul class="navbar-nav">
           <li class="nav-item d-none d-sm-inline-block">
              <a class="nav-link font-weight-bold" data-toggle="modal" data-target="#CreateUserModal">CREAR USUARIO</a>
           </li>
        </ul>
        <ul class="navbar-nav ml-auto">
           <li class="nav-item dropdown">
              <a class="nav-link" data-widget="fullscreen" href="#" role="button">
                 <i class="fas fa-expand-arrows-alt"></i>
              </a>
           </li>
        </ul>
     </nav>
      
     <div class="home-background">
      <div class="home-container">
        <br />
        <h1 class="font-weight-bold">Hai OP Tracing</h1>
        <br />

        <!--OPERADORES-->
        <RouterLink to="/operator/check-out">
          <div>
            <button type="submit" class="btn btn-success btn-lg btn-block">
              Operador
            </button>
          </div>
        </RouterLink>

        <br />

        <!--ADMIN-->
        <RouterLink to="/admin/dashboard">
          <div>
            <button type="submit" class="btn btn-success btn-lg btn-block">
              Administrador
            </button>
          </div>
        </RouterLink>

        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="CreateUserModal" tabindex="-1" role="dialog" aria-labelledby="CreateUserModalLabel" aria-hidden="true">
    <Sign_Up />
  </div>



</template>

<style>

.home-container{
  position:absolute;
  top: 45%;
  left: 50%;
  transform:  translate(-50%, -50%);
  width: 400px;
  text-align: center;
  border-radius: 10px;
  padding-top: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
}

.home-background{
  margin: 0; 
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  min-height: 100vh;
  background: #2980B9;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to top, #FFFFFF, #6DD5FA, #2980B9);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to top, #FFFFFF, #6DD5FA, #2980B9); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

}
</style>