# 数据处理工作台
## 功能特点

- 📝 JSON数据导入和导出
- 🔄 灵活的列操作（新增、复制）
- 🤖 集成LLM处理能力
- 📊 表格式数据展示和编辑
- 🔍 数据筛选和排序
- 📱 响应式设计，支持多种设备

## 技术栈

- Next.js - React框架
- TypeScript - 类型安全
- Tailwind CSS - 样式框架
- shadcn/ui - UI组件库
- TanStack Table - 表格组件

## 快速开始
### 环境要求

- Node.js 18.0.0 或更高版本
- npm 或 yarn 包管理器

### 安装

```bash
# 克隆项目
git clone [项目地址]

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 配置

在项目根目录创建 `.env` 文件，配置LLM API相关参数：

```env
NEXT_PUBLIC_LLM_API_ENDPOINT=你的API地址
NEXT_PUBLIC_LLM_MODEL=你的模型ID
NEXT_PUBLIC_LLM_API_KEY=你的API密钥
```

## 使用说明

### 视频演示

观看以下视频，快速了解数据处理工作台的主要功能和操作方法：

<video width="100%" controls>
  <source src="usage.mp4" type="video/mp4">
  您的浏览器不支持视频标签。
</video>

### 功能详解

1. **数据导入**
   - 支持导入JSON格式数据
   - 自动识别数据结构，生成表格

2. **数据编辑**
   - 双击单元格进行编辑
   - 支持批量选择数据
   - 可以添加新列
   - 支持列值复制

3. **LLM处理**
   - 选择需要处理的数据行
   - 输入处理提示词
   - 支持使用{列名}引用数据内容
   - 实时显示处理进度

4. **数据导出**
   - 支持导出为JSON格式
   - 保留所有修改和处理结果

## 开发说明
### 项目结构

```
src/
  ├── app/          # 页面和API路由
  ├── components/   # React组件
  ├── config/       # 配置文件
  └── lib/          # 工具函数
```

### 主要组件

- `DataTable` - 数据表格组件，支持编辑和选择
- `FileUpload` - 文件上传组件
- `LLMProcessPanel` - LLM处理面板

## 贡献

欢迎提交Issue和Pull Request！
