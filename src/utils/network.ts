const { detect } = require("detect-port");
const chalk = require("chalk");
const os = require("os");

/**
 * 获取可用端口
 */
async function getAvailablePort(preferredPort: number, host: string = "localhost"): Promise<number> {
  try {
    // detect-port 会自动找到可用端口
    const port = await detect(preferredPort);

    if (port !== preferredPort) {
      console.log(chalk.yellow(`\n端口 ${preferredPort} 已被占用，将使用端口 ${port}\n`));
    }

    return port;
  } catch (error: any) {
    console.error(chalk.red(`查找可用端口失败: ${error.message}`));
    throw error;
  }
}

/**
 * 获取本地IP地址
 */
function getLocalIP(): string {
  const networks = os.networkInterfaces();
  for (const name of Object.keys(networks)) {
    for (const network of networks[name] || []) {
      const familyV4Value = typeof network.family === "string" ? "IPv4" : 4;
      if (network.family === familyV4Value && !network.internal) {
        return network.address;
      }
    }
  }

  return "localhost";
}

module.exports = {
  getAvailablePort,
  getLocalIP,
};
