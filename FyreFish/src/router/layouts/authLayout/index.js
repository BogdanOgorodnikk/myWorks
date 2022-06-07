import login from "./login";
import signup from "./signup";
import contactUs from "./contactUs";

const AuthLayout = () => import(/* webpackChunkName: "auth" */ "@/layouts/auth");

const authLayout = [
  {
    path: "/",
    name: "AuthLayout",
    redirect: { name: "Login" },
    component: AuthLayout,
    children: [...login, ...signup, ...contactUs],
  },
];

export default authLayout;
