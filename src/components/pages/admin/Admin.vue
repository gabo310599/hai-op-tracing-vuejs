<script>

import { RouterView } from 'vue-router'
import { userList, opList } from '../../../dataList';

//Exports
export default {
   data() {
      return {
         RouterView,
         opList,
         userList
      }
   }
}

</script>

<template>
   <div class="wrapper" id="admin">

      <!--Aqui comienza el nav bar-->
      <nav class="main-header navbar navbar-expand navbar-white navbar-light">
         <ul class="navbar-nav">
            <li class="nav-item">
               <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
            </li>
            <li class="nav-item d-none d-sm-inline-block">
               <a href="/admin/dashboard" class="nav-link">Home</a>
            </li>
            <li class="nav-item d-none d-sm-inline-block">
               <a href="/admin/contact" class="nav-link">Contact</a>
            </li>
         </ul>
         <ul class="navbar-nav ml-auto">
            <li class="nav-item dropdown">
               <a class="nav-link" data-widget="fullscreen" href="#" role="button">
                  <i class="fas fa-expand-arrows-alt"></i>
               </a>
            </li>
            <li class="nav-item">
               <a class="nav-link" data-widget="control-sidebar" data-slide="true" href="#" role="button">
                  <i class="fas fa-th-large"></i>
               </a>
            </li>
         </ul>
      </nav>

      <!--Aqui comienza la sidebar de la izquierda -->
      <aside class="main-sidebar sidebar-dark-primary elevation-4">
         <a href="/admin/contact" class="brand-link">
            <img src="https://adminlte.io/themes/v3/dist/img/AdminLTELogo.png" alt="AdminLTE Logo"
               class="brand-image img-circle elevation-3" style="opacity: .8">
            <span class="brand-text font-weight-light">Hai OP Tracing</span>
         </a>
         <div class="sidebar">
            <div class="user-panel mt-3 pb-3 mb-3 d-flex">
               <div class="image">
                  <img src="https://adminlte.io/themes/v3/dist/img/user2-160x160.jpg" class="img-circle elevation-2"
                     alt="User Image">
               </div>
               <div class="info">
                  <a href="#" class="d-block">Gabo310599</a>
               </div>
            </div>

            <nav class="mt-2">
               <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

                  <!-- Tablero -->
                  <li class="nav-item">
                     <a href="/admin/dashboard" class="nav-link">
                        <i class="nav-icon fas fa-tachometer-alt"></i>
                        <p>
                           Tablero
                        </p>
                     </a>
                  </li>

                  <!-- Usuario -->
                  <li class="nav-item">
                     <a href="/admin/user/" class="nav-link">
                        <i class="nav-icon fas fa-solid fa-user"></i>
                        <p>
                           Usuario
                        </p>
                     </a>
                  </li>

                  <!-- Salir -->
                  <li class="nav-item">
                     <a href="/" class="nav-link">
                        <i class="nav-icon fas fa-solid fa-door-open"></i>
                        <p>
                           Salir
                        </p>
                     </a>
                  </li>

                  <div class="hr_for_sidebar"></div>

                  <!-- Diseño Gráfico -->
                  <li class="nav-item">
                     <a href="/admin/graphic-design" class="nav-link">
                        <i class="nav-icon fas fa-regular fa-pen"></i>
                        <p>
                           Diseño Gráfico
                           <span class="right badge-pill badge-success">6</span>
                        </p>
                     </a>
                  </li>

                  <!-- Diseño Textil -->
                  <li class="nav-item">
                     <a href="/admin/textile-design" class="nav-link">
                        <i class="nav-icon fas fa-solid fa-ruler-vertical"></i>
                        <p>
                           Diseño Textil
                           <span class="right badge-pill badge-warning">10</span>
                        </p>
                     </a>
                  </li>

                  <!-- Generar OP -->
                  <li class="nav-item">
                     <a href="/admin/generate-op" class="nav-link">
                        <i class="nav-icon fas fa-solid fa-plus"></i>
                        <p>
                           Generar OP
                           <span class="right badge-pill badge-warning">7</span>
                        </p>
                     </a>
                  </li>

                  <!-- Imprimir OP -->
                  <li class="nav-item">
                     <a href="/admin/print-op" class="nav-link">
                        <i class="nav-icon fas fa-solid fa-print"></i>
                        <p>
                           Imprimir OP
                           <span class="right badge-pill badge-success">4</span>
                        </p>
                     </a>
                  </li>

                  <!-- Tejeduría MQ-->
                  <li class="nav-item">
                     <a href="/admin/weaving" class="nav-link">
                        <i class="nav-icon fas fa-solid fa-tag"></i>
                        <p>
                           Tejeduría
                           <span class="right badge-pill badge-danger">15</span>
                        </p>
                     </a>
                  </li>

                  <!-- Enrollado MQ-->
                  <li class="nav-item">
                     <a href="/admin/rolled-up" class="nav-link">
                        <i class="nav-icon fas fa-solid fa-spinner"></i>
                        <p>
                           Enrollado
                           <span class="right badge-pill badge-success">6</span>
                        </p>
                     </a>
                  </li>

                  <!-- Corte MQ-->
                  <li class="nav-item">
                     <a href="/admin/cuting" class="nav-link">
                        <i class="nav-icon fas fa-solid fa-hand-scissors"></i>
                        <p>
                           Corte
                           <span class="right badge-pill badge-success">1</span>
                        </p>
                     </a>
                  </li>

                  <!-- Control de calidad -->
                  <li class="nav-item">
                     <a href="/admin/quality" class="nav-link">
                        <i class="nav-icon fas fa-solid fa-check"></i>
                        <p>
                           Control de Calidad
                           <span class="right badge-pill badge-success">4</span>
                        </p>
                     </a>
                  </li>

                  <!-- Facturación -->
                  <li class="nav-item">
                     <a href="/admin/receipt" class="nav-link">
                        <i class="nav-icon fas fa-solid fa-receipt"></i>
                        <p>
                           Facturación
                           <span class="right badge-pill badge-success">4</span>
                        </p>
                     </a>
                  </li>

                  <!-- Despacho -->
                  <li class="nav-item">
                     <a href="/admin/dispatch" class="nav-link">
                        <i class="nav-icon fas fa-solid fa-truck"></i>
                        <p>
                           Despacho
                           <span class="right badge-pill badge-success">4</span>
                        </p>
                     </a>
                  </li>
               </ul>
            </nav>
         </div>
      </aside>

      <div class="content-wrapper">
         <RouterView />

      </div>

      <aside class="control-sidebar control-sidebar-dark">
         <div class="p-3">
            <h5>Title</h5>
            <p>Sidebar content</p>
         </div>
      </aside>

      <footer class="main-footer">
         <div class="float-right d-none d-sm-inline">
            Anything you want
         </div>
         <strong>Copyright &copy; 2014-2021 <a href="https://adminlte.io">AdminLTE.io</a>.</strong> All rights reserved.
      </footer>
   </div>
</template>