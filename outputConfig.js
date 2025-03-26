export default {
  "entry": {
    "index": "./src/main.js",
    "admin": "./src/admin.js"
  },
  "output": {
    "path": "d:\\workspace\\bean-cli\\dist",
    "filename": "[name].[contenthash:8].js",
    "chunkFilename": "[name].[contenthash:8].chunk.js",
    "publicPath": "/",
    "clean": true
  },
  "resolve": {
    "extensions": [
      ".tsx",
      ".ts",
      ".js",
      ".json",
      ".vue"
    ],
    "alias": {
      "@": "d:\\workspace\\bean-cli\\src",
      "@scss": "\\d:\\workspace\\bean-cli\\src\\styles",
      "@assets": "\\d:\\workspace\\bean-cli\\src\\assets",
      "@components": "\\d:\\workspace\\bean-cli\\src\\components",
      "@utils": "d:\\workspace\\bean-cli\\src\\utils",
      "@views": "d:\\workspace\\bean-cli\\src\\views",
      "@util": "\\d:\\workspace\\bean-cli\\src\\utils",
      "@const": "\\d:\\workspace\\bean-cli\\src\\constants",
      "@img": "\\d:\\workspace\\bean-cli\\src\\assets\\img"
    }
  },
  "module": {
    "rules": [
      {
        "test": {},
        "use": [
          "babel-loader"
        ],
        "options": {
          "presets": [
            "@babel/preset-env"
          ],
          "cacheDirectory": true
        },
        "include": "d:\\workspace\\bean-cli\\src",
        "exclude": {}
      },
      {
        "test": {},
        "use": [
          "vue-loader"
        ],
        "include": "d:\\workspace\\bean-cli\\src",
        "exclude": {}
      },
      {
        "test": {},
        "use": [
          "style-loader",
          "css-loader"
        ]
      },
      {
        "test": {},
        "use": [
          "style-loader",
          {
            "loader": "css-loader",
            "options": {
              "importLoaders": 2,
              "modules": false
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "postcssOptions": {
                "plugins": [
                  "postcss-preset-env",
                  "autoprefixer",
                  "cssnano"
                ]
              }
            }
          },
          "sass-loader"
        ]
      },
      {
        "test": {},
        "use": [
          "style-loader",
          {
            "loader": "css-loader",
            "options": {
              "importLoaders": 2,
              "modules": false
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "postcssOptions": {
                "plugins": [
                  "postcss-preset-env",
                  "autoprefixer",
                  "cssnano"
                ]
              }
            }
          },
          "less-loader"
        ]
      },
      {
        "test": {},
        "type": "asset/resource",
        "parser": {
          "dataUrlCondition": {
            "maxSize": 8192
          }
        },
        "generator": {
          "filename": "images/[hash][ext][query]"
        }
      },
      {
        "test": {},
        "type": "asset/resource",
        "generator": {
          "filename": "fonts/[hash][ext][query]"
        }
      }
    ]
  },
  "plugins": [
    {
      "definitions": {
        "process.env": "{\"VUE_APP_NAME\":\"蜂享家CRM\",\"VUE_APP_API_BASE_URL\":\"http://localhost:8848\",\"VUE_APP_ENV\":\"development\",\"VUE_APP_ASSETS_PATH\":\"/\"}",
        "VUE_APP_NAME": "蜂享家CRM",
        "VUE_APP_API_BASE_URL": "http://localhost:8848",
        "VUE_APP_ENV": "development",
        "VUE_APP_ASSETS_PATH": "/"
      }
    },
    {
      "dangerouslyAllowCleanPatternsOutsideProject": false,
      "dry": false,
      "verbose": false,
      "cleanStaleWebpackAssets": true,
      "protectWebpackAssets": true,
      "cleanAfterEveryBuildPatterns": [],
      "cleanOnceBeforeBuildPatterns": [
        "**/*"
      ],
      "currentAssets": [],
      "initialClean": false,
      "outputPath": ""
    },
    {
      "userOptions": {
        "template": "./public/index.html",
        "favicon": "./public/favicon.ico",
        "filename": "index.html",
        "title": "首页",
        "chunks": [
          "index",
          "vendors",
          "common"
        ],
        "inject": true,
        "minify": {
          "removeComments": true,
          "collapseWhitespace": true,
          "removeRedundantAttributes": true,
          "useShortDoctype": true,
          "removeEmptyAttributes": true,
          "removeStyleLinkTypeAttributes": true,
          "keepClosingSlash": true,
          "minifyJS": true,
          "minifyCSS": true,
          "minifyURLs": true
        }
      },
      "version": 5,
      "options": {
        "template": "./public/index.html",
        "templateContent": false,
        "filename": "index.html",
        "publicPath": "auto",
        "hash": false,
        "inject": true,
        "scriptLoading": "defer",
        "compile": true,
        "favicon": "./public/favicon.ico",
        "minify": {
          "removeComments": true,
          "collapseWhitespace": true,
          "removeRedundantAttributes": true,
          "useShortDoctype": true,
          "removeEmptyAttributes": true,
          "removeStyleLinkTypeAttributes": true,
          "keepClosingSlash": true,
          "minifyJS": true,
          "minifyCSS": true,
          "minifyURLs": true
        },
        "cache": true,
        "showErrors": true,
        "chunks": [
          "index",
          "vendors",
          "common"
        ],
        "excludeChunks": [],
        "chunksSortMode": "auto",
        "meta": {},
        "base": false,
        "title": "首页",
        "xhtml": false
      }
    },
    {
      "userOptions": {
        "template": "./public/admin.html",
        "favicon": "./public/favicon.ico",
        "filename": "admin.html",
        "title": "管理后台",
        "chunks": [
          "admin",
          "vendors",
          "common"
        ],
        "inject": true,
        "minify": {
          "removeComments": true,
          "collapseWhitespace": true,
          "removeRedundantAttributes": true,
          "useShortDoctype": true,
          "removeEmptyAttributes": true,
          "removeStyleLinkTypeAttributes": true,
          "keepClosingSlash": true,
          "minifyJS": true,
          "minifyCSS": true,
          "minifyURLs": true
        }
      },
      "version": 5,
      "options": {
        "template": "./public/admin.html",
        "templateContent": false,
        "filename": "admin.html",
        "publicPath": "auto",
        "hash": false,
        "inject": true,
        "scriptLoading": "defer",
        "compile": true,
        "favicon": "./public/favicon.ico",
        "minify": {
          "removeComments": true,
          "collapseWhitespace": true,
          "removeRedundantAttributes": true,
          "useShortDoctype": true,
          "removeEmptyAttributes": true,
          "removeStyleLinkTypeAttributes": true,
          "keepClosingSlash": true,
          "minifyJS": true,
          "minifyCSS": true,
          "minifyURLs": true
        },
        "cache": true,
        "showErrors": true,
        "chunks": [
          "admin",
          "vendors",
          "common"
        ],
        "excludeChunks": [],
        "chunksSortMode": "auto",
        "meta": {},
        "base": false,
        "title": "管理后台",
        "xhtml": false
      }
    },
    {
      "_sortedModulesCache": {},
      "options": {
        "filename": "css/[name].[contenthash:8].css",
        "ignoreOrder": false,
        "runtime": true,
        "chunkFilename": "css/[name].[contenthash:8].chunk.css"
      },
      "runtimeOptions": {
        "linkType": "text/css"
      }
    },
    {
      "opts": {
        "analyzerMode": "disabled",
        "analyzerHost": "127.0.0.1",
        "reportFilename": null,
        "defaultSizes": "parsed",
        "openAnalyzer": false,
        "generateStatsFile": false,
        "statsFilename": "stats.json",
        "statsOptions": null,
        "excludeAssets": null,
        "logLevel": "info",
        "startAnalyzer": true,
        "analyzerPort": 8888
      },
      "server": null,
      "logger": {
        "activeLevels": {}
      }
    }
  ],
  "optimization": {
    "splitChunks": {
      "chunks": "all",
      "name": false,
      "cacheGroups": {
        "vendors": {
          "test": {},
          "name": "vendors",
          "chunks": "all",
          "priority": -10
        },
        "common": {
          "name": "common",
          "minChunks": 2,
          "chunks": "initial",
          "priority": -20
        },
        "runtime": {
          "chunks": "async",
          "name": "runtime",
          "minChunks": 2,
          "priority": -20
        },
        "fixed": {
          "chunks": "all",
          "name": "fixed",
          "priority": 11
        }
      }
    },
    "minimize": true,
    "minimizer": [
      {
        "options": {
          "test": {},
          "extractComments": true,
          "parallel": true,
          "minimizer": {
            "options": {
              "parse": {
                "ecma": 2020
              },
              "compress": {
                "ecma": 5,
                "comparisons": false,
                "inline": 2,
                "drop_console": true
              },
              "mangle": {
                "safari10": true
              },
              "output": {
                "ecma": 5,
                "comments": false,
                "ascii_only": true
              }
            }
          }
        }
      },
      {
        "options": {
          "test": {},
          "parallel": true,
          "minimizer": {
            "options": {}
          }
        }
      }
    ]
  },
  "mode": "production",
  "devtool": "source-map"
}