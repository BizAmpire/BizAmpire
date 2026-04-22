// ═══════════════════════════════════════════════════════════
//  BizAmpire: Street Level — Coaching Hints
//  Context-aware hints keyed to phase × rapport × industry.
//  Zero API cost — pure lookup. selectHint() is the public API.
// ═══════════════════════════════════════════════════════════

const HINTS = {
  opener: {
    cold: {
      _default: "Cold prospect — a generic intro gets you in the room but zero rapport. The targeted opener references their specific pain. That's the difference between 'sure' and 'go on.'",
      it:          "IT cold calls get dismissed fast. Reference a real pain — security gaps, onboarding delays, support tickets piling up — before asking for anything.",
      realestate:  "Real estate brokers see vendors constantly. Skip the intro. Reference agent retention or transaction friction — it signals you know their world.",
      health:      "Healthcare owners are busy and compliance-aware. A pain-specific opener about EHR friction or billing delays cuts through faster than any general pitch.",
      marketing:   "Marketing prospects are skeptical of promises. Reference a measurable outcome they're probably not hitting — lead volume, conversion, brand visibility.",
      finance:     "Financial owners hear the same pitches. Reference the hidden cost — hours spent on bookkeeping instead of revenue activity — and they'll pay attention.",
      law:         "Lawyers bill by the hour. Reference the operational drag that pulls them off billable work and they'll hear you out.",
      construction:"Contractors want reliability. Reference project delays, cost overruns, or subcontractor issues — the things that eat margin.",
      auto:        "Auto shop owners trust actions over words. Reference downtime cost or fleet management pain — problems they feel every day.",
      consulting:  "Consultants are skeptical of outsiders. Reference a specific operational bottleneck — show you understand the problem before pitching the solution.",
    },
    warm: {
      _default: "They already know you — skip the intro. Lead with the pain point or a direct question. They're ready to talk business, not hear a pitch.",
    },
  },

  discovery: {
    situation: {
      low: {
        _default:    "Low rapport — ask the safest Situation question first. Get them talking about facts before you probe for pain. Make them feel heard, not interrogated.",
        it:          "Start with infrastructure basics — how many locations, cloud vs on-prem, how IT is currently handled. Factual, low-threat, opens the door.",
        realestate:  "Ask about team size and how transactions are managed right now. Keeps it neutral while you map the territory.",
        health:      "Ask about headcount and systems first — EHR, billing platform, scheduling. Grounds the conversation before you surface problems.",
        construction:"Ask about project pipeline and how they're currently managing subs and timelines. Safe, factual, sets up the problem questions.",
        _law:        "Ask about team size and what kinds of matters they typically handle. Low-threat, establishes context.",
      },
      mid: {
        _default: "Good momentum. Situation questions here should set up the Problem phase — listen for anything that sounds like friction or workarounds.",
      },
      high: {
        _default: "High rapport — move through Situation quickly. One or two grounding questions, then push to Problem. Don't over-survey a willing prospect.",
      },
    },
    problem: {
      low: {
        _default: "Problem questions need trust first. Soften the approach — ask about challenges in general before naming specific pain. Don't make it feel like an interrogation.",
      },
      mid: {
        _default: "Now surface real pain. Ask directly — you've earned enough trust. Listen for what they hesitate on; that's usually the real issue.",
        it:          "Ask specifically about the last time something broke and how they handled it. Real incidents reveal the true cost of the problem.",
        realestate:  "Ask about agents who've left or deals that fell through because of administrative friction. That's where the pain lives.",
        health:      "Ask how often billing denials happen and who handles them. That number usually surprises them when they say it out loud.",
      },
      high: {
        _default: "Push past 'we manage.' Ask how often it happens and what it cost last time. Get them talking numbers, not summaries.",
      },
    },
    implication: {
      low: {
        _default: "Implication questions at low rapport can feel like accusations. Frame them as curious — 'I wonder what the downstream effect of that is' not 'so this is costing you money.'",
      },
      mid: {
        _default: "Connect the problem to real cost. 'When that happens, what else does it affect?' gets them calculating the pain themselves — far more powerful than you stating it.",
      },
      high: {
        _default: "Make the number real. Get them to say the cost out loud. A number they name themselves is 10x more persuasive than one you tell them.",
      },
    },
    need_payoff: {
      low: {
        _default: "Need-Payoff at low rapport can feel presumptuous. Make it hypothetical — 'If you could eliminate that, what would change?' — not 'here's how we solve it.'",
      },
      mid: {
        _default: "Get them to articulate the value themselves. 'What would that be worth to you?' is more powerful than any number you pitch.",
      },
      high: {
        _default: "They're ready. Ask directly what solving this would mean for them — operationally, financially, personally. Then listen. Don't fill the silence with features.",
      },
    },
  },

  pitch: {
    low: {
      _default: "Low rapport going into the pitch is a red flag. Lead with outcome, not features — 'here's what changes for you' not 'here's what we do.' Make them the hero of the story.",
    },
    mid: {
      _default: "Solid position. StoryBrand works here: they're the hero, this problem is the villain, you're the guide with a plan. Keep the pitch about their result, not your product.",
    },
    high: {
      _default: "High rapport — they want to believe. The Challenger pitch lands hardest here: give them an insight that reframes the problem. Don't just confirm what they already think.",
    },
  },

  objections: {
    price: {
      low: {
        _default: "Price objections at low rapport usually mean 'I don't trust you yet.' Don't defend the price — acknowledge it, then reframe the cost of inaction instead.",
      },
      mid: {
        _default: "Reframe from cost to investment. 'What's the cost of NOT solving this over the next 12 months?' is stronger than justifying your rate.",
      },
      high: {
        _default: "High rapport price objections are usually real budget constraints, not resistance. A pilot or phased start often works better than a price cut.",
      },
    },
    trust: {
      low: {
        _default: "Trust objections at low rapport need proof fast. A specific case study or a no-risk pilot beats any amount of promises.",
      },
      mid: {
        _default: "Offer a pilot. It's not 'trust me' — it's 'let the work prove it.' Remove the risk of being wrong and they can say yes without feeling exposed.",
      },
      high: {
        _default: "They like you but need a safe path in. A scoped pilot reframes the decision from 'big bet' to 'small experiment.' Make it easy to say yes.",
      },
    },
    incumbent: {
      _default: "Don't attack their current vendor — it signals insecurity. Find the gap: 'I'm not here to replace them, I'm here to handle what they can't cover.' Then ask what that gap is.",
    },
    timing: {
      low: {
        _default: "Timing objections at low rapport usually mean 'I'm not convinced enough to prioritize this.' Build more conviction before pushing on timing.",
      },
      mid: {
        _default: "A small pilot before their stated timeline removes the urgency pressure. 'We start small now so you're ready when Q3 hits' is an easier yes.",
      },
      high: {
        _default: "High rapport timing objections are usually real planning constraints. Offer a pilot that fits their calendar — gets you in without fighting their cycle.",
      },
    },
    _default: {
      _default: "Address the root concern directly — don't deflect or concede. Acknowledge it, reframe it, then move forward. Anything else signals you don't believe in your own value.",
    },
  },

  close: {
    low: {
      _default: "Don't close direct at low rapport — you'll get a no that's hard to recover from. Pilot offer or follow-up keeps momentum without forcing a premature decision.",
    },
    mid: {
      _default: "You're in range. A pilot offer is strong here — lower commitment, same door open. Or close direct and see how they respond.",
    },
    high: {
      _default: "Close direct. Ask clearly, state the next step, then go quiet. Whoever speaks first after the ask usually concedes. Let them sit with it.",
    },
  },
};

export function selectHint(phase, subPhase, warmth, rapport, industry, objType) {
  const band = rapport < 0 ? 'low' : rapport < 3 ? 'mid' : 'high';
  const warmthKey = warmth >= 2 ? 'warm' : 'cold';
  const ind = industry || '_default';

  let node = HINTS[phase];
  if (!node) return null;

  if (phase === 'opener') {
    node = node[warmthKey];
  } else if (phase === 'discovery') {
    node = node[subPhase]?.[band];
  } else if (phase === 'objections') {
    const typeNode = node[objType] || node._default;
    node = typeNode?.[band] || typeNode;
  } else {
    node = node[band];
  }

  if (!node) return null;
  return node[ind] || node._default || null;
}
