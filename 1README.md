# Modern Web App

基于 Nuxt 3 + TypeScript + Supabase 的现代化 Web 应用模板

## 项目结构

```
├── components/     # Vue 组件
├── composables/    # 组合式函数
├── layouts/        # 页面布局
├── pages/         # 页面组件
├── server/        # 服务端代码
│   └── api/       # API 端点
├── stores/        # 状态管理
├── types/         # TypeScript 类型定义
└── utils/         # 工具函数
```

## 技术栈

- Nuxt 3
- Vue 3
- TypeScript
- Pinia
- Supabase
- Axios

## 开发指南

1. 安装依赖：

```bash
npm install
```

2. 启动开发服务器：

```bash
npm run dev
```

3. 构建生产版本：

```bash
npm run build
```

4. 运行测试：

```bash
npm test
```

## 最佳实践

1. **状态管理**
- 使用 Pinia 进行状态管理
- 将业务逻辑封装在 store 中

2. **类型安全**
- 使用 TypeScript 进行类型检查
- 为 API 响应定义接口

3. **代码组织**
- 使用组合式 API
- 将可复用逻辑提取到 composables

4. **API 调用**
- 使用封装的 HTTP 客户端
- 统一的错误处理

5. **安全性**
- 使用 Supabase 进行身份认证
- 实现请求拦截器 

我来分析一下项目文件结构并提供优化建议：

### 当前项目结构分析

1. **主要组件**:
- GspReportInterface.vue - GSP缺陷报告界面
- okLandingPage.vue - 落地页
- FrameworkSupport.vue - 框架支持展示
- FeaturesSection.vue - 功能特性展示

2. **数据管理**:

```1:1298:src/data/defects.js
export const defects = [
  // 严重缺陷
  {
    id: 1,
    level: 'serious',
    levelName: '严重',
    category: 'document',
    content: '企业向部分下游客户销售药品未开具销售发票，且企业部分药品账、货不一致'
  },
  
  // 主要缺陷
  {
    id: 2,
    level: 'major',
    levelName: '主要',
    category: 'training',
    content: '企业已开展培训，但个别人员还没有正确理解。如养护员对计算机系统中如何做养护记录不清楚，对企业重点养护品种如何确定不清楚'
  },
  {
    id: 3, 
    level: 'major',
    levelName: '主要',
    category: 'personnel',
    content: '企业质量负责人计算机系统操作不熟练，信息员素质与能力达不到岗位要求'
  },
  {
    id: 4,
    level: 'major',
    levelName: '主要',
    category: 'computer',
    content: '计算机系统部分项目未能完全保证数据可追溯,部分手持RF操作记录在操作日志内未体现'
  },
  {
    id: 5,
    level: 'major',
    levelName: '主要',
    category: 'transport',
    content: '质量管理部门对药品采购、运输环节的质量管理工作指导不力，未能发现委托运输单位道路运输经营许可证均已过期'
  },
  {
    id: 6,
    level: 'major',
    levelName: '主要',
    category: 'personnel',
    content: '企业质量管理部门负责人不能有效履职。核查对本岗位职责不熟悉'
  },
  {
    id: 7,
    level: 'major',
    levelName: '主要',
    category: 'computer',
    content: '企业计算机未涵盖药品销毁环节，企业不合格药品销毁台账采用手工记录'
  },
  {
    id: 8,
    level: 'major',
    levelName: '主要',
    category: 'inspection',
    content: '企业对个别购进药品未按规定打开原包装箱抽样检查'
  },
  {
    id: 9,
    level: 'major',
    levelName: '主要',
    category: 'quality',
    content: '企业开展的质量管理体系内审流于形式，未涉及日常监管存在的问题的整改情况的审查确认内容'
  },
  {
    id: 10,
    level: 'major',
    levelName: '主要',
    category: 'temperature',
    content: '湿度超标时调控措施不力，也无调控措施记录。抽查一楼待验区和复核区湿度长时间超标'
  },
  {
    id: 11,
    level: 'major',
    levelName: '主要',
    category: 'computer',
    content: '电脑药品不合格记录原因栏为空白'
  },
  {
    id: 12,
    level: 'major',
    levelName: '主要',
    category: 'training',
    content: '企业有培训，但效果不明显，部分人员质量管理意识不强、业务不熟悉'
  },
  {
    id: 13,
    level: 'major',
    levelName: '主要',
    category: 'storage',
    content: '二楼设有中药材专库，现场检查时企业库存无中药材，但满库存放中药饮片'
  },
  {
    id: 14,
    level: 'major',
    levelName: '主要',
    category: 'storage',
    content: '企业仓库面积与经营规模不相适应：企业上年度销售额22.5亿元，常温库内货架已放满药品，将36个品种存放在通道上'
  },
  {
    id: 15,
    level: 'major',
    levelName: '主要',
    category: 'computer',
    content: '个别计算机系统操作人员未符合授权范围，验收员请假期间其验收记录实际由他人操作完成'
  },
  {
    id: 16,
    level: 'major',
    levelName: '主要',
    category: 'coldchain',
    content: '个别冷藏药品到货时未按制度规定做好记录，在备用冷库中存有非企业货主单位的药品，未设置状态标识'
  },
  {
    id: 17,
    level: 'major',
    levelName: '主要',
    category: 'inspection',
    content: '质量管理部门对药品收货验收环节指导监督不到位。未明确规定对待处理药品的管理流程，也未建立待处理药品台账记录'
  },
  {
    id: 18,
    level: 'major',
    levelName: '主要',
    category: 'document',
    content: '部分制度及操作程序审核、批准程序执行不严。审批生效的制度缺页，内容不完整。部分制度缺少批准人、批准日期及执行日期记录'
  },
  {
    id: 19,
    level: 'major',
    levelName: '主要',
    category: 'computer',
    content: '计算机系统部分功能不全。销售记录仅能以药品名或客户名称检索，不能以药品批号检索，无法实现对同批次药品的便捷追溯'
  },
  {
    id: 20,
    level: 'major',
    levelName: '主要',
    category: 'personnel',
    content: '企业质量负责人未全职上班，在其不上班期间，计算机系统中首营资料审核职责由他人以其名义代为操作'
  },
  {
    id: 21,
    level: 'major',
    levelName: '主要',
    category: 'training',
    content: '冷藏车驾驶员未经过冷链运输相关的培训'
  },
  {
    id: 22,
    level: 'major',
    levelName: '主要',
    category: 'computer',
    content: '计算机管理岗位修改基础数据没有经过质量管理部门审核即可生效。企业负责人尚无计算机管理系统账号，延用原企业负责人账号'
  },
  {
    id: 23,
    level: 'major',
    levelName: '主要',
    category: 'special',
    content: '含麻黄碱类复方制剂部分销售回单未签字，也未与销售客户备案资料进行核验'
  },
  {
    id: 24,
    level: 'major',
    levelName: '主要',
    category: 'quality',
    content: '企业质量管理部门未及时更新部分供货单位的随货同行单的样张，随货同行的销货清单与首营企业档案里面备案的样张不一致'
  },
  {
    id: 25,
    level: 'major',
    levelName: '主要',
    category: 'training',
    content: '企业质量管理员于2020年7月10日从原单位离职，7月15日接受岗前培训，但计算机系统显示其于2020年7月10日开展客户信息修改工作，且其质量管理、计算机操作欠熟练'
  },
  {
    id: 26,
    level: 'major',
    levelName: '主要',
    category: 'transport',
    content: '企业委托储存配送单位仓库的暂存处存放的养阴清肺口服液现场未能提供相关暂存记录'
  },
  {
    id: 27,
    level: 'major',
    levelName: '主要',
    category: 'purchase',
    content: '部分采购订单中采购部门未记录供货单位委托运输药品的承运方式、承运单位、启运时间等信息'
  },
  {
    id: 28,
    level: 'major',
    levelName: '主要',
    category: 'document',
    content: '企业质量管理制度中包括含特殊药品复方制剂的相关规定'
  },
  {
    id: 29,
    level: 'major',
    levelName: '主要',
    category: 'transport',
    content: '企业部分非冷藏药品委托速运有限公司配送，未对承运方运输药品的质量保障能力进行审计'
  },
  {
    id: 30,
    level: 'major',
    levelName: '主要',
    category: 'training',
    content: '企业培训效果不佳，经现场提问，质量负责人不能有效履行岗位职责，实际操作中主要承担质量管理员的职责'
  },
  {
    id: 31,
    level: 'major',
    levelName: '主要',
    category: 'document',
    content: '质量管理体系文件的修订、审核、批准未按照文件管理操作规程进行，新《药品管理法》实施后，企业未及时修订质量管理体系文件'
  },
  {
    id: 32,
    level: 'major',
    levelName: '主要',
    category: 'transport',
    content: '企业委托第三方物流有限公司储存配送，未根据验证结果对可能存在的影响药品质量安全的风险制定有效的预防措施'
  },
  {
    id: 33,
    level: 'major',
    levelName: '主要',
    category: 'computer',
    content: '企业的计算机系统不能有效控制药品经营全过程，除随货同行单、印章、开信件上传计算机系统外，其他首营企业、销售客户资料均未上传计算机系统'
  },
  {
    id: 34,
    level: 'major',
    levelName: '主要',
    category: 'quality',
    content: '企业2019年12月组织的年度内审，无内审报告；企业于2019年8月变更注册地址未做专项内审；企业于2020年6月增加了中药饮片经营范围，未做专项内审'
  },
  {
    id: 35,
    level: 'major',
    levelName: '主要',
    category: 'training',
    content: '企业对各岗位人员培训不到位。如：2020年5月25日新批准执行的企业制度、职责、程序，未对各岗位人员进行培训'
  },
  {
    id: 36,
    level: 'major',
    levelName: '主要',
    category: 'validation',
    content: '企业未根据相关验证管理制度形成验证控制文件。验证操作规程中未制定验证具体实施要求；企业未按规定对温湿度监测设备进行校准或检定'
  },
  {
    id: 37,
    level: 'major',
    levelName: '主要',
    category: 'transport',
    content: '委托其他单位运输药品，未对承运方运输药品的质量保障能力进行审计'
  },
  {
    id: 38,
    level: 'major',
    levelName: '主要',
    category: 'inspection',
    content: '企业部分销后退回药品未按规定验收。退货验收入库的药品实物已破损，并放置于销后退回区'
  },
  {
    id: 39,
    level: 'major',
    levelName: '主要',
    category: 'quality',
    content: '企业2020年组织的内审，内审评审表中"检查记录"一栏为空，未填写检查结论，未对内审中存在的问题进行分析并制定改进措施'
  },
  {
    id: 40,
    level: 'major',
    levelName: '主要',
    category: 'document',
    content: '企业未按文件规定执行各岗位职责，企业组织机构与岗位设置不相符'
  },
  {
    id: 41,
    level: 'major',
    levelName: '主要',
    category: 'quality',
    content: '质管部门未对供货企业合法性审核内容进行动态管理。部分供货企业的随货同行单与企业留存样式不一致；部分企业法人授权书已过期'
  },
  {
    id: 42,
    level: 'major',
    levelName: '主要',
    category: 'computer',
    content: '企业质管部门对计算机系统权限设置和基础数据未能有效指导、审核。部分人员各有2个账号，部分基础信息录入不全'
  },
  {
    id: 43,
    level: 'major',
    levelName: '主要',
    category: 'training',
    content: '企业对部分岗位人员培训效果不明显。质管员对本岗位职责及计算机系统操作不熟悉；养护员不会操作温湿度监控系统'
  },
  {
    id: 44,
    level: 'major',
    levelName: '主要',
    category: 'computer',
    content: '企业计算机系统部分生成的数据录入不准确。系统不能及时正常生成相关记录'
  },
  {
    id: 45,
    level: 'major',
    levelName: '主要',
    category: 'computer',
    content: '企业进销存数据与温湿度监测数据未按日异地备份'
  },
  {
    id: 46,
    level: 'major',
    levelName: '主要',
    category: 'quality',
    content: '企业未完成首营品种的审核即开展采购并进行了销售'
  },
  {
    id: 47,
    level: 'major',
    levelName: '主要',
    category: 'inspection',
    content: '企业未按要求对到货药品进行收货、验收。在验收养护室发现多个药品，查计算机系统均无采购、验收等相关记录'
  },
  {
    id: 48,
    level: 'major',
    levelName: '主要',
    category: 'storage',
    content: '养护人员对有问题的药品未及时处理。中药饮片库中的蜈蚣外包装破损，且有5条蜈蚣散落在包装盒外面'
  },
  {
    id: 49,
    level: 'major',
    levelName: '主要',
    category: 'quality',
    content: '企业不合格品处理程序不规范。不合格区实际存放药品数量与计算机系统中的不合格库存报表不符'
  },
  {
    id: 50,
    level: 'major',
    levelName: '主要',
    category: 'inspection',
    content: '企业未按规定进行药品退货管理。阴凉库退货区发现药品，经查计算机系统，该批退货药品已无库存'
  },
  {
    id: 51,
    level: 'major',
    levelName: '主要',
    category: 'quality',
    content: '企业开展的2019年质量管理体系内审流于形式。内审核查表缺检查时间，部分内审内容和企业实际不符'
  },
  {
    id: 52,
    level: 'major',
    levelName: '主要',
    category: 'quality',
    content: '企业开展的质量负责人变更专项内审，未对变更后的质量负责人履职能力开展审查；注册地址变更项内审，内审内未针对注册地址变更事项'
  },
  {
    id: 53,
    level: 'major',
    levelName: '主要',
    category: 'personnel',
    content: '企业未设立与其经营活动相适应的岗位，如未确定收货岗位人员'
  },
  {
    id: 54,
    level: 'major',
    levelName: '主要',
    category: 'training',
    content: '企业制定的2020年度培训计划内容简单，培训内容缺少《疫苗管理法》等；培训记录不完整，缺培训人、签到、授课内容记录'
  },
  {
    id: 55,
    level: 'major',
    levelName: '主要',
    category: 'temperature',
    content: '温湿度监测系统数据未按日备份，如6月26日的温湿度监测系统数据7月8日备份'
  },
  {
    id: 56,
    level: 'major',
    levelName: '主要',
    category: 'validation',
    content: '质量管理部门验证计划制定不全。如：未将保温箱纳入2020年年度验证计划'
  },
  {
    id: 57,
    level: 'major',
    levelName: '主要',
    category: 'document',
    content: '企业制定的中药材、中药饮片管理制度中养护环节无"禁止采用硫磺熏蒸"的内容'
  },
  {
    id: 58,
    level: 'major',
    levelName: '主要',
    category: 'inspection',
    content: '药品到货时，收货员未对承运车辆、启运时间等信息'
  },
  {
    id: 59,
    level: 'major',
    levelName: '主要',
    category: 'computer',
    content: '企业计算机系统中不合格药品销毁审批记录中无采购部审批记录'
  },
  {
    id: 60,
    level: 'major',
    levelName: '主要',
    category: 'training',
    content: '企业培训管理制度规定由人事部门制定培训计划并开展，实际由质量管理部门制定并开展；部分人员履行职责但未经过岗前培训'
  },
  {
    id: 61,
    level: 'major',
    levelName: '主要',
    category: 'computer',
    content: '企业计算机工号分配未覆盖企业人事部门，行政人事专员无工号及相关操作权限'
  },
  {
    id: 62,
    level: 'major',
    levelName: '主要',
    category: 'purchase',
    content: '企业和药品销售有限公司于2020年5月7日签订了购入药品的正式合同，首营品种审核时间为2020年5月8日'
  },
  {
    id: 63,
    level: 'major',
    levelName: '主要',
    category: 'validation',
    content: '企业验证使用的个别温湿度监测设备校准不合格，企业继续使用。验证温度设备在第三方校准结果中温度测量值与标准值差超过最大允许误差'
  },
  {
    id: 64,
    level: 'major',
    levelName: '主要',
    category: 'validation',
    content: '验证结果未作为企业制定或修订质量管理体系文件相关内容的依据。验证报告中冷藏车的夏季关机保温时限与企业应急预案规定不一致'
  },
  {
    id: 65,
    level: 'major',
    levelName: '主要',
    category: 'computer',
    content: '企业计算机系统运行中涉及企业经营和管理的数据未采用安全、可靠的方式储存并按日备份。主服务器与备服务器在同一场所，不能防止同时遭遇灾害'
  },
  {
    id: 66,
    level: 'major',
    levelName: '主要',
    category: 'quality',
    content: '企业2019年组织的内审，内审表中无《药品经营质量管理规范》附录内容，内审后无问题整改跟踪记录'
  },
  {
    id: 67,
    level: 'major',
    levelName: '主要',
    category: 'quality',
    content: '企业质管部门未对销售人员法人委托书进行有效管理。现场不能提供销售人员法人委托书存根；企业现行体系件中也无"法人委托书管理"相关规定'
  },
  {
    id: 68,
    level: 'major',
    levelName: '主要',
    category: 'computer',
    content: '企业质管部门对计算机操作系统权限未能进行有效审核，保管员、验收员、收货员计算机系统登录密码均为123456；温湿度监控系统只有超级管理员账号'
  },
  {
    id: 69,
    level: 'major',
    levelName: '主要',
    category: 'temperature',
    content: '现场测试温湿度监控系统，对常温库探头进行超标测试，探头有声光报警，但公司员工未收到报警短信；报警短信接收人设置不完整'
  },
  {
    id: 70,
    level: 'major',
    levelName: '主要',
    category: 'quality',
    content: '企业于2020年4月22日从医药有限公司购进的麝香追风膏随货同行票与备案式样不一致'
  },
  {
    id: 71,
    level: 'major',
    levelName: '主要',
    category: 'storage',
    content: '现场抽查在库药品，查询计算机系统，实际库存与系统库存不符，企业不能说明去向'
  },
  {
    id: 72,
    level: 'major',
    levelName: '主要',
    category: 'transport',
    content: '企业对受托运输单位信息收集不完整，承运单位提供的重型厢式货车信息显示车辆非其自有，无租赁证明'
  },
  {
    id: 73,
    level: 'major',
    levelName: '主要',
    category: 'personnel',
    content: '企业质量负责人未履行负责药品质量管理工作。质量负责人检查时不在岗，近一月无考勤记录，平时不在公司上班'
  },
  {
    id: 74,
    level: 'major',
    levelName: '主要',
    category: 'computer',
    content: '质量管理部未按部门职责负责经营业务数据修改申请的审核，无数据修改审核权限'
  },
  {
    id: 75,
    level: 'major',
    levelName: '主要',
    category: 'storage',
    content: '企业不合格药品库内放置躺椅、打印纸、监控设备等物品'
  },
  {
    id: 76,
    level: 'major',
    levelName: '主要',
    category: 'validation',
    content: '企业未对温湿度监测设备定期校准，上年度校准时间为2019年1月8日'
  },
  {
    id: 77,
    level: 'major',
    levelName: '主要',
    category: 'quality',
    content: '企业留存的部分供货单位销售人员资料内容不完整。如供货企业提供的法人授权委托书中单位和委托期限为空白'
  },
  {
    id: 78,
    level: 'major',
    levelName: '主要',
    category: 'storage',
    content: '部分药品未按规定储存。如需凉暗处储存的药品硫辛酸片存放在常温库'
  },
  {
    id: 79,
    level: 'major',
    levelName: '主要',
    category: 'storage',
    content: '药品阴凉库待处理区、待验区、合格品区储存较多口罩、消毒液等非药品药品常温区内服药与外用药未分开存放'
  },
  {
    id: 80,
    level: 'major',
    levelName: '主要',
    category: 'personnel',
    content: '企业制定了2019年总的质量目标和要求，但未落实到各岗位'
  },
  {
    id: 81,
    level: 'major',
    levelName: '主要',
    category: 'quality',
    content: '企业2020年1月份开展了全面内审，但内审工作流于形式，内审报告中没有体现整改的措施和整改结果核实的内容'
  },
  {
    id: 82,
    level: 'major',
    levelName: '主要',
    category: 'personnel',
    content: '企业质量负责人对本岗位职责欠熟悉。如：现场提问不能准确回答企业的"质量方针"，计算机操作不熟练'
  },
  {
    id: 83,
    level: 'major',
    levelName: '主要',
    category: 'training',
    content: '企业信息管理员未参加本岗位职责的岗前培训，对本岗位职责不熟悉，如对计算机操作不熟悉'
  },
  {
    id: 84,
    level: 'major',
    levelName: '主要',
    category: 'storage',
    content: '2020年6月份，企业阴凉库湿度有多次超出规定范围记录，但养护员未采取有效措施'
  },
  {
    id: 85,
    level: 'major',
    levelName: '主要',
    category: 'validation',
    content: '企业2019年只对温湿度变送器进行了校准，相关数据进行了分析，但未对温湿度监测系统进行验证'
  },
  {
    id: 86,
    level: 'major',
    levelName: '主要',
    category: 'transport',
    content: '企业制定的《药品配送运输程序》中未明确运输记录人，只表明由复核员负责查对'
  },
  {
    id: 87,
    level: 'major',
    levelName: '主要',
    category: 'training',
    content: '现场提问企业质量负责人法律法规、药品专业知识，回答不准确'
  },
  {
    id: 88,
    level: 'major',
    levelName: '主要',
    category: 'computer',
    content: '企业质量负责人登录验收员账号履行验收员的职责。计算机系统数据修改未记录修改原因'
  },
  {
    id: 89,
    level: 'major',
    levelName: '主要',
    category: 'inspection',
    content: '部分到货药品未按规定开箱验收，如现场发现公司购进的复合维生素片购进2件，其中1件未开箱验收'
  },
  {
    id: 90,
    level: 'major',
    levelName: '主要',
    category: 'storage',
    content: '部分药品堆垛垛间距不符要求，如妇科调经颗粒与风湿定胶囊垛间距小于5厘米'
  },
  {
    id: 91,
    level: 'major',
    levelName: '主要',
    category: 'special',
    content: '企业销售含特殊药品复方制剂酚麻美敏片，存在未索取部分药房收货人身份证明和签字样式问题'
  },
  {
    id: 92,
    level: 'major',
    levelName: '主要',
    category: 'training',
    content: '企业未对个别岗位人员进行与其职责和工作内容相关的岗前培训。药品出库快递打包人员无相关培训记录，不能提供体检报告'
  },
  {
    id: 93,
    level: 'major',
    levelName: '主要',
    category: 'storage',
    content: '企业仓库面积与其经营规模不相适应'
  },
  {
    id: 94,
    level: 'major',
    levelName: '主要',
    category: 'storage',
    content: '中药饮片未专库存放。企业在2020年3月至4月期间，在中药饮片库同时存放了中药与中成药'
  },
  {
    id: 95,
    level: 'major',
    levelName: '主要',
    category: 'validation',
    content: '企业在开展温湿度监测系统验证时，未采用符合国家有规定的温湿度传感器。传感器校验证书中显示其湿度校准范围未涵盖35%-40%的测量范围'
  },
  {
    id: 96,
    level: 'major',
    levelName: '主要',
    category: 'computer',
    content: '计算机系统部分控制功能不完整。系统显示供货单位证照过期仍能进行产品采购计划编制；退货审批记录一审时间晚于二审时间'
  },
  {
    id: 97,
    level: 'major',
    levelName: '主要',
    category: 'storage',
    content: '药品与非药品未分开存放，并无明显标识。现场检查时，酒精、消毒剂、口罩等非药品与药品存放在药品合格品区'
  },
  {
    id: 98,
    level: 'major',
    levelName: '主要',
    category: 'inspection',
    content: '个别药品出库时未严格对照销售记录进行复核。现场抽查珊瑚癣净整货实物库存与计算机系统该批号产品库存不符'
  },
  {
    id: 99,
    level: 'major',
    levelName: '主要',
    category: 'quality',
    content: '企业对部分不合格药品的处理不符合相关规定。不合格药品销毁纪录显示直接弃于小区的标识有害垃圾的垃圾桶'
  },
  {
    id: 100,
    level: 'major',
    levelName: '主要',
    category: 'inspection',
    content: '质量管理部门对药品验收环节的质量管理工作监督不到位。收货验收人员计算机系统录入时输错批号，对该批药品做出购进退出，再重新进行购进、收货验收的计算机操作'
  },
  {
    id: 101,
    level: 'major',
    levelName: '主要',
    category: 'training',
    content: '现任质量管理机构负责人（尚未备案）、质管员培训不到位，对本岗位职责欠熟悉。拟变更的质量管理机构负责人尚不熟悉计算机管理系统'
  },
  {
    id: 102,
    level: 'major',
    levelName: '主要',
    category: 'storage',
    content: '部分药品混垛堆放。如3楼整件阴凉库莲花清瘟胶囊混放在乳酸左氧氟沙星注射液药品上面'
  },
  {
    id: 103,
    level: 'major',
    levelName: '主要',
    category: 'inspection',
    content: '质量管理部门对药品退货验收环节的质量管理工作监督不到位。企业未经质管部门审核，验收员直接将退货的不合格药品验收合格入库'
  },
  {
    id: 104,
    level: 'minor',
    levelName: '一般',
    category: 'validation',
    content: '企业对供货单位的质量管理体系评价内容不全面。如对供货企业质量管理体系调查审核表中，质量管理体系文件、设施设备的评价内容为空白'
  },
  {
    id: 105,
    level: 'minor',
    levelName: '一般',
    category: 'storage',
    content: '中药饮片仓库换气扇未设置防虫网'
  },
  {
    id: 106,
    level: 'minor',
    levelName: '一般',
    category: 'document',
    content: '个别岗位未按照文件规定开展工作，如销后退回药品操作与质量管理制度内制定的流程不一致'
  },
  {
    id: 107,
    level: 'minor',
    levelName: '一般',
    category: 'temperature',
    content: '温湿度等数据记录未按日进行备份。储运部养护员负责仓库温湿度数据备份工作，其公休时间，备份工作无人替代'
  },
  {
    id: 108,
    level: 'minor',
    levelName: '一般',
    category: 'quality',
    content: '首营品种资料中的药品说明书备案件没有及时更新。部分药品说明书和企业首营档案中的备案说明书复印件中国代理商名称不一致'
  },
  {
    id: 109,
    level: 'minor',
    levelName: '一般',
    category: 'document',
    content: '企业未结合实际操作情况，定期开展文件的审核、修订。如企业不合格药品库中划分待销毁区和待采退区，"不合格药品操作规程"中未明确哪类不合格药品存放待采退区'
  },
  {
    id: 110,
    level: 'minor',
    levelName: '一般',
    category: 'temperature',
    content: '企业对个别养护信息未进行定期汇总、分析。如企业冷库监测点多次出现短时间低于2℃情况，养护人员未汇总分析该情况并采取风险防控措施'
  },
  {
    id: 111,
    level: 'minor',
    levelName: '一般',
    category: 'document',
    content: '企业自2016年6月制度制定后，未按照国家相关法律法规及时修订；企业存在地产收购中药材经营行为，但无相应管理制度'
  },
  {
    id: 112,
    level: 'minor',
    levelName: '一般',
    category: 'computer',
    content: '企业个别人员计算机系统未按授权及密码操作，存在由他人代操作采购订单情况'
  },
  {
    id: 113,
    level: 'minor',
    levelName: '一般',
    category: 'storage',
    content: '库房无安全防护措施，如现场检查时有快递人员直接进入仓库'
  },
  {
    id: 114,
    level: 'minor',
    levelName: '一般',
    category: 'coldchain',
    content: '企业未按设施设备管理制度要求对保温箱及蓄冷剂建立设施设备档案，缺少维修保养记录'
  },
  {
    id: 115,
    level: 'minor',
    levelName: '一般',
    category: 'transport',
    content: '个别药品运输记录的快递单号登记错误，影响药品物流信息追溯'
  },
  {
    id: 116,
    level: 'minor',
    levelName: '一般',
    category: 'document',
    content: '现行的体系文件不完整且有废止的文件夹杂其中'
  },
  {
    id: 117,
    level: 'minor',
    levelName: '一般',
    category: 'storage',
    content: '检查中发现多个在库药品外包装破损，养护人员在养护过程中未发现并进行相关处理'
  },
  {
    id: 118,
    level: 'minor',
    levelName: '一般',
    category: 'storage',
    content: '企中药材库等换气扇无防虫网'
  },
  {
    id: 119,
    level: 'minor',
    levelName: '一般',
    category: 'storage',
    content: '企业仓库未设置"退货区"'
  },
  {
    id: 120,
    level: 'minor',
    levelName: '一般',
    category: 'quality',
    content: '企业2020年的不合格药品汇总分析记录中未对不合格原因进行分析，未采取预防措施'
  },
  {
    id: 121,
    level: 'minor',
    levelName: '一般',
    category: 'transport',
    content: '企业计算机管理系统运输登记记录缺少物流信息，不能实现运输过程中的质量追溯'
  },
  {
    id: 122,
    level: 'minor',
    levelName: '一般',
    category: 'document',
    content: '新修订《药品管理法》实施后，企业未及时修订质量管理体系文件。如供货单位审核要求仍包含已取消的认证证书'
  },
  {
    id: 123,
    level: 'minor',
    levelName: '一般',
    category: 'storage',
    content: '阴凉库地面部分区域有积水，未及时处理并做有效预防措施'
  },
  {
    id: 124,
    level: 'minor',
    levelName: '一般',
    category: 'document',
    content: '企业部分工作未严格按照操作规程开展。实际操作中，《不合格药品报损审批表》签字不完整；药品未按收货和验收状态设置进行分区'
  },
  {
    id: 125,
    level: 'minor',
    levelName: '一般',
    category: 'transport',
    content: '企业建立的委托运输记录不准确。抽查发货物流信息，计算机系统内的送货记录车牌与实际不符'
  },
  {
    id: 126,
    level: 'minor',
    levelName: '一般',
    category: 'inspection',
    content: '企业未按照规定开箱验收。仓库二楼合格品区发现药品整件未开箱验收'
  },
  {
    id: 127,
    level: 'minor',
    levelName: '一般',
    category: 'quality',
    content: '企业2019年未开展不合格品汇总分析'
  },
  {
    id: 128,
    level: 'minor',
    levelName: '一般',
    category: 'quality',
    content: '企业2019年、2020年均未开展不合格品汇总分析'
  },
  {
    id: 129,
    level: 'minor',
    levelName: '一般',
    category: 'quality',
    content: '企业对部分供货单位未开展综合质量评价'
  },
  {
    id: 130,
    level: 'minor',
    levelName: '一般',
    category: 'storage',
    content: '企业未按制度规定每季对库存药品定期盘点，现场提供的盘点记录无盘点日期，无盘点人员签字'
  },
  {
    id: 131,
    level: 'minor',
    levelName: '一般',
    category: 'facility',
    content: '企业仓库安全设施不到位，无门禁等设施'
  },
  {
    id: 132,
    level: 'minor',
    levelName: '一般',
    category: 'facility',
    content: '企业个别岗位未配备专用的电脑，如验收、出库复核'
  },
  {
    id: 133,
    level: 'minor',
    levelName: '一般',
    category: 'facility',
    content: '企业未按设施设备管理制度要求对保温箱建立设施设备档案'
  },
  {
    id: 134,
    level: 'minor',
    levelName: '一般',
    category: 'quality',
    content: '企业经营的中药饮片秫米外包装标签标注的质量标准与其检验报告中标注的检验依据不一致，企业未开展质量查询'
  },
  {
    id: 135,
    level: 'minor',
    levelName: '一般',
    category: 'transport',
    content: '企业的运输车辆资料未收集整理建立档案'
  },
  {
    id: 136,
    level: 'minor',
    levelName: '一般',
    category: 'storage',
    content: '库房放置的防鼠夹没有食饵'
  },
  {
    id: 137,
    level: 'minor',
    levelName: '一般',
    category: 'storage',
    content: '包装物料没有统一放置在包装物料区'
  },
  {
    id: 138,
    level: 'minor',
    levelName: '一般',
    category: 'quality',
    content: '进口药品首营品种审批表格式有差错，申请时间与药品证书有效期不符'
  },
  {
    id: 139,
    level: 'minor',
    levelName: '一般',
    category: 'inspection',
    content: '喜炎平注射液验收时未检查至最小包装'
  },
  {
    id: 140,
    level: 'minor',
    levelName: '一般',
    category: 'quality',
    content: '企业与委托生产企业签订的委托合同和质量保证协议中双方质量责任不够明确'
  },
  {
    id: 141,
    level: 'minor',
    levelName: '一般',
    category: 'personnel',
    content: '部分企业员工健康档案内容为企业2018年筹建时填写的信息，未根据实际情况更新记录，个别员工未在规定时间内体检'
  },
  {
    id: 142,
    level: 'minor',
    levelName: '一般',
    category: 'quality',
    content: '企业2019年度进货质量评审不全面，无评审计划，无对下一年度供货商的建议及采购工作的改进措施'
  },
  {
    id: 143,
    level: 'minor',
    levelName: '一般',
    category: 'storage',
    content: '养护人员未能有效的对库存药品进行外观、包装等质量状况进行检查。发现多个药品外包装破损或存放位置不当'
  },
  {
    id: 144,
    level: 'minor',
    levelName: '一般',
    category: 'storage',
    content: '检查企业养护记录，发现养护人员未对近效期药品进行重点养护，如归脾片三月份以后无养护记录'
  },
  {
    id: 145,
    level: 'minor',
    levelName: '一般',
    category: 'quality',
    content: '企业未对2019年不合格药品进行汇总分析'
  },
  {
    id: 146,
    level: 'minor',
    levelName: '一般',
    category: 'storage',
    content: '企业对库存药品定期盘点记录内容不全面，盘点记录无盘点人员签字，盘点结果未在高管范围内传递'
  },
  {
    id: 147,
    level: 'minor',
    levelName: '一般',
    category: 'transport',
    content: '查询企业计算机系统，委托运输记录不完整，部分记录无运输单位、车牌号、驾驶员身份证号'
  },
  {
    id: 148,
    level: 'minor',
    levelName: '一般',
    category: 'storage',
    content: '包装物料间内存放桌、椅和生活用品'
  },
  {
    id: 149,
    level: 'minor',
    levelName: '一般',
    category: 'transport',
    content: '未按规定对运输车辆定期检查，自备轻型厢式货车年检已过期'
  },
  {
    id: 150,
    level: 'minor',
    levelName: '一般',
    category: 'quality',
    content: '企业提供的质量保证协议中有效期、签订日期、代表签名栏目为空白'
  },
  {
    id: 151,
    level: 'minor',
    levelName: '一般',
    category: 'inspection',
    content: '企业验收记录缺验收合格数量，销后退回验收记录缺验收合格数量、验收结果'
  },
  {
    id: 152,
    level: 'minor',
    levelName: '一般',
    category: 'personnel',
    content: '企业收货员、验收员在实际工作中未按企业制定的操作规程操作'
  },
  {
    id: 153,
    level: 'minor',
    levelName: '一般',
    category: 'quality',
    content: '企业质量管理部门发现经营的药品外包装标注有特殊数字后没有开展质量查询'
  },
  {
    id: 154,
    level: 'minor',
    levelName: '一般',
    category: 'quality',
    content: '企业未及时收集企业内部质量信息'
  },
  {
    id: 155,
    level: 'minor',
    levelName: '一般',
    category: 'facility',
    content: '企业建立的储存养护设备档案资料不完整，如在用的除湿机均无购进票据，未明确放置使用库区'
  },
  {
    id: 156,
    level: 'minor',
    levelName: '一般',
    category: 'inspection',
    content: '企业购进验收后，验收员个别批次未加贴标识'
  },
  {
    id: 157,
    level: 'minor',
    levelName: '一般',
    category: 'storage',
    content: '企业拆除外包装的零货药品未集中存放，如销后退回的无原外包装的药品存放在整件阴凉库'
  },
  {
    id: 158,
    level: 'minor',
    levelName: '一般',
    category: 'inspection',
    content: '企业销售凭证中更改收货地址、收货人联系电话未注明更改理由'
  },
  {
    id: 159,
    level: 'minor',
    levelName: '一般',
    category: 'storage',
    content: '企业库房内未设置复核作业区，将待复核的药品存放于待发区'
  },
  {
    id: 160,
    level: 'minor',
    levelName: '一般',
    category: 'inspection',
    content: '氯化钠验收时未检查至最小包装'
  },
  {
    id: 161,
    level: 'minor',
    levelName: '一般',
    category: 'transport',
    content: '企业委托物流有限公司进行配送，签订的《代理药品物流协议》中未明确省内运输在途时限'
  },
  {
    id: 162,
    level: 'minor',
    levelName: '一般',
    category: 'inspection',
    content: '企业合格品区止咳片验收后未贴验收标示。企业验收记录无验收合格数量项目'
  },
  {
    id: 163,
    level: 'minor',
    levelName: '一般',
    category: 'transport',
    content: '委托运输记录中，货单号一栏为空白'
  },
  {
    id: 164,
    level: 'minor',
    levelName: '一般',
    category: 'personnel',
    content: '企业未配备专职或兼职人员负责售后投诉管理'
  },
  {
    id: 165,
    level: 'minor',
    levelName: '一般',
    category: 'personnel',
    content: '企业未配备专职或兼职人员承担药品不良反应监测和报告工作'
  },
  {
    id: 166,
    level: 'minor',
    levelName: '一般',
    category: 'training',
    content: '药品出库快递打包人员无相关培训记录，不能提供体检报告'
  },
  {
    id: 167,
    level: 'minor',
    levelName: '一般',
    category: 'document',
    content: '企业对相关变化情况未及时修订质量管理文件。未对新药品管理法实施后取消GSP、GMP认证及相应证书的改变进行分析并修改相关文件'
  },
  {
    id: 168,
    level: 'minor',
    levelName: '一般',
    category: 'document',
    content: '仓库内同时发现现行质量管理体系文件（第二版）与已废止的质量管理体系文件（第一版）'
  },
  {
    id: 169,
    level: 'minor',
    levelName: '一般',
    category: 'quality',
    content: '企业采购个别药品未与供货单位签订质量保证协议'
  },
  {
    id: 170,
    level: 'minor',
    levelName: '一般',
    category: 'inspection',
    content: '企业验收个别药品抽取的样品不具有代表性。按照验收操作规程规定应分别抽样检查的批次，库存药品均无拆包痕迹'
  },
  {
    id: 171,
    level: 'minor',
    levelName: '一般',
    category: 'quality',
    content: '个别验收不合格产品未注明不合格事项及处置措施'
  },
  {
    id: 172,
    level: 'minor',
    levelName: '一般',
    category: 'quality',
    content: '与部分供货企业签订的质量保证协议没有标明有效期'
  },
  {
    id: 173,
    level: 'minor',
    levelName: '一般',
    category: 'storage',
    content: '近效期药品未按企业管理规定要求，在货物上设置近效期标志或挂牌'
  },
  {
    id: 174,
    level: 'minor',
    levelName: '一般',
    category: 'storage',
    content: '仓库入口及通向卫生间卷闸门初无挡鼠板，库房内排风扇未罩防虫网，阴凉库个别墙面及空调管道接口处不密封'
  },
  {
    id: 175,
    level: 'minor',
    levelName: '一般',
    category: 'storage',
    content: '库房设有安全防护措施，但实际未落实。业务员私自将货物储存在3楼杂物间'
  },
  {
    id: 176,
    level: 'minor',
    levelName: '一般',
    category: 'transport',
    content: '企业运输管理制度未严格执行。现场检查时发现业务员存在个人带货运输情况'
  },
  {
    id: 177,
    level: 'minor',
    levelName: '一般',
    category: 'transport',
    content: '部分药品委托运输记录内容不完整、不准确。计算机系统中运输记录登记的运输车辆与留存的纸质运输单中运输车辆信息不一致'
  },
  {
    id: 178,
    level: 'minor',
    levelName: '一般',
    category: 'document',
    content: '新修订《药品管理法》实施后，企业未及时修订质量管理体系文件，如审核管理制度仍要求收集已取消的认证证书'
  },
  {
    id: 179,
    level: 'minor',
    levelName: '一般',
    category: 'quality',
    content: '与部分供货企业签订的质量保证协议没有标明有效期。抽查多家公司首营资料，其中签订的质量保证协议有效期均空白'
  },
  {
    id: 180,
    level: 'serious',
    levelName: '严重',
    category: 'quality',
    content: '企业销售假药，产品质量不符合国家药品标准'
  },
  {
    id: 181,
    level: 'minor',
    levelName: '一般',
    category: 'transport',
    content: '企业未按委托运输协议要求收集送货回单'
  }
]

// 缺陷分类
export const categories = [
  { id: 'all', name: '全部' },
  { id: 'storage', name: '仓储管理' },
  { id: 'computer', name: '计算机系统' },
  { id: 'training', name: '人员培训' },
  { id: 'quality', name: '质量管理' },
  { id: 'transport', name: '运输管理' },
  { id: 'temperature', name: '温湿度控制' },
  { id: 'inspection', name: '验收管理' },
  { id: 'document', name: '文件管理' },
  { id: 'personnel', name: '人员管理' },
  { id: 'special', name: '特殊药品管理' },
  { id: 'purchase', name: '采购管理' },
  { id: 'coldchain', name: '冷链管理' },
  { id: 'validation', name: '验证管理' },
  { id: 'facility', name: '设施设备' }
]

// 缺陷等级
export const levels = [
  { id: 'serious', name: '严重缺陷' },
  { id: 'major', name: '主要缺陷' },
  { id: 'minor', name: '一般缺陷' }
]
```

包含了大量的缺陷数据、分类和等级定义。

### 优化建议

1. **数据结构优化**:
- 建议将 defects.js 中的数据拆分为多个模块:
  - defects.ts (缺陷数据)
  - categories.ts (分类数据)
  - levels.ts (等级数据)
- 将数据转换为TypeScript接口，增加类型安全

2. **组件结构优化**:
- 建议将 GspReportInterface.vue 拆分成更小的组件:
  
```1:90:src/components/gsp/GspReportInterface.vue
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-blue-500 p-4 flex justify-between items-center">
      <h1 class="text-white text-xl font-medium">AI智能撰写GSP缺陷项整改报告</h1>
      <div class="flex items-center gap-4">
        <span class="text-white">报告为示例性内容，应以企业真实的相关证明材料为准!</span>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex h-[calc(100vh-64px)]">
      <!-- Chat Area -->
      <div class="flex-1 flex flex-col">
        <!-- Messages Area -->
        <div class="flex-1 p-4 overflow-y-auto" ref="messagesContainer">
          <div class="container mx-auto max-w-[1200px]">
            <div class="flex">
              <!-- 问题区域 - 左侧 40% -->
              <div class="w-[40%] pr-4">
                <div v-for="(msg, index) in messages" 
                     :key="msg.id"
                     :ref="msg === streamingMessage ? 'activeMessage' : undefined"
                     class="mb-4 min-h-[80px]"
                     v-show="msg.role === 'user'">
                  <div class="bg-gray-50 rounded-lg p-4 rounded-bl-none shadow-sm h-full">
                    <div class="flex justify-between text-sm text-gray-500 mb-1">
                      <span>问题描述</span>
                      <span>{{ msg.timestamp }}</span>
                    </div>
                    <div class="whitespace-pre-wrap">
                      {{ msg.content }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- 回复区域 - 右侧 60% -->
              <div class="w-[60%] pl-4 border-l border-gray-100">
                <div v-for="(msg, index) in messages" 
                     :key="msg.id"
                     :ref="msg === streamingMessage ? 'activeMessage' : undefined"
                     class="mb-4 message-card"
                     v-show="msg.role === 'assistant'">
                  <div :class="[
                    'rounded-lg p-4 rounded-br-none shadow-sm h-full message-transition relative',
                    msg === streamingMessage ? 'bg-blue-100' : 'bg-blue-50'
                  ]">
                    <div class="question-area">
                      <div class="font-medium mb-1">缺陷项目：</div>
                      <div class="question-text">{{ messages[index-1]?.content || '' }}</div>
                    </div>
                    
                    <div class="flex justify-between mb-1">
                      <span class="timestamp">智能撰写</span>
                      <span class="timestamp">{{ msg.timestamp }}</span>
                    </div>
                    <div class="whitespace-pre-wrap">
                      {{ msg.content }}
                      <span v-if="msg === streamingMessage" 
                            class="cursor">|</span>
                    </div>
                    
                    <!-- 添加复制按钮 -->
                    <button 
                      v-if="!streamingMessage || msg !== streamingMessage"
                      class="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      @click="copyContent(msg.content)"
                      title="复制回复内容"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading indicator -->
          <div v-if="loading" class="flex justify-center mt-4">
            <div class="inline-block bg-gray-100 rounded-lg px-4 py-2 text-gray-500">
              正在思考中...
            </div>
          </div>
        </div>

        <!-- Input Area -->
```

  可拆分为:
  - GspHeader.vue
  - ChatMessages.vue
  - InputArea.vue
  - MessageCard.vue

3. **样式管理优化**:

```519:806:src/components/gsp/GspReportInterface.vue
:deep(.overflow-y-auto::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.overflow-y-auto::-webkit-scrollbar-thumb) {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 2px;
}

/* 分隔线渐变效果 */
.border-gradient {
  border-image: linear-gradient(to bottom, transparent, rgba(156, 163, 175, 0.1), transparent) 1;
}

/* 消息卡片过渡效果 */
.message-transition {
  transition: background-color 0.3s ease;
}

/* 时间戳样式 */
.timestamp {
  font-size: 0.75rem;
  color: rgba(107, 114, 128, 1);
}

/* 问题描述区域样式 */
.question-area {
  background-color: rgba(249, 250, 251, 1);
  padding: 0.5rem;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
}

/* 问题描述文本样式 */
.question-text {
  color: rgba(55, 65, 81, 1);
}

/* 添加历史记录项的过渡效果 */
.group {
  transition: background-color 0.2s ease;
}

.group:hover button {
  opacity: 1;
}

/* 添加模态框动画效果 */
.fixed {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 优化滚动条样式 */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 2px;
}

/* 添加复制按钮悬浮效果 */
.message-card:hover button {
  opacity: 1;
}

/* 修改按钮的默认样式规则 */
button {
  transition: opacity 0.2s ease;
}

/* 只对消息卡片中的按钮应用透明效果 */
.message-card button {
  opacity: 0;
  transition: opacity 0.2s ease;
}

/* 消息卡片按钮悬浮效果 */
.message-card:hover button {
  opacity: 1;
}

/* 对话框中的按钮始终显示 */
.fixed button {
  opacity: 1;
}

/* 新建对话按钮样式 */
.new-chat-btn {
  background: linear-gradient(to right, #2563eb, #3b82f6);
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
  transition: all 0.3s ease;
  opacity: 1 !important; /* 确保始终可见 */
}

.new-chat-btn:hover {
  background: linear-gradient(to right, #1d4ed8, #2563eb);
  box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);
  transform: translateY(-1px);
}

/* 发送按钮样式 */
.send-btn {
  background: linear-gradient(to right, #059669, #10b981);
  box-shadow: 0 2px 4px rgba(5, 150, 105, 0.2);
  transition: all 0.3s ease;
  opacity: 1 !important; /* 确保始终可见 */
}

.send-btn:hover {
  background: linear-gradient(to right, #047857, #059669);
  box-shadow: 0 4px 6px rgba(5, 150, 105, 0.3);
  transform: translateY(-1px);
}

.send-btn:disabled {
  background: #d1d5db;
  box-shadow: none;
  transform: none;
}

/* 在 <style scoped> 中添加/修改以下样式 */

/* 整体背景渐变 */
.min-h-screen {
  background: linear-gradient(135deg, #f0f9ff 0%, #e6f6fe 100%);
}

/* Header样式优化 */
header {
  background: linear-gradient(90deg, #1e40af 0%, #3b82f6 100%);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.15);
  backdrop-filter: blur(10px);
}

/* 主内容区域玻璃拟态效果 */
.flex-1.flex.flex-col {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* 消息卡片样式优化 */
.message-card > div {
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.message-card > div:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

/* 输入框样式优化 */
input[type="text"] {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  transition: all 0.3s ease;
}

input[type="text"]:focus {
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  transform: translateY(-1px);
}

/* 下拉框样式优化 */
select {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  transition: all 0.3s ease;
}

select:focus {
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  transform: translateY(-1px);
}

/* 按钮样式进一步优化 */
.new-chat-btn {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(4px);
  animation: buttonPulse 2s infinite;
}

.send-btn {
  background: linear-gradient(135deg, #059669, #10b981);
  box-shadow: 0 4px 15px rgba(5, 150, 105, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(4px);
}

/* 按钮呼吸动画 */
@keyframes buttonPulse {
  0% {
    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
  }
  50% {
    box-shadow: 0 4px 25px rgba(37, 99, 235, 0.5);
  }
  100% {
    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
  }
}

/* 侧边栏样式优化 */
.w-80.border-l {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-left: 1px solid rgba(255, 255, 255, 0.3);
}

/* 历史记录项样式 */
.group {
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
  transition: all 0.3s ease;
}

.group:hover {
  background: rgba(59, 130, 246, 0.05);
  backdrop-filter: blur(4px);
}

/* 模态框样式优化 */
.fixed .bg-white {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

/* 滚动条样式进一步优化 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #60a5fa);
  border-radius: 3px;
}

/* 添加打字机光标动画 */
.cursor {
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background: #3b82f6;
  margin-left: 2px;
  animation: cursorBlink 1s step-end infinite;
}

@keyframes cursorBlink {
  from, to { opacity: 1; }
  50% { opacity: 0; }
}

/* 消息加载动画优化 */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
```

建议:
- 将通用样式抽离到全局CSS文件
- 使用CSS变量管理主题色
- 考虑使用TailwindCSS的@apply指令优化重复样式

4. **状态管理建议**:
- 引入Pinia进行状态管理
- 创建以下store:
  - useDefectsStore (缺陷数据管理)
  - useChatStore (对话管理)
  - useSettingsStore (系统设置)

5. **类型系统完善**:
- 定义核心接口:
```typescript
interface Defect {
  id: number;
  level: string;
  levelName: string;
  category: string;
  content: string;
}

interface Category {
  id: string;
  name: string;
}

interface Level {
  id: string;
  name: string;
}
```

6. **性能优化建议**:
- 使用虚拟滚动处理长列表
- 实现数据懒加载
- 对大数据进行分页处理
- 使用keep-alive缓存组件

7. **工程化建议**:
- 添加单元测试
- 配置ESLint和Prettier
- 添加提交前代码检查
- 完善错误处理机制
- 添加日志系统

8. **文档完善**:
- 补充组件文档
- 添加开发指南
- 完善README.md
- 添加CHANGELOG.md

这些优化建议可以帮助提高代码质量、可维护性和开发效率。建议根据实际需求逐步实施。


好的，我来帮你将本地代码推送到 GitHub 仓库。我会按照以下步骤操作：

1. 首先添加远程仓库：

```bash
git remote add origin https://github.com/Cgwgpt/ai-gsp-assistant.git
```


看起来远程仓库已经存在，让我们更新远程仓库地址：

```bash
git remote set-url origin https://github.com/Cgwgpt/ai-gsp-assistant.git
```






2. 推送代码到远程仓库：

```bash
git push -u origin main
```






太好了！所有操作都已成功完成：

1. 更新了远程仓库地址为 `https://github.com/Cgwgpt/ai-gsp-assistant.git`
2. 成功将本地代码推送到了远程仓库的 main 分支
3. 设置了本地 main 分支跟踪远程 main 分支

现在你的代码已经成功上传到 GitHub 仓库了。你可以访问 https://github.com/Cgwgpt/ai-gsp-assistant 查看你的代码。

以后要更新代码时，你只需要：
1. `git add .` 添加修改的文件
2. `git commit -m "提交信息"` 提交更改
3. `git push` 推送到远程仓库

需要我帮你做些其他事情吗？
