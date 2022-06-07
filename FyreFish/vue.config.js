const path = require("path");

const apiPrefix = process.env.VUE_APP_REST_API_PREFIX;

module.exports = {
  devServer: {
    port: 4000,
    proxy: {
      [apiPrefix]: {
        target: process.env.VUE_APP_DOMAIN,
      },
    },
  },
  publicPath: process.env.VUE_APP_PATH,
  outputDir: path.resolve(__dirname, process.env.VUE_APP_OUTPUT_DIR),
  indexPath: "index.html",
  configureWebpack: {
    resolve: {
      alias: {
        vue$: "vue/dist/vue.runtime.esm.js",
      },
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule("i18n")
      .resourceQuery(/blockType=i18n/)
      .type("javascript/auto")
      .use("i18n")
      .loader("@intlify/vue-i18n-loader")
      .end()
      .use("yaml")
      .loader("yaml-loader")
      .end();
  },
  css: {
    loaderOptions: {
      postcss: {
        postcssOptions: {
          path: __dirname,
        },
      },
    },
  },
  pwa: {
    name: "Fyrefish",
    themeColor: "#181C32",
    msTileColor: "#181C32",
    manifestOptions: {
      name: "Fyrefish",
      short_name: "Fyrefish",
      display: "standalone",
      theme_color: "#181C32",
      background_color: "#181C32",
      icons: [
        {
          src: "media/favicons/icon-48x48.png",
          sizes: "48x48",
          type: "image/png",
        },
        {
          src: "media/favicons/icon-57x57.png",
          sizes: "57x57",
          type: "image/png",
        },
        {
          src: "media/favicons/icon-60x60.png",
          sizes: "60x60",
          type: "image/png",
        },
        {
          src: "media/favicons/icon-72x72.png",
          sizes: "72x72",
          type: "image/png",
        },
        {
          src: "media/favicons/icon-76x76.png",
          sizes: "76x76",
          type: "image/png",
        },
        {
          src: "media/favicons/icon-96x96.png",
          sizes: "96x96",
          type: "image/png",
        },
        {
          src: "media/favicons/icon-114x114.png",
          sizes: "114x114",
          type: "image/png",
        },
        {
          src: "media/favicons/icon-120x120.png",
          sizes: "120x120",
          type: "image/png",
        },
        {
          src: "media/favicons/icon-128x128.png",
          sizes: "128x128",
          type: "image/png",
        },
        {
          src: "media/favicons/icon-144x144.png",
          sizes: "144x144",
          type: "image/png",
        },
        {
          src: "media/favicons/icon-152x152.png",
          sizes: "152x152",
          type: "image/png",
        },
        {
          src: "media/favicons/icon-180x180.png",
          sizes: "180x180",
          type: "image/png",
        },
        {
          src: "media/favicons/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "media/favicons/icon-256x256.png",
          sizes: "256x256",
          type: "image/png",
        },
        {
          src: "media/favicons/icon-348x348.png",
          sizes: "348x348",
          type: "image/png",
        },
        {
          src: "media/favicons/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    iconPaths: {
      favicon32: "media/favicons/icon-32x32.png",
      favicon16: "media/favicons/icon-16x16.png",
      appleTouchIcon: "media/favicons/icon-152x152.png",
      maskIcon: "media/favicons/safari-pinned-tab.svg",
      msTileImage: "media/favicons/icon-144x144.png",
    },
  },
};
