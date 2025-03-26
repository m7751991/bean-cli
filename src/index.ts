import commander = require("commander"); // 使用 TypeScript 的模块导入语法
const { devCommand } = require("./commands/dev");
const { buildCommand } = require("./commands/build");

const program = new commander.Command();
program.name("bean").description("A CLI tool for building web applications").version("1.0.0");
program.addCommand(devCommand());
program.addCommand(buildCommand());

module.exports = { program };
