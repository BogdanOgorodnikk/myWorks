import notFound from "./notFound";
import forbidden from "./forbidden";

const ErrorLayout = () => import(/* webpackChunkName: "error" */ "@/layouts/error");

const errorLayout = [
  {
    path: "/",
    name: "ErrorLayout",
    component: ErrorLayout,
    children: [...notFound, ...forbidden],
  },
];

export default errorLayout;
