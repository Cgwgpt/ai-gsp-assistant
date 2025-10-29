# Markdown 格式解析功能说明

## ✨ 功能概述

项目现已支持完整的 Markdown 格式解析和渲染，AI对话内容可以使用 Markdown 语法进行丰富的格式化展示。

## 📦 安装的依赖

- **marked** (v12.0.0+) - 强大的 Markdown 解析库
- **highlight.js** (v11.9.0+) - 代码语法高亮库

## 🎯 支持的功能

### 1. 基础文本格式

- **粗体文本**: `**粗体**` 或 `__粗体__`
- *斜体文本*: `*斜体*` 或 `_斜体_`
- ~~删除线~~: `~~删除线~~`
- `行内代码`: \`代码\`

### 2. 标题

支持 6 级标题：

```markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
```

### 3. 列表

**无序列表：**
```markdown
- 项目 1
- 项目 2
  - 子项目 2.1
  - 子项目 2.2
```

**有序列表：**
```markdown
1. 第一项
2. 第二项
3. 第三项
```

**任务列表：**
```markdown
- [x] 已完成任务
- [ ] 待完成任务
```

### 4. 引用块

```markdown
> 这是一个引用块
> 可以包含多行内容
```

### 5. 代码块

**行内代码：** \`console.log('Hello')\`

**代码块（带语法高亮）：**

\`\`\`javascript
function hello() {
  console.log('Hello, World!')
}
\`\`\`

\`\`\`python
def hello():
    print("Hello, World!")
\`\`\`

支持的语言包括：
- JavaScript/TypeScript
- Python
- Java
- C/C++
- Go
- Rust
- PHP
- Ruby
- SQL
- HTML/CSS
- Bash/Shell
- 等更多语言...

### 6. 表格

```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
| 数据4 | 数据5 | 数据6 |
```

### 7. 链接和图片

**链接：** `[链接文字](https://example.com)`

**图片：** `![图片描述](图片URL)`

### 8. 分隔线

```markdown
---
或
***
或
___
```

## 🛠️ 技术实现

### 文件结构

```
src/
├── composables/
│   └── useMarkdown.ts          # Markdown 渲染核心逻辑
├── assets/
│   ├── markdown.css            # Markdown 样式
│   └── highlight.css           # 代码高亮样式
└── components/
    ├── gsp/
    │   └── GspReportInterface.vue    # GSP报告界面（已集成）
    └── bot/
        └── BotSelectorInterface.vue  # 多数智人对话界面（已集成）
```

### 核心函数

**`renderMarkdown(content: string): string`**

- 功能：将 Markdown 文本渲染为 HTML
- 参数：Markdown 格式的字符串
- 返回：渲染后的 HTML 字符串
- 特性：
  - 支持 GitHub 风格的 Markdown (GFM)
  - 自动识别并高亮代码块
  - 安全的 HTML 转义，防止 XSS 攻击
  - 错误容错处理

### 使用方式

在 Vue 组件中：

```vue
<template>
  <!-- AI助手的回复内容 -->
  <div class="markdown-body" v-html="renderMarkdown(message.content)"></div>
</template>

<script setup>
import { renderMarkdown } from '@/composables/useMarkdown'
import '@/assets/markdown.css'
import '@/assets/highlight.css'
</script>
```

## 📱 已集成的组件

### 1. GSP 报告撰写界面
**文件：** `src/components/gsp/GspReportInterface.vue`

- ✅ AI 生成的报告内容支持 Markdown 渲染
- ✅ 历史对话详情弹窗支持 Markdown 渲染
- ✅ 保持原有的用户输入以纯文本显示

### 2. 多数智人对话界面
**文件：** `src/components/bot/BotSelectorInterface.vue`

- ✅ AI 数智人回复支持 Markdown 渲染
- ✅ 用户消息保持纯文本显示
- ✅ 历史对话详情支持 Markdown 渲染

## 🎨 样式定制

### Markdown 样式
所有 Markdown 渲染内容都带有 `.markdown-body` 类，你可以通过修改 `src/assets/markdown.css` 来定制样式。

### 代码高亮主题
当前使用 GitHub Light 主题。如需更换主题，可以：

1. 访问 [highlight.js 主题库](https://highlightjs.org/static/demo/)
2. 选择喜欢的主题
3. 下载对应的 CSS 文件
4. 替换 `src/assets/highlight.css`

常用主题推荐：
- `github-dark` - GitHub 暗色主题
- `vs2015` - Visual Studio 暗色主题
- `atom-one-dark` - Atom 编辑器暗色主题
- `monokai` - Monokai 主题

## 📝 使用示例

### 示例 1：格式化报告

AI 可以返回如下格式的内容：

```markdown
## 整改建议报告

### 1. 问题分析

企业存在以下主要问题：
- **人员培训不足**：未对相关人员进行系统培训
- **管理制度缺失**：未建立完善的管理规程

### 2. 整改措施

#### 2.1 人员培训
\```python
# 培训计划示例代码
training_plan = {
    "duration": "2周",
    "participants": ["质量管理人员", "仓储人员"]
}
\```

#### 2.2 制度完善
需要建立以下制度：
1. 运输管理规程
2. 温湿度监测制度
3. 退货验收流程

> **注意：** 所有制度必须符合 GSP 规范要求

---
**整改期限：** 30天
```

### 示例 2：技术支持

AI 可以提供带代码的技术答案：

```markdown
## 如何实现数据验证？

可以使用以下代码：

\```javascript
function validateData(data) {
  if (!data || !data.id) {
    throw new Error('数据验证失败')
  }
  return true
}
\```

**优点：**
- ✅ 代码简洁
- ✅ 易于维护
- ✅ 错误处理完善
```

## 🔒 安全性

### XSS 防护

`renderMarkdown` 函数包含以下安全措施：

1. **HTML 转义**：所有用户输入都会进行 HTML 转义
2. **marked 配置**：使用安全的默认配置
3. **错误处理**：解析失败时返回转义后的纯文本

### 最佳实践

```vue
<!-- ✅ 推荐：使用 v-html 渲染经过处理的内容 -->
<div class="markdown-body" v-html="renderMarkdown(content)"></div>

<!-- ❌ 不推荐：直接使用 v-html 渲染原始内容 -->
<div v-html="content"></div>
```

## 🐛 故障排除

### 代码高亮不生效

**问题：** 代码块没有语法高亮

**解决方案：**
1. 确认已导入 `highlight.css`
2. 检查代码块是否指定了语言
3. 查看浏览器控制台是否有错误

### 样式冲突

**问题：** Markdown 样式与现有样式冲突

**解决方案：**
1. 使用 `.markdown-body` 类限定样式作用域
2. 调整 CSS 优先级
3. 使用 `scoped` 样式隔离

### 表格显示异常

**问题：** 表格在移动端显示不正常

**解决方案：**
已内置响应式处理，表格会在小屏幕上自动横向滚动。

## 📚 参考资料

- [Marked 文档](https://marked.js.org/)
- [Highlight.js 文档](https://highlightjs.org/)
- [GitHub Flavored Markdown 规范](https://github.github.com/gfm/)
- [Markdown 语法指南](https://www.markdownguide.org/)

## 🎉 总结

✅ **已完成**：
- 安装并配置 Markdown 解析库
- 创建可复用的 Markdown 渲染函数
- 集成到 GSP 报告界面
- 集成到多数智人对话界面
- 添加代码语法高亮
- 完善的样式系统
- XSS 安全防护
- 响应式设计

📝 **使用简单**：
- 只需在模板中使用 `v-html="renderMarkdown(content)"`
- AI 返回的 Markdown 内容会自动渲染
- 无需额外配置

🚀 **功能强大**：
- 支持完整的 Markdown 语法
- 代码高亮支持 100+ 编程语言
- 响应式设计，移动端友好
- 安全可靠，防止 XSS 攻击

现在你的 AI 对话系统已经支持完整的 Markdown 格式解析了！🎊

