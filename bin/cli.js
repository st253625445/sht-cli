#! /usr/bin/env node
/*
 * @Author: Shao Tao
 * @Date: 2021-09-23 15:15:36
 * @LastEditTime: 2021-09-23 17:36:15
 * @LastEditors: Shao Tao
 * @Description:
 * @FilePath: \brand-cli\bin\cli.js
 */

const program = require('commander')
const chalk = require('chalk')

program
	.command('create <app-name>')
	.description('create a new project')
	.option('-f, --force', 'overwrite target directory if it exist') // 是否强制创建，当文件夹已经存在
	.action((name, options) => {
		// 在 create.js 中执行创建任务
		require('../lib/create.js')(name, options)
	})

program
	// 配置版本号信息
	.version(`v${require('../package.json').version}`)
	.usage('<command> [option]')

program.on('--help', () => {
	console.log(
		`\r\nRun ${chalk.cyan(
			`br <command> --help`
		)} for detailed usage of given command\r\n`
	)
})

// 解析用户执行命令传入参数
program.parse(process.argv)
