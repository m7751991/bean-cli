const path = require("path");
const { mergeWithRules } = require("webpack-merge");
const baseConfig = require("./webpack.base");
const createDevConfig = require("./webpack.dev");
const createProdConfig = require("./webpack.prod");
const { ConfigManager } = require("./utils");
import type { Configuration } from "webpack";

interface WebpackOptions {
  mode?: "development" | "production";
  configPath?: string;
}

/**
 * 获取完整的webpack配置
 * @param options 配置选项
 * @returns webpack配置对象
 */
async function getWebpackConfig(options: WebpackOptions = {}): Promise<Configuration> {
  const { mode, configPath } = options;
  try {
    // 2. 获取项目基础配置configPath 项目配置文件目录
    const baseWebpackConfig = await baseConfig({ configPath });
    // 3. 获取环境特定配置
    const envConfig = mode === "production" ? await createProdConfig({ configPath }) : await createDevConfig({ configPath });

    // 4. 使用自定义合并规则基础配置和环境配置合并
    const mergedConfig = mergeWithRules({
      module: {
        rules: {
          test: "match",
          use: "replace",
          include: "replace",
          exclude: "replace",
        },
      },
      plugins: "append",
      resolve: {
        alias: "merge",
      },
      optimization: {
        minimizer: "replace",
        splitChunks: "replace",
      },
    })(baseWebpackConfig, envConfig);

    return mergedConfig;
  } catch (error) {
    console.error("Failed to generate webpack config:", error);
    throw error;
  }
}

/**
 * 获取项目根目录
 */
function getProjectRoot(): string {
  return process.cwd();
}

/**
 * 解析项目路径
 */
function resolveProject(...paths: string[]): string {
  return path.resolve(getProjectRoot(), ...paths);
}

module.exports = {
  getWebpackConfig,
  getProjectRoot,
  resolveProject,
  ConfigManager,
  default: getWebpackConfig,
};
