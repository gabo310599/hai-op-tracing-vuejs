<script>

import { userList } from '../../../../dataList';

let userInfo = [];
let space = ' ';

//Exports
export default {
    props: [
        'infoModalProcess'
    ],
    data() {
        return{
            userInfo,
            space
        }
    },
    methods: {
        fillUserInfo(info) {
            userList.map(function (user) {
                if (user.user == info.operator_user)
                    userInfo = user;
            });
            this.userInfo = userInfo;
        }
    }
}

</script>

<template>
    {{ fillUserInfo(infoModalProcess) }}
    <div class="center-text">
        <form>
            <div class="form-group">
                <label for="process/op_number_input">Número de OP</label>
                <input class="form-control" id="process/op_number_input" :value="infoModalProcess.number" readonly>
            </div>
            <div class="form-group">
                <label for="process/department_input">Departamento</label>
                <input class="form-control" id="process/department_input" :value="infoModalProcess.department" readonly>
            </div>
            <div class="form-group">
                <label for="process/operator_name_input">Nombre Operario</label>
                <input class="form-control" id="process/operator_name_input" :value="userInfo.name + space + userInfo.last_name" readonly>
            </div>
            <div class="form-group">
                <label for="process/operator_user_input">Usuario Operario</label>
                <input class="form-control" id="process/operator_user_input" :value="userInfo.user" readonly>
            </div>
            <div class="form-group">
                <label for="process/machine_name_input">Nombre Maquina</label>
                <input class="form-control" id="process/machine_name_input" value="Nombre Maquina" readonly>
            </div>
            <div class="form-group">
                <label for="process/machine_brand_input">Marca Maquina</label>
                <input class="form-control" id="process/machine_brand_input" value="Marca Maquina" readonly>
            </div>
            <div class="form-group">
                <label for="process/machine_model_input">Modelo Maquina</label>
                <input class="form-control" id="process/machine_model_input" value="Modelo Maquina" readonly>
            </div>
            <div class="form-group">
                <label for="process/date_in_input">Fecha Ingreso</label>
                <input class="form-control" id="process/date_in_input" value="02/12/2022" readonly>
            </div>
        </form>
    </div>
</template>