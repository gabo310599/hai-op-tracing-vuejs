<script>

import axios from "axios";



//Exports
export default {
    data() {
        return {
            data: null,
        }
    },
    methods:{
        printIds(){
            return this.data.map(function(row){row.id})
        }
    },
    async created() {

        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MDMxYTJmZS0yZjY0LTQxMGEtYjhkYi0wMDNhMWRmOGU3ODQiLCJpYXQiOjE2Nzk1ODA0NzksImV4cCI6MTY3OTU4NDA3OX0.6MnrjTQT0ZdFj30cLwHvXZeZCKHXb04jTLcRjJCtmRE"         
        await axios
            .get("http://localhost:3000/user",
            {headers: { Authorization: `Bearer ${token}` }})
            .then((res) => {
                this.data = res.data.data;
            })
            .catch((error) => {
                console.log(error);
            });
    }
}

</script>

<template>
    <h1>Prueba</h1>
</template>