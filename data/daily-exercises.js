// =====================================================
// 每日句子練習 + 英文輸出提示
// tag 欄位用於弱點分析 (passive/tense/preposition/collocation/word-choice/grammar)
// =====================================================

const DAILY_SENTENCES = [
  {
    sentence: 'The seminar _______ in Conference Room B at 2 PM.',
    answer: 'will be held',
    options: ['will be held', 'is holding', 'will hold', 'holds'],
    explanation: '被動語態：seminar 是「被舉辦」的。用 will be + 過去分詞 (held)。',
    tag: 'passive'
  },
  {
    sentence: 'All employees are _______ to complete the safety training.',
    answer: 'required',
    options: ['required', 'requiring', 'require', 'requirement'],
    explanation: '"are required to" 表示「被要求做某事」，是商業英文中超常見的被動句型。',
    tag: 'passive'
  },
  {
    sentence: 'Please submit your expense reports _______ the 5th of each month.',
    answer: 'by',
    options: ['by', 'until', 'within', 'before to'],
    explanation: '"by" 表示「在某時間點之前完成」。"until" 強調持續到某時間點，概念不同。',
    tag: 'preposition'
  },
  {
    sentence: 'The new policy will take _______ starting next quarter.',
    answer: 'effect',
    options: ['effect', 'affect', 'impact', 'result'],
    explanation: '"take effect" 是「生效」的固定片語。注意：effect（名詞）vs affect（動詞）。',
    tag: 'collocation'
  },
  {
    sentence: 'Could you please _______ this document for any errors?',
    answer: 'proofread',
    options: ['proofread', 'inspect', 'review over', 'verify through'],
    explanation: '"proofread" 是「校稿」的正式用法，TOEIC 考試中非常常見的商業動詞。',
    tag: 'word-choice'
  },
  {
    sentence: 'The manager _______ the team to finish the project ahead of schedule.',
    answer: 'encouraged',
    options: ['encouraged', 'encouraging', 'was encouraged', 'had encouraged'],
    explanation: '簡單過去式：the manager（主詞）encouraged（動詞）the team（受詞）。',
    tag: 'tense'
  },
  {
    sentence: 'Our sales figures are _______ to industry expectations.',
    answer: 'comparable',
    options: ['comparable', 'comparing', 'compared', 'comparison'],
    explanation: '"comparable to" 意思是「和…相當的、可比較的」，形容詞修飾 sales figures。',
    tag: 'word-choice'
  },
  {
    sentence: 'The invoice should be _______ within 30 days of receipt.',
    answer: 'paid',
    options: ['paid', 'pay', 'paying', 'payment'],
    explanation: '被動語態："should be paid" 表示「應該被付清」，past participle (paid)。',
    tag: 'passive'
  },
  {
    sentence: 'Due to heavy traffic, she arrived _______ for the meeting.',
    answer: 'late',
    options: ['late', 'lately', 'later', 'latest'],
    explanation: '"late" 作副詞表示「遲到」。"lately" 則表示「最近」，意思完全不同。',
    tag: 'word-choice'
  },
  {
    sentence: 'The company _______ significant growth in the past two years.',
    answer: 'has experienced',
    options: ['has experienced', 'experienced', 'is experiencing', 'had experienced'],
    explanation: '"in the past two years" → 用現在完成式 (has + past participle)，強調到目前為止的結果。',
    tag: 'tense'
  },
  {
    sentence: 'The _______ date for the application is March 31st.',
    answer: 'deadline',
    options: ['deadline', 'closing', 'final', 'expiry'],
    explanation: '"deadline" 是「截止日期」最標準的名詞用法，在 TOEIC 中非常高頻。',
    tag: 'word-choice'
  },
  {
    sentence: 'We are looking for a candidate with _______ experience in project management.',
    answer: 'extensive',
    options: ['extensive', 'extended', 'expanding', 'excessive'],
    explanation: '"extensive experience" 是「豐富的經驗」，TOEIC 求職廣告中的經典搭配。',
    tag: 'collocation'
  },
  {
    sentence: 'The shipment _______ delayed due to customs inspection.',
    answer: 'was',
    options: ['was', 'is being', 'will be', 'has been'],
    explanation: '"was delayed" 是過去被動，因為是已發生的事件，不是現在或未來的狀況。',
    tag: 'passive'
  },
  {
    sentence: '_______ the contract is signed, we can begin the project.',
    answer: 'Once',
    options: ['Once', 'Despite', 'Although', 'Instead'],
    explanation: '"once" 表示「一旦…就…」，引導時間副詞子句，語意最符合。',
    tag: 'grammar'
  },
  {
    sentence: 'The marketing team will _______ a new campaign next month.',
    answer: 'launch',
    options: ['launch', 'release', 'broadcast', 'post'],
    explanation: '"launch a campaign" 是固定搭配，表示「推出行銷活動」。',
    tag: 'collocation'
  },
  {
    sentence: 'Our customer _______ rate has improved significantly this quarter.',
    answer: 'satisfaction',
    options: ['satisfaction', 'satisfied', 'satisfy', 'satisfying'],
    explanation: '"customer satisfaction rate" 是複合名詞，需要名詞形式 satisfaction。',
    tag: 'word-choice'
  },
  {
    sentence: 'The training session is _______ for all new employees.',
    answer: 'mandatory',
    options: ['mandatory', 'optional', 'available', 'voluntary'],
    explanation: '"mandatory" 是「強制的、必須的」，是 TOEIC 商業英文的重要形容詞。',
    tag: 'word-choice'
  },
  {
    sentence: 'We appreciate _______ business and look forward to working with you.',
    answer: 'your',
    options: ['your', 'you', 'yourself', 'yours'],
    explanation: '"appreciate your business" 是商業慣用句，your 修飾名詞 business（惠顧）。',
    tag: 'grammar'
  },
  {
    sentence: 'The board members voted _______ the merger.',
    answer: 'in favor of',
    options: ['in favor of', 'to support for', 'for agree with', 'positively about'],
    explanation: '"vote in favor of" 是「投票贊成」的固定片語，TOEIC 考試常考。',
    tag: 'preposition'
  },
  {
    sentence: 'The new regulation comes _______ effect on January 1st.',
    answer: 'into',
    options: ['into', 'in', 'to', 'under'],
    explanation: '"come into effect" 是「生效」的固定片語，介系詞一定是 into，不能換。',
    tag: 'preposition'
  },
  {
    sentence: 'We have _______ a meeting for next Tuesday afternoon.',
    answer: 'scheduled',
    options: ['scheduled', 'arranged for', 'set up for', 'listed'],
    explanation: '"have scheduled" 現在完成式，scheduled 是過去分詞，表示已排定的動作。',
    tag: 'tense'
  },
  {
    sentence: 'The report _______ that sales declined in Q3.',
    answer: 'indicates',
    options: ['indicates', 'tells about', 'says of', 'mentions of'],
    explanation: '"indicate" 是「顯示、指出」，後直接接名詞子句，不加介系詞。',
    tag: 'word-choice'
  },
  {
    sentence: '_______ notice is required before terminating the contract.',
    answer: 'Prior',
    options: ['Prior', 'Before', 'Early', 'Advance'],
    explanation: '"prior notice" 是「事先通知」的正式搭配，Prior 作形容詞修飾名詞。',
    tag: 'collocation'
  },
  {
    sentence: 'The HR department is _______ applications until the end of this week.',
    answer: 'accepting',
    options: ['accepting', 'accepted', 'to accept', 'in acceptance'],
    explanation: '"is accepting" 現在進行式，表示目前仍在持續接受申請的動作。',
    tag: 'tense'
  },
  {
    sentence: 'There has been a _______ increase in online sales this year.',
    answer: 'significant',
    options: ['significant', 'signify', 'significance', 'signified'],
    explanation: '修飾名詞 increase 需要形容詞 significant（顯著的）。',
    tag: 'word-choice'
  },
  {
    sentence: 'We are committed to _______ quality products at competitive prices.',
    answer: 'delivering',
    options: ['delivering', 'deliver', 'delivered', 'delivery'],
    explanation: '"committed to" 後面一定接動名詞（-ing 形式），這是固定文法規則。',
    tag: 'grammar'
  },
  {
    sentence: 'The conference will be _______ to remote participants via video call.',
    answer: 'accessible',
    options: ['accessible', 'accessed', 'access', 'accessing'],
    explanation: '"will be accessible" 表示「可以參與的」，形容詞描述狀態，be + adj。',
    tag: 'word-choice'
  },
  {
    sentence: 'Please forward the email to _______ you think might be interested.',
    answer: 'whoever',
    options: ['whoever', 'whomever', 'anyone who', 'someone'],
    explanation: '"whoever" 引導名詞子句，在子句中作主詞，意思是「任何…的人」。',
    tag: 'grammar'
  },
  {
    sentence: 'The budget _______ by 20% to cover the additional costs.',
    answer: 'was increased',
    options: ['was increased', 'increased', 'has increased', 'is increasing'],
    explanation: '被動語態：預算是「被增加」的，而且是過去發生的事，所以用 was increased。',
    tag: 'passive'
  },
  {
    sentence: 'All team members are _______ to attend the quarterly review.',
    answer: 'expected',
    options: ['expected', 'expecting', 'expectation', 'expected to'],
    explanation: '"are expected to attend" 表示「被期望出席」，be + past participle + to 不定詞。',
    tag: 'passive'
  },
];

const OUTPUT_PROMPTS = [
  {
    prompt: '今天最重要的一件工作任務是什麼？',
    hint: '試著用 "My main task today is to..." 開頭',
    example: 'My main task today is to prepare the press release for our upcoming documentary launch.'
  },
  {
    prompt: '用英文介紹你在臺灣吧的工作職責',
    hint: '試著用 "I work as... and I am responsible for..." 開頭',
    example: 'I work as a PR manager and I am responsible for media relations and brand communications.'
  },
  {
    prompt: '描述你上一次成功執行的公關活動或媒體合作',
    hint: '試著用 "Recently, I successfully..." 開頭',
    example: 'Recently, I successfully organized a media preview event that attracted over 20 journalists.'
  },
  {
    prompt: '你今天工作上遇到什麼挑戰？',
    hint: '試著用 "Today, I am facing a challenge with..." 開頭',
    example: 'Today, I am facing a challenge with coordinating multiple stakeholders for our upcoming event.'
  },
  {
    prompt: '如果你要向外國媒體介紹「臺灣吧」，你會怎麼說？',
    hint: '試著用 "Taiwan Bar is a company that..." 開頭',
    example: 'Taiwan Bar is a media company that creates educational content about history and culture for Taiwanese audiences.'
  },
  {
    prompt: '你最近學到什麼有趣的英文單字或表達方式？',
    hint: '試著用 "I recently learned the word/expression..." 開頭',
    example: 'I recently learned the expression "ahead of schedule," which means finishing something earlier than planned.'
  },
  {
    prompt: '用英文描述你的每週健身習慣',
    hint: '試著用 "I go to the gym... times a week and I usually..." 開頭',
    example: 'I go to the gym three times a week and I usually focus on cardio and strength training.'
  },
  {
    prompt: '用英文說明你如何與媒體建立長期合作關係',
    hint: '試著用 "To maintain good media relationships, I..." 開頭',
    example: 'To maintain good media relationships, I regularly reach out to journalists and share exclusive story ideas.'
  },
  {
    prompt: '你認為公關工作中最重要的技能是什麼？',
    hint: '試著用 "In my opinion, the most important skill in PR is..." 開頭',
    example: 'In my opinion, the most important skill in PR is the ability to communicate clearly and calmly under pressure.'
  },
  {
    prompt: '用英文描述你今天的行程安排',
    hint: '試著用 "Today, I have a busy schedule. First, I will... Then..." 開頭',
    example: 'Today, I have a packed schedule. First, I will join a team meeting, then draft a media pitch letter.'
  },
  {
    prompt: '你如何在工作和家庭之間取得平衡？',
    hint: '試著用 "Balancing work and family life requires..." 開頭',
    example: 'Balancing work and family life requires careful planning and setting clear boundaries for my working hours.'
  },
  {
    prompt: '如果你要幫公司寫一封英文媒體邀請函，開頭你會怎麼說？',
    hint: '試著用 "We are pleased to invite you to..." 開頭',
    example: 'We are pleased to invite you to the exclusive preview screening of our latest original documentary series.'
  },
  {
    prompt: '用英文介紹你的一個個人興趣或習慣',
    hint: '試著用 "One thing I enjoy doing regularly is..." 開頭',
    example: 'One thing I enjoy doing regularly is drinking green smoothies in the morning to stay energized for the day.'
  },
  {
    prompt: '用英文寫一封簡短的感謝郵件給合作媒體',
    hint: '試著用 "Thank you for your support with..." 開頭',
    example: 'Thank you for your support with our recent campaign. Your coverage helped us reach a much wider audience.'
  },
];

// 弱點標籤中文對照
const TAG_LABELS = {
  'passive':      { label: '被動語態', emoji: '🔄' },
  'tense':        { label: '動詞時態', emoji: '⏱️' },
  'preposition':  { label: '介系詞片語', emoji: '📌' },
  'collocation':  { label: '詞語搭配', emoji: '🔗' },
  'word-choice':  { label: '詞彙選用', emoji: '📝' },
  'grammar':      { label: '文法結構', emoji: '📐' },
  'vocab':        { label: 'TOEIC 單字', emoji: '📖' },
};
