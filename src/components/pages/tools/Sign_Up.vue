<script>

import axios from "axios";

let name = "";
let last_name = "";
let user_name = "";
let password = "";
let confirmPassword = "";
let rol = ""

export default{
    data(){
        return{
            name,
            last_name,
            user_name,
            password,
            confirmPassword,
            rol
        }       
    },
    methods:{

        //Metodo que crea el registro de usuario en la BD
        async signUp(){

            //Validacion nombre
            if(!this.name){
                alert("Por favor introduzca su nombre.")
                return
            }

            //Validacion apellido
            if(!this.last_name){
                alert("Por favor introduzca su apellido.")
                return
            }

            //Validacion usuario
            if(!this.user_name){
                alert("Por favor introduzca un nombre de usuario valido")
                return
            }

            //Validamos que el nombre de usuario no exista
            await axios
            .get("http://localhost:3000/user/exist/"+this.user_name)
            .then((res) => {
                if(res.data){
                    alert("El nombre de usuario ya se encuentra registrado.");
                    return;
                }
            })
            .catch((error) => {
                console.log(error.message);
                alert("Error: "+error.response.data.message);
            });

            //Validamos la password
            if(!this.password){
                alert("Por favor introduce una contraseña.");
                return
            }

            //Validamos la confirmacion de la password
            if(!this.confirmPassword){
                alert("Por favor confirmar la contraseña introducida.")
                return
            }

            //Validamos que ambas passwords sean iguales
            if(this.password != this.confirmPassword){
                alert("Las contraseñas no coinciden.")
                return
            }

            //Creamos el operario
            let operator_id = "";
            await axios
            .post("http://localhost:3000/operator",{
                name: this.name,
                last_name: this.last_name
            })
            .then((res) => {
                operator_id = res.data.data.id;
            })
            .catch((error) => {
                console.log(error.message);
                alert("Error: "+error.response.data.message);
            });

            //Creamos el usuario
            await axios
            .post("http://localhost:3000/user",{
                user_name: this.user_name,
                password: this.password,
                roles: [document.getElementById("rol").value],
                operator_id: operator_id
            })
            .then((res) => {
                this.name = "";
                this.last_name = "";
                this.user_name = "";
                this.password = "";
                this.confirmPassword = "";
                alert("Usuario creado con exito");
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

    <!-- Modal -->
    
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title" id="CreateUserModalLabel">Crear Usuario</h2>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div>
                        <form>
                            <div class="form-group">
                                <label for="create_user/name_input">Nombre:</label>
                                <input class="form-control" id="create_user/name_input" v-model="name">
                            </div>
                            <div class="form-group">
                                <label for="create_user/last_name_input">Apellidos:</label>
                                <input class="form-control" id="create_user/last_name_input" v-model="last_name">
                            </div>
                            <div class="form-group">
                                <label for="create_user/user_input">Usuario:</label>
                                <input class="form-control" id="create_user/user_input" v-model="user_name">
                            </div>
                            <div class="form-group">
                                <label for="create_user/roles_input">Rol:</label>
                                <select class="form-select" aria-label="Default select example" id="rol">
                                    <option value="AUTHOR">Author</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="create_user/password_input">Contraseña:</label>
                                <input type="password" class="form-control" id="create_user/password_input" v-model="password">
                            </div>
                            <div class="form-group">
                                <label for="create_user/confirm_password_input">Confirmar contraseña:</label>
                                <input type="password" class="form-control" id="create_user/confirm_password_input" v-model="confirmPassword">
                            </div>
                        </form>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" v-on:click="signUp()">Crear</button>
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Salir</button>
                </div>
            </div>
        </div>
    

</template>