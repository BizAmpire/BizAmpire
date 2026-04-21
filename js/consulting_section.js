// CONSULTING SECTIONS

const CONSULTING_OFFICE_PROFESSIONAL_S1 = [
  {
    phase: 'situation',
    question: "What's the firm's primary revenue model right now — hourly billing, fixed-fee engagements, retainers — and how satisfied is leadership with the predictability of that revenue from month to month?",
    goodResponse: "Revenue model architecture is one of the most impactful decisions a professional firm makes, and most firms fall into their model accidentally rather than designing it. Understanding your current model and how it feels tells me where the strategic conversation might be most valuable.",
    badResponse: "We help professional firms optimize their revenue model, pricing strategy, and growth trajectory.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Do you experience the feast-or-famine cycle common in professional services — months of intense activity followed by pipeline droughts, with cash flow volatility that makes planning difficult?",
    goodResponse: "The feast-or-famine pattern is usually a symptom of a business development model that's entirely reactive — work arrives, you deliver it, then you surface and the pipeline is empty. Does that pattern sound familiar?",
    badResponse: "We help professional firms stabilize their pipeline and revenue through systematic business development.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If your cash flow volatility forces you to make decisions — on hiring, investments, compensation — based on survival rather than strategy, how is that limiting your ability to grow the firm the way you've envisioned?",
    goodResponse: "Revenue volatility is one of the primary reasons professional firms stay small indefinitely. When you can't confidently project 90 days out, every growth decision becomes a risk calculation instead of a strategy execution. The firms that break out almost always have a repeatable, proactive business development system.",
    badResponse: "Cash flow volatility limits strategic investment in firm growth. We break the cycle.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If you had a business development system — a defined process for pipeline management, client nurturing, and proactive outreach — that created consistent lead flow regardless of how busy the delivery side was, how would that change the firm's ability to invest in growth with confidence?",
    goodResponse: "Consistent pipeline is what separates scaling firms from firms that oscillate. Let me walk you through the business development frameworks we've helped firms your size implement and what revenue stabilization looks like in the first year.",
    badResponse: "A systematic business development process breaks the feast-or-famine cycle. Let me show you the framework.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const CONSULTING_OFFICE_PROFESSIONAL_S2 = [
  {
    phase: 'situation',
    question: "How does your firm currently differentiate in your market — what makes a client choose you over the other firms on a shortlist — and is that message consistent across your website, proposals, and how your partners talk about the firm?",
    goodResponse: "Positioning clarity is one of the biggest growth levers for professional firms and one of the most commonly underdeveloped. Most firms win on relationships and reputation, but when they need to compete in an unfamiliar context, the differentiation message often falls flat. How would you describe what makes your firm distinctive?",
    badResponse: "We help professional firms clarify and operationalize their positioning and differentiation strategy.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "When your firm goes through a competitive selection process — an RFP, a multi-firm shortlist — how often do you lose to competitors at the same or lower quality level, and do you have a clear sense of why?",
    goodResponse: "RFP and competitive shortlist losses are often positioning and communication failures rather than quality failures. You might be the best firm for the work, but if your proposal doesn't clearly communicate why in a way that resonates with that specific buyer, you lose to whoever told the better story. What does your win rate on competitive bids look like?",
    badResponse: "Competitive selection losses often reflect positioning gaps, not quality gaps. We fix the positioning.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If you're losing 40-50% of competitive selections you should be winning — and each lost engagement represents $50-150k in revenue — what's the annual revenue cost of your current positioning and proposal approach?",
    goodResponse: "A 10-point improvement in competitive win rate for a firm winning 5-10 proposals per year can represent $200-500k in annual revenue. Positioning and proposal approach are entirely controllable variables — they don't depend on anything external.",
    badResponse: "A 10-point improvement in competitive win rate often represents hundreds of thousands in annual revenue. We create that.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If your firm had sharp, differentiated positioning — a clear articulation of who you serve best, why clients choose you, and what outcome they get that they can't get elsewhere — and that message was consistent across every touchpoint, how would that change your close rate on competitive engagements?",
    goodResponse: "Clear positioning is a revenue multiplier, not a marketing exercise. Let me walk you through how we develop positioning frameworks for professional firms and what the proposal and pitch improvement process looks like.",
    badResponse: "Differentiated positioning improves competitive win rates and revenue. Let me walk you through our process.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const CONSULTING_OFFICE_PROFESSIONAL_S3 = [
  {
    phase: 'situation',
    question: "Is firm growth on the agenda for your leadership team right now — adding headcount, expanding service lines, entering new markets — or are you in a consolidation or efficiency phase?",
    goodResponse: "Understanding growth mode versus efficiency mode is important context. The consulting conversation for a firm in growth mode looks very different from one in efficiency mode. Where is leadership focused right now?",
    badResponse: "We work with professional firms on growth strategy regardless of which phase they're in.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "If growth is on the agenda — do you have a clear, written growth strategy with defined markets, service priorities, and resource requirements, or is the growth goal more of an aspiration without a specific operational plan behind it?",
    goodResponse: "The gap between growth aspiration and growth strategy is where most professional firms live. 'We want to grow 30% this year' without a defined plan for how that happens through what markets and what business development investment is an aspiration, not a strategy. How detailed is your current growth plan?",
    badResponse: "Aspiration without an operational growth strategy is just a number. We build the strategy.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If your firm ends the year having grown 10% instead of 30% — because the strategy wasn't specific enough to drive different behaviors — what's the cumulative cost of that growth gap in terms of firm value, partner income, and competitive position?",
    goodResponse: "Growth shortfall compounding is real. A firm that misses its growth target by 20 points two years in a row is in a very different competitive position than planned — smaller relative to competitors, lower equity value, lower partner income. The absence of a specific plan means strategic drift.",
    badResponse: "Consistent growth shortfall from lack of specific strategy has compounding effects on firm value and position.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If you had a specific, operational growth strategy — defined markets, defined service priorities, defined business development investments, and a quarterly execution plan the leadership team was aligned on — how would that change your confidence in hitting your growth targets?",
    goodResponse: "The difference between a firm that hits growth targets and one that doesn't is usually the specificity of the plan, not the aspiration. Let me walk you through our strategic planning framework for professional firms.",
    badResponse: "A specific, operational growth strategy changes execution from aspiration to action. Let me walk you through our framework.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const CONSULTING_TECH_COMPANY_S1 = [
  {
    phase: 'situation',
    question: "Where are you in the company lifecycle — early growth, scaling, or mature — and what's the biggest strategic challenge your leadership team is wrestling with right now?",
    goodResponse: "The consulting needs of a pre-PMF startup are completely different from a scaling Series B company. Understanding where you are in the journey tells me whether there's a strategic challenge I can actually help with.",
    badResponse: "We provide strategic consulting for tech companies at every stage of the growth lifecycle.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "For a scaling tech company — have you found that the management practices and organizational structures that worked at 20 people are now breaking down at 50 or 100, and the leadership team doesn't agree on how to evolve them?",
    goodResponse: "The 'what got us here won't get us there' moment is a universal inflection point for scaling tech companies. The informal, founder-driven decision-making that worked at 20 people creates chaos at 80. Structuring the organization for the next phase without destroying the culture that made you successful is one of the hardest challenges in tech. Are you in that moment right now?",
    badResponse: "We help scaling tech companies redesign their operating model for the next growth phase.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If organizational misalignment — unclear roles, competing priorities, decision-making not keeping pace — is slowing product velocity or creating execution gaps, what's the cost in delayed launches, missed targets, or talent loss from frustrated high performers?",
    goodResponse: "Organizational friction in scaling tech companies compounds fast. The senior engineer who can't get decisions made, the product lead whose priorities keep changing — they leave, and they tell others. Organizational clarity is a product velocity and talent retention multiplier.",
    badResponse: "Organizational friction in scaling tech slows product velocity and drives high-performer attrition. We fix the structure.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If you had an outside advisor who could map your current organizational friction, facilitate the leadership alignment conversation, and help you design the operating model for the next stage of scale — how would that accelerate your execution and reduce talent risk?",
    goodResponse: "Outside perspective on organizational design is particularly valuable during scaling because the people inside the system often can't see the systemic problems clearly. Let me tell you about similar engagements we've done with scaling tech companies at your stage.",
    badResponse: "Outside organizational perspective accelerates scaling execution. Let me share what we've done for similar companies.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const CONSULTING_TECH_COMPANY_S2 = [
  {
    phase: 'situation',
    question: "How does your leadership team currently make strategic decisions — is there a formal planning cadence, quarterly OKRs, a board-driven strategy process — or is strategy emergent and reactive to what the market is showing you?",
    goodResponse: "Strategic decision-making infrastructure is surprisingly underdeveloped in most tech companies, especially pre-Series B. Understanding your current cadence and rigor tells me whether there's a planning and prioritization problem underneath the execution challenges.",
    badResponse: "We help tech companies build strategic planning infrastructure that improves decision velocity and alignment.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Does your leadership team consistently agree on the company's top 3 priorities — and when you look at where time, resources, and engineering are actually going, does it match what everyone says the priorities are?",
    goodResponse: "Priority misalignment between what leadership says is strategic and where resources actually go is one of the most common and expensive issues in scaling tech. The words say 'enterprise market' but the engineering backlog is full of consumer features. That gap is where strategy leaks out. Does that pattern resonate?",
    badResponse: "Strategic priority misalignment between intent and resource allocation is a scaling tech company killer. We close the gap.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If your resources are spread across initiatives that don't reflect the company's stated strategic priorities — and that diffusion is slowing progress on the 2-3 things that really matter — what's the product roadmap and revenue impact of the misalignment?",
    goodResponse: "Strategic diffusion is one of the primary reasons well-funded tech companies still miss their roadmap milestones. It's not a resources problem — it's an alignment and prioritization problem. The companies that execute well at scale are almost always the ones with ruthless prioritization.",
    badResponse: "Strategic diffusion slows roadmap execution and wastes funding. Prioritization alignment solves it.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If your leadership team went through a structured prioritization process — surfaced the competing agendas, aligned on the top 3 strategic bets, and resource-allocated to match — how would that change your execution speed and your confidence in hitting the milestones your next funding round depends on?",
    goodResponse: "Strategic alignment workshops for tech leadership teams are one of our most high-impact engagements. Let me walk you through the process and show you what typical outcomes look like for companies at your stage.",
    badResponse: "Structured prioritization alignment accelerates execution. Let me show you how we facilitate it.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const CONSULTING_TECH_COMPANY_S3 = [
  {
    phase: 'situation',
    question: "Has the company gone through or considered a go-to-market strategy pivot — changing target customer segment, pricing model, sales motion — and how confident are you that the current go-to-market is optimally aligned with what the market is showing you?",
    goodResponse: "GTM alignment questions are perennial for tech companies, and the wrong GTM strategy can burn through a runway faster than almost any other factor. Understanding where you are in the GTM confidence curve tells me whether there's a strategic advisory conversation worth having.",
    badResponse: "We help tech companies evaluate and optimize their go-to-market strategy as the market evolves.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Are your sales cycle length, win rates, and average contract values where you expected them to be — or are you seeing signals that something about the current GTM motion isn't quite right, even if it's hard to pinpoint?",
    goodResponse: "GTM signals are sometimes subtle before they become obvious. Longer-than-expected sales cycles, win rates that plateau, ACV below expectation — these are often signals of ICP misalignment, positioning gaps, or sales process issues. How do your current metrics compare to where you expected to be?",
    badResponse: "GTM metric underperformance is usually a signal of a systematic issue. We diagnose and fix it.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If your current GTM motion is systematically inefficient — wrong ICP, misaligned messaging, or a sales process that creates friction — and you burn through 6-12 months of runway before recognizing the problem, what does that cost in terms of runway, headcount, and your fundraising leverage?",
    goodResponse: "GTM misalignment is a runway killer. Six months of scaling a sales team into the wrong market or with the wrong message burns $500k-$1M for a typical Series A company and produces none of the revenue metrics investors need to see. The earlier the diagnostic, the less runway is destroyed.",
    badResponse: "GTM misalignment burns runway and produces no usable metrics. Early diagnosis changes the outcome dramatically.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If you had an outside GTM diagnostic — someone who could objectively evaluate your ICP, positioning, sales motion, and competitive context, and identify the specific lever most likely to improve your metrics in 90 days — how would that change your confidence in the path forward?",
    goodResponse: "A GTM diagnostic gives you clarity on which variables to change before you scale spend. Let me walk you through our GTM assessment process and show you what the typical output looks like for a company at your stage.",
    badResponse: "A GTM diagnostic tells you exactly what to fix before you scale spend. Let me show you how we do it.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const CONSULTING_HEALTHCARE_S1 = [
  {
    phase: 'situation',
    question: "Is your practice currently growing, stable, or facing volume pressure — and what does the leadership team see as the primary driver of the practice's performance in the next 2-3 years?",
    goodResponse: "Healthcare practices are at very different strategic moments depending on their market, specialty, and ownership model. Understanding where you are in the growth curve and what leadership is focused on tells me whether there's a consulting conversation worth having.",
    badResponse: "We provide strategic consulting for healthcare practices on growth, operations, and market positioning.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Are there operational inefficiencies in the practice — patient flow, scheduling optimization, billing and collections — that you know exist and are costing you revenue or adding cost, but that haven't been formally addressed?",
    goodResponse: "Operational inefficiency in healthcare practices is almost universal and almost always underdiagnosed. Scheduling gaps, billing process leaks, patient flow friction — each has a measurable revenue impact. What's the operational issue that bothers you most right now?",
    badResponse: "We identify and fix operational inefficiencies in healthcare practices that have direct revenue impact.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If your scheduling utilization is running at 75% when it could be 85-90% with better systems — and each additional percentage point of utilization is worth real revenue given your average visit value — what's the revenue gap from your current operational performance versus the potential?",
    goodResponse: "Healthcare practice operational gaps have very calculable revenue impacts. A 10% improvement in scheduling utilization for a primary care practice seeing 20 patients per day at $150 average is $75,000 in additional annual revenue — just from better scheduling. How does your utilization trend compare to your theoretical capacity?",
    badResponse: "Scheduling and operational efficiency gaps have direct revenue values that are calculable. We close those gaps.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If you had an operations consultant who could do a structured assessment of your practice's scheduling, billing, and patient flow — identify the top 3 revenue leaks — and implement the fixes with your team, how would that change your revenue and confidence in the practice's performance?",
    goodResponse: "Practice operations assessments typically identify $50-150k in annualized revenue improvement for practices our clients' size. The engagement pays for itself in the first quarter. Let me walk you through what the assessment process looks like.",
    badResponse: "A practice operations assessment identifies the revenue leaks. Let me walk you through the engagement.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const CONSULTING_HEALTHCARE_S2 = [
  {
    phase: 'situation',
    question: "Is your practice operating under a value-based care model — accountable care organization, shared savings, capitation — or primarily fee-for-service, and if you're moving toward value-based contracts, how prepared is the practice operationally?",
    goodResponse: "The value-based care transition is one of the most operationally complex strategic shifts a healthcare practice can face. Practices that thrive in value-based models have very different operational infrastructure than those built for fee-for-service. Where are you in that transition?",
    badResponse: "We help healthcare practices prepare operationally for value-based care contract transitions.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "If you're entering value-based contracts, do you have the population health data infrastructure, care coordination processes, and quality metrics tracking those contracts require — or are you committing to performance targets without full confidence in your operational readiness?",
    goodResponse: "Entering value-based contracts without the operational infrastructure to manage population health and quality metrics is one of the most common and expensive mistakes practices make. The penalties for underperforming on quality metrics can be significant. How far along is your VBC operational readiness?",
    badResponse: "Entering VBC contracts without operational readiness creates performance risk and potential financial penalties.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If your practice enters a shared savings contract and underperforms on quality metrics because the care coordination and data infrastructure isn't in place — what does that cost you in shared savings clawbacks, penalties, or damaged payer relationships?",
    goodResponse: "VBC underperformance penalties can be significant — and they're typically announced 12-18 months after the contract period, when it's too late to remediate. The practices that do well in value-based models invest in operational preparation 12 months before the contract starts, not after.",
    badResponse: "VBC underperformance penalties arrive long after the performance period. Operational preparation beforehand is the only solution.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If you had a consulting partner who could assess your VBC operational readiness, identify the gaps, and implement the care coordination and data reporting infrastructure before your next contract period, how would that change your confidence in your value-based performance?",
    goodResponse: "VBC operational readiness consulting is one of the highest-ROI engagements for practices moving into risk-based contracts. Let me walk you through our healthcare consulting practice and what a VBC readiness engagement typically produces.",
    badResponse: "VBC readiness consulting protects your shared savings and payer relationships. Let me walk you through our approach.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const CONSULTING_HEALTHCARE_S3 = [
  {
    phase: 'situation',
    question: "Is the practice owner or physician group thinking about an exit strategy in the next 5-10 years — a DSO acquisition, a hospital system affiliation, a private equity roll-up — and has any strategic planning work been done to maximize the practice's value before that event?",
    goodResponse: "Practice exit strategy is a topic that comes up much later than it should for most physician practice owners. The decisions made 3-5 years before a sale have a much larger impact on practice valuation than the ones made in the last 12 months. Where is the thinking?",
    badResponse: "We help healthcare practice owners prepare strategically for exit events to maximize valuation.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "If an exit is in the thinking, do you have a clear picture of what drives your practice's valuation — EBITDA, patient volume, payer mix, quality metrics, key person dependency — and where you stand relative to what acquirers in your specialty are paying for?",
    goodResponse: "Most practice owners approaching an exit don't have a detailed understanding of what acquirers actually evaluate and weight. DSOs, PE groups, and hospital systems each look at practices differently. Without that understanding, you may be optimizing the wrong things. How much work has been done to map your current valuation drivers?",
    badResponse: "Understanding what drives your specific valuation before exit is essential. Most owners don't know what acquirers actually look for.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If you're 3-5 years from an exit and you don't know which valuation drivers to improve — or you're investing time in things that don't actually affect what an acquirer will pay — how much practice value are you potentially leaving on the table?",
    goodResponse: "The difference between a practice that's prepared for an exit and one that isn't can be a full turn or two of EBITDA in valuation — which on a $1M EBITDA practice is $1-2M in transaction value. Strategic preparation 3-5 years out is the highest-leverage investment most practice owners can make.",
    badResponse: "Unguided pre-exit preparation costs 1-2 EBITDA turns in transaction value. We capture that for you.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If you had a consulting engagement focused on exit preparation — mapping your current valuation drivers, identifying the high-ROI improvements, and building a 3-year plan to maximize your practice's sale value — how would that change your confidence in the exit outcome?",
    goodResponse: "Exit preparation consulting for healthcare practices is one of the highest-ROI strategic investments a physician practice owner can make. Let me walk you through what our healthcare practice exit readiness engagement looks like.",
    badResponse: "Exit preparation consulting is the highest-ROI investment for practice owners approaching a transaction. Let me walk you through our approach.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const CONSULTING_RETAIL_FOOD_S1 = [
  {
    phase: 'situation',
    question: "Is your business performing where you want it to be financially — are you making the profit margins you need to sustain and grow the business — or are revenues acceptable but margins tighter than you'd like?",
    goodResponse: "Retail and food businesses often have revenue that looks healthy but margins that are under constant pressure from food costs, labor, and occupancy. Understanding which part of the P&L is the primary problem tells me where a consulting conversation would add the most value.",
    badResponse: "We help retail and food businesses diagnose and improve their financial performance and margins.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Do you have a clear picture of your cost structure — labor percentage, food cost percentage, contribution margin by menu item or product category — or are you managing the business primarily on bank balance and monthly P&L without deep cost visibility?",
    goodResponse: "Most independent retail and food operators manage by P&L and cash flow without the product-level cost visibility that would let them make more precise pricing and menu decisions. The operator who knows their contribution margin by item makes very different decisions. What does your cost visibility look like?",
    badResponse: "Product-level cost visibility is the foundation of profitable retail and food management. Most independents don't have it.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If you're running a menu with items that are losing money at current pricing — because food costs are higher than the price can support — and you don't have visibility into which items they are, how much margin are those items draining from your overall profitability?",
    goodResponse: "Menu profitability analysis consistently surprises operators. Removing or repricing two or three loss-leader items can improve overall margin by 2-4 points — which on a $800k revenue restaurant is $16-32k in additional annual profit. Have you ever done a full menu costing analysis?",
    badResponse: "Hidden margin drains from uncosted menu items are an invisible profitability leak. We make them visible.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If you had a detailed cost structure analysis — item-level contribution margins, labor efficiency by daypart, the top 5 changes that would improve your margins — how would having that clarity change the business decisions you make on pricing, staffing, and menu management?",
    goodResponse: "Financial clarity is the foundation of better operating decisions in retail and food. Let me walk you through what our retail and food profitability assessment covers and what typical operators find at this level of detail.",
    badResponse: "Financial clarity drives better operating decisions. Let me walk you through our profitability assessment process.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const CONSULTING_RETAIL_FOOD_S2 = [
  {
    phase: 'situation',
    question: "Have you thought about expanding — a second location, a catering or wholesale line, a ghost kitchen — or is the focus right now entirely on optimizing the existing operation?",
    goodResponse: "Expansion decisions in retail and food are some of the highest-stakes strategic choices an independent operator makes. Understanding where your thinking is tells me whether a strategic conversation makes sense.",
    badResponse: "We help retail and food operators evaluate and plan expansion decisions with strategic rigor.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "If you're considering a second location, have you done a rigorous financial model that accounts for startup costs, ramp-up period, working capital needs, and the management bandwidth required to run two locations without degrading the first one?",
    goodResponse: "The second location failure rate for independent food and retail operators is very high — and it almost always comes from underestimating one of those four factors. The financial model looks fine in year 2 but year 1 burns through working capital faster than expected. How detailed is your current expansion model?",
    badResponse: "Expansion models that underestimate startup costs or management bandwidth create second-location failures. We build the rigorous model.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If you open a second location that underperforms its financial projections in year 1 — and you're subsidizing the new location from the cash flow of the first one — what's the risk to both locations and to your personal financial stability?",
    goodResponse: "The most common second-location failure mode is the original location getting starved of the management attention and cash that made it successful in the first place. Two mediocre locations instead of one excellent one is a significantly worse business outcome.",
    badResponse: "A failed second location risks the entire business, not just the new site. The model has to be right before you commit.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If you had a structured expansion analysis — a realistic financial model, an honest assessment of management bandwidth, a site selection framework, and a phased implementation plan that protected the original location — how would that change your confidence in the expansion decision?",
    goodResponse: "Expansion planning with proper rigor is what separates operators who successfully scale from those who don't. Let me walk you through our retail and food expansion planning process and show you what a well-built expansion model looks like.",
    badResponse: "Rigorous expansion planning protects the original location and maximizes new site success probability. Let me walk you through our process.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const CONSULTING_RETAIL_FOOD_S3 = [
  {
    phase: 'situation',
    question: "How is your business performing relative to your competition in the local market — are you gaining share, holding steady, or feeling competitive pressure from new entrants or changing customer preferences?",
    goodResponse: "Competitive dynamics in retail and food shift constantly — new concepts open, customer preferences evolve, delivery models disrupt dine-in patterns. Understanding your competitive position tells me whether the challenge is operational or strategic.",
    badResponse: "We help retail and food businesses assess and respond to competitive market dynamics.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Are you finding that customer traffic patterns have shifted — less dine-in, more delivery, more frequency at competitors that do something you don't — and you haven't fully figured out how to adapt the business model to capture that behavior?",
    goodResponse: "Consumer behavior in food and retail has changed more in the last 5 years than in the previous 20. Operators who haven't adapted their model are often seeing slow erosion in traffic that feels hard to diagnose. Does that pattern resonate with what you're seeing?",
    badResponse: "Consumer behavior shifts require business model adaptation. We help retail and food operators make that pivot strategically.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If customer traffic continues to shift toward competitors who've adapted better to current consumer preferences — and you haven't made the operational or positioning changes needed to respond — what does that traffic erosion cost you over the next 12-24 months in revenue and long-term viability?",
    goodResponse: "Slow traffic erosion is often the hardest competitive challenge to respond to because it feels gradual until it's a crisis. Operators who address it when the trend is first visible have many more strategic options than those who wait. What's your traffic trend over the last 12 months?",
    badResponse: "Gradual traffic erosion becomes a crisis if not addressed early. We identify the response while options remain.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If you had a strategic advisor who could diagnose the traffic trend, identify the specific consumer behavior shift you're facing, and recommend 2-3 specific changes that would reverse the trend, how would that change your confidence in the next 12 months?",
    goodResponse: "Competitive strategy work for retail and food businesses is often practical and fast-to-value. Let me walk you through how we approach competitive market assessments for independent operators and what the typical recommendation set looks like.",
    badResponse: "A competitive strategy assessment identifies the right 2-3 changes to reverse traffic erosion. Let me walk you through our process.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const CONSULTING_TRADES_CONTRACTOR_S1 = [
  {
    phase: 'situation',
    question: "How are you currently winning most of your work — relationships, referrals, GC subcontractor lists, competitive bids — and does that mix feel sustainable and predictable, or do you find yourself scrambling to backfill the pipeline when a big job wraps up?",
    goodResponse: "Work acquisition is the most common strategic anxiety for trades contractors. The relationship-and-referral model works well until it doesn't — one anchor relationship dries up or a key referral source retires, and suddenly the pipeline is thin. Understanding your current acquisition mix tells me where the strategic vulnerability is.",
    badResponse: "We help trades contractors build more predictable, diversified work acquisition pipelines.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Do you have customers or project types that are disproportionately important to your revenue — say one or two relationships that account for 40-50% of your work — and what would happen to the business if one of those went away?",
    goodResponse: "Customer concentration risk is one of the most common and dangerous strategic vulnerabilities for trades contractors. A single relationship that accounts for half the revenue is not a business model — it's a single point of failure. If that customer has a slow year or changes contractors, what's the impact?",
    badResponse: "Customer concentration is a strategic vulnerability. We help contractors diversify their customer base proactively.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If your primary customer relationship represented 40% of your revenue and went away — through no fault of your own, just a market shift or change in their business — how long could you sustain current operations on the remaining work?",
    goodResponse: "Customer concentration events rarely give contractors advance warning. The call comes and suddenly 40% of revenue is gone, but you have crews, overhead, and commitments built for full capacity. The contractors who navigate those events best diversified before they needed to.",
    badResponse: "Concentrated revenue loss without diversification creates business contraction or failure. We help diversify before it's urgent.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If you had a business development strategy that systematically added 2-3 new customer relationships per year — so no single customer ever represented more than 25% of revenue — how would that change the resilience and stability of your business?",
    goodResponse: "Customer diversification is the risk management strategy for trades contractors. Let me walk you through how we've helped contractors build systematic business development programs that reduce concentration and add predictability to the pipeline.",
    badResponse: "A diversification strategy is the risk management investment your business needs. Let me walk you through how we build it.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const CONSULTING_TRADES_CONTRACTOR_S2 = [
  {
    phase: 'situation',
    question: "How are you currently pricing your work — cost-plus markup, market rate comparison, value-based — and when you win a bid, do you know with confidence that you're making the margin you planned, or do projects often run over and profit erodes during execution?",
    goodResponse: "Job cost management and estimating accuracy are two of the highest-impact operational variables for trades contractors. Winning bids at margins that erode during execution is a pattern that looks like a revenue success but is often a profitability failure. Understanding your current pricing and job cost picture tells me where the opportunity is.",
    badResponse: "We help trades contractors improve estimating accuracy and job cost management to protect their margins.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Do you do post-job margin analysis — comparing estimated versus actual margin on each job — and if so, do you find systematic gaps between what you bid and what you actually make?",
    goodResponse: "Post-job analysis is one of the most valuable and least practiced management disciplines in contracting. Contractors who do it consistently find patterns — certain job types where estimating is chronically off, certain project managers who run over. What does your current post-job analysis process look like?",
    badResponse: "Post-job margin analysis reveals systematic estimating and execution gaps. Most contractors don't do it. We implement it.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If your actual margins are consistently running 3-5 points below estimated — and that gap is invisible because you're not doing job-level analysis — how much profit are you leaving on the table across your annual revenue that systematic job costing would recover?",
    goodResponse: "A 3-point margin gap on $2M in annual revenue is $60k in annual profit that's invisible without job-level analysis. Most contractors who start doing this work are surprised by how consistent and correctable the patterns are.",
    badResponse: "A 3-point margin gap on $2M revenue is $60k annually in recoverable profit. Job cost analysis makes it visible.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If you had a simple, systematic job costing process — estimated versus actual tracked for every job, patterns identified, and estimating adjusted accordingly — how much would a 2-3 point margin improvement across your book of work be worth to your bottom line annually?",
    goodResponse: "Job costing discipline is one of the highest-ROI management investments a trades contractor can make. Let me walk you through how we implement job cost tracking for contractors and what the typical margin improvement looks like in the first year.",
    badResponse: "Job costing discipline turns invisible margin leakage into recoverable profit. Let me walk you through our implementation process.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const CONSULTING_TRADES_CONTRACTOR_S3 = [
  {
    phase: 'situation',
    question: "How does your business handle growth decisions — taking on more volume, adding crews, hiring leadership — do you have a structured approach to growth planning, or is it more reactive to opportunity when it shows up?",
    goodResponse: "Growth management is one of the areas where trades contractors most often get into trouble. Reactive growth — taking every job, adding crews without the management infrastructure to support them — creates quality problems, cash flow strain, and burnout. Understanding your growth approach tells me whether there's a strategic conversation worth having.",
    badResponse: "We help trades contractors build structured approaches to growth that avoid the classic reactive growth traps.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Have you ever gone through a period of rapid growth — more work than you could comfortably handle — and found that it actually hurt the business: quality problems, overextended cash flow, or key employees leaving because of the stress?",
    goodResponse: "Unmanaged rapid growth is one of the most common ways successful trades contractors damage what they've built. Too much work without the management infrastructure, working capital, and leadership bench to support it creates exactly those problems. Has that happened to you, or are you trying to avoid it?",
    badResponse: "Unmanaged growth damages quality, cash flow, and retention. We build the infrastructure for sustainable growth.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If you grow past your management capacity and quality starts slipping — callbacks increase, reputation takes a hit, key foremen burn out and leave — what's the cost of rebuilding quality and reputation after a growth-driven quality failure?",
    goodResponse: "Reputation recovery in the trades is long and expensive. One bad year of callbacks takes 2-3 years to recover from in referral volume. And losing a key foreman during a growth push can take 12-18 months to fill and train. Growth without the right infrastructure is sometimes worse than no growth.",
    badResponse: "Growth-driven quality failures create reputation damage that takes years to recover from. We prevent it.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If you had a growth plan that specified the revenue level at which you'd add your next crew, the management and working capital requirements for that addition, and a quality management system that scaled with the volume — how would that change your confidence in growing sustainably?",
    goodResponse: "Sustainable growth planning for trades contractors is one of the most impactful strategic investments a growing business can make. Let me walk you through our growth planning framework for contractors and what it looks like in practice.",
    badResponse: "A structured growth plan with clear triggers and infrastructure requirements creates sustainable scaling. Let me walk you through the framework.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const CONSULTING_AUTO_SERVICES_S1 = [
  {
    phase: 'situation',
    question: "How would you describe the business performance of the shop right now — revenue growing, flat, or under pressure — and what do you see as the primary lever for improving profitability over the next 2 years?",
    goodResponse: "Auto service businesses are at very different strategic moments depending on whether the constraint is traffic, technicians, bays, or management capacity. Understanding which constraint is primary tells me what kind of strategic conversation would actually be useful.",
    badResponse: "We help auto service businesses identify and act on their primary profitability levers.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Do you track your key operational metrics — average repair order value, effective labor rate, technician productivity rate, customer return rate — and do you have benchmarks for where those metrics should be given your market and shop size?",
    goodResponse: "Most independent auto service shops operate without clear KPI benchmarks. Owners know their revenue and rough profitability, but often don't know whether their average RO, effective labor rate, or technician utilization are where they should be. That visibility gap is often where $50-100k in annual profit improvement is hiding. What does your KPI visibility look like?",
    badResponse: "KPI visibility against industry benchmarks is where most shops find their biggest improvement opportunities. We provide that.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If your effective labor rate is $10-15 below market and your average RO is $50 below what a similar shop in your market produces — and you're processing 600 repair orders per month — what's the revenue and profit gap from those two metrics alone?",
    goodResponse: "At 600 ROs per month, a $50 RO gap is $30,000 per month in additional potential revenue, and a $10 effective labor rate gap is $15,000+ per month in additional potential gross profit. Those two numbers together represent $500-600k in annual performance gap from just two operational metrics.",
    badResponse: "KPI gaps aggregate to very large revenue and profit opportunities. We calculate and close them.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If I benchmarked your shop's key metrics against your market's top performers — identified the 2-3 KPIs with the highest improvement potential — and built a 90-day action plan to move those numbers, how would that change your profitability this year?",
    goodResponse: "Auto service KPI improvement is one of the most straightforward and highest-ROI consulting engagements. The improvements are operational, not capital-intensive, and the results show up in profitability quickly. Let me walk you through what our shop performance assessment looks like.",
    badResponse: "A KPI assessment and 90-day action plan generates measurable profitability improvement fast. Let me show you what we do.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const CONSULTING_AUTO_SERVICES_S2 = [
  {
    phase: 'situation',
    question: "Are you thinking about adding a location or acquiring another shop — and if so, have you done the due diligence work to understand what that kind of expansion would actually require in capital, management bandwidth, and operational integration?",
    goodResponse: "Multi-shop expansion in auto service is a very different business from running a single shop, and the failure rate is high among owners who didn't do the strategic homework upfront. Understanding where you are in the expansion thinking tells me if there's a planning conversation worth having.",
    badResponse: "We help auto service shop owners plan and execute multi-location expansion with strategic rigor.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "For a second shop — do you have a clear sense of whether you'd buy an existing shop or open a new location, how you'd staff and manage both locations, and what the working capital requirements would look like?",
    goodResponse: "Those three questions — build versus buy, management model, and working capital — are the three most underplanned aspects of multi-shop expansion. Buy decisions without proper due diligence, management models that don't account for split attention, and working capital that runs thin in the ramp-up — these are the primary failure modes.",
    badResponse: "Multi-shop expansion fails most often from under-planning on those three specific dimensions. We provide the planning rigor.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If you expand into a second location and the owner-operator model doesn't scale — you're spread too thin, quality slips at the original shop, and the new shop underperforms — what's the risk to both locations and your personal financial exposure?",
    goodResponse: "The scenario of the first shop degrading because the owner is too focused on the new location is the most common failure mode in auto service multi-shop expansion. It's not a revenue problem — it's a management leverage problem that needs to be designed before the expansion, not improvised during it.",
    badResponse: "Management leverage failure in multi-shop expansion destroys both locations. Planning upfront prevents it.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If you had a structured expansion plan — a build versus buy analysis, a management model that works at two locations, a working capital model, and an integration plan for the first 90 days — how would that change your confidence in the expansion decision and the probability of success?",
    goodResponse: "Multi-shop expansion planning done right is the difference between a transformative growth event and a business-threatening mistake. Let me walk you through our auto service expansion planning framework and what a thorough pre-expansion analysis looks like.",
    badResponse: "A structured expansion plan dramatically improves success probability. Let me walk you through our framework.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const CONSULTING_AUTO_SERVICES_S3 = [
  {
    phase: 'situation',
    question: "Are you thinking about an exit from the business at some point — selling to a consolidator, a franchisee, a key employee — and if so, have you started thinking about what would maximize the value of the shop in a sale scenario?",
    goodResponse: "Auto service shop exits are increasingly driven by regional and national consolidators who buy shops at multiples significantly better than what was available 10 years ago. Understanding where you are in the exit thinking tells me whether pre-exit value maximization is a conversation worth having.",
    badResponse: "We help auto service shop owners prepare for and maximize value in business exit events.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Do you have a clear picture of what a consolidator or buyer would pay for your shop — the multiple, the metrics they'd evaluate, the things that would reduce the valuation — and are you actively managing those metrics with an exit in mind?",
    goodResponse: "Most auto service shop owners approaching a potential sale don't know specifically what drives their valuation. Revenue trends, owner dependency, customer concentration, technician retention, lease terms — each of these factors affects the multiple. Without knowing the valuation model, it's hard to optimize for it.",
    badResponse: "Without knowing the buyer's valuation framework, you can't optimize for the exit. We build that clarity.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If your shop has high owner dependency — the business runs because of your personal relationships and knowledge, not documented systems — and a buyer reduces their offer by 20-30% because of that risk, what does that valuation discount represent in real dollars?",
    goodResponse: "Owner dependency discounts are one of the most common value destroyers in auto service shop transactions. A $1.5M shop with high owner dependency might transact at $1M-$1.1M because the buyer prices in the risk that revenue will decline after you leave. Systematizing the business recovers that discount.",
    badResponse: "Owner dependency discounts are real and significant. Systematizing the business before exit recovers them.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If you had 2-3 years to work on the specific factors that drive your shop's valuation — reducing owner dependency, improving key metrics, building documented systems — how much could you improve the eventual sale price versus selling the business as it is today?",
    goodResponse: "A well-prepared auto service shop exit can generate 30-50% more in transaction value than an unprepared one. Let me walk you through our exit preparation framework for shop owners and show you what the value improvement work typically looks like.",
    badResponse: "Exit preparation work typically generates 30-50% more transaction value. Let me walk you through the framework.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const CONSULTING_FINANCIAL_SERVICES_S1 = [
  {
    phase: 'situation',
    question: "How is the firm currently positioned in your market — what client segment, what AUM range, what service model — and is that positioning the result of deliberate strategy or where the firm evolved to organically?",
    goodResponse: "Positioning clarity is one of the highest-impact strategic variables for financial advisory firms, and most firms land where they are by accumulation rather than design. Understanding whether your current positioning is intentional tells me whether there's a strategic conversation about optimizing it.",
    badResponse: "We help financial advisory firms evaluate and sharpen their market positioning and client strategy.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Do you have a client segmentation strategy — a clear view of which client types are most profitable, which are most aligned with your service model, and which are net revenue negative at your current fee structure?",
    goodResponse: "Client profitability analysis is one of the most commonly avoided conversations in financial advisory practices. Advisors who've built their books over time often have clients who take disproportionate service resources relative to the revenue they generate. Is this something you've analyzed?",
    badResponse: "Client profitability analysis reveals which clients are driving value and which are consuming it. Most advisors don't have this clarity.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If 20-30% of your client base is generating disproportionate service demand while contributing less than 5% of revenue — and those service hours could be redirected to high-value relationships — what's the revenue and profitability impact of that client mix problem?",
    goodResponse: "The 80/20 principle is particularly pronounced in financial advisory. Firms that rationalize their client base consistently see revenue per advisor increase by 30-40% without adding a single new client. It's one of the most valuable and most avoided strategic conversations in the industry.",
    badResponse: "Client mix problems are profitability drains that block advisor capacity for high-value growth. We identify and resolve them.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If you had a client segmentation strategy — a clear picture of your most profitable client archetypes, a plan for transitioning or repricing clients below the threshold, and a growth plan focused on your ideal client — how would that change your revenue per advisor and the quality of the book you're building?",
    goodResponse: "Client segmentation strategy is one of the most impactful consulting engagements for financial advisory firms. Let me walk you through how we approach client profitability analysis and what the typical outcome looks like.",
    badResponse: "Client segmentation and rationalization improves revenue per advisor and practice quality. Let me walk you through our process.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const CONSULTING_FINANCIAL_SERVICES_S2 = [
  {
    phase: 'situation',
    question: "What does your advisor recruitment and development pipeline look like — are you adding advisors through organic development, lateral hires, or both — and is your current bench strong enough to support your growth targets over the next 3-5 years?",
    goodResponse: "Advisor pipeline is the most critical capacity constraint for growing financial advisory firms. Revenue growth is fundamentally capped by the number of productive advisors, and developing or acquiring great advisors is a long-lead-time activity. Understanding your bench strength tells me whether growth planning is constrained by a talent pipeline problem.",
    badResponse: "We help financial advisory firms build sustainable advisor development and recruitment pipelines.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "For advisors you've developed internally — do you have a structured development program and career path, or is the development path informal and dependent on the individual advisor's initiative and relationship with a senior mentor?",
    goodResponse: "Unstructured advisor development is one of the most consistent reasons financial firms fail to convert promising junior advisors into productive partners. Without a defined path — client experience milestones, financial planning competency framework, business development training — junior advisors either plateau, leave for better-structured competitors, or take too long to become productive.",
    badResponse: "Unstructured advisor development creates attrition and slow ramp. We build the structured path.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If your junior advisor development pipeline is losing 2-3 promising associates per year to competitors with better-structured development programs — each representing a 5-7 year investment in development — what's the talent pipeline cost of those departures?",
    goodResponse: "Junior advisor attrition in the development years is one of the most expensive talent investments that goes unrealized. Five years of development cost walks out the door with them. And they often go to a competitor who recruited them with a clearer career path than you offered.",
    badResponse: "Junior advisor development attrition destroys years of investment. A structured program is the fix.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If your firm had a structured advisor development program — defined milestones, clear career path, systematic business development training, and a mentorship structure that reduced time-to-productivity — how would that change your advisor retention and capacity to grow AUM over the next 5 years?",
    goodResponse: "Advisor development programs are the growth capacity investment that compounds over time. Let me walk you through how we build advisor development programs for financial advisory firms and what the typical retention and productivity improvement looks like.",
    badResponse: "A structured advisor development program is your growth capacity investment. Let me show you how we build it.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const CONSULTING_FINANCIAL_SERVICES_S3 = [
  {
    phase: 'situation',
    question: "Are the firm's principals starting to think about succession — either bringing in a successor, selling to an external buyer, or structuring a partner buyout — and if so, how far along is the planning for that transition?",
    goodResponse: "Succession planning is the most critical and most delayed strategic conversation in financial advisory. Firms that plan for succession 5-10 years ahead consistently achieve better outcomes for founders, clients, and successors than those who address it in the last 2 years. Where is leadership in that thinking?",
    badResponse: "We help financial advisory firms plan and execute ownership succession with strategic and financial rigor.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "For any principals who are in the transition-thinking stage — do you have a clear view of what the firm is worth, who the realistic internal or external successors are, and whether the next generation advisors have both the capital and the capability to buy the founding principals out at full value?",
    goodResponse: "Those three questions are where most succession plans break down. Founders often overvalue the firm. Internal successors often lack the capital for a full buyout. And external buyers have very specific criteria that may or may not align with what the founding principal wants. How much clarity exists on each dimension?",
    badResponse: "Succession plans fail most often at valuation, successor capital, and capability misalignment. We address all three.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If succession planning isn't addressed until a principal is ready to exit — and at that point there's no prepared successor, no documented valuation, and no structured transaction framework — what's the risk that clients scatter, AUM walks, and the business sells at a deep discount?",
    goodResponse: "Forced or rushed succession events in financial advisory are some of the most value-destructive outcomes in the industry. Clients follow advisors, not brands — and if there's no planned transition of relationships to a successor advisor who clients trust, AUM walks during the sale.",
    badResponse: "Unplanned succession destroys AUM and valuation. Strategic planning 5+ years ahead is the only solution.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If you had a succession strategy in place 5-7 years before you need it — a defined timeline, a prepared successor or buyer, a client transition plan, and a structured buyout mechanism — how would that change your confidence in the outcome and your ability to exit on your own terms?",
    goodResponse: "Succession planning done right is one of the highest-value strategic investments a founding advisor makes. Let me walk you through our financial advisory succession planning process and what a well-structured transition looks like in practice.",
    badResponse: "Succession planning done early and well creates the exit you want on your terms. Let me show you how we approach it.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const CONSULTING_REAL_ESTATE_S1 = [
  {
    phase: 'situation',
    question: "How is the brokerage performing relative to where you want it to be — agent count growing, GCI per agent improving, market share increasing — and what does the leadership team see as the primary strategic lever for the next growth phase?",
    goodResponse: "Real estate brokerage performance has a lot of variables — agent productivity, agent count, market conditions, technology infrastructure. Understanding which lever leadership is focused on tells me whether there's a strategic advisory conversation worth having.",
    badResponse: "We help real estate brokerages identify and act on their primary strategic growth levers.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "Are you satisfied with your agent productivity — GCI per agent — or do you have a long tail of agents who are licensed with your brokerage but producing at levels that don't justify the administrative overhead and brand association cost of having them on the roster?",
    goodResponse: "Agent roster productivity is one of the most uncomfortable but impactful strategic conversations for brokerage principals. A brokerage with 50 agents and 20 producing less than 5 transactions per year is not a 50-agent brokerage — it's a 30-agent brokerage with overhead. Is your agent productivity distribution something you've analyzed?",
    badResponse: "Agent productivity distribution is where most brokerages have significant hidden improvement opportunity. We analyze it.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If 30-40% of your agent roster is producing very little but consuming administrative bandwidth — and you redirected that capacity to recruiting and developing high-producers — what would the GCI per agent and total GCI impact look like?",
    goodResponse: "Redirecting the overhead of 15 low-producing agents toward recruiting 3-4 high-producing ones can improve total GCI by 20-30% with no increase in headcount. That's a strategic portfolio management decision, not just a retention problem.",
    badResponse: "Agent roster rationalization improves total GCI and leadership capacity. We build the strategic framework for it.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If you had a clear agent productivity framework — tiers defined, expectations set, development programs for mid-tier agents, and a high-producer recruiting strategy — how would that change your brokerage's GCI trajectory and competitive position in your market?",
    goodResponse: "Agent productivity management strategy is one of the highest-impact consulting engagements for brokerage growth. Let me walk you through how we approach agent portfolio analysis and what the typical GCI improvement looks like over 12-18 months.",
    badResponse: "A structured agent productivity framework transforms brokerage performance. Let me walk you through our approach.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const CONSULTING_REAL_ESTATE_S2 = [
  {
    phase: 'situation',
    question: "Does your brokerage have a defined value proposition for why a productive agent should be with you rather than a competing brokerage — beyond the split — and is that value proposition articulated clearly in your recruiting conversations?",
    goodResponse: "Agent recruiting has become primarily a value proposition competition rather than a split competition. High-producing agents have more choices than ever — traditional brokerages, virtual brokerages, teams, independent licenses — and they're evaluating what they get beyond the split. How would you describe your differentiated agent value proposition?",
    badResponse: "We help brokerages develop and articulate differentiated agent value propositions for competitive recruiting.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "When you're recruiting a high-producing agent and they're comparing your offer to a virtual brokerage at a higher split — what's the compelling reason you give them to choose you, and does it consistently land?",
    goodResponse: "The split conversation with a high-producer is often a race to the bottom unless you have a strong answer to the 'what do I get for the split difference' question. Brand support, training, referral network, team environment, administrative infrastructure — each has value, but only if articulated compellingly. What's your best answer to that question today?",
    badResponse: "Without a compelling, differentiated answer to the split conversation, you lose to virtual brokerages on price. We build that answer.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If you're losing 2-3 high-producing agent recruits per year to competitors with better-articulated value propositions — and each of those agents represents $50-100k in annual GCI impact to the brokerage — what's the annual cost of your current recruiting value proposition gap?",
    goodResponse: "$100-300k in annual GCI impact from recruiting losses is a significant strategic cost. And the compounding effect — those high producers are now building GCI for your competitor — makes the competitive gap widen over time.",
    badResponse: "Recruiting losses from weak value proposition articulation aggregate to significant annual GCI loss. We fix the message.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If your brokerage had a sharp, differentiated value proposition — clearly articulated, consistently delivered, backed by tangible support programs that justify the split — how would that change your close rate on high-producer recruits and your market reputation as a destination brokerage?",
    goodResponse: "Destination brokerage positioning is what separates growing brokerages from ones that compete on split alone. Let me walk you through how we develop agent value propositions and recruiting narratives for brokerages at your competitive stage.",
    badResponse: "A sharp agent value proposition transforms recruiting close rates. Let me walk you through how we develop it.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];

const CONSULTING_REAL_ESTATE_S3 = [
  {
    phase: 'situation',
    question: "Has your brokerage thought about diversifying beyond transaction-based revenue — property management, mortgage, title, insurance — or is the business model primarily dependent on transaction GCI?",
    goodResponse: "Transaction-only revenue models in real estate are notoriously volatile — GCI swings dramatically with market cycles. Brokerages that have diversified into property management and ancillary services have much more stable business models. Is diversification a strategic conversation your leadership has had?",
    badResponse: "We help real estate brokerages evaluate and implement revenue diversification strategies.",
    rapportOnGood: 1, rapportOnBad: 0,
    skillTag: 'situation_questions', framework: 'SPIN – Situation',
  },
  {
    phase: 'problem',
    question: "In a down market year — when transaction volume drops 20-30% — does your brokerage have enough non-transaction revenue to sustain operations and protect the staff and infrastructure you've built?",
    goodResponse: "The 2022-2023 market correction reminded every transaction-dependent brokerage of exactly this vulnerability. Volume dropped 30-40% in many markets, and brokerages with no ancillary revenue were cutting staff and closing offices. What did that correction look like for your brokerage?",
    badResponse: "Transaction-only revenue creates existential vulnerability in down markets. Diversification is the strategic hedge.",
    rapportOnGood: 2, rapportOnBad: 0,
    skillTag: 'problem_questions', framework: 'SPIN – Problem',
  },
  {
    phase: 'implication',
    question: "If a market downturn reduces your transaction GCI by 30% and you have no other revenue stream — and you face the choice of cutting your most important staff or burning reserves — what's the long-term competitive damage of losing that team capacity in a downturn?",
    goodResponse: "Brokerages that cut their best people in a downturn typically spend 2-3 years after the market recovers rebuilding what they lost. They miss the recovery-phase growth. Diversified revenue is what makes it possible to sustain through a down cycle and capture disproportionate market share in the recovery.",
    badResponse: "Downturn staff cuts create recovery-phase competitive disadvantage. Revenue diversification prevents the need to cut.",
    rapportOnGood: 2, rapportOnBad: -1,
    skillTag: 'implication_questions', framework: 'SPIN – Implication',
  },
  {
    phase: 'need_payoff',
    question: "If your brokerage had a diversified revenue strategy — property management fees, referral income from ancillary services, perhaps a small mortgage or insurance operation — that provided a stable base even in down transaction markets, how would that change your ability to sustain operations and invest in growth during market cycles?",
    goodResponse: "Revenue diversification strategy for real estate brokerages is one of our most high-impact strategic engagements. Let me walk you through the diversification options that make the most strategic sense given your current size, market, and capability.",
    badResponse: "Revenue diversification creates market cycle resilience. Let me walk you through the strategic options for your brokerage.",
    rapportOnGood: 3, rapportOnBad: 0,
    skillTag: 'need_payoff', framework: 'SPIN – Need-Payoff',
  },
];
