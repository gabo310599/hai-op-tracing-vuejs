<script>

import axios from "axios";

const prueba = async () => {

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiM2ZhYmQ0Ny0yNWU3LTQ0MGQtYTkxYy1kMmZjN2Q1YjA0NmIiLCJpYXQiOjE2Nzk1MTYwOTAsImV4cCI6MTY3OTUxOTY5MH0.zm6usl0HELbEFz_pMRX3R_l0cNw0Y3FQs2i9WCldaU4";

    axios
        .get("http://localhost:3000/user")
        .then((res) => {
            console.log(res.data)
        })
        .catch((error) => {
            console.log(error);
        });

    console.log(data)
}

export default {
    data() {
        return {
            data: null
        }
    },
    methods: {
        dataTest() {
        }
    },
    created() {

        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiM2ZhYmQ0Ny0yNWU3LTQ0MGQtYTkxYy1kMmZjN2Q1YjA0NmIiLCJpYXQiOjE2Nzk1MTYwOTAsImV4cCI6MTY3OTUxOTY5MH0.zm6usl0HELbEFz_pMRX3R_l0cNw0Y3FQs2i9WCldaU4";

        axios
            .get("http://localhost:3000/user",
            {headers: { Authorization: `Bearer ${token}` }})
            .then((res) => {
                this.data = res.data;
            })
            .catch((error) => {
                console.log(error);
            });
    }
}

</script>

<template>
    <h1>Prueba</h1>

    {{ dataTest() }}

    {{ data.data }}
</template>