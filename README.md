# dsh-fast-reply

[中文](README.zh.md) | English

Quick replies for [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness): a trigger button in the composer's activity area that inserts reusable text and skill references at the cursor.

![icon](icon.svg)

## Features

- One-click insertion of saved replies from the composer toolbar
- Add, edit, and delete entries in an inline manage panel — no config files
- Entries can contain plain text or skill references such as `@dsh-doc`
- Stored in the browser's local storage: data stays on your device
- Light and dark themes, English and Chinese UI labels

## Requirements

- DeepSeek Harness `>=0.2.2-rc.4` (declared in `engines.dsh`)
- A Web profile with the conversation composer (the plugin contributes a Client-only UI slot)

## Installation

From the plugin manager's **Add plugin**, install the npm package:

```
dsh-fast-reply
```

Or with the agent `plugin_manager` tool, install bundle target `dsh-fast-reply`.

## Usage

1. Open a session and find the **✦ Quick replies** button among the composer's activity buttons.
2. Click an entry to insert its content at the current cursor position.
3. Click **Manage** to edit or delete entries, or use **New quick reply** to create one.

Replies are kept under the local-storage key `dsh.quick-replies.v1`; clearing browser site data removes them.

## How it works

The Host half is an empty plugin (`export function apply() {}`); all behavior lives in the Client module, which registers a component into the `conversation.input.activity` slot and uses the composer's revision-guarded `insertText` API.

## License

[MIT](LICENSE)
