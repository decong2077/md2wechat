# md2wechat ✨

**为极简主义者打造的 Notion 风格微信公众号排版工具。**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Built with Vite](https://img.shields.io/badge/built%20with-Vite-646CFF.svg)](https://vitejs.dev/)
[![Style Notion](https://img.shields.io/badge/style-Notion--inspired-black.svg)](https://notion.so)

`md2wechat` 是一个极致简约的 Markdown 编辑器，旨在帮助内容创作者在微信公众号上也能维持 Notion 般优雅的排版审美。

---

## 🌟 核心特性

- **Notion 视觉语言**：严格遵循 Notion 设计规范，包含 10 色主题、3px 经典圆角及系统级无衬线字体栈。
- **微信深度适配**：
  - **自动脚注转换**：识别 Markdown 外部链接并自动重写为文末脚注，完美解决微信不支持外链的痛点。
  - **行内样式注入**：解析时自动注入 inline-styles，确保在微信后台粘贴时样式 1:1 还原。
  - **横向滑动表格**：针对移动端优化的表格容器，防止内容挤压。
- **自定义扩展语法**：支持 `:::callout 💡 提示内容 :::` 语法，快速生成 Notion 特色的提示框。
- **代码高亮优化**：集成 `PrismJS`，针对微信环境优化代码块背景与滚动条。
- **隐私第一**：所有解析逻辑均在浏览器本地完成，文章草稿自动暂存于 LocalStorage，绝不上传服务器。

---

## 🚀 快速开始

### 在线体验
> [https://decong2077.github.io/md2wechat](https://decong2077.github.io/md2wechat)

### 本地开发

1. **克隆项目**
   ```bash
   git clone git@github.com:decong2077/md2wechat.git
   cd md2wechat
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **构建发布**
   ```bash
   npm run build
   ```

---

## 📝 Markdown 扩展语法说明

### Callout (提示框)
```markdown
:::callout 💡 这是一个 Notion 风格的提示框，支持 Emoji 图标。 :::
```

### 高亮
```markdown
这是 ==被高亮的文本==
```

### 下划线
```markdown
<u>这是带下划线的文本</u>
```

---

## 🛠️ 技术栈

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Engine**: 自研 Notion Engine v2.2 (基于 [marked.lexer](https://marked.js.org/))
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)

---

## 🤝 贡献

欢迎提交 Issue 或 Pull Request！我们非常期待能有更多关于 Notion 主题配色或微信适配边界情况的改进。

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源。

---

**Made with ❤️ for Content Creators.**
