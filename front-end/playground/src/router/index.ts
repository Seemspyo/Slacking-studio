import Vue from "vue";
import VueRouter from "vue-router";
import Main from "@/views/Main.vue";
import AuthModule from '@/modules/auth.module';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'main',
    component: Main
  },
  {
    path: '/master',
    name: 'master',
    beforeEnter: async (to, from, next) => {
      if (AuthModule.sign) next();
      else next({ name: 'notfound', params: [ to.fullPath, '' ], replace: true });
    },
    component: () => import('@/views/Master.vue')
  },
  {
    path: '**',
    name: 'notfound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
