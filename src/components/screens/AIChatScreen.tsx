import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  XCircle, 
  Heart, 
  Bot, 
  ShieldAlert, 
  Apple, 
  Coffee, 
  HelpCircle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { calculateCyclePrediction, formatDateISO } from '../../lib/cycleMath';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  dosAndDonts?: {
    dos: string[];
    donts: string[];
  };
  isAlert?: boolean;
}

export const AIChatScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { profile, periodLogs } = useApp();

  const isTelugu = i18n.language === 'te';
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'dodont'>('chat');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'm-1',
      sender: 'ai',
      text: isTelugu
        ? `నమస్తే! నేను మీ వ్యక్తిగత ఆరోగ్య AI సహచరిని 🌸. మీ పీరియడ్స్, మూడ్, లేదా శారీరక మార్పుల గురించి ఏదైనా అడగండి. ఏం చేయాలో, ఏం చేయకూడదో నేను మీకు సున్నితంగా వివరిస్తాను.`
        : `Hello! I'm your private SheOra Health Companion 🌸. You can ask me anything about your cycle, cramps, what foods help, or what to do and what NOT to do during each phase.`,
      timestamp: 'Just now',
      dosAndDonts: {
        dos: [
          isTelugu ? 'రోజూ గోరువెచ్చని నీరు లేదా జీలకర్ర కషాయం త్రాగండి' : 'Sip warm water or cumin-ginger tea for cramps',
          isTelugu ? 'రక్తస్రావం ఎక్కువగా ఉన్నప్పుడు విశ్రాంతి తీసుకోండి' : 'Prioritize restorative sleep during heavy flow days',
          isTelugu ? 'ఐరన్ పుష్కలంగా ఉండే బెల్లం, పాలకూర తినండి' : 'Replenish iron with jaggery, spinach, and lentils'
        ],
        donts: [
          isTelugu ? 'పీరియడ్స్ సమయంలో ఎక్కువ కెఫిన్ / చల్లటి పానీయాలు తీసుకోవద్దు' : 'Avoid excess caffeine or iced drinks that increase uterine spasms',
          isTelugu ? 'ప్యాడ్‌ను 5 గంటలకు మించి ఉంచవద్దు' : 'Never keep a single pad for more than 5-6 hours',
          isTelugu ? 'తీవ్రమైన క్రాంప్స్‌ను నిర్లక్ష్యం చేయవద్దు' : 'Don\'t ignore persistent severe pain (>8/10)'
        ]
      }
    }
  ]);

  const quickPrompts = isTelugu ? [
    'పీరియడ్స్ నొప్పులు తగ్గడానికి ఏం చేయాలి?',
    'పీరియడ్స్ సమయంలో ఏం తినకూడదు?',
    'PCOS ఉన్నప్పుడు ఎలాంటి జాగ్రత్తలు తీసుకోవాలి?',
    'అండోత్సర్గ సమయంలో వ్యాయామం చేయవచ్చా?',
  ] : [
    'What should I do for painful cramps?',
    'What to do & what NOT to do on my period?',
    'What foods should I avoid with PCOS?',
    'Is it safe to do yoga or workouts now?',
  ];

  // Specific Dos and Donts reference for all phases & conditions
  const dosAndDontsByTopic = {
    period: {
      title: isTelugu ? 'పీరియడ్స్ సమయంలో చేయవలసినవి & చేయకూడనివి' : 'During Your Period: Do’s & Don’ts',
      dos: [
        isTelugu ? 'ప్రతి 4-6 గంటలకు ప్యాడ్ మార్చండి, రాత్రికి సౌకర్యవంతమైన ప్యాడ్ వాడండి' : 'Change sanitary pads every 4–6 hours to inhibit bacterial growth.',
        isTelugu ? 'గోరువెచ్చని నీటితో స్నానం లేదా పొత్తికడుపుపై హాట్ వాటర్ బ్యాగ్ ఉపయోగించండి' : 'Use a warm heating bag on lower abdomen to relax uterine muscles.',
        isTelugu ? 'ఐరన్, మెగ్నీషియం సమృద్ధిగా ఉండే రాగి సంగటి, నువ్వుల ఉండలు, ఆకుకూరలు తినండి' : 'Eat warm, nourishing foods: lentils, ragi, jaggery, and sesame laddu for iron.',
        isTelugu ? 'రోజూ కనీసం 2.5-3 లీటర్ల గోరువెచ్చని నీరు త్రాగండి' : 'Stay well-hydrated with warm water, herbal teas, and thin rasam.'
      ],
      donts: [
        isTelugu ? 'అధిక కాఫీ, టీ, లేదా ఎనర్జీ డ్రింక్స్ త్రాగవద్దు (ఇవి నొప్పులను పెంచుతాయి)' : 'Don’t overconsume coffee, black tea, or soda—caffeine constricts pelvic blood vessels.',
        isTelugu ? 'సువాసన గల సబ్బులు లేదా ఇంటీమేట్ వాష్‌లతో లోపలి భాగాన్ని శుభ్రం చేయవద్దు' : 'Don’t use scented washes, douching, or harsh chemicals inside the vagina.',
        isTelugu ? 'భారీ బరువులు ఎత్తే తీవ్రమైన వ్యాయామాలు చేయవద్దు' : 'Avoid high-intensity strenuous workouts on days 1 & 2; choose gentle walks.',
        isTelugu ? 'ఎక్కువ ఉప్పు, చిప్స్ తినవద్దు—ఇది కడుపు ఉబ్బరాన్ని (Bloating) పెంచుతుంది' : 'Avoid ultra-salty processed snacks that worsen fluid retention and bloating.'
      ]
    },
    pcos: {
      title: isTelugu ? 'PCOS / PCOD: జాగ్రత్తలు & నియమాలు' : 'PCOS / PCOD Management: Do’s & Don’ts',
      dos: [
        isTelugu ? 'చిరుధాన్యాలు (జొన్నలు, రాగులు, సజ్జలు) మరియు పీచు పదార్థాలు తినండి' : 'Focus on low-glycemic complex carbs: millets (jowar, ragi, bajra), oats, and fiber.',
        isTelugu ? 'భోజనంలో ప్రతిసారీ ప్రోటీన్ (పప్పులు, పనీర్, గుడ్లు) చేర్చుకోండి' : 'Pair every meal with quality protein (dal, paneer, eggs, sprouts) to balance insulin.',
        isTelugu ? 'రోజూ 30 నిమిషాలు వేగంగా నడవండి లేదా యోగా / స్ట్రెంత్ ట్రైనింగ్ చేయండి' : 'Engage in 30 minutes of consistent brisk walking or gentle resistance training.',
        isTelugu ? 'రాత్రి 10 గంటల కల్లా నిద్రపోవడానికి ప్రయత్నించండి (హార్మోన్ల సమతుల్యత కోసం)' : 'Maintain regular 7–8 hours of consistent sleep to lower cortisol stress levels.'
      ],
      donts: [
        isTelugu ? 'చక్కెర, మైదా, బేకరీ స్వీట్స్ అధికంగా తినవద్దు' : 'Don’t consume refined sugars, maida bakery products, or sweet sodas.',
        isTelugu ? 'భోజనం మానేయవద్దు (క్రాష్ డైటింగ్ ఇన్సులిన్‌ను మరింత అస్తవ్యస్తం చేస్తుంది)' : 'Don’t skip breakfast or do harsh crash starvation diets.',
        isTelugu ? 'తీవ్రమైన మానసిక ఒత్తిడిని భరించవద్దు—సహాయం తీసుకోండి' : 'Don’t bottle up stress—chronic high cortisol exacerbates androgen excess.',
        isTelugu ? 'స్వయంగా హార్మోన్ మందులు లేదా సప్లిమెంట్లు వేసుకోవద్దు' : 'Don’t take unprescribed hormonal pills without consulting a gynecologist.'
      ]
    },
    cramps: {
      title: isTelugu ? 'కడుపు నొప్పులు & క్రాంప్స్: తక్షణ ఉపశమనం' : 'Painful Cramps: Relief Do’s & Don’ts',
      dos: [
        isTelugu ? 'జీలకర్ర, అల్లం, దాల్చిన చెక్క వేసి మరిగించిన నీరు త్రాగండి' : 'Brew fresh ginger, cumin seeds (jeera), and a dash of jaggery into warm tea.',
        isTelugu ? 'బాలసన (Child\'s Pose), మార్జర్యాసన (Cat-Cow) వంటి సున్నితమైన యోగాసనాలు వేయండి' : 'Gently stretch with Balasana (Child’s Pose) and Supta Baddha Konasana.',
        isTelugu ? 'నడుము మరియు పొత్తికడుపుపై నువ్వుల నూనెతో తేలికగా మసాజ్ చేయండి' : 'Gentle circular massage with warm sesame or lavender oil on the lower back.',
        isTelugu ? 'నొప్పి తీవ్రంగా ఉంటే డాక్టర్ సూచించిన పెయిన్ రిలీవర్ తీసుకోండి' : 'If pain disrupts movement, consult your doctor for safe anti-inflammatory guidance.'
      ],
      donts: [
        isTelugu ? 'చల్లటి ఐస్ వాటర్ లేదా ఫ్రిజ్ ఆహారాలు తీసుకోవద్దు' : 'Don’t drink ice-cold water or heavy ice creams during peak cramping.',
        isTelugu ? 'రోజంతా ఒకే చోట కదలకుండా పడుకోవద్దు (చిన్న నడక రక్తప్రసరణను పెంచుతుంది)' : 'Don’t stay completely immobile for 12 hours—light slow pacing helps blood flow.',
        isTelugu ? 'ఖాళీ కడుపుతో పెయిన్ కిల్లర్లు వేసుకోవద్దు' : 'Never take pain relievers on an empty stomach.',
        isTelugu ? 'నొప్పి 8/10 దాటి కళ్లు తిరుగుతుంటే ఇంట్లోనే కూర్చోవద్దు (వెంటనే డాక్టర్‌ను సంప్రదించండి)' : 'Don’t ignore unbearable 8+/10 pain with fainting—seek prompt clinic care.'
      ]
    }
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateAIResponse = (userText: string): ChatMessage => {
    const lower = userText.toLowerCase();

    // Red flag detection
    if (lower.includes('heavy bleeding') || lower.includes('soaking') || lower.includes('faint') || lower.includes('severe pain') || lower.includes('blood clot') || lower.includes('చాలా రక్తం') || lower.includes('తీవ్రమైన నొప్పి')) {
      return {
        id: 'm-' + Date.now(),
        sender: 'ai',
        text: isTelugu
          ? `⚠️ అత్యవసర ఆరోగ్య సూచన: మీరు వివరించిన లక్షణాలు (తీవ్ర రక్తస్రావం లేదా అత్యధిక నొప్పి) తక్షణ వైద్య సహాయం అవసరమైనవిగా కనిపిస్తున్నాయి. దయచేసి సమీపంలోని ఆసుపత్రికి వెళ్ళండి లేదా ఉచిత తెలంగాణ అత్యవసర సేవలు (108 / 112) లేదా మహిళా హెల్ప్‌లైన్ (181) కు కాల్ చేయండి.`
          : `⚠️ Urgent Health Notice: The symptoms you described (very heavy bleeding, soaking pads hourly, or severe pain) warrant prompt clinical attention. Please visit an urgent care clinic or call emergency services (108 / 112) or the Women's Helpline (181).`,
        timestamp: 'Just now',
        isAlert: true,
        dosAndDonts: {
          dos: [
            isTelugu ? 'వెంటనే వైద్యుడిని లేదా అత్యవసర క్లినిక్‌ను సంప్రదించండి' : 'Seek immediate medical evaluation from a registered doctor.',
            isTelugu ? 'మీరు మారుస్తున్న ప్యాడ్ల సంఖ్యను డాక్టర్‌కు తెలియజేయండి' : 'Keep count of pads soaked per hour to report to the doctor.',
            isTelugu ? 'కళ్లు తిరుగుతుంటే పడుకుని కాళ్లను కొద్దిగా పైకి పెట్టండి' : 'Lie down with feet elevated if you feel faint or lightheaded.'
          ],
          donts: [
            isTelugu ? 'తీవ్రమైన రక్తస్రావాన్ని సాధారణమైనదిగా భావించి ఇంట్లోనే ఉండవద్దు' : 'Don’t wait out heavy hemorrhaging at home.',
            isTelugu ? 'స్వయంగా అధిక మందులు వేసుకోవద్దు' : 'Don’t self-medicate with high-dose aspirin or unprescribed pills.'
          ]
        }
      };
    }

    // Cramps response
    if (lower.includes('cramp') || lower.includes('pain') || lower.includes('నొప్పి') || lower.includes('క్రాంప్')) {
      return {
        id: 'm-' + Date.now(),
        sender: 'ai',
        text: isTelugu
          ? `రుతుక్రమ నొప్పులు (క్రాంప్స్) గర్భాశయ కండరాలు సంకోచించడం వల్ల వస్తాయి. ఇక్కడ మీకు సహాయపడే చిట్కాలు ఉన్నాయి:`
          : `Menstrual cramps happen when prostaglandins cause uterine muscle contractions. Here is your personalized action guide:`,
        timestamp: 'Just now',
        dosAndDonts: {
          dos: [
            isTelugu ? 'పొత్తికడుపుపై హీటింగ్ ప్యాడ్ లేదా వేడినీటి కాపడం పెట్టండి' : 'Apply a heating pad on your lower tummy for 15–20 minutes.',
            isTelugu ? 'జీలకర్ర, అల్లం వేసి మరిగించిన గోరువెచ్చని నీరు త్రాగండి' : 'Drink warm jeera-ginger water; it naturally eases pelvic spasms.',
            isTelugu ? 'తేలికపాటి యోగాసనాలు (బాలాసనం) లేదా నెమ్మదిగా నడవండి' : 'Try gentle child\'s pose (Balasana) or a relaxed 10-minute walk.'
          ],
          donts: [
            isTelugu ? 'చల్లటి నీరు, ఐస్ క్రీమ్స్, శీతల పానీయాలు తీసుకోవద్దు' : 'Avoid cold drinks and ice creams; warmth supports blood flow.',
            isTelugu ? 'కాఫీ, బ్లాక్ టీ అధికంగా త్రాగవద్దు' : 'Don’t drink excessive caffeine as it narrows blood vessels.',
            isTelugu ? 'ఎక్కువ ఉప్పు ఉండే చిప్స్, ఫాస్ట్ ఫుడ్స్ తినవద్దు' : 'Cut back on high-sodium snacks that aggravate bloating.'
          ]
        }
      };
    }

    // PCOS response
    if (lower.includes('pcos') || lower.includes('pcod') || lower.includes('irregular') || lower.includes('పీసీఓఎస్')) {
      return {
        id: 'm-' + Date.now(),
        sender: 'ai',
        text: isTelugu
          ? `PCOS అనేది ఇన్సులిన్ మరియు హార్మోన్ల సమతుల్యతతో కూడిన సహజ నమూనా. సరైన జీవనశైలితో దీన్ని అద్భుతంగా నిర్వహించవచ్చు:`
          : `PCOS is deeply tied to insulin sensitivity and metabolic rhythms. Here is a compassionate, practical guide for what to do and what to avoid:`,
        timestamp: 'Just now',
        dosAndDonts: {
          dos: [
            isTelugu ? 'జొన్నలు, రాగులు, పప్పులు, మొలకెత్తిన గింజలు తినండి' : 'Prioritize millets, sprouts, whole lentils, and colorful veggies.',
            isTelugu ? 'రోజూ క్రమం తప్పకుండా 30 నిమిషాల వ్యాయామం లేదా యోగా చేయండి' : 'Build a regular routine: 30 minutes of walking or yoga.',
            isTelugu ? 'మీ సైకిల్ తేదీలను మరియు మార్పులను SheOra లో నమోదు చేయండి' : 'Keep logging your cycles to share trends with your gynecologist.'
          ],
          donts: [
            isTelugu ? 'చక్కెర, మైదా, ప్రాసెస్ చేసిన ఆహారాలు ఎక్కువగా తినవద్దు' : 'Minimize refined sugar, white bakery breads, and sugary chai.',
            isTelugu ? 'అల్పాహారం (టిఫిన్) మానవద్దు; సమయానికి భోజనం చేయండి' : 'Don’t starve yourself or skip meals—keep blood sugar steady.',
            isTelugu ? 'నిద్రలేమిని అలవాటుగా మార్చుకోవద్దు' : 'Don’t sacrifice sleep; chronic sleep deprivation spikes androgens.'
          ]
        }
      };
    }

    // General fallback
    return {
      id: 'm-' + Date.now(),
      sender: 'ai',
      text: isTelugu
        ? `మీరు అడిగిన విషయానికి నా సూచన: మీ శరీరాన్ని సున్నితంగా గమనించండి. సమతుల్య ఆహారం, సమయానికి నిద్ర, మరియు తగినంత నీరు మీ హార్మోన్లను సహజంగా బ్యాలెన్స్ చేయడంలో సహాయపడతాయి 💜.`
        : `Here is a gentle reminder for your body today: listening to your natural rhythm, nourishing with warm Indian home-cooked foods, and honoring rest when your body asks for it are the best wellness steps 💜.`,
      timestamp: 'Just now',
      dosAndDonts: {
        dos: [
          isTelugu ? 'రోజూ కనీసం 8 గ్లాసుల గోరువెచ్చని నీరు త్రాగండి' : 'Drink plenty of water and warm fluids throughout the day.',
          isTelugu ? 'రాత్రి త్వరగా నిద్రపోయి విశ్రాంతి తీసుకోండి' : 'Protect your 7–8 hours of quality restorative sleep.',
          isTelugu ? 'మీ డాక్టర్‌తో చర్చించడానికి ప్రశ్నలను నోట్ చేసుకోండి' : 'Log any recurring symptoms to review with your doctor.'
        ],
        donts: [
          isTelugu ? 'శారీరక అలసట ఉన్నప్పుడు మిమ్మల్ని మీరు ఒత్తిడికి గురిచేయవద్దు' : 'Don’t push yourself beyond your energy limits today.',
          isTelugu ? 'వైద్య సలహా లేకుండా ఇంటర్నెట్ చూసి భయపడవద్దు' : 'Don’t let unverified internet claims cause anxiety; trust calm facts.'
        ]
      }
    };
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    const userMsg: ChatMessage = {
      id: 'm-' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      const response = generateAIResponse(userText);
      setMessages(prev => [...prev, response]);
    }, 450);
  };

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto space-y-4 animate-fadeIn">
      {/* Top Banner with Sub-tabs */}
      <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-rose-50 p-4 rounded-3xl border border-pink-100 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center text-white shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>SheOra AI Companion</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              </h2>
              <p className="text-[11px] text-slate-500">
                {isTelugu ? 'వ్యక్తిగత ఆరోగ్య AI • ఏం చేయాలో, ఏం చేయకూడదో తెలుసుకోండి' : 'Private health chat & Do’s / Don’ts guidance'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab switch between Chat and Do's & Don'ts */}
        <div className="mt-3.5 flex bg-white/80 p-1 rounded-2xl border border-pink-200/70 shadow-2xs">
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeSubTab === 'chat'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            💬 {isTelugu ? 'AI తో మాట్లాడండి' : 'Chat with AI'}
          </button>
          <button
            onClick={() => setActiveSubTab('dodont')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeSubTab === 'dodont'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📋 {isTelugu ? 'ఏం చేయాలి / చేయకూడదు' : 'What To Do & Not To Do'}
          </button>
        </div>
      </div>

      {/* VIEW 1: CHAT INTERFACE */}
      {activeSubTab === 'chat' && (
        <div className="space-y-3">
          {/* Quick Prompt Pills */}
          <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => {
                  setInputMessage(qp);
                }}
                className="px-3 py-1.5 rounded-full bg-white border border-pink-200 text-slate-700 hover:border-pink-400 hover:bg-pink-50/50 whitespace-nowrap shadow-2xs transition"
              >
                ✨ {qp}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="bg-white/80 backdrop-blur-xs rounded-3xl p-4 border border-pink-100 shadow-2xs min-h-[380px] max-h-[460px] overflow-y-auto space-y-3">
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-br-none'
                      : m.isAlert
                      ? 'bg-rose-50 border border-rose-200 text-rose-950 rounded-bl-none'
                      : 'bg-pastel-lavender/60 border border-purple-100 text-slate-800 rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>

                  {/* Embedded Do's and Don'ts Card inside AI Response */}
                  {m.dosAndDonts && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 space-y-2">
                      {/* Dos */}
                      <div className="bg-emerald-50/90 p-2.5 rounded-xl border border-emerald-200 text-emerald-950">
                        <span className="font-bold text-[11px] flex items-center gap-1 text-emerald-800 mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {isTelugu ? 'చేయవలసినవి (What to Do):' : 'What to Do (Recommended):'}
                        </span>
                        <ul className="list-disc pl-4 space-y-1 text-[10.5px]">
                          {m.dosAndDonts.dos.map((d, idx) => (
                            <li key={idx}>{d}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Donts */}
                      <div className="bg-rose-50/90 p-2.5 rounded-xl border border-rose-200 text-rose-950">
                        <span className="font-bold text-[11px] flex items-center gap-1 text-rose-800 mb-1">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          {isTelugu ? 'చేయకూడనివి (What NOT to Do):' : 'What NOT to Do (Avoid):'}
                        </span>
                        <ul className="list-disc pl-4 space-y-1 text-[10.5px]">
                          {m.dosAndDonts.donts.map((d, idx) => (
                            <li key={idx}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-0.5 px-1">{m.timestamp}</span>
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} className="relative flex items-center">
            <input
              type="text"
              placeholder={isTelugu ? 'ఏమైనా అడగండి (ఉదా: పీరియడ్స్ లో ఏం తినాలి?)...' : 'Ask anything (e.g., foods for cramps, PCOS tips)...'}
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              className="w-full text-xs pl-4 pr-12 py-3 bg-white border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="absolute right-1.5 w-9 h-9 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 disabled:opacity-40 text-white flex items-center justify-center shadow-xs transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* VIEW 2: DEDICATED WHAT TO DO & WHAT NOT TO DO GUIDE */}
      {activeSubTab === 'dodont' && (
        <div className="space-y-4 animate-fadeIn">
          {Object.values(dosAndDontsByTopic).map((guide, i) => (
            <div key={i} className="bg-white rounded-3xl p-4 border border-pink-100 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5 border-b border-pink-50 pb-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>{guide.title}</span>
              </h3>

              {/* What to Do */}
              <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isTelugu ? 'చేయవలసినవి (What to Do)' : 'What to Do (Nourishing Choices)'}</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700 leading-relaxed">
                  {guide.dos.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* What NOT to Do */}
              <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-100 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-800">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>{isTelugu ? 'చేయకూడనివి (What NOT to Do)' : 'What NOT to Do (Avoid to Feel Better)'}</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700 leading-relaxed">
                  {guide.donts.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
