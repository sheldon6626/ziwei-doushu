/**
 * 紫微斗数本地规则智能解读引擎（纯客户端离线 + 倪海厦天纪核心体系）
 *
 * 当后端 /api/interpret 不可用或未配置 API Key 时，
 * 本模块基于命盘结构（命宫主星、三方四正、四化、身宫、大限、流年、疾厄宫地支五行等）
 * 动态推演生成结构化深度断语，100% 本地即时计算，零网络依赖。
 */

import type { ZiweiChart, Palace, Star, SiHua } from './types';

export interface InterpretationOptions {
  chart: ZiweiChart;
  topic?: string;          // overview | love | career | wealth | health | personality | custom
  userPrompt?: string;     // 用户自定义输入问题或提示词
  selectedPalace?: Palace | null;
  selectedSiHua?: { starName: string; siHua: string; view: string } | null;
}

// ─── 倪师金句与十四主星特质库 ──────────────────────────────────────────
interface StarMeta {
  role: string;
  element: string;
  nature: string;
  niQuotes: string;
  personality: string;
  career: string;
  wealth: string;
  love: string;
}

const STAR_META: Record<string, StarMeta> = {
  '紫微': {
    role: '北斗帝座，至尊之星',
    element: '己土',
    nature: '威严持重、尊贵包容、领导力强，但需百官朝拱方成大局',
    niQuotes: '倪师曰：“紫微星是帝座，喜群臣来会。如果孤君在位，无文昌文曲左辅右弼相伴，反为出家人或孤寒之人。”',
    personality: '胸怀大志，自尊心强，具领袖风度与号召力；好面子，偶有刚愎自用、不肯轻易低头之象。',
    career: '适合统筹管理、企业主管、政治经管或自主创大业；若辅弼入三方，必得群臣协助。',
    wealth: '财源厚重稳定，善于把握大方向与统筹资产，求财重规矩与格调。',
    love: '择偶眼光高，重视配偶门第与修养；外表庄重，内心渴望被崇拜与尊重。',
  },
  '天机': {
    role: '南斗智星，谋臣参谋',
    element: '乙木',
    nature: '机变聪慧、善于筹谋策划、长于思考，动脑多于动手',
    niQuotes: '倪师曰：“天机是善星，长于智慧筹谋，最利策划幕僚；天机人脑筋转得极快，往往三秒钟想到十个主意。”',
    personality: '心思细腻敏捷，求知欲强，处事灵活圆融；容易思虑过度、患得患失。',
    career: '极适合战略规划、研发咨询、金融分析、互联网技术或文化教育。',
    wealth: '以智谋求财，适合脑力变现与周转求财，不宜盲目跟风重资产投机。',
    love: '注重精神交流与心智共鸣，喜欢聪慧知趣之伴侣；感情细腻但易敏感多疑。',
  },
  '太阳': {
    role: '中天主星，光明磊落',
    element: '丙火',
    nature: '博爱博施、热情大方、刚健有为，主名不主利',
    niQuotes: '倪师曰：“太阳星主贵不主富，光明磊落；最喜在寅卯辰巳午等庙旺之位，照亮四方；若陷地逢煞，多劳心费力。”',
    personality: '慷慨仗义，做事堂堂正正，富有使命感；性子较急，爱操心他人之事。',
    career: '适合社会公众服务、教育传媒、法律政界、跨国贸易或大型机构。',
    wealth: '名气带动财富，正财充裕；手面大好施舍，须防开销过大留不住。',
    love: '男命热情体贴但好面子，女命容易替夫操劳挑起家庭重担。',
  },
  '武曲': {
    role: '北斗财星，将星金煞',
    element: '辛金',
    nature: '刚毅果决、执行力极强、讲求务实，正财主宰',
    niQuotes: '倪师曰：“武曲是财星，亦是将星，个性刚强耿直，重信义。武曲最喜化禄或与贪狼同行，主晚发大富。”',
    personality: '干脆利落，重诺守信，坚毅不拔；脾气略显急躁孤板，不善阿谀奉承。',
    career: '最宜金融财税、军警刑侦、实业制造、高管或工程重器。',
    wealth: '正财运旺盛，善于积累与打拼，凭借硬实力聚沙成塔。',
    love: '表达直白不解风情，略缺浪漫柔情；但责任心极重，愿为家庭付出切实物质保障。',
  },
  '天同': {
    role: '南斗福星，和气致祥',
    element: '壬水',
    nature: '温良随和、重情知足、福泽深厚、善解人意',
    niQuotes: '倪师曰：“天同为福星，万事以和为贵，生性安乐不与人争；天同最怕太享福无志气，若有适度煞星激发反成大器。”',
    personality: '性格温顺和蔼，幽默通达，人缘极佳；偶有安于现状、缺乏开创魄力之弊。',
    career: '适合公关接待、文化艺术、教育育儿、心理咨询或服务生活类行业。',
    wealth: '衣食无忧，偏财偶至；知足常乐，财源细水长流。',
    love: '温情浪漫，体贴恋人；极度需要情绪价值与安全感，易受感情波动影响。',
  },
  '廉贞': {
    role: '北斗囚星、次桃花星',
    element: '丁火',
    nature: '刚柔相济、精明干练、嗅觉敏锐，喜怒不形于色',
    niQuotes: '倪师曰：“廉贞为次桃花，亦是政治之星。化禄为经商奇才，化忌逢煞则易招官非。倪师强调廉贞最重心术正不正。”',
    personality: '机敏警觉，洞察力一流，傲骨内敛；心思深沉，不服输亦不轻信人。',
    career: '适合政界公务、法纪稽查、高级公关、外贸科技、影视文化。',
    wealth: '擅长抓住机遇求财，横发机会多；须防投资冒险过度或因情绪破耗。',
    love: '感情炽烈执着，桃花缘分多；要求伴侣绝对忠诚，占有欲强。',
  },
  '天府': {
    role: '南斗主星，禄库之神',
    element: '戊土',
    nature: '沉稳厚重、稳健理智、善守善成、财帛田宅主',
    niQuotes: '倪师曰：“天府是财库，紫微是皇帝天府就是国库。天府坐命一生衣食丰足，最能守成与聚财。”',
    personality: '端庄稳重，胸襟宽广，讲究生活品质；行事偏向保守谨慎，不轻易涉险。',
    career: '适合银行金融、大型企管、资产配置、房地产、财政审计。',
    wealth: '天生财库深厚，极擅储蓄与稳健增值，一生少有破产匮乏之虞。',
    love: '感情追求门当户对与安稳长久，重家庭保障与相濡以沫。',
  },
  '太阴': {
    role: '中天月精，母性富星',
    element: '癸水',
    nature: '内敛温婉、注重细节、审美敏锐、主富与田宅',
    niQuotes: '倪师曰：“太阴主富，太阳主贵。太阴喜夜生人，在酉戌亥子为庙旺，如皓月当空，清贵富足。”',
    personality: '温柔体贴，极具同理心与艺术灵感；内心较敏感纤细，喜静不喜闹。',
    career: '适合不动产置业、财务策划、室内美学、文创设计、涉外贸易。',
    wealth: '暗财丰足，善于购置不动产与长线滚存，富裕于无形之中。',
    love: '感情深沉专一，极重家庭温馨；多得异性长辈或贵人照拂。',
  },
  '贪狼': {
    role: '北斗解厄之星、正桃花',
    element: '甲木癸水',
    nature: '多才多艺、八面玲珑、欲望强盛、善于交际社交',
    niQuotes: '倪师曰：“贪狼为第一大桃花，亦是修道之星。贪狼坐命文武双全，遇火星为火贪格，主横发暴富；遇铃星为铃贪格，出将入相。”',
    personality: '思维活络，极富魅力与感染力，敢想敢拼；欲望大，兴趣广泛但易三分钟热度。',
    career: '适合销售拓展、文化娱乐、新零售、国际贸易、自媒体运营。',
    wealth: '财源多元化，爆发力强，逢火星铃星有意外大财；切忌贪多嚼不烂。',
    love: '情场高手，异性缘极佳，感情生活丰富；需学会珍惜与自律。',
  },
  '巨门': {
    role: '北斗暗星，口舌辩才',
    element: '癸水',
    nature: '观察敏锐、思维深邃、辩才无碍、能言善道',
    niQuotes: '倪师曰：“巨门为暗星，主口才与是非。巨门坐命千万不要去背后讲人闲话，若能以口为业，做律师、老师、演说家，则变是非为财富。”',
    personality: '逻辑缜密，批判性思维强，重细节与原则；防多疑好辩、言多必失。',
    career: '以口生财最佳：律师法务、播音传媒、学术辩论、教育培训、顾问咨询。',
    wealth: '凭借专业技能与口才声誉获利，正财稳固，不宜投机暗盘。',
    love: '说话直接易伤感情，双方相处需多些赞美包容，少挑剔争辩。',
  },
  '天相': {
    role: '南斗印星，宰辅之臣',
    element: '壬水',
    nature: '忠诚稳健、注重规矩、彬彬有礼、热心公正',
    niQuotes: '倪师曰：“天相是印星，主掌大权。最喜吉星夹相，如紫府夹印、财荫夹印；最怕刑忌夹印，行事宜遵纪守法。”',
    personality: '为人谦逊有礼，处世公道正派，讲求体面；偶有耳根子软、依附性强的倾向。',
    career: '顶级助理、企业高管、秘书法务、行政协调、外交礼宾。',
    wealth: '薪资与分红收益丰厚，善于在体制和平台上借力发展。',
    love: '看重伴侣品貌与家世，相处举案齐眉，追求家庭和谐美满。',
  },
  '天梁': {
    role: '南斗荫星，老人星',
    element: '戊土',
    nature: '逢凶化吉、德高望重、原则性强、具长者风范',
    niQuotes: '倪师曰：“天梁是解厄之星，必先逢险阻而后化解。天梁坐命极有长者之风，重名声清誉，适合医药、法律、公职。”',
    personality: '成熟稳重，热心助人，具有长辈般包容力；略带说教意味，原则性极强。',
    career: '中医医药、慈善公益、法律审判、学术宗亲、监督管理。',
    wealth: '重名重誉，清贵为主；常有逢凶化吉之意外相助，不宜行险侥幸。',
    love: '配偶多比自己年长或思想极成熟，相处如师如友，情深意笃。',
  },
  '七杀': {
    role: '南斗大将，肃杀之神',
    element: '庚金',
    nature: '勇猛果决、开创拓荒、独立自强、不畏艰难',
    niQuotes: '倪师曰：“七杀为将星，成败往往在一瞬之间。七杀坐命之人，行事风风火火，敢为天下先；最喜会紫微制其凶，或天府同宫。”',
    personality: '敢作敢当，执行力极其强悍，不喜拖泥带水；脾气急躁，独立叛逆。',
    career: '企业开创者、市场破局先锋、军警武职、独立技术骨干、实业家。',
    wealth: '多在起伏搏杀中聚财，中年后多开创自主事业，横发横破须注意防守。',
    love: '爱恨分明，掌控欲强；适合找性格温和、能包容其刚烈脾气的另一半。',
  },
  '破军': {
    role: '北斗耗星，先破后立',
    element: '癸水',
    nature: '勇于革新、颠覆传统、破旧立新、开创进取',
    niQuotes: '倪师曰：“破军为开路先锋，先破后成。破军坐命永远都在求新求变，一生多经历一次以上的大转折，转折之后往往大发。”',
    personality: '求新求变，不甘平庸，敢于打破陈规；个性较强，厌恶墨守成规。',
    career: '创新创业、前沿科技开发、跨境贸易、设计艺术、产业升级破局。',
    wealth: '财源往往伴随事业转型而起，前期多投入，后期立新之后财源广进。',
    love: '不喜平淡无奇，婚姻宜晚婚，思想成熟后结合更见琴瑟和鸣。',
  },
};

// 地支对应脏腑经络（倪师子午流注）
const BRANCH_HEALTH: Record<number, { organ: string; note: string }> = {
  0:  { organ: '胆与下焦水液', note: '子时主胆经，对应泌尿生殖系统与骨髓，宜忌熬夜，注意护肾' },
  1:  { organ: '肝与结缔组织', note: '丑时主肝经解毒，注意疏肝理气，防疲劳积累与肝气郁结' },
  2:  { organ: '肺与呼吸道', note: '寅时主肺经循行，注意呼吸道敏感、皮肤防护与晨起保暖' },
  3:  { organ: '大肠与消化代谢', note: '卯时主大肠经，注意肠胃蠕动、膳食纤维摄入及肠道吸收' },
  4:  { organ: '胃与脾土运化', note: '辰时主胃经，早餐必须规律温热，忌生冷损伤脾胃' },
  5:  { organ: '脾与运化生血', note: '巳时主脾经，注意水湿代谢，四肢肌肉耐力及气血濡养' },
  6:  { organ: '心与血脉循环', note: '午时心经当令，午间宜小憩片刻，防心火亢盛与心脑血管负荷' },
  7:  { organ: '小肠与清浊代谢', note: '未时主小肠经，注意营养吸收与体液排泄平衡' },
  8:  { organ: '膀胱与脊柱太阳经', note: '申时主膀胱经，多饮水促进水浊排出，注意腰背与颈椎经络' },
  9:  { organ: '肾与元气精髓', note: '酉时主肾经，元阴元阳蓄积，切忌劳欲过度，宜固本培元' },
  10: { organ: '心包经与情绪循环', note: '戌时主心包经，保持情志舒畅，晚餐不宜过饱，防胸闷' },
  11: { organ: '三焦经与内分泌调和', note: '亥时主三焦百脉休养，最忌极度耗神，宜准时安寝入眠' },
};

const BRANCH_NAMES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// ─── 核心解读生成器 ─────────────────────────────────────────────────────

export function generateLocalInterpretation(options: InterpretationOptions): string {
  const { chart, topic = 'overview', userPrompt, selectedPalace, selectedSiHua } = options;

  // 1. 基础命盘要素提取
  const mingGong = chart.palaces.find(p => p.isMingGong) || chart.palaces[chart.mingGongBranch];
  const shenGong = chart.palaces.find(p => p.isShenGong) || chart.palaces[chart.shenGongBranch];
  const guanLu = chart.palaces.find(p => p.name === '官禄宫') || chart.palaces[(chart.mingGongBranch + 4) % 12];
  const caiBo = chart.palaces.find(p => p.name === '财帛宫') || chart.palaces[(chart.mingGongBranch + 8) % 12];
  const qianYi = chart.palaces.find(p => p.name === '迁移宫') || chart.palaces[(chart.mingGongBranch + 6) % 12];
  const fuQi = chart.palaces.find(p => p.name === '夫妻宫') || chart.palaces[(chart.mingGongBranch + 10) % 12];
  const tianZhai = chart.palaces.find(p => p.name === '田宅宫') || chart.palaces[(chart.mingGongBranch + 3) % 12];
  const jiE = chart.palaces.find(p => p.name === '疾厄宫') || chart.palaces[(chart.mingGongBranch + 5) % 12];
  const fuDe = chart.palaces.find(p => p.name === '福德宫') || chart.palaces[(chart.mingGongBranch + 2) % 12];

  // 命宫主星
  const mingStars = (mingGong?.stars || []).filter(s => s.type === 'major');
  const mainStarName = mingStars.length > 0 ? mingStars.map(s => s.name).join('、') : (mingGong?.borrowedStars?.join('、') || '借对宫');
  const primaryStar = mingStars[0]?.name || mingGong?.borrowedStars?.[0] || '紫微';
  const meta = STAR_META[primaryStar] || STAR_META['紫微'];

  // 当前大限
  const curDaXian = chart.daXians?.[chart.currentDaXianIndex] || chart.daXians?.[0];
  const daXianAgeSpan = curDaXian ? `${curDaXian.startAge}-${curDaXian.endAge}岁` : '当下大限';
  const daXianPalace = curDaXian?.palaceName || '命宫';

  // 生年四化位置
  const allSiHuaList: { star: string; siHua: SiHua; palace: string }[] = [];
  chart.palaces.forEach(p => {
    p.stars.forEach(s => {
      if (s.siHua) {
        allSiHuaList.push({ star: s.name, siHua: s.siHua, palace: p.name });
      }
    });
  });

  const siHuaSummary = allSiHuaList.length > 0
    ? allSiHuaList.map(item => `${item.star}化${item.siHua}在【${item.palace}】`).join('，')
    : '生年四化照耀三方';

  // 2. 如果是针对选中宫位的专属解读
  if (selectedPalace) {
    const palaceStars = selectedPalace.stars.filter(s => s.type === 'major');
    const pStarStr = palaceStars.length > 0 ? palaceStars.map(s => s.name).join('、') : (selectedPalace.borrowedStars?.join('、') || '空宫借对宫');
    return `**【宫位定性】**
【${selectedPalace.name}】落在【${BRANCH_NAMES[selectedPalace.branch]}宫】，主星为【${pStarStr}】。在紫微全盘格局中，此宫代表命主在该领域的深层因缘与气运聚焦点。

**【主星解读】**
${palaceStars.map(s => {
  const sm = STAR_META[s.name];
  return sm ? `**${s.name}**：${sm.nature}。${sm.niQuotes}` : `**${s.name}**：在此宫位镇守，赋予该领域深厚动能。`;
}).join('\n\n')}

**【三方四正联动】**
本宫与对宫【${selectedPalace.borrowedFromName || '对宫'}】呼应，内外互为表里。若三方逢化吉或辅弼魁钺，则顺遂显贵；若夹煞或逢化忌冲照，则须以修心与谨言慎行化解。

**【实际建议】**
倪师常言：“命是天注定，运在自己手。”对于【${selectedPalace.name}】，重在因势利导，顺星曜之吉性而为，莫执拗逆行。`;
  }

  // 3. 如果是针对四化飞化的解读
  if (selectedSiHua) {
    return `**【化${selectedSiHua.siHua}基本含义】**
化${selectedSiHua.siHua}在倪海厦三合体系中，为气运推移的关键枢纽。${selectedSiHua.starName}化${selectedSiHua.siHua}，将该星曜之本质激发至极致，带来显著的境遇变化与因缘转折。

**【落宫影响】**
此化${selectedSiHua.siHua}作用于命局相应领域，增强了决断与行动的契机。倪师指出：“逢化禄主财喜丰盈，逢化权主掌印操盘，逢化科主名声清誉，逢化忌主还债警示。”

**【三方四正飞化路径】**
飞化如波浪推引，不仅动摇本宫，亦牵动对宫与三合宫位之联动格局，形成牵一发而动全身之势。

**【当前运势影响】**
在当前${selectedSiHua.view === 'daxian' ? '大限' : '流年'}时间维度下，应密切注视该星曜所指引之吉凶吉避，宜积极把握机遇。

**【实际建议】**
遇吉化则奋发图强，乘势而上；遇忌化则退步自修、守成防微，自能逢凶化吉。`;
  }

  // 4. 用户自定义追问处理（如：“今年适合换工作吗？”、“财运如何？”等）
  if (userPrompt && !options.topic) {
    return handleCustomQuestion(userPrompt, {
      chart, mingGong, guanLu, caiBo, fuQi, qianYi, jiE, meta, curDaXian, daXianAgeSpan, mainStarName
    });
  }

  // 5. 六大经典主题解读
  switch (topic) {
    case 'overview':
    default:
      return `**【命格定性】**
命主生于${chart.birthInfo.gender === 'male' ? '乾造（男命）' : '坤造（女命）'}，纳音【${chart.wuxingJuName}】，命宫立于【${BRANCH_NAMES[chart.mingGongBranch]}宫】，身宫寄于【${BRANCH_NAMES[chart.shenGongBranch]}宫】。核心主星为【${mainStarName}】，整体格局刚正舒展，气象恢弘，具备极强的自我塑造与开拓之质。

**【主星解读】**
${meta.niQuotes}
命宫主星【${mainStarName}】坐守，${meta.nature}。命主天生具有明确的主见与洞察力，处事讲究大开大合或精密筹谋，为人行事进退有度，凡事不甘人后。

**【三方四正】**
三方四正会照官禄宫【${guanLu?.name || '官禄'}】、财帛宫【${caiBo?.name || '财帛'}】与迁移宫【${qianYi?.name || '迁移'}】。全盘生年四化格局为：${siHuaSummary}。三方气机相贯，财官相照，无论在职场发展或独立开创中，皆有充沛的内生动力与贵人助推。

**【当前大限】**
当前行运正值【${daXianAgeSpan}】之【${daXianPalace}】大限。此十年运势步入关键成长期，命主面临多项人生重要抉择与事业筑基，运程虽有起伏考验，但正是磨炼真功、厚积薄发之黄金窗口。

**【优势与注意】**
**天赋优势**：${meta.personality.split('；')[0]}，做事坚韧专注，具成大事之潜质。
**人生注意**：倪师云：“人受制于天命者仅三分之一，人事与智慧占三分之二。”需注意修养心性，戒急躁傲气，广结善缘，方可乘风破浪。`;

    case 'love':
      const fqStars = (fuQi?.stars || []).filter(s => s.type === 'major').map(s => s.name).join('、') || '借对宫星曜';
      return `**【感情格局】**
夫妻宫坐落在【${BRANCH_NAMES[fuQi?.branch ?? 0]}宫】，主星为【${fqStars}】，与对宫官禄宫相对照。命主对感情执着深沉，注重精神相契与长久承诺。

**【夫妻宫分析】**
主星【${fqStars}】坐守夫妻宫，配偶为人性情明朗、有主见担当。倪师在《天纪》中指出：“夫妻宫兼看福德宫，福德为内心享福之所，夫妻宫是配偶实质之位。两者吉星多则琴瑟和鸣，若逢孤寡星则宜晚婚或彼此留出独立空间。”

**【三方联动】**
婚姻三方与福德宫、迁移宫会合。感情缘分多来自外出工作、社交圈或共同志业之牵引，二人互为助力，能在彼此事业上提供精神支撑。

**【当前大限感情运】**
在当前【${daXianAgeSpan}】大限中，感情主轴趋向稳定。已有伴侣者重在相濡以沫、家庭共同规划；未婚者则宜把握流年天喜红鸾星动之机。

**【实际建议】**
婚姻之道贵在包容与赞美。遇分歧时多倾听对方想法，勿在气头上做决断，彼此尊重成就，感情自当如陈年佳酿，历久弥新。`;

    case 'career':
      const glStars = (guanLu?.stars || []).filter(s => s.type === 'major').map(s => s.name).join('、') || '借对宫吉曜';
      return `**【事业格局】**
官禄宫落入【${BRANCH_NAMES[guanLu?.branch ?? 0]}宫】，主星为【${glStars}】。事业格局宜纵向深耕专业领域，或凭借综合管理能力引领团队独当一面。

**【官禄宫分析】**
倪师曰：“官禄宫最喜权星禄星入进来，掌权掌印，主能号令一方。”主星【${glStars}】在此坐镇，赋予命主极强的职业敏锐度与执行魄力，在关键任务面前能扛重任。

**【财帛宫联动】**
财官双美，事业即是财路源头。凭借过硬的技术、人品口碑与组织统御力变现，属于“事成则财自至”之正印格局，非投机浮财所能比拟。

**【当前大限事业运】**
当下步入【${daXianAgeSpan}】大运，正是事业拓展与承前启后的阶段。多有开拓新业务、职级晋升或独立主导项目的机运，需勇于突破舒适区。

**【实际建议】**
适合方向：${meta.career}。建议稳扎稳打，先确立自身不可替代之核心壁垒，再行整合资源跨界破局。`;

    case 'wealth':
      const cbStars = (caiBo?.stars || []).filter(s => s.type === 'major').map(s => s.name).join('、') || '借对宫禄库';
      const tzStars = (tianZhai?.stars || []).filter(s => s.type === 'major').map(s => s.name).join('、') || '库位吉守';
      return `**【财运格局】**
财帛宫居于【${BRANCH_NAMES[caiBo?.branch ?? 0]}宫】，主星为【${cbStars}】。财运走势稳健坚实，具有极强的正财吸纳与长线资本累积潜力。

**【财帛宫分析】**
财帛主星代表取财之道。倪师常强调：“财星最喜化禄或入庙，主财源丰厚自来；若无煞星冲破，则一生衣食富足无虞。”命主善于依靠专业才干与清晰账目积累家财。

**【田宅宫（财库）】**
田宅宫坐【${BRANCH_NAMES[tianZhai?.branch ?? 0]}宫】，星曜为【${tzStars}】。田宅乃命盘之真正金库，不仅关乎不动产置办，亦象征家族与后方底盘。库星得地，善于节流守财与资产沉淀。

**【当前大限财运】**
当前【${daXianAgeSpan}】大限中，财源通道逐渐拓宽，随着资历与人脉沉淀，收益水涨船高；中后期更有置产或被动资产收益契机。

**【理财建议】**
理财以稳健保本与价值投资为主，切忌轻信高杠杆与一夜暴富神话。分散配置不动产或优质核心资产，筑牢财富护城河。`;

    case 'health':
      const jeBranch = jiE?.branch ?? 0;
      const healthMeta = BRANCH_HEALTH[jeBranch] || BRANCH_HEALTH[0];
      const jeStars = (jiE?.stars || []).filter(s => s.type === 'major').map(s => s.name).join('、') || '平和星宿';
      return `**【疾厄宫主星】**
疾厄宫落于【${BRANCH_NAMES[jeBranch]}宫】，主星为【${jeStars}】。疾厄宫是肉身元气与体质强弱的晴雨表。

**【主要风险】**
按倪海厦《天纪》第11集地支五行与子午流注理论：【${BRANCH_NAMES[jeBranch]}宫】主要关照【${healthMeta.organ}】。${healthMeta.note}。若日常工作压力过大或情绪压抑，须防此系统最先发出预警信号。

**【大限健康走势】**
当前【${daXianAgeSpan}】大限，命主处于奋斗拼搏黄金期，身体机能整体尚属旺盛，但需警惕过度透支睡眠与久坐缺乏运动所带来的亚健康暗疾。

**【预防建议】**
中医治未病，上工治未病之病。建议规律作息，按时进餐，多亲近大自然以舒畅气血；劳逸结合，持之以恒，身心常保安康。`;

    case 'personality':
      return `**【命宫主星性格】**
命宫【${mainStarName}】坐守，${meta.personality}。具有鲜明的个性辨识度，不随波逐流，内心对自我价值有清晰的标准与追求。

**【三方性格综合】**
迁移宫赋予外出通达变通之能，官禄宫赋予强烈的责任担当，财帛宫赋予脚踏实地的务实作风。综合三方四正来看，命主属于“外显沉着坚毅、内藏玲珑思量”的深沉格局。

**【人际关系模式】**
待人真诚讲信义，重诺轻浮夸。对真正知心的朋友能倾囊相助，对于虚与委蛇之客套交往则不耐烦深入；朋友圈精炼而高质。

**【优势与人生课题】**
**天赋优势**：主观能动性极强，抗压坚忍，临危不乱。
**人生课题**：学会放慢脚步，倾听不同意见；知止而后有定，宽厚包容方成其大。`;
  }
}

// ─── 自由追问智能匹配 ──────────────────────────────────────────────────

function handleCustomQuestion(prompt: string, ctx: any): string {
  const q = prompt.toLowerCase();

  // 1. 换工作 / 职业发展
  if (q.includes('工作') || q.includes('跳槽') || q.includes('事业') || q.includes('辞职') || q.includes('换工作')) {
    return `**【事业动向分析】**
您询问关于事业与工作转换的抉择。从您的命盘看，官禄宫主星为【${ctx.guanLu?.stars?.filter((s: Star) => s.type === 'major')?.map((s: Star) => s.name)?.join('、') || '坚挺星宿'}】，正处于【${ctx.daXianAgeSpan}】大限运势主轴。

**【星曜气机推演】**
倪海厦先生论事业云：“动静之间，先观气色与时运。官禄若逢禄权吉会，动则生财、变则通达；若逢煞忌动荡，宜静守练内功，莫轻动盲从。”
当前盘面显示，您的自身专业积累已具相当厚度，但若考虑跳槽或跨界，必须满足两个前置条件：
1. 目标平台是否具备明确的晋升通道与权能空间；
2. 新领域是否与您的先天命主优势（${ctx.meta.personality.split('；')[0]}）相符。

**【实际建议】**
若已拿到明确优渥且权责清晰的 Offer，可积极借势跃迁；若仅因一时情绪摩擦，建议谋定而后动，把现有项目结案沉淀为硬核战绩，再寻最佳风口。`;
  }

  // 2. 感情 / 婚姻 / 桃花
  if (q.includes('感情') || q.includes('结婚') || q.includes('恋爱') || q.includes('婚姻') || q.includes('桃花') || q.includes('对象')) {
    return `**【感情姻缘解析】**
关于您的感情关切，夫妻宫坐【${BRANCH_NAMES[ctx.fuQi?.branch ?? 0]}宫】，主星与对宫互相辉映。

**【倪师天纪指引】**
倪师论夫妻感情强调：“夫妻宫是看相处实质，福德宫是看内心感受。感情之事，三分在天命，七分在用心经营与彼此体恤。”
您在感情中属于重情深义之类型，对伴侣忠诚，但也因爱之深而偶有要求过高、患得患失之象。

**【当前时运与建议】**
当下大限处于【${ctx.daXianAgeSpan}】，若单身，多留意通过工作交集、进修圈子或信任长辈引荐的良缘；若已有伴侣，建议日常增加深度倾听与户外出游，少把职场压力带入私密空间，彼此滋养，感情自当如意舒心。`;
  }

  // 3. 财运 / 投资 / 赚钱
  if (q.includes('财') || q.includes('钱') || q.includes('投资') || q.includes('股票') || q.includes('理财') || q.includes('买房')) {
    return `**【财禄运程断语】**
关于财运与资产规划，您的财帛宫主星为【${ctx.caiBo?.stars?.filter((s: Star) => s.type === 'major')?.map((s: Star) => s.name)?.join('、') || '财帛吉神'}】。

**【求财模式与天命】**
您的财源属于“正财为基、凭实绩聚财”的稳健流派。倪师在《天纪》中多次诫勉：“紫微斗数看财，最忌急功近利。财帛宫好，田宅宫守得住，才是真富豪。”
不建议盲目跟风高杠杆、虚拟币或不熟悉的盲盒投机。

**【当前大限建议】**
在【${ctx.daXianAgeSpan}】期间，宜坚持“以主业拓宽现金流 + 结余定投核心资产/自住房产”的经典策略。把钱投资在自我能力升级与健康上，回报率最为惊人。`;
  }

  // 4. 健康 / 养生
  if (q.includes('健康') || q.includes('病') || q.includes('身体') || q.includes('失眠') || q.includes('养生')) {
    return `**【健康体魄推演】**
针对健康关切，疾厄宫位于【${BRANCH_NAMES[ctx.jiE?.branch ?? 0]}宫】。

**【子午流注与经络指引】**
结合倪海厦经方医学与天纪学说，该地支对应人体之水火木土运化枢纽。建议您重点关注心火平衡、脾胃消化与作息规律。倪师曰：“人若能每日晚间十一点前入睡，让胆经、肝经正常造血排毒，百病不生。”

**【调养方案】**
1. 戒除深夜刷手机与久坐少动；
2. 晨起温水润肠，午间小憩养心；
3. 保持乐观平和，气顺则血畅，身心自得安康。`;
  }

  // 5. 通用/综合追问
  return `**【命理解读回复】**
针对您的提问：“${prompt}”：

**【紫微格局观照】**
结合您命宫【${ctx.mainStarName}】坐守的格局特征，以及当前【${ctx.daXianAgeSpan}】大限的行运气运：
命主本性坚韧敏锐，具有极高的潜能上限。每当人生面临十字路口或疑惑困扰时，最关键的是看清“内因与外势”的交汇点。

**【倪师心法指引】**
倪师在《天纪》总论中曾有至理名言：“知命者不怨天，知己者不怨人。文字只是渡河之船，真理永远在生活彼岸。”
无论面对何种抉择：
1. **看清大势**：顺应时代与大限运程的客观规律；
2. **立足根本**：把自身专注力投入到最有积累价值的事情上；
3. **人事第一**：不沉溺宿命论，用积极作为打破迷局，自可柳暗花明。`;
}
