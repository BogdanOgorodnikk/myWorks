import Vue from "vue";
const idb = require("idb-keyval");

Vue.use(idb);

Vue.prototype.$idb = idb;

export default idb;
