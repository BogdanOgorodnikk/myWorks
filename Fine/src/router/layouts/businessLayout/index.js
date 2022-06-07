import business from "./business";
import profile from "./profile";

const AppLayout = () => import(/* webpackChunkName: "appLayout" */ "@/layouts/_bit/app");

const businessLayout = [
  {
    path: "/business",
    name: "BusinessLayout",
    redirect: { name: "Business" },
    component: AppLayout,
    children: [...business, ...profile],
  },
];

export default businessLayout;
