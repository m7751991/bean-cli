import path from "path";
// import { ModuleFederationPlugin } from "webpack/container";
// import { processEnv } from "./config/process.env"; // 环境参数
// const env = process.env.npm_lifecycle_event.replace("build:", "").trim();
const envInfo = {
  VUE_APP_NAME: "蜂享家CRM",
  VUE_APP_API_BASE_URL: "http://localhost:8848",
  VUE_APP_ENV: "development",
  BASE_URL: "/",
};
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const resolve = (dir) => path.join(__dirname, dir);

export default {
  baseConfig: {
    entry: {
      index: "./src/main.js",
    },
    // HTML 模板配置
    templates: {
      index: {
        template: "./public/index.html",
        favicon: "./public/favicon.ico",
        title: "首页",
        chunks: ["index", "vendors", "common", "element"],
      },
      admin: {
        template: "./public/admin.html",
        title: "管理后台",
        chunks: ["admin", "vendors", "common", "element"],
      },
    },
    build: "dist",
    publicPath: "/",
    extensions: [".tsx", ".ts", ".js", ".json", ".vue", ".css", ".scss", ".less"],
    alias: {
      "@scss": resolve("src/styles"),
      "@util": resolve("src/utils"),
      "@const": resolve("src/constants"),
      "@img": resolve("src/assets/img"),
      "@components": resolve("src/components"),
      "@assets": resolve("src/assets"),
    },
    define: {
      "process.env": JSON.stringify(envInfo),
      VUE_APP_NAME: "蜂享家CRM",
      VUE_APP_API_BASE_URL: envInfo.VUE_APP_API_BASE_URL,
      VUE_APP_ENV: envInfo.VUE_APP_ENV,
      VUE_APP_ASSETS_PATH: envInfo.VUE_APP_ASSETS_PATH,
    },
  },
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },

    plugins: [],
    optimization: {
      splitChunks: {
        cacheGroups: {
          fixed: {
            chunks: "all",
            name: "fixed",
            test: (module, chunks) => /\/node_modules\/vue\/dist|vuex|vue-router|axios/.test(module.context),
            priority: 11,
          },
        },
      },
    },
  },
  devSeverConfig: {
    port: 8848,
    https: false,
  },
};
