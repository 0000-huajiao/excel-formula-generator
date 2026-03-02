# 📊 Excel 公式生成器

> 不会写公式？描述你的需求，自动帮你生成 —— 支持 Excel 和 WPS，核心功能完全离线可用。

---

## ✨ 功能特性

### 🔍 智能搜索
不知道用哪个公式？直接用中文描述需求，比如"统计满足条件的数量"、"计算同比增长率"、"提取下划线前的文本"，系统会自动推荐最合适的公式和使用场景。

- **意图关键词匹配**：25+ 个业务意图，覆盖统计、查找、日期、文本等常见需求
- **Fuse.js 模糊搜索**：支持公式名称、描述、标签的模糊匹配
- **下拉双栏推荐**：意图推荐 + 精确匹配，一目了然

### 📋 36 个标准公式，分类管理

| 分类 | 公式 |
|------|------|
| 🔍 查找引用 | XLOOKUP、VLOOKUP、INDEX+MATCH、IFERROR |
| ⚖️ 条件判断 | IF、AND、OR |
| 📊 统计求和 | SUMIF、SUMIFS、COUNTIF、COUNTIFS、AVERAGEIF、AVERAGEIFS、MAXIFS、MINIFS、SUMPRODUCT、RANK |
| ✏️ 文本处理 | LEFT、MID、RIGHT、TEXTBEFORE、TEXTAFTER、SUBSTITUTE、FIND、TEXTJOIN、TEXT、CONCAT、LEN、TRIM |
| 📅 日期时间 | DATEDIF、NETWORKDAYS、EOMONTH、YEAR/MONTH/DAY |
| 🔢 数学计算 | ROUND、ROUNDUP、ROUNDDOWN、MOD、ABS |

每个公式都有：可视化参数填写 → 自动生成完整公式 → 一键复制。

### 💡 场景公式库
8 个真实业务场景，开箱即用：

- 📦 **多条件库存查询** — 按产品ID + 批次查询在库数量
- 📈 **同比 / 环比增长率** — 日环比、周同比、月同比完整示例
- 🏆 **阶梯提成计算** — 销售额分档对应不同提成比例
- 🔎 **XLOOKUP 容错查找** — 找不到时显示自定义提示
- 📅 **工龄 / 账龄计算** — 精确到年月日
- 🔢 **去重统计** — 统计不重复的值的个数
- 📅 **日期区间汇总** — 按月、按季度、最近 N 天筛选求和
- 🏷️ **编码拆分提取** — 从 `SKU_颜色_尺码` 格式中提取各段

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
│   ├── formulas.js    # 36 个公式定义 + 分类配置
│   ├── scenarios.js   # 8 个场景模板
│   └── keywords.js    # 意图关键词库（25+ 意图）
└── pages/
    ├── HomePage.jsx       # 首页：搜索 + 分类浏览
    ├── StandardPage.jsx   # 标准公式详情页
    ├── CompositePage.jsx  # 高级组合页
    └── ScenariosPage.jsx  # 场景公式库页
```
