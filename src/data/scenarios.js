/**
 * 场景公式库 — 真实业务场景 + 开箱即用公式方案
 */

export const SCENARIO_CATEGORIES = [
  { id: 'all',      label: '全部' },
  { id: 'query',    label: '查询统计' },
  { id: 'analysis', label: '数据分析' },
  { id: 'date',     label: '日期计算' },
  { id: 'text',     label: '文本处理' },
]

export const scenarios = [
  // ────────────────────────────────────────────────────────
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
      { col: 'G', name: '查询：产品ID',   eg: 'P001'  },
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

  // ────────────────────────────────────────────────────────
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
        label: '周同比增长率',
        formula: '=(C2-B2)/ABS(B2)',
        explain: '公式相同，B2 换成上周同期值，C2 换成本周值即可',
      },
      {
        label: '格式化为百分比显示',
        formula: '=TEXT((C2-B2)/ABS(B2),"0.00%")',
        explain: '直接输出带 % 号的文本，如 "+8.24%"。注意：结果是文本，不能再参与计算',
      },
    ],
    tips: [
      '将单元格格式设为"百分比"，公式 =(C2-B2)/ABS(B2) 会自动显示为百分比，无需用 TEXT',
      '当基数（昨日值）为 0 时，公式会报 #DIV/0! 错误，用 =IFERROR((C2-B2)/ABS(B2),"-") 包裹容错',
      '月环比、年同比原理相同，只需把对应时间段的数据放入 B、C 列',
    ],
  },

  // ────────────────────────────────────────────────────────
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
        explain: '≥5万→20%，≥2万→15%，≥1万→10%，其他→5%。IFS 从上到下优先匹配，修改数字即可调整档位',
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

  // ────────────────────────────────────────────────────────
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

  // ────────────────────────────────────────────────────────
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

  // ────────────────────────────────────────────────────────
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
        explain: 'COUNTIF 计算每个值出现的次数，1÷次数后全部相加，每个唯一值贡献恰好1，结果就是唯一值个数',
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
      '区域 A2:A100 要根据实际数据范围调整，不要选太大以免影响速度',
      '区分大小写时，"ABC" 和 "abc" 会被视为同一个值',
      '需要列出所有唯一值（而不只是计数），用 Excel 365 的 UNIQUE 函数',
    ],
  },

  // ────────────────────────────────────────────────────────
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
      '如果日期列里有时间部分（如 2024-01-01 09:30:00），比较时会按完整时间戳，建议用 INT() 去掉时间',
      '需要按月分组汇总全年数据？在辅助列用 =YEAR(B2)&"-"&TEXT(MONTH(B2),"00") 生成年月标签',
    ],
  },

  // ────────────────────────────────────────────────────────
  {
    id: 'extract-from-code',
    category: 'text',
    emoji: '✂️',
    title: '从编码中提取关键字段',
    difficulty: '中级',
    difficultyColor: 'amber',
    desc: '产品编码、单号等字段通常包含多段信息（如 "P001-20240115-SH"），用 MID+FIND 或 LEFT/RIGHT 拆分出各个部分。',
    tags: ['MID', 'FIND', 'LEFT', 'RIGHT', '文本', '拆分', '编码'],
    columns: [
      { col: 'A', name: '完整编码', eg: 'P001-20240115-SH' },
      { col: 'B', name: '产品型号', eg: 'P001  （提取第一段）' },
      { col: 'C', name: '出厂日期', eg: '20240115  （提取第二段）' },
      { col: 'D', name: '仓库代码', eg: 'SH  （提取第三段）' },
    ],
    formulas: [
      {
        label: '提取第一个"-"前的产品型号',
        formula: '=LEFT(A2,FIND("-",A2)-1)',
        explain: 'FIND 找到第一个"-"的位置，LEFT 取其左边的内容',
      },
      {
        label: '提取两个"-"之间的日期',
        formula: '=MID(A2,FIND("-",A2)+1,FIND("-",A2,FIND("-",A2)+1)-FIND("-",A2)-1)',
        explain: '找到第一个和第二个"-"的位置，MID 从中间截取。公式较长，可用辅助列分步拆分',
      },
      {
        label: '提取最后一个"-"后的仓库代码',
        formula: '=RIGHT(A2,LEN(A2)-FIND("★",SUBSTITUTE(A2,"-","★",LEN(A2)-LEN(SUBSTITUTE(A2,"-","")))))',
        explain: 'SUBSTITUTE 把最后一个"-"替换成"★"，再用 FIND 定位，RIGHT 取右侧内容',
      },
    ],
    tips: [
      'Excel 365 / WPS新版可以直接用 =TEXTBEFORE(A2,"-") 取第一段，=TEXTAFTER(A2,"-",-1) 取最后一段，比 MID+FIND 简单得多',
      '如果分隔符固定且各段长度固定（如日期固定8位），直接用 MID(A2,6,8) 更简单',
      '复杂拆分建议用辅助列分步完成，不要一个公式写到底，方便调试',
    ],
  },

  // ────────────────────────────────────────────────────────
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
]
