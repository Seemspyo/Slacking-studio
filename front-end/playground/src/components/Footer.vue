<template>
    <footer class="playground-footer">
        <p class="playground-footer-copyright quicksand">ⓒ 2019. SeemsPyo all rights reserved.</p>
    </footer>
</template>

<style lang="scss" scoped>

    footer.playground-footer {
        margin: 80px 0 30px;

        p.playground-footer-copyright {
            font: {
                size: 0.9rem;
                weight: 600;
            }
            text-align: center;
            letter-spacing: 0.05rem;
        }

    }

</style>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class Footer extends Vue {

}
</script>