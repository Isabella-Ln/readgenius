# ReadGenius - AI Reading Assistant

> 让阅读真正变成学习

## 🎯 产品概述

ReadGenius 是一个 AI 驱动的沉浸式阅读学习平台，专注于解决英文阅读中的痛点：

- 读英文书遇到生词 → 点词即查，不需要退出
- 长难句看不懂 → 选中片段，AI 立刻解释
- 读完就忘 → 生词本 + 复习系统

**核心理念**：AI 无缝融入，不需要退出，不需要切换，一切自然而然发生。

---

## 🚀 快速开始

### 前置要求

- Node.js 18+
- Python 3.11+
- Google Gemini API Key（可选，用于 AI 功能）

### 安装

```bash
# 克隆项目
cd frontend

# 安装前端依赖
npm install

# 安装后端依赖
cd ../backend
pip install -r requirements.txt
```

### 运行

```bash
# 终端 1: 启动后端
cd backend
export GEMINI_API_KEY=your-api-key  # Windows: set GEMINI_API_KEY=your-api-key
uvicorn main:app --reload --port 8000

# 终端 2: 启动前端
cd frontend
npm run dev
```

访问 http://localhost:5173

---

## 📁 项目结构

```
readgenius-project/
├── frontend/                 # React 前端
│   ├── src/
│   │   ├── components/      # UI 组件
│   │   │   ├── Library.tsx  # 书架
│   │   │   ├── PDFReader.tsx # PDF 阅读器
│   │   │   ├── WordCard.tsx  # 查词卡片
│   │   │   └── AIChat.tsx    # AI 对话
│   │   ├── hooks/           # 自定义 Hooks
│   │   ├── App.tsx          # 主应用
│   │   └── main.tsx         # 入口
│   └── package.json
│
├── backend/                  # Python 后端
│   ├── main.py              # API 服务
│   └── requirements.txt     # 依赖
│
└── README.md
```

---

## ✨ 核心功能

### P0 - MVP

| 功能 | 描述 |
|------|------|
| ✅ PDF 导入 | 拖拽上传，本地存储（IndexedDB） |
| ✅ 点词查词 | 点任何词，立刻精美词卡 |
| ✅ 段落解释 | 选中片段，AI 立刻解释 |
| ✅ AI 对话 | 选片段问问题，基于本书语境 |

### P1 - 第二批

| 功能 | 状态 |
|------|------|
| ⏳ 生词本 | 规划中 |
| ⏳ 发音 | 规划中 |
| ⏳ 阅读进度 | 规划中 |
| ⏳ 欧路词典导入 | 规划中 |

---

## 🛠 技术栈

### 前端
- **React 18** + TypeScript
- **Vite** - 构建工具
- **Tailwind CSS** - 样式
- **PDF.js** - PDF 渲染
- **IndexedDB** - 本地存储

### 后端
- **FastAPI** - API 框架
- **Google Gemini API** - AI 能力
- **Python 3.11+**

### 部署
- **前端**: Vercel
- **后端**: Railway / Google Cloud Run

---

## 🔧 环境变量

### 后端 (.env)
```env
GEMINI_API_KEY=your-gemini-api-key
PORT=8000
```

### 前端 (.env)
```env
VITE_API_URL=http://localhost:8000
```

---

## 📊 数据存储

### 本地优先架构
- **PDF 文件**: IndexedDB（不上传，保护隐私）
- **生词本**: localStorage
- **阅读进度**: localStorage
- **用户数据**（可选）: 云端 PostgreSQL

---

## 🎨 设计原则

1. **不打断阅读节奏** - 查词在原地弹出，不需要切换页面
2. **精美但不花哨** - 专注内容，减少视觉干扰
3. **响应要快** - 查词 < 1秒，AI 回复 < 3秒
4. **离线可用** - 本地优先，网络只是增强

---

## 📝 开发日志

### v0.1.0 (当前)
- PDF 导入 + 本地存储
- PDF 阅读器（分页、缩放）
- 点词查词（精美词卡）
- 段落选中解释
- AI 对话

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License

---

## 🔗 相关链接

- [Google Gemini API](https://ai.google.dev)
- [Vercel](https://vercel.com)
- [Railway](https://railway.app)
- [PDF.js](https://mozilla.github.io/pdf.js/)

---

**让阅读真正变成学习** 📚
