/**
 * 公式数据定义
 * template 中使用 {参数名} 作为占位符
 */

export const FORMULA_CATEGORIES = [
  { id: 'all',         label: '全部',    emoji: '📋' },
  { id: 'lookup',      label: '查找引用', emoji: '🔍' },
  { id: 'conditional', label: '条件判断', emoji: '⚖️' },
  { id: 'stats',       label: '统计求和', emoji: '📊' },
  { id: 'text',        label: '文本处理', emoji: '✏️' },
  { id: 'date',        label: '日期时间', emoji: '📅' },
  { id: 'math',        label: '数学计算', emoji: '🔢' },
]

export const formulas = [

  // ══════════════════════════════════════════════════
  // 查找与引用
  // ══════════════════════════════════════════════════
  {
    id: 'xlookup',
    name: 'XLOOKUP精准查找',
    category: 'lookup',
    desc: 'VLOOKUP升级版，支持左向查找、任意列返回、找不到时自定义提示',
    tags: ['查找', '匹配', 'xlookup', '查询', '升级版', '反向', '容错', '左向'],
    usageCount: 11000,
    type: 'standard',
    params: [
      { name: '查找值', placeholder: 'A2', hint: '要查找的值或单元格，如 A2' },
      { name: '查找列', placeholder: 'B:B', hint: '在哪列中查找，如 B:B' },
      { name: '返回列', placeholder: 'C:C', hint: '找到后返回哪列的值，如 C:C' },
      { name: '未找到时返回', placeholder: '"未录入"', hint: '找不到时显示内容，如 "未录入" 或 ""（可留空不填）', default: '"未录入"' },
    ],
    template: '=XLOOKUP({查找值},{查找列},{返回列},{未找到时返回})',
  },
  {
    id: 'vlookup',
    name: 'VLOOKUP查询',
    category: 'lookup',
    desc: '纵向查找，在表格首列查找值，返回同行对应列数据',
    tags: ['查找', '匹配', '查询', 'vlookup', '纵向', '对应', '数据'],
    usageCount: 12000,
    type: 'standard',
    params: [
      { name: '查找值', placeholder: 'A2', hint: '要查找的值或单元格，如 A2' },
      { name: '查找区域', placeholder: 'B:D', hint: '包含查找列的整个数据范围，如 B:D' },
      { name: '返回列数', placeholder: '2', hint: '在查找区域中，返回第几列的数据' },
      { name: '匹配类型', placeholder: '0', hint: '0=精确匹配（推荐），1=近似匹配', default: '0' },
    ],
    template: '=VLOOKUP({查找值},{查找区域},{返回列数},{匹配类型})',
  },
  {
    id: 'index-match',
    name: 'INDEX+MATCH灵活查找',
    category: 'lookup',
    desc: '比VLOOKUP更灵活，支持左向查找和多列查找，不受列顺序限制',
    tags: ['查找', '匹配', 'index', 'match', '灵活', '反向', '左向'],
    usageCount: 5800,
    type: 'standard',
    params: [
      { name: '返回数据列', placeholder: 'B:B', hint: '要返回数据所在的列，如 B:B' },
      { name: '查找值', placeholder: 'D2', hint: '要查找的值或单元格' },
      { name: '查找列', placeholder: 'A:A', hint: '在此列中查找对应值，如 A:A' },
    ],
    template: '=INDEX({返回数据列},MATCH({查找值},{查找列},0))',
  },

  // ══════════════════════════════════════════════════
  // 条件判断
  // ══════════════════════════════════════════════════
  {
    id: 'if',
    name: '条件判断IF',
    category: 'conditional',
    desc: '根据条件判断返回不同结果，支持真/假两种情况',
    tags: ['条件', '判断', 'if', '逻辑', '真假', '是否'],
    usageCount: 9800,
    type: 'standard',
    params: [
      { name: '判断条件', placeholder: 'A2>100', hint: '判断的条件表达式，如 A2>100' },
      { name: '条件为真返回', placeholder: '"达标"', hint: '条件成立时返回的值' },
      { name: '条件为假返回', placeholder: '"未达标"', hint: '条件不成立时返回的值' },
    ],
    template: '=IF({判断条件},{条件为真返回},{条件为假返回})',
  },
  {
    id: 'iferror',
    name: '错误处理IFERROR',
    category: 'conditional',
    desc: '公式报错时返回指定内容，避免显示 #N/A、#VALUE 等错误',
    tags: ['错误', '处理', 'iferror', '容错', '异常', 'na', 'value'],
    usageCount: 5100,
    type: 'standard',
    params: [
      { name: '公式', placeholder: 'VLOOKUP(A2,B:C,2,0)', hint: '要执行的公式（不含=号）' },
      { name: '错误时返回', placeholder: '"-"', hint: '出错时显示的内容，如 "-" 或 ""' },
    ],
    template: '=IFERROR({公式},{错误时返回})',
  },
  {
    id: 'and',
    name: '多条件同时满足AND',
    category: 'conditional',
    desc: '判断多个条件是否同时成立，全部为真才返回TRUE，常与IF嵌套使用',
    tags: ['and', '且', '同时', '全部', '条件', '逻辑'],
    usageCount: 4400,
    type: 'standard',
    params: [
      { name: '条件1', placeholder: 'A2>0', hint: '第一个条件，如 A2>0' },
      { name: '条件2', placeholder: 'B2="完成"', hint: '第二个条件，如 B2="完成"' },
      { name: '条件3', placeholder: 'C2<100', hint: '第三个条件（可选，可留空）' },
    ],
    template: '=AND({条件1},{条件2},{条件3})',
  },
  {
    id: 'or',
    name: '任一条件满足OR',
    category: 'conditional',
    desc: '判断多个条件中是否有任一成立，有一个为真即返回TRUE',
    tags: ['or', '或', '任一', '条件', '逻辑'],
    usageCount: 3300,
    type: 'standard',
    params: [
      { name: '条件1', placeholder: 'A2="销售部"', hint: '第一个条件' },
      { name: '条件2', placeholder: 'A2="市场部"', hint: '第二个条件' },
      { name: '条件3', placeholder: 'A2="运营部"', hint: '第三个条件（可选）' },
    ],
    template: '=OR({条件1},{条件2},{条件3})',
  },

  // ══════════════════════════════════════════════════
  // 统计与求和
  // ══════════════════════════════════════════════════
  {
    id: 'sumif',
    name: '条件求和SUMIF',
    category: 'stats',
    desc: '对满足单个条件的单元格进行求和',
    tags: ['求和', '条件', 'sumif', '汇总', '合计', '按条件'],
    usageCount: 7500,
    type: 'standard',
    params: [
      { name: '条件区域', placeholder: 'A:A', hint: '用于判断条件的列，如 A:A' },
      { name: '条件', placeholder: '"销售部"', hint: '筛选条件，文本需加引号，如 "销售部"' },
      { name: '求和区域', placeholder: 'B:B', hint: '实际要求和的列，如 B:B' },
    ],
    template: '=SUMIF({条件区域},{条件},{求和区域})',
  },
  {
    id: 'countif',
    name: '条件计数COUNTIF',
    category: 'stats',
    desc: '统计满足单个条件的单元格个数',
    tags: ['计数', '条件', 'countif', '统计', '个数', '数量'],
    usageCount: 6200,
    type: 'standard',
    params: [
      { name: '统计区域', placeholder: 'A:A', hint: '要统计的区域，如 A:A' },
      { name: '条件', placeholder: '"完成"', hint: '筛选条件，文本需加引号，如 "完成"' },
    ],
    template: '=COUNTIF({统计区域},{条件})',
  },
  {
    id: 'averageif',
    name: '条件平均值AVERAGEIF',
    category: 'stats',
    desc: '计算满足单个条件的单元格的平均值',
    tags: ['平均', '条件', 'averageif', '均值', '平均分', '平均数'],
    usageCount: 3600,
    type: 'standard',
    params: [
      { name: '条件区域', placeholder: 'A:A', hint: '用于判断条件的列，如 A:A' },
      { name: '条件', placeholder: '"销售部"', hint: '筛选条件，文本需加引号，如 "销售部"' },
      { name: '平均值区域', placeholder: 'B:B', hint: '要计算平均值的列，如 B:B（不填默认用条件区域）' },
    ],
    template: '=AVERAGEIF({条件区域},{条件},{平均值区域})',
  },
  {
    id: 'averageifs',
    name: '多条件平均值AVERAGEIFS',
    category: 'stats',
    desc: '计算同时满足多个条件的单元格的平均值',
    tags: ['平均', '多条件', 'averageifs', '均值', '筛选'],
    usageCount: 2800,
    type: 'standard',
    params: [
      { name: '平均值区域', placeholder: 'C:C', hint: '要计算平均值的数值列，如 C:C' },
      { name: '条件1区域', placeholder: 'A:A', hint: '第一个条件所在列' },
      { name: '条件1值', placeholder: '"销售部"', hint: '第一个条件值，文本加引号' },
      { name: '条件2区域', placeholder: 'B:B', hint: '第二个条件所在列' },
      { name: '条件2值', placeholder: '"完成"', hint: '第二个条件值，文本加引号' },
    ],
    template: '=AVERAGEIFS({平均值区域},{条件1区域},{条件1值},{条件2区域},{条件2值})',
  },
  {
    id: 'maxifs',
    name: '条件最大值MAXIFS',
    category: 'stats',
    desc: '返回满足条件的单元格中的最大值，如某部门最高销售额',
    tags: ['最大值', '条件', 'maxifs', '最高', '最多', '极值'],
    usageCount: 3100,
    type: 'standard',
    params: [
      { name: '数值区域', placeholder: 'C:C', hint: '要取最大值的数值列，如 C:C' },
      { name: '条件区域', placeholder: 'A:A', hint: '用于筛选的条件列，如 A:A' },
      { name: '条件值', placeholder: '"销售部"', hint: '筛选条件，文本加引号，如 "销售部"' },
    ],
    template: '=MAXIFS({数值区域},{条件区域},{条件值})',
  },
  {
    id: 'minifs',
    name: '条件最小值MINIFS',
    category: 'stats',
    desc: '返回满足条件的单元格中的最小值，如某仓库最低库存',
    tags: ['最小值', '条件', 'minifs', '最低', '最少', '极值'],
    usageCount: 2600,
    type: 'standard',
    params: [
      { name: '数值区域', placeholder: 'C:C', hint: '要取最小值的数值列，如 C:C' },
      { name: '条件区域', placeholder: 'A:A', hint: '用于筛选的条件列，如 A:A' },
      { name: '条件值', placeholder: '"北京仓"', hint: '筛选条件，文本加引号，如 "北京仓"' },
    ],
    template: '=MINIFS({数值区域},{条件区域},{条件值})',
  },
  {
    id: 'sumproduct',
    name: '多条件求和SUMPRODUCT',
    category: 'stats',
    desc: '支持多条件筛选后求和，功能比SUMIF更强大，兼容性更好',
    tags: ['求和', '多条件', 'sumproduct', '数组', '汇总', '多列'],
    usageCount: 4100,
    type: 'standard',
    params: [
      { name: '条件1区域', placeholder: 'A:A', hint: '第一个条件所在列，如 A:A' },
      { name: '条件1值', placeholder: '"销售部"', hint: '第一个条件值，文本需加引号' },
      { name: '条件2区域', placeholder: 'B:B', hint: '第二个条件所在列，如 B:B' },
      { name: '条件2值', placeholder: '"完成"', hint: '第二个条件值，文本需加引号' },
      { name: '求和区域', placeholder: 'C:C', hint: '实际要求和的数值列' },
    ],
    template: '=SUMPRODUCT(({条件1区域}={条件1值})*({条件2区域}={条件2值})*{求和区域})',
  },
  {
    id: 'rank',
    name: '排名RANK',
    category: 'stats',
    desc: '返回数值在一组数据中的排名位次',
    tags: ['排名', 'rank', '排序', '名次', '第几名'],
    usageCount: 3500,
    type: 'standard',
    params: [
      { name: '排名数值', placeholder: 'B2', hint: '要排名的单元格' },
      { name: '数值范围', placeholder: '$B$2:$B$100', hint: '整体排名范围，建议用绝对引用 $B$2:$B$100' },
      { name: '排序方式', placeholder: '0', hint: '0=降序（大→小），1=升序（小→大）', default: '0' },
    ],
    template: '=RANK({排名数值},{数值范围},{排序方式})',
  },

  // ══════════════════════════════════════════════════
  // 文本处理
  // ══════════════════════════════════════════════════
  {
    id: 'left',
    name: '提取左侧文本LEFT',
    category: 'text',
    desc: '从文本左侧提取指定数量的字符',
    tags: ['文本', '提取', 'left', '左侧', '截取', '字符', '字符串'],
    usageCount: 8900,
    type: 'standard',
    params: [
      { name: '文本', placeholder: 'A2', hint: '要提取的文本或单元格，如 A2' },
      { name: '字符数', placeholder: '3', hint: '从左侧提取几个字符' },
    ],
    template: '=LEFT({文本},{字符数})',
  },
  {
    id: 'mid',
    name: '提取中间文本MID',
    category: 'text',
    desc: '从文本中间指定位置开始提取字符',
    tags: ['文本', '提取', 'mid', '中间', '截取', '字符', '字符串'],
    usageCount: 6800,
    type: 'standard',
    params: [
      { name: '文本', placeholder: 'A2', hint: '要提取的文本或单元格，如 A2' },
      { name: '开始位置', placeholder: '2', hint: '从第几个字符开始提取（从1计数）' },
      { name: '字符数', placeholder: '3', hint: '提取几个字符' },
    ],
    template: '=MID({文本},{开始位置},{字符数})',
  },
  {
    id: 'right',
    name: '提取右侧文本RIGHT',
    category: 'text',
    desc: '从文本右侧提取指定数量的字符',
    tags: ['文本', '提取', 'right', '右侧', '截取', '字符', '字符串'],
    usageCount: 5500,
    type: 'standard',
    params: [
      { name: '文本', placeholder: 'A2', hint: '要提取的文本或单元格，如 A2' },
      { name: '字符数', placeholder: '3', hint: '从右侧提取几个字符' },
    ],
    template: '=RIGHT({文本},{字符数})',
  },
  {
    id: 'textbefore',
    name: '提取分隔符前TEXTBEFORE',
    category: 'text',
    desc: '提取某个分隔符之前的文本，比 LEFT+FIND 简洁得多，如从"张三_销售部"中取"张三"',
    tags: ['提取', 'textbefore', '分隔符', '前缀', '文本', '截取', '下划线'],
    usageCount: 4800,
    type: 'standard',
    params: [
      { name: '文本', placeholder: 'A2', hint: '要处理的文本或单元格，如 A2' },
      { name: '分隔符', placeholder: '"_"', hint: '以什么为分界，如 "_"、"-"、"/"' },
      { name: '第几个分隔符', placeholder: '1', hint: '取第几个分隔符前的内容，默认 1（第一个）', default: '1' },
    ],
    template: '=TEXTBEFORE({文本},{分隔符},{第几个分隔符})',
  },
  {
    id: 'textafter',
    name: '提取分隔符后TEXTAFTER',
    category: 'text',
    desc: '提取某个分隔符之后的文本，如从"P001-上海仓"中取"上海仓"',
    tags: ['提取', 'textafter', '分隔符', '后缀', '文本', '截取', '下划线'],
    usageCount: 4500,
    type: 'standard',
    params: [
      { name: '文本', placeholder: 'A2', hint: '要处理的文本或单元格，如 A2' },
      { name: '分隔符', placeholder: '"-"', hint: '以什么为分界，如 "-"、"_"、"/"' },
      { name: '第几个分隔符', placeholder: '1', hint: '取第几个分隔符后的内容，默认 1；填 -1 则从最后一个开始', default: '1' },
    ],
    template: '=TEXTAFTER({文本},{分隔符},{第几个分隔符})',
  },
  {
    id: 'substitute',
    name: '替换文本SUBSTITUTE',
    category: 'text',
    desc: '将文本中的指定内容替换为新内容，支持批量替换',
    tags: ['替换', 'substitute', '文本', '修改', '批量', '清理'],
    usageCount: 4300,
    type: 'standard',
    params: [
      { name: '文本', placeholder: 'A2', hint: '要处理的文本或单元格' },
      { name: '旧文本', placeholder: '"-"', hint: '要被替换掉的内容，如 "-"' },
      { name: '新文本', placeholder: '""', hint: '替换成什么，删除则填 ""' },
    ],
    template: '=SUBSTITUTE({文本},{旧文本},{新文本})',
  },
  {
    id: 'find',
    name: '查找字符位置FIND',
    category: 'text',
    desc: '返回某字符/字符串在文本中第一次出现的位置，区分大小写',
    tags: ['查找', 'find', '位置', '文本', '字符', '定位'],
    usageCount: 3400,
    type: 'standard',
    params: [
      { name: '查找内容', placeholder: '"-"', hint: '要查找的字符或字符串，如 "-"' },
      { name: '文本', placeholder: 'A2', hint: '在哪个文本或单元格中查找' },
      { name: '开始位置', placeholder: '1', hint: '从第几个字符开始查找，默认填 1', default: '1' },
    ],
    template: '=FIND({查找内容},{文本},{开始位置})',
  },
  {
    id: 'textjoin',
    name: '按分隔符合并TEXTJOIN',
    category: 'text',
    desc: '用指定分隔符将多个单元格内容合并，可自动跳过空格',
    tags: ['合并', 'textjoin', '文本', '拼接', '分隔符', '连接', '合并多行'],
    usageCount: 3800,
    type: 'standard',
    params: [
      { name: '分隔符', placeholder: '"、"', hint: '每段内容之间的分隔符，如 "、" 或 ","' },
      { name: '忽略空值', placeholder: 'TRUE', hint: 'TRUE=跳过空单元格，FALSE=保留空格', default: 'TRUE' },
      { name: '文本范围', placeholder: 'A2:A10', hint: '要合并的单元格区域，如 A2:A10' },
    ],
    template: '=TEXTJOIN({分隔符},{忽略空值},{文本范围})',
  },
  {
    id: 'text',
    name: '数值格式化TEXT',
    category: 'text',
    desc: '将数值按指定格式转换为文本，支持日期、百分比、货币等格式',
    tags: ['格式', '文本', 'text', '日期', '数字', '转换', '格式化', '百分比'],
    usageCount: 4200,
    type: 'standard',
    params: [
      { name: '数值', placeholder: 'A2', hint: '要格式化的数值或单元格' },
      { name: '格式代码', placeholder: '"YYYY-MM-DD"', hint: '格式代码，如 "YYYY-MM-DD"、"0.00%"、"¥#,##0.00"' },
    ],
    template: '=TEXT({数值},{格式代码})',
  },
  {
    id: 'concat',
    name: '文本拼接CONCAT',
    category: 'text',
    desc: '将多个文本或单元格内容合并为一个字符串',
    tags: ['拼接', '合并', 'concat', '文本', '连接', '组合'],
    usageCount: 4600,
    type: 'standard',
    params: [
      { name: '文本1', placeholder: 'A2', hint: '第一段文本或单元格' },
      { name: '文本2', placeholder: '"年"', hint: '第二段文本，直接写文字需加引号' },
      { name: '文本3', placeholder: 'B2', hint: '第三段文本或单元格（可选）' },
    ],
    template: '=CONCAT({文本1},{文本2},{文本3})',
  },
  {
    id: 'len',
    name: '计算文本长度LEN',
    category: 'text',
    desc: '返回文本字符串的字符数（中英文均计1个）',
    tags: ['文本', '长度', 'len', '字符', '个数', '字数'],
    usageCount: 3800,
    type: 'standard',
    params: [
      { name: '文本', placeholder: 'A2', hint: '要计算长度的文本或单元格' },
    ],
    template: '=LEN({文本})',
  },
  {
    id: 'trim',
    name: '去除多余空格TRIM',
    category: 'text',
    desc: '删除文本首尾空格，并将中间连续空格合并为一个',
    tags: ['空格', '清理', 'trim', '文本', '去除', '整理'],
    usageCount: 3200,
    type: 'standard',
    params: [
      { name: '文本', placeholder: 'A2', hint: '要去除空格的文本或单元格' },
    ],
    template: '=TRIM({文本})',
  },

  // ══════════════════════════════════════════════════
  // 日期与时间
  // ══════════════════════════════════════════════════
  {
    id: 'datedif',
    name: '计算日期间隔DATEDIF',
    category: 'date',
    desc: '计算两个日期之间的年数、月数或天数差，常用于计算工龄、账龄',
    tags: ['日期', '间隔', 'datedif', '时间', '天数', '年龄', '工龄', '月份'],
    usageCount: 3100,
    type: 'standard',
    params: [
      { name: '开始日期', placeholder: 'A2', hint: '起始日期所在单元格' },
      { name: '结束日期', placeholder: 'TODAY()', hint: '结束日期，可用 TODAY() 表示今天', default: 'TODAY()' },
      { name: '计算单位', placeholder: '"Y"', hint: '"Y"=整年数，"M"=整月数，"D"=天数，"YM"=不足整年的月数' },
    ],
    template: '=DATEDIF({开始日期},{结束日期},{计算单位})',
  },
  {
    id: 'networkdays',
    name: '计算工作日天数NETWORKDAYS',
    category: 'date',
    desc: '计算两个日期间的工作日天数（自动排除周末），可额外指定节假日',
    tags: ['工作日', '天数', 'networkdays', '日期', '排除', '周末', '假日'],
    usageCount: 2700,
    type: 'standard',
    params: [
      { name: '开始日期', placeholder: 'A2', hint: '起始日期所在单元格' },
      { name: '结束日期', placeholder: 'B2', hint: '结束日期所在单元格' },
      { name: '节假日区域', placeholder: 'D2:D10', hint: '额外节假日列表区域（可选，不填则只排除周末）' },
    ],
    template: '=NETWORKDAYS({开始日期},{结束日期},{节假日区域})',
  },
  {
    id: 'eomonth',
    name: '获取月末日期EOMONTH',
    category: 'date',
    desc: '返回指定月份最后一天的日期，常用于账期计算、月末结算',
    tags: ['月末', 'eomonth', '日期', '月份', '最后一天', '账期', '结算'],
    usageCount: 2400,
    type: 'standard',
    params: [
      { name: '开始日期', placeholder: 'A2', hint: '参考日期所在单元格' },
      { name: '月份偏移', placeholder: '0', hint: '0=当月末，1=下月末，-1=上月末', default: '0' },
    ],
    template: '=EOMONTH({开始日期},{月份偏移})',
  },
  {
    id: 'year-month-day',
    name: '提取年月日YEAR/MONTH/DAY',
    category: 'date',
    desc: '从日期中分别提取年份、月份或日，常用于按年/月分组统计',
    tags: ['年', '月', '日', 'year', 'month', 'day', '提取', '日期', '分组'],
    usageCount: 3900,
    type: 'standard',
    params: [
      { name: '函数', placeholder: 'YEAR', hint: 'YEAR=提取年份，MONTH=提取月份，DAY=提取日', default: 'YEAR' },
      { name: '日期', placeholder: 'A2', hint: '日期所在单元格，如 A2' },
    ],
    template: '={函数}({日期})',
  },

  // ══════════════════════════════════════════════════
  // 数学计算
  // ══════════════════════════════════════════════════
  {
    id: 'round',
    name: '四舍五入ROUND',
    category: 'math',
    desc: '将数值四舍五入到指定小数位数',
    tags: ['四舍五入', 'round', '小数', '保留', '精度', '取整'],
    usageCount: 5600,
    type: 'standard',
    params: [
      { name: '数值', placeholder: 'A2', hint: '要四舍五入的数值或单元格' },
      { name: '小数位数', placeholder: '2', hint: '保留几位小数，0=取整，2=保留两位小数' },
    ],
    template: '=ROUND({数值},{小数位数})',
  },
  {
    id: 'roundup',
    name: '向上取整ROUNDUP',
    category: 'math',
    desc: '无论尾数大小，一律向上进位到指定小数位',
    tags: ['向上取整', 'roundup', '进位', '小数', '天花板'],
    usageCount: 2900,
    type: 'standard',
    params: [
      { name: '数值', placeholder: 'A2', hint: '要向上取整的数值或单元格' },
      { name: '小数位数', placeholder: '0', hint: '保留几位小数，0=取整到个位' },
    ],
    template: '=ROUNDUP({数值},{小数位数})',
  },
  {
    id: 'rounddown',
    name: '向下取整ROUNDDOWN',
    category: 'math',
    desc: '无论尾数大小，一律向下截断到指定小数位',
    tags: ['向下取整', 'rounddown', '截断', '小数', '地板'],
    usageCount: 2700,
    type: 'standard',
    params: [
      { name: '数值', placeholder: 'A2', hint: '要向下取整的数值或单元格' },
      { name: '小数位数', placeholder: '0', hint: '保留几位小数，0=直接截断到整数' },
    ],
    template: '=ROUNDDOWN({数值},{小数位数})',
  },
  {
    id: 'mod',
    name: '取余数MOD',
    category: 'math',
    desc: '返回两数相除后的余数，常用于判断奇偶、按周期分组',
    tags: ['余数', 'mod', '取余', '奇偶', '周期', '循环'],
    usageCount: 2300,
    type: 'standard',
    params: [
      { name: '被除数', placeholder: 'A2', hint: '被除的数值或单元格' },
      { name: '除数', placeholder: '2', hint: '除以几，如 2（判断奇偶）' },
    ],
    template: '=MOD({被除数},{除数})',
  },
  {
    id: 'abs',
    name: '绝对值ABS',
    category: 'math',
    desc: '返回数值的绝对值（去掉正负号），常用于计算差异/偏差',
    tags: ['绝对值', 'abs', '正数', '差异', '偏差'],
    usageCount: 2100,
    type: 'standard',
    params: [
      { name: '数值', placeholder: 'A2', hint: '要取绝对值的数值或单元格' },
    ],
    template: '=ABS({数值})',
  },
]

// ─── 类型处理 ────────────────────────────────────────────────

export function applyType(value, type) {
  if (!value || !value.trim()) return value
  if (type === 'text') {
    const v = value.trim()
    return v.startsWith('"') ? v : `"${v}"`
  }
  return value
}

export function needsTypeConfirm(value) {
  if (!value || value.trim() === '') return false
  const v = value.trim()
  if (/^-?\d+(\.\d+)?%?$/.test(v)) return false
  if (v === 'TRUE' || v === 'FALSE') return false
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return false
  if (v.startsWith('=')) return false
  if (/^[$A-Za-z][\w$:().+\-*/]*$/.test(v)) return false
  return true
}

// ─── 标准公式生成 ─────────────────────────────────────────────

export function generateStandardFormula(template, params, values) {
  let result = template
  params.forEach(param => {
    const value = (values[param.name] || '').trim()
    const display = value || `[${param.name}]`
    result = result.replaceAll(`{${param.name}}`, display)
  })
  return result
}

// ─── 组合公式生成（5种模式）─────────────────────────────────

export function generateCascadeFormula(conditions, defaultResult, defaultType) {
  const parts = []
  for (const c of conditions) {
    const left = (c.left || '').trim() || '[判断区域]'
    const right = applyType((c.right || '').trim(), c.rightType) || '[阈值]'
    const result = applyType((c.result || '').trim(), c.resultType) || '[返回值]'
    parts.push(`${left}${c.operator}${right}`, result)
  }
  parts.push('TRUE', applyType((defaultResult || '').trim(), defaultType) || '[兜底值]')
  return `=IFS(${parts.join(',')})`
}

export function generateIntervalFormula(baseCell, conditions, defaultResult, defaultType) {
  const cell = (baseCell || '').trim() || '[判断单元格]'
  const parts = []
  for (const c of conditions) {
    const b1 = (c.bound1 || '').trim() || '[下限]'
    const result = applyType((c.result || '').trim(), c.resultType) || '[返回值]'
    const condStr = (c.bound2 || '').trim()
      ? `AND(${cell}${c.op1}${b1},${cell}${c.op2}${c.bound2.trim()})`
      : `${cell}${c.op1}${b1}`
    parts.push(condStr, result)
  }
  parts.push('TRUE', applyType((defaultResult || '').trim(), defaultType) || '[兜底值]')
  return `=IFS(${parts.join(',')})`
}

export function generateSwitchFormula(target, conditions, defaultResult, defaultType) {
  const t = (target || '').trim() || '[匹配目标]'
  const parts = [t]
  for (const c of conditions) {
    parts.push(applyType((c.matchValue || '').trim(), c.matchType) || '[匹配值]')
    parts.push(applyType((c.result || '').trim(), c.resultType) || '[返回值]')
  }
  parts.push(applyType((defaultResult || '').trim(), defaultType) || '[默认值]')
  return `=SWITCH(${parts.join(',')})`
}

export function generateSumifsFormula(sumRange, conditions) {
  const sr = (sumRange || '').trim() || '[求和数值列]'
  const parts = [sr]
  for (const c of conditions) {
    parts.push((c.criteriaRange || '').trim() || '[条件列]')
    parts.push((c.criteriaValue || '').trim() || '[条件值]')
  }
  return `=SUMIFS(${parts.join(',')})`
}

export function generateCountifsFormula(conditions) {
  const parts = []
  for (const c of conditions) {
    parts.push((c.criteriaRange || '').trim() || '[条件列]')
    parts.push((c.criteriaValue || '').trim() || '[条件值]')
  }
  return `=COUNTIFS(${parts.join(',')})`
}
