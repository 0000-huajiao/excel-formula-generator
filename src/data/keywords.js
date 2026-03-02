/**
 * 意图关键词库
 * 用户用自然语言描述需求时，根据关键词匹配推荐公式和场景
 *
 * intent      - 意图名称（内部标识）
 * keywords    - 触发词列表（中文分词，支持部分匹配）
 * formulaIds  - 推荐的标准公式 ID（按优先级排列）
 * scenarioIds - 推荐的场景 ID（可选）
 * tip         - 一句话推荐说明，显示在下拉结果里
 */
export const intentKeywords = [

  // ── 统计 / 计数 ──────────────────────────────────────────────
  {
    intent: '条件计数',
    keywords: ['统计', '计数', '个数', '有多少', '多少个', '数量', '几条', '几个', '多少条', '数一数', '计算数量', '统计数'],
    formulaIds: ['countif', 'countifs'],
    scenarioIds: ['unique-count'],
    tip: '单个条件用 COUNTIF，多个条件同时满足用 COUNTIFS',
  },
  {
    intent: '去重统计',
    keywords: ['去重', '唯一', '不重复', '重复', '有几种', '有几个不同', '独立', '去掉重复', '不重复的个数'],
    formulaIds: ['countif', 'sumproduct'],
    scenarioIds: ['unique-count'],
    tip: '统计不重复的值数量，用 SUMPRODUCT+COUNTIF 组合',
  },

  // ── 求和 / 汇总 ──────────────────────────────────────────────
  {
    intent: '条件求和',
    keywords: ['求和', '合计', '汇总', '加总', '总金额', '总量', '总数', '求合计', '求总', '求总量', '满足条件的合计', '条件求和', '按条件', '加起来'],
    formulaIds: ['sumif', 'sumifs', 'sumproduct'],
    scenarioIds: ['multi-condition-stock', 'date-range-sum'],
    tip: '单条件用 SUMIF，多条件同时满足用 SUMIFS',
  },
  {
    intent: '多条件汇总',
    keywords: ['多条件', '同时满足', '两个条件', '三个条件', '并且', '既要', '同时', '多维度筛选'],
    formulaIds: ['sumifs', 'countifs', 'averageifs', 'sumproduct'],
    scenarioIds: ['multi-condition-stock'],
    tip: '多个条件同时满足时，SUMIFS / COUNTIFS / AVERAGEIFS 最直接',
  },

  // ── 查找 / 匹配 ──────────────────────────────────────────────
  {
    intent: '查找匹配',
    keywords: ['查找', '查询', '找到', '对应', '匹配', '根据id', '根据编号', '对应的值', '找出', '查出', '反查', '跨表', '跨表查', '另一张表', '关联'],
    formulaIds: ['xlookup', 'vlookup', 'index-match'],
    scenarioIds: ['xlookup-with-fallback'],
    tip: 'XLOOKUP 最新最强，不受列顺序限制；旧版 Excel 用 VLOOKUP 或 INDEX+MATCH',
  },
  {
    intent: '找不到时容错',
    keywords: ['找不到', '报错', '错误', '#n/a', '#na', '#value', '空白', '显示空', '没有匹配', '未找到', '容错', '异常', '出错'],
    formulaIds: ['iferror', 'xlookup'],
    scenarioIds: ['xlookup-with-fallback'],
    tip: 'IFERROR 包裹公式可屏蔽所有错误；XLOOKUP 第四参数直接设置找不到时的返回值',
  },

  // ── 条件判断 ─────────────────────────────────────────────────
  {
    intent: '条件判断',
    keywords: ['判断', '如果', '条件', '是否', '满足', '大于', '小于', '等于', '超过', '低于', '达标', '未达标', '根据结果', '不同情况', '返回不同'],
    formulaIds: ['if', 'iferror', 'and', 'or'],
    tip: '简单两种情况用 IF；多档判断用组合公式里的 IFS 模式',
  },
  {
    intent: '多档判断阶梯',
    keywords: ['多档', '阶梯', '分档', '分级', '区间', '提成', '奖金', '档次', '几个等级', '评级', '等级', '分数段', '绩效', '优良中差'],
    formulaIds: ['if'],
    scenarioIds: ['tiered-commission'],
    tip: '多档判断推荐用"高级组合"里的 IFS级联 或 IFS区间 模式，可视化配置',
  },

  // ── 平均值 ───────────────────────────────────────────────────
  {
    intent: '条件平均',
    keywords: ['平均', '平均值', '均值', '均分', '平均分', '平均数', '算平均', '平均工资', '平均销售'],
    formulaIds: ['averageif', 'averageifs'],
    tip: '单条件平均用 AVERAGEIF，多条件用 AVERAGEIFS',
  },

  // ── 最大 / 最小 ──────────────────────────────────────────────
  {
    intent: '条件最值',
    keywords: ['最大', '最高', '最多', '最大值', '最小', '最低', '最少', '最小值', '极值', '最好', '最差', '最贵', '最便宜', '最快', '最慢'],
    formulaIds: ['maxifs', 'minifs'],
    scenarioIds: ['conditional-max-min'],
    tip: '在满足条件的数据里找最大/最小值，用 MAXIFS / MINIFS',
  },

  // ── 排名 ─────────────────────────────────────────────────────
  {
    intent: '排名',
    keywords: ['排名', '排序', '第几名', '名次', '名列', '排第几', '排行'],
    formulaIds: ['rank'],
    tip: 'RANK 函数直接返回某个数值在一组数据里的名次',
  },

  // ── 文本提取 / 拆分 ──────────────────────────────────────────
  {
    intent: '提取文本',
    keywords: ['提取', '截取', '取出', '获取', '前几个字', '后几个字', '中间', '取左边', '取右边', '开头', '结尾', '左侧', '右侧'],
    formulaIds: ['left', 'right', 'mid', 'textbefore', 'textafter'],
    tip: '从固定位置提取用 LEFT/MID/RIGHT；按分隔符提取用 TEXTBEFORE/TEXTAFTER（Excel 365）',
  },
  {
    intent: '按分隔符拆分',
    keywords: ['分隔符', '下划线', '横线', '斜杠', '拆分', '分割', '分开', '按-', '按_', '编码', '编号拆分', '分隔', '中划线', '连接符'],
    formulaIds: ['textbefore', 'textafter', 'find', 'mid'],
    scenarioIds: ['extract-from-code'],
    tip: 'Excel 365 用 TEXTBEFORE/TEXTAFTER 最简单；旧版用 LEFT+FIND 或 MID+FIND 组合',
  },

  // ── 文本处理 ─────────────────────────────────────────────────
  {
    intent: '文本替换清理',
    keywords: ['替换', '修改', '去掉', '删除', '清除', '更换', '把…改成', '空格', '去空格', '清理', '整理', '特殊字符'],
    formulaIds: ['substitute', 'trim'],
    tip: 'SUBSTITUTE 替换指定内容；TRIM 专门去除多余空格',
  },
  {
    intent: '合并拼接文本',
    keywords: ['合并', '拼接', '连接', '组合', '拼在一起', '合在一起', '拼成', '把几列合并', '文字合并', '用分隔符合并', '逗号分隔'],
    formulaIds: ['concat', 'textjoin'],
    tip: '简单拼接用 CONCAT；需要分隔符或跳过空格用 TEXTJOIN',
  },
  {
    intent: '格式化显示',
    keywords: ['格式', '格式化', '显示格式', '百分比', '货币', '¥', '保留小数', '日期格式', '转成文字', '数字格式', '格式转换'],
    formulaIds: ['text', 'round'],
    tip: 'TEXT 函数将数值转成指定格式的文字；ROUND 保留指定小数位',
  },
  {
    intent: '字符长度',
    keywords: ['长度', '字数', '几个字', '多少字', '多少个字符', '字符数', '文字长度', '几位'],
    formulaIds: ['len'],
    tip: 'LEN 函数返回文本的字符数，中英文各算1个',
  },

  // ── 数学计算 ─────────────────────────────────────────────────
  {
    intent: '四舍五入取整',
    keywords: ['四舍五入', '取整', '保留', '小数位', '精度', '近似', '向上', '向下', '进位', '截断', '整数'],
    formulaIds: ['round', 'roundup', 'rounddown'],
    tip: 'ROUND 四舍五入；ROUNDUP 强制进位；ROUNDDOWN 强制截断',
  },

  // ── 日期计算 ─────────────────────────────────────────────────
  {
    intent: '日期间隔',
    keywords: ['几天', '多少天', '天数', '间隔', '相差', '工龄', '年龄', '账龄', '入职', '到期', '到今天', '距今', '过了多久', '几年', '几个月', '多少年', '多少月'],
    formulaIds: ['datedif', 'networkdays'],
    scenarioIds: ['tenure-calculation'],
    tip: 'DATEDIF 计算年/月/天差；NETWORKDAYS 专门计算工作日天数',
  },
  {
    intent: '工作日计算',
    keywords: ['工作日', '排除周末', '上班天数', '节假日', '假日', '自然日', '营业日'],
    formulaIds: ['networkdays'],
    tip: 'NETWORKDAYS 自动排除周末，还可额外指定节假日列表',
  },
  {
    intent: '月末账期',
    keywords: ['月末', '月底', '最后一天', '账期', '结算', '下月初', '月份最后', '到期日'],
    formulaIds: ['eomonth'],
    tip: 'EOMONTH(日期, 0) 返回当月最后一天；填 1 是下月末，填 -1 是上月末',
  },
  {
    intent: '日期区间统计',
    keywords: ['某段时间', '时间段', '某月', '某季度', '日期范围', '区间统计', '按月', '按季度', '按时间', '最近30天', '这个月', '上个月'],
    formulaIds: ['sumifs', 'countifs'],
    scenarioIds: ['date-range-sum'],
    tip: 'SUMIFS/COUNTIFS 配合 ">=" 和 "<=" 条件，精确筛选日期区间内的数据',
  },

  // ── 同比环比 ─────────────────────────────────────────────────
  {
    intent: '同比环比增长',
    keywords: ['同比', '环比', '增长率', '变化率', '比上期', '比上周', '比上月', '比昨天', '涨了多少', '跌了多少', '增长了', '下降了', '周同比', '日环比', '月环比'],
    formulaIds: [],
    scenarioIds: ['growth-rate'],
    tip: '同比环比计算公式：(本期-上期)/ABS(上期)，场景库里有完整示例',
  },

  // ── 库存 ─────────────────────────────────────────────────────
  {
    intent: '库存查询',
    keywords: ['库存', '存量', '在库', '库存量', '剩余', '余量', '盘点', '库存数', '现有库存'],
    formulaIds: ['sumifs'],
    scenarioIds: ['multi-condition-stock'],
    tip: '多条件库存查询推荐用 SUMIFS，场景库里有按产品ID+批次查询的完整示例',
  },

  // ── 求和基础 ──────────────────────────────────────────────────
  {
    intent: '全部求和',
    keywords: ['全部加起来', '所有求和', '求总和', '全加', '全部合计'],
    formulaIds: ['sum', 'sumif', 'sumifs'],
    tip: '简单汇总所有数值用 SUM；按条件汇总用 SUMIF 或 SUMIFS',
  },

  // ── 计数基础 ──────────────────────────────────────────────────
  {
    intent: '计数非空',
    keywords: ['非空', '有多少行', '多少行数据', '不为空', '有值', '填了多少'],
    formulaIds: ['counta', 'countblank', 'count'],
    tip: 'COUNTA 统计非空单元格个数；COUNTBLANK 统计空白个数；COUNT 只统计数字个数',
  },

  // ── 查找位置 ──────────────────────────────────────────────────
  {
    intent: '查找位置序号',
    keywords: ['第几行', '第几位', '在哪里', '哪个位置', '找位置', '位于'],
    formulaIds: ['match', 'row', 'column'],
    tip: 'MATCH 返回查找值在区域中的相对位置；ROW/COLUMN 返回当前行/列号',
  },

  // ── 横向查找 ──────────────────────────────────────────────────
  {
    intent: '横向查找',
    keywords: ['横向', '水平查找', '按行查找', 'hlookup'],
    formulaIds: ['hlookup', 'xlookup'],
    tip: 'HLOOKUP 在表格第一行查找，返回对应行数据；推荐用 XLOOKUP 替代',
  },

  // ── 动态引用 ──────────────────────────────────────────────────
  {
    intent: '动态区域引用',
    keywords: ['动态区域', '动态引用', '间接引用', '偏移', '不同工作表', '跨表引用'],
    formulaIds: ['indirect', 'offset', 'index'],
    tip: 'INDIRECT 用文本字符串构建引用；OFFSET 从某点偏移指定行列返回区域',
  },

  // ── 去重筛选365 ───────────────────────────────────────────────
  {
    intent: '筛选去重365',
    keywords: ['筛选数据', '动态筛选', '按条件筛选', 'filter函数', '去重列表', 'unique函数'],
    formulaIds: ['filter', 'unique', 'sort'],
    tip: 'FILTER 动态筛选行；UNIQUE 返回不重复列表；SORT 排序输出（均需 Excel 365/2021+）',
  },

  // ── 是否为空 ──────────────────────────────────────────────────
  {
    intent: '判断空值',
    keywords: ['是否为空', '空白判断', '未填写', '没有填', '判断空'],
    formulaIds: ['isblank', 'if', 'iferror'],
    tip: 'ISBLANK 判断单元格是否为空，配合 IF 可实现"为空时显示..."的效果',
  },

  // ── 类型判断 ──────────────────────────────────────────────────
  {
    intent: '判断数据类型',
    keywords: ['是不是数字', '是不是文本', '类型判断', '数字还是文字', '文本格式数字'],
    formulaIds: ['isnumber', 'istext', 'iserror', 'value'],
    tip: 'ISNUMBER 判断是否为数字；ISTEXT 判断是否为文本；VALUE 可将文本数字转为真正数字',
  },

  // ── 今日日期 ──────────────────────────────────────────────────
  {
    intent: '当前日期时间',
    keywords: ['今天', '当前日期', '现在时间', '今日', '此刻', '实时日期'],
    formulaIds: ['today', 'now', 'date'],
    tip: 'TODAY() 返回今日日期；NOW() 返回当前日期+时间，每次计算自动刷新',
  },

  // ── 星期计算 ──────────────────────────────────────────────────
  {
    intent: '星期周次',
    keywords: ['星期几', '周几', '第几周', '周数', '周次', '是不是周末'],
    formulaIds: ['weekday', 'weeknum', 'isoweeknum'],
    tip: 'WEEKDAY 返回星期几（可配合IF判断周末）；WEEKNUM 返回当年第几周',
  },

  // ── 月份偏移 ──────────────────────────────────────────────────
  {
    intent: '按月偏移日期',
    keywords: ['加几个月', '减几个月', '三个月后', '半年后', '到期日期', '合同到期', '往后推'],
    formulaIds: ['edate', 'eomonth', 'date'],
    tip: 'EDATE 在日期上加减整月数；EOMONTH 返回偏移后月份的最后一天',
  },

  // ── 幂次方根 ──────────────────────────────────────────────────
  {
    intent: '幂方根对数',
    keywords: ['平方', '开方', '根号', '次方', '幂', '平方根', '对数', '指数增长'],
    formulaIds: ['power', 'sqrt', 'log', 'ln', 'exp'],
    tip: 'POWER 计算幂；SQRT 开平方根；LOG 求对数；LN 求自然对数；EXP 求 e 的幂',
  },

  // ── 随机数 ──────────────────────────────────────────────────
  {
    intent: '生成随机数',
    keywords: ['随机', '乱数', '随机整数', '抽奖', '抽签', '随机生成', '测试数据'],
    formulaIds: ['randbetween', 'rand'],
    tip: 'RANDBETWEEN 生成指定范围内随机整数；RAND 生成0-1随机小数',
  },

  // ── 大小写转换 ──────────────────────────────────────────────────
  {
    intent: '英文大小写',
    keywords: ['大写', '小写', '转大写', '转小写', '首字母大写', '英文大写'],
    formulaIds: ['upper', 'lower', 'proper'],
    tip: 'UPPER 全部大写；LOWER 全部小写；PROPER 每个单词首字母大写',
  },

  // ── 贷款月供 ──────────────────────────────────────────────────
  {
    intent: '贷款月供还款',
    keywords: ['月供', '贷款', '房贷', '车贷', '每月还款', '分期', '还多少', '等额还款', '还款金额'],
    formulaIds: ['pmt', 'ipmt', 'ppmt'],
    tip: 'PMT 计算每期还款总额；IPMT 计算其中利息部分；PPMT 计算其中本金部分',
  },

  // ── 投资现值终值 ──────────────────────────────────────────────
  {
    intent: '投资现值终值',
    keywords: ['现值', '终值', '未来价值', '定投', '复利', '投资回报', '存款到期', '理财'],
    formulaIds: ['fv', 'pv', 'npv', 'irr'],
    tip: 'FV 计算定投终值；PV 计算现值；NPV 计算净现值；IRR 计算内部收益率',
  },

  // ── 折旧摊销 ──────────────────────────────────────────────────
  {
    intent: '资产折旧',
    keywords: ['折旧', '摊销', '固定资产', '资产折旧', '残值', '年限', '直线法', '递减法'],
    formulaIds: ['sln', 'db'],
    tip: 'SLN 直线法折旧（每期相同）；DB 余额递减法折旧（前期多后期少）',
  },

  // ── 利率转换 ──────────────────────────────────────────────────
  {
    intent: '利率转换计算',
    keywords: ['实际利率', '名义利率', '年化利率', '月利率换算', '复利计算', '利率换算'],
    formulaIds: ['effect', 'nominal', 'rate'],
    tip: 'EFFECT 名义利率→实际利率；NOMINAL 实际利率→名义利率；RATE 反算每期利率',
  },
]

/**
 * 根据用户输入文本，扫描意图关键词，返回匹配的意图列表
 * @param {string} input - 用户输入的搜索文本
 * @returns {{ intent, tip, formulaIds, scenarioIds, matchedKeywords }[]}
 */
export function matchIntents(input) {
  if (!input || input.trim().length < 2) return []
  const text = input.trim().toLowerCase()

  const results = []
  for (const entry of intentKeywords) {
    const matched = entry.keywords.filter(kw => text.includes(kw))
    if (matched.length > 0) {
      results.push({
        intent: entry.intent,
        tip: entry.tip,
        formulaIds: entry.formulaIds || [],
        scenarioIds: entry.scenarioIds || [],
        matchedKeywords: matched,
        score: matched.length,
      })
    }
  }

  // 按命中关键词数量降序排列
  results.sort((a, b) => b.score - a.score)
  return results
}
