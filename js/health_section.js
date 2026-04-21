// HEALTH AND CONSULTING SECTIONS

// ═══════════════════════════════════════════════════════════════════
// HEALTH INDUSTRY
// ═══════════════════════════════════════════════════════════════════

const HEALTH_OFFICE_PROFESSIONAL_S1 = [
  {
    phase: 'situation',
    question: "How many employees does your firm have, and do you currently have any kind of formal employee health or wellness benefit beyond standard health insurance coverage?",
    goodResponse: "Most professional firms have health insurance but nothing else — no EAP, no wellness program, no occupational health support. Understanding what's already in place tells me where the gaps are and what would add real value for your people.",
    badResponse: "We offer employee wellness and occupational health programs for professional firms.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "In a professional services environment where billing hours are the primary revenue driver — are you seeing productivity losses or presenteeism from employees coming to work despite illness, stress, or burnout, rather than staying home to recover?",
    goodResponse: "Presenteeism is one of the most underestimated productivity killers in professional services. An attorney billing at 60% cognitive capacity costs the firm almost as much as a vacant seat. What does sick day and vacation utilization look like in your firm?",
    badResponse: "Presenteeism in billable-hour firms is a hidden productivity and quality risk. We help firms address it.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If your senior professionals are consistently stressed, not sleeping well, and pushing through health issues to maintain billable hours — and that's showing up in quality of work, client relationships, or attrition — what's the talent and client retention cost of not addressing it?",
    goodResponse: "The burnout-attrition pipeline is real and very expensive. The cost of losing a senior associate or partner is typically 150-200% of their annual compensation. A wellness program that meaningfully reduces burnout attrition pays for itself many times over.",
    badResponse: "Burnout-driven attrition is extremely expensive in professional services. Wellness programs reduce it.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If your firm had a structured wellness program — mental health resources, biometric screenings, stress management, ergonomic assessments — that visibly demonstrated your investment in employee wellbeing, how would that affect recruiting, retention, and firm culture?",
    goodResponse: "A credible wellness program is a recruiting differentiator in the talent-competitive professional services market. It signals that the firm values people beyond billing output. Let me walk you through what our professional services wellness program looks like.",
    badResponse: "A real wellness program is a recruiting and retention investment. Let me walk you through our options.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const HEALTH_OFFICE_PROFESSIONAL_S2 = [
  {
    phase: 'situation',
    question: "Does your firm have any ergonomics program or policy for workstation setup — particularly for associates and paralegals doing high-volume document work at a computer all day?",
    goodResponse: "Repetitive strain and postural issues are occupational hazards in professional services environments. Most firms don't have formal ergonomics programs, and the workers' comp and productivity costs show up years later. What's your current setup?",
    badResponse: "We provide ergonomic assessments and programs for professional services firms.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Have you had employees take medical leave, file workers' comp claims, or complain about repetitive strain, back pain, or eye strain from their workstation setup?",
    goodResponse: "Repetitive strain and postural complaints in office environments are almost always preventable and almost always ignored until they become a workers' comp claim or a leave event. What does your claims history look like over the last few years?",
    badResponse: "Preventable musculoskeletal injuries create workers' comp costs and productivity losses. We prevent them.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If even one senior associate goes on leave for a repetitive strain injury — covering their work, managing the workers' comp claim, and dealing with the productivity gap during a busy period — what does that event cost the firm?",
    goodResponse: "A single workers' comp claim for a musculoskeletal injury typically costs $15-40k in direct costs and much more in productivity impact. A firm-wide ergonomics assessment costs a fraction of a single claim and reduces frequency significantly.",
    badResponse: "A single musculoskeletal workers' comp claim costs more than a full ergonomics program. We prevent claims.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If every workstation in your firm was assessed and optimized — sit-stand options where needed, monitor positioning corrected, keyboards selected for your high-volume users — and you reduced musculoskeletal complaints by half, what would that do to your workers' comp costs and employee comfort?",
    goodResponse: "Ergonomics programs have one of the highest and most measurable ROIs of any workplace health intervention. Let me walk you through what a professional firm assessment looks like and what we typically find.",
    badResponse: "A firm-wide ergonomics program pays for itself in workers' comp savings alone. Let's schedule an assessment.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const HEALTH_OFFICE_PROFESSIONAL_S3 = [
  {
    phase: 'situation',
    question: "Does your firm offer an Employee Assistance Program — mental health counseling, financial counseling, legal advice — or is mental health support primarily whatever employees access through their insurance plan?",
    goodResponse: "EAP penetration at most professional firms is very low — employees either don't know it's available or don't use it because of stigma. Mental health support for high-stress professionals is one of the highest-leverage wellness investments a firm can make. What's your current EAP situation?",
    badResponse: "We provide EAP and mental health support programs tailored for professional services firms.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "In a high-pressure billable-hour environment, are you seeing signals of mental health strain — higher-than-normal turnover at the 2-4 year associate level, productivity dips, or HR issues that seem stress-related?",
    goodResponse: "The 2-4 year associate burnout problem is almost universal in professional services. The investment to develop a third-year associate is enormous — losing them to burnout at that point is one of the most expensive talent events a firm experiences. How is your attrition looking in that tenure range?",
    badResponse: "Associate burnout attrition at 2-4 years is a structural problem in professional services. EAPs reduce it.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If mental health stress is contributing to 2-3 early-tenure associate departures per year — at $80-120k in recruiting and onboarding costs each — what's the annual cost of that attrition pattern?",
    goodResponse: "That's $160-360k in annual talent replacement costs for a problem that's significantly addressable through mental health support. An EAP program costs a fraction of that — typically $15-30 per employee per year — and the ROI on attrition reduction alone is very strong.",
    badResponse: "The math on EAP ROI versus burnout attrition is compelling. Let's run the numbers for your firm.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If your firm had a well-utilized EAP program — actively promoted, stigma-free, with counseling and crisis support accessible 24/7 — how would that change your associate retention and the mental health culture of the firm?",
    goodResponse: "A well-designed and actively promoted EAP is a culture statement as much as a benefit. It signals that the firm takes employee mental health seriously. Let me walk you through our professional services EAP and the utilization data from comparable firms.",
    badResponse: "A well-promoted EAP reduces burnout attrition and changes firm culture. Let me walk you through ours.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const HEALTH_TECH_COMPANY_S1 = [
  {
    phase: 'situation',
    question: "How large is your team, and do you have any structured wellness or health benefits beyond the standard health insurance plan — anything designed for the realities of desk-based, screen-heavy, fast-paced tech work?",
    goodResponse: "Tech companies have a specific wellness profile: sedentary work, high mental load, long hours, irregular sleep cycles. Standard health insurance addresses none of that proactively. Understanding what you currently offer tells me where the meaningful gaps are.",
    badResponse: "We offer tech-company-specific wellness programs that address the real health risks of knowledge work.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Are you seeing difficulty recruiting talent because your benefits package looks thin compared to larger tech employers, or retention issues where compensation is competitive but the overall employee experience isn't?",
    goodResponse: "Benefits package perception is a real factor in tech recruiting. When a candidate compares your offer against a larger tech employer, a thin wellness component can tip the decision. Engineers and PMs evaluate the whole package. What does your current benefits roster look like?",
    badResponse: "A thin wellness package is a recruiting disadvantage versus larger tech employers. We fix that.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If your benefits package is losing you even 2-3 engineering hires per year to companies with better wellness offerings — at average tech hiring costs of $25-40k per role — what's the annual cost of that competitive gap?",
    goodResponse: "$50-120k in recruiting costs for talent lost partly because of a benefits gap that costs $200/employee/year to close is a very clear ROI calculation. The wellness investment is often the cheapest lever in a competitive talent situation.",
    badResponse: "The recruiting cost of a thin benefits package usually dwarfs the cost of closing the gap. Let's model it.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If your company offered a wellness package that was genuinely competitive — mental health support, fitness stipends, health coaching, biometric screenings — and you could point to it concretely in recruiting conversations, how would that change your close rate on competitive offers?",
    goodResponse: "A credible wellness package is a talent acquisition tool that also reduces healthcare costs and improves productivity. Let me walk you through what our tech company wellness programs look like.",
    badResponse: "A competitive wellness package wins talent. Let me show you what it looks like for tech companies.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const HEALTH_TECH_COMPANY_S2 = [
  {
    phase: 'situation',
    question: "Does your company have any kind of mental health support program specifically — or do employees manage their mental health through whatever their insurance covers, which for tech workers often means long waits and limited in-network providers?",
    goodResponse: "Mental health access through standard insurance is notoriously poor — long waits, limited in-network options, sessions capped at unsustainably low counts. For a high-stress tech company, that's a meaningful gap. What's your current situation?",
    badResponse: "We provide mental health programs for tech companies that go beyond standard insurance limitations.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Do you find that your highest-performing engineers or product people are also your most at-risk for burnout — and that losing one of those people is disproportionately disruptive to projects and team morale?",
    goodResponse: "Top performers carry disproportionate load and often show burnout symptoms last because they're intrinsically motivated. When they do leave, the impact is outsized — institutional knowledge loss, project disruption, and a morale signal to the rest of the team. What does burnout look like in your team currently?",
    badResponse: "High-performer burnout is a disproportionate loss. Mental health programs protect your most critical people.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If a key engineer or tech lead burns out and leaves — taking institutional knowledge about a critical system and disrupting a product sprint — what's the six-month impact on your product roadmap and team stability?",
    goodResponse: "Key engineer attrition in the wrong moment can push a launch by a quarter or longer. Mental health support isn't just a benefit — for tech companies, it's product velocity insurance for your most valuable people.",
    badResponse: "Key engineer burnout has product velocity consequences that are very expensive. Mental health programs reduce the risk.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If your company had a meaningful mental health program — fast-access therapy, manager training on early burnout recognition, and a culture that normalizes using mental health resources — how would that change your team's resilience and ability to sustain output through high-pressure periods?",
    goodResponse: "Team resilience is a product delivery input. Companies that invest in mental health support sustain higher output during pressure periods because their teams have resources to manage stress before it becomes a performance failure. Let me walk you through our tech company mental health programs.",
    badResponse: "Mental health investment is product velocity insurance for tech teams. Let me walk you through our programs.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const HEALTH_TECH_COMPANY_S3 = [
  {
    phase: 'situation',
    question: "Do you track any employee health or productivity metrics — absenteeism rates, health insurance utilization trends, sick day patterns — or is the health picture of your team essentially invisible from a data standpoint?",
    goodResponse: "Most tech companies have no visibility into the health metrics that predict productivity and attrition. Health insurance utilization, absenteeism patterns, presenteeism signals — these are leading indicators of team health problems. What's your current data posture?",
    badResponse: "We help tech companies track and act on employee health metrics that predict productivity and attrition.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Without visibility into employee health trends, are you finding out about health-related productivity problems — chronic conditions, stress-related absenteeism, preventable illness — only when they've already impacted the team?",
    goodResponse: "Reactive health management in the workplace is significantly more expensive than proactive. By the time a chronic condition is manifesting in absenteeism, the health issue has often been building for months. Biometric screening and proactive programs catch these things early.",
    badResponse: "Reactive health management is always more expensive than proactive. We bring the data to make it proactive.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If preventable chronic conditions in your team are silently reducing cognitive performance and increasing sick day frequency, what's the aggregate productivity and healthcare cost impact you're absorbing without knowing it?",
    goodResponse: "The aggregate cost of unmanaged chronic risk factors is significant. Research consistently shows that proactive wellness programs reduce healthcare costs by $3-6 for every $1 invested. What does your current sick day and productivity trend look like?",
    badResponse: "Unmanaged chronic health risk factors cost you in insurance claims and productivity. Wellness programs change the math.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If you had an annual biometric screening program that gave you a population-level health dashboard — identifying the highest-risk categories in your team — and you could intervene proactively with targeted wellness programs, how would that change your insurance costs and your team's sustained performance?",
    goodResponse: "Data-driven workplace wellness is now accessible to companies at any size. Let me walk you through what an annual screening and population health management program looks like and what the typical ROI looks like over 2-3 years.",
    badResponse: "Data-driven wellness reduces insurance costs and improves performance. Let me show you the program.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const HEALTH_HEALTHCARE_S1 = [
  {
    phase: 'situation',
    question: "I know this might seem unusual — a health and wellness provider approaching a medical practice — but I'm curious: do you offer your own staff any employee wellness benefits, or do they get their healthcare informally through being in a medical environment?",
    goodResponse: "Healthcare workers are underserved in their own wellness — staff wellness programs in medical practices show real impact on staff retention and morale. What does your current staff benefit picture look like?",
    badResponse: "We provide employee wellness programs for healthcare practices — for the staff who provide care, not patients.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Are you seeing compassion fatigue, burnout, or high turnover in clinical support staff — MAs, dental assistants, front desk — where the emotional and physical demands of the job are taking a visible toll?",
    goodResponse: "Healthcare support staff burnout is a significant and growing problem. The physical demands combined with often modest wages create high turnover. What does your staff attrition rate look like annually?",
    badResponse: "Clinical support staff burnout is a healthcare industry retention crisis. Wellness programs are a proven retention tool.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If you're replacing 2-3 clinical support staff per year from burnout-related turnover — at hiring, onboarding, and training costs of $8-15k each, and each new hire taking 3-6 months to reach full productivity — what's the annual operational cost of that pattern?",
    goodResponse: "Staff turnover in healthcare practices is extremely disruptive and expensive. $25-45k in direct replacement costs, plus the patient experience impact of untrained staff in clinical roles. A wellness program that reduces attrition in even one position annually pays for the entire program.",
    badResponse: "Staff turnover in healthcare practices has direct cost and patient experience consequences. Wellness programs reduce it.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If your practice offered a staff wellness program — stress management, ergonomic support, mental health resources, health screenings — how would that impact retention, morale, and the patient experience your staff delivers?",
    goodResponse: "Staff wellness in healthcare is directly correlated with patient satisfaction scores. A wellness program improves both. Let me walk you through what we've built for practices your size.",
    badResponse: "Staff wellness improves both retention and patient experience in healthcare. Let me show you our practice program.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const HEALTH_HEALTHCARE_S2 = [
  {
    phase: 'situation',
    question: "Does your practice have occupational health protocols for staff — sharps injury management, exposure incident procedures, lifting and ergonomics guidance for clinical staff — or is occupational health primarily managed on an ad hoc basis?",
    goodResponse: "Occupational health compliance is a real liability area for healthcare practices. OSHA requirements around bloodborne pathogen exposure, ergonomics in clinical settings, and workplace injury management are specific to healthcare. Understanding your current protocols tells me where the risk might be.",
    badResponse: "We provide occupational health compliance support for healthcare practices.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Have you had any OSHA recordable incidents, sharps injuries, or workers' comp claims from clinical staff that highlighted a gap in your occupational health and safety protocols?",
    goodResponse: "Sharps injuries and musculoskeletal strains from patient handling are the most common workers' comp claims in medical practices. They're also among the most preventable with proper protocols and training. What does your incident history look like over the last few years?",
    badResponse: "Clinical staff injuries are preventable with the right occupational health protocols. We implement them.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If a sharps injury or improper patient handling incident results in a workers' comp claim, a potential bloodborne pathogen exposure workup, and a staff member on modified duty — what does that event cost the practice in direct and indirect costs?",
    goodResponse: "A single needlestick injury can cost $5-15k in medical workup costs alone, not including workers' comp premiums and modified duty coverage. Most clinical injuries are preventable. OSHA compliance programs reduce their frequency dramatically.",
    badResponse: "A single clinical staff injury can cost $10k+ in direct costs. Prevention programs cost a fraction of that.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If your practice had a comprehensive occupational health program — OSHA-compliant safety protocols, proper sharps and body mechanic training, incident response procedures — how would that reduce your workers' comp exposure and your liability risk as an employer?",
    goodResponse: "Occupational health compliance for clinical employers is a legal requirement and a financial protection. Let me walk you through what a healthcare practice occupational health program includes.",
    badResponse: "An occupational health program protects your staff and your practice from costly incidents. Let me walk you through ours.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const HEALTH_HEALTHCARE_S3 = [
  {
    phase: 'situation',
    question: "Does your practice do anything to help patients manage chronic conditions proactively — lifestyle coaching, weight management programs, nutrition counseling — or is that work handled by referral to other providers?",
    goodResponse: "Chronic disease management is one of the highest-value and fastest-growing service areas for primary care practices. Understanding whether you're capturing that revenue or referring it out tells me if there's an opportunity to add a service line.",
    badResponse: "We partner with healthcare practices to add chronic disease and wellness management service lines.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "If you're referring patients elsewhere for weight management or lifestyle coaching — are those patients returning to your practice after those programs, or are you losing them to the specialist or program they enrolled in?",
    goodResponse: "Referral leakage to wellness programs is a real patient retention issue. Patients who enroll in weight management programs often shift their primary relationship toward the provider managing those programs. Are you seeing patients return after those referrals?",
    badResponse: "Referral leakage to wellness programs costs practices long-term patient relationships. We keep it in-house.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If you're losing 15-20 patients per year to other providers through chronic disease and wellness referrals — and each of those patients has a significant annual visit value plus downstream revenue — what does that outbound referral pattern cost you?",
    goodResponse: "Chronic condition patients are high-lifetime-value relationships — they require ongoing management, generate regular visits, and refer within their networks. An in-house wellness service changes the retention calculus dramatically.",
    badResponse: "Chronic condition patients have high lifetime value. Keeping them in-house with the right service line is worth modeling.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If your practice could offer an in-house lifestyle and chronic disease management program — adding revenue, keeping those patients in your panel, and improving the clinical outcomes your practice is measured on — how would that change both your patient retention and your value-based care metrics?",
    goodResponse: "In-house wellness and chronic disease management improves patient outcomes, increases revenue per patient, and strengthens patient relationships — all simultaneously. Let me walk you through how we help practices add this capability.",
    badResponse: "An in-house chronic disease and wellness program retains patients and adds revenue. Let me show you how to add it.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const HEALTH_RETAIL_FOOD_S1 = [
  {
    phase: 'situation',
    question: "How many employees do you have — including part-time staff — and do you currently offer any health or wellness benefit, or is that something you haven't been able to afford or prioritize yet?",
    goodResponse: "Most retail and food businesses don't offer formal wellness benefits — the margins are thin and the workforce is often part-time. But there are practical, low-cost options that make a real difference in staff health and retention. Understanding your team size and turnover helps me figure out what makes sense.",
    badResponse: "We offer scaled wellness programs for retail and food businesses, even for part-time-heavy teams.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "In a retail or food service environment — where staff are on their feet for long shifts, doing repetitive tasks, often in physically demanding conditions — are you seeing higher-than-you'd-like absenteeism, workers' comp claims from slips or sprains, or turnover driven by physical wear?",
    goodResponse: "Physical strain injuries are the most common and most costly occupational health issues in retail and food service. Slips, trips, back strains from lifting, repetitive motion — these generate real workers' comp costs. What does your incident and sick day history look like?",
    badResponse: "Physical strain and injury are occupational hazards in retail and food. We reduce them with practical programs.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If you're averaging even 2 workers' comp claims per year from slips, lifting injuries, or repetitive strain — at average claim costs of $5-15k each — plus the productivity loss of replacing that person while they're on modified duty, what's the annual cost of workplace injuries?",
    goodResponse: "Even two workers' comp claims per year at modest severity is $10-30k in direct costs plus premium impact. A safety and ergonomics program that costs $2-3k per year and reduces claims frequency by half pays for itself many times over. Has your workers' comp premium gone up recently?",
    badResponse: "Workers' comp claims cost far more than prevention programs. We help retail and food businesses break the claims cycle.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If your staff had basic occupational health and safety training, ergonomics guidance for common tasks in your environment, and a clear incident response process — how would that reduce your workers' comp exposure and give you better control of your insurance costs?",
    goodResponse: "Practical safety programs for retail and food businesses don't need to be complicated or expensive. Let me walk you through what we offer businesses your size — it usually starts with a safety assessment and a half-day training that addresses 80% of the highest-risk scenarios.",
    badResponse: "A practical safety program reduces claims and insurance costs. Let me show you what we do for businesses like yours.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const HEALTH_RETAIL_FOOD_S2 = [
  {
    phase: 'situation',
    question: "For your managers and full-time staff — the people who make up the core of your team — do you know if health or benefits is a factor in why they stay or why they leave when they do?",
    goodResponse: "Retail and food businesses that figure out low-cost benefits packages have a real retention advantage over competitors who offer none. Understanding whether health or wellness is a factor in your turnover tells me if there's a lever here worth pulling.",
    badResponse: "We help retail and food businesses design low-cost benefits that improve retention for core staff.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "When a reliable manager or senior team member leaves, what's the primary reason they give — and is compensation plus lack of benefits a consistent theme?",
    goodResponse: "Total compensation perception is the most common reason good managers leave retail and food businesses. They can earn similar wages elsewhere but choose the place with a better benefits package. A practical wellness benefit that costs $20-30 per employee per month can be the difference that keeps your best people.",
    badResponse: "Lack of benefits is a consistent attrition driver in retail and food. We provide practical, affordable options.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If losing a manager to a competitor with better benefits costs you 4-6 weeks of recruiting, training, and productivity loss — what's the annual retention cost of not having a wellness benefit that costs $500-600 per employee per year?",
    goodResponse: "A manager earning $45k takes 6-10 weeks and $8-15k to replace when you factor in everything. A wellness benefit that costs $600/year and reduces manager turnover by even 30% pays for the entire program.",
    badResponse: "The replacement cost of one manager usually exceeds the annual cost of a wellness benefit. Let's run the math.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If you could offer your core team a real wellness benefit — health screenings, telehealth access, a fitness stipend — for a per-employee cost that's a fraction of what one manager replacement costs, how would that change your retention and your reputation as a good place to work?",
    goodResponse: "Being known as a business that takes care of its people is a recruiting advantage in retail and food labor markets. Let me walk you through what we offer businesses your size and what the cost per employee looks like.",
    badResponse: "A wellness benefit is a retention investment with very clear ROI. Let me show you what it costs versus what it saves.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const HEALTH_RETAIL_FOOD_S3 = [
  {
    phase: 'situation',
    question: "In your food service environment, do you have a formal food handler health policy — for illness, communicable disease screening — beyond the basic health department requirements?",
    goodResponse: "Food handler health policies above the minimum regulatory requirement are a quality and brand protection measure. The reputational cost of a foodborne illness event is existential for a restaurant. Understanding your current approach tells me if there's a program that would add value.",
    badResponse: "We help food service businesses implement health policies that protect customers and brand reputation.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Have you ever had a situation where a sick employee came to work — because they felt they couldn't call out — and it raised concerns about food safety or customer health?",
    goodResponse: "The presenteeism problem in food service is a serious public health and brand risk. Employees with narrow financial margins feel they can't afford to miss shifts, so they come in sick. The cost of a foodborne illness incident is catastrophically larger than the labor cost of a backup policy.",
    badResponse: "Sick employees coming to work in food service are a health code and brand liability. We help prevent it.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If a foodborne illness incident were traced back to your establishment — even one customer complaint that went to the health department — what would the investigation, temporary closure risk, and reputational damage cost your business?",
    goodResponse: "One foodborne illness incident that generates a health department inspection can result in a temporary closure, social media exposure, and a permanent reputational hit. Yelp reviews don't forget. The cost of a robust employee health policy is essentially zero relative to that tail risk.",
    badResponse: "A foodborne illness incident is a near-existential reputational risk. A health policy prevents it.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If your team had a clear, enforced food handler illness policy — supported by a small sick-day coverage program that made it financially viable for employees to stay home when sick — how would that reduce your health code risk and protect your business's reputation?",
    goodResponse: "A food handler health policy backed by a practical sick day coverage mechanism is a brand protection tool. Let me walk you through how we help food service businesses implement this in a way that's financially manageable and culturally viable.",
    badResponse: "A food handler health policy protects your brand and your customers. Let me show you how we implement it.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const HEALTH_TRADES_CONTRACTOR_S1 = [
  {
    phase: 'situation',
    question: "How many field employees do you have, and do you currently have a formal occupational health program — pre-employment physicals, drug testing, OSHA safety training, return-to-work protocols — or is that handled informally?",
    goodResponse: "Occupational health programs for trades contractors are one of the highest-ROI investments in the business. The physical demands of field work, the injury risk, and the workers' comp exposure are all directly addressed by a structured program. Understanding your current state tells me where the gaps are.",
    badResponse: "We provide occupational health programs for trades contractors — field-worker focused and OSHA-compliant.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Are workers' comp claims, injury frequency, or OSHA recordable incidents a meaningful cost and operational problem — and do you have a sense of how your injury rates compare to the industry average for your trade?",
    goodResponse: "Trades contractors typically have experience modification rates (EMR) that directly affect both workers' comp premiums and eligibility for certain commercial contracts. A high EMR can cost you bids on jobs that require contractors below a certain EMR threshold. Where do you think yours sits relative to your trade?",
    badResponse: "Workers' comp and OSHA incident rates affect both your costs and your contract eligibility. We improve both.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If your EMR is above 1.0 — or rising because of recent claims — and a major commercial or government contract requires bidders to be below a certain EMR threshold, how many jobs are you potentially ineligible to bid on because of your safety record?",
    goodResponse: "An above-average EMR is both a cost problem and a market access problem. Higher workers' comp premiums and ineligibility for EMR-gated contracts can cost a trades contractor far more than the investment in an occupational health and safety program. Have you ever been screened out of a bid because of your EMR?",
    badResponse: "High EMR creates workers' comp cost and contract eligibility problems. A safety program lowers it.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If you had a structured occupational health program — pre-employment physicals, safety training, return-to-work protocols — that measurably reduced your incident rate and brought your EMR below 1.0, how would that change your workers' comp costs and the contracts you're eligible to bid?",
    goodResponse: "Bringing an EMR below 1.0 typically reduces workers' comp premiums by 20-30% and opens up contract eligibility that can represent significant additional revenue. Let me walk you through our trades contractor occupational health program.",
    badResponse: "Lower EMR means lower insurance costs and more contract eligibility. Our program delivers both.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const HEALTH_TRADES_CONTRACTOR_S2 = [
  {
    phase: 'situation',
    question: "Do you do pre-employment physicals and drug testing for new field hires — and is that being done through a formal occupational health provider or more informally through urgent care?",
    goodResponse: "Pre-employment screening is the first line of defense against unsafe hires in a trades environment. Doing it through an occupational health provider versus urgent care creates a very different outcome — occupational health providers know the job demands and screen accordingly. What's your current approach?",
    badResponse: "We provide occupational health pre-employment screening for trades contractors.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Have you ever hired a field employee who seemed physically capable, went through whatever basic screening you had, and then filed a workers' comp claim in the first 90 days for a pre-existing condition the screening didn't catch?",
    goodResponse: "Early-tenure workers' comp claims from pre-existing conditions are one of the most frustrating and preventable scenarios for contractors. A proper functional capacity evaluation at pre-employment screens for the conditions that create that risk. What's your hiring period claim experience been like?",
    badResponse: "Pre-existing condition workers' comp claims from improper pre-employment screening are preventable. We prevent them.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If a new hire files a workers' comp claim in the first 60 days for a pre-existing back condition that a proper occupational health screening would have flagged — and that claim runs $20-50k — what's the combined cost of the claim plus the premium impact on your renewal?",
    goodResponse: "Early claims are disproportionately damaging to an EMR. A $30k claim in the first quarter of employment, plus the EMR impact at renewal, can easily represent $50-80k in total financial impact. A proper pre-employment screening that costs $150-200 per hire prevents that.",
    badResponse: "Early-tenure claims from missed pre-existing conditions are very expensive. Proper screening prevents them.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If every new field hire went through an occupational health pre-employment screening that included a functional capacity evaluation matched to the job demands — how would that change your workers' comp cost trajectory over the next 3 years?",
    goodResponse: "The EMR improvement from better pre-employment screening compounds over time — fewer claims means lower modifier means lower premiums year over year. Let me walk you through our trades contractor screening program.",
    badResponse: "Better pre-employment screening is the highest-ROI workers' comp investment for most contractors. Let me show you ours.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const HEALTH_TRADES_CONTRACTOR_S3 = [
  {
    phase: 'situation',
    question: "When a field employee gets hurt on the job — even a minor injury — what does your incident response process look like: who manages the claim, who coordinates with the workers' comp carrier, and do you have a return-to-work program?",
    goodResponse: "Post-injury management is where most contractors leave significant money on the table. Without a clear incident response process, injured employees default to the ER rather than occupational health, claims run longer, and return-to-work is slower. What does your current process look like?",
    badResponse: "Post-injury incident management and return-to-work programs are where we save contractors the most money.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "If an injured employee goes to the ER rather than an occupational health clinic — because there's no established protocol — do you find that claim costs are significantly higher and return-to-work timelines significantly longer?",
    goodResponse: "ER-treated occupational injuries consistently generate higher claim costs than occupational health clinic-treated injuries — typically 3-5x higher for the same type of injury. Where do your injured employees typically go for initial treatment?",
    badResponse: "ER-treated claims cost 3-5x more than occupational health clinic claims. We redirect employees properly.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If 50% of your workers' comp claims are going through the ER rather than occupational health — and each of those claims costs 3-4x more — what does that differential cost you annually across your claim volume?",
    goodResponse: "For a contractor with 10+ field employees, the difference between ER-defaulting and occupational health-directed injury management can easily be $50-100k in annual workers' comp costs. It's one of the most actionable changes a contractor can make.",
    badResponse: "Redirecting injured employees from ER to occupational health is the fastest way to reduce claim costs. Let's quantify it.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If your crew had clear protocols — any injury goes directly to our occupational health clinic, not the ER — combined with a structured return-to-work program that got injured employees back on modified duty within days, how would that change your claim costs and your EMR trend?",
    goodResponse: "Post-injury management protocol changes are the single highest-ROI occupational health intervention for most trades contractors. Let me walk you through our injury management program and the before-and-after data from contractors we've worked with.",
    badResponse: "Clear injury management protocols and return-to-work programs dramatically reduce claim costs. Let me show you our results.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const HEALTH_AUTO_SERVICES_S1 = [
  {
    phase: 'situation',
    question: "How many full-time technicians do you employ, and do you have any kind of workplace health or safety program beyond basic OSHA requirements?",
    goodResponse: "Auto service shops have real occupational health risks — chemical exposure, ergonomic strain from working under vehicles, eye injuries, respiratory issues from exhaust and chemicals. Even a small shop with 3-4 techs has meaningful exposure. Understanding your current setup tells me if there's a practical program that would help.",
    badResponse: "We offer practical occupational health programs for auto service shops.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Have you had workers' comp claims from technicians — back or shoulder injuries from working under vehicles, chemical burns, eye injuries, hearing damage from shop noise — and are those claims affecting your workers' comp premiums?",
    goodResponse: "Auto service is a high workers' comp frequency industry. The physical demands on technicians — awkward positions under vehicles, repetitive lifting, chemical exposure — generate real claims. EMR modifiers for auto service shops are frequently above 1.0. What does your claims history look like?",
    badResponse: "Auto shop workers' comp claims are frequent and preventable. We help reduce their frequency.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If a technician goes on workers' comp for a back injury — even 3-4 weeks of modified duty — what does that cost you in productivity loss, claim expense, and premium impact at renewal?",
    goodResponse: "A 4-week workers' comp event for a technician at $35/hr billing rate is $5,600 in lost production, plus the claim medical costs, plus the premium modifier impact for 3 years. A safety and ergonomics program that prevents that claim costs a fraction of the value destroyed by one event.",
    badResponse: "One technician workers' comp event costs far more than a full safety program. The math is clear.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If your shop had proper ergonomic lift practices, chemical safety protocols, and an occupational health relationship that handled injury management correctly when something does happen — how would that reduce your claims frequency and bring your workers' comp costs down over time?",
    goodResponse: "Auto shop occupational health programs that address the top injury categories consistently reduce claims frequency by 30-50% over 2-3 years. Let me walk you through what a practical program looks like for shops your size.",
    badResponse: "An occupational health program reduces auto shop claims and insurance costs. Let me show you what it entails.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const HEALTH_AUTO_SERVICES_S2 = [
  {
    phase: 'situation',
    question: "Do your technicians have regular hearing tests or respiratory health monitoring — given the noise levels and chemical exposure in a typical shop environment?",
    goodResponse: "Noise-induced hearing loss and chemical respiratory conditions are the two slow-developing occupational health risks that auto shops most consistently miss. They're not acute injuries — they develop over years — and by the time they show up in a workers' comp claim, the damage is significant. What's your current monitoring?",
    badResponse: "We provide occupational health monitoring for auto shop chemical and noise exposure risks.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Has any technician raised concerns about hearing or respiratory symptoms — ringing in ears, shortness of breath, persistent cough — and have you had any OSHA inspections that flagged noise or chemical exposure?",
    goodResponse: "OSHA requires noise monitoring and hearing conservation programs in shops above certain decibel levels — which most auto shops exceed. Technicians often don't connect respiratory or hearing symptoms to the workplace until they're significant. Have you had an OSHA compliance review recently?",
    badResponse: "Auto shop noise and chemical exposure are regulated occupational health risks. OSHA compliance is required.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If a technician files a workers' comp claim for occupational hearing loss after 10 years in your shop — and there was no documented hearing conservation program — what's the claim exposure and potential OSHA citation risk?",
    goodResponse: "Occupational hearing loss claims are among the most expensive in workers' comp because they're permanent impairment claims. Without documented audiometric monitoring, the employer has very little defense. The OSHA violation on top of the claim compounds the cost significantly.",
    badResponse: "Occupational hearing loss claims without documentation are expensive and difficult to defend. We create the documentation.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If your technicians were enrolled in annual audiometric testing and respiratory monitoring — OSHA-compliant documentation in place, baseline established, changes tracked — how would that reduce your long-term claims exposure and protect the shop if OSHA came through?",
    goodResponse: "Annual health monitoring for your technicians is the documentation foundation that protects both the employees and the business. Let me walk you through our auto shop health monitoring program — what it covers, what it costs, and what the OSHA compliance protection looks like.",
    badResponse: "Annual health monitoring creates the OSHA compliance documentation that protects your shop. Let me walk you through it.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const HEALTH_AUTO_SERVICES_S3 = [
  {
    phase: 'situation',
    question: "Do you drug test technicians — at hire and post-accident — and do you have a current, documented drug and alcohol policy that your workers' comp carrier has on file?",
    goodResponse: "Drug testing programs combined with a documented policy are a workers' comp rate factor for many carriers. A post-accident drug test that comes back positive can also allow employers to deny a claim in many states. What's in place currently?",
    badResponse: "We provide drug testing and workplace health policy support for auto service businesses.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Have you ever had a post-accident situation where you suspected impairment but had no post-accident drug testing process in place — and lost the ability to defend the workers' comp claim?",
    goodResponse: "Post-accident drug testing protocol gaps are a real workers' comp defense problem. In states that allow claim denial based on positive post-accident tests, not having that process means you can't use it even when impairment was likely. What's your current post-accident response protocol?",
    badResponse: "Post-accident testing protocol gaps cost you workers' comp claim defense options. We fill those gaps.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If you can't deny a workers' comp claim because there's no post-accident testing protocol — even in a situation where impairment was suspected — what does one undefendable claim at $25-50k cost you in direct and premium impact?",
    goodResponse: "One undefended claim that could have been denied or reduced with proper protocol is typically $30-80k in combined direct and premium costs. A drug testing and policy program that costs a fraction of a single claim — the math for even one prevented claim is compelling.",
    badResponse: "One undefended claim costs far more than a drug testing program. The ROI is clear.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If you had a complete drug and alcohol policy, pre-employment testing, post-accident testing capability, and documented protocols that your workers' comp carrier was aware of — how would that strengthen your claims defense posture and potentially improve your premium classification?",
    goodResponse: "A complete drug testing and policy program is a workers' comp premium tool as well as a claims defense tool. Some carriers offer premium credits for documented programs. Let me walk you through what we put in place for auto service businesses.",
    badResponse: "A complete drug testing program improves your claims defense and can lower your premium. Let me walk you through it.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const HEALTH_FINANCIAL_SERVICES_S1 = [
  {
    phase: 'situation',
    question: "How many employees does your firm have, and do you currently offer any wellness benefit beyond standard health insurance — anything specifically designed for the stress profile of financial services work?",
    goodResponse: "Financial services is one of the highest-stress professional environments — market volatility, client anxiety, regulatory pressure, long hours. Standard health insurance does nothing to address those specific stressors proactively. What's currently in place?",
    badResponse: "We offer employee wellness programs tailored to the stress profile of financial services firms.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Are you seeing advisors or support staff showing signs of chronic stress — difficulty sleeping during volatile markets, high-conflict periods, or client loss events — that's affecting performance or creating health issues?",
    goodResponse: "Financial advisors experience a form of vicarious financial stress from clients that's distinct from other industries. During market downturns, they're managing both their own professional performance and the emotional state of scared clients. That stress load has real health consequences. What does advisor wellbeing look like in high-volatility periods?",
    badResponse: "Financial services stress is specific and serious. We have programs designed for it.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If chronic stress is degrading the judgment, emotional regulation, and client communication quality of your advisors — especially during high-stakes market events — what's the client retention and AUM risk of advisor performance decline during those critical periods?",
    goodResponse: "Advisors who can't maintain composure during volatile markets are a client retention risk at exactly the moment when the relationship is under the most stress. That's a wellness problem as much as a training problem.",
    badResponse: "Advisor performance under stress directly affects client retention during the moments that matter most.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If your advisors had genuine stress management resources — regular mental health check-ins, resilience programs, something beyond just pushing through — how would that change their performance consistency in high-pressure periods and the client experience they deliver?",
    goodResponse: "Advisor resilience is a client retention asset. Firms that invest in their advisors' mental health build teams that perform better when it matters most. Let me walk you through our financial services wellness program.",
    badResponse: "Advisor mental health investment is a client retention investment in disguise. Let me show you our program.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const HEALTH_FINANCIAL_SERVICES_S2 = [
  {
    phase: 'situation',
    question: "Does your firm have any structured health screening benefits — biometric screenings, cardiovascular risk assessments, annual wellness exams — either as a company-paid benefit or through a wellness program?",
    goodResponse: "Biometric screening benefits have strong adoption in financial services because the workforce tends to be analytically minded and responds to data about their own health. Understanding what you currently offer tells me whether there's a program enhancement worth exploring.",
    badResponse: "We provide biometric screening and preventive health programs for financial services firms.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Are you seeing any health-related productivity issues — senior employees with chronic conditions affecting their availability, executives dealing with preventable health events that create leadership disruption?",
    goodResponse: "Executive and senior leader health events are some of the most disruptive and preventable business continuity risks. A heart attack or serious illness that sidelines a key principal has both human and business consequences. Preventive screening programs address this proactively.",
    badResponse: "Executive health events are preventable business continuity risks. Proactive screening catches them early.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If a principal or senior advisor has a major health event that sidelines them for 6-12 months — and client relationships drift, team confidence shakes, and firm continuity is disrupted — what's the combined human and business cost?",
    goodResponse: "Principal health events in financial services firms are some of the most underinsured business continuity risks. Key person insurance addresses some financial exposure, but it can't replace the client relationship loss or team disruption. Preventive programs reduce the probability of those events.",
    badResponse: "Principal health events create major business continuity risk. Prevention is always cheaper than disruption.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If your key people had access to proactive health screenings, executive wellness programs, and early detection for the most common executive health risks — how would that reduce your business continuity risk and demonstrate to your team that you genuinely invest in their long-term health?",
    goodResponse: "Executive wellness programs as a business continuity tool is an underutilized concept in financial services. Let me walk you through what we offer — from group biometric screenings to individual executive health partnerships.",
    badResponse: "An executive wellness program is a business continuity investment. Let me show you what we offer.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const HEALTH_FINANCIAL_SERVICES_S3 = [
  {
    phase: 'situation',
    question: "Does your firm offer any employee assistance or financial wellness program — it's interesting how often financial firms offer no financial wellness benefit to employees, even though it's core to what you do for clients?",
    goodResponse: "Financial advisory firms that help clients with wealth management often don't offer financial wellness education to their own employees. Financial stress is one of the top drivers of workplace distraction and health decline. What does your current benefits picture look like for non-advisor staff?",
    badResponse: "We provide comprehensive employee assistance programs that include financial wellness education.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "For your support staff — operations, compliance, admin — are financial stress, health concerns, or personal issues creating absenteeism, distraction, or HR challenges that affect the firm's operational reliability?",
    goodResponse: "Support staff financial and personal stress is a consistent hidden productivity drain in professional firms. The operations specialist distracted by credit card debt, the admin stressed about an unmanaged health issue — they're present but not fully there. What does your absenteeism and HR issue frequency look like?",
    badResponse: "Support staff financial and personal stress creates productivity and HR issues. EAPs address both.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If support staff distraction and stress-related absenteeism is creating operational reliability issues — missed deadlines, processing errors, compliance gaps — and those issues are reaching clients or creating regulatory exposure, what's the downstream cost to the firm?",
    goodResponse: "Compliance and operational errors in a financial services firm are expensive — both in direct remediation costs and in regulatory exposure. Support staff mental health and financial stress is a compliance risk input that most firms don't think about in those terms.",
    badResponse: "Support staff stress creates operational risk in financial services. An EAP reduces the risk.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If your firm offered an EAP that included mental health counseling, financial wellness education, legal resources, and work-life support — for both advisors and support staff — how would that reduce your operational risk and improve the overall health and retention of your team?",
    goodResponse: "An EAP is one of the highest-utilization, lowest-cost per-employee benefits a firm can add. For financial services, it's also a risk management tool. Let me walk you through our financial services EAP and what utilization and retention data looks like from comparable firms.",
    badResponse: "An EAP is a low-cost, high-value benefit that reduces operational risk. Let me walk you through it.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const HEALTH_REAL_ESTATE_S1 = [
  {
    phase: 'situation',
    question: "Real estate agents are genuinely one of the most health-neglected professional groups — long hours, no employer health coverage, no sick days, high driving exposure. Do you offer your agents any wellness or health support beyond whatever they have on their own?",
    goodResponse: "Independent contractor agents are entirely responsible for their own health and wellness, and most don't prioritize it. The brokerage that provides some kind of group health resource becomes a meaningful differentiator for agent recruiting and retention. What does your current agent support picture look like?",
    badResponse: "We provide group wellness programs for real estate brokerages to use as an agent recruiting and retention tool.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Have you lost agents to competing brokerages that offered better support or benefits — and when you talk to agents you're recruiting, does the benefits picture come up as a differentiator?",
    goodResponse: "Agent recruiting is increasingly competitive. Split percentages and marketing support are baseline. Firms that add tangible non-commission benefits — group health resources, wellness programs, professional development — are differentiating on dimensions that split-focused competitors can't easily match.",
    badResponse: "Agent recruiting is competitive, and wellness benefits are a differentiator most brokerages ignore. We create that edge.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If you're losing 2-3 producing agents per year to competitors who offer better support programs — and each producing agent represents $30-80k in annual GCI to the brokerage — what's the talent retention cost of not having a meaningful agent benefit?",
    goodResponse: "Producing agent attrition is the most expensive loss event for a brokerage. A wellness benefit that costs $200-300 per agent per year and reduces that attrition rate by 20% has extraordinary ROI.",
    badResponse: "Producing agent attrition has massive GCI impact. A wellness benefit at low cost can meaningfully reduce it.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If your brokerage offered agents access to a group health screening program, telehealth benefit, and wellness resources — at a nominal cost per agent they partly or fully contribute to — how would you use that in recruiting conversations and what do you think the retention impact would be?",
    goodResponse: "A group wellness benefit is a brokerage brand tool as much as a health benefit. It says: we invest in our agents as people, not just transaction partners. Let me walk you through what we offer brokerages and how the group pricing structure works for independent contractor agents.",
    badResponse: "A group wellness benefit is an agent recruiting and retention tool. Let me show you what's practical for a brokerage.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const HEALTH_REAL_ESTATE_S2 = [
  {
    phase: 'situation',
    question: "For your staff employees — transaction coordinators, admin, marketing — do you have a formal wellness benefit, and is agent and staff wellness something you've thought about strategically as part of your employer brand?",
    goodResponse: "Real estate brokerages often focus entirely on agent-side support and forget that the staff experience is equally important for operational stability. Transaction coordinators and admin staff are critical to volume — and they have their own benefits expectations. What's your current staff benefits picture?",
    badResponse: "We help real estate brokerages build wellness programs for both agents and staff.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Are you finding it difficult to hire and retain transaction coordinators or admin staff in competition with brokerages, title companies, or general employers who offer better benefits packages?",
    goodResponse: "Transaction coordinators and real estate admin are in a competitive labor market. They can work for brokerages, title companies, or general admin roles — and they'll often choose the employer with the better benefits package over a marginally higher wage. Where are you competitive and where are you not in the benefits conversation?",
    badResponse: "Staff benefits competition with title companies and general employers affects TC and admin retention.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If staff turnover in TC and admin roles is costing you 2-3 replacement cycles per year — with each cycle representing 4-6 weeks of productivity loss and $4-8k in replacement costs — what's the total staff retention cost from a competitive benefits gap?",
    goodResponse: "TC turnover during transaction closings is particularly disruptive. Mistakes get made, clients have poor experiences, and producing agents get frustrated. A wellness benefit that prevents one TC departure per year typically pays for a full-year program many times over.",
    badResponse: "TC and admin turnover during closings creates client experience and agent frustration costs. Wellness benefits reduce it.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If you offered a competitive wellness benefit to your staff — telehealth, mental health support, biometric screenings — at a cost competitive with other real estate employers, how would that change your recruiting pitch and staff retention in the next 12 months?",
    goodResponse: "A practical wellness benefit is often the deciding factor for a TC or admin candidate comparing otherwise similar offers. Let me walk you through what we offer and what the cost structure looks like for brokerage staff.",
    badResponse: "A wellness benefit tips competitive hiring conversations in your favor. Let me show you what we offer.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const HEALTH_REAL_ESTATE_S3 = [
  {
    phase: 'situation',
    question: "For your property management operations — if you have them — are you managing the occupational health and safety of maintenance staff and field employees, or is that entirely on the independent contractors you hire?",
    goodResponse: "Property management firms that employ maintenance staff have real occupational health exposure — fall risk, chemical exposure, physical strain from HVAC and plumbing work. Understanding whether that's in-house or contractor work tells me what the health and safety picture looks like.",
    badResponse: "We support property management firms with occupational health programs for maintenance staff.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "For in-house maintenance staff — have you had workers' comp claims from falls, lifting injuries, or tool-related incidents that are generating premium increases or creating operational disruption when a staff member is out?",
    goodResponse: "Maintenance staff workers' comp claims are one of the most common and expensive operational headaches for property management firms. Falls from ladders, tool injuries, back strains — these are high-frequency, high-cost claims that are substantially preventable with training and proper protocols.",
    badResponse: "Maintenance staff workers' comp claims are preventable with occupational health programs. We provide them.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If maintenance staff injuries create a coverage gap — during which tenant maintenance requests pile up and you're scrambling to cover with contractors at premium rates — what's the operational and financial cost of a single workers' comp event?",
    goodResponse: "Maintenance staff injuries are doubly expensive in property management: there's the workers' comp claim and premium impact, plus the operational cost of backfilling with emergency contractors at 2-3x normal rates while the property queue backs up.",
    badResponse: "Maintenance staff injuries create workers' comp and emergency contractor costs simultaneously. Safety programs prevent both.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If your maintenance staff had proper safety training, ergonomic guidance, and an occupational health relationship for incident management — reducing your claims frequency and improving your EMR over time — how would that change your workers' comp costs and your operational resilience?",
    goodResponse: "Safety programs for property management maintenance staff are a workers' comp cost reduction and operational reliability investment. Let me walk you through what we put in place for property management firms and what the typical claims frequency improvement looks like.",
    badResponse: "A safety program for maintenance staff reduces claims and improves operational reliability. Let me walk you through it.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];
