const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { ConfigManager } = require("./utils");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
import type { Configuration } from "webpack";
import type { ProjectConfig } from "../types/types";

interface BuildOptions {
  configPath?: string;
}

async function createProdConfig(options: BuildOptions) {
  const projectConfig: ProjectConfig = await ConfigManager.getProjectConfig(options.configPath);
  const prodConfig: Configuration = {
    mode: "production",
    stats: {
      assets: true,
      groupAssetsByChunk: true,
    },
    plugins: [
      process.env.NODE_ENV === "production" &&
        new MiniCssExtractPlugin({
          filename: "css/[name].[contenthash:8].css",
          chunkFilename: "css/[name].[contenthash:8].chunk.css",
        }),
      projectConfig.baseConfig.analyze &&
        new BundleAnalyzerPlugin({
          analyzerMode: "server",
          openAnalyzer: true,
        }),
      new CompressionWebpackPlugin({
        filename: "[path][base].gz[query]",
        algorithm: "gzip",
        test: /\.(js|css|html|svg)$/,
        threshold: 10240, // 10KB
        minRatio: 0.8,
        // 删除原始文件，只保留压缩后的文件
        deleteOriginalAssets: false,
      }),
    ],
    devtool: "source-map",
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            parse: {
              ecma: 2020,
            },
            compress: {
              ecma: 5,
              comparisons: false,
              inline: 2,
              drop_console: true,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
        }),
        new CssMinimizerPlugin(),
      ],
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            name: "vendors",
          },

          common: {
            chunks: "initial",
            name: "common",
            minChunks: 2,
            priority: -9,
          },
          runtime: {
            chunks: "async",
            name: "runtime",
            minChunks: 2,
            priority: -9,
          },
        },
      },
    },
  };

  return ConfigManager.mergeWebpackConfig(prodConfig, projectConfig.webpackConfig || {});
}

module.exports = createProdConfig;
