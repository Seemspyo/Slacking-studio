import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import AuthModule from './modules/auth.module';

Vue.config.productionTip = false;

const auth = new AuthModule();
auth.initialAuth();

new Vue({
  router,
  render: h => h(App)
}).$mount("#playground");