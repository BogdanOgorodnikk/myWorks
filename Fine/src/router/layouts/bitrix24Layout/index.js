import bitrix24Auth from "./bitrix24Auth";

const Bitrix24Layout = () => import(/* webpackChunkName: "bitrix24Auth" */ "@/layouts/bitrix24");

const bitrix24Layout = [
  {
    path: "/",
    name: "Bitrix24Layout",
    redirect: { name: "Bitrix24SignUp" },
    component: Bitrix24Layout,
    children: [...bitrix24Auth],
  },
];

export default bitrix24Layout;
