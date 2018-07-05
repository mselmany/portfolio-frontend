import Vue from "vue";
import Router from "vue-router";

const Home = () => import("@/views/Home");
const Social = () => import("@/views/Social");
const Resume = () => import("@/views/Resume");
const Projects = () => import("@/views/Projects");
const Articles = () => import("@/views/Articles");

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/home",
      name: "home",
      component: Home
    },
    {
      path: "/social",
      name: "social",
      component: Social /* ,   // TODO@4: kendi alt sayfalarını yap; youtube veya soundcloud a özel player ın oldugu vs..
      children: [
        {
          path: "youtube",
          name: "youtube",
          component: Home
        }
      ] */
    },
    {
      path: "/resume",
      name: "resume",
      component: Resume
    },
    {
      path: "/projects",
      name: "projects",
      component: Projects
    },
    {
      path: "/articles",
      name: "articles",
      component: Articles
    },
    { path: "*", redirect: "/home" }
  ]
});

export default router;
