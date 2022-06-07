const path = require("path");

const twConfigPath = path.resolve(__dirname, "tailwind.config.js");
const twConfig = require(twConfigPath);

module.exports = {
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
    name: "Fin\u00e9",
    themeColor: twConfig.theme.colors.base.dark,
    msTileColor: twConfig.theme.colors.base.dark,
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black-translucent",
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "./src/service-worker.js",
      exclude: [/\.htaccess$/, /\.map$/],
    },
    manifestOptions: {
      name: "Fin\u00e9",
      short_name: "Fin\u00e9",
      display: "standalone",
      theme_color: twConfig.theme.colors.base.dark,
      background_color: twConfig.theme.colors.base.dark,
      icons: [
        {
          src: "static/favicons/icon-48x48.png",
          sizes: "48x48",
          type: "image/png",
        },
        {
          src: "static/favicons/icon-57x57.png",
          sizes: "57x57",
          type: "image/png",
        },
        {
          src: "static/favicons/icon-60x60.png",
          sizes: "60x60",
          type: "image/png",
        },
        {
          src: "static/favicons/icon-72x72.png",
          sizes: "72x72",
          type: "image/png",
        },
        {
          src: "static/favicons/icon-76x76.png",
          sizes: "76x76",
          type: "image/png",
        },
        {
          src: "static/favicons/icon-96x96.png",
          sizes: "96x96",
          type: "image/png",
        },
        {
          src: "static/favicons/icon-114x114.png",
          sizes: "114x114",
          type: "image/png",
        },
        {
          src: "static/favicons/icon-120x120.png",
          sizes: "120x120",
          type: "image/png",
        },
        {
          src: "static/favicons/icon-128x128.png",
          sizes: "128x128",
          type: "image/png",
        },
        {
          src: "static/favicons/icon-144x144.png",
          sizes: "144x144",
          type: "image/png",
        },
        {
          src: "static/favicons/icon-152x152.png",
          sizes: "152x152",
          type: "image/png",
        },
        {
          src: "static/favicons/icon-180x180.png",
          sizes: "180x180",
          type: "image/png",
        },
        {
          src: "static/favicons/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "static/favicons/icon-256x256.png",
          sizes: "256x256",
          type: "image/png",
        },
        {
          src: "static/favicons/icon-348x348.png",
          sizes: "348x348",
          type: "image/png",
        },
        {
          src: "static/favicons/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    iconPaths: {
      faviconSVG: "static/favicons/favicon.svg",
      favicon32: "static/favicons/icon-32x32.png",
      favicon16: "static/favicons/icon-16x16.png",
      appleTouchIcon: "static/favicons/icon-152x152.png",
      maskIcon: "static/favicons/safari-pinned-tab.svg",
      msTileImage: "static/favicons/icon-144x144.png",
    },
  },
};
