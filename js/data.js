// ═══════════════════════════════════════════════════════════
//  BizAmpire: Street Level — Game Data
//  Real-world business frameworks embedded as game mechanics
// ═══════════════════════════════════════════════════════════

export const INDUSTRIES = [
  { id: 'marketing',    name: 'Marketing',    icon: '📣', color: '#00d4c8', desc: 'Digital, brand, content, ads' },
  { id: 'it',           name: 'IT / Tech',    icon: '💻', color: '#9b72f8', desc: 'Software, MSP, cybersecurity' },
  { id: 'finance',      name: 'Finance',      icon: '💰', color: '#f5a623', desc: 'Accounting, tax, advisory' },
  { id: 'law',          name: 'Legal',        icon: '⚖️', color: '#4ade80', desc: 'Business, real estate, contracts' },
  { id: 'construction', name: 'Construction', icon: '🏗️', color: '#ff4466', desc: 'General, specialty, remodeling' },
  { id: 'auto',         name: 'Auto',         icon: '🚗', color: '#ffd166', desc: 'Repair, dealership, detailing' },
  { id: 'realestate',   name: 'Real Estate',  icon: '🏠', color: '#38bdf8', desc: 'Residential, commercial, PM' },
  { id: 'health',       name: 'Healthcare',   icon: '🩺', color: '#a3e635', desc: 'Practice, wellness, pharmacy' },
  { id: 'consulting',   name: 'Consulting',   icon: '🎯', color: '#fb7185', desc: 'Operations, strategy, HR' },
];

// ── Startup costs per industry ───────────────────────────────────────────────
// capitalCost: deducted from active business cash when launching a new business
// trainingDays: in-game days before the new business can accept encounters
// overheadBump: extra monthly overhead added on top of base $800 (licences, tools, space)
// capitalLabel / trainingLabel: UI-friendly explanations
export const INDUSTRY_STARTUP_COSTS = {
  marketing: {
    capitalCost: 1500,
    trainingDays: 3,
    overheadBump: 200,
    capitalLabel: 'Branding tools, ad accounts, portfolio site',
    trainingLabel: '3 days — brand positioning & campaign setup',
    difficulty: 'low',
  },
  it: {
    capitalCost: 2500,
    trainingDays: 5,
    overheadBump: 400,
    capitalLabel: 'Dev tools, cloud licences, hardware, RMM stack',
    trainingLabel: '5 days — certifications & stack configuration',
    difficulty: 'medium',
  },
  finance: {
    capitalCost: 3000,
    trainingDays: 10,
    overheadBump: 500,
    capitalLabel: 'Accounting software, E&O insurance, CPA licence fees',
    trainingLabel: '10 days — regulatory onboarding & compliance review',
    difficulty: 'high',
  },
  law: {
    capitalCost: 4000,
    trainingDays: 14,
    overheadBump: 600,
    capitalLabel: 'Bar dues, malpractice insurance, case management software',
    trainingLabel: '14 days — jurisdiction research & client intake setup',
    difficulty: 'high',
  },
  construction: {
    capitalCost: 6000,
    trainingDays: 7,
    overheadBump: 1200,
    capitalLabel: 'Equipment, materials, bonding, contractor licence',
    trainingLabel: '7 days — permitting, insurance & crew sourcing',
    difficulty: 'high',
  },
  auto: {
    capitalCost: 5000,
    trainingDays: 5,
    overheadBump: 900,
    capitalLabel: 'Lift, tools, dealer licence, insurance, inventory',
    trainingLabel: '5 days — facility setup & parts supplier agreements',
    difficulty: 'medium',
  },
  realestate: {
    capitalCost: 2000,
    trainingDays: 7,
    overheadBump: 300,
    capitalLabel: 'Licence fees, MLS access, E&O insurance, CRM',
    trainingLabel: '7 days — market research & listing pipeline setup',
    difficulty: 'medium',
  },
  health: {
    capitalCost: 8000,
    trainingDays: 21,
    overheadBump: 1500,
    capitalLabel: 'Medical equipment, HIPAA compliance, malpractice insurance',
    trainingLabel: '21 days — credentialing, payer contracts & clinic setup',
    difficulty: 'very_high',
  },
  consulting: {
    capitalCost: 800,
    trainingDays: 2,
    overheadBump: 100,
    capitalLabel: 'LLC filing, deck templates, proposal software',
    trainingLabel: '2 days — niche definition & case study prep',
    difficulty: 'low',
  },
};

// Difficulty label for UI
export const STARTUP_DIFFICULTY_LABELS = {
  low:       { label: 'Easy Entry',    color: '#4ade80' },
  medium:    { label: 'Moderate',      color: '#ffd166' },
  high:      { label: 'High Barrier',  color: '#fb923c' },
  very_high: { label: 'Expert Only',   color: '#ff4466' },
};


const BUSINESS_TEMPLATES = {
  tech_row: [
    { name: 'Apex Digital', type: 'Marketing Agency', icon: '📣', size: 'SMB',
      owner: 'Jordan Kim', ownerTitle: 'Founder',
      pain: 'Losing clients to cheaper competitors without clear differentiation',
      budget: [2000, 8000], currentVendor: 'Freelancer', decisionTimeline: '30 days' },
    { name: 'CloudNine SaaS', type: 'Software Company', icon: '☁️', size: 'SMB',
      owner: 'Maya Patel', ownerTitle: 'CEO',
      pain: 'Churn rate too high, can\'t figure out why customers are leaving',
      budget: [3000, 12000], currentVendor: 'In-house', decisionTimeline: '60 days' },
    { name: 'SwiftRoute Couriers', type: 'Delivery Company', icon: '📦', size: 'SMB',
      owner: 'Alex Torres', ownerTitle: 'Operations Manager',
      pain: 'Growing delivery volume but aging van fleet is breaking down 2-3x per month',
      budget: [3000, 12000], currentVendor: 'None', decisionTimeline: '14 days' },
    { name: 'GreenEdge Landscaping', type: 'Landscaping Company', icon: '🌿', size: 'Mid-Market',
      owner: 'Ray Salazar', ownerTitle: 'Owner',
      pain: 'Fleet of aging trucks causing job delays and missed bids — losing to larger crews',
      budget: [4000, 18000], currentVendor: 'None', decisionTimeline: '30 days' },
  ],
  downtown: [
    { name: 'Meridian Capital', type: 'Financial Advisory', icon: '💼', size: 'Mid-Market',
      owner: 'Robert Walsh', ownerTitle: 'Managing Director',
      pain: 'Compliance costs eating into margins, need process efficiency',
      budget: [8000, 30000], currentVendor: 'Big 4', decisionTimeline: '90 days' },
    { name: 'Harbor Insurance', type: 'Insurance Brokerage', icon: '🛡️', size: 'SMB',
      owner: 'Linda Tran', ownerTitle: 'Owner',
      pain: 'Lead generation dried up, relying only on referrals',
      budget: [2000, 7000], currentVendor: 'None', decisionTimeline: '30 days' },
    { name: 'Pinnacle Roofing', type: 'Roofing Contractor', icon: '🏠', size: 'Mid-Market',
      owner: 'David Kozak', ownerTitle: 'Owner',
      pain: 'Storm season overwhelm — not enough trucks to run multiple crews simultaneously',
      budget: [6000, 25000], currentVendor: 'None', decisionTimeline: '21 days' },
    { name: 'AirFlow HVAC', type: 'HVAC Contractor', icon: '❄️', size: 'Mid-Market',
      owner: 'Grace Moreno', ownerTitle: 'Owner',
      pain: 'Adding two new technicians but no vehicles — crew using personal trucks creates liability',
      budget: [5000, 20000], currentVendor: 'None', decisionTimeline: '30 days' },
  ],
  professional_park: [
    { name: 'Hartley & Associates', type: 'Law Firm', icon: '⚖️', size: 'SMB',
      owner: 'Thomas Hartley', ownerTitle: 'Managing Partner',
      pain: 'Can\'t scale beyond founding partner billing time',
      budget: [4000, 15000], currentVendor: 'None', decisionTimeline: '60 days' },
    { name: 'Vertex Accounting', type: 'CPA Firm', icon: '🧮', size: 'SMB',
      owner: 'Elena Moreno', ownerTitle: 'Principal',
      pain: 'Tax season overwhelm every year, no systems to delegate',
      budget: [2500, 9000], currentVendor: 'Freelancer', decisionTimeline: '30 days' },
    { name: 'Prime HR Solutions', type: 'HR Consulting', icon: '👥', size: 'Startup',
      owner: 'James Okafor', ownerTitle: 'CEO',
      pain: 'Losing pitches on price, not being perceived as premium',
      budget: [1500, 6000], currentVendor: 'None', decisionTimeline: '14 days' },
    { name: 'Clearview Advisory', type: 'Management Consulting', icon: '🎯', size: 'SMB',
      owner: 'Priya Sharma', ownerTitle: 'Founder',
      pain: 'Feast-or-famine revenue cycle, no predictable pipeline',
      budget: [3000, 12000], currentVendor: 'Agency', decisionTimeline: '45 days' },
  ],
  industrial: [
    { name: 'Ironclad Construction', type: 'General Contractor', icon: '🏗️', size: 'Mid-Market',
      owner: 'Mike Donovan', ownerTitle: 'Owner',
      pain: 'Winning bids on price only, lowest margin jobs are worst headaches',
      budget: [5000, 18000], currentVendor: 'None', decisionTimeline: '30 days' },
    { name: 'Metro Auto Group', type: 'Car Dealership', icon: '🚘', size: 'Mid-Market',
      owner: 'Carla Ruiz', ownerTitle: 'General Manager',
      pain: 'Service department underperforming, customers not returning',
      budget: [4000, 15000], currentVendor: 'Agency', decisionTimeline: '60 days' },
    { name: 'FastLane Repair', type: 'Auto Repair Shop', icon: '🔧', size: 'SMB',
      owner: 'Tony Nguyen', ownerTitle: 'Owner',
      pain: 'Can\'t compete with chain shops on price, needs differentiation',
      budget: [800, 3000], currentVendor: 'None', decisionTimeline: '7 days' },
    { name: 'FlowMaster Plumbing', type: 'Plumbing Contractor', icon: '🔩', size: 'Mid-Market',
      owner: 'Sandra Reyes', ownerTitle: 'Owner',
      pain: 'Running 6 trucks but 2 are over 200k miles — one breakdown already cost a $15k emergency job',
      budget: [6000, 25000], currentVendor: 'None', decisionTimeline: '30 days' },
  ],
  medical_mile: [
    { name: 'Lakeside Family Practice', type: 'Medical Practice', icon: '🏥', size: 'SMB',
      owner: 'Dr. Amir Hassan', ownerTitle: 'Owner/Physician',
      pain: 'Insurance billing errors costing $40K+ annually',
      budget: [2000, 8000], currentVendor: 'None', decisionTimeline: '30 days' },
    { name: 'Vitality Wellness', type: 'Wellness Center', icon: '🧘', size: 'Startup',
      owner: 'Nina Foster', ownerTitle: 'Founder',
      pain: 'High client acquisition cost, low retention rate',
      budget: [1000, 4000], currentVendor: 'None', decisionTimeline: '14 days' },
    { name: 'RxPlus Pharmacy', type: 'Independent Pharmacy', icon: '💊', size: 'SMB',
      owner: 'Kevin Zhao', ownerTitle: 'Owner/Pharmacist',
      pain: 'Competing with big-box pharmacies on price — margin pressure',
      budget: [1500, 5000], currentVendor: 'Freelancer', decisionTimeline: '30 days' },
    { name: 'Precision Dental', type: 'Dental Practice', icon: '🦷', size: 'SMB',
      owner: 'Dr. Laura Singh', ownerTitle: 'Owner/Dentist',
      pain: 'Chair time not fully booked, lost revenue on cancellations',
      budget: [2500, 9000], currentVendor: 'Agency', decisionTimeline: '45 days' },
  ],
  retail_strip: [
    { name: 'Urban Grounds Coffee', type: 'Coffee Shop', icon: '☕', size: 'SMB',
      owner: 'Dara Jackson', ownerTitle: 'Owner',
      pain: 'New chain opened next door, foot traffic down 30%',
      budget: [500, 2500], currentVendor: 'None', decisionTimeline: '14 days' },
    { name: 'Harvest Catering Co.', type: 'Catering Company', icon: '🍽️', size: 'SMB',
      owner: 'Isabelle Nguyen', ownerTitle: 'Owner',
      pain: 'Turning down corporate catering contracts because catering van is unreliable',
      budget: [2500, 9000], currentVendor: 'None', decisionTimeline: '14 days' },
    { name: 'Grid & Socket Electric', type: 'Electrical Contractor', icon: '⚡', size: 'SMB',
      owner: 'Ray Torres', ownerTitle: 'Owner',
      pain: 'No online presence, getting outbid by someone who just has Google reviews',
      budget: [1000, 4000], currentVendor: 'None', decisionTimeline: '14 days' },
    { name: 'Summit Real Estate', type: 'Real Estate Agency', icon: '🏡', size: 'SMB',
      owner: 'Michelle Park', ownerTitle: 'Broker/Owner',
      pain: 'Top agents keep leaving to start their own offices',
      budget: [2000, 8000], currentVendor: 'None', decisionTimeline: '30 days' },
  ],
};


// ── Business Templates (must be declared before DISTRICTS) ──
function generateBusinesses(districtId) {
  const templates = BUSINESS_TEMPLATES[districtId] || [];
  return templates.map((t, i) => ({
    id: `${districtId}_${i}`,
    ...t,
    warmth: 0,       // 0=cold, 1=familiar, 2=warm, 3=advocate
    visits: 0,
    closed: false,
    cooldownDays: 0,
    lostToCompetitor: false,
  }));
}


// ── Districts ────────────────────────────────────────────────
export const DISTRICTS = [
  {
    id: 'tech_row',
    name: 'Tech Row',
    color: '#00d4c8',
    accentVar: '--teal',
    x: 0.18, y: 0.22,
    businesses: generateBusinesses('tech_row'),
  },
  {
    id: 'downtown',
    name: 'Downtown',
    color: '#f5a623',
    accentVar: '--amber',
    x: 0.48, y: 0.18,
    businesses: generateBusinesses('downtown'),
  },
  {
    id: 'professional_park',
    name: 'Professional Park',
    color: '#9b72f8',
    accentVar: '--violet',
    x: 0.72, y: 0.28,
    businesses: generateBusinesses('professional_park'),
  },
  {
    id: 'industrial',
    name: 'Industrial Zone',
    color: '#ff4466',
    accentVar: '--crimson',
    x: 0.75, y: 0.62,
    businesses: generateBusinesses('industrial'),
  },
  {
    id: 'medical_mile',
    name: 'Medical Mile',
    color: '#4ade80',
    accentVar: '--sage',
    x: 0.25, y: 0.68,
    businesses: generateBusinesses('medical_mile'),
  },
  {
    id: 'retail_strip',
    name: 'The Strip',
    color: '#ffd166',
    accentVar: '--gold',
    x: 0.5, y: 0.76,
    businesses: generateBusinesses('retail_strip'),
  },
];

// ── Skills Tree ──────────────────────────────────────────────
// Framework sources embedded in each skill description
export const SKILL_TREE = {
  prospecting: {
    label: 'Prospecting',
    skills: [
      {
        id: 'cold_approach',
        name: 'Cold Approach',
        icon: '🚪',
        desc: 'Walk into any business and open a conversation.',
        longDesc: 'The fundamental skill. Lower objection threshold, higher warmth gain per visit. Based on Fanatical Prospecting (Blount).',
        cost: 0,
        prereq: [],
        unlockedByDefault: true,
        effect: { warmthGainBonus: 0.1, openSuccessRate: 0.05 },
      },
      {
        id: 'pattern_interrupt',
        name: 'Pattern Interrupt',
        icon: '⚡',
        desc: 'Open with something unexpected to earn attention.',
        longDesc: 'Increases first-contact success rate. From Fanatical Prospecting — the first 10 seconds determine the next 10 minutes.',
        cost: 150,
        prereq: ['cold_approach'],
        effect: { openSuccessRate: 0.15, warmthGainBonus: 0.15 },
      },
      {
        id: 'referral_ask',
        name: 'Referral Ask',
        icon: '🤝',
        desc: 'Systematically ask advocates for introductions.',
        longDesc: 'Converts Advocate NPCs into lead generators. From The Go-Giver (Burg) — your network is your net worth.',
        cost: 300,
        prereq: ['pattern_interrupt'],
        effect: { referralMultiplier: 2, advocateLeadChance: 0.35 },
      },
    ],
  },
  discovery: {
    label: 'Discovery',
    skills: [
      {
        id: 'situation_questions',
        name: 'Situation Questions',
        icon: '🔍',
        desc: 'Ask questions to understand the prospect\'s current state.',
        longDesc: 'Phase 1 of SPIN Selling (Rackham). Reveals context needed for deeper questions. Builds rapport when used correctly.',
        cost: 100,
        prereq: [],
        effect: { discoveryStateBonus: 0.1, spinPhase: 'situation' },
      },
      {
        id: 'problem_questions',
        name: 'Problem Questions',
        icon: '🎯',
        desc: 'Uncover dissatisfaction and challenges the prospect faces.',
        longDesc: 'Phase 2 of SPIN Selling. Reveals explicit pain. High-value questions that differentiate consultative sellers from peddlers.',
        cost: 200,
        prereq: ['situation_questions'],
        effect: { discoveryStateBonus: 0.2, objectionReduction: 0.1 },
      },
      {
        id: 'implication_questions',
        name: 'Implication Questions',
        icon: '🌊',
        desc: 'Amplify the cost of inaction — make the pain undeniable.',
        longDesc: 'Phase 3 of SPIN Selling. The most powerful phase. Makes prospects sell themselves. "What happens to revenue if this isn\'t fixed?"',
        cost: 350,
        prereq: ['problem_questions'],
        effect: { discoveryStateBonus: 0.35, closingBonus: 0.2 },
      },
      {
        id: 'need_payoff',
        name: 'Need-Payoff Questions',
        icon: '💡',
        desc: 'Guide prospects to articulate the value of your solution.',
        longDesc: 'Phase 4 of SPIN Selling. The prospect argues for buying. "So if you could eliminate that billing error, what would that mean for your Q3?" Unlocks full SPIN combo.',
        cost: 500,
        prereq: ['implication_questions'],
        effect: { discoveryStateBonus: 0.5, closingBonus: 0.35, pricingFlexibility: 0.15 },
      },
    ],
  },
  pitching: {
    label: 'Pitching',
    skills: [
      {
        id: 'value_proposition',
        name: 'Value Proposition',
        icon: '📢',
        desc: 'Lead with outcome, not features. What do you actually deliver?',
        longDesc: 'From Building a StoryBrand (Miller). Position the prospect as hero, yourself as guide. Reduces "what do you do?" confusion.',
        cost: 150,
        prereq: [],
        effect: { pitchStateBonus: 0.15, objectionReduction: 0.05 },
      },
      {
        id: 'value_stack',
        name: 'Value Stack',
        icon: '📦',
        desc: 'Bundle deliverables to increase perceived value vs. price.',
        longDesc: 'Core mechanic from $100M Offers (Hormozi). Stack value so high the offer feels like a steal. Separates cost from price.',
        cost: 300,
        prereq: ['value_proposition'],
        effect: { pricingFlexibility: 0.25, closingBonus: 0.15 },
      },
      {
        id: 'challenger_insight',
        name: 'Challenger Insight',
        icon: '🔬',
        desc: 'Teach prospects something about their business they don\'t know.',
        longDesc: 'From The Challenger Sale (Dixon & Adamson). Reframe their problem in a way they haven\'t considered. High-value differentiator vs. relationship selling.',
        cost: 450,
        prereq: ['value_stack'],
        effect: { pitchStateBonus: 0.3, premiumPricingUnlock: true },
      },
    ],
  },
  negotiation: {
    label: 'Negotiation',
    skills: [
      {
        id: 'active_listening',
        name: 'Active Listening',
        icon: '👂',
        desc: 'Mirror, label, and summarize to build deep trust.',
        longDesc: 'From Never Split the Difference (Voss). Tactical empathy. Mirroring = repeat last 3 words. Labeling = "It sounds like you\'re concerned about..."',
        cost: 200,
        prereq: [],
        effect: { warmthGainBonus: 0.2, objectionReduction: 0.15 },
      },
      {
        id: 'calibrated_questions',
        name: 'Calibrated Questions',
        icon: '🎭',
        desc: '"How am I supposed to do that?" — use questions to redirect.',
        longDesc: 'From Never Split the Difference. How/what questions give control without confrontation. "How does this work if budget is the issue?"',
        cost: 350,
        prereq: ['active_listening'],
        effect: { objectionReduction: 0.25, negotiationBonus: 0.2 },
      },
      {
        id: 'anchoring',
        name: 'Strategic Anchoring',
        icon: '⚓',
        desc: 'Set the reference price high to make your rate feel reasonable.',
        longDesc: 'From Thinking Fast and Slow (Kahneman) and Never Split the Difference. The first number anchors perception. Mention a competitor\'s high price first.',
        cost: 400,
        prereq: ['calibrated_questions'],
        effect: { pricingFlexibility: 0.3, closingBonus: 0.1 },
      },
    ],
  },
  management: {
    label: 'Business Management',
    skills: [
      {
        id: 'systems_thinking',
        name: 'Systems Thinking',
        icon: '⚙️',
        desc: 'Work ON your business, not just IN it.',
        longDesc: 'Core insight from The E-Myth Revisited (Gerber). Build processes that run without you. Required to hire and delegate effectively.',
        cost: 500,
        prereq: [],
        effect: { employeePerformanceBonus: 0.2, capacityMultiplier: 1.5 },
      },
      {
        id: 'hiring_protocol',
        name: 'Hiring Protocol',
        icon: '🧑‍💼',
        desc: 'Hire for values and attitude, train for skills.',
        longDesc: 'From Who (Smart & Street). Scorecard hiring. A-players hire A-players; B-players hire C-players. Unlocks better employee NPCs.',
        cost: 700,
        prereq: ['systems_thinking'],
        effect: { hireQualityBonus: 0.3, employeeErrorRate: -0.2 },
      },
      {
        id: 'lean_operations',
        name: 'Lean Operations',
        icon: '🔄',
        desc: 'Eliminate waste, reduce cycle time, validate fast.',
        longDesc: 'From The Lean Startup (Ries). Build-Measure-Learn. Minimum viable processes. Reduces overhead costs by 20%.',
        cost: 600,
        prereq: ['systems_thinking'],
        effect: { overheadReduction: 0.2, employeeEfficiencyBonus: 0.15 },
      },
    ],
  },
  strategy: {
    label: 'Growth Strategy',
    skills: [
      {
        id: 'icp_focus',
        name: 'ICP Focus',
        icon: '🎯',
        desc: 'Define your Ideal Customer Profile and focus exclusively.',
        longDesc: 'From Traction (Weinberg) and $100M Offers. Saying no to bad-fit clients is a superpower. Reduces wasted pitches, increases conversion by 30%.',
        cost: 400,
        prereq: [],
        effect: { closingBonus: 0.2, reputationGainBonus: 0.15 },
      },
      {
        id: 'blue_ocean',
        name: 'Blue Ocean Move',
        icon: '🌊',
        desc: 'Differentiate so completely that competition becomes irrelevant.',
        longDesc: 'From Blue Ocean Strategy (Kim & Mauborgne). Reconstruct market boundaries. Unlocks unique positioning in saturated districts — competitors can\'t poach your prospects.',
        cost: 800,
        prereq: ['icp_focus'],
        effect: { competitorProofing: true, premiumPricingUnlock: true, saturationProtection: true },
      },
      {
        id: 'traction_channel',
        name: 'Traction Channel',
        icon: '📡',
        desc: 'Find and double down on your highest-ROI growth channel.',
        longDesc: 'From Traction (Weinberg & Mares). 19 traction channels. Most companies only need 1 working extremely well. Unlocks passive inbound leads.',
        cost: 600,
        prereq: ['icp_focus'],
        effect: { passiveLeadsPerMonth: 2, reputationGainBonus: 0.2 },
      },
    ],
  },
};

// ── Encounter Scripts ────────────────────────────────────────
// Each encounter has phases: opener → discovery → pitch → pricing → close
// State carries forward via a "rapport" score (-5 to +5)

export const ENCOUNTER_PHASES = {
  opener: {
    label: 'Opener',
    description: 'Make a strong first impression. Get permission to ask questions.',
  },
  discovery: {
    label: 'Discovery',
    description: 'Use SPIN to uncover pain. Every good question builds rapport.',
  },
  pitch: {
    label: 'Pitch',
    description: 'Present your solution framed around their specific pain.',
  },
  pricing: {
    label: 'Pricing',
    description: 'Set your rate. Price is a signal of value — anchor high.',
  },
  close: {
    label: 'Close',
    description: 'Ask for the commitment. Silence is golden after the close.',
  },
};

// Note: Opener scripts are defined inline in UIManager._renderOpenerChoices()

export const DISCOVERY_QUESTIONS = [
  {
    phase: 'situation',
    question: "How are you currently handling the challenge you mentioned — walk me through what that looks like day to day?",
    goodResponse: "It sounds like you're doing it manually — that works at your current scale, but where does it break down?",
    badResponse: "Oh interesting. And how long has that been the case?",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions',
    framework: 'SPIN Selling — Situation Phase',
  },
  {
    phase: 'problem',
    question: "What's the biggest headache that creates for you day-to-day?",
    goodResponse: "That's exactly the pattern I see — the pain is usually buried in {impliedCost}. What does a bad week look like because of this?",
    badResponse: "That's understandable. Most businesses deal with that.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions',
    framework: 'SPIN Selling — Problem Phase',
  },
  {
    phase: 'implication',
    question: "If this doesn't get resolved in the next 6 months, what does that do to your business?",
    goodResponse: "So we're talking about {impliedRevenueLoss} in lost opportunity — plus the stress of managing it personally. That's a real cost.",
    badResponse: "I see. Well, we could potentially help with that.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions',
    framework: 'SPIN Selling — Implication Phase',
  },
  {
    phase: 'need_payoff',
    question: "If you could solve {pain} completely, what would that open up for you?",
    goodResponse: "Exactly. And that's the outcome I build toward — not just fixing the symptom but {outcome}. Would that be worth exploring?",
    badResponse: "That's the goal. Let me tell you what we do...",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff',
    framework: 'SPIN Selling — Need-Payoff Phase',
  },
];

// ── Prospect category resolver ──────────────────────────────
// Maps a prospect's business type string → one of 8 canonical categories
// used as keys in DISCOVERY_QUESTION_BANK and ICP_FIT_MATRIX
export function getProspectCategory(bizType) {
  const t = (bizType || '').toLowerCase();

  // ── Check most specific / easily-confused terms FIRST ────────

  // Auto / vehicle — check before 'shop'/'repair' hit retail bucket
  if (t.includes('auto') || t.includes('dealership') || t.includes('dealer') ||
      t.includes('fleet') || t.includes('detailing') || t.includes('car wash') ||
      t.includes('auto repair') || t.includes('mechanic'))
    return 'auto_services';

  // Financial services — check 'advisory'/'brokerage' before office_professional catches 'advisory'
  if (t.includes('bank') || t.includes('insurance') || t.includes('wealth') ||
      t.includes('financial advisory') || t.includes('brokerage') ||
      t.includes('mortgage') || t.includes('credit union') || t.includes('investment') ||
      t.includes('financial services') || t.includes('asset management'))
    return 'financial_services';

  // Real estate — check 'broker' before office_professional
  if (t.includes('real estate') || t.includes('property management') ||
      t.includes('realty') || t.includes('real estate agency') ||
      t.includes('real estate broker') || t.includes('developer') || t.includes('landlord'))
    return 'real_estate';

  // Tech / digital — check 'agency' variants before office_professional catches 'consulting'
  if (t.includes('software') || t.includes('saas') || t.includes('dev shop') ||
      t.includes('tech company') || t.includes('analytics') || t.includes('startup') ||
      t.includes('marketing agency') || t.includes('digital agency') || t.includes('media agency') ||
      t.includes('ad agency') || t.includes('creative agency') ||
      t.includes('it firm') || t.includes('it company') || t.includes('it services'))
    return 'tech_company';

  // Healthcare — specific enough, low collision risk
  if (t.includes('medical') || t.includes('healthcare') || t.includes('clinic') ||
      t.includes('dental') || t.includes('dentist') || t.includes('wellness') ||
      t.includes('pharmacy') || t.includes('hospital') || t.includes('therapy') ||
      t.includes('chiro') || t.includes('optom') || t.includes('pediatric') ||
      t.includes('urgent care') || t.includes('health practice'))
    return 'healthcare';

  // Trades / contractors — check 'repair shop' only if not already caught by auto above
  if (t.includes('contractor') || t.includes('construction') || t.includes('electrical') ||
      t.includes('plumb') || t.includes('hvac') || t.includes('fabricat') ||
      t.includes('manufactur') || t.includes('industrial') || t.includes('landscap') ||
      t.includes('roofing') || t.includes('painting') || t.includes('welding') ||
      t.includes('repair shop'))
    return 'trades_contractor';

  // Retail / food / consumer — 'shop'/'store' caught here (after auto & trades)
  if (t.includes('restaurant') || t.includes('café') || t.includes('cafe') ||
      t.includes('coffee') || t.includes('food') || t.includes('bakery') ||
      t.includes('retail') || t.includes('boutique') || t.includes('shop') ||
      t.includes('store') || t.includes('salon') || t.includes('barbershop') ||
      t.includes('gym') || t.includes('fitness') || t.includes('spa') ||
      t.includes('cater') || t.includes('delivery') || t.includes('courier') ||
      t.includes('logistics') || t.includes('distribution'))
    return 'retail_food';

  // Office professional — law, accounting, HR, consulting (catch-all for B2B services)
  if (t.includes('law firm') || t.includes('legal') || t.includes('attorney') ||
      t.includes('cpa') || t.includes('accounting') || t.includes('audit') ||
      t.includes('hr') || t.includes('management consult') || t.includes('staffing') ||
      t.includes('consulting') || t.includes('advisory firm') || t.includes('advisory group'))
    return 'office_professional';

  // Default — office professional is the safest fallback for unlisted B2B types
  return 'office_professional';
}

// ── Dynamic discovery questions (legacy fallback — superseded by questions.js bank) ──
// Kept for reference; engine.js now uses DISCOVERY_QUESTION_BANK from questions.js
function generateDiscoveryQuestions(playerIndustry, prospect) {
  const pType = (prospect.type || '').toLowerCase();
  const pPain = prospect.pain || 'operational inefficiencies';
  const pOwner = prospect.owner || 'them';

  // What does the player SELL — one-liner service description per industry
  const playerServiceMap = {
    it:           { service: 'IT & managed technology services', verb: 'manage your tech', unit: 'IT issues/downtime' },
    marketing:    { service: 'marketing & customer acquisition', verb: 'grow your customer base', unit: 'marketing spend' },
    finance:      { service: 'accounting & financial advisory', verb: 'handle your books and taxes', unit: 'accounting costs' },
    law:          { service: 'legal services & business contracts', verb: 'protect your business legally', unit: 'legal exposure' },
    construction: { service: 'construction & renovation services', verb: 'handle your build-outs', unit: 'project costs' },
    auto:         { service: 'vehicle maintenance & fleet services', verb: 'keep your vehicles running', unit: 'vehicle downtime' },
    realestate:   { service: 'real estate & property management', verb: 'manage your properties', unit: 'vacancy costs' },
    health:       { service: 'healthcare & wellness services', verb: "support your team's health", unit: 'healthcare overhead' },
    consulting:   { service: 'operations & strategy consulting', verb: 'optimize your operations', unit: 'inefficiency costs' },
  };

  const ps = playerServiceMap[playerIndustry] || playerServiceMap.consulting;

  // Prospect category — what kind of business are they?
  function getProspectContext() {
    if (pType.includes('restaurant') || pType.includes('café') || pType.includes('food')) return { has: 'a restaurant/food business', needs: 'reliable POS, staff scheduling, vendor payments' };
    if (pType.includes('retail') || pType.includes('shop') || pType.includes('store')) return { has: 'a retail operation', needs: 'inventory systems, payment processing, customer loyalty' };
    if (pType.includes('law') || pType.includes('legal') || pType.includes('attorney')) return { has: 'a law firm', needs: 'document management, client confidentiality, billing accuracy' };
    if (pType.includes('medical') || pType.includes('health') || pType.includes('clinic') || pType.includes('dental')) return { has: 'a healthcare practice', needs: 'HIPAA compliance, patient management, insurance billing' };
    if (pType.includes('construction') || pType.includes('contractor') || pType.includes('build')) return { has: 'a construction company', needs: 'project tracking, subcontractor coordination, invoicing' };
    if (pType.includes('auto') || pType.includes('dealer') || pType.includes('repair') || pType.includes('fleet')) return { has: 'an automotive business', needs: 'fleet tracking, service scheduling, parts inventory' };
    if (pType.includes('bank') || pType.includes('finance') || pType.includes('wealth') || pType.includes('insurance')) return { has: 'a financial services firm', needs: 'compliance, data security, client reporting' };
    if (pType.includes('software') || pType.includes('saas') || pType.includes('tech') || pType.includes('dev')) return { has: 'a tech company', needs: 'scalable infrastructure, security, uptime' };
    if (pType.includes('market') || pType.includes('agency') || pType.includes('brand') || pType.includes('media')) return { has: 'a marketing/agency business', needs: 'client reporting, project management, lead gen' };
    if (pType.includes('real estate') || pType.includes('property') || pType.includes('brokerage')) return { has: 'a real estate business', needs: 'property tracking, client CRM, document workflows' };
    return { has: 'a growing business', needs: 'reliable systems and scalable support' };
  }

  const pc = getProspectContext();

  // Build 4 SPIN questions that are grounded in:
  // - what the PLAYER sells (ps.service)
  // - what the PROSPECT does (pc.has / pc.needs)
  // - the prospect's known pain (pPain)
  return [
    {
      phase: 'situation',
      question: `How are you currently handling ${ps.unit} for ${pc.has}? Walk me through what that looks like day to day.`,
      goodResponse: `Got it — so right now it's mostly ${pOwner} managing that directly. That works until it doesn't. At what point does it start slowing you down?`,
      badResponse: `Interesting. And how long have you been doing it that way?`,
      rapportOnGood: 1, rapportOnBad: 0,
      skillTag: 'situation_questions',
      framework: 'SPIN Selling — Situation Phase',
    },
    {
      phase: 'problem',
      question: `You mentioned ${pPain}. Where does that actually hurt most — is it the time it takes, the cost, or the risk it creates?`,
      goodResponse: `That's exactly where I see it compound. The ${ps.unit} problem usually starts as a time drain, then becomes a cost, then becomes a risk. Which of those is keeping you up at night right now?`,
      badResponse: `That's understandable. A lot of ${pc.has.replace('a ', '')} owners deal with that.`,
      rapportOnGood: 2, rapportOnBad: 0,
      skillTag: 'problem_questions',
      framework: 'SPIN Selling — Problem Phase',
    },
    {
      phase: 'implication',
      question: `If ${pPain.toLowerCase()} doesn't get resolved in the next 6 months, what does that do to your growth plans — or your bottom line?`,
      goodResponse: `So realistically we're talking about real dollars slipping — plus your time. When you factor in what ${ps.unit} is actually costing you versus what a proper ${ps.service} partner would run, the math usually flips pretty fast.`,
      badResponse: `I see. Well, we could potentially help with that.`,
      rapportOnGood: 2, rapportOnBad: -1,
      skillTag: 'implication_questions',
      framework: 'SPIN Selling — Implication Phase',
    },
    {
      phase: 'need_payoff',
      question: `If you had ${ps.service} completely handled — not a worry, just running — what would you actually spend that time and energy on instead?`,
      goodResponse: `That's exactly what I help ${pc.has.replace('a ', '')} owners get back. Not just fixing the ${ps.unit} problem, but freeing you to focus on ${prospect.pain?.includes('growth') || prospect.pain?.includes('revenue') ? 'growing revenue' : "what you're actually good at"}. Is that worth 20 minutes to explore?`,
      badResponse: `That's the goal. Let me tell you a bit about what we do...`,
      rapportOnGood: 3, rapportOnBad: 0,
      skillTag: 'need_payoff',
      framework: 'SPIN Selling — Need-Payoff Phase',
    },
  ];
}

export const OBJECTION_LIBRARY = {
  price: [
    {
      objection: "That's more than we budgeted for.",
      counters: {
        bad:  { text: "We might be able to do a discount.", rapport: -2, label: 'Capitulate on price' },
        ok:   { text: "What were you thinking budget-wise?", rapport: 0, label: 'Re-anchor with question' },
        good: { text: "That's fair — let's talk about what it costs you NOT to solve this. You mentioned {impliedCost} monthly. Over 12 months that's {impliedAnnual}. Our fee is {price}. The math usually works.", rapport: 2, label: 'Reframe ROI', skillRequired: 'value_stack', framework: '$100M Offers — ROI Reframe' },
        great: { text: "Compared to what? If you're comparing us to a freelancer at $X, the real comparison is outcome per dollar — and that's where I'd like to walk you through what we actually deliver.", rapport: 3, label: 'Anchoring + Value Stack', skillRequired: 'anchoring', framework: 'Never Split the Difference + $100M Offers' },
      },
    },
    {
      objection: "We're already working with someone.",
      counters: {
        bad:  { text: "Oh I understand, we can revisit if things change.", rapport: -1, label: 'Walk away' },
        ok:   { text: "How's that going?", rapport: 1, label: 'Open-ended probe' },
        good: { text: "That's great — I'm not here to replace them. I'm curious: what's working, and what's the one area where you wish they did more? Most companies find there's a gap somewhere.", rapport: 2, label: 'Gap finder', framework: 'Challenger Sale — Reframing' },
      },
    },
  ],
  timing: [
    {
      objection: "Now's not a great time — maybe in Q3.",
      counters: {
        bad:  { text: "Absolutely, I'll follow up then!", rapport: -1, label: 'Delay with no commitment' },
        ok:   { text: "What changes in Q3 that makes it a better time?", rapport: 1, label: 'Qualify the delay', framework: 'SPIN — Problem Probe' },
        good: { text: "I hear you — what I've found is that Q3 comes fast. If we scoped something small to start, you'd have data before the decision matters. Would a pilot make sense?", rapport: 2, label: 'Pilot offer', framework: 'Lean Startup — MVP Approach' },
      },
    },
  ],
  trust: [
    {
      objection: "I've heard that before from agencies. How do I know you're different?",
      counters: {
        bad:  { text: "We have great testimonials, I can send them over.", rapport: -1, label: 'Generic social proof' },
        ok:   { text: "Fair. What went wrong with the last vendor?", rapport: 1, label: 'Uncover real concern', framework: 'Active Listening — Labeling' },
        good: { text: "You're right to be skeptical — most agencies do overpromise. Here's what I do differently: [specific]. But instead of me telling you, let me show you. A 30-day pilot with clear metrics — if we hit them, we talk about something bigger. If not, you've lost 30 days. Fair?", rapport: 3, label: 'Challenger Insight + Pilot', skillRequired: 'challenger_insight', framework: 'Challenger Sale + Lean Startup' },
      },
    },
  ],
};

// ── NPC Employees ────────────────────────────────────────────
export const EMPLOYEE_ARCHETYPES = [
  {
    id: 'junior_rep',
    name: 'Junior Sales Rep',
    icon: '👩‍💼',
    cost: 2500,       // monthly salary
    reliability: 3,   // 1-5
    skill: 2,
    maxClients: 3,
    hireCriteria: 'First hire available after 5 clients',
    description: 'Eager but green. Will make mistakes. Needs training and SOPs.',
    emythLesson: 'The Technician mistake — hiring yourself, not a system.',
  },
  {
    id: 'experienced_manager',
    name: 'Account Manager',
    icon: '🧑‍💼',
    cost: 4500,
    reliability: 4,
    skill: 4,
    maxClients: 6,
    hireCriteria: 'Unlocked after hiring_protocol skill',
    description: 'Manages client relationships. Frees you for strategy.',
    emythLesson: 'The Manager role — working ON, not IN the business.',
  },
  {
    id: 'ops_specialist',
    name: 'Operations Lead',
    icon: '⚙️',
    cost: 5500,
    reliability: 5,
    skill: 4,
    maxClients: 0, // handles internal ops
    hireCriteria: 'Unlocked after lean_operations skill',
    description: 'Builds and maintains your internal systems. Reduces errors.',
    emythLesson: 'Systems replace people — The E-Myth\'s core insight.',
  },
];

// ── Competitor NPCs ──────────────────────────────────────────
export const COMPETITORS = [
  {
    id: 'undercutter',
    name: 'QuickClose Solutions',
    icon: '🔻',
    style: 'Undercutter',
    behavior: 'Charges 40% below market, wins on price, delivers poorly',
    weaknesses: ['value_stack', 'challenger_insight'],
    aggressionLevel: 2,  // how fast they move on prospects
  },
  {
    id: 'incumbent',
    name: 'RegionPro Agency',
    icon: '🏢',
    style: 'Incumbent',
    behavior: 'Has long-standing relationships. Hard to displace but complacent.',
    weaknesses: ['implication_questions', 'pattern_interrupt'],
    aggressionLevel: 1,
  },
  {
    id: 'prestige',
    name: 'Pinnacle Consulting',
    icon: '👑',
    style: 'Premium',
    behavior: 'Enterprise-focused. Ignores SMBs — your sweet spot.',
    weaknesses: [],  // avoids your market
    aggressionLevel: 0.5,
  },
];

// ── Meta-Game Milestones ──────────────────────────────────────
export const MILESTONES = [
  { deals: 1,  title: 'First Blood',      reward: 'Unlock Discovery branch', icon: '🩸', unlocks: 'discovery_full' },
  { deals: 3,  title: 'Pipeline Built',   reward: '+Referral Ask skill available', icon: '🔗', unlocks: 'referral_ask' },
  { deals: 5,  title: 'First Client Crisis', reward: 'Employee hire unlocked', icon: '🚨', unlocks: 'first_hire', event: 'client_crisis' },
  { deals: 7,  title: 'Local Presence',   reward: 'Second district unlocked', icon: '🗺️', unlocks: 'district_2' },
  { deals: 10, title: 'VC Visitor',       reward: 'Meridian Capital approaches you', icon: '💼', unlocks: 'vc_arc', event: 'vc_approach' },
  { deals: 12, title: 'Market Leader',    reward: 'Competitor makes buyout offer', icon: '🏆', unlocks: 'acquisition_offer', event: 'acquisition' },
  { deals: 15, title: 'City Conquered',   reward: 'Second city unlocked', icon: '🌆', unlocks: 'city_2' },
  { deals: 20, title: 'Empire Builder',   reward: 'Investor Board NPC', icon: '👑', unlocks: 'board_arc' },
];

// ── Field Journal Prompts ─────────────────────────────────────
export const JOURNAL_PROMPTS = {
  after_ghosted: [
    "They didn't say no — they just disappeared. Think of a real prospect who went quiet on you. What could you do this week to re-engage without coming across as desperate?",
    "Being ghosted isn't a no — it's an unfinished conversation. Write down one follow-up you could send that offers value first, with zero pressure to reply.",
    "Ghosting usually means timing or fit was off, not that you failed. What signal did you miss during that meeting that might have told you this wasn't the right moment?",
  ],
  after_cold_fail: [
    "You just had a cold approach not go as planned. What's ONE real prospect you've been avoiding calling? What will you do this week?",
    "That opener didn't land. Write down the last time you walked into a business cold. What would you do differently now?",
  ],
  after_discovery: [
    "You just practiced SPIN discovery. Think of a real client or prospect — what Implication question have you never asked them?",
    "Discovery is about listening more than talking. What's the last meeting where you talked too much? What would you ask instead?",
  ],
  after_objection: [
    "You handled a price objection. Write down a real objection you're currently stuck on. How would you reframe it using ROI?",
    "What's the biggest objection your real business faces right now? Draft 3 responses using what you just learned.",
  ],
  after_close: [
    "You just closed a deal. What is ONE real follow-up you've been procrastinating on? Commit to completing it this week.",
    "Momentum is real. What's one action in your actual business you can do TODAY based on what you just practiced?",
  ],
  after_hire: [
    "You hired your first team member in-game. What's one task in YOUR real business that only you do — that someone else could learn in 30 days?",
    "The E-Myth moment: you can't scale if everything runs through you. What's one process you could write down today?",
  ],
  weekly_checkin: [
    "It's been 3 days. Did you complete your commitment? Be honest — the streak matters for your Field Journal XP.",
    "Check-in time. What happened when you tried the technique in real life? What was different from the game?",
  ],
};

// ── Starting Game State ──────────────────────────────────────
export function createInitialState(businessSetup) {
  return {
    // Business
    businessName: businessSetup.name,
    businessIndustry: businessSetup.industry,
    businessDescription: businessSetup.description,
    businessPersonas: businessSetup.personas,  // AI-generated

    // Finances
    cash: 5000,           // Starting cash
    monthlyRevenue: 0,
    monthlyOverhead: 800, // Rent, tools, etc.
    totalDeals: 0,
    activeClients: [],
    employees: [],

    // Reputation / XP
    reputation: 0,        // 0-1000
    xp: 0,
    level: 1,
    skillPoints: 3,       // Spend on skill tree

    // Unlocked skills
    unlockedSkills: ['cold_approach'],

    // City state
    currentDistrict: null,
    unlockedDistricts: ['tech_row', 'downtown', 'professional_park', 'industrial', 'medical_mile', 'retail_strip'],  // All districts open from start
    districts: JSON.parse(JSON.stringify(DISTRICTS)),

    // Progress
    milestonesReached: [],
    competitorActivity: { undercutter: 0.3, incumbent: 0.2, prestige: 0.1 },

    // Survival mode
    survivalMode: false,
    daysSinceLastDeal: 0,
    monthTimer: 0,         // days in month

    // Journal
    journalEntries: [],
    journalCommitmentRate: 0,

    // Meta
    gamePhase: 'city',     // city | encounter | skill_tree | journal | management
    currentEncounter: null,

    // Vendor system
    vendors: [],           // { bizId, bizName, bizType, icon, service, purchasedAt, referralCooldown }
    vendorWarmthBonus: 0,  // cumulative warmth bonus from marketing vendors
    vendorOverheadReduction: 0, // monthly overhead reduction from ops vendors

    // Daily goals — reset each calendar day
    dailyGoals: {
      date: null,
      goals: [
        { id: 'approaches',  label: '3 approaches',      target: 3, current: 0 },
        { id: 'close_deal',  label: 'Close 1 deal',       target: 1, current: 0 },
        { id: 'new_visits',  label: '2 new businesses',   target: 2, current: 0 },
      ],
    },
  };
}

// ── Vendor Services Catalog ──────────────────────────────────
// Maps business type → array of purchasable services
// Each service has: id, name, cost, oneTime, effect, effectDesc, referralRate, referralType
export const VENDOR_CATALOG = {

  // ── Legal ────────────────────────────────────────────────
  'Law Firm': [
    {
      id: 'business_contract',
      name: 'Business Contract Package',
      cost: 1500,
      oneTime: true,
      effectDesc: 'Unlocks enterprise prospects (Mid-Market & above) who require formal contracts before engaging.',
      effect: { unlockEnterprise: true },
      referralRate: 0.35,   // 35% chance per month of sending a referral lead
      referralType: 'office_professional',
      icon: '📄',
    },
    {
      id: 'llc_setup',
      name: 'LLC Formation',
      cost: 800,
      oneTime: true,
      effectDesc: 'Legitimizes your business. +10 warmth on every first approach for the rest of the game.',
      effect: { warmthBonus: 10 },
      referralRate: 0.25,
      referralType: 'office_professional',
      icon: '🏛️',
    },
  ],

  // ── Accounting ───────────────────────────────────────────
  'CPA Firm': [
    {
      id: 'monthly_bookkeeping',
      name: 'Monthly Bookkeeping',
      cost: 400,
      oneTime: false,   // recurring monthly cost
      effectDesc: 'Adds cash flow report to Management screen. Reduces monthly overhead by $200 through tax optimization.',
      effect: { overheadReduction: 200, unlockCashflowReport: true },
      referralRate: 0.3,
      referralType: 'financial_services',
      icon: '📊',
    },
    {
      id: 'tax_strategy',
      name: 'Annual Tax Strategy',
      cost: 1200,
      oneTime: true,
      effectDesc: '+$500 cash back at end of each in-game month (tax efficiency). One-time setup.',
      effect: { monthlyTaxCredit: 500 },
      referralRate: 0.2,
      referralType: 'financial_services',
      icon: '🧾',
    },
  ],

  // ── Marketing ────────────────────────────────────────────
  'Marketing Agency': [
    {
      id: 'brand_package',
      name: 'Brand Identity Package',
      cost: 2000,
      oneTime: true,
      effectDesc: '+15 warmth on ALL future cold approaches. Prospects recognize your brand before you speak.',
      effect: { warmthBonus: 15 },
      referralRate: 0.4,
      referralType: 'tech_company',
      icon: '🎨',
    },
    {
      id: 'ad_campaign',
      name: 'Local Ad Campaign',
      cost: 800,
      oneTime: false,
      effectDesc: 'Generates 1-2 inbound leads per month. Leads walk toward you on the map.',
      effect: { passiveLeadsPerMonth: 2 },
      referralRate: 0.3,
      referralType: 'retail_food',
      icon: '📣',
    },
  ],

  // ── Insurance ────────────────────────────────────────────
  'Insurance Brokerage': [
    {
      id: 'business_insurance',
      name: 'Business Liability Insurance',
      cost: 600,
      oneTime: false,
      effectDesc: 'Required by some Mid-Market prospects. Reduces lost deal penalties by 50%.',
      effect: { lostDealPenaltyReduction: 0.5, unlockInsuredProspects: true },
      referralRate: 0.25,
      referralType: 'financial_services',
      icon: '🛡️',
    },
  ],

  // ── Financial Advisory ───────────────────────────────────
  'Financial Advisory': [
    {
      id: 'business_credit',
      name: 'Business Line of Credit',
      cost: 500,   // setup fee
      oneTime: true,
      effectDesc: 'Borrow up to $5,000 against future revenue. Removes cash floor in survival mode for 60 days.',
      effect: { creditLine: 5000 },
      referralRate: 0.2,
      referralType: 'financial_services',
      icon: '💳',
    },
  ],

  // ── HR Consulting ─────────────────────────────────────────
  'HR Consulting': [
    {
      id: 'hiring_process',
      name: 'Hiring Process Design',
      cost: 900,
      oneTime: true,
      effectDesc: 'Unlocks higher-quality employee hires. All future hires get +1 reliability.',
      effect: { hireQualityBonus: 1, unlockSkill: 'hiring_protocol' },
      referralRate: 0.2,
      referralType: 'office_professional',
      icon: '👥',
    },
  ],

  // ── Management Consulting ─────────────────────────────────
  'Management Consulting': [
    {
      id: 'ops_audit',
      name: 'Operations Audit',
      cost: 1800,
      oneTime: true,
      effectDesc: 'Reduces monthly overhead by $300. Unlocks Lean Operations skill.',
      effect: { overheadReduction: 300, unlockSkill: 'lean_operations' },
      referralRate: 0.3,
      referralType: 'office_professional',
      icon: '🔍',
    },
  ],

  // ── General Contractor ───────────────────────────────────
  'General Contractor': [
    {
      id: 'office_buildout',
      name: 'Office Buildout',
      cost: 3000,
      oneTime: true,
      effectDesc: 'Establishes a physical HQ. Increases employee capacity by 2. +reputation 50.',
      effect: { reputationBonus: 50, employeeCapacityBonus: 2 },
      referralRate: 0.25,
      referralType: 'trades_contractor',
      icon: '🏗️',
    },
  ],

  // ── Car Dealership ───────────────────────────────────────
  'Car Dealership': [
    {
      id: 'fleet_vehicle',
      name: 'Company Vehicle',
      cost: 2500,
      oneTime: true,
      effectDesc: 'Expand your prospect radius by 40%. Reach farther buildings faster on the map.',
      effect: { playerSpeedBonus: 0.4, prospectRadiusBonus: 0.4 },
      referralRate: 0.15,
      referralType: 'auto_services',
      icon: '🚘',
    },
  ],

  // ── Auto Repair ──────────────────────────────────────────
  'Auto Repair Shop': [
    {
      id: 'fleet_maintenance',
      name: 'Fleet Maintenance Plan',
      cost: 300,
      oneTime: false,
      effectDesc: 'Keeps your vehicle running. Required to maintain Car Dealership speed bonus.',
      effect: { maintainSpeedBonus: true },
      referralRate: 0.15,
      referralType: 'auto_services',
      icon: '🔧',
    },
  ],

  // ── Medical / Wellness ───────────────────────────────────
  'Wellness Center': [
    {
      id: 'team_wellness',
      name: 'Team Wellness Plan',
      cost: 500,
      oneTime: false,
      effectDesc: 'Eliminates employee burnout events. +1 skill point immediately.',
      effect: { preventBurnout: true, skillPoints: 1 },
      referralRate: 0.2,
      referralType: 'healthcare',
      icon: '🧘',
    },
  ],

  // ── Coffee Shop ──────────────────────────────────────────
  'Coffee Shop': [
    {
      id: 'client_lunch',
      name: 'Client Meeting (Coffee)',
      cost: 50,
      oneTime: false,   // can buy multiple times
      effectDesc: '+2 rapport on your very next encounter. Stacks up to 3 times.',
      effect: { nextEncounterRapportBonus: 2 },
      referralRate: 0.1,
      referralType: 'retail_food',
      icon: '☕',
    },
  ],

  // ── Real Estate ──────────────────────────────────────────
  'Real Estate Agency': [
    {
      id: 'office_lease',
      name: 'Upgraded Office Lease',
      cost: 1000,
      oneTime: true,
      effectDesc: 'Prestige address. +20 warmth with Financial and Legal prospects. +reputation 30.',
      effect: { warmthBonus: 20, warmthFilter: ['financial_services','office_professional'], reputationBonus: 30 },
      referralRate: 0.3,
      referralType: 'real_estate',
      icon: '🏡',
    },
  ],

  // ── Manufacturing / Industrial ───────────────────────────
  'Manufacturing': [
    {
      id: 'custom_materials',
      name: 'Custom Branded Materials',
      cost: 700,
      oneTime: true,
      effectDesc: '+10 warmth with Trades & Industrial prospects. Signals you understand their world.',
      effect: { warmthBonus: 10, warmthFilter: ['trades_contractor'] },
      referralRate: 0.2,
      referralType: 'trades_contractor',
      icon: '🏭',
    },
  ],

  // ── Pharmacy ─────────────────────────────────────────────
  'Independent Pharmacy': [
    {
      id: 'health_benefits',
      name: 'Employee Health Benefits',
      cost: 600,
      oneTime: false,
      effectDesc: 'Reduces employee error events by 50%. Required to hire senior staff.',
      effect: { preventBurnout: true, unlockSeniorHire: true },
      referralRate: 0.15,
      referralType: 'healthcare',
      icon: '💊',
    },
  ],

  // ── Electrical Contractor ────────────────────────────────
  'Electrical Contractor': [
    {
      id: 'office_setup',
      name: 'Office Tech Setup',
      cost: 1200,
      oneTime: true,
      effectDesc: 'Professional workspace setup. -$150/mo overhead. Unlocks remote work capability.',
      effect: { overheadReduction: 150 },
      referralRate: 0.2,
      referralType: 'trades_contractor',
      icon: '⚡',
    },
  ],
};

// ── Vendor helpers ────────────────────────────────────────────
export function getVendorServices(bizType) {
  return VENDOR_CATALOG[bizType] || [];
}

export function isVendorEligible(bizType) {
  return !!(VENDOR_CATALOG[bizType]?.length);
}
