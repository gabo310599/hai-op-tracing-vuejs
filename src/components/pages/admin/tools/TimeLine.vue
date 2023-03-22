<script>

    const dataTimeLine = [
        {
            key: 1,
            process: "Diseño Gráfico",
            date_in: "02/12/2022",
        },
        {
            key: 2,
            process: "Diseño Textil",
            date_in: "04/12/2022",
        },
        {
            key: 3,
            process: "Generar OP",
            date_in: "06/12/2022",
        },
        {
            key: 4,
            process: "Imprimir OP",
            date_in: "08/12/2022",
        },
        
    ];

    let counter = 1;

    //Exports
    export default{
        props: [
            'opSelected'
        ],
        methods:{
            incrementCounter() {
                return counter++;
            },
            resetCounter() {
                counter = 1;
            },
            prueba(){
                console.log(dataTimeLine)
            }    
        },
        data(){
            return{
                dataTimeLine
            }
        }
    }
</script>

<template>
    {{ resetCounter() }}
    <!--Time Line-->
    <div class="container">
        <div class="row text-center justify-content-center mb-3">
            <div class="col-xl-6 col-lg-8">
                <h2 class="font-weight-bold">Mapa OP: {{opSelected.number}}</h2>
                <p class="text-muted">
                    {{ opSelected.description }}
                </p>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <div class="timeline-steps aos-init aos-animate" data-aos="fade-up">
                    <div class="timeline-step" v-for="data in dataTimeLine" :key="data.key">
                        <div class="timeline-content">
                            <div class="inner-circle"></div>
                            <div class="font-weight-bold">{{incrementCounter()}}°</div>
                            <p class="h6 mt-3 mb-1">{{data.process}}</p>
                            <p class="h6 text-muted mb-0 mb-lg-0">Fecha de entrada: {{data.date_in}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<style>

    .center-text {
        text-align: center;
    }

    .timeline-steps {
        display: flex;
        justify-content: center;
        flex-wrap: wrap
    }

    .timeline-steps .timeline-step {
        align-items: center;
        display: flex;
        flex-direction: column;
        position: relative;
        margin: 1rem
    }

    @media (min-width:768px) {
        .timeline-steps .timeline-step:not(:last-child):after {
            content: "";
            display: block;
            border-top: .25rem dotted #3b82f6;
            width: 2.9rem;
            position: absolute;
            left: 4.3rem;
            top: .3125rem
        }

    }

    .timeline-steps .timeline-content {
        width: 4.8rem;
        text-align: center
    }

    .timeline-steps .timeline-content .inner-circle {
        border-radius: 1.5rem;
        height: 1rem;
        width: 1rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: #3b82f6
    }

    .timeline-steps .timeline-content .inner-circle:before {
        content: "";
        background-color: #3b82f6;
        display: inline-block;
        height: 3rem;
        width: 3rem;
        min-width: 3rem;
        border-radius: 6.25rem;
        opacity: .5
    }

</style>