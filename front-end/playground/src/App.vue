<template>
  <div id="playground" class="cookie">
    <router-view />
  </div>
</template>

<style lang="scss">
@import '@/fonts';
@import '@/variables';

* { margin: 0; border: 0; padding: 0; box-sizing: border-box; }
:root { width: 100%; height: 100%; }
body { width: 100%; height: 100%; overflow: { x: hidden; y: auto; } }

input, textarea, select, button { font-family: inherit; outline: none; }
a { text-decoration: none; }
li { list-style-type: none; }
.quicksand { font-family: 'Quicksand', "Nanum Gothic", sans-serif; }
.cookie { font-family: "CookieRun", cursive; }
.n-gothic { font-family: "Nanum Gothic", "Cookie Run", sans-serif; }

*::selection { background-color: $RED-ORANGE; color: #fff; }

#playground {
  width: 100%; min-height: 100%;
  display: flex;
  flex-direction: column;
}
</style>