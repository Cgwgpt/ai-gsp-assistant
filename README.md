# AI GSP Assistant

基于 Vue 3 + Supabase 开发的智能 GSP 检查助手系统，集成 AI 能力，提供智能化的 GSP 缺陷分析和管理。

## ✨ 特性

- 🤖 AI 智能分析：自动分析和分类 GSP 缺陷
- 📊 数据可视化：直观展示缺陷统计和趋势
- 📝 智能报告：自动生成缺陷报告和整改建议
- 🔍 智能检索：快速定位历史缺陷记录
- 🔐 安全可靠：基于 Supabase 的用户认证和数据管理

## 🛠️ 技术栈

- Vue 3
- Vite
- Supabase
- Tailwind CSS
- OpenAI API

## 🚀 快速开始

1. 克隆项目
```bash
git clone https://github.com/your-username/ai-gsp-assistant.git
cd ai-gsp-assistant
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
```

## 📝 环境变量

创建 `.env` 文件并配置以下环境变量：

```
VITE_SUPABASE_URL=你的Supabase项目URL
VITE_SUPABASE_ANON_KEY=你的Supabase匿名密钥
VITE_OPENAI_API_KEY=你的OpenAI API密钥
```

## 📄 许可证

[MIT](LICENSE) 

# 支持多个COZE BOT_ID的设计方案

要支持多个COZE BOT_ID，我们需要修改现有的chatService，使其能够接受不同的BOT_ID参数。以下是修改建议：

```typescript:src/services/chatService.ts
// ... existing code ...

// 添加Bot配置接口
export interface BotConfig {
  id: string
  name: string
  description?: string
}

// 默认机器人配置
const DEFAULT_BOT_ID = import.meta.env.VITE_COZE_BOT_ID

// 可以从环境变量或配置文件加载多个机器人
export const availableBots: BotConfig[] = [
  { id: DEFAULT_BOT_ID, name: '默认机器人' },
  // 可以添加更多机器人
]

export const chatService = {
  async sendMessage(message: string, conversationId?: string, botId: string = DEFAULT_BOT_ID) {
    const request: ChatRequest = {
      bot_id: botId,
      user_id: 'default_user',
      stream: true,
      auto_save_history: true,
      additional_messages: [
        {
          role: 'user',
          content: message,
          content_type: 'text'
        }
      ]
    }
    
    // ... existing code ...
  },
  
  // 获取所有可用机器人
  getAvailableBots(): BotConfig[] {
    return availableBots
  },
  
  // 根据ID获取机器人配置
  getBotById(botId: string): BotConfig | undefined {
    return availableBots.find(bot => bot.id === botId)
  }
} 
```

## 设计说明

1. 我添加了一个`BotConfig`接口来定义机器人的基本信息，包括ID、名称和可选的描述。

2. 创建了一个`availableBots`数组来存储所有可用的机器人配置，默认包含环境变量中的机器人。

3. 修改了`sendMessage`方法，增加了一个可选的`botId`参数，默认使用环境变量中的BOT_ID。

4. 添加了两个辅助方法：
   - `getAvailableBots()`: 获取所有可用的机器人列表
   - `getBotById()`: 根据ID查找特定机器人

## 使用建议

1. 在前端界面中，可以添加一个下拉菜单让用户选择不同的机器人。

2. 可以将机器人配置存储在数据库或配置文件中，而不是硬编码在代码中。

3. 如果需要为不同机器人保存独立的对话历史，可以在存储对话时加入botId作为标识。

4. 考虑为不同机器人设置不同的UI主题或风格，提升用户体验。
