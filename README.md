<div align="center">
<img width="1200" height="475" alt="DeskTab Banner" src="https://github.com/user-attachments/assets/3d723454-9d81-465a-92e1-7ecd6814219a" />
</div>

# DeskTab

**中文** · [English](./README.en.md) · [日本語](./README.ja.md)

一款 Mac 风格的 Chrome 新标签页扩展。打开新标签时呈现毛玻璃质感的搜索框与可拖拽的网站快捷方式，支持深浅色切换、自定义壁纸、自定义 Logo，并通过 `localStorage` 在本地保存所有偏好。

## 功能

- **Google 风格搜索框**：回车跳转 Google，UI 高度还原原生比例。
- **快捷方式网格**：内置常用站点（Gmail、YouTube、ChatGPT、Claude 等），可自由增删改。
- **拖拽排序**：基于 dnd-kit，长按 200ms 即可拖动重新排列。
- **长按显示编辑/删除**：在任意图标上长按约 600ms，左上角弹出删除按钮、右上角弹出编辑按钮，无需进入 Customize 模式。
- **Customize 模式**：底部 Customize 按钮打开控制面板，可调节图标缩放、Logo 文本、Logo 颜色风格、上传/移除壁纸。
- **深色 / 浅色主题**：一键切换，主题与所有设置自动持久化到本地。
- **图标自定义**：支持图片图标（自动抓取 favicon 或自填 URL）、文字图标、纯色 / 渐变背景，以及多种字体与图片缩放比例。
- **支持滚动**：图标超过一屏时可纵向滚动，搜索框与底部按钮保持固定。

## 安装到 Chrome

DeskTab 是一个 MV3 扩展，需要本地构建后以"开发者模式"加载。

```bash
git clone https://github.com/Shinichi-Goo/DeskTab.git
cd DeskTab
npm install
npm run build
```

然后在浏览器中：

1. 打开 `chrome://extensions`
2. 右上角打开"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择项目里的 `dist/` 目录

完成后，每次打开新标签页都会显示 DeskTab。代码更新后重新执行 `npm run build` 并在扩展页点"刷新"按钮即可生效。

> 同样适用于基于 Chromium 的浏览器：Edge、Brave、Arc、Vivaldi 等。

## 本地开发

```bash
npm install
npm run dev
```

Vite 会在 `http://localhost:3000` 启动开发服务器，可在普通标签页打开调试 UI（不会覆盖新标签页）。

可用脚本：

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发服务器（HMR） |
| `npm run build` | 生产构建到 `dist/`，用于扩展加载 |
| `npm run preview` | 预览构建产物 |
| `npm run lint` | TypeScript 类型检查 |
| `npm run clean` | 删除 `dist/` |

## 项目结构

```
src/
├── App.tsx                    主布局、状态、Customize 面板
├── main.tsx                   React 入口
├── index.css                  Tailwind v4 + 主题 CSS 变量
├── types.ts                   Shortcut 类型定义
├── components/
│   ├── SearchBar.tsx          顶部 Logo 与搜索框
│   ├── ShortcutGrid.tsx       dnd-kit 排序网格
│   ├── ShortcutItem.tsx       单个快捷方式卡片（含长按交互）
│   └── ShortcutModal.tsx      新增 / 编辑快捷方式弹窗
└── lib/utils.ts               cn() 类名合并工具
public/
└── manifest.json              Chrome 扩展清单（MV3）
```

## 数据存储

所有数据通过 `localStorage` 保存在浏览器本地，键名前缀均为 `chrome-`：

- `chrome-shortcuts`：快捷方式列表
- `chrome-bg`：自定义壁纸（Base64）
- `chrome-icon-scale`：图标缩放比例
- `chrome-logo-text` / `chrome-logo-style` / `chrome-logo-font`：Logo 设置
- `theme`：深浅色

不向任何服务器发送数据。

## 技术栈

- **React 19** + **TypeScript**
- **Vite 6**（构建）
- **Tailwind CSS v4**（样式）
- **dnd-kit**（拖拽排序）
- **lucide-react**（图标）
- **Chrome Extension Manifest V3**

## License

MIT
