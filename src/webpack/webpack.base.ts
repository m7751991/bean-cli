const path = require("path");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { ConfigManager, getStyleLoaders } = require("./utils");
import type { ProjectConfig, BaseConfig } from "../types/types";
import type { Configuration, Entry } from "webpack";

interface WebpackBaseOptions {
  mode?: "development" | "production";
  configPath?: string;
}

// 处理入口配置
function processEntry(entry: object | string): object {
  if (typeof entry === "string") {
    return { index: entry };
  }
  return entry;
}

// 生成 HTML 插件配置
function generateHtmlPlugins(entry: object, baseConfig: BaseConfig) {
  const templates = baseConfig.templates || {};
  const defaultTemplate = "./public/index.html";

  return Object.keys(entry).map((name) => {
    const template = templates[name]?.template || defaultTemplate;
    const title = templates[name]?.title || `${name} Page`;

    return new HtmlWebpackPlugin({
      template: path.resolve(process.cwd(), template),
      favicon: false,
      filename: `${name}.html`,
      title,
      cache: false,
      chunks: templates[name]?.chunks || "all",
      inject: true,
      templateParameters: {
        BASE_URL: "/",
      },
    });
  });
}

async function createBaseConfig(options: WebpackBaseOptions): Promise<{ resolve: { extensions: string[] }; plugins: Configuration["plugins"] }> {
  // 加载项目配置
  const projectConfig: ProjectConfig = await ConfigManager.getProjectConfig(options.configPath);
  const baseConfig = projectConfig.baseConfig;
  return {
    resolve: {
      extensions: getResolveExtensions(baseConfig),
    },
    plugins: await generatePlugins(baseConfig),
  };
}

// 处理文件扩展名配置
function getResolveExtensions(baseConfig: BaseConfig): string[] {
  const defaultExtensions = [".tsx", ".ts", ".js", ".json", ".vue", ".css", ".scss", ".less"];
  return [...new Set(defaultExtensions.concat(baseConfig.extensions || []))];
}

// 处理入口配置
async function processEntryConfig(baseConfig: BaseConfig) {
  const entry = processEntry(baseConfig.entry);

  if (typeof entry === "object" && Object.keys(entry).length > 1 && !baseConfig.templates) {
    throw new Error("多入口配置时必须指定 baseConfig.templates");
  }

  return entry;
}

// 生成插件配置
async function generatePlugins(baseConfig: BaseConfig) {
  const entry = await processEntryConfig(baseConfig);
  const htmlPlugins = generateHtmlPlugins(entry, baseConfig);

  return [...htmlPlugins, new webpack.DefinePlugin(baseConfig.define || {}), new CleanWebpackPlugin(), new VueLoaderPlugin()];
}

module.exports = async (options: WebpackBaseOptions = {}) => {
  // 1. 加载项目配置
  const projectConfig: ProjectConfig = await ConfigManager.getProjectConfig(options.configPath);
  // // 2. 处理基础配置
  const { alias, build, publicPath, entry } = projectConfig.baseConfig;
  const { resolve, plugins } = await createBaseConfig(options);
  // 3. 构建 webpack 配置
  const webpackBaseConfig: Configuration = {
    entry: (entry as Entry) || "./src/main.js",
    output: {
      path: path.resolve(process.cwd(), build || "dist"),
      filename: process.env.NODE_ENV === "production" ? "js/[name].[contenthash:8].js" : "js/[name].js",
      chunkFilename: process.env.NODE_ENV === "production" ? "js/[name].[contenthash:8].chunk.js" : "js/[name].chunk.js",
      publicPath: publicPath || "/",
      clean: true,
    },
    resolve: {
      extensions: resolve?.extensions,
      alias: Object.assign(
        {
          "@": path.resolve(process.cwd(), "./src"),
        },
        alias || {}
      ),
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env"],
                // cacheDirectory: true,
              },
            },
          ],
          include: path.resolve(process.cwd(), "./src"),
          exclude: /node_modules/,
        },
        {
          test: /\.vue$/,
          use: [
            {
              loader: "vue-loader",
              options: {
                hotReload: true, // 启用热重载
                exposeFilename: true,
                extractCSS: false, // 开发环境不提取CSS
              },
            },
          ],
          include: path.resolve(process.cwd(), "./src"),
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: getStyleLoaders(),
        },
        {
          test: /\.scss$/,
          use: getStyleLoaders("sass"),
        },
        {
          test: /\.less$/,
          use: getStyleLoaders("less"),
        },
        {
          test: /\.(png|jpe?g|gif|webp|svg)$/i,
          type: "asset/resource",
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024, // 8kb
            },
          },
          generator: {
            filename: "images/[hash][ext][query]",
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: "asset/resource",
          generator: {
            filename: "fonts/[hash][ext][query]",
          },
        },
      ],
    },
    plugins,
    optimization: {
      splitChunks: {
        chunks: "all",
        name: false,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
            priority: -10,
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            priority: 0,
          },
        },
      },
    },
  };
  return webpackBaseConfig;
};
