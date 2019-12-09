<template>
  <div id="playground" class="cookie">
    <router-view />
  </div>
</template>

<style lang="scss">
@import '@/fonts';

* { margin: 0; border: 0; padding: 0; box-sizing: border-box; }
:root { width: 100%; height: 100%; }
body { width: 100%; height: 100%; overflow: { x: hidden; y: auto; } }

input, textarea, select, button { font-family: inherit; outline: none; }
.quicksand { font-family: 'Quicksand', sans-serif; }
.cookie { font-family: "CookieRun", cursive; }

#playground {
  width: 100%; min-height: 100%;
  display: flex;
  flex-direction: column;
}
</style>