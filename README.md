# 📊 Excel 公式生成器

> 不会写公式？描述你的需求，自动帮你生成 —— 支持 Excel 和 WPS，核心功能完全离线可用。

---

## ✨ 功能特性

### 🔍 智能搜索
不知道用哪个公式？直接用中文描述需求，比如"统计满足条件的数量"、"计算同比增长率"、"每月还款多少"，系统会自动推荐最合适的公式和使用场景。

- **意图关键词匹配**：40+ 个业务意图，覆盖统计、查找、日期、文本、财务等常见需求
- **Fuse.js 模糊搜索**：支持公式名称、描述、标签的模糊匹配
- **下拉双栏推荐**：意图推荐 + 精确匹配，一目了然

### 📋 132 个标准公式，7大分类

| 分类 | 公式数 | 代表公式 |
|------|--------|----------|
| 🔍 查找引用 | 17 | XLOOKUP、VLOOKUP、INDEX+MATCH、FILTER、UNIQUE、SORT |
| ⚖️ 条件判断 | 13 | IF、IFS、IFERROR、IFNA、AND、OR、ISBLANK、ISNUMBER |
| 📊 统计求和 | 24 | SUM、SUMIF、COUNTIF、AVERAGE、MAX、MIN、RANK、MEDIAN、STDEV |
| ✏️ 文本处理 | 25 | LEFT/MID/RIGHT、TEXTBEFORE/AFTER、SUBSTITUTE、UPPER/LOWER、VALUE |
| 📅 日期时间 | 16 | TODAY、DATEDIF、NETWORKDAYS、WEEKDAY、EDATE、EOMONTH |
| 🔢 数学计算 | 24 | ROUND、INT、POWER、SQRT、LOG、RAND、RANDBETWEEN、GCD |
| 💰 财务金融 | 13 | PMT、PV、FV、NPV、IRR、RATE、SLN、DB |

每个公式都有：可视化参数填写 → 自动生成完整公式 → 一键复制。

### 💡 场景公式库
45 个真实业务场景，7大分类，开箱即用：

| 分类 | 场景数 | 典型案例 |
|------|--------|----------|
| 🔍 查询统计 | 9 | 多条件库存查询、二维交叉查找、动态筛选输出、分组排名 |
| 📊 数据分析 | 8 | 同比/环比增长率、ABC帕累托分析、移动平均、阶梯提成 |
| 📅 日期计算 | 8 | 工龄/账龄、合同到期预警、工作日倒计时、按季分组 |
| ✏️ 文本处理 | 6 | 身份证信息提取、手机号脱敏、编码拆分、关键词标签 |
| 💰 财务金融 | 5 | 贷款分期明细、项目NPV分析、资产折旧计划、利率比较 |
| 👥 人力资源 | 5 | 考勤异常统计、绩效评级、司龄工资、工资条生成 |
| 📈 销售分析 | 4 | RFM客户价值分析、销售漏斗转化、区域对比、利润分析 |

### ➕ 高级组合 / 多条件判断
可视化配置复杂公式，无需手写嵌套：

- **IFS 阶梯**：多档条件判断（绩效评级、提成档位）
- **IFS 区间**：数值区间判断（分数段评级）
- **SWITCH**：精确匹配多个值并返回对应结果
- **SUMIFS / COUNTIFS**：多条件求和 / 计数，动态增减条件行

---

## 🚀 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:5173

---

## 🛠️ 技术栈

- **React 18** + **Vite 5**
- **Tailwind CSS 3** — 深色模式支持
- **Fuse.js** — 模糊搜索
- 纯前端，无需后端，完全离线可用

---

## 📁 项目结构

```
src/
├── components/        # 公共组件（FormulaCard、Header、TypeBubble 等）
├── data/
│   ├── formulas.js    # 132 个公式定义 + 7大分类配置
│   ├── scenarios.js   # 45 个场景模板，7大分类
│   └── keywords.js    # 意图关键词库（40+ 意图）
└── pages/
    ├── HomePage.jsx       # 首页：搜索 + 分类浏览
    ├── StandardPage.jsx   # 标准公式详情页
    ├── CompositePage.jsx  # 高级组合页
    └── ScenariosPage.jsx  # 场景公式库页
```
