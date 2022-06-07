import login from "./login";
import signup from "./signup";
import forgot from "./forgot";

const AuthLayout = () => import(/* webpackChunkName: "authLayout" */ "@/layouts/_bit/auth");

const authLayout = [
  {
    path: "/",
    name: "AuthLayout",
    redirect: { name: "Login" },
    component: AuthLayout,
    children: [...login, ...signup, ...forgot],
  },
];

export default authLayout;
