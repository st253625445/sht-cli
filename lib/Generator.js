/*
 * @Author: Shao Tao
 * @Date: 2021-09-23 13:19:08
 * @LastEditTime: 2022-04-19 14:07:19
 * @LastEditors: Shao Tao
 * @Description:
 * @FilePath: \sht-cli\lib\Generator.js
 */
const ora = require("ora");
const inquirer = require("inquirer");
const util = require("util");
const path = require("path");
const downloadGitRepo = require("download-git-repo"); // 不支持 Promise
const chalk = require("chalk");

// 添加加载动画
async function wrapLoading(fn, message, ...args) {
  // 使用 ora 初始化，传入提示信息 message
  const spinner = ora(message);
  // 开始加载动画
  spinner.start();

  try {
    // 执行传入方法 fn
    const result = await fn(...args);
    // 状态为修改为成功
    spinner.succeed();
    return result;
  } catch (error) {
    // 状态为修改为失败
    spinner.fail("Request failed, refetch ...");
    throw "Request failed, refetch ...";
  }
}

class Generator {
  constructor(name, targetDir) {
    // 目录名称
    this.name = name;
    // 创建位置
    this.targetDir = targetDir;
    // 改造 download-git-repo 支持 promise
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  // 模板对象
  static repoList = {
    "vue3-vite-ts-antDesign": {
      url: "direct:https://gitee.com/shtao_056/vite-vue3-ts-start.git",
      desc: "vue3-vite-ts-antDesign基础模板",
    },
    "vite-vue3-ts-pinia": {
      url: "direct:https://github.com/st253625445/vite-vue3-ts-pinia.git",
      desc: "vite-vue3-ts-pinia基础模板",
    },
    "vite-vue3-ts-pinia-koa2-ssr": {
      url: "direct:https://github.com/st253625445/vite-vue3-ts-pinia-koa2-ssr.git",
      desc: "vite-vue3-ts-pinia-koa2-ssr基础模板",
    },
  };

  async getRepo() {
    // 1）拉取模板数据
    const _keys = Object.keys(Generator.repoList);
    if (!_keys) return;
    const repoList = _keys.map((key) => {
      const _item = Generator.repoList[key];
      return `${key} ${_item.desc}`;
    });
    // 2）用户选择自己新下载的模板名称
    const { repo } = await inquirer.prompt({
      name: "repo",
      type: "list",
      choices: repoList,
      message: "Please choose a template to create project",
    });

    // 3）return 用户选择的名称
    return repo.split(" ")[0];
  }

  // 下载远程模板
  // 1）获取下载地址
  // 2）调用下载方法
  async download(repo) {
    console.log(repo);
    // 1）拼接下载地址
    const requestUrl = Generator.repoList[repo].url;
    // 2）调用下载方法
    await wrapLoading(
      this.downloadGitRepo, // 远程下载方法
      "waiting download template", // 加载提示信息
      requestUrl, // 参数1: 下载地址
      path.resolve(process.cwd(), this.targetDir), // 参数2: 创建位置
      { clone: true }
    );
  }

  // 核心创建逻辑
  // 1）获取模板名称
  // 2）下载模板到模板目录
  async create() {
    // 1）获取模板名称
    const repo = await this.getRepo();
    // 2）下载模板到模板目录
    await this.download(repo);

    console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`);
    console.log(`\r\n  cd ${chalk.cyan(this.name)}`);
    console.log(`  ${chalk.cyan("npm install")} or ${chalk.cyan("yarn")}\r\n`);
  }
}

module.exports = Generator;
