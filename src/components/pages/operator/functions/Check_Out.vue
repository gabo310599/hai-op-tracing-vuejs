<script>

import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';

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

export default{
    data(){
        return{
            completeAccess,
            permissions,
            operator_id
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
                    
                    this.operator_id = res.data.data.operator_id;

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
                        console.log(res.data.data)
                    })
                    .catch((error) => {
                        console.log(error.message);
                    });

            }

        }

    },
    async created(){
        await this.verifyUser();
    }
}

</script>

<template>
    <div class="check-out-container">

        <!--DISEÑO GRAFICO-->
        <div class="card card-primary card-outline">
            <div class="card-header">
               <h3 class="m-0 font-weight-bold">Diseño Gráfico</h3>
            </div>
            <div class="card-body">
               <ul class="list-group">
                  <li class="list-group-item list-group-item-secondary">
                    <p>
                        Total pedidos en el departamento: 
                    </p>
                    <a class="card-text font-weight-bold">
                        REVISAR
                    </a>
                  </li>
               </ul>
            </div>
         </div>


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