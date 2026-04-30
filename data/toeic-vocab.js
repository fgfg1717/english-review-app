// =====================================================
// TOEIC 高頻單字庫 — 100 個商業英文核心詞彙
// 每天自動輪播，不需課程材料也能學習
// =====================================================

const TOEIC_VOCAB = [
  // Set 1: Office Administration
  { word: 'allocate', zh: '分配、撥給', definition: 'to give something for a specific purpose', example: 'We need to allocate more budget to the marketing team.' },
  { word: 'authorize', zh: '授權、批准', definition: 'to give official permission for something', example: 'Only the CEO can authorize expenses over $10,000.' },
  { word: 'coordinate', zh: '協調、統籌', definition: 'to organize people or things to work together', example: 'She coordinates all project activities across teams.' },
  { word: 'delegate', zh: '委派、下放權責', definition: 'to give a task or responsibility to someone else', example: 'Effective managers know how to delegate tasks to their team.' },
  { word: 'facilitate', zh: '促進、協助推動', definition: 'to make a process easier or more likely to happen', example: 'The new software facilitates communication between departments.' },

  // Set 2: Finance Basics
  { word: 'acquire', zh: '收購、獲得', definition: 'to buy or obtain something, especially a company', example: 'The company plans to acquire its main competitor next year.' },
  { word: 'deficit', zh: '赤字、虧損', definition: 'a shortage of money when costs exceed income', example: 'The project ran a budget deficit of $50,000 last quarter.' },
  { word: 'forecast', zh: '預測、展望', definition: 'a prediction about what will happen in the future', example: 'The sales forecast for next quarter looks very promising.' },
  { word: 'overhead', zh: '管銷費用', definition: 'regular costs of running a business not linked to production', example: 'We need to reduce overhead to improve overall profitability.' },
  { word: 'revenue', zh: '營收、總收入', definition: 'the total income from business activities', example: 'Total revenue increased by 15% compared to last quarter.' },

  // Set 3: HR & Hiring
  { word: 'applicant', zh: '申請人、應徵者', definition: 'a person who applies for a job or position', example: 'We received over 200 applicants for the marketing position.' },
  { word: 'compensation', zh: '薪酬、報酬', definition: 'payment and benefits given for work done', example: 'The compensation package includes salary, bonus, and health insurance.' },
  { word: 'incentive', zh: '激勵、獎勵', definition: 'something that encourages people to work harder', example: 'Performance bonuses are a common employee incentive.' },
  { word: 'qualification', zh: '資格、條件', definition: 'the skills or experience needed for a job', example: 'A relevant degree is a required qualification for this position.' },
  { word: 'vacancy', zh: '職缺、空缺', definition: 'an unfilled job position in an organization', example: 'We currently have several vacancies in the sales department.' },

  // Set 4: Communication
  { word: 'acknowledge', zh: '確認收到、承認', definition: 'to confirm that you have received something', example: 'Please acknowledge receipt of this email by end of day.' },
  { word: 'clarify', zh: '澄清、說明清楚', definition: 'to make something easier to understand', example: 'Can you clarify the requirements for this project?' },
  { word: 'correspondence', zh: '通訊往來、信件', definition: 'written communication, especially emails or letters', example: 'All business correspondence should be kept on file for three years.' },
  { word: 'notify', zh: '通知、告知', definition: 'to officially inform someone about something', example: 'Please notify us if you need to reschedule the meeting.' },
  { word: 'summarize', zh: '摘要、總結', definition: 'to give a brief account of the main points', example: 'Could you summarize the key findings from the report?' },

  // Set 5: Meetings & Documents
  { word: 'agenda', zh: '議程、待議事項', definition: 'a list of items to be discussed in a meeting', example: 'The agenda for today\'s meeting has been sent to all participants.' },
  { word: 'circulate', zh: '傳閱、使流通', definition: 'to pass a document around to multiple people', example: 'Please circulate the revised report before Friday\'s meeting.' },
  { word: 'draft', zh: '草稿、初稿', definition: 'a preliminary version of a document', example: 'Please send me the first draft of the proposal by Monday.' },
  { word: 'minutes', zh: '會議記錄', definition: 'the written record of what was discussed in a meeting', example: 'The secretary will distribute the meeting minutes within 24 hours.' },
  { word: 'proposal', zh: '提案、企劃書', definition: 'a formal plan or suggestion submitted for approval', example: 'We submitted a detailed proposal for the new advertising campaign.' },

  // Set 6: Travel & Events
  { word: 'accommodate', zh: '住宿、容納', definition: 'to provide lodging, or to adapt to someone\'s needs', example: 'The conference center can accommodate up to 500 guests.' },
  { word: 'itinerary', zh: '行程表', definition: 'a planned schedule for a trip or event', example: 'I will send you the full itinerary for the business trip tomorrow.' },
  { word: 'reservation', zh: '預訂、預約', definition: 'an arrangement to hold something for future use', example: 'I made a hotel reservation for three nights next week.' },
  { word: 'transit', zh: '過境、轉運', definition: 'the process of moving through a place on the way to another', example: 'Passengers in transit do not need to clear immigration.' },
  { word: 'adjacent', zh: '相鄰的、毗連的', definition: 'next to or very near something', example: 'The conference room is adjacent to the main office on floor 3.' },

  // Set 7: Marketing & Sales
  { word: 'campaign', zh: '行銷活動、宣傳活動', definition: 'a series of organized activities to achieve a specific goal', example: 'The marketing campaign increased brand awareness by 30%.' },
  { word: 'consumer', zh: '消費者', definition: 'a person who buys and uses goods or services', example: 'Consumer feedback helped us significantly improve the product.' },
  { word: 'launch', zh: '推出、發佈', definition: 'to introduce a new product or service to the market', example: 'We plan to launch the new product line in the third quarter.' },
  { word: 'merchandise', zh: '商品、貨物', definition: 'goods available for sale in a store', example: 'The store offers a wide range of branded merchandise.' },
  { word: 'survey', zh: '調查、問卷', definition: 'a study to gather information or opinions from people', example: 'We conducted a customer survey to measure satisfaction levels.' },

  // Set 8: Operations
  { word: 'comply', zh: '遵守、照辦', definition: 'to follow rules, regulations, or requests', example: 'All employees must comply with the company\'s data security policy.' },
  { word: 'efficient', zh: '有效率的', definition: 'achieving maximum results with minimum wasted effort', example: 'We need a more efficient process for handling customer orders.' },
  { word: 'implement', zh: '執行、實施', definition: 'to put a plan or decision into action', example: 'The new system will be fully implemented by next month.' },
  { word: 'monitor', zh: '監控、持續追蹤', definition: 'to regularly observe and check something over time', example: 'We monitor website traffic and sales performance daily.' },
  { word: 'streamline', zh: '簡化、提升效率', definition: 'to make a process simpler and more efficient', example: 'We are streamlining our approval process to save time.' },

  // Set 9: Contracts & Legal
  { word: 'clause', zh: '條款', definition: 'a specific provision or section in a contract', example: 'The termination clause requires 30 days\' written notice.' },
  { word: 'liability', zh: '責任、負債', definition: 'legal responsibility for something', example: 'The company accepted full liability for the product defect.' },
  { word: 'negotiate', zh: '談判、協商', definition: 'to have discussions to reach a mutually acceptable agreement', example: 'We successfully negotiated a better deal with the supplier.' },
  { word: 'obligate', zh: '使負有義務', definition: 'to require someone by legal or moral duty', example: 'The contract obligates both parties to meet agreed deadlines.' },
  { word: 'terminate', zh: '終止、結束', definition: 'to bring a contract or employment to an end', example: 'The company decided to terminate the agreement early due to breaches.' },

  // Set 10: Customer Service
  { word: 'complaint', zh: '投訴、抱怨', definition: 'a formal expression of dissatisfaction', example: 'We received a complaint about unusually slow delivery times.' },
  { word: 'inquire', zh: '詢問、查詢', definition: 'to formally ask for information', example: 'Please inquire at the front desk for further assistance.' },
  { word: 'refund', zh: '退款', definition: 'money returned for a returned or cancelled item', example: 'The customer requested a full refund for the damaged product.' },
  { word: 'resolve', zh: '解決、處理', definition: 'to find a satisfactory solution to a problem', example: 'Our team resolved the customer\'s issue within 24 hours.' },
  { word: 'warranty', zh: '保固、保證書', definition: 'a written guarantee about a product\'s quality or lifespan', example: 'This product comes with a two-year manufacturer\'s warranty.' },

  // Set 11: Finance Advanced
  { word: 'audit', zh: '審計、查帳', definition: 'an official examination of financial accounts', example: 'The company undergoes an independent annual audit in December.' },
  { word: 'dividend', zh: '股息、分紅', definition: 'a share of company profits paid to shareholders', example: 'The company declared a dividend of $2 per share this year.' },
  { word: 'fiscal', zh: '財政的、會計年度的', definition: 'relating to government or company finances', example: 'Our fiscal year runs from January 1st to December 31st.' },
  { word: 'portfolio', zh: '投資組合、作品集', definition: 'a collection of investments or work samples', example: 'The fund manager oversees a diversified investment portfolio.' },
  { word: 'asset', zh: '資產', definition: 'something valuable owned by a company or person', example: 'Real estate is one of the company\'s most valuable assets.' },

  // Set 12: Workplace Relations
  { word: 'collaborate', zh: '合作、共同創作', definition: 'to work jointly with others on a project', example: 'The two departments collaborated closely on the new initiative.' },
  { word: 'constructive', zh: '建設性的', definition: 'useful and intended to help or improve something', example: 'Thank you for your constructive feedback on my presentation.' },
  { word: 'initiative', zh: '主動性、新計畫', definition: 'the ability to act independently; a new plan or program', example: 'She took the initiative to lead the community outreach project.' },
  { word: 'productive', zh: '有生產力的、富有成效的', definition: 'achieving significant results; effective and not wasteful', example: 'The meeting was very productive and resulted in clear action steps.' },
  { word: 'eligible', zh: '有資格的', definition: 'meeting the required conditions to do or receive something', example: 'Employees with over two years\' service are eligible for the bonus.' },

  // Set 13: Reporting
  { word: 'annual', zh: '每年的、年度的', definition: 'happening or produced once every year', example: 'The annual report will be released to shareholders next month.' },
  { word: 'comprehensive', zh: '全面的、詳盡的', definition: 'covering all or most aspects of something', example: 'We need a comprehensive review of all current marketing strategies.' },
  { word: 'quarterly', zh: '每季的、每季度的', definition: 'done or happening four times a year', example: 'Quarterly earnings exceeded analysts\' expectations by 12%.' },
  { word: 'preliminary', zh: '初步的、初期的', definition: 'coming before the main part or event as preparation', example: 'The preliminary results look very encouraging so far.' },
  { word: 'substantial', zh: '相當大的、重要的', definition: 'large in size, value, or importance', example: 'We made substantial progress on the expansion project this month.' },

  // Set 14: Technology
  { word: 'compatible', zh: '相容的、可並存的', definition: 'able to be used together without problems', example: 'Please ensure the new software is compatible with our current systems.' },
  { word: 'integrate', zh: '整合、結合', definition: 'to combine different parts into a unified whole', example: 'We will integrate the new payment system with the existing platform.' },
  { word: 'interface', zh: '介面', definition: 'a point where two systems or devices connect and interact', example: 'The updated user interface is much more intuitive and user-friendly.' },
  { word: 'malfunction', zh: '故障、運作異常', definition: 'to fail to work correctly', example: 'The server malfunctioned during the peak hours and caused delays.' },
  { word: 'upgrade', zh: '升級、提升', definition: 'to raise to a higher standard or more advanced version', example: 'We recommend upgrading to the latest version of the software.' },

  // Set 15: Supply Chain
  { word: 'inventory', zh: '庫存、存貨清單', definition: 'a complete list of all goods or materials in stock', example: 'We conduct a full inventory check at the end of each quarter.' },
  { word: 'logistics', zh: '物流、後勤', definition: 'the detailed coordination of complex operations', example: 'The logistics team manages all shipping and warehouse operations.' },
  { word: 'procurement', zh: '採購', definition: 'the process of obtaining goods or services for business use', example: 'Procurement costs rose by 8% due to global supply shortages.' },
  { word: 'shipment', zh: '一批貨、貨運', definition: 'a quantity of goods transported at one time', example: 'The shipment from the factory arrived three days ahead of schedule.' },
  { word: 'dispatch', zh: '發送、派遣', definition: 'to send goods or a person to a specific destination', example: 'All orders placed before noon will be dispatched the same day.' },

  // Set 16: Strategy
  { word: 'competitive', zh: '競爭性的、有競爭力的', definition: 'able to compete successfully against others', example: 'We offer competitive pricing to attract more enterprise clients.' },
  { word: 'diversify', zh: '多元化、分散', definition: 'to increase variety or spread risk across multiple areas', example: 'The company plans to diversify its revenue streams next year.' },
  { word: 'expand', zh: '擴展、擴大規模', definition: 'to increase in size, number, or scope', example: 'We are looking to expand into three new markets in Southeast Asia.' },
  { word: 'merge', zh: '合併', definition: 'to combine two or more organizations into one entity', example: 'The two media companies announced plans to merge next quarter.' },
  { word: 'sustainable', zh: '永續的、可持續的', definition: 'capable of being maintained without causing harm', example: 'We are committed to sustainable business practices for long-term growth.' },

  // Set 17: Presentation Skills
  { word: 'demonstrate', zh: '示範、展示', definition: 'to show clearly how something works or is done', example: 'She demonstrated the new feature to all department heads.' },
  { word: 'highlight', zh: '強調、突出重點', definition: 'to draw attention to the most important parts', example: 'I\'d like to highlight three key points from today\'s presentation.' },
  { word: 'outline', zh: '概述、列大綱', definition: 'to give a general description without full details', example: 'Let me outline the main objectives of the new project.' },
  { word: 'revise', zh: '修改、修訂', definition: 'to make changes to improve or correct something', example: 'Please revise the report based on the feedback from management.' },
  { word: 'reference', zh: '參考、引用、推薦人', definition: 'a source of information or a person who can vouch for you', example: 'Please provide two professional references with your application.' },

  // Set 18: Office Space
  { word: 'premises', zh: '場所、建築物', definition: 'a building and its land used for business', example: 'Smoking is strictly prohibited on company premises.' },
  { word: 'relocate', zh: '搬遷、重新安置', definition: 'to move to a different location', example: 'The head office will relocate to a larger building in July.' },
  { word: 'renovate', zh: '翻新、整修', definition: 'to repair and improve a building or space', example: 'The conference floor is being renovated this summer.' },
  { word: 'accessible', zh: '可進入的、方便使用的', definition: 'easy to reach, use, or understand', example: 'The new venue is accessible by public transport from all areas.' },
  { word: 'facility', zh: '設施、場所', definition: 'a place or building designed for a particular activity', example: 'Our training facility can accommodate up to 50 participants.' },

  // Set 19: Time Management
  { word: 'deadline', zh: '截止日期', definition: 'the latest time by which something must be completed', example: 'The proposal deadline is this coming Friday at 5 PM.' },
  { word: 'overdue', zh: '逾期的、過期的', definition: 'past the time when it was supposed to happen', example: 'The payment is two weeks overdue and we need to follow up.' },
  { word: 'postpone', zh: '延期、推遲', definition: 'to arrange for something to happen at a later time', example: 'We had to postpone the product launch due to technical issues.' },
  { word: 'tentative', zh: '暫定的、試探性的', definition: 'not certain or confirmed yet', example: 'We have a tentative agreement, but it still requires legal review.' },
  { word: 'priority', zh: '優先事項、優先順序', definition: 'the most important task that must be dealt with first', example: 'Customer satisfaction is our highest priority this quarter.' },

  // Set 20: Professional Development
  { word: 'certification', zh: '認證、證照', definition: 'an official document proving competence or qualifications', example: 'She obtained a project management certification last year.' },
  { word: 'expertise', zh: '專業知識、專長', definition: 'a high level of skill or knowledge in a subject', example: 'We need someone with expertise in digital marketing analytics.' },
  { word: 'proficient', zh: '熟練的、精通的', definition: 'competent and skilled at something', example: 'Candidates should be proficient in English and Mandarin.' },
  { word: 'seminar', zh: '研討會、講習課', definition: 'a conference or educational session on a specific topic', example: 'All senior managers attended the leadership seminar in Singapore.' },
  { word: 'versatile', zh: '多才多藝的、用途廣泛的', definition: 'able to adapt to many different tasks or situations', example: 'We are looking for a versatile team player who can handle multiple roles.' },
];
