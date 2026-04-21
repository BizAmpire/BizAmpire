// q_auto.js — Auto Dealer / Dealership perspective
// Player is SELLING vehicles, fleet accounts, and financing — not maintenance services
export const QUESTIONS = {

  // ─── TRADES / CONTRACTORS ──────────────────────────────────────────────────
  // Perfect fit: plumbers, HVAC, electricians, landscapers need work trucks constantly
  "trades_contractor": [
    [
      {
        phase: "situation",
        question: "How many work trucks and vans are you running right now, and are they owned outright, financed, or are some of them personal vehicles your guys are using for jobs?",
        goodResponse: "That mix of owned, financed, and personal vehicles is really common at your stage — and it usually means costs are scattered and hard to track. How old is your oldest work truck?",
        badResponse: "Got it. We have great deals on commercial vehicles if you're ever in the market.",
        rapportOnGood: 2, rapportOnBad: 0,
        skillTag: "situation_questions", framework: "SPIN – Situation"
      },
      {
        phase: "problem",
        question: "When a truck goes down on a job — breakdown, inspection failure, whatever — how long does it usually take before that crew is back up and running, and what does a lost day actually cost you?",
        goodResponse: "A lost crew day in contracting can run $2–5k once you factor in missed billable hours, emergency equipment rental, and rescheduling ripple effects. Is that happening more than once a year across your fleet?",
        badResponse: "Breakdowns are tough. We can get you into something reliable.",
        rapportOnGood: 2, rapportOnBad: -1,
        skillTag: "problem_questions", framework: "SPIN – Problem"
      },
      {
        phase: "implication",
        question: "If you're losing two or three crew days a year per aging truck, and you've got four trucks, that's potentially 12 lost days — at $2,000 a day that's $24k in soft losses on top of repair bills. Is that math showing up anywhere in your margins?",
        goodResponse: "Most contractors don't track it that way, but once you do, the replace-vs-repair math shifts fast. At what mileage or age do you typically decide a truck is done?",
        badResponse: "We have financing options that could help with the cost.",
        rapportOnGood: 2, rapportOnBad: -1,
        skillTag: "implication_questions", framework: "SPIN – Implication"
      },
      {
        phase: "need_payoff",
        question: "If you had a fleet account with us — locked-in pricing on replacements, priority service scheduling, and a dedicated commercial rep who handles everything — how much time would that save your ops manager every year?",
        goodResponse: "That's exactly what a fleet account is built for. We can set you up with net-30 billing, priority service lanes, and I'll personally handle every vehicle swap so you're never scrambling. Want me to walk you through what the account looks like?",
        badResponse: "We can definitely set something up for you.",
        rapportOnGood: 3, rapportOnBad: 0,
        skillTag: "need_payoff_questions", framework: "SPIN – Need-Payoff"
      }
    ],
    [
      {
        phase: "situation",
        question: "Are your crews driving branded vehicles or personal trucks? And when you hire a new tech, is providing a vehicle part of the comp package or are they expected to use their own?",
        goodResponse: "The branded-vs-personal question comes up a lot. Unbranded vehicles mean missed marketing impressions every time your crew drives through a neighborhood — and using personal vehicles creates insurance liability issues most owners don't realize they're carrying. How many new hires are you planning this year?",
        badResponse: "Branding on vehicles is great for visibility. We have some good options.",
        rapportOnGood: 2, rapportOnBad: 0,
        skillTag: "situation_questions", framework: "SPIN – Situation"
      },
      {
        phase: "problem",
        question: "When your lead tech or your best crew lead puts in their two weeks — and takes their personal truck with them — how quickly can you cover that capacity?",
        goodResponse: "That's one of the hidden risks of relying on employee-owned vehicles. When they leave, their truck leaves too. How often has that caught you short?",
        badResponse: "That's tough. We can help you get company-owned vehicles so that doesn't happen.",
        rapportOnGood: 2, rapportOnBad: -1,
        skillTag: "problem_questions", framework: "SPIN – Problem"
      },
      {
        phase: "implication",
        question: "If that departure costs you even two weeks of reduced capacity at your daily billing rate, you're looking at $15–30k in lost revenue just from one tech leaving — on top of the recruiting cost. Does that risk change how you think about vehicle ownership?",
        goodResponse: "Most contractors who switch to company-owned vehicles say the predictability alone is worth it. You control the asset, you control the brand, and you don't lose capacity when someone walks.",
        badResponse: "It's something to think about. We have good deals on vans right now.",
        rapportOnGood: 2, rapportOnBad: -1,
        skillTag: "implication_questions", framework: "SPIN – Implication"
      },
      {
        phase: "need_payoff",
        question: "What would it mean for your business if every tech showed up in a clean, branded company vehicle — consistent image, company insurance, no liability gaps, and you never lose a truck when someone leaves?",
        goodResponse: "That's the pitch for company-owned fleets — and the financing usually makes it easier than people expect. I can show you a side-by-side of what the monthly numbers look like versus what you're absorbing now. Want to run through it?",
        badResponse: "We can make it work for you financially.",
        rapportOnGood: 3, rapportOnBad: 0,
        skillTag: "need_payoff_questions", framework: "SPIN – Need-Payoff"
      }
    ],
    [
      {
        phase: "situation",
        question: "When you're bidding a big job — say a commercial buildout or a multi-unit project — do you ever lose it because your equipment or vehicle situation makes you look smaller than a competitor?",
        goodResponse: "That's a real issue. A lot of contractors are doing $2M in revenue out of trucks that look like $500k operations. First impression of your fleet is part of your brand whether you want it to be or not. What does your current fleet look like to a commercial client?",
        badResponse: "Looking professional matters. We have some clean options that would make a great impression.",
        rapportOnGood: 2, rapportOnBad: 0,
        skillTag: "situation_questions", framework: "SPIN – Situation"
      },
      {
        phase: "problem",
        question: "Have you ever had a commercial property manager or a GC question your crew's professionalism based on what they pulled up in?",
        goodResponse: "It happens more than people admit. A banged-up unmarked truck pulling up to a $5M property sends a signal — right or wrong. Has it cost you a job?",
        badResponse: "Looks matter in this business. Let me show you what we have.",
        rapportOnGood: 2, rapportOnBad: -1,
        skillTag: "problem_questions", framework: "SPIN – Problem"
      },
      {
        phase: "implication",
        question: "If you lost even one commercial contract this year because the first impression didn't match your actual quality — what was that worth in margin?",
        goodResponse: "Commercial contracts are usually 3–5x the margin of residential. Losing even one to a perception problem is the most expensive kind of loss because it's preventable. Is that the kind of work you're trying to grow into?",
        badResponse: "Commercial work is definitely worth protecting.",
        rapportOnGood: 2, rapportOnBad: -1,
        skillTag: "implication_questions", framework: "SPIN – Implication"
      },
      {
        phase: "need_payoff",
        question: "If upgrading your fleet helped you win one more commercial contract this year, what would that do for your annual revenue — and does the math make the vehicles worth it?",
        goodResponse: "That's the ROI framing most of my fleet clients use. The vehicles pay for themselves if they open one door that was closed before. I can build you a fleet proposal with commercial financing — want to look at the numbers together?",
        badResponse: "Let's see what we can do for you.",
        rapportOnGood: 3, rapportOnBad: 0,
        skillTag: "need_payoff_questions", framework: "SPIN – Need-Payoff"
      }
    ]
  ],

  // ─── REAL ESTATE ──────────────────────────────────────────────────────────
  // Good fit: agents need reliable, presentable cars; brokerages may run branded fleets
  "real_estate": [
    [
      {
        phase: "situation",
        question: "How many agents are in your office, and are they all driving their own personal vehicles to showings — or does your brokerage provide any kind of vehicle program?",
        goodResponse: "Most brokerages leave it entirely to agents, which means wildly inconsistent first impressions when a buyer gets in the car. What are your top producers driving right now?",
        badResponse: "We have some great options that agents love. Professional look, great reliability.",
        rapportOnGood: 2, rapportOnBad: 0,
        skillTag: "situation_questions", framework: "SPIN – Situation"
      },
      {
        phase: "problem",
        question: "Have you ever had a listing situation where the agent's vehicle — or even just the condition of it — made the buyer or seller uncomfortable? Or lost you a luxury listing because the agent didn't look the part?",
        goodResponse: "It's uncomfortable to talk about but it happens. Sellers interviewing agents for a $2M listing are evaluating everything — including what that agent pulls up in. Has it come up internally?",
        badResponse: "Presentation matters at every price point. We can help.",
        rapportOnGood: 2, rapportOnBad: -1,
        skillTag: "problem_questions", framework: "SPIN – Problem"
      },
      {
        phase: "implication",
        question: "If the vehicle mismatch costs you one luxury listing a year — even at a modest commission — that's $15–30k in lost GCI. Is that a number that would change how the brokerage thinks about supporting agents with vehicles?",
        goodResponse: "Most brokers haven't done that math, but once they do it's hard to unsee. Are you trying to grow your luxury or move-up market share?",
        badResponse: "It's definitely something worth thinking about.",
        rapportOnGood: 2, rapportOnBad: -1,
        skillTag: "implication_questions", framework: "SPIN – Implication"
      },
      {
        phase: "need_payoff",
        question: "What if your brokerage had a preferred vehicle partner — agents get preferred pricing and financing, you get a consistent brand image on the road, and top recruits see it as a perk when they're choosing where to hang their license?",
        goodResponse: "That's the fleet partnership model — and it costs the brokerage nothing directly. I work with agents individually on financing, but you get to promote it as a brokerage benefit. Want me to put together a one-pager you could share with your team?",
        badResponse: "We can definitely work something out.",
        rapportOnGood: 3, rapportOnBad: 0,
        skillTag: "need_payoff_questions", framework: "SPIN – Need-Payoff"
      }
    ],
    [
      {
        phase: "situation",
        question: "When a buyer gets into your agent's car for a showing tour — what's that experience like? Is it a rolling advertisement for the brokerage or just whatever car the agent happens to own?",
        goodResponse: "The car is a mobile office for real estate agents — buyers spend 2–4 hours in that vehicle. That's more intimate than most office meetings. What kind of experience are your buyers having right now?",
        badResponse: "Vehicle experience matters. We have some great options agents love.",
        rapportOnGood: 2, rapportOnBad: 0,
        skillTag: "situation_questions", framework: "SPIN – Situation"
      },
      {
        phase: "problem",
        question: "Have any of your agents had a reliability issue — breakdown mid-showing, AC failure in summer, something that put them in an embarrassing spot in front of a client?",
        goodResponse: "A breakdown during a buyer tour is one of those experiences that can kill a transaction — or at minimum kills the professional image you've built. How old are most of your agents' vehicles?",
        badResponse: "Reliability is important. We can get them into something dependable.",
        rapportOnGood: 2, rapportOnBad: -1,
        skillTag: "problem_questions", framework: "SPIN – Problem"
      },
      {
        phase: "implication",
        question: "If an agent loses a buyer because of a vehicle issue — or worse, a buyer mentions it in a review — how does that affect the agent's business and your brokerage's reputation?",
        goodResponse: "One bad Zillow review mentioning 'the agent's car broke down' can cost 10 future leads. Is reputation management something you're actively protecting?",
        badResponse: "Reputation matters. Let's find something reliable.",
        rapportOnGood: 2, rapportOnBad: -1,
        skillTag: "implication_questions", framework: "SPIN – Implication"
      },
      {
        phase: "need_payoff",
        question: "If every agent in your office had a reliable, presentable vehicle they were proud to drive clients in — how would that change the culture and the brand image you're building?",
        goodResponse: "I've seen brokerages use vehicle programs as a legitimate recruiting tool. 'We have a preferred dealer partnership' sounds small but it signals that the brokerage invests in agent success. Want to explore what that would look like here?",
        badResponse: "We can definitely put something together.",
        rapportOnGood: 3, rapportOnBad: 0,
        skillTag: "need_payoff_questions", framework: "SPIN – Need-Payoff"
      }
    ],
    [
      {
        phase: "situation",
        question: "Are you or any of your top agents in a lease that's coming up in the next six months? Or driving something you've been meaning to replace but haven't prioritized?",
        goodResponse: "Lease turn timing is always the right conversation to have early — waiting until the last month means you make rushed decisions. What are you currently in and when does it come up?",
        badResponse: "We can definitely work with your timing on a new vehicle.",
        rapportOnGood: 2, rapportOnBad: 0,
        skillTag: "situation_questions", framework: "SPIN – Situation"
      },
      {
        phase: "problem",
        question: "Do you find yourself avoiding certain client situations — luxury listings, high-net-worth buyers, CEO referrals — because you're not sure the vehicle matches the expectation?",
        goodResponse: "More agents than you'd think hold themselves back from premium markets for exactly that reason. It's a confidence thing as much as a perception thing. Has that happened to you?",
        badResponse: "A vehicle upgrade could open some doors.",
        rapportOnGood: 2, rapportOnBad: -1,
        skillTag: "problem_questions", framework: "SPIN – Problem"
      },
      {
        phase: "implication",
        question: "If holding back from one luxury client category is costing you even two transactions a year — at average luxury commissions — what does that add up to annually in missed income?",
        goodResponse: "For most agents in this market that's $20–40k in foregone GCI. The vehicle is a business investment, not a personal purchase — and the IRS sees it that way too with the right deduction strategy. Are you writing off vehicle expenses now?",
        badResponse: "It could definitely be worth doing the math.",
        rapportOnGood: 2, rapportOnBad: -1,
        skillTag: "implication_questions", framework: "SPIN – Implication"
      },
      {
        phase: "need_payoff",
        question: "What would it mean for your business — and your confidence going into high-stakes listing appointments — if you were driving something that matched the caliber of client you're going after?",
        goodResponse: "I've had agents tell me closing that first luxury listing felt easier just because they felt like they belonged in the room. The vehicle is part of that story. I can put together three options at different price points — want to look at numbers this week?",
        badResponse: "Let's find something that works for you.",
        rapportOnGood: 3, rapportOnBad: 0,
        skillTag: "need_payoff_questions", framework: "SPIN – Need-Payoff"
      }
    ]
  ],

  // ─── OFFICE / PROFESSIONAL SERVICES ───────────────────────────────────────
  // Moderate fit: law firms, consultants, CPAs — company cars, partner vehicles
  "office_professional": [
    [
      {
        phase: "situation",
        question: "Does your firm provide company vehicles for partners or senior staff who do a lot of client travel — or is everyone expensing mileage on personal vehicles?",
        goodResponse: "The mileage reimbursement model works at low volumes, but once you're running $800–1,200/month in reimbursements per person, company vehicles often pencil out cheaper and cleaner from a tax standpoint. How many people in your firm are driving to client sites regularly?",
        badResponse: "We have great options for professional firms. Very clean, great image.",
        rapportOnGood: 1, rapportOnBad: 0,
        skillTag: "situation_questions", framework: "SPIN – Situation"
      },
      {
        phase: "problem",
        question: "When a partner shows up to a high-stakes client meeting — merger negotiation, major account review — is the vehicle they arrive in something that reinforces the firm's positioning?",
        goodResponse: "It's a surprisingly common blind spot. Firms spend $15k on office interiors to signal prestige and then send partners to client sites in a 2018 base-model sedan. Is that something that's come up internally?",
        badResponse: "Presentation is everything at your level. We can help.",
        rapportOnGood: 1, rapportOnBad: -1,
        skillTag: "problem_questions", framework: "SPIN – Problem"
      },
      {
        phase: "implication",
        question: "If the vehicle inconsistency is creating any friction in your firm's enterprise client perception — even subconsciously — what's the cost of that over a year of business development?",
        goodResponse: "I'm not saying the car closes deals, but it's part of the total signal a firm sends. For a firm at your level, removing that variable is worth something. What does a typical new enterprise client relationship mean in fees?",
        badResponse: "It's worth thinking about the total impression you're making.",
        rapportOnGood: 1, rapportOnBad: -1,
        skillTag: "implication_questions", framework: "SPIN – Implication"
      },
      {
        phase: "need_payoff",
        question: "If your firm established a vehicle program — partners on a consistent make and model, corporate lease structure, clean tax treatment — how would that simplify the administrative overhead and strengthen the firm's image?",
        goodResponse: "Corporate fleet programs for professional firms are cleaner than most people expect. One invoice, one point of contact, consistent vehicles across the leadership team. I can put together a proposal sized for your partnership. Want to start with how many vehicles and at what tier?",
        badResponse: "We can make it work for your firm.",
        rapportOnGood: 2, rapportOnBad: 0,
        skillTag: "need_payoff_questions", framework: "SPIN – Need-Payoff"
      }
    ],
    [
      {
        phase: "situation",
        question: "Is there a vehicle policy at the firm right now — like a standard for what partners can expense or a preferred vehicle for client-facing roles?",
        goodResponse: "Most firms don't have one until someone shows up in something that creates an awkward conversation. Is that something the managing partner has ever flagged?",
        badResponse: "A formal policy can simplify things. We work with several firms on this.",
        rapportOnGood: 1, rapportOnBad: 0,
        skillTag: "situation_questions", framework: "SPIN – Situation"
      },
      {
        phase: "problem",
        question: "Have you had situations where partners are expensing dramatically different vehicle costs — one driving a $95k car, another a $22k car — and it creates internal equity issues?",
        goodResponse: "That inconsistency shows up in partnerships more than people discuss. It can create tension during comp reviews or when new partners are promoted into the tier. Has the firm set any guardrails on that?",
        badResponse: "A consistent program can solve a lot of those issues.",
        rapportOnGood: 1, rapportOnBad: -1,
        skillTag: "problem_questions", framework: "SPIN – Problem"
      },
      {
        phase: "implication",
        question: "If the vehicle inconsistency is creating internal friction or equity perception issues among your partnership — what's that doing to culture and retention at the partner level?",
        goodResponse: "Partner retention at professional service firms is one of the most expensive problems to solve. If something as fixable as a vehicle policy is creating friction, it's worth addressing. What does it cost to lose a mid-level partner at your firm?",
        badResponse: "Retention matters. A consistent program helps.",
        rapportOnGood: 1, rapportOnBad: -1,
        skillTag: "implication_questions", framework: "SPIN – Implication"
      },
      {
        phase: "need_payoff",
        question: "What if the firm had a clean, standardized vehicle program that removed the ambiguity — everyone in leadership on the same tier, consistent image externally, and a single monthly invoice internally?",
        goodResponse: "I've set this up for three or four local firms. It's simpler than it sounds — we handle all the financing, you handle approvals, and the monthly cost is predictable. Want me to build a proposal for your partnership size?",
        badResponse: "We can definitely put something together.",
        rapportOnGood: 2, rapportOnBad: 0,
        skillTag: "need_payoff_questions", framework: "SPIN – Need-Payoff"
      }
    ],
    [
      {
        phase: "situation",
        question: "Are any of the partners in a personal lease right now that's coming up — or driving something they've been wanting to replace but haven't gotten around to?",
        goodResponse: "Timing matters a lot with vehicles. The best deals happen when you're not in a rush. What are most of your partners currently driving?",
        badResponse: "We can work with whatever timing works best for your team.",
        rapportOnGood: 1, rapportOnBad: 0,
        skillTag: "situation_questions", framework: "SPIN – Situation"
      },
      {
        phase: "problem",
        question: "Is anyone in the firm handling the vehicle search and negotiation process themselves — going dealer to dealer, spending weekends doing research — when that time could be billed?",
        goodResponse: "A partner billing $400/hour spending six hours shopping for a car is a $2,400 opportunity cost. That's before the negotiation stress. Does the firm have anyone who handles that kind of admin?",
        badResponse: "We can make the process really easy and take that off your plate.",
        rapportOnGood: 1, rapportOnBad: -1,
        skillTag: "problem_questions", framework: "SPIN – Problem"
      },
      {
        phase: "implication",
        question: "If partners are spending 5–10 hours per vehicle purchase on research and negotiation — and you have four partners who each replace a vehicle every three years — that's 20–40 hours of billable time lost to car shopping over a cycle. Does the firm think about that kind of overhead?",
        goodResponse: "Most don't, but once they do the math on billing rate versus time lost, a fleet account with one dedicated rep starts to look very different. That's exactly what I offer.",
        badResponse: "It adds up faster than people realize.",
        rapportOnGood: 1, rapportOnBad: -1,
        skillTag: "implication_questions", framework: "SPIN – Implication"
      },
      {
        phase: "need_payoff",
        question: "What if I became the firm's go-to for every vehicle purchase — you call me, tell me what you need, I have it ready, and your partners never spend a weekend in a dealership again?",
        goodResponse: "That's the concierge model I offer fleet clients. No negotiation, no research, no time wasted. I bring the vehicle to you if you need it. Want to set up a 20-minute call this week so I can learn what your partners typically drive?",
        badResponse: "We can make it very easy.",
        rapportOnGood: 2, rapportOnBad: 0,
        skillTag: "need_payoff_questions", framework: "SPIN – Need-Payoff"
      }
    ]
  ],

  // ─── HEALTHCARE ───────────────────────────────────────────────────────────
  // Moderate fit: mobile health units, visiting nurses, home health agencies
  "healthcare": [
    [
      {
        phase: "situation",
        question: "Does your practice have any vehicles for home visits, mobile outreach, or staff who need to travel between clinic locations — or is everyone getting there on their own?",
        goodResponse: "Mobile health is one of the fastest-growing segments — home visits, mobile screening units, outreach programs. Even if you're not there yet, it's worth knowing your options. Do you have any travel-heavy roles on your team?",
        badResponse: "We have some great options for healthcare organizations. Very reliable.",
        rapportOnGood: 1, rapportOnBad: 0,
        skillTag: "situation_questions", framework: "SPIN – Situation"
      },
      {
        phase: "problem",
        question: "For staff who are doing home health visits or traveling between sites — are they using personal vehicles and getting reimbursed, or does the organization carry any liability there?",
        goodResponse: "Personal vehicle use for patient visits creates a liability gap most administrators don't fully understand until there's an incident. Is your legal team aware of how your travel policy is structured?",
        badResponse: "Liability is something to be careful about. Organization-owned vehicles help.",
        rapportOnGood: 1, rapportOnBad: -1,
        skillTag: "problem_questions", framework: "SPIN – Problem"
      },
      {
        phase: "implication",
        question: "If a staff member using their personal vehicle for a patient visit is in an accident — even a minor one — what does your organization's liability exposure look like under your current policy?",
        goodResponse: "Most healthcare orgs find out their commercial auto policy doesn't cover employee-owned vehicles in transit during work hours. That's a significant gap. Has risk management looked at your travel policy recently?",
        badResponse: "It's definitely worth reviewing. Organization-owned vehicles close that gap.",
        rapportOnGood: 1, rapportOnBad: -1,
        skillTag: "implication_questions", framework: "SPIN – Implication"
      },
      {
        phase: "need_payoff",
        question: "If your organization had a small fleet of organization-owned vehicles for mobile staff — clean, insured, branded — how would that change your risk profile and your ability to expand mobile services?",
        goodResponse: "Mobile health is where the growth is going. Having the vehicle infrastructure ready makes it much easier to say yes to a new home-visit contract or a mobile screening partnership. I can put together a small fleet proposal — what does your mobile program look like today?",
        badResponse: "We can definitely put something together for your needs.",
        rapportOnGood: 2, rapportOnBad: 0,
        skillTag: "need_payoff_questions", framework: "SPIN – Need-Payoff"
      }
    ],
    [
      {
        phase: "situation",
        question: "Does your practice do any community outreach — health fairs, screenings, mobile clinics? Or is everything confined to the facility right now?",
        goodResponse: "Community outreach is one of the strongest patient acquisition channels for independent practices — and a branded vehicle makes every outreach event twice as visible. Have you ever run a mobile screening event?",
        badResponse: "Outreach is a great opportunity. A branded vehicle really helps with visibility.",
        rapportOnGood: 1, rapportOnBad: 0,
        skillTag: "situation_questions", framework: "SPIN – Situation"
      },
      {
        phase: "problem",
        question: "When your staff travel to community events or off-site screenings, what do they show up in — and does that create any professional or logistical challenges?",
        goodResponse: "Showing up to a health fair in a mix of personal vehicles, some of which don't have space for equipment, creates a scramble every time. Has that caused any problems with how your events run?",
        badResponse: "Having the right vehicle for the job makes a big difference.",
        rapportOnGood: 1, rapportOnBad: -1,
        skillTag: "problem_questions", framework: "SPIN – Problem"
      },
      {
        phase: "implication",
        question: "If equipment transport limitations or vehicle issues have caused you to turn down or scale back any community events — what does that mean for patient acquisition and your community relationships?",
        goodResponse: "Community events are a pipeline, not just PR. If logistical constraints are limiting how many you can do, you're leaving patient relationships on the table. How many events are you running per quarter right now?",
        badResponse: "Every event you can't do is a missed opportunity.",
        rapportOnGood: 1, rapportOnBad: -1,
        skillTag: "implication_questions", framework: "SPIN – Implication"
      },
      {
        phase: "need_payoff",
        question: "If you had a dedicated, branded vehicle for community outreach — set up for equipment transport, clean and professional — how many more events could your team realistically run per quarter?",
        goodResponse: "Most practices I work with can double their community presence once the vehicle logistics are solved. And a branded vehicle doing community events is 24/7 marketing. I can show you some options that work well for mobile health setups — want to look this week?",
        badResponse: "We can find something that fits your needs.",
        rapportOnGood: 2, rapportOnBad: 0,
        skillTag: "need_payoff_questions", framework: "SPIN – Need-Payoff"
      }
    ],
    [
      {
        phase: "situation",
        question: "For physicians or senior staff who do hospital rounds at multiple facilities — are those their personal vehicles, or does the practice provide anything?",
        goodResponse: "Multi-site physicians spending 40–60 minutes a day commuting between facilities in their own vehicles is a significant quality-of-life and retention issue. Is that something that's come up with your medical staff?",
        badResponse: "We have great options for medical professionals. Very reliable and professional.",
        rapportOnGood: 1, rapportOnBad: 0,
        skillTag: "situation_questions", framework: "SPIN – Situation"
      },
      {
        phase: "problem",
        question: "Have you had physicians or PA-Cs leave — or express frustration — about the travel demands of a multi-site model, especially when they're managing their own vehicle costs?",
        goodResponse: "Physician retention is the most expensive problem in independent practice. If travel burden is a friction point — and the practice isn't helping with vehicle costs — that's a fixable retention gap. Has it come up in reviews?",
        badResponse: "Retention matters. A vehicle benefit can help with that.",
        rapportOnGood: 1, rapportOnBad: -1,
        skillTag: "problem_questions", framework: "SPIN – Problem"
      },
      {
        phase: "implication",
        question: "If a physician leaves because of quality-of-life friction — including the travel burden — what does replacing them cost the practice between recruiting, credentialing, and lost revenue during the gap?",
        goodResponse: "Most practices put physician replacement cost at $250–500k when you add it all up. A vehicle program for traveling physicians costs a fraction of that. Is physician retention something the practice has a formal strategy for?",
        badResponse: "Physician retention is critical. A vehicle program can be a real differentiator.",
        rapportOnGood: 1, rapportOnBad: -1,
        skillTag: "implication_questions", framework: "SPIN – Implication"
      },
      {
        phase: "need_payoff",
        question: "What if the practice offered a vehicle benefit to multi-site physicians — corporate lease, practice covers a portion, physician gets a clean reliable vehicle — and you used it as a retention tool in recruiting?",
        goodResponse: "I've worked with two other practices on exactly this structure. It works really well as a recruiting differentiator because it's visible and tangible in a way that a salary bump isn't. Want me to put together some options at different contribution levels?",
        badResponse: "We can definitely structure something that works.",
        rapportOnGood: 2, rapportOnBad: 0,
        skillTag: "need_payoff_questions", framework: "SPIN – Need-Payoff"
      }
    ]
  ],

  // ─── RETAIL / FOOD ────────────────────────────────────────────────────────
  // Weak fit: delivery vehicles, catering vans, food trucks — lower priority
  "retail_food": [
    [
      {
        phase: "situation",
        question: "Do you run any deliveries, catering, or off-site pop-ups — and if so, what are you using for transport right now? Your own vehicle, something you own outright, or a rental when you need it?",
        goodResponse: "The rental-when-needed model seems flexible but usually ends up costing more than owning once you add up the rental fees, availability issues, and the times you've had to turn down an event because you couldn't get a van. How often are you doing off-site work?",
        badResponse: "Having your own vehicle makes those situations a lot smoother.",
        rapportOnGood: 1, rapportOnBad: 0,
        skillTag: "situation_questions", framework: "SPIN – Situation"
      },
      {
        phase: "problem",
        question: "Have you ever had to turn down a catering gig, a pop-up, or a delivery opportunity because you didn't have the right vehicle available — or because your current vehicle wasn't reliable enough?",
        goodResponse: "Turning down revenue because of a vehicle limitation is a painful calculation. How often has that happened, and what was the typical order size you were leaving on the table?",
        badResponse: "Missing revenue opportunities is always tough. We can help with that.",
        rapportOnGood: 1, rapportOnBad: -1,
        skillTag: "problem_questions", framework: "SPIN – Problem"
      },
      {
        phase: "implication",
        question: "If you're turning down two or three catering gigs a month because of vehicle availability — at $500–2,000 per event — that's potentially $12–24k a year in missed revenue. Does that change how you think about the vehicle investment?",
        goodResponse: "That math surprises most owners. The vehicle pays for itself in captured revenue faster than the monthly payment. What does a typical event run in gross revenue for you?",
        badResponse: "The numbers add up faster than you'd think.",
        rapportOnGood: 1, rapportOnBad: -1,
        skillTag: "implication_questions", framework: "SPIN – Implication"
      },
      {
        phase: "need_payoff",
        question: "If you had a reliable, right-sized vehicle ready to go whenever an opportunity came up — how much more revenue do you think you could say yes to over the next twelve months?",
        goodResponse: "That's the right way to frame the purchase — not as a cost but as a revenue unlock. I have some options in the $25–45k range that are perfect for catering and delivery setups. Want to see what the monthly payment looks like against what you're leaving on the table?",
        badResponse: "Let's find something that works for your operation.",
        rapportOnGood: 2, rapportOnBad: 0,
        skillTag: "need_payoff_questions", framework: "SPIN – Need-Payoff"
      }
    ],
    [
      {
        phase: "situation",
        question: "Is your current delivery or transport vehicle wrapped with your branding — or is it just your personal car or something generic?",
        goodResponse: "An unbranded vehicle doing deliveries is a missed marketing impression every single trip. If you're making 30 deliveries a week in your neighborhood, that's 30 missed opportunities to turn a head. What does your current situation look like?",
        badResponse: "A branded vehicle is great marketing. We can definitely help with that.",
        rapportOnGood: 1, rapportOnBad: 0,
        skillTag: "situation_questions", framework: "SPIN – Situation"
      },
      {
        phase: "problem",
        question: "For deliveries or catering — have you had the experience of pulling up and having the client question whether you're a legitimate operation because the vehicle didn't match the business?",
        goodResponse: "It happens to growing food businesses all the time. The food quality is there but the vehicle sends a different signal. Has that kind of mismatch ever cost you a repeat client or a referral?",
        badResponse: "First impressions matter. A proper vehicle solves that.",
        rapportOnGood: 1, rapportOnBad: -1,
        skillTag: "problem_questions", framework: "SPIN – Problem"
      },
      {
        phase: "implication",
        question: "If even one corporate catering account passed on using you again — or never referred you — because the vehicle made you look less established, what's that worth in recurring revenue?",
        goodResponse: "Corporate catering clients often have weekly or monthly recurring spend. Losing even one account to a perception issue is a disproportionate loss. Is corporate catering a segment you're trying to grow?",
        badResponse: "Corporate clients are a big opportunity. Looking the part matters.",
        rapportOnGood: 1, rapportOnBad: -1,
        skillTag: "implication_questions", framework: "SPIN – Implication"
      },
      {
        phase: "need_payoff",
        question: "What would it mean for your business to pull up to every corporate account in a clean, branded vehicle — professional, consistent, and immediately communicating that you're built for scale?",
        goodResponse: "That's the branding ROI of the right vehicle — it works 24/7 and it changes how clients perceive you before you say a word. I have some cargo vans and sprinters that wrap beautifully. Want to come by and look at a few options?",
        badResponse: "A good vehicle really transforms the brand.",
        rapportOnGood: 2, rapportOnBad: 0,
        skillTag: "need_payoff_questions", framework: "SPIN – Need-Payoff"
      }
    ],
    [
      {
        phase: "situation",
        question: "Are you planning to expand — second location, food truck, expanded delivery radius — and is vehicle capacity something that's going to be a constraint on that growth?",
        goodResponse: "Vehicle capacity is one of the most commonly underplanned parts of food business growth. You lock in the lease, hire the staff, and then realize the transport infrastructure isn't ready. Are you actively planning an expansion right now?",
        badResponse: "Growth is exciting. Vehicle planning is an important part of that.",
        rapportOnGood: 1, rapportOnBad: 0,
        skillTag: "situation_questions", framework: "SPIN – Situation"
      },
      {
        phase: "problem",
        question: "When you think about doubling your delivery volume or catering events — what breaks first in your current setup?",
        goodResponse: "Most growing food businesses say the answer is either people or vehicles. And people is usually solvable before vehicles because you can hire fast but can't get the right vehicle overnight. Which is the tighter constraint for you right now?",
        badResponse: "Growth always surfaces the bottlenecks. We can help with the vehicle side.",
        rapportOnGood: 1, rapportOnBad: -1,
        skillTag: "problem_questions", framework: "SPIN – Problem"
      },
      {
        phase: "implication",
        question: "If the vehicle gap is going to become the ceiling on your growth in the next six months — what does that mean for the revenue targets you've set for the year?",
        goodResponse: "Missing a growth target because of an infrastructure gap that was knowable and fixable in advance is one of the more frustrating business experiences. Are you planning for the vehicle piece proactively or hoping to solve it when it becomes a problem?",
        badResponse: "Planning ahead for that makes a lot of sense.",
        rapportOnGood: 1, rapportOnBad: -1,
        skillTag: "implication_questions", framework: "SPIN – Implication"
      },
      {
        phase: "need_payoff",
        question: "What if you had the vehicle infrastructure ready before you need it — so that when the growth opportunity comes, the answer is yes instead of 'we're not set up for that yet'?",
        goodResponse: "That's the proactive fleet mindset — and it's what separates the businesses that scale cleanly from the ones that scramble. I can put together something in the right size range for where you're going. What does the next phase of your business look like?",
        badResponse: "Being ready ahead of time always pays off.",
        rapportOnGood: 2, rapportOnBad: 0,
        skillTag: "need_payoff_questions", framework: "SPIN – Need-Payoff"
      }
    ]
  ],

  // ─── AUTO SERVICES (selling to other dealers / repair shops) ──────────────
  // Moderate fit: trade-in referrals, certified pre-owned partnerships
  "auto_services": [
    [
      {
        phase: "situation",
        question: "When a customer comes into your shop with a vehicle that's not worth the repair — what do you tell them, and where do you send them when they ask what to do next?",
        goodResponse: "That conversation is one of the best lead referral opportunities in the auto services world, and most shops just say 'sorry, can't help you.' Do you have a relationship with a dealer right now where you send those customers?",
        badResponse: "We appreciate referrals. We'd love to work together on that.",
        rapportOnGood: 1, rapportOnBad: 0,
        skillTag: "situation_questions", framework: "SPIN – Situation"
      },
      {
        phase: "problem",
        question: "Do you find that when a customer leaves your shop in a not-worth-fixing situation, they often don't come back — even after they get a new vehicle — because the experience feels like a dead end?",
        goodResponse: "That's the retention gap in auto services — when the car dies, the customer relationship often dies with it. If you could hand that customer to a trusted dealer and get them back as a service customer once they're in their new vehicle, would that change your retention numbers?",
        badResponse: "Keeping customers is tough. A referral relationship helps.",
        rapportOnGood: 1, rapportOnBad: -1,
        skillTag: "problem_questions", framework: "SPIN – Problem"
      },
      {
        phase: "implication",
        question: "If you're losing 20–30 customers a year to the 'not worth fixing' conversation — and none of them come back — what does that do to your revenue over a three-year period?",
        goodResponse: "A loyal service customer over three years is worth $1,500–3,000 in recurring revenue. Losing 25 of them is a $37–75k impact that doesn't show up anywhere because it's a silent churn. Is that a number you've ever looked at?",
        badResponse: "The cumulative effect really adds up.",
        rapportOnGood: 1, rapportOnBad: -1,
        skillTag: "implication_questions", framework: "SPIN – Implication"
      },
      {
        phase: "need_payoff",
        question: "What if we set up a formal referral partnership — you send me the not-worth-fixing customer, I take care of them, and when they need service after they buy, I send them back to you with a warm handoff? And I pay you a referral fee for every one that buys.",
        goodResponse: "A closed-loop referral partnership between a shop and a dealer is one of the cleanest revenue shares in auto. No marketing cost, just mutual trust. I'd pay you $200–500 per closed deal. Want to talk about how we'd structure the handoff?",
        badResponse: "We can definitely work out an arrangement.",
        rapportOnGood: 2, rapportOnBad: 0,
        skillTag: "need_payoff_questions", framework: "SPIN – Need-Payoff"
      }
    ],
    [
      {
        phase: "situation",
        question: "When customers bring in trade-in vehicles — do you ever see ones that are in good mechanical shape but the owner just wants something different? What happens to those?",
        goodResponse: "Clean mechanically sound trade-ins are gold for a dealer. If you're seeing those come through and not capturing any value from them, there's a referral or consignment arrangement that might make sense. How often does that happen?",
        badResponse: "We're always interested in good trade-ins. Let's talk.",
        rapportOnGood: 1, rapportOnBad: 0,
        skillTag: "situation_questions", framework: "SPIN – Situation"
      },
      {
        phase: "problem",
        question: "Do you have customers who ask your opinion on whether they should fix or sell their current vehicle — and you don't have a good answer for the 'sell' side of that?",
        goodResponse: "That's a trust moment most shops aren't capturing. The customer is asking for advice, and you're equipped to answer the repair side but not the replacement side. Does that happen more than a few times a month?",
        badResponse: "We can be a resource for those conversations.",
        rapportOnGood: 1, rapportOnBad: -1,
        skillTag: "problem_questions", framework: "SPIN – Problem"
      },
      {
        phase: "implication",
        question: "If you're sending customers away for the replacement conversation and a competitor dealer captures them — and then sends them to their preferred shop going forward — what does that shift mean over time?",
        goodResponse: "Customer loyalty in auto services follows the vehicle. If your customer ends up at a dealer who has their own service lane, you've just lost a long-term relationship. Is that happening with any frequency?",
        badResponse: "Keeping customers in your ecosystem matters long term.",
        rapportOnGood: 1, rapportOnBad: -1,
        skillTag: "implication_questions", framework: "SPIN – Implication"
      },
      {
        phase: "need_payoff",
        question: "What if you became the trusted advisor for the full vehicle lifecycle — repair decisions, replacement timing, and a dealer you trust — so customers never feel like they have to go anywhere else?",
        goodResponse: "That's the value of a shop-dealer partnership done right. You stay the trusted advisor, I close the vehicle sale, and your customer comes back to you for every future service. It's a closed loop that benefits both of us. Want to map out how the referral flow would work?",
        badResponse: "A partnership makes sense. Let's figure it out.",
        rapportOnGood: 2, rapportOnBad: 0,
        skillTag: "need_payoff_questions", framework: "SPIN – Need-Payoff"
      }
    ],
    [
      {
        phase: "situation",
        question: "Does your shop do any fleet service contracts — businesses that bring multiple vehicles in regularly? And when those fleets need to expand or replace, where are those customers going to buy?",
        goodResponse: "Fleet service contracts are some of the most valuable recurring revenue in auto services. If you've got fleet clients and they're going to a competitor when they need new vehicles, that's a referral opportunity you're leaving uncaptured. How many fleet accounts are you servicing?",
        badResponse: "Fleet relationships are valuable. Let's see how we can help each other.",
        rapportOnGood: 1, rapportOnBad: 0,
        skillTag: "situation_questions", framework: "SPIN – Situation"
      },
      {
        phase: "problem",
        question: "When a fleet client asks you who to call when they need to add a vehicle or replace an aging truck — do you have a dealer you confidently recommend, or does that conversation kind of fall flat?",
        goodResponse: "If you don't have a confident answer to that question, you're missing a referral moment that could mean a lot to that fleet client. Having a trusted dealer recommendation makes you look like a complete resource, not just a wrench shop.",
        badResponse: "Having a good dealer to refer makes you look great to clients.",
        rapportOnGood: 1, rapportOnBad: -1,
        skillTag: "problem_questions", framework: "SPIN – Problem"
      },
      {
        phase: "implication",
        question: "If your fleet clients are going to a dealer who then redirects their service to an in-house shop — even for minor things — what does that churn mean for your recurring fleet revenue?",
        goodResponse: "Fleet clients are worth $800–3,000 per vehicle per year in service revenue. Losing even two of them to a dealer with a competing service lane is $5–10k gone. Is that a risk you've thought about?",
        badResponse: "Fleet retention is really important. A dealer partnership helps.",
        rapportOnGood: 1, rapportOnBad: -1,
        skillTag: "implication_questions", framework: "SPIN – Implication"
      },
      {
        phase: "need_payoff",
        question: "What if we built a formal shop-dealer referral loop — I send new fleet purchasers to you for service, you refer fleet clients to me when they're buying — and we both build our fleet books together?",
        goodResponse: "A shop-dealer fleet partnership is one of the strongest local B2B relationships in auto. We're not competing — we're covering each other's blind spots. I'll pay a referral fee on every fleet vehicle sold from your referrals. Want to set up a time to map it out?",
        badResponse: "A partnership makes a lot of sense. Let's talk.",
        rapportOnGood: 2, rapportOnBad: 0,
        skillTag: "need_payoff_questions", framework: "SPIN – Need-Payoff"
      }
    ]
  ],

  // ─── FINANCIAL SERVICES ────────────────────────────────────────────────────
  // Low fit (score 0) — banks and wealth mgmt rarely buy vehicles from dealers
  "financial_services": [
    [
      {
        phase: "situation",
        question: "Does the firm provide any vehicle benefits for advisors who do client home visits or estate planning meetings off-site — or is that entirely on the individual?",
        goodResponse: "A few wealth management firms I work with offer vehicle stipends for advisors doing home visits — it's actually a strong recruiting tool at the senior advisor level. Is off-site client work common for your team?",
        badResponse: "A vehicle benefit can be a nice perk. We work with several financial firms.",
        rapportOnGood: 0, rapportOnBad: 0,
        skillTag: "situation_questions", framework: "SPIN – Situation"
      },
      {
        phase: "problem",
        question: "For senior advisors managing high-net-worth clients — is there any expectation around the vehicle they drive to client meetings, or has that ever come up as a professional standards question?",
        goodResponse: "Image management for wealth advisors is real — HNW clients do notice. Has it ever been a topic internally, or is it left entirely to individual advisor discretion?",
        badResponse: "Presentation matters in your field. We can help with that.",
        rapportOnGood: 0, rapportOnBad: 0,
        skillTag: "problem_questions", framework: "SPIN – Problem"
      },
      {
        phase: "implication",
        question: "If an advisor's vehicle creates any friction in a first impression with a high-net-worth client — and that client decides to work with a competitor firm — what does one lost relationship mean in AUM and fees?",
        goodResponse: "A single HNW client relationship can mean $500k–2M in AUM and 5–7 years of advisory fees. If the vehicle is ever part of that first impression, it's worth thinking about. Has the firm ever quantified the advisor image standard?",
        badResponse: "The stakes are high in your business. Every impression counts.",
        rapportOnGood: 0, rapportOnBad: 0,
        skillTag: "implication_questions", framework: "SPIN – Implication"
      },
      {
        phase: "need_payoff",
        question: "If there was a simple way for senior advisors to get into the right vehicle — preferred pricing, clean process, no negotiation — would that be something the firm would want to offer as a benefit?",
        goodResponse: "Some firms formalize it as a perk: 'preferred dealer for all vehicle purchases.' It costs the firm nothing but positions you as an employer who invests in the advisor experience. I can put together a program overview if that's worth exploring.",
        badResponse: "We can make it really easy for your team.",
        rapportOnGood: 0, rapportOnBad: 0,
        skillTag: "need_payoff_questions", framework: "SPIN – Need-Payoff"
      }
    ],
    [
      {
        phase: "situation",
        question: "Is the firm's vehicle usage mostly personal commuting, or do advisors regularly drive to client offices, estates, or off-site meetings?",
        goodResponse: "Advisors who are road-heavy — two to three client meetings a day off-site — start to have real mileage accumulation. Is anyone in the firm tracking that from a vehicle expense or liability standpoint?",
        badResponse: "We work with a lot of professional service firms on this. Happy to help.",
        rapportOnGood: 0, rapportOnBad: 0,
        skillTag: "situation_questions", framework: "SPIN – Situation"
      },
      {
        phase: "problem",
        question: "Has the firm run into any situations where an advisor's vehicle situation — reliability, insurance coverage for business use, or optics — became an operational or HR issue?",
        goodResponse: "It comes up more than firms expect, usually when someone uses a personal vehicle for client transport and there's a coverage gap. Is your HR team aware of the business-use insurance question for advisors?",
        badResponse: "It's worth making sure the policy covers business use of personal vehicles.",
        rapportOnGood: 0, rapportOnBad: 0,
        skillTag: "problem_questions", framework: "SPIN – Problem"
      },
      {
        phase: "implication",
        question: "If an advisor's personal vehicle isn't properly covered for business use and there's an incident during a client visit — what does the firm's liability exposure look like?",
        goodResponse: "That's a gap most firms don't discover until something happens. Commercial auto for business travel in personal vehicles requires an endorsement most personal policies don't include. Has legal reviewed that exposure?",
        badResponse: "That's a real liability gap worth closing.",
        rapportOnGood: 0, rapportOnBad: 0,
        skillTag: "implication_questions", framework: "SPIN – Implication"
      },
      {
        phase: "need_payoff",
        question: "If your advisors had the option of a preferred dealer for personal vehicles — with business-use financing options structured properly — would that be a benefit worth mentioning in recruiting and retention conversations?",
        goodResponse: "It sounds small but 'we have a preferred dealer who understands business-use financing' is a differentiator in advisor recruiting. I've helped a couple of local firms set up exactly that. Want a quick overview of how it works?",
        badResponse: "We can definitely put together something useful for your team.",
        rapportOnGood: 0, rapportOnBad: 0,
        skillTag: "need_payoff_questions", framework: "SPIN – Need-Payoff"
      }
    ],
    [
      {
        phase: "situation",
        question: "When advisors in the firm purchase vehicles personally, do they typically do that on their own — or is there any firm-level guidance or preferred vendor arrangement?",
        goodResponse: "Most firms leave it entirely to the individual, which means advisors are doing their own research and negotiation on their own time. Do you know if any of your advisors are in the market right now?",
        badResponse: "We're happy to work with your team individually or as a group.",
        rapportOnGood: 0, rapportOnBad: 0,
        skillTag: "situation_questions", framework: "SPIN – Situation"
      },
      {
        phase: "problem",
        question: "Have advisors ever complained about the car buying process — time spent, negotiation stress, feeling like they didn't get a fair deal?",
        goodResponse: "A senior advisor billing $300–500/hour spending a weekend at a dealership is spending significant income on a task that doesn't require their expertise. Is that something that comes up in offhand conversations?",
        badResponse: "We make the process really simple. No pressure, no games.",
        rapportOnGood: 0, rapportOnBad: 0,
        skillTag: "problem_questions", framework: "SPIN – Problem"
      },
      {
        phase: "implication",
        question: "If each advisor is spending six to eight hours on the research and purchase process every three years — across a team of ten advisors — that's 20+ hours of their personal time on something a preferred dealer relationship could eliminate. Is advisor time something the firm thinks about protecting?",
        goodResponse: "The hidden cost of advisors spending time on admin and personal logistics that should be handled differently is real. A preferred dealer arrangement eliminates car-buying friction entirely. The firm looks good for offering it, and advisors get their weekends back.",
        badResponse: "Advisor time is valuable. We can simplify this for them.",
        rapportOnGood: 0, rapportOnBad: 0,
        skillTag: "implication_questions", framework: "SPIN – Implication"
      },
      {
        phase: "need_payoff",
        question: "What if your advisors could call one number, tell me what they want, and have it handled — no research, no negotiation, no lost weekends — as a firm-endorsed benefit?",
        goodResponse: "That's the concierge model I offer to professional firms. Your advisors get preferred pricing, I handle everything, and you get to say the firm has a preferred dealer. It's a win on all sides. Want to bring this to your managing partner as a benefits addition?",
        badResponse: "We can make it very easy and straightforward.",
        rapportOnGood: 0, rapportOnBad: 0,
        skillTag: "need_payoff_questions", framework: "SPIN – Need-Payoff"
      }
    ]
  ],

  // ─── TECH / DIGITAL AGENCIES ───────────────────────────────────────────────
  // Poor fit (score 0) — shown as blocked by fit dialogue
  "tech_company": [
    [
      {
        phase: "situation",
        question: "Does your team do a lot of in-person client work — on-site implementation, client visits, demos — or is most of what you do remote?",
        goodResponse: "For mostly-remote teams, vehicle needs are usually personal rather than business. But when you do have on-site client work, how are people getting there — own cars, rideshare?",
        badResponse: "Remote-first is the norm these days. We still work with a few tech companies.",
        rapportOnGood: 0, rapportOnBad: 0,
        skillTag: "situation_questions", framework: "SPIN – Situation"
      },
      {
        phase: "problem",
        question: "For the on-site client visits your team does do — are there any situations where the vehicle situation has caused a problem, whether it's reliability, image, or logistics?",
        goodResponse: "Tech teams doing enterprise on-site work sometimes run into situations where pulling up in the wrong vehicle to a Fortune 500 campus creates an awkward moment. Has that come up?",
        badResponse: "We can help with reliability if that's ever an issue.",
        rapportOnGood: 0, rapportOnBad: 0,
        skillTag: "problem_questions", framework: "SPIN – Problem"
      },
      {
        phase: "implication",
        question: "Honestly — for a tech company like yours, the vehicle question is probably pretty low priority. Is this something that's ever even come up in a leadership conversation?",
        goodResponse: "I appreciate you being direct. Honestly, we're probably not the right fit for your core business. Is there anyone in your network — maybe a contractor or a trades business you work with — who might actually need fleet vehicles?",
        badResponse: "Fair enough. We're probably not the right fit right now.",
        rapportOnGood: 0, rapportOnBad: 0,
        skillTag: "implication_questions", framework: "SPIN – Implication"
      },
      {
        phase: "need_payoff",
        question: "If there's not a fit for the business itself — is there anyone on your leadership team personally in the market for a vehicle? I'm easy to work with and referrals are always appreciated.",
        goodResponse: "Sometimes the best outcome of a sales call is a personal referral. And I take care of people well — anyone I work with will get a straight deal and no games. If anyone comes to mind, I'd appreciate the introduction.",
        badResponse: "No problem. Here's my card if anything comes up.",
        rapportOnGood: 0, rapportOnBad: 0,
        skillTag: "need_payoff_questions", framework: "SPIN – Need-Payoff"
      }
    ],
    [
      {
        phase: "situation",
        question: "Does your company have any field sales, field implementation, or account management roles that require regular in-person client travel?",
        goodResponse: "Field roles are the one area where a tech company starts to have real vehicle needs. If you have AEs or implementation consultants on the road daily, that's where a fleet arrangement starts to make sense. How many people are in road-heavy roles?",
        badResponse: "Field roles are where vehicle needs usually show up for tech companies.",
        rapportOnGood: 0, rapportOnBad: 0,
        skillTag: "situation_questions", framework: "SPIN – Situation"
      },
      {
        phase: "problem",
        question: "For your field reps or account managers — are they expensing mileage, using rideshare, or are they expected to have their own reliable vehicle as a condition of the role?",
        goodResponse: "Mileage reimbursement for field-heavy roles adds up fast and creates inconsistent expense reporting. If it's $800/month or more per rep, company vehicles often pencil out. How many reps are in that situation?",
        badResponse: "Vehicle expenses can be a headache to manage. We can simplify that.",
        rapportOnGood: 0, rapportOnBad: 0,
        skillTag: "problem_questions", framework: "SPIN – Problem"
      },
      {
        phase: "implication",
        question: "If your field reps are managing their own vehicle situation — and the reliability or professional image varies — does that create any inconsistency in how clients experience your company in person?",
        goodResponse: "Brand consistency in field sales is underrated. If your product and pitch are premium but the in-person touchpoint is inconsistent, there's a gap. Is that something your VP of Sales has flagged?",
        badResponse: "Consistency in field representation matters.",
        rapportOnGood: 0, rapportOnBad: 0,
        skillTag: "implication_questions", framework: "SPIN – Implication"
      },
      {
        phase: "need_payoff",
        question: "If your field team had a consistent, company-provided or company-preferred vehicle setup — clean image, reliable, no personal logistics headaches — how would that affect field rep retention and client experience?",
        goodResponse: "Field rep retention in SaaS is one of the most expensive problems in the industry. A vehicle benefit is tangible and visible in a way that salary bumps aren't. I can put together a proposal for your field team size — want to start with a number?",
        badResponse: "We can make it work for your team.",
        rapportOnGood: 0, rapportOnBad: 0,
        skillTag: "need_payoff_questions", framework: "SPIN – Need-Payoff"
      }
    ],
    [
      {
        phase: "situation",
        question: "I'll be upfront with you — most tech companies aren't our core customer for fleet vehicles. But I'm curious: does your leadership team drive vehicles that match the company's brand positioning when they're visiting enterprise clients?",
        goodResponse: "Leadership presence at enterprise accounts matters more than most tech executives think. If your CEO is showing up to a Fortune 100 sales call in the wrong vehicle, that's a subconscious signal. Has it ever come up?",
        badResponse: "Fair enough. It's not usually a big need for tech companies.",
        rapportOnGood: 0, rapportOnBad: 0,
        skillTag: "situation_questions", framework: "SPIN – Situation"
      },
      {
        phase: "problem",
        question: "For your executive team — C-suite, VPs — is there any company standard around how they show up to in-person enterprise meetings? Or is it all personal discretion?",
        goodResponse: "Most startups and growth-stage tech companies leave it to personal discretion, which means wildly inconsistent executive presence at enterprise accounts. Has that inconsistency ever been flagged internally?",
        badResponse: "Executive presence is a real thing. A good vehicle is part of that.",
        rapportOnGood: 0, rapportOnBad: 0,
        skillTag: "problem_questions", framework: "SPIN – Problem"
      },
      {
        phase: "implication",
        question: "If your company is chasing enterprise deals — and the decision maker is also evaluating whether your team looks like a serious, scaled operation — does the vehicle your CEO drives to the intro meeting matter?",
        goodResponse: "It's a small signal but enterprise procurement teams are evaluating everything. I'm not saying the car closes deals, but it's part of the total picture. Is enterprise growth a priority for you this year?",
        badResponse: "Every signal matters in enterprise sales.",
        rapportOnGood: 0, rapportOnBad: 0,
        skillTag: "implication_questions", framework: "SPIN – Implication"
      },
      {
        phase: "need_payoff",
        question: "Even if fleet vehicles aren't a business need — is any member of your leadership team personally in the market? I make it easy and I take care of anyone you send my way.",
        goodResponse: "Sometimes the best outcome is a personal referral. I'd genuinely appreciate the introduction if someone comes to mind — and I'll make sure they're taken care of. Here's my card.",
        badResponse: "No problem. Hope to be useful down the road.",
        rapportOnGood: 0, rapportOnBad: 0,
        skillTag: "need_payoff_questions", framework: "SPIN – Need-Payoff"
      }
    ]
  ]
};
