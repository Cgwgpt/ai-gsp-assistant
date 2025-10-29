# Vercel部署指南

## 前提条件
1. 在Vercel上注册账号 (https://vercel.com)
2. 安装Vercel CLI (可选): `npm i -g vercel`

## 部署步骤

### 方法一：使用Vercel仪表板
1. 登录Vercel仪表板
2. 点击"New Project"按钮
3. 导入您的Git仓库
4. 在项目配置页面：
   - 构建命令会自动设置为 `npm run build`
   - 输出目录会自动设置为 `dist`
5. 展开"Environment Variables"部分，添加以下环境变量：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_COZE_API_KEY`
   - `VITE_COZE_BOT_ID`
6. 点击"Deploy"按钮

### 方法二：使用Vercel CLI
1. 打开终端并导航到项目根目录
2. 运行 `vercel login` 并按照提示登录
3. 运行 `vercel` 命令部署
4. 按照CLI提示配置项目
5. 确保添加所有环境变量

## 注意事项
- 在项目部署后，您需要获取Vercel生成的域名，并在应用中更新API基础URL
- 可以在Vercel仪表板中为项目配置自定义域名
- 每次推送代码到主分支后，Vercel将自动重新部署

## 本地测试Vercel构建
可以使用以下命令在本地测试Vercel构建过程：
```bash
npm run build
npm run preview
```

## 问题排查
如果部署后遇到问题，请检查：
1. Vercel部署日志中的错误信息
2. 确保所有环境变量已正确设置
3. 检查API请求是否使用正确的URL 