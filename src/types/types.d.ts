import { Configuration as WebpackConfig, Entry } from "webpack";
import { Configuration as DevServerConfig } from "webpack-dev-server";

// HTML 模板配置
interface TemplateConfig {
  template: string;
  favicon?: string;
  title: string;
  chunks: string[];
}

// 基础配置
interface BaseConfig {
  entry: object | string;
  templates?: {
    [key: string]: TemplateConfig;
  };
  build?: string;
  publicPath?: string;
  extensions?: string[];
  analyze?: boolean;
  alias?: {
    [key: string]: string;
  };
  define?: {
    [key: string]: Record<string, any> | string;
  };
}

// 缓存组配置
interface CacheGroupConfig {
  chunks?: "initial" | "async" | "all";
  name?: string;
  test?: RegExp | string | ((module: any, chunks: any[]) => boolean);
  priority?: number;
  reuseExistingChunk?: boolean;
  minSize?: number;
  maxSize?: number;
  minChunks?: number;
}

// 扩展 webpack 配置
interface ExtendedWebpackConfig extends WebpackConfig {
  optimization?: {
    splitChunks?: {
      cacheGroups?: {
        [key: string]: CacheGroupConfig;
      };
    };
  };
}

// 扩展开发服务器配置
interface ExtendedDevServerConfig extends DevServerConfig {
  https?: boolean;
  port?: number;
}

// 项目完整配置
export interface ProjectConfig {
  baseConfig: BaseConfig;
  webpackConfig?: ExtendedWebpackConfig;
  devServerConfig?: ExtendedDevServerConfig;
}

// 环境信息类型
export interface EnvInfo {
  [key: string]: string;
}
