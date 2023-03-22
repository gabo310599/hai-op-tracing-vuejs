<script>
  import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <div class="container" id="home">
      <div class="panel-body">
        <h1>Hai OP Tracing</h1>
    
        <br/>
         
        <RouterLink to="/prueba">
          <div>
            <button type="submit" class="btn btn-primary btn-lg btn-block">Ingresar</button>
          </div>
        </RouterLink>

        <br/>
    
        <RouterLink to="/admin/dashboard">
          <div>
            <button type="submit" class="btn btn-primary btn-lg btn-block">Administrar</button>
          </div>
        </RouterLink>
    
      </div>
    </div>
</template>