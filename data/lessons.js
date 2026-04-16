// =====================================================
// 英文課程資料庫
// 新增課程：在 LESSONS_DATA 陣列中加入新物件即可
// =====================================================

const LESSONS_DATA = [
  {
    id: 'b2c-01',
    courseTitle: '主修會話 B2c',
    lessonNumber: 1,
    title: 'Rules of Success',
    titleZh: '成功的至要秘訣',
    classDate: '2026-04-14', // 上課日期 YYYY-MM-DD

    // 本課概覽（預習時顯示）
    overview: [
      '5 位科技巨頭的成功語錄',
      'Elon Musk 英文傳記閱讀',
      '閱讀理解：企業配對產業',
      '5 個職場英文俚語'
    ],

    // 名人語錄
    quotes: [
      {
        id: 'q1',
        text: "Don't tell people what you're going to do. Do it and shock them. And after shocking them, stay silent. Move onto your next project. Keep shocking, keep enjoying.",
        shortText: "Don't tell people what you're going to do. Do it and shock them.",
        author: 'Jeff Bezos'
      },
      {
        id: 'q2',
        text: "I believe you have to be willing to be misunderstood if you're going to innovate.",
        shortText: "Be willing to be misunderstood if you're going to innovate.",
        author: 'Jeff Bezos'
      },
      {
        id: 'q3',
        text: "I will always choose a lazy person to do a difficult job, because he will find an easy way to do it.",
        shortText: "Choose a lazy person for a difficult job — they'll find an easy way.",
        author: 'Bill Gates'
      },
      {
        id: 'q4',
        text: "Most people overestimate what they can do in one year and underestimate what they can do in ten years.",
        shortText: "People overestimate one year, underestimate ten years.",
        author: 'Bill Gates'
      },
      {
        id: 'q5',
        text: "Have the courage to follow your heart and intuition. They somehow know what you truly want to become.",
        shortText: "Have the courage to follow your heart and intuition.",
        author: 'Steve Jobs'
      },
      {
        id: 'q6',
        text: "Let's go invent tomorrow rather than worrying about what happened yesterday.",
        shortText: "Invent tomorrow rather than worrying about yesterday.",
        author: 'Steve Jobs'
      },
      {
        id: 'q7',
        text: "If something is important enough, you do it even if the odds are not in your favor.",
        shortText: "Do it even if the odds are not in your favor.",
        author: 'Elon Musk'
      },
      {
        id: 'q8',
        text: "Many people will panic to find a charger before their phone dies. But won't panic to find a plan before their dream dies.",
        shortText: "People panic for a phone charger, but not for their dying dream.",
        author: 'Elon Musk'
      },
      {
        id: 'q9',
        text: "The biggest risk is not taking any risk.",
        shortText: "The biggest risk is not taking any risk.",
        author: 'Mark Zuckerberg'
      },
      {
        id: 'q10',
        text: "In the end people will judge you anyway, so don't live your life impressing others.",
        shortText: "Don't live your life impressing others.",
        author: 'Mark Zuckerberg'
      }
    ],

    // 討論問題
    discussion: [
      {
        id: 'd1',
        question: "How do you interpret the idea of taking action and shocking others with your accomplishments without boasting about them beforehand?",
        hint: "想想看：默默努力然後讓成果說話，你認同這個方式嗎？"
      },
      {
        id: 'd2',
        question: "What are your thoughts on the concept of being misunderstood as a necessary part of innovation?",
        hint: "有沒有人曾經誤解你的想法？你是怎麼回應的？"
      },
      {
        id: 'd3',
        question: "Do you agree with the notion of choosing a 'lazy' person for a difficult job because they might find an easier way to accomplish it?",
        hint: "在你的工作經驗中，有沒有見過這樣的例子？"
      },
      {
        id: 'd4',
        question: "Can you think of a time when you pursued something despite the odds being against you? What motivated you to do so?",
        hint: "說一個你不顧困難堅持到底的故事..."
      },
      {
        id: 'd5',
        question: "What do you think is the greatest risk: taking risks and potentially failing, or not taking any risks at all?",
        hint: "試著用英文說出你的觀點，例如：I think the biggest risk is..."
      }
    ],

    // 閱讀文章
    reading: {
      subject: 'Elon Musk',
      sections: [
        {
          title: 'Early Life and Education',
          content: 'Elon Musk was born on June 28, 1971, in Pretoria, South Africa. He showed an early interest in computers and technology, teaching himself programming at a young age. Musk studied physics and economics at the University of Pennsylvania before pursuing a Ph.D. in energy physics at Stanford University, which he dropped out of after just two days to focus on his entrepreneurial ventures.'
        },
        {
          title: 'Founding PayPal',
          content: 'Musk co-founded Zip2, a software company, in 1996 and sold it four years later for over $300 million. He then went on to co-found X.com, an online payment company, which later became PayPal. PayPal was acquired by eBay in 2002 for $1.5 billion, and Musk received $165 million from the sale.'
        },
        {
          title: 'Tesla, Inc.',
          content: "Musk is the CEO and lead designer of Tesla, Inc., an electric vehicle and clean energy company. He joined Tesla in 2004 and has been instrumental in its growth and success. Under Musk's leadership, Tesla has revolutionized the electric vehicle industry with vehicles like the Model S, Model 3, Model X, and Model Y."
        },
        {
          title: 'SpaceX',
          content: "Musk founded SpaceX in 2002 with the goal of reducing space transportation costs and enabling the colonization of Mars. SpaceX has achieved numerous milestones under Musk's leadership, including the development of the Falcon 1, Falcon 9, and Falcon Heavy rockets, as well as the Dragon spacecraft. The company has contracts with NASA for satellite launches and crewed missions to the International Space Station."
        },
        {
          title: 'Other Ventures',
          content: 'In addition to Tesla and SpaceX, Musk has been involved in various other ventures. He co-founded Neuralink, a neurotechnology company focused on developing brain-computer interface technology. Musk also founded The Boring Company, which aims to reduce traffic congestion through the construction of underground tunnels for transportation.'
        }
      ]
    },

    // 閱讀理解選擇題
    comprehension: [
      {
        id: 'c1',
        question: 'Where was Elon Musk born?',
        options: ['United States', 'South Africa', 'Canada', 'United Kingdom'],
        answer: 'South Africa',
        explanation: 'Elon Musk was born in Pretoria, South Africa.'
      },
      {
        id: 'c2',
        question: "How long did Musk stay at Stanford University before dropping out?",
        options: ['Two weeks', 'Two months', 'Two days', 'Two years'],
        answer: 'Two days',
        explanation: 'He dropped out after just two days to focus on entrepreneurial ventures.'
      },
      {
        id: 'c3',
        question: 'Which company later became PayPal?',
        options: ['Zip2', 'X.com', 'SpaceX', 'Tesla'],
        answer: 'X.com',
        explanation: 'Musk co-founded X.com, which later became PayPal, acquired by eBay for $1.5 billion.'
      },
      {
        id: 'c4',
        question: "Which of Musk's companies disrupts the aerospace industry?",
        options: ['Tesla', 'The Boring Company', 'SpaceX', 'Neuralink'],
        answer: 'SpaceX',
        explanation: 'SpaceX focuses on space transportation — the aerospace industry.'
      },
      {
        id: 'c5',
        question: 'Which company focuses on brain-computer interface technology?',
        options: ['SpaceX', 'Tesla', 'The Boring Company', 'Neuralink'],
        answer: 'Neuralink',
        explanation: 'Neuralink is a neurotechnology company developing brain-computer interfaces.'
      },
      {
        id: 'c6',
        question: "What is the main goal of The Boring Company?",
        options: [
          'Electric vehicle production',
          'Space colonization',
          'Reducing traffic congestion via underground tunnels',
          'Brain-computer interfaces'
        ],
        answer: 'Reducing traffic congestion via underground tunnels',
        explanation: 'The Boring Company aims to reduce traffic congestion through underground tunnels.'
      }
    ],

    // 俚語
    idioms: [
      {
        id: 'i1',
        phrase: 'hit the ground running',
        meaning: '立刻全力投入，馬上展開行動',
        englishMeaning: 'to start something and proceed quickly with great energy',
        example: 'After joining the new company, Sarah hit the ground running by immediately taking on challenging projects.',
        exampleZh: 'Sarah 一加入新公司就馬上全力投入，立刻承接了具挑戰性的專案。'
      },
      {
        id: 'i2',
        phrase: 'make headway',
        meaning: '取得進展，向前推進',
        englishMeaning: 'to make progress, especially when it is slow or difficult',
        example: 'Despite facing initial setbacks, the team made headway by brainstorming innovative solutions.',
        exampleZh: '即使一開始遭遇挫折，團隊仍透過集思廣益而取得進展。'
      },
      {
        id: 'i3',
        phrase: 'knock it out of the park',
        meaning: '表現極出色，大獲成功',
        englishMeaning: 'to do something extremely well; to achieve outstanding success',
        example: 'With his captivating presentation, John knocked it out of the park during the sales pitch.',
        exampleZh: 'John 的簡報非常精彩，在這次業務提案中表現極為亮眼。'
      },
      {
        id: 'i4',
        phrase: 'play your cards right',
        meaning: '審時度勢，善用機會獲得最佳結果',
        englishMeaning: 'to deal with a situation in the best way to get the result you want',
        example: 'By carefully strategizing and seizing opportunities, Emily played her cards right and advanced quickly.',
        exampleZh: 'Emily 謹慎規劃、把握機會，因此在事業上快速晉升。'
      },
      {
        id: 'i5',
        phrase: 'make the cut',
        meaning: '達到標準，通過篩選',
        englishMeaning: 'to be good enough to be chosen or included',
        example: 'After a rigorous selection process, only the most qualified candidates made the cut.',
        exampleZh: '經過嚴格的篩選，只有最優秀的應徵者通過了。'
      }
    ],

    // 俚語填空練習
    idiomExercises: [
      {
        id: 'ie1',
        sentence: 'After a rigorous selection process, only the most qualified candidates ________ and were offered positions at the prestigious law firm.',
        answer: 'made the cut',
        options: ['hit the ground running', 'made the cut', 'made headway', 'played their cards right'],
        idiomId: 'i5'
      },
      {
        id: 'ie2',
        sentence: 'With his captivating presentation and persuasive arguments, John ________ during the sales pitch, securing a lucrative deal for the company.',
        answer: 'knocked it out of the park',
        options: ['made headway', 'hit the ground running', 'knocked it out of the park', 'made the cut'],
        idiomId: 'i3'
      },
      {
        id: 'ie3',
        sentence: 'By carefully strategizing and seizing opportunities, Emily ________ and advanced quickly in her career.',
        answer: 'played her cards right',
        options: ['knocked it out of the park', 'played her cards right', 'made headway', 'hit the ground running'],
        idiomId: 'i4'
      },
      {
        id: 'ie4',
        sentence: 'After joining the new company, Sarah ________ by immediately taking on challenging projects and impressing her colleagues.',
        answer: 'hit the ground running',
        options: ['made the cut', 'made headway', 'played her cards right', 'hit the ground running'],
        idiomId: 'i1'
      },
      {
        id: 'ie5',
        sentence: 'Despite facing initial setbacks, the team ________ by brainstorming innovative solutions and collaborating effectively.',
        answer: 'made headway',
        options: ['made headway', 'knocked it out of the park', 'made the cut', 'hit the ground running'],
        idiomId: 'i2'
      }
    ],

    // 關鍵字彙
    vocabulary: [
      { word: 'entrepreneur', zh: '創業家', definition: 'a person who starts and runs businesses', example: 'Elon Musk is a prominent entrepreneur.' },
      { word: 'innovate', zh: '創新', definition: 'to introduce new ideas or methods', example: "Be willing to be misunderstood if you're going to innovate." },
      { word: 'intuition', zh: '直覺', definition: 'the ability to understand something without reasoning', example: 'Have the courage to follow your heart and intuition.' },
      { word: 'misunderstood', zh: '被誤解的', definition: 'interpreted incorrectly by others', example: 'Many great innovators were misunderstood at first.' },
      { word: 'overestimate', zh: '高估', definition: 'to think something is greater than it really is', example: 'People overestimate what they can do in one year.' },
      { word: 'underestimate', zh: '低估', definition: 'to think something is less important than it really is', example: 'People underestimate what they can do in ten years.' },
      { word: 'entrepreneurial', zh: '創業的', definition: 'relating to starting and running a business', example: 'He dropped out to focus on his entrepreneurial ventures.' },
      { word: 'instrumental', zh: '起關鍵作用的', definition: 'playing an important role in something', example: "Musk has been instrumental in Tesla's success." },
      { word: 'prominent', zh: '知名的，傑出的', definition: 'important and well-known', example: 'Elon Musk is a prominent entrepreneur.' },
      { word: 'rigorous', zh: '嚴格的', definition: 'extremely thorough and careful', example: 'After a rigorous selection process, only the best made the cut.' }
    ]
  }

  // ── 下一堂課加在這裡 ──
  // {
  //   id: 'b2c-02',
  //   lessonNumber: 2,
  //   classDate: '2026-04-17',
  //   ...
  // }
];
