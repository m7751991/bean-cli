const util = require("util");
import chalk = require("chalk");

interface PrintOptions {
  /** 是否启用颜色 */
  colors?: boolean;
  /** 遍历深度，null 表示无限制 */
  depth?: number | null;
  /** 是否显示函数内容 */
  showFunctions?: boolean;
  /** 是否显示正则表达式 */
  showRegExp?: boolean;
  /** 是否紧凑显示 */
  compact?: boolean;
  /** 标题 */
  title?: string;
  /** 是否显示特殊类型的标记 */
  showTypeMarks?: boolean;
}

class ConfigPrinter {
  private static defaultOptions: Required<PrintOptions> = {
    colors: true,
    depth: null,
    showFunctions: true,
    showRegExp: true,
    compact: false,
    title: "",
    showTypeMarks: true,
  };

  /**
   * 打印配置对象
   * @param config 要打印的配置对象
   * @param options 打印选项
   */
  static print(config: any, options: PrintOptions = {}): void {
    const opts = { ...this.defaultOptions, ...options };
    const title = opts.title || "Configuration";

    console.log(chalk.bold(`\n=== ${title} ===\n`));

    if (opts.colors) {
      console.log(this.customInspect(config, 0, opts));
    } else {
      console.log(
        util.inspect(config, {
          depth: opts.depth,
          colors: false,
          maxArrayLength: null,
          maxStringLength: null,
          compact: opts.compact,
        })
      );
    }

    console.log(chalk.bold("\n=== End of Configuration ===\n"));
  }

  /**
   * 打印 webpack 配置
   * 预设了适合 webpack 配置的选项
   */
  static printWebpackConfig(config: any, title = "Webpack Configuration"): void {
    this.print(config, {
      title,
      showFunctions: true,
      showRegExp: true,
      showTypeMarks: true,
      depth: null,
      compact: false,
    });
  }

  /**
   * 自定义检查并格式化对象
   */
  private static customInspect(obj: any, depth: number, options: Required<PrintOptions>): string {
    if (depth > (options.depth ?? 20)) return chalk.gray("[Maximum depth reached]");

    const indent = "  ".repeat(depth);

    // 处理基本类型
    if (obj === null) return chalk.gray("null");
    if (obj === undefined) return chalk.gray("undefined");
    if (typeof obj === "number") return chalk.yellow(obj.toString());
    if (typeof obj === "boolean") return chalk.yellow(obj.toString());

    // 处理正则表达式
    if (obj instanceof RegExp && options.showRegExp) {
      return chalk.blue(`${options.showTypeMarks ? "[RegExp] " : ""}${obj.toString()}`);
    }

    // 处理函数
    if (typeof obj === "function" && options.showFunctions) {
      const fnName = obj.name || "anonymous";
      const fnString = obj.toString().split("\n")[0].slice(0, 50);
      return chalk.cyan(`${options.showTypeMarks ? "[Function] " : ""}${fnName}: ${fnString}${fnString.length > 49 ? "..." : ""}`);
    }

    // 处理数组
    if (Array.isArray(obj)) {
      if (obj.length === 0) return "[]";
      const items = obj.map((item) => this.customInspect(item, depth + 1, options));
      return `[\n${indent}  ${items.join(`,\n${indent}  `)}\n${indent}]`;
    }

    // 处理对象
    if (typeof obj === "object") {
      const entries = Object.entries(obj);
      if (entries.length === 0) return "{}";

      const formattedEntries = entries.map(([key, value]) => {
        const formattedValue = this.customInspect(value, depth + 1, options);
        return `${indent}  ${chalk.green(key)}: ${formattedValue}`;
      });

      return `{\n${formattedEntries.join(",\n")}\n${indent}}`;
    }

    // 处理字符串
    if (typeof obj === "string") {
      return chalk.yellow(`"${obj}"`);
    }

    return String(obj);
  }

  /**
   * 打印对象的简单版本
   */
  static printSimple(obj: any, title?: string): void {
    console.log(chalk.bold(`\n=== ${title || "Object"} ===\n`));
    console.dir(obj, { depth: null, colors: true });
    console.log(chalk.bold("\n=== End ===\n"));
  }

  /**
   * 打印对比信息
   */
  static printDiff(oldConfig: any, newConfig: any, title = "Configuration Diff"): void {
    console.log(chalk.bold(`\n=== ${title} ===\n`));

    const diff = this.getDiff(oldConfig, newConfig);
    if (Object.keys(diff).length === 0) {
      console.log(chalk.gray("No differences found"));
    } else {
      console.log(this.customInspect(diff, 0, { ...this.defaultOptions, showTypeMarks: true }));
    }

    console.log(chalk.bold("\n=== End of Diff ===\n"));
  }

  /**
   * 获取两个对象的差异
   */
  private static getDiff(oldObj: any, newObj: any): any {
    if (oldObj === newObj) return {};

    if (typeof oldObj !== "object" || typeof newObj !== "object") {
      return { old: oldObj, new: newObj };
    }

    const diff: any = {};

    // 检查新增和修改的属性
    Object.keys(newObj).forEach((key) => {
      if (!(key in oldObj)) {
        diff[key] = { added: newObj[key] };
      } else if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
        diff[key] = this.getDiff(oldObj[key], newObj[key]);
      }
    });

    // 检查删除的属性
    Object.keys(oldObj).forEach((key) => {
      if (!(key in newObj)) {
        diff[key] = { removed: oldObj[key] };
      }
    });

    return diff;
  }
}

interface Asset {
  name: string;
  size: number;
  type: string;
  related?: Array<{
    type: string;
    name: string;
    size: number;
  }>;
}

function logBuildAssets(info: { assets?: Asset[] }) {
  console.log(chalk.cyan.bold("\n📦 构建产物:\n"));
  // 1. 收集需要展示的资产
  const tableData = (info.assets || []).reduce(
    (acc, asset) => {
      if (["asset", "chunk"].includes(asset.type) && !asset.name.endsWith(".gz") && !asset.name.endsWith(".map") && !asset.name.endsWith(".LICENSE.txt")) {
        const gzipAsset = asset.related?.find((r) => r.type === "gzipped");

        if (gzipAsset) {
          acc.push({
            name: asset.name,
            originalSize: asset.size,
            gzipSize: gzipAsset.size,
            compression: (1 - gzipAsset.size / asset.size) * 100,
          });
        } else {
          acc.push({
            name: asset.name,
            originalSize: asset.size,
            gzipSize: null,
            compression: null,
          });
        }
      }
      return acc;
    },
    [] as Array<{
      name: string;
      originalSize: number;
      gzipSize: number | null;
      compression: number | null;
    }>
  );

  // 2. 计算列宽
  const maxNameLength = Math.max(...tableData.map((d) => d.name.length), 20);
  const columns = [
    { name: "文件", width: maxNameLength + 2 },
    { name: "原始大小", width: 12 },
    { name: "Gzip 大小", width: 12 },
    { name: "压缩率", width: 10 },
  ];

  // 3. 打印表头
  const header = columns.map((col) => chalk.blueBright(col.name.padEnd(col.width))).join("");
  console.log(chalk.gray("┌" + "─".repeat(columns.reduce((a, b) => a + b.width, 0) + 6) + "┐"));
  console.log(chalk.gray("│ ") + header + chalk.gray(" │"));
  console.log(chalk.gray("├" + "─".repeat(columns.reduce((a, b) => a + b.width, 0) + 6) + "┤"));

  // 4. 打印表格内容
  tableData.forEach((row, index) => {
    const rowColor = index % 2 === 0 ? chalk.white : chalk.gray;
    const fields = [
      rowColor(row.name.padEnd(columns[0].width)),
      rowColor(formatSize(row.originalSize).padStart(columns[1].width)),
      row.gzipSize ? chalk.green(formatSize(row.gzipSize).padStart(columns[2].width)) : chalk.red("未压缩".padStart(columns[2].width)),
      row.compression ? chalk.yellow(`${row.compression.toFixed(1)}%`.padStart(columns[3].width)) : chalk.gray("-".padStart(columns[3].width)),
    ];
    console.log(chalk.gray("│ ") + fields.join("") + chalk.gray(" │"));
  });

  // 5. 打印表尾
  console.log(chalk.gray("└" + "─".repeat(columns.reduce((a, b) => a + b.width, 0) + 6) + "┘"));

  // 6. 打印统计信息
  const totalOriginal = tableData.reduce((sum, d) => sum + d.originalSize, 0);
  const totalGzip = tableData.reduce((sum, d) => (d.gzipSize ? sum + d.gzipSize : sum), 0);
  console.log(chalk.cyan.bold("\n📊 总体统计:"));
  console.log(chalk.gray("├─ 原始总大小: ") + chalk.white(formatSize(totalOriginal)));
  console.log(chalk.gray("├─ Gzip 总大小: ") + chalk.green(formatSize(totalGzip)));
  console.log(chalk.gray("└─ 总体压缩率: ") + chalk.yellow(`${((1 - totalGzip / totalOriginal) * 100).toFixed(1)}%`));
}

// 辅助函数
function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

module.exports = {
  ConfigPrinter,
  logBuildAssets,
};
