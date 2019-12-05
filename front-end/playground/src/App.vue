<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <!-- <router-link to="/about">About</router-link> -->
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
* { margin: 0; border: 0; padding: 0; box-sizing: border-box; }
:root { width: 100%; height: 100%; }
body { width: 100%; height: 100%; overflow: { x: hidden; y: auto; } }
</style>