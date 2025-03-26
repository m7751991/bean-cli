import commander = require("commander"); // 使用 TypeScript 的模块导入语法

function initCommand() {
  const command = new commander.Command("init");

  command
    .description("初始化项目")
    .option("-t, --template <template>", "使用模板")
    .action((options: any) => {
      console.log("初始化项目", options);
      // 实现初始化逻辑
    });

  return command;
}

module.exports = {
  initCommand,
};
