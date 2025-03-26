const fs = require("fs");
const path = require("path");
const { mergeWithRules } = require("webpack-merge");
import type { Configuration } from "webpack";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
import type { ProjectConfig } from "../types/types";

class ConfigManager {
  static async getProjectConfig(configPath?: string): Promise<ProjectConfig> {
    const defaultConfig: ProjectConfig = {
      baseConfig: {
        entry: "",
      },
      webpackConfig: {},
      devServerConfig: {},
    };

    try {
      if (!configPath) {
        return defaultConfig;
      }

      const configFullPath = path.resolve(process.cwd(), configPath);
      if (!fs.existsSync(configFullPath)) {
        return defaultConfig;
      }

      const config = require(configFullPath);
      return {
        baseConfig: config.baseConfig || {},
        webpackConfig: config.webpackConfig || {},
        devServerConfig: config.devServerConfig || {},
      };
    } catch (error) {
      console.error("Failed to load project config:", error);
      return defaultConfig;
    }
  }

  static mergeWebpackConfig(baseConfig: Configuration, customConfig: Configuration): Configuration {
    return mergeWithRules({
      module: {
        rules: {
          test: "match",
          use: "replace",
          include: "replace",
          exclude: "replace",
        },
      },
      plugins: {
        "*": {
          constructorName: "match", // 通过插件构造函数名匹配
          options: "replace", // 替换插件配置
        },
      },
      optimization: {
        minimize: "replace", // 替换压缩选项
        minimizer: "replace", // 替换压缩器
        splitChunks: {
          cacheGroups: {
            "*": {
              test: "match", // 匹配分块规则
              name: "replace", // 替换分块名称
              chunks: "replace", // 替换分块类型
              minSize: "replace", // 替换最小尺寸
              maxSize: "replace", // 替换最大尺寸
              minChunks: "replace", // 替换最小引用次数
            },
          },
        },
      },
    })(baseConfig, customConfig);
  }
}

function getStyleLoaders(preprocessor?: "less" | "sass") {
  const loaders: any[] = [
    {
      loader: "vue-style-loader",
    },
    {
      loader: "css-loader",
      options: {
        importLoaders: preprocessor ? 2 : 1,
        modules: false,
      },
    },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            [
              "postcss-preset-env",
              {
                stage: 3,
                features: {
                  "nesting-rules": true,
                },
              },
            ],
          ],
        },
      },
    },
  ];

  if (preprocessor) {
    loaders.push({
      loader: `${preprocessor}-loader`,
    });
  }

  return loaders;
}

module.exports = {
  ConfigManager,
  getStyleLoaders,
};
