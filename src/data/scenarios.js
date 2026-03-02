/**
 * 场景公式库 — 真实业务场景 + 开箱即用公式方案
 */

export const SCENARIO_CATEGORIES = [
  { id: 'all',      label: '全部' },
  { id: 'query',    label: '查询统计' },
  { id: 'analysis', label: '数据分析' },
  { id: 'date',     label: '日期计算' },
  { id: 'text',     label: '文本处理' },
  { id: 'finance',  label: '财务金融' },
  { id: 'hr',       label: '人力资源' },
  { id: 'sales',    label: '销售分析' },
]

export const scenarios = [

  // ══════════════════════════════════════════════════
  // 查询统计
  // ══════════════════════════════════════════════════
  {
    id: 'multi-condition-stock',
    category: 'query',
    emoji: '📦',
    title: '多条件库存精准查询',
    difficulty: '中级',
    difficultyColor: 'amber',
    desc: '库存表有多个维度（产品ID、出厂批次、仓库），需要按两个条件精确查询某产品某批次的全国总库存量。',
    tags: ['SUMIFS', '多条件', '库存'],
    columns: [
      { col: 'A', name: '产品ID',   eg: 'P001' },
      { col: 'B', name: '出厂日期', eg: '2024-01-15' },
      { col: 'C', name: '仓库',     eg: '上海仓' },
      { col: 'D', name: '库存量',   eg: '500' },
      { col: '', name: '···', eg: '' },
      { col: 'G', name: '查询：产品ID',   eg: 'P001' },
      { col: 'H', name: '查询：出厂日期', eg: '2024-01-15' },
    ],
    formulas: [
      {
        label: '全国总库存（多条件求和）',
        formula: '=SUMIFS(D:D,A:A,G2,B:B,H2)',
        explain: 'D:D 是库存量列 · A:A 按产品ID筛选 · B:B 按出厂日期筛选 · 两个条件同时满足的行全部相加',
      },
      {
        label: '查某个具体仓库的库存（三条件）',
        formula: '=SUMIFS(D:D,A:A,G2,B:B,H2,C:C,"上海仓")',
        explain: '在两个条件基础上再加一个仓库筛选，"上海仓" 可替换成单元格引用',
      },
    ],
    tips: [
      '日期格式必须统一，否则条件匹配失败。建议用 TEXT(B2,"YYYY-MM-DD") 统一格式后再查询',
      '产品ID区分大小写，"P001" 和 "p001" 会被视为不同值',
      '需要查数量而非汇总时，把 SUMIFS 换成 COUNTIFS 即可',
    ],
  },

  {
    id: 'xlookup-with-fallback',
    category: 'query',
    emoji: '🔍',
    title: 'XLOOKUP跨表查找+容错',
    difficulty: '初级',
    difficultyColor: 'green',
    desc: '从另一张表（或另一列）根据ID查找对应信息，找不到时显示自定义提示而不是报错，替代 IFERROR+VLOOKUP 的经典写法。',
    tags: ['XLOOKUP', '跨表', '容错', '查找'],
    columns: [
      { col: 'A', name: '订单表·客户ID', eg: 'C1023' },
      { col: 'B', name: '（返回）客户名', eg: '（公式列）' },
      { col: '', name: '···  客户信息表  ···', eg: '' },
      { col: 'D', name: '客户ID',   eg: 'C1023' },
      { col: 'E', name: '客户名称', eg: '北京科技有限公司' },
    ],
    formulas: [
      {
        label: '根据ID查客户名，找不到显示"未录入"',
        formula: '=XLOOKUP(A2,D:D,E:E,"未录入")',
        explain: '在 D 列找 A2 的值，找到后返回同行 E 列的内容，找不到返回 "未录入"',
      },
      {
        label: '旧版兼容写法（IFERROR+VLOOKUP）',
        formula: '=IFERROR(VLOOKUP(A2,D:E,2,0),"未录入")',
        explain: '与 XLOOKUP 效果相同，适合 Excel 2019 以下版本',
      },
      {
        label: '跨 Sheet 查找',
        formula: '=XLOOKUP(A2,客户表!A:A,客户表!B:B,"未录入")',
        explain: '"客户表" 是另一个 Sheet 的名称，中间用 ! 连接列引用',
      },
    ],
    tips: [
      'XLOOKUP 默认精确匹配，不需要像 VLOOKUP 那样最后填 0',
      '查找列和返回列可以不相邻，也支持向左查找（VLOOKUP 只能向右）',
      'XLOOKUP 需要 Excel 365 / WPS 2019 以上版本，旧版用 IFERROR+VLOOKUP 替代',
    ],
  },

  {
    id: 'conditional-max-min',
    category: 'query',
    emoji: '📊',
    title: '查找某条件下的最高/最低值',
    difficulty: '初级',
    difficultyColor: 'green',
    desc: '在满足某个条件的数据中，找出最大值或最小值。如某部门销售额最高的单子、某仓库库存最少的产品。',
    tags: ['MAXIFS', 'MINIFS', '最大值', '最小值', '条件'],
    columns: [
      { col: 'A', name: '部门',   eg: '销售部' },
      { col: 'B', name: '员工',   eg: '王五' },
      { col: 'C', name: '本月业绩', eg: '25000' },
    ],
    formulas: [
      {
        label: '销售部最高业绩',
        formula: '=MAXIFS(C:C,A:A,"销售部")',
        explain: '在 A 列等于"销售部"的行里，找 C 列的最大值',
      },
      {
        label: '销售部最低业绩',
        formula: '=MINIFS(C:C,A:A,"销售部")',
        explain: '同上，改为取最小值',
      },
      {
        label: '多条件：某部门某月最高业绩',
        formula: '=MAXIFS(C:C,A:A,"销售部",B:B,"2024-03")',
        explain: '加第二个条件，B 列存月份标签，同时满足部门和月份的最大值',
      },
      {
        label: '旧版兼容写法',
        formula: '=MAX(IF(A2:A100="销售部",C2:C100))',
        explain: 'Ctrl+Shift+Enter 数组公式，适合没有 MAXIFS 的 Excel 2016 及以下版本',
      },
    ],
    tips: [
      'MAXIFS/MINIFS 需要 Excel 2019 或 Office 365，旧版本用数组公式（Ctrl+Shift+Enter）',
      '如果需要知道最高值对应的是哪个员工，配合 XLOOKUP 或 INDEX+MATCH 查找',
      '多个条件写法与 SUMIFS 一致，条件按 "区域, 值, 区域, 值" 两两成对排列',
    ],
  },

  {
    id: 'two-way-lookup',
    category: 'query',
    emoji: '🗺️',
    title: '二维表交叉查找',
    difficulty: '中级',
    difficultyColor: 'amber',
    desc: '在行列都有标题的二维表中，同时根据行标题和列标题查找对应的交叉值，如查某员工某月的业绩。',
    tags: ['INDEX', 'MATCH', '二维查找', '交叉', '矩阵'],
    columns: [
      { col: 'A', name: '员工\\月份', eg: '（左上角）' },
      { col: 'B', name: '1月', eg: '12000' },
      { col: 'C', name: '2月', eg: '15000' },
      { col: 'D', name: '3月', eg: '18000' },
      { col: '', name: '···', eg: '' },
      { col: 'H', name: '查询员工', eg: '张三' },
      { col: 'I', name: '查询月份', eg: '2月' },
    ],
    formulas: [
      {
        label: '二维交叉查找（INDEX+MATCH双向）',
        formula: '=INDEX(B2:D10,MATCH(H2,A2:A10,0),MATCH(I2,B1:D1,0))',
        explain: '外层INDEX取值，第一个MATCH找行号（按员工名），第二个MATCH找列号（按月份），两者交叉确定唯一格',
      },
      {
        label: 'XLOOKUP嵌套版（Excel 365）',
        formula: '=XLOOKUP(H2,A2:A10,XLOOKUP(I2,B1:D1,B2:D10))',
        explain: '内层XLOOKUP先定位列，外层XLOOKUP再定位行，代码更直观',
      },
    ],
    tips: [
      '第一个MATCH的查找区域是行标题（A列），第二个是列标题（第1行），不要搞反',
      'B1:D1 是列标题区域，B2:D10 是数据区，两者列范围必须对齐',
      '如果标题有空格或特殊字符，查询值要和表头完全一致',
    ],
  },

  {
    id: 'fuzzy-search',
    category: 'query',
    emoji: '🔎',
    title: '包含关键词的模糊查询',
    difficulty: '初级',
    difficultyColor: 'green',
    desc: '不知道完整内容，只知道关键词，用通配符 * 进行模糊匹配统计或查找，如查含"北京"的所有客户。',
    tags: ['COUNTIF', 'SUMIF', '通配符', '模糊', '关键词'],
    columns: [
      { col: 'A', name: '客户名称', eg: '北京科技有限公司' },
      { col: 'B', name: '订单金额', eg: '58000' },
    ],
    formulas: [
      {
        label: '统计包含"北京"的客户数量',
        formula: '=COUNTIF(A:A,"*北京*")',
        explain: '* 是通配符，"*北京*" 表示前后都可以有任意字符，只要包含"北京"就匹配',
      },
      {
        label: '汇总包含"北京"客户的订单总额',
        formula: '=SUMIF(A:A,"*北京*",B:B)',
        explain: '通配符同样适用于 SUMIF 的条件参数',
      },
      {
        label: '关键词存在单元格中（动态查询）',
        formula: '=COUNTIF(A:A,"*"&D2&"*")',
        explain: 'D2 存放关键词，用 & 拼接通配符，修改D2即可换关键词',
      },
      {
        label: '判断某单元格是否包含关键词',
        formula: '=ISNUMBER(SEARCH("北京",A2))',
        explain: 'SEARCH 找到则返回位置数字（ISNUMBER为TRUE），找不到返回错误（ISNUMBER为FALSE）',
      },
    ],
    tips: [
      '* 匹配任意字符，? 匹配单个字符，"北京?" 匹配"北京市"但不匹配"北京科技"',
      'SEARCH 不区分大小写，FIND 区分大小写',
      'XLOOKUP 和 VLOOKUP 本身不支持通配符，需要用 COUNTIF/SUMIF 或 FILTER 实现模糊查找',
    ],
  },

  {
    id: 'duplicate-check',
    category: 'query',
    emoji: '🔄',
    title: '重复数据检测与标注',
    difficulty: '初级',
    difficultyColor: 'green',
    desc: '检查一列数据中是否有重复值，并标注哪些是重复的，方便清理或合并处理。',
    tags: ['COUNTIF', '重复', '去重', '标注', '检测'],
    columns: [
      { col: 'A', name: '员工ID', eg: 'E001' },
      { col: 'B', name: '重复标注', eg: '（公式列）' },
    ],
    formulas: [
      {
        label: '标注重复值（第二次及以后出现才标）',
        formula: '=IF(COUNTIF($A$2:A2,A2)>1,"重复","")',
        explain: '$A$2:A2 随公式下拉动态扩展，只有当前行之前已出现过该值才标"重复"，第一次出现不标',
      },
      {
        label: '标注所有重复的行（只要出现超过1次就标）',
        formula: '=IF(COUNTIF(A:A,A2)>1,"重复","")',
        explain: 'COUNTIF(A:A,A2) 统计整列中该值出现总次数，>1则标为重复',
      },
      {
        label: '统计重复的总行数',
        formula: '=SUMPRODUCT((COUNTIF(A2:A100,A2:A100)>1)*1)',
        explain: '返回所有重复行的个数（包含第一次出现）',
      },
      {
        label: 'Excel 365 - 直接提取不重复列表',
        formula: '=UNIQUE(A2:A100)',
        explain: 'UNIQUE 函数直接输出去重后的列表，溢出到下方单元格',
      },
    ],
    tips: [
      '标注完成后可以用筛选功能，只显示"重复"行，方便人工核查',
      '如果要删除重复项，推荐用 Excel 内置的"数据 → 删除重复值"，比公式更直接',
      '跨列联合去重（如姓名+工号都相同才算重复），用 COUNTIFS 代替 COUNTIF',
    ],
  },

  {
    id: 'filter-dynamic',
    category: 'query',
    emoji: '🔬',
    title: '动态筛选输出满足条件的行',
    difficulty: '中级',
    difficultyColor: 'amber',
    desc: '用 FILTER 函数动态输出所有满足条件的数据行，结果自动更新，无需手动筛选或复制，适合 Excel 365/WPS新版。',
    tags: ['FILTER', '筛选', '动态', '365', '条件'],
    columns: [
      { col: 'A', name: '部门', eg: '销售部' },
      { col: 'B', name: '姓名', eg: '张三' },
      { col: 'C', name: '业绩', eg: '25000' },
    ],
    formulas: [
      {
        label: '筛选销售部所有员工',
        formula: '=FILTER(A2:C100,A2:A100="销售部","无数据")',
        explain: '输出 A2:C100 中 A 列等于"销售部"的所有行，没有结果时显示"无数据"',
      },
      {
        label: '筛选业绩大于2万的员工',
        formula: '=FILTER(A2:C100,C2:C100>20000)',
        explain: 'C 列大于20000的所有行都会输出，结果自动溢出到下方',
      },
      {
        label: '多条件筛选（部门 AND 业绩）',
        formula: '=FILTER(A2:C100,(A2:A100="销售部")*(C2:C100>20000))',
        explain: '两个条件相乘（*）表示同时满足（AND），相加（+）表示任一满足（OR）',
      },
      {
        label: '筛选后按业绩降序排列',
        formula: '=SORT(FILTER(A2:C100,A2:A100="销售部"),3,-1)',
        explain: 'FILTER 先筛选，SORT 再排序，第2参数3表示按第3列（业绩），-1表示降序',
      },
    ],
    tips: [
      'FILTER 函数需要 Excel 365 / WPS 2019+ 才支持',
      '结果会自动溢出到下方单元格，确保目标区域下方留有足够空行',
      '旧版 Excel 可用高级筛选（数据 → 高级筛选）将结果复制到指定区域',
    ],
  },

  {
    id: 'multi-sheet-sum',
    category: 'query',
    emoji: '📑',
    title: '汇总多个工作表数据',
    difficulty: '中级',
    difficultyColor: 'amber',
    desc: '将多个格式相同的 Sheet（如每月一张表）的数据汇总到一张总表，避免手动加表名。',
    tags: ['INDIRECT', 'SUM', '多表', '汇总', '工作表'],
    columns: [
      { col: 'A', name: 'Sheet名称', eg: '一月' },
      { col: 'B', name: '汇总金额', eg: '（公式列）' },
    ],
    formulas: [
      {
        label: '用INDIRECT动态引用各Sheet同一单元格',
        formula: '=INDIRECT(A2&"!B2")',
        explain: 'A2 存放 Sheet 名称（如"一月"），公式自动拼接成 =一月!B2 的引用',
      },
      {
        label: '跨表三维求和（连续Sheet相同位置）',
        formula: '=SUM(一月:十二月!B2)',
        explain: '对从"一月"到"十二月"所有Sheet的B2单元格求和，中间新增Sheet会自动包含',
      },
      {
        label: '汇总各Sheet某列总和',
        formula: '=SUMPRODUCT(SUMIF(INDIRECT(A2:A13&"!A:A"),"销售部",INDIRECT(A2:A13&"!B:B")))',
        explain: 'A2:A13 存各Sheet名，分别对每个Sheet执行SUMIF后相加，实现跨表条件求和',
      },
    ],
    tips: [
      'INDIRECT 中的 Sheet 名若包含空格或特殊字符，需要加单引号：A2&"\'!B2"',
      '三维引用（一月:十二月!B2）要求各Sheet顺序连续且格式相同',
      '数据量大时推荐用 Power Query 合并，比公式更高效稳定',
    ],
  },

  {
    id: 'rank-with-condition',
    category: 'query',
    emoji: '🏅',
    title: '分组内部排名',
    difficulty: '中级',
    difficultyColor: 'amber',
    desc: '不是对全部数据排名，而是在同一部门或同一分类内分别排名，如销售部内部按业绩排第几名。',
    tags: ['COUNTIFS', 'RANK', '分组', '排名', '内部'],
    columns: [
      { col: 'A', name: '部门',   eg: '销售部' },
      { col: 'B', name: '员工',   eg: '张三' },
      { col: 'C', name: '业绩',   eg: '25000' },
      { col: 'D', name: '部门内排名', eg: '（公式列）' },
    ],
    formulas: [
      {
        label: '部门内按业绩降序排名',
        formula: '=COUNTIFS(A:A,A2,C:C,">"&C2)+1',
        explain: '统计同部门中业绩比当前行更高的人数，加1就是当前行的名次',
      },
      {
        label: '全局排名（对比用）',
        formula: '=RANK(C2,C:C,0)',
        explain: '不区分部门的全局降序排名，0=降序',
      },
      {
        label: '相同业绩处理：并列跳过',
        formula: '=COUNTIFS(A:A,A2,C:C,">"&C2)+1',
        explain: '此公式自然支持并列，相同业绩同名次，下一名次自动跳过',
      },
    ],
    tips: [
      'COUNTIFS 条件中的 ">"&C2 是将大于号和数值拼接成字符串条件',
      '如需密集排名（并列不跳名次），用 SUMPRODUCT 配合 1/COUNTIFS 实现',
      '分组排名也可用 RANK + SUMPRODUCT 组合，但 COUNTIFS 写法更直观',
    ],
  },

  // ══════════════════════════════════════════════════
  // 数据分析
  // ══════════════════════════════════════════════════
  {
    id: 'growth-rate',
    category: 'analysis',
    emoji: '📈',
    title: '日环比 / 周同比增长率',
    difficulty: '初级',
    difficultyColor: 'green',
    desc: '对销售额、访问量等指标，自动计算今天相比昨天（日环比）、本周相比上周（周同比）的变化率，正数为增长，负数为下降。',
    tags: ['增长率', '同比', '环比', '分析'],
    columns: [
      { col: 'A', name: '日期',       eg: '2024-03-01' },
      { col: 'B', name: '昨日/上周值', eg: '8500' },
      { col: 'C', name: '今日/本周值', eg: '9200' },
    ],
    formulas: [
      {
        label: '日环比增长率',
        formula: '=(C2-B2)/ABS(B2)',
        explain: '（今日值 - 昨日值）÷ 昨日值的绝对值。用 ABS 是为了防止基数为负数时方向判断错误',
      },
      {
        label: '格式化为百分比显示',
        formula: '=TEXT((C2-B2)/ABS(B2),"0.00%")',
        explain: '直接输出带 % 号的文本，如 "8.24%"。注意：结果是文本，不能再参与计算',
      },
      {
        label: '基数为0时容错',
        formula: '=IFERROR((C2-B2)/ABS(B2),"-")',
        explain: '当昨日值为0时除法报错，IFERROR 兜底显示"-"',
      },
    ],
    tips: [
      '将单元格格式设为"百分比"，公式 =(C2-B2)/ABS(B2) 会自动显示为百分比，无需用 TEXT',
      '月环比、年同比原理相同，只需把对应时间段的数据放入 B、C 列',
    ],
  },

  {
    id: 'tiered-commission',
    category: 'analysis',
    emoji: '💰',
    title: '阶梯提成自动计算',
    difficulty: '中级',
    difficultyColor: 'amber',
    desc: '销售人员的提成比例按业绩分档，不同区间对应不同比例。用 IFS 按优先顺序从高到低判断，自动匹配对应提成。',
    tags: ['IFS', '提成', '阶梯', '判断'],
    columns: [
      { col: 'A', name: '姓名',   eg: '张三' },
      { col: 'B', name: '本月业绩', eg: '38000' },
      { col: 'C', name: '提成金额', eg: '（公式列）' },
    ],
    formulas: [
      {
        label: '阶梯提成（业绩×对应比例）',
        formula: '=IFS(B2>=50000,B2*0.2,B2>=20000,B2*0.15,B2>=10000,B2*0.1,TRUE,B2*0.05)',
        explain: '≥5万→20%，≥2万→15%，≥1万→10%，其他→5%。IFS 从上到下优先匹配',
      },
      {
        label: '同时显示提成比例文字',
        formula: '=IFS(B2>=50000,"20%",B2>=20000,"15%",B2>=10000,"10%",TRUE,"5%")',
        explain: '返回提成比例的文字说明，方便在报表中展示档位',
      },
    ],
    tips: [
      'IFS 条件必须从大到小排列，否则所有人都会匹配第一个条件',
      '最后一行的 TRUE 是兜底，相当于"以上都不满足时"',
      '需要在组合公式页面配置更多档位？点击首页"高级组合"→"IFS级联"模式',
    ],
  },

  {
    id: 'unique-count',
    category: 'analysis',
    emoji: '🔢',
    title: '去重统计唯一值数量',
    difficulty: '中级',
    difficultyColor: 'amber',
    desc: '统计某列中有多少个不重复的值，如"有几个不同的客户""有几种不同的产品"，不需要手动删除重复数据。',
    tags: ['去重', 'SUMPRODUCT', 'COUNTIF', '唯一值', '不重复'],
    columns: [
      { col: 'A', name: '客户ID', eg: 'C001 / C002 / C001 / C003 …' },
    ],
    formulas: [
      {
        label: '统计不重复的客户数量',
        formula: '=SUMPRODUCT(1/COUNTIF(A2:A100,A2:A100))',
        explain: 'COUNTIF 计算每个值出现的次数，1÷次数后全部相加，每个唯一值贡献恰好1',
      },
      {
        label: '包含空格时的容错版',
        formula: '=SUMPRODUCT((A2:A100<>"")/COUNTIF(A2:A100,A2:A100&""))',
        explain: '加了 <>"" 过滤空格，防止空行导致 #DIV/0! 错误',
      },
      {
        label: 'Excel 365 最简写法',
        formula: '=COUNTA(UNIQUE(A2:A100))',
        explain: 'UNIQUE 函数直接提取唯一值，COUNTA 计数。仅 Excel 365 / WPS 新版支持',
      },
    ],
    tips: [
      '区域 A2:A100 要根据实际数据范围调整',
      '需要列出所有唯一值（而不只是计数），用 Excel 365 的 UNIQUE 函数',
    ],
  },

  {
    id: 'percentage-dist',
    category: 'analysis',
    emoji: '🍰',
    title: '各类别占比计算',
    difficulty: '初级',
    difficultyColor: 'green',
    desc: '计算各部门/产品/渠道的销售额占总额的百分比，用于占比分析和饼图数据准备。',
    tags: ['SUM', 'SUMIF', '占比', '百分比', '分类'],
    columns: [
      { col: 'A', name: '部门',   eg: '销售部' },
      { col: 'B', name: '销售额', eg: '120000' },
      { col: 'C', name: '占比',   eg: '（公式列）' },
    ],
    formulas: [
      {
        label: '当前行占总额百分比',
        formula: '=B2/SUM($B$2:$B$100)',
        explain: 'SUM 用绝对引用锁定范围，下拉时分母不变，每行都除以同一个总和',
      },
      {
        label: '某部门销售额占总额',
        formula: '=SUMIF(A:A,"销售部",B:B)/SUM(B:B)',
        explain: 'SUMIF 先汇总该部门的销售额，再除以全部总额',
      },
      {
        label: '格式化为带%的文本',
        formula: '=TEXT(B2/SUM($B$2:$B$100),"0.00%")',
        explain: '直接输出如 "23.45%" 的格式字符串，适合报表展示',
      },
    ],
    tips: [
      '分母 SUM 必须用绝对引用（$符号锁定），否则公式下拉时分母会跟着变化',
      '将单元格格式设为"百分比"比用 TEXT 函数更灵活，结果还可参与计算',
      '各类别占比之和应等于100%，可用 =SUM(C2:C10) 验证是否汇总正确',
    ],
  },

  {
    id: 'data-classification',
    category: 'analysis',
    emoji: '🏷️',
    title: '数值自动分档归类',
    difficulty: '初级',
    difficultyColor: 'green',
    desc: '根据数值大小自动打上分类标签，如将客户按采购金额分为"大客户/中客户/小客户"，或按成绩分ABC等级。',
    tags: ['IFS', 'IF', '分类', '分档', '标签', '等级'],
    columns: [
      { col: 'A', name: '客户',   eg: '张总' },
      { col: 'B', name: '年采购额', eg: '580000' },
      { col: 'C', name: '客户等级', eg: '（公式列）' },
    ],
    formulas: [
      {
        label: '按采购额分客户等级',
        formula: '=IFS(B2>=500000,"S级",B2>=100000,"A级",B2>=30000,"B级",TRUE,"C级")',
        explain: '≥50万→S级，≥10万→A级，≥3万→B级，其他→C级，自动匹配',
      },
      {
        label: '成绩 ABCDE 等级',
        formula: '=IFS(B2>=90,"A",B2>=80,"B",B2>=70,"C",B2>=60,"D",TRUE,"E")',
        explain: '标准五档评分，修改数字即可调整每档门槛',
      },
      {
        label: '简单两档判断',
        formula: '=IF(B2>=100000,"大客户","小客户")',
        explain: '只有两档时用简单 IF 即可，不需要 IFS',
      },
    ],
    tips: [
      'IFS 从上到下按顺序判断，条件要从大到小（或从最严格到最宽松）排列',
      '等级标签是文本，若后续需要按等级统计，可用 COUNTIF(C:C,"A级") 统计各级人数',
      '需要可视化配色？配合 Excel 条件格式，对 C 列不同文本值自动上不同背景色',
    ],
  },

  {
    id: 'abc-analysis',
    category: 'analysis',
    emoji: '📊',
    title: '帕累托ABC分析（二八法则）',
    difficulty: '高级',
    difficultyColor: 'red',
    desc: '按贡献度对产品/客户排序，找出贡献80%销售额的前20%产品（A类），用于聚焦核心资源。',
    tags: ['SUMPRODUCT', 'RANK', '帕累托', 'ABC分析', '二八法则'],
    columns: [
      { col: 'A', name: '产品', eg: 'SKU001' },
      { col: 'B', name: '销售额', eg: '58000' },
      { col: 'C', name: '累计占比', eg: '（公式列）' },
      { col: 'D', name: 'ABC类别', eg: '（公式列）' },
    ],
    formulas: [
      {
        label: '第一步：对销售额降序排名',
        formula: '=RANK(B2,B:B,0)',
        explain: '先找出每个产品的销售额排名，0=降序（高销售额排前面）',
      },
      {
        label: '第二步：计算排名靠前N个的累计占比',
        formula: '=SUMPRODUCT(LARGE(B$2:B$100,ROW(INDIRECT("1:"&RANK(B2,B$2:B$100)))))/SUM(B$2:B$100)',
        explain: '取前N大的销售额之和除以总销售额，N = 当前行的排名',
      },
      {
        label: '第三步：按累计占比划分ABC',
        formula: '=IFS(C2<=0.8,"A类",C2<=0.95,"B类",TRUE,"C类")',
        explain: '累计占比≤80%的产品为A类，80-95%为B类，其余为C类',
      },
    ],
    tips: [
      '做ABC分析前先按销售额降序排列数据，计算会更直观',
      'A类产品通常是20%左右，却贡献80%的销售额，是重点管理对象',
      '累计占比公式较复杂，也可用辅助列逐步计算：先排名、再取对应排名前N的总和、再除总计',
    ],
  },

  {
    id: 'moving-average',
    category: 'analysis',
    emoji: '📉',
    title: '移动平均平滑趋势',
    difficulty: '中级',
    difficultyColor: 'amber',
    desc: '用最近N期的平均值代替当期数据，消除短期波动，看出更清晰的趋势方向。常用于销售额、股价等数据。',
    tags: ['AVERAGE', 'OFFSET', '移动平均', '趋势', '平滑'],
    columns: [
      { col: 'A', name: '日期', eg: '2024-01-01' },
      { col: 'B', name: '销售额', eg: '12000' },
      { col: 'C', name: '7日移动均值', eg: '（公式列）' },
    ],
    formulas: [
      {
        label: '最近7天移动平均（OFFSET版）',
        formula: '=IFERROR(AVERAGE(OFFSET(B2,-6,0,7,1)),AVERAGE($B$2:B2))',
        explain: 'OFFSET从当前行向上取7行数据，不足7行时（前几行）IFERROR兜底取从头到当前行的均值',
      },
      {
        label: '固定窗口移动平均（从第7行开始）',
        formula: '=IF(ROW()-1<7,"-",AVERAGE(B2:B8))',
        explain: '前6行不计算（数据不足），第7行起取上面7行均值，配合行号偏移下拉',
      },
      {
        label: '简单N日均值（从第N+1行开始生效）',
        formula: '=AVERAGE(B2:INDEX(B:B,ROW()+6))',
        explain: '以当前行为起点取往下7行均值，适合从某一行开始向后看的场景',
      },
    ],
    tips: [
      '移动平均窗口越大，曲线越平滑但滞后越明显；窗口越小，反应越灵敏但噪声越多',
      '前N-1行数据不足时建议留空或标注"-"，避免用少量数据计算的均值误导判断',
      'Excel 内置的"数据 → 数据分析 → 移动平均"功能可以一键生成，不需要写公式',
    ],
  },

  // ══════════════════════════════════════════════════
  // 日期计算
  // ══════════════════════════════════════════════════
  {
    id: 'tenure-calculation',
    category: 'date',
    emoji: '👤',
    title: '工龄 / 账龄自动计算',
    difficulty: '初级',
    difficultyColor: 'green',
    desc: '根据入职日期（或合同开始日期）自动计算到今天的工龄，精确显示"X年X个月"，也支持只显示天数或只显示月数。',
    tags: ['DATEDIF', '工龄', '日期', '账龄', '天数'],
    columns: [
      { col: 'A', name: '员工姓名', eg: '李四' },
      { col: 'B', name: '入职日期', eg: '2020-06-15' },
      { col: 'C', name: '工龄',     eg: '（公式列）' },
    ],
    formulas: [
      {
        label: '显示"X年X个月"',
        formula: '=DATEDIF(B2,TODAY(),"Y")&"年"&DATEDIF(B2,TODAY(),"YM")&"个月"',
        explain: '"Y" 计算完整年数，"YM" 计算不足整年的剩余月数，用 & 拼接成文字',
      },
      {
        label: '只显示整年数（工龄年份）',
        formula: '=DATEDIF(B2,TODAY(),"Y")',
        explain: '返回纯数字，如 4（满4年）',
      },
      {
        label: '显示总天数（账龄天数）',
        formula: '=TODAY()-B2',
        explain: '日期直接相减得到天数，适合计算应收账款账龄',
      },
      {
        label: '超过30天标记"逾期"',
        formula: '=IF(TODAY()-B2>30,"逾期","正常")',
        explain: '将应付款日期放入 B2，超过30天自动标红逾期',
      },
    ],
    tips: [
      'DATEDIF 是隐藏函数，不会出现在自动提示里，但可以正常使用',
      '日期列必须是真正的日期格式，不是文本。如果显示 ##### 是列太窄，不是错误',
      '账龄分级（0-30天/31-60天/60天以上）可用 IFS 结合 TODAY()-B2 来判断',
    ],
  },

  {
    id: 'date-range-sum',
    category: 'date',
    emoji: '🗓️',
    title: '指定日期区间内数据统计',
    difficulty: '中级',
    difficultyColor: 'amber',
    desc: '统计某个时间段（如某季度、某月）内的销售额或订单数，条件用 ">=" 和 "<=" 指定日期范围。',
    tags: ['SUMIFS', 'COUNTIFS', '日期区间', '时间段', '季度', '月份'],
    columns: [
      { col: 'A', name: '订单号', eg: 'ORD001' },
      { col: 'B', name: '下单日期', eg: '2024-02-18' },
      { col: 'C', name: '金额',     eg: '3500' },
    ],
    formulas: [
      {
        label: '统计某季度总销售额',
        formula: '=SUMIFS(C:C,B:B,">="&DATE(2024,1,1),B:B,"<="&DATE(2024,3,31))',
        explain: 'DATE(2024,1,1) 生成日期，">="& 拼接成条件，统计 2024Q1 内所有订单金额之和',
      },
      {
        label: '统计某月订单数',
        formula: '=COUNTIFS(B:B,">="&DATE(2024,3,1),B:B,"<"&DATE(2024,4,1))',
        explain: '统计 2024年3月 的订单数，注意上限用 < 4月1日（不含）',
      },
      {
        label: '统计最近30天数据',
        formula: '=SUMIFS(C:C,B:B,">="&TODAY()-30,B:B,"<="&TODAY())',
        explain: 'TODAY()-30 自动计算30天前日期，无需手动修改，每天自动滚动',
      },
    ],
    tips: [
      '条件中的日期必须用 DATE() 函数或单元格引用，不能直接写 "2024-1-1"（文本格式不被识别）',
      '需要按月分组汇总全年数据？在辅助列用 =YEAR(B2)&"-"&TEXT(MONTH(B2),"00") 生成年月标签',
    ],
  },

  {
    id: 'contract-expiry',
    category: 'date',
    emoji: '⏰',
    title: '合同到期预警提醒',
    difficulty: '初级',
    difficultyColor: 'green',
    desc: '根据合同签订日期和年限，自动计算到期日，并标注"即将到期"或"已到期"，提前预警需要续签的合同。',
    tags: ['EDATE', 'IF', '到期', '合同', '预警'],
    columns: [
      { col: 'A', name: '合同方', eg: '甲公司' },
      { col: 'B', name: '签订日期', eg: '2022-03-01' },
      { col: 'C', name: '合同年限', eg: '3' },
      { col: 'D', name: '到期日',   eg: '（公式列）' },
      { col: 'E', name: '状态',     eg: '（公式列）' },
    ],
    formulas: [
      {
        label: '计算合同到期日',
        formula: '=EDATE(B2,C2*12)',
        explain: 'EDATE 在日期上加指定月数，C2年×12换算成月数，得到精确到期日',
      },
      {
        label: '标注合同状态',
        formula: '=IFS(D2<TODAY(),"已到期",D2-TODAY()<=30,"30天内到期",D2-TODAY()<=90,"90天内到期",TRUE,"正常")',
        explain: '依次判断：已过期 → 30天内 → 90天内 → 正常，逐层判断',
      },
      {
        label: '距到期还有多少天',
        formula: '=D2-TODAY()',
        explain: '到期日减今天，正数=还有N天，负数=已过期N天',
      },
    ],
    tips: [
      '建议对"已到期"和"30天内到期"用条件格式标红/橙，视觉上更醒目',
      '合同年限也可以用月为单位，这时 C2 直接填月数，EDATE 里去掉 *12',
      '如果需要精确到天（不是整月），改用 =B2+C2*365 或 =B2+DAYS(到期日,B2)',
    ],
  },

  {
    id: 'monthly-stats',
    category: 'date',
    emoji: '📅',
    title: '按年月自动分组统计',
    difficulty: '中级',
    difficultyColor: 'amber',
    desc: '将每条记录的日期归入对应的年-月标签，方便按月汇总数据，不需要手动筛选每个月。',
    tags: ['YEAR', 'MONTH', 'TEXT', '按月', '分组', '统计'],
    columns: [
      { col: 'A', name: '日期', eg: '2024-03-15' },
      { col: 'B', name: '金额', eg: '5800' },
      { col: 'C', name: '年月', eg: '（辅助列）' },
    ],
    formulas: [
      {
        label: '生成年月标签（辅助列）',
        formula: '=YEAR(A2)&"-"&TEXT(MONTH(A2),"00")',
        explain: '提取年份和月份，月份用 TEXT 补零保证 "2024-03" 格式一致，方便后续匹配',
      },
      {
        label: '按年月汇总销售额（数据透视替代）',
        formula: '=SUMIF(C:C,"2024-03",B:B)',
        explain: '用辅助列的年月标签作为条件，汇总该月所有金额',
      },
      {
        label: '不用辅助列直接按年月汇总',
        formula: '=SUMPRODUCT((YEAR(A2:A1000)=2024)*(MONTH(A2:A1000)=3)*B2:B1000)',
        explain: 'SUMPRODUCT 同时判断年份和月份两个条件相乘，无需辅助列',
      },
      {
        label: '统计某月订单笔数',
        formula: '=COUNTIFS(A:A,">="&DATE(2024,3,1),A:A,"<"&DATE(2024,4,1))',
        explain: '用日期范围条件统计订单数，比年月标签更精确',
      },
    ],
    tips: [
      '辅助列年月格式要统一，建议统一用 "YYYY-MM" 格式（如2024-03），不要用 "2024年3月" 等文字格式',
      '大量数据按月分析建议用数据透视表，比公式方便得多',
      '按季度统计：季度 = =ROUNDUP(MONTH(A2)/3,0)，1-3月Q1，4-6月Q2，以此类推',
    ],
  },

  {
    id: 'workday-countdown',
    category: 'date',
    emoji: '🗓️',
    title: '工作日倒计时与截止日期',
    difficulty: '初级',
    difficultyColor: 'green',
    desc: '计算距离某个截止日期还有多少个工作日，或者从今天起N个工作日后是哪天，自动排除周末。',
    tags: ['NETWORKDAYS', 'WORKDAY', '工作日', '倒计时', '截止日期'],
    columns: [
      { col: 'A', name: '项目名', eg: '年报审计' },
      { col: 'B', name: '截止日期', eg: '2024-12-31' },
      { col: 'C', name: '剩余工作日', eg: '（公式列）' },
    ],
    formulas: [
      {
        label: '距截止日期的工作日天数',
        formula: '=NETWORKDAYS(TODAY(),B2)-1',
        explain: 'NETWORKDAYS 计算两日期间工作日数（含首尾），减1排除今天本身',
      },
      {
        label: '从今天起5个工作日后的日期',
        formula: '=WORKDAY(TODAY(),5)',
        explain: 'WORKDAY 在今天基础上加5个工作日，自动跳过周末',
      },
      {
        label: '从今天起N个工作日后（N在单元格中）',
        formula: '=WORKDAY(TODAY(),D2)',
        explain: 'D2 存放工作日数，修改D2即可动态计算',
      },
      {
        label: '排除额外节假日',
        formula: '=NETWORKDAYS(TODAY(),B2,F2:F10)',
        explain: 'F2:F10 存放法定节假日日期列表，计算时会同时排除周末和这些假日',
      },
    ],
    tips: [
      'NETWORKDAYS 把起止两天都算在内，所以同一天结果是1，昨天到今天是2',
      'WORKDAY.INTL 可以自定义哪几天是"周末"，适合非标准排班（如大小周）',
      '剩余工作日显示负数说明已超期，可配合 IF 自动标注"已逾期"',
    ],
  },

  {
    id: 'age-calculation',
    category: 'date',
    emoji: '🎂',
    title: '精确年龄计算与生日提醒',
    difficulty: '初级',
    difficultyColor: 'green',
    desc: '根据出生日期计算精确年龄，并判断近期是否有生日需要提醒，常用于HR管理和客户关怀场景。',
    tags: ['DATEDIF', 'TODAY', '年龄', '生日', '提醒'],
    columns: [
      { col: 'A', name: '姓名', eg: '王小明' },
      { col: 'B', name: '出生日期', eg: '1990-08-15' },
      { col: 'C', name: '年龄',    eg: '（公式列）' },
      { col: 'D', name: '生日提醒', eg: '（公式列）' },
    ],
    formulas: [
      {
        label: '计算周岁年龄',
        formula: '=DATEDIF(B2,TODAY(),"Y")',
        explain: '返回从出生到今天满几周岁，"Y" 表示完整年数',
      },
      {
        label: '判断本月是否有生日',
        formula: '=IF(MONTH(B2)=MONTH(TODAY()),"本月生日","—")',
        explain: '比较出生日期的月份和当前月份是否相同',
      },
      {
        label: '距下次生日还有多少天',
        formula: '=DATE(IF(DATE(YEAR(TODAY()),MONTH(B2),DAY(B2))<TODAY(),YEAR(TODAY())+1,YEAR(TODAY())),MONTH(B2),DAY(B2))-TODAY()',
        explain: '如果今年生日已过，则计算到明年生日；否则计算到今年生日',
      },
    ],
    tips: [
      '年龄计算要用 DATEDIF 而不是直接相减，因为直接相减得到的是天数而不是年数',
      '生日提醒可以加提前天数：=IF(DATE(YEAR(TODAY()),MONTH(B2),DAY(B2))-TODAY()<=7,"7天内生日","")',
      '闰年2月29日出生的人，非闰年时2月28日或3月1日处理方式需确认',
    ],
  },

  {
    id: 'quarter-grouping',
    category: 'date',
    emoji: '📆',
    title: '季度划分与季度汇总',
    difficulty: '初级',
    difficultyColor: 'green',
    desc: '根据日期自动判断属于第几季度，并按季度汇总数据，不需要手动划分。',
    tags: ['MONTH', 'CEILING', 'CHOOSE', '季度', '分组'],
    columns: [
      { col: 'A', name: '日期', eg: '2024-05-18' },
      { col: 'B', name: '销售额', eg: '18000' },
      { col: 'C', name: '季度',   eg: '（公式列）' },
    ],
    formulas: [
      {
        label: '提取季度数字（1/2/3/4）',
        formula: '=ROUNDUP(MONTH(A2)/3,0)',
        explain: '月份除以3向上取整：1-3月→Q1，4-6月→Q2，7-9月→Q3，10-12月→Q4',
      },
      {
        label: '输出季度标签文字',
        formula: '=CHOOSE(ROUNDUP(MONTH(A2)/3,0),"Q1","Q2","Q3","Q4")',
        explain: 'CHOOSE 按季度数字取对应标签，结果为 "Q1"/"Q2"/"Q3"/"Q4"',
      },
      {
        label: '统计某季度的销售额',
        formula: '=SUMPRODUCT((ROUNDUP(MONTH(A2:A1000)/3,0)=2)*(YEAR(A2:A1000)=2024)*B2:B1000)',
        explain: '同时判断季度=2（Q2）且年份=2024，满足条件的行求和',
      },
    ],
    tips: [
      'ROUNDUP(月份/3,0) 是最简洁的季度计算方法，兼容所有版本',
      '输出格式也可以用 "第"&ROUNDUP(MONTH(A2)/3,0)&"季度"，如"第2季度"',
      '财务年度和自然年度不同时，需要根据实际财年起始月份调整公式',
    ],
  },

  {
    id: 'weekend-overtime',
    category: 'date',
    emoji: '🌙',
    title: '识别周末与加班统计',
    difficulty: '初级',
    difficultyColor: 'green',
    desc: '根据日期判断是否为周末，统计周末加班天数，或高亮显示排班表中的周末列。',
    tags: ['WEEKDAY', 'IF', '周末', '加班', '排班'],
    columns: [
      { col: 'A', name: '日期', eg: '2024-03-16' },
      { col: 'B', name: '是否加班', eg: '是' },
      { col: 'C', name: '是否周末', eg: '（公式列）' },
    ],
    formulas: [
      {
        label: '判断是否为周末',
        formula: '=IF(WEEKDAY(A2,2)>=6,"周末","工作日")',
        explain: 'WEEKDAY 第2参数=2表示周一=1...周日=7，≥6就是周六/周日',
      },
      {
        label: '统计周末加班天数',
        formula: '=COUNTIFS(C2:C100,"周末",B2:B100,"是")',
        explain: '同时满足"周末"且"加班"的行数，即周末加班次数',
      },
      {
        label: '显示星期几中文',
        formula: '=TEXT(A2,"AAAA")',
        explain: '"AAAA" 格式码输出 "星期一"~"星期日"，"AAA" 输出 "一"~"日"',
      },
      {
        label: '周末加班工资（1.5倍）',
        formula: '=IF(WEEKDAY(A2,2)>=6,B2*1.5,B2)',
        explain: 'B2 是日薪，周末×1.5，工作日正常计算',
      },
    ],
    tips: [
      'WEEKDAY(日期,2) 是最推荐的用法，周一到周日分别返回1-7，符合中国习惯',
      '用条件格式在日历/排班表里自动给周末列着色：选中整列 → 条件格式 → 公式 =WEEKDAY(A$1,2)>=6',
      '如果是大小周排班，需要额外判断当周是大周还是小周，可用 MOD(WEEKNUM(A2),2) 区分奇偶周',
    ],
  },

  // ══════════════════════════════════════════════════
  // 文本处理
  // ══════════════════════════════════════════════════
  {
    id: 'extract-from-code',
    category: 'text',
    emoji: '✂️',
    title: '从编码中提取关键字段',
    difficulty: '中级',
    difficultyColor: 'amber',
    desc: '产品编码、单号等字段通常包含多段信息（如 "P001-20240115-SH"），用 MID+FIND 或 TEXTBEFORE/AFTER 拆分出各个部分。',
    tags: ['MID', 'FIND', 'LEFT', 'RIGHT', 'TEXTBEFORE', '文本', '拆分', '编码'],
    columns: [
      { col: 'A', name: '完整编码', eg: 'P001-20240115-SH' },
      { col: 'B', name: '产品型号', eg: 'P001  （提取第一段）' },
      { col: 'C', name: '出厂日期', eg: '20240115  （提取第二段）' },
      { col: 'D', name: '仓库代码', eg: 'SH  （提取第三段）' },
    ],
    formulas: [
      {
        label: '提取第一段（Excel 365）',
        formula: '=TEXTBEFORE(A2,"-")',
        explain: 'TEXTBEFORE 直接取第一个"-"之前的内容，简洁直观',
      },
      {
        label: '提取最后一段（Excel 365）',
        formula: '=TEXTAFTER(A2,"-",-1)',
        explain: 'TEXTAFTER 第三参数-1表示从最后一个分隔符取后面的内容',
      },
      {
        label: '提取第一段（兼容旧版）',
        formula: '=LEFT(A2,FIND("-",A2)-1)',
        explain: 'FIND 找到第一个"-"的位置，LEFT 取其左边的内容',
      },
      {
        label: '提取最后一段（兼容旧版）',
        formula: '=RIGHT(A2,LEN(A2)-FIND("★",SUBSTITUTE(A2,"-","★",LEN(A2)-LEN(SUBSTITUTE(A2,"-","")))))',
        explain: 'SUBSTITUTE 把最后一个"-"替换成特殊字符，再用FIND定位，RIGHT取右侧内容',
      },
    ],
    tips: [
      'Excel 365 / WPS新版优先用 TEXTBEFORE/TEXTAFTER，比 MID+FIND 简单得多',
      '分隔符固定且各段长度固定时，直接用 MID(A2,起始位,长度) 更简单',
      '复杂拆分建议用辅助列分步完成，不要一个公式写到底，方便调试',
    ],
  },

  {
    id: 'id-card-extract',
    category: 'text',
    emoji: '🪪',
    title: '身份证号提取生日与性别',
    difficulty: '中级',
    difficultyColor: 'amber',
    desc: '18位身份证号包含出生日期（第7-14位）和性别信息（第17位奇数=男，偶数=女），用 MID 提取。',
    tags: ['MID', 'LEFT', '身份证', '生日', '性别', '提取'],
    columns: [
      { col: 'A', name: '姓名', eg: '张三' },
      { col: 'B', name: '身份证号', eg: '110101199001011234' },
      { col: 'C', name: '出生日期', eg: '（公式列）' },
      { col: 'D', name: '性别', eg: '（公式列）' },
      { col: 'E', name: '年龄', eg: '（公式列）' },
    ],
    formulas: [
      {
        label: '提取出生日期',
        formula: '=--TEXT(MID(B2,7,8),"0-00-00")',
        explain: 'MID取第7位起8位（如19900101），TEXT加"-"转成日期格式，-- 将文本转为日期数值',
      },
      {
        label: '判断性别',
        formula: '=IF(MOD(MID(B2,17,1),2)=1,"男","女")',
        explain: '第17位数字奇数为男，偶数为女，MOD(数字,2)=1则为奇数',
      },
      {
        label: '根据身份证计算年龄',
        formula: '=DATEDIF(TEXT(MID(B2,7,8),"0-00-00"),TODAY(),"Y")',
        explain: '先从身份证提取生日，再用 DATEDIF 计算到今天的年龄',
      },
      {
        label: '提取所在省份（前2位）',
        formula: '=LEFT(B2,2)',
        explain: '身份证前2位是省级行政区代码，如 11=北京，31=上海，44=广东',
      },
    ],
    tips: [
      '身份证列要设置为"文本"格式，否则超长数字会变成科学计数法导致后几位变0',
      '15位旧身份证号生日在第7-12位（6位年份只有后2位），公式需要相应调整',
      '性别判断用第17位，而不是第18位（第18位是校验码）',
    ],
  },

  {
    id: 'phone-mask',
    category: 'text',
    emoji: '📱',
    title: '手机号/身份证脱敏处理',
    difficulty: '初级',
    difficultyColor: 'green',
    desc: '对手机号、身份证等敏感信息进行部分遮挡（如138****8888），满足隐私保护要求同时保留必要信息。',
    tags: ['REPLACE', 'LEFT', 'RIGHT', '脱敏', '隐私', '手机号'],
    columns: [
      { col: 'A', name: '完整手机号', eg: '13812345678' },
      { col: 'B', name: '脱敏手机号', eg: '（公式列）' },
    ],
    formulas: [
      {
        label: '手机号中间4位脱敏',
        formula: '=REPLACE(A2,4,4,"****")',
        explain: '从第4位起替换4个字符为****，结果如 138****5678',
      },
      {
        label: '手机号保留前3后4',
        formula: '=LEFT(A2,3)&"****"&RIGHT(A2,4)',
        explain: '取前3位 + 4个星号 + 后4位拼接，效果相同',
      },
      {
        label: '身份证保留前6后4',
        formula: '=LEFT(A2,6)&"********"&RIGHT(A2,4)',
        explain: '18位身份证遮挡中间8位',
      },
      {
        label: '邮箱地址脱敏（@前保留2位）',
        formula: '=LEFT(A2,2)&"***"&MID(A2,FIND("@",A2),100)',
        explain: '邮箱用户名只保留前2个字符，@及后面的域名完整保留',
      },
    ],
    tips: [
      'REPLACE 适合长度固定的数据；长度不固定时用 LEFT/RIGHT 组合更灵活',
      '脱敏后的数据是文本，如需还原需要保留原始数据（建议在隐藏列或独立保存）',
      '大批量脱敏处理推荐写一个 VBA 宏，比手动公式效率高很多',
    ],
  },

  {
    id: 'text-clean',
    category: 'text',
    emoji: '🧹',
    title: '数据清洗与格式标准化',
    difficulty: '初级',
    difficultyColor: 'green',
    desc: '处理从系统导出或人工录入的脏数据：去多余空格、统一大小写、删除特殊符号，让数据格式一致。',
    tags: ['TRIM', 'SUBSTITUTE', 'UPPER', 'LOWER', '清洗', '标准化', '空格'],
    columns: [
      { col: 'A', name: '原始数据', eg: '  北京  科技  有限公司 ' },
      { col: 'B', name: '清洗后', eg: '（公式列）' },
    ],
    formulas: [
      {
        label: '去除所有多余空格',
        formula: '=TRIM(A2)',
        explain: '去除首尾空格，将中间连续多个空格压缩为单个空格',
      },
      {
        label: '去除文本中所有空格',
        formula: '=SUBSTITUTE(A2," ","")',
        explain: '将所有空格（包括中间的）全部删除，适合手机号、编码等不应有空格的字段',
      },
      {
        label: '同时去空格和不可见字符',
        formula: '=TRIM(CLEAN(A2))',
        explain: 'CLEAN 先清除不可见字符（换行符等），TRIM 再处理空格',
      },
      {
        label: '统一全角符号为半角',
        formula: '=SUBSTITUTE(SUBSTITUTE(A2,"，",","),"。",".")',
        explain: '嵌套 SUBSTITUTE 逐个替换全角符号，根据实际情况增减替换对',
      },
    ],
    tips: [
      'TRIM 只能处理普通空格（ASCII 32），网页复制来的"不间断空格"（ASCII 160）需用 SUBSTITUTE 替换',
      '去除换行符：=SUBSTITUTE(A2,CHAR(10),"")，CHAR(10) 就是换行符',
      '清洗完成后建议"选择性粘贴 → 仅值"固化结果，避免公式占用资源',
    ],
  },

  {
    id: 'keyword-tag',
    category: 'text',
    emoji: '🏷️',
    title: '关键词自动打标签',
    difficulty: '中级',
    difficultyColor: 'amber',
    desc: '根据文本内容是否包含特定关键词，自动给记录打上分类标签，如根据备注内容识别客户类型。',
    tags: ['IF', 'SEARCH', 'ISNUMBER', '标签', '关键词', '分类'],
    columns: [
      { col: 'A', name: '客户备注', eg: '长期合作，VIP客户，优先服务' },
      { col: 'B', name: '客户标签', eg: '（公式列）' },
    ],
    formulas: [
      {
        label: '包含"VIP"则标注',
        formula: '=IF(ISNUMBER(SEARCH("VIP",A2)),"VIP客户","普通客户")',
        explain: 'SEARCH 找到关键词则返回位置数字（ISNUMBER为TRUE），找不到则报错（ISNUMBER为FALSE）',
      },
      {
        label: '多关键词匹配，任一满足即标注',
        formula: '=IF(ISNUMBER(SEARCH("VIP",A2))+ISNUMBER(SEARCH("大客户",A2))>0,"重点客户","")',
        explain: '两个ISNUMBER相加，任一为TRUE（=1）则结果>0，即任一关键词匹配就标注',
      },
      {
        label: '分层打标签（优先级）',
        formula: '=IFS(ISNUMBER(SEARCH("流失",A2)),"流失客户",ISNUMBER(SEARCH("VIP",A2)),"VIP客户",ISNUMBER(SEARCH("新客",A2)),"新客户",TRUE,"普通客户")',
        explain: '按优先级判断：流失 > VIP > 新客 > 普通，先匹配到的标签优先',
      },
    ],
    tips: [
      'SEARCH 不区分大小写，"vip"和"VIP"都能匹配到；FIND 区分大小写',
      '关键词列表长时，可以把关键词放在单独一列，用 SUMPRODUCT+ISNUMBER+SEARCH 批量匹配',
      '大量文本分类推荐用 Power Query 的"条件列"功能，比嵌套公式更清晰',
    ],
  },

  {
    id: 'merge-columns',
    category: 'text',
    emoji: '🔗',
    title: '多列内容智能合并',
    difficulty: '初级',
    difficultyColor: 'green',
    desc: '将多列文本拼接为一段描述，如把"省""市""区""街道"合并为完整地址，或用逗号连接多个标签。',
    tags: ['CONCAT', 'TEXTJOIN', '拼接', '合并', '地址', '连接'],
    columns: [
      { col: 'A', name: '省', eg: '广东省' },
      { col: 'B', name: '市', eg: '深圳市' },
      { col: 'C', name: '区', eg: '南山区' },
      { col: 'D', name: '详细地址', eg: '科技园路1号' },
      { col: 'E', name: '完整地址', eg: '（公式列）' },
    ],
    formulas: [
      {
        label: '直接拼接（&符号）',
        formula: '=A2&B2&C2&D2',
        explain: '最简单的拼接方式，各部分之间无分隔符，适合地址等紧密拼接',
      },
      {
        label: '用逗号连接（TEXTJOIN）',
        formula: '=TEXTJOIN(",",TRUE,A2:D2)',
        explain: 'TRUE 表示自动跳过空单元格，避免出现 "广东省,,南山区" 这样的双逗号',
      },
      {
        label: '加前缀后缀拼接',
        formula: '="地址："&A2&B2&C2&D2&"（"&E2&"）"',
        explain: '在拼接结果前后加固定文字，如 "地址：广东省深圳市...（邮编：518000）"',
      },
      {
        label: '将一列多行合并为一行（用、分隔）',
        formula: '=TEXTJOIN("、",TRUE,A2:A20)',
        explain: '把 A2:A20 中的所有非空值用顿号连接成一个字符串',
      },
    ],
    tips: [
      'TEXTJOIN 的第二参数 TRUE 表示忽略空值，FALSE 表示保留空值位置',
      '超过255个单元格的范围，TEXTJOIN 可能报错，建议分段拼接',
      '需要在合并前检查每段内容是否非空，可以用 IF(A2="","",A2&B2) 避免多余分隔符',
    ],
  },

  // ══════════════════════════════════════════════════
  // 财务金融
  // ══════════════════════════════════════════════════
  {
    id: 'loan-schedule',
    category: 'finance',
    emoji: '🏠',
    title: '贷款还款计划表',
    difficulty: '中级',
    difficultyColor: 'amber',
    desc: '计算每期等额还款额，并拆分每期还款中的本金和利息部分，生成完整的还款计划表，适用于房贷、车贷分析。',
    tags: ['PMT', 'IPMT', 'PPMT', '贷款', '月供', '还款计划'],
    columns: [
      { col: 'A', name: '期数', eg: '1' },
      { col: 'B', name: '月供总额', eg: '（公式列）' },
      { col: 'C', name: '其中利息', eg: '（公式列）' },
      { col: 'D', name: '其中本金', eg: '（公式列）' },
      { col: 'E', name: '剩余本金', eg: '（公式列）' },
    ],
    formulas: [
      {
        label: '每月还款额（设年利率5%，贷款100万，30年）',
        formula: '=PMT(0.05/12,360,-1000000)',
        explain: '月利率=0.05/12，360期=30年×12个月，贷款填负数，结果为正数表示每月需还金额',
      },
      {
        label: '第N期中的利息部分',
        formula: '=IPMT(0.05/12,A2,360,-1000000)',
        explain: 'A2 是期数，其余参数同 PMT，结果是该期还款中的利息金额',
      },
      {
        label: '第N期中的本金部分',
        formula: '=PPMT(0.05/12,A2,360,-1000000)',
        explain: 'PPMT 计算该期还款中归还的本金，早期本金少利息多，后期本金多利息少',
      },
      {
        label: '第N期后剩余本金',
        formula: '=1000000+CUMIPMT(0.05/12,360,1000000,1,A2,0)+PMT(0.05/12,360,-1000000)*A2',
        explain: '也可以直接用：剩余本金 = 上期剩余 - 本期本金',
      },
    ],
    tips: [
      '年利率5%，月利率 = 5%/12 ≈ 0.4167%，PMT 中需要填月利率',
      '30年×12月 = 360期，填入 NPER（总期数）参数',
      '贷款金额填负数是惯例，表示"借入"现金流，结果（月供）就会是正数',
    ],
  },

  {
    id: 'investment-growth',
    category: 'finance',
    emoji: '💹',
    title: '定期定投终值计算',
    difficulty: '初级',
    difficultyColor: 'green',
    desc: '计算每月固定投入一笔钱（如基金定投），按固定年化收益率，N年后账户总价值是多少。',
    tags: ['FV', '定投', '复利', '终值', '理财', '收益'],
    columns: [
      { col: 'A', name: '参数', eg: '' },
      { col: 'B', name: '数值', eg: '' },
    ],
    formulas: [
      {
        label: '每月投入2000，年化8%，坚持10年后总价值',
        formula: '=FV(0.08/12,120,-2000,0)',
        explain: '月利率=0.08/12，120期=10年，每期投入2000（填负数表示流出），初始金额0',
      },
      {
        label: '有初始本金的定投（先一次性投入5万再每月定投）',
        formula: '=FV(0.08/12,120,-2000,-50000)',
        explain: '第4参数填-50000，表示期初有5万本金，同样年化8%复利增长',
      },
      {
        label: '不同收益率下的终值对比',
        formula: '=FV(B2/12,120,-2000,0)',
        explain: 'B2 存年化收益率，修改B2即可快速比较不同回报率下的结果',
      },
    ],
    tips: [
      '年化收益率要换算成月利率（÷12）再填入 FV',
      '定投金额填负数（表示从账户流出），结果（终值）会是正数',
      'FV 假设收益率恒定，实际投资收益波动较大，结果仅供参考',
    ],
  },

  {
    id: 'project-npv',
    category: 'finance',
    emoji: '🏗️',
    title: '投资项目净现值分析',
    difficulty: '高级',
    difficultyColor: 'red',
    desc: '评估一个需要初始投入、未来产生现金流的项目，计算净现值（NPV）和内部收益率（IRR），判断是否值得投资。',
    tags: ['NPV', 'IRR', '净现值', '现金流', '投资分析', '决策'],
    columns: [
      { col: 'A', name: '年份', eg: '第0年（初始投入）' },
      { col: 'B', name: '现金流', eg: '-500000（初始投入）' },
    ],
    formulas: [
      {
        label: '净现值（折现率10%）',
        formula: '=NPV(0.1,B2:B6)+B1',
        explain: 'NPV计算第1-5年现金流现值之和，B1是第0年的初始投入（负数），最后加上',
      },
      {
        label: '内部收益率',
        formula: '=IRR(B1:B6)',
        explain: 'B1:B6 包含完整现金流（含第0年负数投入），IRR 反算使NPV=0的折现率',
      },
      {
        label: '投资决策判断',
        formula: '=IF(NPV(0.1,B2:B6)+B1>0,"建议投资","不建议投资")',
        explain: 'NPV>0表示按10%折现率项目有正收益，建议投资；NPV<0则不值得',
      },
    ],
    tips: [
      'NPV 的现金流从第1期开始，第0期（初始投入）要单独加上，否则结果偏高',
      'IRR 大于资本成本（融资利率）时，说明项目回报率高于成本，值得投资',
      'NPV 和 IRR 互为验证：NPV>0时IRR必然大于折现率，两者结论应一致',
    ],
  },

  {
    id: 'depreciation-plan',
    category: 'finance',
    emoji: '🏭',
    title: '固定资产折旧计划表',
    difficulty: '中级',
    difficultyColor: 'amber',
    desc: '计算固定资产（如设备、车辆）的年度折旧额，支持直线法（每年相同）和余额递减法（前期多后期少）两种方式。',
    tags: ['SLN', 'DB', '折旧', '固定资产', '会计', '财务'],
    columns: [
      { col: 'A', name: '年份', eg: '第1年' },
      { col: 'B', name: '直线法折旧', eg: '（公式列）' },
      { col: 'C', name: '余额递减法折旧', eg: '（公式列）' },
      { col: 'D', name: '账面余值', eg: '（公式列）' },
    ],
    formulas: [
      {
        label: '直线法折旧（年折旧额固定）',
        formula: '=SLN(100000,10000,5)',
        explain: '原值10万，残值1万，使用5年，每年折旧=(10万-1万)/5=1.8万',
      },
      {
        label: '余额递减法折旧（第N年）',
        formula: '=DB(100000,10000,5,A2)',
        explain: 'A2是年份序号（1,2,3...），DB按固定递减率计算，前几年折旧最多',
      },
      {
        label: '直线法账面净值',
        formula: '=100000-SLN(100000,10000,5)*A2',
        explain: '原值减去已累计折旧（年折旧额×年数），得到当前账面价值',
      },
    ],
    tips: [
      '直线法简单，每年折旧相同，适合使用均匀、价值稳定的资产',
      '余额递减法前期折旧多，反映资产使用效益随时间递减，适合技术设备等',
      '税法折旧和会计折旧可能不同，需要根据具体规定选择方法',
    ],
  },

  {
    id: 'rate-compare',
    category: 'finance',
    emoji: '💱',
    title: '名义利率与实际利率换算',
    difficulty: '中级',
    difficultyColor: 'amber',
    desc: '银行报价通常是名义年利率，但按月计息时实际年化利率会更高。用 EFFECT 和 NOMINAL 函数精确换算。',
    tags: ['EFFECT', 'NOMINAL', '利率', '换算', '复利', '年化'],
    columns: [
      { col: 'A', name: '名义年利率', eg: '6%' },
      { col: 'B', name: '计息频率', eg: '12（按月）' },
      { col: 'C', name: '实际年利率', eg: '（公式列）' },
    ],
    formulas: [
      {
        label: '名义利率→实际年化利率',
        formula: '=EFFECT(A2,B2)',
        explain: '名义年利率6%按月复利（12次），实际年化≈6.168%，高于名义利率',
      },
      {
        label: '已知实际利率→反算名义利率',
        formula: '=NOMINAL(C2,B2)',
        explain: '已知实际年化利率，反算银行报价的名义年利率',
      },
      {
        label: '日贷款利率换算为年化',
        formula: '=EFFECT(A2*365,365)',
        explain: 'A2 是日利率，×365换算成名义年利率，再用EFFECT算实际年化（日复利）',
      },
    ],
    tips: [
      '按月计息（月复利）的实际年化利率 ≈ 名义利率 + 名义利率²/2，略高于名义利率',
      '互联网贷款常用"日利率×30"标注月费率，实际年化可能高达30%以上，要警惕',
      '投资收益率对比时也要确保都换算成同一口径（都是名义或都是实际），才能公平比较',
    ],
  },

  // ══════════════════════════════════════════════════
  // 人力资源
  // ══════════════════════════════════════════════════
  {
    id: 'attendance-stats',
    category: 'hr',
    emoji: '📋',
    title: '考勤异常自动统计',
    difficulty: '初级',
    difficultyColor: 'green',
    desc: '统计每个员工的迟到次数、缺勤天数、全勤情况，并自动汇总月度考勤报告。',
    tags: ['COUNTIF', 'COUNTIFS', '考勤', '迟到', '缺勤', '统计'],
    columns: [
      { col: 'A', name: '员工', eg: '张三' },
      { col: 'B', name: '日期', eg: '2024-03-01' },
      { col: 'C', name: '状态', eg: '正常/迟到/缺勤/早退' },
    ],
    formulas: [
      {
        label: '统计某员工当月迟到次数',
        formula: '=COUNTIFS(A:A,"张三",C:C,"迟到")',
        explain: 'COUNTIFS 同时满足员工=张三 且 状态=迟到，计算符合条件的行数',
      },
      {
        label: '统计当月全勤人数（无任何异常）',
        formula: '=SUMPRODUCT((COUNTIF(A2:A1000,"*")>0)*(COUNTIFS(A2:A1000,A2:A1000,C2:C1000,"<>正常")=0))',
        explain: '统计在整个考勤表中只有"正常"记录、没有任何异常的员工数量',
      },
      {
        label: '汇总各类异常总次数',
        formula: '=COUNTIF(C:C,"迟到")',
        explain: '统计全表中"迟到"出现的总次数，换成"缺勤"/"早退"可统计其他异常',
      },
    ],
    tips: [
      '考勤状态要统一用固定词汇（如"迟到""缺勤"），手工录入时容易出现"迟  到"等不一致，建议用下拉菜单控制输入',
      '大于N分钟才算迟到的判断：=IF(打卡时间-规定时间>TIME(0,15,0),"迟到","正常")',
      '结合条件格式，对异常状态自动标红，视觉更直观',
    ],
  },

  {
    id: 'performance-grade',
    category: 'hr',
    emoji: '🏆',
    title: '绩效评级与奖金计算',
    difficulty: '中级',
    difficultyColor: 'amber',
    desc: '根据考核得分自动评定绩效等级（A/B/C/D），并按等级计算奖金系数，支持多维度加权计算。',
    tags: ['IFS', 'SUMPRODUCT', '绩效', '评级', '奖金', '加权'],
    columns: [
      { col: 'A', name: '员工', eg: '李四' },
      { col: 'B', name: '工作业绩', eg: '85' },
      { col: 'C', name: '工作态度', eg: '90' },
      { col: 'D', name: '加权总分', eg: '（公式列）' },
      { col: 'E', name: '绩效等级', eg: '（公式列）' },
      { col: 'F', name: '奖金系数', eg: '（公式列）' },
    ],
    formulas: [
      {
        label: '加权综合得分（业绩60%+态度40%）',
        formula: '=B2*0.6+C2*0.4',
        explain: '按权重加总各维度得分，也可用 SUMPRODUCT({0.6,0.4},{B2,C2}) 向量写法',
      },
      {
        label: '绩效等级评定',
        formula: '=IFS(D2>=90,"A",D2>=75,"B",D2>=60,"C",TRUE,"D")',
        explain: '≥90分A等，≥75分B等，≥60分C等，其余D等',
      },
      {
        label: '按等级匹配奖金系数',
        formula: '=XLOOKUP(E2,{"A","B","C","D"},{1.5,1.2,1.0,0.8})',
        explain: 'XLOOKUP 在内联数组中查找等级，返回对应系数，简洁高效',
      },
    ],
    tips: [
      '权重之和必须等于1（或100%），否则总分会偏高或偏低',
      '多个维度用 SUMPRODUCT 写法更清晰：=SUMPRODUCT(B2:E2,{0.3,0.3,0.2,0.2})',
      '绩效等级比例有硬性要求（强制分布）时，可以先排名再按比例划档',
    ],
  },

  {
    id: 'seniority-salary',
    category: 'hr',
    emoji: '💼',
    title: '工龄工资自动计算',
    difficulty: '初级',
    difficultyColor: 'green',
    desc: '根据员工入职日期自动计算工龄，按工龄段计算对应的工龄工资，超过一定年限封顶。',
    tags: ['DATEDIF', 'IFS', 'MIN', '工龄', '工资', '入职'],
    columns: [
      { col: 'A', name: '员工', eg: '王五' },
      { col: 'B', name: '入职日期', eg: '2018-07-01' },
      { col: 'C', name: '工龄（年）', eg: '（公式列）' },
      { col: 'D', name: '工龄工资', eg: '（公式列）' },
    ],
    formulas: [
      {
        label: '计算工龄（整年数）',
        formula: '=DATEDIF(B2,TODAY(),"Y")',
        explain: '计算从入职日到今天满几周岁，"Y" 取整年',
      },
      {
        label: '工龄工资（每年100元，满10年封顶）',
        formula: '=MIN(DATEDIF(B2,TODAY(),"Y"),10)*100',
        explain: 'MIN 确保工龄最多计算10年，超出部分不累加',
      },
      {
        label: '阶梯工龄工资（不同年限段不同金额）',
        formula: '=IFS(C2>=10,2000,C2>=5,1000,C2>=3,500,C2>=1,200,TRUE,0)',
        explain: '满10年2000，满5年1000，满3年500，满1年200，不满1年0',
      },
    ],
    tips: [
      '试用期是否计入工龄需确认公司规定，通常试用期满后才算正式入职',
      '工龄计算用 DATEDIF 而不是直接用年份相减，避免跨年时差1年的问题',
      '工龄工资封顶时，也可以用 ROUNDDOWN(MIN(C2,10)/年资系数)*金额 做更灵活的计算',
    ],
  },

  {
    id: 'leave-calculation',
    category: 'hr',
    emoji: '🏖️',
    title: '年假天数自动核算',
    difficulty: '初级',
    difficultyColor: 'green',
    desc: '根据工龄自动计算员工应享年假天数，并统计已休假天数和剩余年假，支持自动到期清零。',
    tags: ['DATEDIF', 'IFS', 'COUNTIFS', '年假', '休假', '工龄'],
    columns: [
      { col: 'A', name: '员工', eg: '赵六' },
      { col: 'B', name: '入职日期', eg: '2016-04-01' },
      { col: 'C', name: '应享年假', eg: '（公式列）' },
      { col: 'D', name: '已休天数', eg: '5' },
      { col: 'E', name: '剩余年假', eg: '（公式列）' },
    ],
    formulas: [
      {
        label: '按工龄计算应享年假（国家标准）',
        formula: '=IFS(DATEDIF(B2,TODAY(),"Y")<1,0,DATEDIF(B2,TODAY(),"Y")<10,5,DATEDIF(B2,TODAY(),"Y")<20,10,TRUE,15)',
        explain: '未满1年0天，1-9年5天，10-19年10天，20年及以上15天（劳动法标准）',
      },
      {
        label: '剩余年假天数',
        formula: '=C2-D2',
        explain: '应享年假减已休天数，负数说明超休',
      },
      {
        label: '统计某员工今年已休年假',
        formula: '=COUNTIFS(休假记录!A:A,A2,休假记录!B:B,"年假",休假记录!C:C,">="&DATE(YEAR(TODAY()),1,1))',
        explain: '在休假记录表中，统计本年度内该员工的年假次数（每次默认1天）',
      },
    ],
    tips: [
      '劳动法年假5/10/15天分别对应工龄1年、10年、20年以上',
      '年假通常在自然年内有效（12月31日清零），跨年结转需单独处理',
      '实际天数计算要排除法定节假日和公休日，建议结合 NETWORKDAYS 函数',
    ],
  },

  {
    id: 'salary-slip',
    category: 'hr',
    emoji: '💰',
    title: '工资条自动生成',
    difficulty: '中级',
    difficultyColor: 'amber',
    desc: '根据员工编号从工资总表中自动提取对应行的数据，生成工资条，避免逐行复制粘贴。',
    tags: ['XLOOKUP', 'INDEX', 'MATCH', '工资条', '查询', '自动化'],
    columns: [
      { col: 'A', name: '工资项目', eg: '基本工资' },
      { col: 'B', name: '金额', eg: '（公式列）' },
      { col: '', name: '···工资总表···', eg: '' },
      { col: 'D', name: '员工编号', eg: 'E001' },
      { col: 'E', name: '基本工资', eg: '8000' },
      { col: 'F', name: '绩效工资', eg: '2000' },
    ],
    formulas: [
      {
        label: '根据员工编号查对应工资项',
        formula: '=XLOOKUP($B$1,工资表!$D:$D,工资表!E:E,"—")',
        explain: '$B$1 是工资条上方填写的员工编号单元格，锁定引用，在不同行查不同列',
      },
      {
        label: '使用INDEX+MATCH兼容旧版',
        formula: '=IFERROR(INDEX(工资表!E:E,MATCH($B$1,工资表!$D:$D,0)),"—")',
        explain: 'MATCH 找到员工编号所在行，INDEX 取该行对应列的值',
      },
      {
        label: '合计应发工资',
        formula: '=SUM(B2:B10)',
        explain: '对工资条中所有应发项目求和',
      },
    ],
    tips: [
      '工资条通常有多个项目（基本工资、绩效、补贴、扣款等），每项写一行，引用不同列',
      '批量生成工资条可以用 VBA 宏，效率更高：按员工编号循环，每人生成一行数据',
      '发工资条要注意保密，建议用邮件发送或打印裁剪，不要整张工资表共享',
    ],
  },

  // ══════════════════════════════════════════════════
  // 销售分析
  // ══════════════════════════════════════════════════
  {
    id: 'sales-funnel',
    category: 'sales',
    emoji: '🌊',
    title: '销售漏斗各阶段统计',
    difficulty: '初级',
    difficultyColor: 'green',
    desc: '统计销售流程中各阶段（线索→商机→报价→签约）的数量和转化率，分析哪个环节流失最多。',
    tags: ['COUNTIF', 'COUNTIFS', '漏斗', '转化率', '销售流程'],
    columns: [
      { col: 'A', name: '客户', eg: '北京公司' },
      { col: 'B', name: '所在阶段', eg: '商机' },
      { col: 'C', name: '预计金额', eg: '50000' },
    ],
    formulas: [
      {
        label: '统计各阶段客户数量',
        formula: '=COUNTIF(B:B,"商机")',
        explain: '换成"线索"/"报价"/"签约"统计各阶段数量',
      },
      {
        label: '各阶段预计成交金额',
        formula: '=SUMIF(B:B,"商机",C:C)',
        explain: '统计处于"商机"阶段的客户预计合同金额总和',
      },
      {
        label: '阶段转化率',
        formula: '=COUNTIF(B:B,"报价")/COUNTIF(B:B,"商机")',
        explain: '报价数÷商机数=进入报价阶段的转化率，结果设为百分比格式',
      },
      {
        label: '加权成交概率预测',
        formula: '=SUMPRODUCT((B2:B100="报价")*C2:C100*0.5)',
        explain: '"报价"阶段假设50%成交概率，用SUMPRODUCT乘以概率后求和预测成交额',
      },
    ],
    tips: [
      '阶段名称要统一，用下拉菜单控制输入，避免"商 机""商机 "等空格问题',
      '结合时间条件（本月新增、本季度）用 COUNTIFS 过滤日期范围',
      '漏斗图数据准备好后，直接插入Excel漏斗图（插入→图表→漏斗图）即可可视化',
    ],
  },

  {
    id: 'customer-rfm',
    category: 'sales',
    emoji: '👥',
    title: 'RFM客户价值分析',
    difficulty: '高级',
    difficultyColor: 'red',
    desc: '根据最近购买时间（R）、购买频次（F）、购买金额（M）三个维度给客户打分，识别高价值客户和流失风险客户。',
    tags: ['DAYS', 'COUNTIFS', 'SUMIFS', 'RANK', 'RFM', '客户分析'],
    columns: [
      { col: 'A', name: '客户ID', eg: 'C001' },
      { col: 'B', name: '最近购买日期', eg: '2024-02-01' },
      { col: 'C', name: '购买次数', eg: '8' },
      { col: 'D', name: '累计金额', eg: '25000' },
      { col: 'E', name: 'R分',  eg: '（公式列）' },
      { col: 'F', name: 'F分',  eg: '（公式列）' },
      { col: 'G', name: 'M分',  eg: '（公式列）' },
      { col: 'H', name: 'RFM总分', eg: '（公式列）' },
    ],
    formulas: [
      {
        label: 'R分（距今越近越高，最近30天=5分）',
        formula: '=IFS(TODAY()-B2<=30,5,TODAY()-B2<=60,4,TODAY()-B2<=90,3,TODAY()-B2<=180,2,TRUE,1)',
        explain: '购买越近R分越高，30天内=5分，31-60天=4分，以此类推',
      },
      {
        label: 'F分（购买越频繁越高）',
        formula: '=IFS(C2>=10,5,C2>=7,4,C2>=4,3,C2>=2,2,TRUE,1)',
        explain: '10次以上=5分，7-9次=4分，4-6次=3分，2-3次=2分，1次=1分',
      },
      {
        label: 'M分（金额越高越高）',
        formula: '=IFS(D2>=50000,5,D2>=20000,4,D2>=10000,3,D2>=3000,2,TRUE,1)',
        explain: '按累计消费金额分5档评分',
      },
      {
        label: 'RFM总分',
        formula: '=E2+F2+G2',
        explain: '三个维度得分相加，总分越高客户价值越高',
      },
    ],
    tips: [
      '每个维度的分档阈值要根据自己业务数据的分布来定，不能照搬模板',
      '高价值客户（总分>=12）：重点维护；低价值客户（总分<=5）：分析是否有激活价值',
      '更精细的RFM可以对R/F/M加权：总分 = R*0.4 + F*0.3 + M*0.3',
    ],
  },

  {
    id: 'product-ranking',
    category: 'sales',
    emoji: '📦',
    title: '产品销量排行榜',
    difficulty: '初级',
    difficultyColor: 'green',
    desc: '统计各产品的销售数量和金额，按销量/销售额降序排名，找出明星产品和滞销品。',
    tags: ['SUMIF', 'RANK', 'LARGE', '排名', '产品', '销量'],
    columns: [
      { col: 'A', name: '订单号', eg: 'ORD001' },
      { col: 'B', name: '产品名', eg: 'SKU001' },
      { col: 'C', name: '数量',   eg: '50' },
      { col: 'D', name: '金额',   eg: '5000' },
    ],
    formulas: [
      {
        label: '汇总某产品总销量',
        formula: '=SUMIF(B:B,"SKU001",C:C)',
        explain: '在 B 列找 "SKU001"，对应的 C 列数量求和',
      },
      {
        label: '产品按销售额排名',
        formula: '=RANK(汇总表!B2,汇总表!B:B,0)',
        explain: '在汇总表中对各产品销售额降序排名，0=降序（销售额大的排前面）',
      },
      {
        label: '找出销售额第1名产品',
        formula: '=XLOOKUP(LARGE(汇总表!B:B,1),汇总表!B:B,汇总表!A:A)',
        explain: 'LARGE取最大销售额，XLOOKUP反查对应产品名称',
      },
      {
        label: 'Top5产品销售额占比',
        formula: '=SUMPRODUCT(LARGE(汇总表!B2:B100,ROW(INDIRECT("1:5"))))/SUM(汇总表!B2:B100)',
        explain: '取前5大销售额之和除以总销售额，得到Top5占比',
      },
    ],
    tips: [
      '建议先用数据透视表汇总各产品总销量，再对汇总结果排名',
      '排名考虑同分情况：RANK 默认并列时名次相同，下一名次跳过（如1,2,2,4）',
      '找滞销品：=SMALL(汇总表!B:B,1) 找最小销售额，再 XLOOKUP 反查产品名',
    ],
  },

  {
    id: 'region-comparison',
    category: 'sales',
    emoji: '🗺️',
    title: '区域销售对比分析',
    difficulty: '中级',
    difficultyColor: 'amber',
    desc: '按区域汇总各地销售额，计算各区域占比、环比变化和完成率，支持多维度对比。',
    tags: ['SUMIFS', '区域', '对比', '完成率', '占比'],
    columns: [
      { col: 'A', name: '区域', eg: '华东' },
      { col: 'B', name: '日期', eg: '2024-03-01' },
      { col: 'C', name: '销售额', eg: '85000' },
      { col: 'D', name: '目标额', eg: '100000' },
    ],
    formulas: [
      {
        label: '某区域本月销售额',
        formula: '=SUMIFS(C:C,A:A,"华东",B:B,">="&DATE(2024,3,1),B:B,"<"&DATE(2024,4,1))',
        explain: '同时按区域和日期范围两个条件筛选求和',
      },
      {
        label: '本月目标完成率',
        formula: '=SUMIFS(C:C,A:A,"华东",...)/SUMIFS(D:D,A:A,"华东",...)',
        explain: '实际销售额除以目标额，结果设为百分比格式',
      },
      {
        label: '各区域环比增长率',
        formula: '=(本月额-上月额)/ABS(上月额)',
        explain: '本月和上月用 SUMIFS 分别汇总该区域的数据，再计算增长率',
      },
      {
        label: '排名靠后的区域（后3名）',
        formula: '=XLOOKUP(SMALL(汇总!B:B,1),汇总!B:B,汇总!A:A)',
        explain: '在各区域汇总表中找销售额最低的区域名称',
      },
    ],
    tips: [
      '区域名称要统一，"华东区"和"华东"是不同的值，录入时建议用下拉菜单',
      '完成率>100%说明超额，建议用条件格式：>120%绿色，80-120%黄色，<80%红色',
      '多维度（区域+产品+时间）交叉分析用数据透视表比公式更灵活',
    ],
  },

  {
    id: 'profit-analysis',
    category: 'sales',
    emoji: '💵',
    title: '毛利率与利润分析',
    difficulty: '初级',
    difficultyColor: 'green',
    desc: '计算产品或订单的毛利、毛利率，找出利润贡献最高的产品，用于定价优化和产品结构调整。',
    tags: ['毛利', '利润', '毛利率', '定价', '成本', '分析'],
    columns: [
      { col: 'A', name: '产品', eg: 'SKU001' },
      { col: 'B', name: '售价', eg: '299' },
      { col: 'C', name: '成本', eg: '180' },
      { col: 'D', name: '销量', eg: '500' },
      { col: 'E', name: '毛利率', eg: '（公式列）' },
      { col: 'F', name: '总毛利', eg: '（公式列）' },
    ],
    formulas: [
      {
        label: '毛利率',
        formula: '=(B2-C2)/B2',
        explain: '（售价-成本）÷售价，结果设为百分比格式，如39.8%',
      },
      {
        label: '单品总毛利',
        formula: '=(B2-C2)*D2',
        explain: '每件毛利×销量=总毛利贡献额',
      },
      {
        label: '整体加权平均毛利率',
        formula: '=SUMPRODUCT((B2:B100-C2:C100)*D2:D100)/SUMPRODUCT(B2:B100*D2:D100)',
        explain: '各产品毛利额之和除以总销售额，得到整体毛利率（比简单平均更准确）',
      },
      {
        label: '毛利率低于20%的产品数',
        formula: '=COUNTIF(E:E,"<20%")',
        explain: '统计毛利率低于阈值的产品，用于识别亏损或低利润品',
      },
    ],
    tips: [
      '毛利率=(售价-成本)/售价；成本利润率=(售价-成本)/成本，两者分母不同，别混淆',
      '毛利不等于净利润，还需扣除管理费用、销售费用等',
      '毛利率结合销量做象限分析：高毛利高销量是明星产品，低毛利低销量是考虑淘汰的产品',
    ],
  },

]
