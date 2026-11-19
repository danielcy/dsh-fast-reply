# dsh-fast-reply 快捷回复

English | [中文](README.zh.md)

[DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness) 的快捷回复插件：在输入框活动区增加一个触发按钮，把可复用的文本和技能引用一键插入到光标位置。

## 功能

- 在输入框工具栏一键插入已保存的回复
- 在面板内直接新增、编辑、删除条目，无需编辑配置文件
- 条目支持普通文本，也支持 `@dsh-doc` 这类技能引用
- 数据保存在浏览器本地存储中，仅留在你的设备上
- 适配浅色/深色主题，内置中英文界面文案

## 环境要求

- DeepSeek Harness `>=0.2.2-rc.4`（见 `engines.dsh`）
- 带对话输入框的 Web profile（本插件仅贡献客户端 UI slot）

## 安装

在插件管理器的**添加插件**中安装 npm 包：

```
dsh-fast-reply
```

或通过 agent 的 `plugin_manager` 工具，以 `dsh-fast-reply` 为 target 安装组合包。

## 使用

1. 打开一个会话，在输入框的活动按钮中找到 **✦ 快捷回复**。
2. 点击条目即可把内容插入当前光标位置。
3. 点击**管理**可编辑或删除条目，点击**新增快捷回复**可创建新条目。

回复保存在本地存储键 `dsh.quick-replies.v1` 下；清理浏览器站点数据会一并删除。

## 工作原理

Host 侧是空插件（`export function apply() {}`），全部行为位于 Client 模块：向 `conversation.input.activity` slot 注册组件，并通过输入框带 revision 保护的 `insertText` API 写入文本。

## 许可证

[MIT](LICENSE)
