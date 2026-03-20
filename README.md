# Vscode-Gemini

🤖 一个基于Gemini AI的VSCode智能终端问答助手插件

## 功能特点

- 🚀 **智能终端对话**: 自动创建专用终端，与Gemini AI进行智能对话
- 📝 **代码分析**: 快速分析选中的代码，获得AI解释和建议
- 💡 **智能问答**: 支持编程问题、代码优化、调试建议等多种问答
- 🔧 **配置灵活**: 支持多种Gemini模型选择
- ⌨️ **快捷操作**: 丰富的快捷键和命令面板支持

## 安装和配置

### 1. 获取Gemini API Key

1. 访问 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 创建新的API Key
3. 复制API Key

### 2. 配置插件

1. 打开VSCode设置 (`Ctrl+,`)
2. 搜索 `vscode-gemini`
3. 在 `Gemini API Key` 字段中粘贴您的API Key
4. 选择您想使用的模型（可选）

## 使用方法

### 快捷键

- `Ctrl+Alt+G` - 启动AI智能问答终端
- `Ctrl+Shift+A` - 分析选中的代码
- `Ctrl+Shift+Q` - 询问关于选中代码的问题

### 命令面板

1. 打开命令面板 (`Ctrl+Shift+P`)
2. 搜索 "Gemini" 查看所有可用命令：
   - `Gemini: 启动AI智能问答终端`
   - `Gemini: 向AI提问`
   - `Gemini: 分析选中的代码`
   - `Gemini: 询问关于代码的问题`

### 状态栏

点击右下角的 `🤖 Gemini AI` 状态栏按钮快速启动AI助手

## 使用场景

### 1. 代码解释

选中一段代码，使用 `Ctrl+Shift+A` 让AI解释代码功能

### 2. 代码优化建议

选中代码后使用 `Ctrl+Shift+Q`，问AI："如何优化这段代码？"

### 3. 调试帮助

将出错的代码选中，问AI："这段代码可能有什么问题？"

### 4. 学习新技术

直接在终端中问AI："如何在React中使用useState？"

### 5. 代码审查

让AI帮您审查代码："请审查这段代码的安全性和性能"

## 终端命令

在AI终端中，您可以使用以下命令：

- `help` - 显示帮助信息
- `clear` - 清除对话历史
- `exit` - 退出AI助手

## 配置选项

| 配置项                               | 描述             | 默认值             |
| ------------------------------------ | ---------------- | ------------------ |
| `vscode-gemini.apiKey`             | Gemini API密钥   | 空                 |
| `vscode-gemini.model`              | 使用的Gemini模型 | `gemini-2.5-pro` |
| `vscode-gemini.autoCreateTerminal` | 自动创建新终端   | `true`           |

## 支持的模型

- `gemini-3.1-pro` - 最新专业模型，适合复杂推理与高质量回答
- `gemini-2.5-pro` - 上一代专业模型，性能与质量均衡
- `gemini-2.5-flash` - 高速度低延迟，适合日常问答
- `gemini-1.5-pro` - 兼容旧版本项目
- `gemini-1.5-flash` - 兼容旧版本项目

## 故障排除

### 常见问题

1. **API Key无效**

   - 确保已正确配置API Key
   - 检查API Key是否已激活
2. **网络连接问题**

   - 确保网络连接正常
   - 检查防火墙设置
3. **请求频率限制**

   - 等待一段时间后重试
   - 考虑升级API配额

## 许可证

MIT License

## 贡献

📍 **GitHub仓库**: [https://github.com/EasterGhost/VScode-Gemini.git](https://github.com/EasterGhost/VScode-Gemini.git)

欢迎提交Issue和Pull Request！

---
