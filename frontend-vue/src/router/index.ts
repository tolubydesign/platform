import { createRouter, createWebHistory } from "vue-router";
import MainView from "@/views/MainView.vue";
import NavigationalHeader from "@/components/layout/header/NavigationalHeader.vue";
import { getLoginInformation } from "@/helpers/auth/login-auth.js";

const routes = [
  {
    path: "/",
    name: "main",
    component: MainView,
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/views/AboutView.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    components: {
      default: () => import("@/views/DashboardView.vue"),
      NavigationalHeader: NavigationalHeader,
    },
  },
  {
    path: "/chat",
    name: "chat",
    components: {
      default: () => import("@/views/ChatView.vue"),
      NavigationalHeader: NavigationalHeader,
    },
  },
  {
    path: "/chat/:id",
    name: "chats",
    components: {
      default: () => import("@/views/ChatChannelView.vue"),
      NavigationalHeader: NavigationalHeader,
    },
  },
  {
    path: "/settings",
    name: "settings",
    components: {
      default: () => import("@/views/SettingsView.vue"),
      NavigationalHeader: NavigationalHeader,
    },
  },
  {
    path: "/project",
    name: "project",
    components: {
      default: () => import("@/views/ProjectsView.vue"),
      NavigationalHeader: NavigationalHeader,
    },
  },
  {
    path: "/project/:id",
    name: "projects",
    components: {
      default: () => import("@/views/ProjectPackView.vue"),
      NavigationalHeader: NavigationalHeader,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ["/", "/home", "/about"];
  const authRequired = !publicPages.includes(to.path);
  const { token } = getLoginInformation();

  if (!token && authRequired) {
    console.error("Router Error: token not found.");
    return next("/");
  }

  if (!authRequired) return next();
  next();
});

export default router;
