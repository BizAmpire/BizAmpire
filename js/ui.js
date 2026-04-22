// ═══════════════════════════════════════════════════════════
//  BizAmpire: Street Level — UI Manager
//  All screen transitions, HUD updates, overlays
// ═══════════════════════════════════════════════════════════

import {
  INDUSTRIES, SKILL_TREE, DISCOVERY_QUESTIONS, OBJECTION_LIBRARY,
  EMPLOYEE_ARCHETYPES, JOURNAL_PROMPTS, ENCOUNTER_PHASES,
  INDUSTRY_STARTUP_COSTS, STARTUP_DIFFICULTY_LABELS
} from './data.js';
import { EncounterEngine } from './engine.js';
import { selectHint } from './hints.js';
import { randomWisdom } from './wisdom.js';

// ── Pluralization helper ─────────────────────────────────────
function pluralize(str) {
  if (!str) return str;
  const s = str.trim();
  const low = s.toLowerCase();
  // Consonant + y → -ies (Agency→Agencies, Company→Companies)
  if (/[^aeiou]y$/i.test(s)) return s.slice(0, -1) + 'ies';
  // Ends in -s, -sh, -ch, -x, -z → -es (Business→Businesses)
  if (/(?:s|sh|ch|x|z)$/i.test(s)) return s + 'es';
  // Ends in -fe → -ves
  if (low.endsWith('fe')) return s.slice(0, -2) + 'ves';
  return s + 's';
}

export class UIManager {
  constructor() {
    this.state = null;
    this.gameEngine = null;
    this.encounterEngine = null;

    this._cacheElements();
    this._debugData = {};
  }

  init(state, gameEngine) {
    this.state = state;
    this.gameEngine = gameEngine;
    this.encounterEngine = new EncounterEngine(state, gameEngine, this);
    this.updateHUD(state);
  }

  _cacheElements() {
    this.el = {
      // Screens
      loading:    document.getElementById('screen-loading'),
      title:      document.getElementById('screen-title'),
      onboard:    document.getElementById('screen-onboard'),
      map:        document.getElementById('screen-map'),
      encounter:  document.getElementById('screen-encounter'),
      skills:     document.getElementById('screen-skills'),
      journal:    document.getElementById('screen-journal'),
      management: document.getElementById('screen-management'),
      vcEvent:    document.getElementById('screen-vc'),
      // HUD
      hud:         document.getElementById('hud'),
      hudCash:     document.getElementById('hud-cash'),
      hudRep:      document.getElementById('hud-rep'),
      hudRepBar:   document.getElementById('hud-rep-bar'),
      hudDeals:    document.getElementById('hud-deals'),
      hudLevel:    document.getElementById('hud-level'),
      hudXP:       document.getElementById('hud-xp'),
      hudXPBar:    document.getElementById('hud-xp-bar'),
      hudSP:       document.getElementById('hud-sp'),
      // Other
      toastContainer: document.getElementById('toast-container'),
      survivalBanner: document.getElementById('survival-banner'),
      debug:          document.getElementById('debug-overlay'),
      skillBar:       document.getElementById('skill-bar'),
    };
  }

  // ── Screen control ─────────────────────────────────────────
  showScreen(name) {
    const screens = ['loading','title','onboard','map','encounter','skills','journal','management','vcEvent'];
    screens.forEach(s => {
      const el = this.el[s];
      if (!el) return;
      if (s === name) {
        el.classList.remove('hidden');
        el.style.display = 'flex'; // explicit — never rely on CSS cascade
      } else {
        el.classList.add('hidden');
        el.style.display = 'none';
      }
    });
    // HUD only on map/encounter
    if (this.el.hud) {
      this.el.hud.style.display = (name === 'map') ? 'block' : 'none';
    }
    // iOS touch bridge: fire click on buttons when touchend fires without drag
    // Prevents scroll containers on iOS from swallowing button taps
    if (name === 'encounter' && !this._touchBridgeInstalled) {
      this._touchBridgeInstalled = true;
      const enc = this.el.encounter;
      if (enc) {
        let _touchStartY = 0;
        enc.addEventListener('touchstart', e => { _touchStartY = e.touches[0]?.clientY ?? 0; }, { passive: true });
        enc.addEventListener('touchend', e => {
          const dy = Math.abs((e.changedTouches[0]?.clientY ?? 0) - _touchStartY);
          if (dy > 8) return; // scrolled — not a tap
          const btn = e.target.closest('button:not([disabled])');
          if (btn) { e.preventDefault(); btn.click(); }
        }, { passive: false });
      }
    }
  }

  // ── Hint system ───────────────────────────────────────────
  _hintButtonHTML(hintKey, state) {
    const used = this.encounterEngine?.flags?.hintsUsed?.[hintKey];
    const cash = state?.cash ?? 0;
    if (used) return `<div style="font-size:var(--text-xs);color:var(--text-muted);text-align:center;padding:var(--s2)">💡 Coaching used this phase</div>`;
    if (cash < 500) return `<button class="btn btn-secondary btn-sm" disabled style="width:100%;opacity:0.4;margin-top:var(--s3)">💡 Get Coaching — $500 (insufficient funds)</button>`;
    return `<button class="btn btn-secondary btn-sm" id="btn-hint-${hintKey}" style="width:100%;margin-top:var(--s3)">💡 Get Coaching — $500</button>`;
  }

  _attachHintButton(hintKey, enc, state, hintCtx) {
    const btn = document.getElementById(`btn-hint-${hintKey}`);
    if (!btn) return;
    btn.addEventListener('click', () => {
      const ind = state.businessIndustry?.id || state.businessIndustry;
      const hint = selectHint(hintCtx.phase, hintCtx.subPhase, enc.business?.warmth ?? 0, enc.rapport, ind, hintCtx.objType);
      if (!hint) return;
      state.cash = Math.max(0, (state.cash || 0) - 500);
      this.updateHUD(state);
      if (this.encounterEngine) {
        if (!this.encounterEngine.flags.hintsUsed) this.encounterEngine.flags.hintsUsed = {};
        this.encounterEngine.flags.hintsUsed[hintKey] = true;
      }
      const container = btn.parentElement;
      container.innerHTML = `
        <div style="margin-top:var(--s3);padding:var(--s4);background:rgba(155,114,248,0.08);border:1px solid rgba(155,114,248,0.25);border-radius:var(--r-lg)">
          <div style="font-size:var(--text-xs);color:var(--violet);text-transform:uppercase;letter-spacing:.08em;margin-bottom:var(--s2)">💡 Coaching Note <span style="color:var(--text-muted);font-weight:400;text-transform:none;letter-spacing:0">— $500</span></div>
          <div style="font-size:var(--text-sm);color:var(--text);line-height:1.6">${hint}</div>
        </div>`;
    }, { once: true });
  }

  // ── Loading ────────────────────────────────────────────────
  showLoading(text = 'Initializing city...', pct = 0) {
    this.showScreen('loading');
    const bar = document.getElementById('loading-bar-fill');
    const label = document.getElementById('loading-text');
    if (bar) bar.style.width = `${pct}%`;
    if (label) label.textContent = text;
  }

  // ── Title Screen ───────────────────────────────────────────
  showTitle() {
    this.showScreen('title');
    // Re-wire button fresh each time title is shown
    const newGameBtn = document.getElementById('btn-new-game');
    if (newGameBtn) {
      const newBtn = newGameBtn.cloneNode(true);
      newGameBtn.parentNode.replaceChild(newBtn, newGameBtn);
      newBtn.addEventListener('click', () => {
        // Go straight to onboarding — auth is prompted later when saving
        this.showOnboarding();
      });
    }
    document.getElementById('btn-about')?.addEventListener('click', () => this.showToast('BizAmpire teaches real sales & business frameworks through an RPG. Every mechanic = a real lesson.', 'gold'), { once: true });
  }

  // ── Onboarding ─────────────────────────────────────────────
  showOnboarding() {
    this.showScreen('onboard');
    this._renderIndustryGrid();
    this._setupOnboardingForm();
  }

  _renderIndustryGrid() {
    const grid = document.getElementById('industry-grid');
    if (!grid) return;
    grid.innerHTML = '';
    INDUSTRIES.forEach(ind => {
      const card = document.createElement('div');
      card.className = 'industry-card';
      card.dataset.id = ind.id;
      card.innerHTML = `
        <div class="industry-icon">${ind.icon}</div>
        <div class="industry-name">${ind.name}</div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:2px">${ind.desc}</div>
      `;
      card.addEventListener('click', () => {
        grid.querySelectorAll('.industry-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this._selectedIndustry = ind;
      });
      grid.appendChild(card);
    });
  }

  _setupOnboardingForm() {
    const form = document.getElementById('onboard-form');
    const bizNameInput = document.getElementById('biz-name');
    const bizDescInput = document.getElementById('biz-desc');
    const generateBtn = document.getElementById('btn-generate-dna');
    const startBtn = document.getElementById('btn-start-game');
    const dnaCard = document.getElementById('dna-card');

    if (generateBtn) {
      generateBtn.addEventListener('click', () => {
        const name = bizNameInput?.value?.trim();
        const desc = bizDescInput?.value?.trim();
        const industry = this._selectedIndustry;

        if (!name || !desc || !industry) {
          this.showToast('Please select an industry and describe your business first.', 'warn');
          return;
        }

        const dna = this._generateBusinessDNA(name, desc, industry);
        this._currentDNA = dna;
        this._renderDNACard(dna, dnaCard);
        dnaCard?.style.setProperty('display', 'flex');
        startBtn && (startBtn.style.display = 'flex');
      });
    }

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (!this._currentDNA) {
          this.showToast('Generate your Business DNA card first!', 'warn');
          return;
        }
        this._launchGame(this._currentDNA);
      });
    }
  }

  _generateBusinessDNA(name, desc, industry) {
    // Deterministic persona generation from the business description
    const lower = desc.toLowerCase();

    // Target market inference
    let targetMarket = 'SMB owners';
    if (lower.includes('enterprise') || lower.includes('corp') || lower.includes('large')) targetMarket = 'Enterprise companies';
    else if (lower.includes('startup') || lower.includes('early') || lower.includes('founder')) targetMarket = 'Startups & founders';
    else if (lower.includes('local') || lower.includes('small') || lower.includes('neighborhood')) targetMarket = 'Local SMBs';

    // Value prop inference
    const valueProps = {
      marketing: ['increase visibility', 'generate qualified leads', 'build brand authority'],
      it: ['reduce downtime', 'improve security posture', 'streamline tech operations'],
      finance: ['optimize tax position', 'improve cash flow', 'reduce financial risk'],
      law: ['protect business interests', 'ensure regulatory compliance', 'resolve disputes fast'],
      construction: ['deliver projects on time/budget', 'quality craftsmanship', 'reliable subcontracting'],
      auto: ['keep vehicles running', 'transparent pricing', 'fast turnaround'],
      realestate: ['maximize property ROI', 'smooth transactions', 'market expertise'],
      health: ['improve patient outcomes', 'optimize operations', 'increase patient retention'],
      consulting: ['solve operational bottlenecks', 'accelerate growth', 'strategic clarity'],
    };

    const vps = valueProps[industry.id] || ['deliver measurable results', 'solve problems fast', 'build long-term value'];

    // Common objections this business will face
    const objectionsByIndustry = {
      marketing: ['We tried an agency before and it didn\'t work', 'How do we measure ROI?', 'We can do this in-house'],
      it: ['We already have an IT person', 'We\'ve never been hacked before', 'That\'s too expensive for our size'],
      finance: ['We use QuickBooks ourselves', 'Our nephew is an accountant', 'We\'ll do taxes ourselves this year'],
      law: ['We\'ll deal with it if it becomes a problem', 'We can use online legal templates', 'Too expensive'],
      construction: ['We got a cheaper quote', 'Our brother-in-law does construction', 'We\'ll DIY it'],
      consulting: ['We already know what our problems are', 'Why would an outsider understand our business?', 'Can\'t afford it right now'],
    };

    const objections = objectionsByIndustry[industry.id] || [
      'Not the right time', 'Already working with someone', 'Too expensive'
    ];

    // Ideal prospect profile
    const icpByIndustry = {
      marketing: 'Business owners who know they need more clients but don\'t know how to get them',
      it: 'Companies with 10-100 employees that have grown past "one tech guy" but haven\'t formalized IT',
      finance: 'Business owners spending 10+ hrs/month on finances instead of running their business',
      law: 'Growing businesses about to sign a major contract or face their first significant legal issue',
      construction: 'Property owners with projects $25K+ who want a reliable contractor, not the cheapest',
      consulting: 'Owner-operators who feel stuck and know something needs to change but can\'t see it from the inside',
    };

    const icp = icpByIndustry[industry.id] || 'Business owners who need exactly what you provide';

    return {
      name,
      description: desc,
      industry,
      targetMarket,
      valuePropositions: vps,
      topObjections: objections.slice(0, 2),
      idealCustomerProfile: icp,
      personas: [
        {
          name: 'The Skeptic',
          profile: `${targetMarket} who\'ve been burned before. They need proof, not promises.`,
          openingLine: "We tried someone like you before and it didn't work out.",
          approach: 'Lead with a specific case study, not a generic pitch.',
        },
        {
          name: 'The Explorer',
          profile: `${targetMarket} actively looking but overwhelmed by options.`,
          openingLine: "We\'ve been meaning to look into this. What do you do exactly?",
          approach: 'Simplify. Use the StoryBrand framework — make them the hero.',
        },
        {
          name: 'The Status Quo',
          profile: `${targetMarket} comfortable with how things are, unaware of opportunity cost.`,
          openingLine: "Things are going fine right now honestly.",
          approach: 'Use Implication Questions to make the cost of inaction tangible.',
        },
      ],
    };
  }

  _renderDNACard(dna, container) {
    if (!container) return;
    container.innerHTML = `
      <div class="dna-header">
        <span class="dna-badge">${dna.industry.icon} ${dna.industry.name}</span>
        <div class="dna-name">${dna.name}</div>
      </div>
      <div class="dna-body">${dna.description}</div>
      <div>
        <div style="font-size:var(--text-xs);color:var(--text-muted);margin-bottom:var(--s2);text-transform:uppercase;letter-spacing:.08em;">Your Value Propositions</div>
        <div class="dna-tags">
          ${dna.valuePropositions.map(vp => `<span class="dna-tag">✓ ${vp}</span>`).join('')}
        </div>
      </div>
      <div>
        <div style="font-size:var(--text-xs);color:var(--text-muted);margin-bottom:var(--s2);text-transform:uppercase;letter-spacing:.08em;">Ideal Customer</div>
        <div style="font-size:var(--text-sm);color:var(--text);line-height:1.55;">${dna.idealCustomerProfile}</div>
      </div>
      <div>
        <div style="font-size:var(--text-xs);color:var(--text-muted);margin-bottom:var(--s2);text-transform:uppercase;letter-spacing:.08em;">Expect These Objections</div>
        ${dna.topObjections.map(o => `<div style="font-size:var(--text-xs);color:var(--crimson);padding:var(--s1) 0">⚡ "${o}"</div>`).join('')}
      </div>
    `;
  }

  _launchGame(dna) {
    const industryId = dna.industry?.id || 'consulting';
    const costs = INDUSTRY_STARTUP_COSTS[industryId] || INDUSTRY_STARTUP_COSTS.consulting;
    const isFirstBusiness = !window.__bizampirePortfolio?.slots?.length;

    if (isFirstBusiness) {
      // First business: no gating, just launch with reduced starting cash
      this._executeLaunch(dna, costs, true);
    } else {
      // Additional business: show cost modal, deduct from active business cash
      this._showStartupCostModal(dna, costs);
    }
  }

  _showStartupCostModal(dna, costs) {
    document.getElementById('startup-cost-overlay')?.remove();

    const activeCash = window.__bizampireEngine?.state?.cash ?? 0;
    const activeName = window.__bizampireEngine?.state?.businessName ?? 'your business';
    const canAfford  = activeCash >= costs.capitalCost;
    const diffInfo   = STARTUP_DIFFICULTY_LABELS[costs.difficulty] || STARTUP_DIFFICULTY_LABELS.medium;

    const overlay = document.createElement('div');
    overlay.id = 'startup-cost-overlay';
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9500;
      background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;padding:16px`;

    overlay.innerHTML = `
      <div class="panel" style="max-width:420px;width:100%;padding:28px;display:flex;flex-direction:column;gap:16px">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="font-size:2rem">${dna.industry?.icon || '🏢'}</div>
          <div>
            <div style="font-family:var(--font-display);font-size:var(--text-xl);font-weight:700">
              Launch ${dna.name}
            </div>
            <div style="font-size:var(--text-xs);color:var(--text-muted)">${dna.industry?.name} — new business</div>
          </div>
          <div style="margin-left:auto;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;
            background:${diffInfo.color}22;color:${diffInfo.color};border:1px solid ${diffInfo.color}">
            ${diffInfo.label}
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div class="panel panel-sm" style="text-align:center;${canAfford ? '' : 'border-color:var(--crimson)'}">
            <div style="font-size:var(--text-xl);font-weight:700;color:${canAfford ? 'var(--sage)' : 'var(--crimson)'}">
              -$${costs.capitalCost.toLocaleString()}
            </div>
            <div style="font-size:10px;color:var(--text-muted)">Startup Capital</div>
            <div style="font-size:10px;color:var(--text-muted);margin-top:4px">from ${activeName}</div>
          </div>
          <div class="panel panel-sm" style="text-align:center">
            <div style="font-size:var(--text-xl);font-weight:700;color:var(--amber)">⏳ ${costs.trainingDays}d</div>
            <div style="font-size:10px;color:var(--text-muted)">Training Lock</div>
            <div style="font-size:10px;color:var(--text-muted);margin-top:4px">before first encounter</div>
          </div>
        </div>

        <div class="panel panel-sm" style="display:flex;flex-direction:column;gap:6px">
          <div style="font-size:11px;color:var(--text-muted)">
            <span style="color:var(--crimson)">💰 Capital:</span> ${costs.capitalLabel}
          </div>
          <div style="font-size:11px;color:var(--text-muted)">
            <span style="color:var(--amber)">📚 Training:</span> ${costs.trainingLabel}
          </div>
          <div style="font-size:11px;color:var(--text-muted)">
            <span style="color:var(--violet)">🏢 Overhead:</span> +$${costs.overheadBump.toLocaleString()}/mo above base
          </div>
        </div>

        ${!canAfford ? `
          <div style="background:rgba(255,68,102,0.12);border:1px solid var(--crimson);border-radius:8px;
            padding:10px 12px;font-size:var(--text-xs);color:var(--crimson)">
            ⚠️ <strong>${activeName}</strong> only has $${activeCash.toLocaleString()} — you need
            $${costs.capitalCost.toLocaleString()} to fund this launch.
            Close more deals first.
          </div>` : `
          <div style="background:rgba(74,222,128,0.08);border:1px solid rgba(74,222,128,0.3);border-radius:8px;
            padding:10px 12px;font-size:var(--text-xs);color:var(--text-muted)">
            After launch, <strong>${activeName}</strong> will have
            <strong style="color:var(--sage)">$${(activeCash - costs.capitalCost).toLocaleString()}</strong> remaining.
          </div>`}

        <div style="display:flex;gap:10px">
          <button id="scm-cancel" class="btn btn-secondary" style="flex:1">Cancel</button>
          <button id="scm-confirm" class="btn btn-primary" style="flex:1;${canAfford ? '' : 'opacity:.4;pointer-events:none'}">
            ${canAfford ? 'Fund & Launch →' : 'Not Enough Cash'}
          </button>
        </div>
      </div>`;

    document.body.appendChild(overlay);
    document.getElementById('scm-cancel').addEventListener('click', () => overlay.remove());
    document.getElementById('scm-confirm')?.addEventListener('click', () => {
      overlay.remove();
      this._executeLaunch(dna, costs, false);
    });
  }

  _executeLaunch(dna, costs, isFirst) {
    const { createInitialState } = window.__bizampireData;

    // Deduct capital from active business (not first)
    if (!isFirst && window.__bizampireEngine) {
      window.__bizampireEngine.state.cash -= costs.capitalCost;
      window.__bizampireEngine.ui.updateHUD(window.__bizampireEngine.state);
    }

    // Build new state with startup economics baked in
    const baseState = createInitialState({
      name: dna.name,
      industry: dna.industry,
      description: dna.description,
      personas: dna.personas,
    });

    if (isFirst) {
      // First business pays startup cost out of its own starting cash
      baseState.cash = Math.max(500, baseState.cash - costs.capitalCost);
    }
    // Apply training lock and overhead bump regardless
    baseState.trainingDaysLeft = costs.trainingDays;
    baseState.monthlyOverhead  = baseState.monthlyOverhead + costs.overheadBump;
    baseState.startupCost      = costs;  // store for portfolio display

    this.showLoading('Building your city...', 20);
    setTimeout(() => {
      this.showLoading('Populating districts...', 60);
      setTimeout(() => {
        this.showLoading('Briefing your competitors...', 85);
        setTimeout(() => {
          window.__bizampireLaunch(baseState);
        }, 400);
      }, 500);
    }, 300);
  }

  // ── HUD ────────────────────────────────────────────────────
  updateHUD(state) {
    if (!state) return;
    const fmt = (n) => n >= 1000 ? `$${(n/1000).toFixed(1)}k` : `$${Math.round(n)}`;
    if (this.el.hudCash) {
      this.el.hudCash.textContent = fmt(state.cash);
      this.el.hudCash.className = 'hud-stat-value' + (state.cash < state.monthlyOverhead * 2 ? ' negative' : '');
    }
    if (this.el.hudRep) this.el.hudRep.textContent = Math.round(state.reputation);
    if (this.el.hudRepBar) this.el.hudRepBar.style.width = `${Math.min(100, state.reputation / 10)}%`;
    if (this.el.hudDeals) this.el.hudDeals.textContent = state.totalDeals;
    if (this.el.hudLevel) this.el.hudLevel.textContent = state.level;
    if (this.el.hudSP) this.el.hudSP.textContent = state.skillPoints;

    const xpNeeded = state.level * 250;
    const xpPct = Math.min(100, (state.xp % xpNeeded) / xpNeeded * 100);
    if (this.el.hudXP) this.el.hudXP.textContent = `${state.xp % xpNeeded}/${xpNeeded}`;
    if (this.el.hudXPBar) this.el.hudXPBar.style.width = `${xpPct}%`;

    // Training lock badge on business name
    const bizNameEl = document.getElementById('hud-biz-name');
    if (bizNameEl) {
      if (state.trainingDaysLeft > 0) {
        bizNameEl.innerHTML = `${state.businessName} <span style="font-size:10px;background:var(--amber);color:#000;border-radius:4px;padding:1px 5px;font-weight:700;vertical-align:middle">📚 ${state.trainingDaysLeft}d</span>`;
      } else {
        bizNameEl.textContent = state.businessName;
      }
    }

    this._updateSkillBar(state);
    this._updateDailyGoals(state);
  }

  _updateDailyGoals(state) {
    const el = document.getElementById('hud-daily-goals');
    if (!el || !state.dailyGoals?.goals) return;
    el.innerHTML = state.dailyGoals.goals.map(g => {
      const done = g.current >= g.target;
      return `<div style="display:flex;align-items:center;gap:4px;font-size:10px;padding:2px 7px;border-radius:10px;font-weight:600;letter-spacing:.02em;
        background:${done ? 'rgba(80,224,88,0.15)' : 'rgba(255,255,255,0.06)'};
        border:1px solid ${done ? 'rgba(80,224,88,0.35)' : 'rgba(255,255,255,0.1)'};
        color:${done ? '#50e058' : 'var(--text-muted)'}">
        ${done ? '✓' : `${g.current}/${g.target}`}&thinsp;<span style="font-weight:400">${g.label}</span>
      </div>`;
    }).join('');
  }

  _updateSkillBar(state) {
    const bar = this.el.skillBar;
    if (!bar) return;
    const quickSkills = ['cold_approach', 'situation_questions', 'value_proposition', 'active_listening', 'implication_questions'];
    bar.innerHTML = '';
    quickSkills.forEach((skillId, i) => {
      const unlocked = state.unlockedSkills.includes(skillId);
      const slot = document.createElement('div');
      slot.className = `skill-slot ${unlocked ? 'active' : 'locked'}`;
      const icons = { cold_approach:'🚪', situation_questions:'🔍', value_proposition:'📢', active_listening:'👂', implication_questions:'🌊' };
      slot.innerHTML = `${icons[skillId] || '?'}<span class="hotkey">${i+1}</span>`;
      slot.title = skillId.replace(/_/g, ' ');
      bar.appendChild(slot);
    });
  }

  showSurvivalBanner(active) {
    if (this.el.survivalBanner) {
      if (active) {
        this.el.survivalBanner.textContent = '⚡ SURVIVAL MODE — Cash flow critical. Close a deal this week or your overhead will wipe you out.';
        this.el.survivalBanner.classList.add('active');
      } else {
        this.el.survivalBanner.classList.remove('active');
      }
    }
  }

  // ── Encounter Screens ──────────────────────────────────────
  // ── Approach Choice: Sell vs Buy ───────────────────────────
  showApproachChoice(business, state, { canSell, services, onSell, onBuy }) {
    this._activeEncounterBiz = business;
    this.showScreen('encounter');
    const arena = document.getElementById('encounter-arena');
    if (!arena) return;

    const cash = state.cash || 0;
    const alreadyOwned = (svcId) => state.vendors?.some(v => v.bizId === business.id && v.serviceId === svcId);

    const servicesHTML = services.map(svc => {
      const owned = alreadyOwned(svc.id);
      const canAfford = cash >= svc.cost;
      const locked = owned && svc.oneTime;
      return `
        <div style="display:flex;align-items:flex-start;gap:var(--s3);padding:var(--s3) var(--s4);
                    background:${locked ? 'rgba(255,255,255,0.03)' : 'var(--surface)'};
                    border:1px solid ${locked ? 'var(--border)' : 'rgba(155,114,248,0.25)'};
                    border-radius:var(--r-md);margin-bottom:var(--s2);opacity:${locked ? '.5' : '1'}">
          <div style="font-size:1.4rem;flex-shrink:0">${svc.icon}</div>
          <div style="flex:1;min-width:0">
            <div style="font-weight:700;font-size:var(--text-sm);color:var(--text)">${svc.name}</div>
            <div style="font-size:var(--text-xs);color:var(--text-muted);margin:2px 0 6px">${svc.effectDesc}</div>
            <div style="display:flex;align-items:center;gap:var(--s3);flex-wrap:wrap">
              <span style="font-size:var(--text-xs);font-weight:700;color:${canAfford && !locked ? 'var(--sage)' : 'var(--crimson)'}">
                $${svc.cost.toLocaleString()}${svc.oneTime ? ' one-time' : '/mo'}
              </span>
              <span style="font-size:var(--text-xs);color:var(--text-muted)">
                🤝 Referral rate: ${Math.round(svc.referralRate * 100)}%/mo
              </span>
              ${owned ? '<span style="font-size:var(--text-xs);color:var(--violet)">✓ Active</span>' : ''}
            </div>
          </div>
          <button class="btn btn-primary btn-buy-svc"
                  data-svc-id="${svc.id}"
                  style="flex-shrink:0;font-size:var(--text-xs);padding:var(--s2) var(--s3);white-space:nowrap"
                  ${locked || !canAfford ? 'disabled' : ''}>
            ${locked ? 'Owned' : !canAfford ? 'No Cash' : 'Buy'}
          </button>
        </div>
      `;
    }).join('');

    arena.innerHTML = `
      <div class="encounter-header">
        <div class="prospect-info">
          <div class="prospect-avatar">${business.icon}</div>
          <div>
            <div class="prospect-name">${business.name}</div>
            <div class="prospect-title">${business.owner} · ${business.type}</div>
          </div>
        </div>
        <div style="font-size:var(--text-xs);color:var(--text-muted);text-align:right">
          Cash: <strong style="color:var(--sage)">$${cash.toLocaleString()}</strong>
        </div>
      </div>
      <div id="encounter-body">
        <div class="dialogue-box" style="margin-bottom:var(--s4)">
          <div class="dialogue-speaker">${business.owner}</div>
          <div class="dialogue-text">“Hey, what brings you in? You here to pitch me something, or are you looking for what we offer?”</div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--s3);margin-bottom:var(--s4)">
          <button class="btn ${canSell ? 'btn-primary' : 'btn-secondary'}" id="btn-approach-sell"
                  ${!canSell ? 'disabled' : ''}
                  style="padding:var(--s4);font-size:var(--text-sm);display:flex;flex-direction:column;gap:4px;height:auto;text-align:left">
            <span style="font-size:1.2rem">💼</span>
            <strong>Sell to Them</strong>
            <span style="font-size:var(--text-xs);font-weight:400;color:${canSell ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)'}">
              ${canSell ? 'Start a discovery encounter' : '✓ Already a client'}
            </span>
          </button>
          <button class="btn btn-secondary" id="btn-approach-buy"
                  style="padding:var(--s4);font-size:var(--text-sm);display:flex;flex-direction:column;gap:4px;height:auto;text-align:left;border-color:rgba(155,114,248,0.4)">
            <span style="font-size:1.2rem">🛒</span>
            <strong>Buy from Them</strong>
            <span style="font-size:var(--text-xs);font-weight:400;color:var(--text-muted)">Become a client, get referrals</span>
          </button>
        </div>

        <div id="vendor-services-panel" style="display:none">
          <div style="font-size:var(--text-xs);text-transform:uppercase;letter-spacing:.08em;
                      color:var(--text-muted);margin-bottom:var(--s3)">
            Services from ${business.name}
          </div>
          ${servicesHTML}
        </div>

        <div style="margin-top:var(--s3);text-align:center">
          <button class="btn btn-secondary btn-sm" id="btn-approach-leave"
                  style="font-size:var(--text-xs);padding:var(--s2) var(--s4)">Leave</button>
        </div>
      </div>
    `;

    // Sell button
    document.getElementById('btn-approach-sell')?.addEventListener('click', () => {
      try { onSell(); } catch(e) { console.error('[BizAmpire] onSell error:', e); }
    });

    // Buy button — toggle the services panel
    const svcPanel = document.getElementById('vendor-services-panel');
    document.getElementById('btn-approach-buy')?.addEventListener('click', () => {
      if (svcPanel) svcPanel.style.display = svcPanel.style.display === 'none' ? 'block' : 'none';
    });

    // Individual service purchase buttons
    arena.querySelectorAll('.btn-buy-svc').forEach(btn => {
      btn.addEventListener('click', () => {
        try { onBuy(btn.dataset.svcId); } catch(e) { console.error('[BizAmpire] onBuy error:', e); }
      });
    });

    // Leave
    document.getElementById('btn-approach-leave')?.addEventListener('click', () => this.closeEncounter());
  }

  showEncounter(business, state) {
    this._activeEncounterBiz = business;
    const enc = state.currentEncounter;
    this.showScreen('encounter');
    const arena = document.getElementById('encounter-arena');
    if (!arena) return;

    arena.innerHTML = this._renderEncounterHeader(business, enc) + `
      <div id="encounter-body"></div>
    `;

    // Score 0 = hard block — not your market at all
    const fitScore = enc.stateFlags?.fitScore ?? 2;
    const fitDialogue = enc.stateFlags?.fitDialogue;
    if (fitScore === 0 && fitDialogue) {
      this._showFitBlock(business, fitDialogue);
      return;
    }

    // Score 1 = possible fit — show warning then proceed to recon
    if (fitScore === 1 && fitDialogue) {
      this._showFitWarning(business, fitDialogue, state);
      return;
    }

    this.showReconPanel(business);
  }

  _showFitBlock(biz, fitDialogue) {
    const body = document.getElementById('encounter-body');
    if (!body) return;
    body.innerHTML = `
      <div class="dialogue-box" style="border-color:var(--crimson);background:rgba(200,64,48,0.08)">
        <div class="dialogue-speaker" style="color:var(--crimson)">${biz.owner} — Not Your Market</div>
        <div class="dialogue-text">"${fitDialogue.npc_line}"</div>
        <div class="dialogue-sub" style="color:var(--crimson);font-style:italic;margin-top:var(--s2)">
          ${fitDialogue.player_thought}
        </div>
      </div>
      <div style="padding:var(--s4);background:rgba(200,64,48,0.06);border:1px solid rgba(200,64,48,0.25);border-radius:var(--r-lg);font-size:var(--text-sm);color:var(--text-muted);line-height:1.6">
        💡 <strong style="color:var(--text)">ICP insight:</strong> This prospect isn't a realistic buyer for your service. In real sales, protecting your time by qualifying out bad-fit prospects is a <em>skill</em> — not a failure.
      </div>
      <button class="btn btn-secondary" id="btn-exit-encounter" style="margin-top:var(--s3)">← Walk Away (smart move)</button>
    `;
    document.getElementById('btn-exit-encounter')?.addEventListener('click', () => {
      this.closeEncounter();
    });
  }

  _showFitWarning(biz, fitDialogue, state) {
    const body = document.getElementById('encounter-body');
    if (!body) return;
    body.innerHTML = `
      <div class="dialogue-box" style="border-color:var(--amber);background:rgba(212,168,64,0.06)">
        <div class="dialogue-speaker" style="color:var(--amber)">${biz.owner} — Possible Fit</div>
        <div class="dialogue-text">"${fitDialogue.npc_line}"</div>
        <div class="dialogue-sub" style="color:var(--amber);font-style:italic;margin-top:var(--s2)">
          ${fitDialogue.player_thought}
        </div>
      </div>
      <div style="padding:var(--s4);background:rgba(212,168,64,0.06);border:1px solid rgba(212,168,64,0.25);border-radius:var(--r-lg);font-size:var(--text-sm);color:var(--text-muted);line-height:1.6">
        ⚠️ <strong style="color:var(--text)">Weak ICP match</strong> — you can try, but this isn't your ideal buyer. Starting at <span style="color:var(--crimson)">-1 Rapport</span> and the conversation will be an uphill battle.
      </div>
      <div style="display:flex;gap:var(--s3);margin-top:var(--s3);flex-wrap:wrap">
        <button class="btn btn-secondary" style="flex:1;min-width:140px" id="btn-exit-encounter">← Walk Away</button>
        <button class="btn btn-primary" style="flex:1;min-width:180px" id="btn-proceed-anyway">Try Anyway (risky) →</button>
      </div>
    `;
    document.getElementById('btn-exit-encounter')?.addEventListener('click', () => {
      this.closeEncounter();
    });
    document.getElementById('btn-proceed-anyway')?.addEventListener('click', () => {
      this.showReconPanel(biz);
    });
  }

  _renderEncounterHeader(biz, enc) {
    const phases = Object.keys(ENCOUNTER_PHASES);
    const currentPhaseIdx = phases.indexOf(enc.phase) || 0;
    const fitScore = enc.stateFlags?.fitScore ?? 2;
    const fitBadge = [
      { label: 'No Fit',      color: 'var(--crimson)', bg: 'rgba(200,64,48,0.12)' },
      { label: 'Weak Fit',    color: 'var(--amber)',   bg: 'rgba(212,168,64,0.12)' },
      { label: 'Good Fit',    color: 'var(--sage)',    bg: 'rgba(72,138,48,0.12)' },
      { label: 'Perfect ICP', color: 'var(--sage)',    bg: 'rgba(72,138,48,0.18)' },
    ][fitScore] || { label: 'Good Fit', color: 'var(--sage)', bg: 'rgba(72,138,48,0.12)' };

    return `
      <div class="encounter-header">
        <div class="prospect-info">
          <div class="prospect-avatar ${biz.warmth >= 3 ? 'advocate' : biz.warmth >= 2 ? 'warm' : ''}">${biz.icon}</div>
          <div>
            <div class="prospect-name">${biz.owner}</div>
            <div class="prospect-title">${biz.ownerTitle} · ${biz.name}</div>
            <div style="margin-top:2px">
              <span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:${fitBadge.color};background:${fitBadge.bg};padding:1px 6px;border-radius:3px">${fitBadge.label}</span>
            </div>
          </div>
        </div>
        <div class="phase-track">
          ${phases.map((p, i) => `
            <div class="phase-dot ${i < currentPhaseIdx ? 'done' : i === currentPhaseIdx ? 'active' : ''}"></div>
            <span class="phase-label ${i === currentPhaseIdx ? 'active' : ''}" style="font-size:10px">${ENCOUNTER_PHASES[p].label}</span>
          `).join('')}
        </div>
        <div class="warmth-display">
          <span class="warmth-label">Warmth</span>
          <div class="warmth-pips">
            ${[0,1,2,3].map(i => `<div class="warmth-pip ${i < biz.warmth ? (biz.warmth >= 3 ? 'warm' : 'filled') : ''}"></div>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  showReconPanel(business) {
    const body = document.getElementById('encounter-body');
    if (!body) return;

    body.innerHTML = `
      <div class="recon-panel">
        <div class="recon-title">📋 Market Research — Optional</div>
        <div style="font-size:var(--text-sm);color:var(--text-muted);line-height:1.6;margin-bottom:var(--s3);">
          Spend 2 minutes reviewing what you know about ${business.name} before approaching. Recon adds +1 Rapport to your opener.
        </div>
        <div class="recon-intel">
          <div class="intel-item">
            <div class="intel-key">Business Type</div>
            <div class="intel-value">${business.type}</div>
          </div>
          <div class="intel-item">
            <div class="intel-key">Company Size</div>
            <div class="intel-value">${business.size}</div>
          </div>
          <div class="intel-item">
            <div class="intel-key">Decision Maker</div>
            <div class="intel-value">${business.owner}, ${business.ownerTitle}</div>
          </div>
          <div class="intel-item">
            <div class="intel-key">Current Vendor</div>
            <div class="intel-value">${business.currentVendor}</div>
          </div>
          <div class="intel-item">
            <div class="intel-key">Budget Range</div>
            <div class="intel-value">$${business.budget[0].toLocaleString()}–$${business.budget[1].toLocaleString()}</div>
          </div>
          <div class="intel-item">
            <div class="intel-key">Decision Timeline</div>
            <div class="intel-value">${business.decisionTimeline}</div>
          </div>
        </div>
        <div style="padding:var(--s3) var(--s4);background:rgba(155,114,248,0.06);border:1px solid rgba(155,114,248,0.2);border-radius:var(--r-md);font-size:var(--text-sm);font-style:italic;color:var(--text-muted);margin-top:var(--s2);">
          "The best salespeople know more about the customer's business than the customer." — Challenger Sale
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:var(--s3);margin-top:var(--s4);">
          <button class="btn btn-primary" id="btn-complete-recon" style="flex:1;min-width:180px">✓ Brief Complete — +1 Rapport</button>
          <button class="btn btn-secondary" id="btn-skip-recon" style="flex:1;min-width:140px">Skip Recon</button>
        </div>
      </div>
    `;

    document.getElementById('btn-complete-recon')?.addEventListener('click', () => {
      this.encounterEngine.completeRecon();
    });
    document.getElementById('btn-skip-recon')?.addEventListener('click', () => {
      this.encounterEngine.skipRecon();
    });
  }

  showOpenerPhase(enc, state) {
    this._refreshEncounterHeader(enc);
    const body = document.getElementById('encounter-body');
    if (!body) return;
    const biz = enc.business;
    const isWarm = biz.warmth >= 2;
    const isAdv  = biz.warmth >= 3;

    const coldOpeners = [
      `"${biz.owner} glances up from their desk. 'Yeah? Can I help you with something?'"`,
      `"[busy, doesn't look up immediately] 'Give me one sec... OK. What is it?'"`,
      `"'Hi — do you have an appointment, or...?'"`,
      `"[cautious] 'I don't recognize you. Are you selling something?'"`,
    ];
    const familiarOpeners = [
      `"Oh, hey. I've seen you around the district before, right? What's up?"`,
      `"[nods] 'Hey — come in. What can I do for you?'"`,
      `"'Yeah, I know your name. What are you working on these days?'"`,
    ];
    const warmOpeners = [
      `"${biz.owner} waves you over. 'Hey! Good to see you. Come in, sit down.'"`,
      `"'Perfect timing — I was just thinking about you. What's going on?'"`,
      `"'Always good when you stop by. What's the update?'"`,
    ];
    const advOpeners = [
      `"${biz.owner} stands up to greet you. 'I was hoping you'd come by. We need to talk.'"`,
      `"'Perfect — grab a coffee. I've been wanting to pick your brain on something.'"`,
    ];

    const warmthPool = isAdv ? advOpeners : isWarm ? warmOpeners : biz.warmth >= 1 ? familiarOpeners : coldOpeners;
    const nameHash = (biz.name || '').split('').reduce((h, c) => h + c.charCodeAt(0), 0);
    const npcLine = warmthPool[nameHash % warmthPool.length];

    const rapportDisplay = enc.rapport > 0
      ? `<div class="dialogue-sub" style="color:var(--sage)">+${enc.rapport.toFixed(1)} Rapport from market research</div>`
      : '';

    body.innerHTML = `
      <div class="dialogue-box" style="margin-bottom:var(--s4)">
        <div class="dialogue-speaker">${biz.owner} — ${biz.ownerTitle}</div>
        <div class="dialogue-text" style="font-style:italic">${npcLine}</div>
        ${rapportDisplay}
      </div>
      <div style="font-size:var(--text-xs);color:var(--text-muted);padding:var(--s2) 0 var(--s3);text-transform:uppercase;letter-spacing:.08em">What do you say?</div>
      <div class="choices" id="choices-container">
        ${this._renderOpenerChoices(biz, state)}
      </div>
      <div style="margin-top:var(--s3)">
        ${this._hintButtonHTML('opener', state)}
      </div>
      <div style="margin-top:var(--s3);text-align:right">
        <button class="btn btn-secondary btn-sm" id="btn-exit-encounter" style="padding:var(--s2) var(--s4);font-size:var(--text-xs)">✕ Leave</button>
      </div>
    `;

    body.querySelectorAll('.choice-btn[data-opener]').forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          const choice = JSON.parse(btn.dataset.choice || '{}');
          if (!this.encounterEngine) return;
          this.encounterEngine.handleOpener(choice);
        } catch(e) { console.error('[BizAmpire] opener click error:', e); }
      });
    });
    this._attachHintButton('opener', enc, state, { phase: 'opener' });
    document.getElementById('btn-exit-encounter')?.addEventListener('click', () => this.closeEncounter());
  }

  _renderOpenerChoices(biz, state) {
    const warmthLabel = ['cold','familiar','warm','advocate'][biz.warmth] || 'cold';
    const serviceLabels = {
      it: 'IT & managed services', marketing: 'marketing & lead generation',
      finance: 'accounting & financial advisory', law: 'legal services',
      construction: 'construction & renovations', auto: 'auto & fleet services',
      realestate: 'real estate & property management', health: 'healthcare services',
      consulting: 'operations consulting',
    };
    const _indId = state.businessIndustry?.id || state.businessIndustry;
    const painSnippet = (() => {
      const pain = biz.pain || '';
      const sentenceMatch = pain.match(/^[^.!?]+[.!?]/);
      const sentence = sentenceMatch ? sentenceMatch[0].replace(/[.!?]+$/, '') : pain.split(' ').slice(0, 8).join(' ');
      return sentence.trim();
    })();
    const choices = [
      { text: `"Hi, I'm ${state.businessName} — we provide ${serviceLabels[_indId] || 'business services'} to businesses in this area. Do you have 2 minutes?"`, rapport: 0, technique: null, badge: null, requiresSkill: null },
      { text: `"I work with ${pluralize(biz.type)} specifically on ${painSnippet}. I've helped a few businesses in this district with exactly that — mind if I ask one quick question?"`, rapport: 1, technique: 'Pattern Interrupt', badge: null, requiresSkill: 'pattern_interrupt' },
      { text: `"Quick question — when it comes to ${serviceLabels[_indId] || 'what we do'}, what's your biggest frustration right now with how you're handling it?"`, rapport: biz.warmth >= 1 ? 2 : 0, technique: 'Direct Discovery', badge: warmthLabel !== 'cold' ? 'Relationship Capital' : null, requiresSkill: null },
    ];
    // Shuffle display order so button position doesn't telegraph quality
    const order = [0, 1, 2];
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order.map((ci, displayIdx) => {
      const c = choices[ci];
      const locked = c.requiresSkill && !state.unlockedSkills.includes(c.requiresSkill);
      const badgeHtml = '';
      const lockedHtml = locked ? `<span class="choice-badge" style="color:var(--text-muted);background:var(--surface)">🔒 Needs ${c.requiresSkill.replace(/_/g,' ')}</span>` : '';
      return `<button class="choice-btn ${locked ? 'locked' : ''}" data-opener="${ci}" data-choice="${JSON.stringify({rapport: c.rapport, technique: c.technique, text: c.text}).replace(/"/g,'&quot;')}" ${locked ? 'disabled' : ''}><span class="choice-key">${displayIdx+1}</span><div class="choice-body"><span class="choice-text">${c.text}</span>${badgeHtml}${lockedHtml}</div></button>`;
    }).join('');
  }

  showOpenerReaction(enc, chosenText, openerQuality, rapportDelta, technique, nextCallback) {
    this._refreshEncounterHeader(enc);
    const body = document.getElementById('encounter-body');
    if (!body) return;
    const biz = enc.business;
    const reactions = {
      warm: [
        `"[nods slowly] OK — yeah, that's actually relevant. Tell me more."`,
        `"[leaning in] Alright, you've got my attention. What are you thinking?"`,
        `"That's... a pretty specific point. I'm listening."`,
        `"[impressed] Not the usual pitch. OK — go on."`,
      ],
      cold_direct: [
        `"[caught off guard] That's... pretty forward. We just met."`,
        `"Huh. OK — why do you ask?"`,
        `"[slightly defensive] I mean, there's always something. Who are you again?"`,
        `"[pauses] That's a different kind of question. What are you getting at?"`,
      ],
      cold_pattern: [
        `"[looks up] Wait — how do you know about that?"`,
        `"[interested despite themselves] That's actually specific. Go on."`,
        `"Hmm. That's not the usual intro. OK, I'm listening."`,
        `"[raises an eyebrow] You've done some homework. Keep going."`,
      ],
      cold: [
        `"[noncommittal] OK... look, I'm pretty busy right now."`,
        `"[glances at watch] I've got about two minutes."`,
        `"Mm. Sure. I'll hear you out — make it quick."`,
        `"[skeptical] We get a lot of people come in here. What makes you different?"`,
      ],
    };
    const pool = openerQuality === 'warm' ? reactions.warm
      : technique === 'Direct Discovery' ? reactions.cold_direct
      : technique === 'Pattern Interrupt' ? reactions.cold_pattern
      : reactions.cold;
    const nameHash = (biz.name || '').split('').reduce((h, c) => h + c.charCodeAt(0), 0);
    const reactionLine = pool[(nameHash + Math.round(enc.rapport * 3)) % pool.length];
    const delta = rapportDelta ?? 0;
    const rapportColor = delta > 0 ? 'var(--sage)' : delta < 0 ? 'var(--crimson)' : 'var(--text-muted)';
    const rapportLabel = delta > 0 ? `+${delta.toFixed(1)} Rapport` : delta < 0 ? `${delta.toFixed(1)} Rapport` : '±0 Rapport';
    body.innerHTML = `
      <div class="dialogue-box player-dialogue" style="background:rgba(79,152,163,0.08);border-color:var(--teal,#4f98a3);margin-bottom:var(--s3)">
        <div class="dialogue-speaker" style="color:var(--teal,#4f98a3)">You said</div>
        <div class="dialogue-text">${chosenText}</div>
      </div>
      <div class="dialogue-box" style="margin-bottom:var(--s3)">
        <div class="dialogue-speaker">${biz.owner} — ${biz.ownerTitle}</div>
        <div class="dialogue-text" style="font-style:italic">${reactionLine}</div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:var(--r-md);padding:var(--s3) var(--s4);margin-bottom:var(--s4)">
        <div style="font-size:var(--text-xs);color:var(--text-muted)">${openerQuality === 'warm' ? "✓ Strong opener — they're engaged" : "~ Opener landed cold — you're in, but on thin ice"}</div>
        <div style="font-size:var(--text-sm);font-weight:700;color:${rapportColor}">${rapportLabel}</div>
      </div>
      <button class="btn btn-primary" id="btn-proceed-discovery" style="width:100%">Start Discovery →</button>
      <div style="margin-top:var(--s3);text-align:right">
        <button class="btn btn-secondary btn-sm" id="btn-exit-opener" style="padding:var(--s2) var(--s4);font-size:var(--text-xs)">Leave</button>
      </div>
    `;
    document.getElementById('btn-proceed-discovery')?.addEventListener('click', () => nextCallback(), { once: true });
    document.getElementById('btn-exit-opener')?.addEventListener('click', () => this.closeEncounter(), { once: true });
  }

  showDiscoveryPhase(enc, state) {
    this._refreshEncounterHeader(enc);
    this.showNextDiscoveryQuestion(enc, state, 0);
  }

  // ── Template substitution for question bank placeholders ──
  _subQText(text, biz) {
    if (!text || !biz) return text || '';
    const pain = biz.pain || 'your core challenge';
    const budget0 = Array.isArray(biz.budget) ? biz.budget[0] : 2000;
    const impliedCost = '$' + Math.round(budget0 * 0.4).toLocaleString() + '/month';
    const impliedRevenueLoss = '$' + Math.round(budget0 * 2.5).toLocaleString();
    const outcome = 'a scalable, consistent system that compounds over time';
    const painCategory = biz.painCategory || biz.type || 'your industry';
    return text
      .replace(/{pain}/g, pain)
      .replace(/{impliedCost}/g, impliedCost)
      .replace(/{impliedRevenueLoss}/g, impliedRevenueLoss)
      .replace(/{outcome}/g, outcome)
      .replace(/{painCategory}/g, painCategory)
      .replace(/{bizName}/g, biz.name || 'your business')
      .replace(/{bizType}/g, biz.type || 'business')
      .replace(/{owner}/g, biz.owner || 'the owner');
  }

  showNextDiscoveryQuestion(enc, state, questionIdx) {
    this._refreshEncounterHeader(enc);
    const body = document.getElementById('encounter-body');
    if (!body) return;

    const questions = enc.stateFlags?.generatedQuestions || DISCOVERY_QUESTIONS;
    const q = questions[questionIdx];
    if (!q) {
      if (window.__bizampireEngine) window.__bizampireEngine.encounterEngine?.handleDiscovery('_advance', 'good');
      return;
    }

    const biz = enc.business;
    const hasSkill = state.unlockedSkills.includes(q.skillTag);
    const totalQ = questions.length;
    const progress = questionIdx + 1;

    // ── NPC opening lines — what they say before the player picks a question ──
    // Keyed by SPIN phase. These set the scene the player must probe into.
    const npcOpeners = {
      situation: [
        `"Yeah, things are moving along. Always something going on, you know?"`,
        `"We've been at this for a few years now — kind of figured most things out as we went."`,
        `"Honestly, not too bad. Running a little busy, but that's normal for us."`,
        `"I mean, it depends on the week. Some weeks are great, some are... less great."`,
        `"We get by. Built this thing from scratch, so we know every corner of it."`,
      ],
      problem: [
        `"[shifts slightly] There's always something — I don't want to complain, but yeah."`,
        `"I mean, nothing that's stopped us. But there are things I'd fix if I could."`,
        `"[quieter] Between you and me, there are a couple of things that keep coming up."`,
        `"It's not a crisis or anything, but yeah — there's friction in certain spots."`,
        `"Look, every business has its headaches. We're no different."`,
      ],
      implication: [
        `"[pauses] I guess I never really sat down and added up what it actually costs."`,
        `"Yeah, it's one of those things where you just... accept it as part of doing business."`,
        `"I know it's not ideal. But we've been running like this for a while, so..."`,
        `"[distracted] Sorry — yeah. It's just the kind of thing that always gets pushed to next quarter."`,
        `"The margins are tighter than I'd like. A lot of things eat into them."`,
      ],
      need_payoff: [
        `"[leans back] OK, I'm listening. But I've heard a lot of pitches."`,
        `"[arms crossed] What exactly are you proposing here?"`,
        `"[softening] Alright — if this is actually going to help, tell me what it looks like."`,
        `"I'm not going to commit to anything today. But I'll hear you out."`,
        `"[checks time] I've got a few minutes. What's the actual point?"`,
      ],
    };

    // ── Deflection lines — the weak "bad" choice the player might fall back to ──
    // These represent dropping out of SPIN and pitching/deflecting instead.
    const deflections = {
      situation: [
        `"Sounds good — can I leave you some information about what we offer?"`,
        `"Great, well — we work with a lot of businesses like yours. We'd love to help."`,
        `"Perfect. We have a few packages that might be a good fit."`,
      ],
      problem: [
        `"Totally understandable. We actually have something that could help with that."`,
        `"Yeah, we see that a lot. We can fix it pretty quickly."`,
        `"We handle situations like that all the time. Want to hear about our pricing?"`,
      ],
      implication: [
        `"Yeah, it adds up. We're actually pretty affordable compared to alternatives."`,
        `"Totally. Well, we can take that off your plate — want to talk about what that looks like?"`,
        `"Right, that's why a lot of people come to us. We keep it simple."`,
      ],
      need_payoff: [
        `"Exactly — so here's our pricing, and we can get started pretty quickly."`,
        `"Yeah, so if you want, I can send over a proposal and we can go from there."`,
        `"Great — so the next step would be signing the agreement. Pretty straightforward."`,
      ],
    };

    const phaseOpeners = npcOpeners[q.phase] || npcOpeners.situation;
    const phaseDeflections = deflections[q.phase] || deflections.situation;

    // Vary opener by position within the conversation so it doesn't always feel like Q1
    const npcLine = phaseOpeners[(questionIdx * 3 + Math.floor(enc.rapport)) % phaseOpeners.length];
    // Use the question's own badResponse — it's specific to this question vs a generic deflection
    const deflectionLine = q.badResponse || phaseDeflections[questionIdx % phaseDeflections.length];

    // Progress indicator label
    const phaseLabel = { situation: 'Situation', problem: 'Problem', implication: 'Implication', need_payoff: 'Need-Payoff' }[q.phase] || q.phase;
    const phaseCounts = enc.stateFlags?.phaseCounts || {};
    const phaseBudget = enc.stateFlags?.phaseBudget || { situation: 2, problem: 2, implication: 1, need_payoff: 1 };
    const phaseUsed = (phaseCounts[q.phase] || 0) + 1;
    const phaseMax = phaseBudget[q.phase] || 2;

    body.innerHTML = `
      <div style="font-size:var(--text-xs);color:var(--text-muted);padding-bottom:var(--s2);text-transform:uppercase;letter-spacing:.08em;display:flex;justify-content:space-between;align-items:center">
        <span>📍 ${phaseLabel} ${phaseUsed}/${phaseMax} · Q${progress}/${totalQ}</span>
        <span>Rapport: <strong style="color:${enc.rapport >= 3 ? 'var(--sage)' : enc.rapport >= 1 ? 'var(--amber)' : 'var(--text)'}">${enc.rapport.toFixed(1)}</strong></span>
      </div>

      <!-- NPC SPEAKS FIRST -->
      <div class="dialogue-box" style="margin-bottom:var(--s4)">
        <div class="dialogue-speaker">${biz.owner} — ${biz.ownerTitle}</div>
        <div class="dialogue-text" style="font-style:italic">${npcLine}</div>
      </div>

      <!-- PLAYER PICKS WHAT TO ASK -->
      <div style="font-size:var(--text-xs);color:var(--text-muted);padding:var(--s2) 0 var(--s3);text-transform:uppercase;letter-spacing:.08em">
        What do you ask next?
      </div>
      <div class="choices">
        <button class="choice-btn technique" data-response="good" data-qid="${q.skillTag}">
          <span class="choice-key">1</span>
          <div class="choice-body">
            <span class="choice-text">${this._subQText(q.question, biz)}</span>
          </div>
        </button>
        <button class="choice-btn" data-response="bad" data-qid="${q.skillTag}">
          <span class="choice-key">2</span>
          <div class="choice-body">
            <span class="choice-text">${deflectionLine}</span>
          </div>
        </button>
      </div>

      <div style="margin-top:var(--s3)">
        ${this._hintButtonHTML('discovery_' + q.phase, state)}
      </div>
      <div style="margin-top:var(--s3);text-align:right">
        <button class="btn btn-secondary btn-sm" id="btn-exit-encounter" style="padding:var(--s2) var(--s4);font-size:var(--text-xs)">Leave</button>
      </div>
    `;

    body.querySelectorAll('.choice-btn[data-response]').forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          if (!this.encounterEngine) { console.error('[BizAmpire] encounterEngine not set on UI'); return; }
          this.encounterEngine.handleDiscovery(btn.dataset.qid, btn.dataset.response);
        } catch(e) { console.error('[BizAmpire] discovery click error:', e); }
      });
    });

    this._attachHintButton('discovery_' + q.phase, enc, state, { phase: 'discovery', subPhase: q.phase });
    document.getElementById('btn-exit-encounter')?.addEventListener('click', () => {
      this.closeEncounter();
    });
  }

  // ── Reaction beat shown AFTER player picks a response, BEFORE next question ──
  showDiscoveryReaction(enc, state, q, responseType, nextCallback) {
    this._refreshEncounterHeader(enc);
    const body = document.getElementById('encounter-body');
    if (!body) return;

    const biz = enc.business;
    const isGood = responseType === 'good';
    const isOk = responseType === 'ok';  // partial credit: no skill unlocked but good choice

    // In the new flow the player chose WHICH QUESTION TO ASK, not a follow-up.
    // Show the question they asked in the 'You said' bubble.
    // Good/ok = they asked the skilled SPIN question. Bad = they deflected.
    const deflectionFallbacks = {
      situation:   'Sounds good — can I leave you some information about what we offer?',
      problem:     'Totally understandable. We actually have something that could help with that.',
      implication: 'Yeah, it adds up. We’re actually pretty affordable compared to alternatives.',
      need_payoff: 'Exactly — so here’s our pricing, and we can get started pretty quickly.',
    };
    const chosenText = (isGood || isOk)
      ? q.question   // they asked the skilled SPIN question
      : (deflectionFallbacks[q.phase] || q.badResponse); // they deflected

    // Prospect reaction to what the player said — keyed to good/bad + phase
    // Situation = fact-finding, prospect answers/acknowledges the question naturally
    // Problem = surfacing pain, prospect recognizes the issue
    // Implication = amplifying consequence, prospect feels the weight
    // Need-Payoff = articulating value, prospect gets excited about the solution
    const reactions = {
      situation: {
        good: [
          `"[thinks] Yeah, good question. Honestly more complicated than it probably should be."`,
          `"[nods] Mm. That's something we've been dealing with actually."`,
          `"That's... actually something we're in the middle of sorting out right now."`,
          `"Good question — I don't think anyone's ever asked me that before."`,
        ],
        bad: [
          `"[looks away] Sure... do you have a brochure or something?"`,
          `"I'm not sure where you're going with this."`,
          `"[unimpressed] We get a lot of vendors in here. What makes you different?"`,
        ],
      },
      problem: {
        good: [
          `"[leans in] Yeah — that's exactly it. More than once this quarter."`,
          `"You know what, it's happened more than I want to admit."`,
          `"That's... actually a really good point. We haven't fixed it."`,
          `"[exhales] Yeah. That's been on my mind for a while."`,
        ],
        bad: [
          `"I mean, sure, but I don't know if it's that big a deal."`,
          `"[shrugs] We've managed so far."`,
          `"We handle it. It's fine."`,
        ],
      },
      implication: {
        good: [
          `"[pauses] When you put it that way... that number's bigger than I thought."`,
          `"Yeah. That's... a real cost we're not tracking."`,
          `"OK, that math actually concerns me."`,
          `"Hm. I hadn't thought about it that way — that's significant."`,
        ],
        bad: [
          `"I don't know if the numbers are quite that dramatic."`,
          `"[skeptical] Maybe. I'd have to think about it."`,
          `"We've been dealing with it this long, so..."`,
        ],
      },
      need_payoff: {
        good: [
          `"[sits up] Yeah. If you can actually deliver that, I want to hear more."`,
          `"That would genuinely change how we operate. Walk me through it."`,
          `"OK — I'm interested. What does that actually look like?"`,
          `"[leans forward] That's exactly what I'd want. How does it work?"`,
        ],
        bad: [
          `"[noncommittal] Yeah, maybe. Send me something and I'll take a look."`,
          `"I've heard that before. What makes you different?"`,
          `"[checks watch] Sure. I'll think about it."`,
        ],
      },
    };

    // 'ok' uses the good reaction pool (player said the right thing, just no skill boost)
    const reactionKey = (isGood || isOk) ? 'good' : 'bad';
    const pool = reactions[q.phase]?.[reactionKey] || reactions.situation[reactionKey];
    const reactionLine = pool[Math.floor(Math.random() * pool.length)];
    // Actual rapport credited: good = full, ok = partial (floor half), bad = rapportOnBad
    const rapportDelta = isGood ? (q.rapportOnGood || 0)
                       : isOk   ? Math.floor((q.rapportOnGood || 0) / 2)
                       :          (q.rapportOnBad || 0);
    const rapportColor = rapportDelta > 0 ? 'var(--sage)' : rapportDelta < 0 ? 'var(--crimson)' : 'var(--text-muted)';
    const rapportLabel = rapportDelta > 0 ? `+${rapportDelta} Rapport` : rapportDelta < 0 ? `${rapportDelta} Rapport` : 'No rapport change';

    body.innerHTML = `
      <!-- WHAT YOU SAID -->
      <div class="dialogue-box player-dialogue" style="background:rgba(79,152,163,0.08);border-color:var(--teal,#4f98a3);margin-bottom:var(--s3)">
        <div class="dialogue-speaker" style="color:var(--teal,#4f98a3)">You said</div>
        <div class="dialogue-text">${this._subQText(chosenText, biz)}</div>
      </div>

      <!-- HOW THEY REACTED -->
      <div class="dialogue-box" style="margin-bottom:var(--s3)">
        <div class="dialogue-speaker">${biz.owner} — ${biz.ownerTitle}</div>
        <div class="dialogue-text" style="font-style:italic">${reactionLine}</div>
      </div>

      <!-- EXPERT CONTINUATION — only on good/ok to show how the conversation flows forward -->
      ${(isGood || isOk) && q.goodResponse ? `
      <div class="dialogue-box player-dialogue" style="background:rgba(79,152,163,0.05);border-color:rgba(79,152,163,0.3);margin-bottom:var(--s3)">
        <div class="dialogue-speaker" style="color:var(--teal,#4f98a3)">You continued</div>
        <div class="dialogue-text" style="color:var(--text-muted)">${this._subQText(q.goodResponse, biz)}</div>
      </div>` : ''}

      <!-- RAPPORT RESULT -->
      <div style="display:flex;align-items:center;justify-content:space-between;
                  background:rgba(255,255,255,0.03);border:1px solid var(--border);
                  border-radius:var(--r-md);padding:var(--s3) var(--s4);margin-bottom:var(--s4)">
        <div style="font-size:var(--text-xs);color:var(--text-muted)">
          ${isGood ? '✓ Sharp question — ' + q.framework : isOk ? '~ Decent ask — unlock ' + q.skillTag.replace(/_/g,' ') + ' for full effect' : '⚠ Deflection — missed the ' + q.framework + ' moment'}
        </div>
        <div style="font-size:var(--text-sm);font-weight:700;color:${rapportColor}">${rapportLabel}</div>
      </div>

      <button class="btn btn-primary" id="btn-next-question" style="width:100%">
        ${nextCallback._isLast ? 'Move to Pitch →' : 'Continue →'}
      </button>
    `;

    document.getElementById('btn-next-question')?.addEventListener('click', () => {
      nextCallback();
    }, { once: true });
  }

  showCounterQuestion(enc, state, counterQ, onComplete) {
    this._refreshEncounterHeader(enc);
    const body = document.getElementById('encounter-body');
    if (!body) return;
    const biz = enc.business;
    body.innerHTML = `
      <div style="font-size:var(--text-xs);color:var(--crimson);padding-bottom:var(--s2);text-transform:uppercase;letter-spacing:.08em">
        ⚡ Prospect pushes back
      </div>
      <div class="dialogue-box" style="border-color:var(--crimson);background:rgba(200,64,48,0.05);margin-bottom:var(--s4)">
        <div class="dialogue-speaker" style="color:var(--crimson)">${biz.owner} — ${biz.ownerTitle}</div>
        <div class="dialogue-text" style="font-style:italic">"${counterQ.npc}"</div>
      </div>
      <div style="font-size:var(--text-xs);color:var(--text-muted);padding:var(--s2) 0 var(--s3);text-transform:uppercase;letter-spacing:.08em">How do you respond?</div>
      <div class="choices">
        ${(() => {
          const shuffled = [...counterQ.responses];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          return shuffled.map((r, i) => `<button class="choice-btn" data-cq-idx="${counterQ.responses.indexOf(r)}"><span class="choice-key">${i+1}</span><div class="choice-body"><span class="choice-text">${r.text}</span></div></button>`).join('');
        })()}
      </div>
    `;
    body.querySelectorAll('.choice-btn[data-cq-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const response = counterQ.responses[parseInt(btn.dataset.cqIdx)];
        if (!response) return;
        if (this.encounterEngine) this.encounterEngine.handleCounterQuestion(response, counterQ);
        // Show a brief reaction before continuing
        const rapportColor = response.rapport > 0 ? 'var(--sage)' : response.rapport < 0 ? 'var(--crimson)' : 'var(--text-muted)';
        const rapportLabel = response.rapport > 0 ? `+${response.rapport} Rapport` : response.rapport < 0 ? `${response.rapport} Rapport` : 'No change';
        body.innerHTML = `
          <div class="dialogue-box player-dialogue" style="background:rgba(79,152,163,0.08);border-color:var(--teal,#4f98a3);margin-bottom:var(--s3)">
            <div class="dialogue-speaker" style="color:var(--teal,#4f98a3)">You said</div>
            <div class="dialogue-text">${response.text}</div>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:var(--r-md);padding:var(--s3) var(--s4);margin-bottom:var(--s4)">
            <div style="font-size:var(--text-xs);color:var(--text-muted)">${response.quality === 'good' ? '✓ Good recovery — they respect the honesty' : '⚠ Deflection — they noticed'}</div>
            <div style="font-size:var(--text-sm);font-weight:700;color:${rapportColor}">${rapportLabel}</div>
          </div>
          <button class="btn btn-primary" id="btn-cq-continue" style="width:100%">Continue →</button>
        `;
        document.getElementById('btn-cq-continue')?.addEventListener('click', () => onComplete(), { once: true });
      }, { once: true });
    });
  }

  showPitchPhase(enc, state) {
    this._refreshEncounterHeader(enc);
    const body = document.getElementById('encounter-body');
    if (!body) return;

    const biz = enc.business;
    const hasValueStack = state.unlockedSkills.includes('value_stack');
    const hasChallenger = state.unlockedSkills.includes('challenger_insight');
    const businessName = state.businessName;
    const pitchServiceLabels = {
      it: 'IT & managed services', marketing: 'marketing services',
      finance: 'accounting & financial advisory', law: 'legal services',
      construction: 'construction services', auto: 'auto & fleet services',
      realestate: 'real estate & property management', health: 'healthcare services',
      consulting: 'operations consulting',
    };
    const _indId3 = state.businessIndustry?.id || state.businessIndustry;
    const pitchServiceLabel = pitchServiceLabels[_indId3] || state.businessDescription || 'services';

    body.innerHTML = `
      <div class="dialogue-box">
        <div class="dialogue-speaker">${biz.owner}</div>
        <div class="dialogue-text">"OK, you clearly understand our situation. So what exactly do you do — and why should I work with you?"</div>
        <div class="dialogue-sub">Rapport heading in: <strong style="color:${enc.rapport >= 4 ? 'var(--sage)' : 'var(--amber)'}">${enc.rapport.toFixed(1)}</strong> — ${enc.rapport >= 4 ? 'They\'re open. Lead with value.' : enc.rapport >= 2 ? 'Cautiously interested.' : 'Needs convincing.'}</div>
      </div>
      <div style="font-size:var(--text-xs);color:var(--text-muted);padding:var(--s2) 0;text-transform:uppercase;letter-spacing:.08em">Your pitch</div>
      <div class="choices">
        ${(() => {
          const pitchOptions = [
            { key: 'bad', text: `"We're ${businessName}. We provide ${pitchServiceLabel} to businesses like ${biz.name}. We've helped similar companies and our clients see real results."`, badge: `` },
            { key: 'good', text: `"Based on what you told me — ${biz.pain || 'your growth challenge'} — that's exactly the problem our ${pitchServiceLabel} solves. We don't just deliver a service; we deliver a specific outcome: ${state.businessDescription || 'measurable results that compound'}. That's what I'd like to explore with you."`, badge: `` },
            ...(hasChallenger
              ? [{ key: 'technique', text: `"Most ${pluralize(biz.type)} I work with think ${biz.pain?.split(' ').slice(0,5).join(' ')}... is the main problem. But in my experience delivering ${pitchServiceLabel}, what's really underneath it is a systems gap. Here's what the top performers in your space are doing differently."`, badge: `` }]
              : [{ key: 'technique', text: `"Most ${pluralize(biz.type)} I work with think ${biz.pain?.split(' ').slice(0,5).join(' ')}... is the main problem. But in my experience delivering ${pitchServiceLabel}, what's really underneath it is a systems gap. Here's what the top performers in your space are doing differently."`, badge: `<span class="choice-badge" style="color:var(--text-muted);background:var(--surface)">🔒 Requires Challenger Insight</span>`, locked: true }]),
          ];
          for (let i = pitchOptions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pitchOptions[i], pitchOptions[j]] = [pitchOptions[j], pitchOptions[i]];
          }
          return pitchOptions.map((p, i) => `<button class="choice-btn ${p.locked ? 'locked' : ''}" data-pitch="${p.key}" ${p.locked ? 'disabled' : ''}><span class="choice-key">${i+1}</span><div class="choice-body"><span class="choice-text">${p.text}</span>${p.badge}</div></button>`).join('');
        })()}
      </div>
      <div>${this._hintButtonHTML('pitch', state)}</div>
    `;

    body.querySelectorAll('.choice-btn[data-pitch]').forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          if (!this.encounterEngine) { console.error('[BizAmpire] encounterEngine not set'); return; }
          this.encounterEngine.handlePitch(btn.dataset.pitch);
        } catch(e) { console.error('[BizAmpire] pitch click error:', e); }
      });
    });
    this._attachHintButton('pitch', enc, state, { phase: 'pitch' });
  }

  showPricingPhase(enc, state) {
    this._refreshEncounterHeader(enc);
    const body = document.getElementById('encounter-body');
    if (!body) return;

    const biz = enc.business;
    const [min, max] = biz.budget;
    const midpoint = Math.round((min + max) / 2);
    const hasValueStack = state.unlockedSkills.includes('value_stack');
    const maxPossible = Math.round(max * (hasValueStack ? 1.5 : 1.2));

    body.innerHTML = `
      <div class="dialogue-box">
        <div class="dialogue-speaker">${biz.owner}</div>
        <div class="dialogue-text">"That sounds interesting. So... what are we looking at in terms of investment?"</div>
        <div class="dialogue-sub">${hasValueStack ? '💡 Value Stack unlocked — you can price 30% above market.' : 'Tip: Price signals value. Too cheap = quality concern.'}</div>
      </div>
      <div class="pricing-panel">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div class="pricing-label">💰 SET YOUR MONTHLY RATE</div>
          <div style="font-size:var(--text-xs);color:var(--text-muted)">${biz.decisionTimeline} timeline</div>
        </div>
        <div class="pricing-value" id="pricing-display">$${midpoint.toLocaleString()}/mo</div>
        <input type="range" class="pricing-range" id="pricing-slider"
          min="${Math.round(min * 0.5)}" max="${maxPossible}" step="50"
          value="${midpoint}">
        <div style="display:flex;justify-content:space-between;font-size:var(--text-xs);color:var(--text-muted)">
          <span>$${Math.round(min*0.5).toLocaleString()} (too cheap)</span>
          <span>$${max.toLocaleString()} (market max)</span>
          <span>$${maxPossible.toLocaleString()} (premium)</span>
        </div>
        <div class="pricing-feedback" id="pricing-feedback">Move the slider to set your rate...</div>
      </div>
      <button class="btn btn-primary" id="btn-confirm-price" style="margin-top:var(--s3)">Lock In This Rate →</button>
    `;

    const slider = document.getElementById('pricing-slider');
    const display = document.getElementById('pricing-display');
    slider?.addEventListener('input', () => {
      const val = parseInt(slider.value);
      display.textContent = `$${val.toLocaleString()}/mo`;
    });

    document.getElementById('btn-confirm-price')?.addEventListener('click', () => {
      try {
        const price = parseInt(slider?.value || midpoint);
        if (!this.encounterEngine) { console.error('[BizAmpire] encounterEngine not set'); return; }
        this.encounterEngine.handlePricing(price);
      } catch(e) { console.error('[BizAmpire] pricing click error:', e); }
    });
  }

  updatePricingFeedback(text, state) {
    const el = document.getElementById('pricing-feedback');
    if (el) {
      el.textContent = text;
      el.className = `pricing-feedback ${state}`;
    }
  }

  showObjectionPhase(enc, state) {
    this._refreshEncounterHeader(enc);
    if (enc.stateFlags.objections.length === 0) {
      this.encounterEngine._moveToClose();
      return;
    }
    this.showNextObjection(enc, state, enc.stateFlags.objections[0]);
  }

  showNextObjection(enc, state, objectionType) {
    this._refreshEncounterHeader(enc);
    const body = document.getElementById('encounter-body');
    if (!body) return;
    const biz = enc.business;
    const objSet = OBJECTION_LIBRARY[objectionType] || OBJECTION_LIBRARY['timing'];
    const objIdx = Math.floor(Math.random() * objSet.length);
    if (enc.stateFlags) enc.stateFlags.currentObjIdx = objIdx;
    if (this.encounterEngine) this.encounterEngine.flags.currentObjIdx = objIdx;
    const obj = objSet[objIdx];
    const objTypeLabel = objectionType.charAt(0).toUpperCase() + objectionType.slice(1);
    body.innerHTML = `
      <div style="font-size:var(--text-xs);color:var(--text-muted);padding-bottom:var(--s2);text-transform:uppercase;letter-spacing:.08em;display:flex;justify-content:space-between">
        <span>⚡ Objection — ${objTypeLabel}</span>
        <span>Rapport: <strong style="color:${enc.rapport >= 3 ? 'var(--sage)' : enc.rapport >= 1 ? 'var(--amber)' : 'var(--text)'}">${enc.rapport.toFixed(1)}</strong></span>
      </div>
      <div class="dialogue-box" style="border-color:var(--crimson);background:rgba(200,64,48,0.05);margin-bottom:var(--s4)">
        <div class="dialogue-speaker" style="color:var(--crimson)">${biz.owner} — ${biz.ownerTitle}</div>
        <div class="dialogue-text" style="font-style:italic">"${obj.objection}"</div>
      </div>
      <div style="font-size:var(--text-xs);color:var(--text-muted);padding:var(--s2) 0 var(--s3);text-transform:uppercase;letter-spacing:.08em">How do you respond?</div>
      <div class="choices">
        ${(() => {
          // Shuffle counter order so quality isn't telegraphed by position
          const entries = Object.entries(obj.counters);
          for (let i = entries.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [entries[i], entries[j]] = [entries[j], entries[i]];
          }
          return entries.map(([key, c], i) => {
            const locked = c.skillRequired && !state.unlockedSkills.includes(c.skillRequired);
            const frameworkBadge = (c.framework && state.unlockedSkills.includes(c.skillRequired || ''))
              ? '' : '';
            const lockedBadge = locked ? `<span class="choice-badge" style="color:var(--text-muted);background:var(--surface)">🔒 Requires ${c.skillRequired?.replace(/_/g,' ')}</span>` : '';
            return `<button class="choice-btn ${locked ? 'locked' : ''}" data-objection="${objectionType}" data-response="${key}" ${locked ? 'disabled' : ''}><span class="choice-key">${i+1}</span><div class="choice-body"><span class="choice-text">${c.text.replace('{impliedCost}', '$'+Math.round(biz.budget[0]*0.5).toLocaleString()+'/month').replace('{impliedAnnual}', '$'+(biz.budget[0]*0.5*12).toLocaleString()).replace('{price}', enc.stateFlags?.price ? '$'+enc.stateFlags.price.toLocaleString()+'/mo' : 'our fee')}</span>${frameworkBadge}${lockedBadge}</div></button>`;
          }).join('');
        })()}
      </div>
      <div>${this._hintButtonHTML('objection_' + objectionType, state)}</div>
    `;
    body.querySelectorAll('.choice-btn[data-objection]').forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          if (!this.encounterEngine) return;
          this.encounterEngine.handleObjection(btn.dataset.objection, btn.dataset.response);
        } catch(e) { console.error('[BizAmpire] objection click error:', e); }
      });
    });
    this._attachHintButton('objection_' + objectionType, enc, state, { phase: 'objections', objType: objectionType });
  }

  showObjectionReaction(enc, chosenText, effectiveRapport, objType, nextCallback) {
    this._refreshEncounterHeader(enc);
    const body = document.getElementById('encounter-body');
    if (!body) return;
    const biz = enc.business;
    const isGood = effectiveRapport > 1;
    const isOk   = effectiveRapport > 0 && effectiveRapport <= 1;
    const reactions = {
      price: {
        good: [`"[pauses] OK... I hadn't looked at it that way. That math actually makes sense."`, `"[sits back] Hm. When you put it like that, the cost of not solving it is the bigger number."`, `"Alright. I can see the logic. Let me think about that."`],
        ok:   [`"Yeah, I hear you. I just need to check on budget."`, `"[neutral] OK, that's a fair point. I'll need to think on it."`, `"[noncommittal] Sure, I'll consider it."`],
        bad:  [`"[shakes head] No — that's not going to work."`, `"[firm] Price is price. I can't justify it."`, `"[skeptical] That's what everyone says."`],
      },
      trust: {
        good: [`"[leans forward] OK. That's actually different from what most people say."`, `"[softening] Alright — a pilot is reasonable. I can do 30 days."`, `"That's... more honest than I expected."`],
        ok:   [`"[cautious] I guess that's fair. I just have to see results."`, `"We'll see. I'm not promising anything."`, `"[slightly warmer] OK. I'll keep an open mind."`],
        bad:  [`"[unimpressed] That's what the last three said."`, `"I've heard that pitch. Show me something real."`, `"[arms crossed] I'm not convinced."`],
      },
      incumbent: {
        good: [`"[surprised] Huh. You're not trying to replace them outright. That's actually smart."`, `"[considering] A gap analysis. That's not a bad idea."`, `"Fair enough. I'm always looking for where we're leaving value on the table."`],
        ok:   [`"[neutral] I mean, maybe. Our current vendor is fine."`, `"I'll think about it. Not making any changes right now."`, `"[polite] We'd have to compare a few things."`],
        bad:  [`"We're locked in for another year. Not interested."`, `"[firm] We're happy with who we have. Thanks though."`, `"I don't see why I'd switch."`],
      },
      timing: {
        good: [`"[pauses] A small pilot before Q3... that could actually work."`, `"If the scope is right, yeah. Let's talk about what that looks like."`, `"[considering] That's a fair approach. No big commitment yet."`],
        ok:   [`"I mean, maybe. We'd have to see."`, `"[noncommittal] Q3 still works better for us."`, `"Yeah, I'll think about it."`],
        bad:  [`"[firm] No — Q3. That's final for now."`, `"This isn't the right time. Come back later."`, `"[distracted] Not now."`],
      },
    };
    const tier = isGood ? 'good' : isOk ? 'ok' : 'bad';
    const pool = (reactions[objType] || reactions.timing)[tier];
    const reactionLine = pool[Math.floor(Math.random() * pool.length)];
    const rapportColor = effectiveRapport > 0 ? 'var(--sage)' : effectiveRapport < 0 ? 'var(--crimson)' : 'var(--text-muted)';
    const rapportLabel = effectiveRapport > 0 ? `+${effectiveRapport} Rapport` : effectiveRapport < 0 ? `${effectiveRapport} Rapport` : 'No change';
    const resultLabel = isGood ? '✓ Objection addressed' : isOk ? "~ Partial — they're not fully convinced" : '⚠ Objection stands';
    body.innerHTML = `
      <div class="dialogue-box player-dialogue" style="background:rgba(79,152,163,0.08);border-color:var(--teal,#4f98a3);margin-bottom:var(--s3)">
        <div class="dialogue-speaker" style="color:var(--teal,#4f98a3)">You said</div>
        <div class="dialogue-text">${chosenText
          .replace('{impliedCost}', '$'+Math.round((enc.business?.budget?.[0]||2000)*0.5).toLocaleString()+'/month')
          .replace('{impliedAnnual}', '$'+((enc.business?.budget?.[0]||2000)*0.5*12).toLocaleString())
          .replace('{price}', enc.stateFlags?.price ? '$'+enc.stateFlags.price.toLocaleString()+'/mo' : 'our fee')
        }</div>
      </div>
      <div class="dialogue-box" style="margin-bottom:var(--s3)">
        <div class="dialogue-speaker">${biz.owner} — ${biz.ownerTitle}</div>
        <div class="dialogue-text" style="font-style:italic">${reactionLine}</div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:var(--r-md);padding:var(--s3) var(--s4);margin-bottom:var(--s4)">
        <div style="font-size:var(--text-xs);color:var(--text-muted)">${resultLabel}</div>
        <div style="font-size:var(--text-sm);font-weight:700;color:${rapportColor}">${rapportLabel}</div>
      </div>
      <button class="btn btn-primary" id="btn-objection-continue" style="width:100%">
        ${nextCallback._isLast ? 'Move to Close →' : 'Continue →'}
      </button>
    `;
    document.getElementById('btn-objection-continue')?.addEventListener('click', () => nextCallback(), { once: true });
  }

    showClosePhase(enc, state) {
    this._refreshEncounterHeader(enc);
    const body = document.getElementById('encounter-body');
    if (!body) return;

    const biz = enc.business;
    const rapport = enc.rapport;
    const price = enc.stateFlags.price || 0;
    const closeConfidence = Math.min(95, Math.round((0.35 + rapport * 0.08 + biz.warmth * 0.1) * 100));

    body.innerHTML = `
      <div class="dialogue-box">
        <div class="dialogue-speaker">${biz.owner}</div>
        <div class="dialogue-text">"OK... that all makes sense. Let me think about this..."</div>
        <div class="dialogue-sub">
          Close confidence: <strong style="color:${closeConfidence > 60 ? 'var(--sage)' : closeConfidence > 40 ? 'var(--amber)' : 'var(--crimson)'}">${closeConfidence}%</strong>
          · Rapport: <strong>${rapport.toFixed(1)}</strong>
          · Warmth: <strong>${['Cold','Familiar','Warm','Advocate'][biz.warmth]}</strong>
        </div>
      </div>
      <div style="padding:var(--s4);background:rgba(0,212,200,.05);border:1px solid rgba(0,212,200,.2);border-radius:var(--r-lg);font-family:var(--font-flavor);font-style:italic;font-size:var(--text-sm);color:var(--text-muted);line-height:1.6">
        "The most important rule in closing: ask for the business, then shut up. Whoever speaks first loses." — Never Split the Difference
      </div>
      <div class="choices">
        ${(() => {
          const closeOptions = [
            { key: 'close_direct', text: `"Based on everything we discussed, I'd love to move forward. Can we get started this month for $${price.toLocaleString()}/mo?"`, badge: `` },
            { key: 'pilot_offer', text: `"What if we do a 30-day pilot — reduced scope, specific metrics. If we hit them, we scale. No risk on your end."`, badge: `` },
            { key: 'schedule_followup', text: `"I don't want to rush you. Can we schedule a follow-up this week to get your questions answered?"`, badge: `` },
          ];
          for (let i = closeOptions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [closeOptions[i], closeOptions[j]] = [closeOptions[j], closeOptions[i]];
          }
          return closeOptions.map((c, i) => `<button class="choice-btn" data-close="${c.key}"><span class="choice-key">${i+1}</span><div class="choice-body"><span class="choice-text">${c.text}</span>${c.badge}</div></button>`).join('');
        })()}
      </div>
      <div>${this._hintButtonHTML('close', state)}</div>
    `;

    body.querySelectorAll('.choice-btn[data-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          if (!this.encounterEngine) { console.error('[BizAmpire] encounterEngine not set'); return; }
          this.encounterEngine.resolveEncounter(btn.dataset.close);
        } catch(e) { console.error('[BizAmpire] close click error:', e); }
      });
    });
    this._attachHintButton('close', enc, state, { phase: 'close' });
  }

  showOutcome(type, biz, price, rapport, state, journalData = null) {
    const body = document.getElementById('encounter-body');
    if (!body) return;

    const totalDeals = state?.totalDeals ?? 0;
    const dealOrdinal = totalDeals === 1 ? 'your first deal' : totalDeals === 2 ? 'your second deal' : `deal #${totalDeals}`;

    const outcomes = {
      closed: {
        icon: '🤝', title: 'Deal Closed!', className: 'win',
        body: `${biz.owner} extends their hand. "${biz.name} is in — let's make this work." That's ${dealOrdinal} closed.`,
        rewards: [
          { label: `+$${price.toLocaleString()}/mo`, cls: 'gold-chip', icon: '💰' },
          { label: `+${100 + rapport * 20} XP`, cls: 'xp-chip', icon: '⚡' },
          { label: `+25 Reputation`, cls: '', icon: '⭐' },
        ],
      },
      followup: {
        icon: '📅', title: 'Follow-Up Scheduled', className: 'followup',
        body: `${biz.owner} is interested but needs time. "Send me something in writing and let's reconnect Thursday." You're in the pipeline.`,
        rewards: [
          { label: '+10 XP', cls: 'xp-chip', icon: '⚡' },
          { label: '+1 Warmth', cls: '', icon: '🔥' },
        ],
      },
      lost: {
        icon: '❌', title: 'Not This Time', className: 'lose',
        body: `${biz.owner} politely declines. "Not right now — we're going to sit tight on this." They'll be cooled off for a few days. Study what happened.`,
        rewards: [
          { label: '+5 XP (lessons)', cls: 'xp-chip', icon: '⚡' },
        ],
      },
      ghosted: {
        icon: '👻', title: 'Ghosted', className: 'lose',
        body: `${biz.owner} says they'll "think about it" and goes back to their desk. You know you won't hear from them. A missed opportunity — but a lesson.`,
        rewards: [{ label: 'Lesson learned', cls: '', icon: '📚' }],
      },
    };

    const outcome = outcomes[type] || outcomes.ghosted;
    body.innerHTML = `
      <div class="outcome-overlay">
        <div class="outcome-icon">${outcome.icon}</div>
        <div class="outcome-title ${outcome.className}">${outcome.title}</div>
        <div class="outcome-body">${outcome.body}</div>
        <div class="outcome-rewards">
          ${outcome.rewards.map(r => `<div class="reward-chip ${r.cls}">${r.icon} ${r.label}</div>`).join('')}
        </div>
        ${journalData?.wisdom ? `
        <div style="margin-top:var(--s5);padding:var(--s4);background:rgba(248,200,64,0.06);border:1px solid rgba(248,200,64,0.2);border-radius:var(--r-lg);text-align:left">
          <div style="font-size:var(--text-xs);color:#c8a820;text-transform:uppercase;letter-spacing:.1em;font-weight:700;margin-bottom:var(--s2)">💡 Think &amp; Grow Rich — ${journalData.wisdom.principle}</div>
          <div style="font-size:var(--text-sm);color:var(--text);font-style:italic;line-height:1.65;margin-bottom:var(--s3)">"${journalData.wisdom.quote}"</div>
          <div style="font-size:var(--text-xs);color:var(--text-muted);line-height:1.5"><strong style="color:var(--text)">Apply today:</strong> ${journalData.wisdom.apply}</div>
        </div>` : ''}
        ${journalData?.choiceLog?.length ? '<button class="btn btn-primary" id="btn-show-debrief" style="margin-top:var(--s4);width:100%">📋 See Full Debrief →</button>' : ''}
        <button class="btn btn-secondary" id="btn-return-city" style="margin-top:var(--s3);width:100%">Return to City</button>
      </div>
    `;

    const returnToCity = () => {
      this.closeEncounter();
      if (journalData?.prompts) {
        setTimeout(() => this.showJournalPrompt(journalData.prompts, journalData.context), 150);
      }
    };

    document.getElementById('btn-return-city')?.addEventListener('click', returnToCity);
    document.getElementById('btn-show-debrief')?.addEventListener('click', () => {
      this.showDebrief(journalData.choiceLog, type, returnToCity);
    });
  }

  showDebrief(choiceLog, outcomeType, returnCallback) {
    this._refreshEncounterHeader(null);
    const body = document.getElementById('encounter-body');
    if (!body) return;

    const outcomeColors = { closed: 'var(--sage)', followup: 'var(--amber)', lost: 'var(--crimson)', ghosted: 'var(--crimson)' };
    const outcomeColor = outcomeColors[outcomeType] || 'var(--text-muted)';

    const phaseIcons = { Opener: '👋', Discovery: '🔍', Pitch: '🎯', Objection: '⚡', Close: '🤝' };
    const frameworkColors = {
      'SPIN Selling': '#4f98a3',
      'Challenger Sale': '#9b72f8',
      'StoryBrand': '#f59623',
      '$100M Offers': '#f5a623',
      "Never Split the Difference": '#e05c4a',
      'Lean Startup': '#4aad7a',
      'Pattern Interrupt': '#4f98a3',
      'Direct Close': '#4aad7a',
      'Direct Discovery': '#4f98a3',
      'Objection Handling': '#e05c4a',
    };
    const frameworkWhy = {
      'SPIN Selling': 'SPIN moves prospects from surface awareness to felt urgency — each phase builds on the last until inaction feels costly.',
      'Pattern Interrupt': 'Opening with their specific pain breaks the "vendor pitch" script in the prospect\'s head, earning real attention before you ask for anything.',
      'Challenger Sale': 'Leading with a reframe teaches them something before you sell anything — positioning you as an advisor, not just another vendor.',
      'Direct Discovery': 'Asking for their biggest frustration skips the small talk and gets straight to qualifying whether there\'s a real problem to solve.',
      'StoryBrand': 'Outcomes-led pitches land harder than feature lists because they connect to what the prospect actually cares about — their result, not your product.',
      '$100M Offers': 'Framing value in terms of ROI and the cost of inaction makes price a relative number, not an absolute barrier.',
      "Never Split the Difference": 'Tactical empathy — acknowledging the concern before reframing it — lowers resistance more effectively than logic alone.',
      'Lean Startup': 'A scoped pilot reframes the decision from "big commitment" to "low-risk experiment," removing fear without dropping price.',
      'Direct Close': 'Asking directly and going silent lets the prospect decide. Hedging signals doubt — and they mirror your confidence level.',
      'Objection Handling': 'Addressing the root concern directly (rather than deflecting or conceding) signals confidence in your value proposition.',
    };
    const getFrameworkColor = (fw) => {
      if (!fw) return 'var(--violet)';
      for (const [key, color] of Object.entries(frameworkColors)) {
        if (fw.includes(key)) return color;
      }
      return 'var(--violet)';
    };
    const getFrameworkWhy = (fw) => {
      if (!fw) return null;
      for (const [key, why] of Object.entries(frameworkWhy)) {
        if (fw.includes(key)) return why;
      }
      return null;
    };

    const totalPhases = choiceLog.length;
    const optimalCount = choiceLog.filter(c => c.wasOptimal).length;
    const scoreLabel = optimalCount === totalPhases ? 'Perfect Execution' :
                       optimalCount >= totalPhases * 0.75 ? 'Strong Performance' :
                       optimalCount >= totalPhases * 0.5 ? 'Solid Effort' : 'Needs Work';
    const scorePct = Math.round((optimalCount / totalPhases) * 100);

    const frameworksApplied = [...new Set(choiceLog.filter(e => e.wasOptimal && e.framework).map(e => e.framework))];
    const frameworksBar = frameworksApplied.length
      ? `<div style="margin-top:var(--s3);display:flex;flex-wrap:wrap;gap:var(--s2)">
          <span style="font-size:var(--text-xs);color:var(--text-muted);align-self:center">Applied:</span>
          ${frameworksApplied.map(fw => `<span style="font-size:var(--text-xs);padding:2px 8px;border-radius:4px;background:${getFrameworkColor(fw)}22;color:${getFrameworkColor(fw)};border:1px solid ${getFrameworkColor(fw)}44">${fw}</span>`).join('')}
        </div>`
      : '';

    const rows = choiceLog.map(entry => {
      const icon = phaseIcons[entry.phase] || '•';
      const delta = entry.rapportDelta > 0 ? `<span style="color:var(--sage)">+${entry.rapportDelta}</span>` :
                    entry.rapportDelta < 0 ? `<span style="color:var(--crimson)">${entry.rapportDelta}</span>` :
                    `<span style="color:var(--text-muted)">±0</span>`;
      const statusDot = entry.wasOptimal
        ? `<span style="color:var(--sage);font-size:1rem">✓</span>`
        : `<span style="color:var(--crimson);font-size:1rem">✗</span>`;

      const frameworkUsed = entry.framework
        ? `<span style="display:inline-block;font-size:var(--text-xs);padding:2px 8px;border-radius:4px;background:${getFrameworkColor(entry.framework)}22;color:${getFrameworkColor(entry.framework)};border:1px solid ${getFrameworkColor(entry.framework)}44;margin-top:var(--s2)">${entry.framework}</span>`
        : '';

      const why = entry.wasOptimal && entry.framework ? getFrameworkWhy(entry.framework) : null;
      const reinforced = why ? `
        <div style="margin-top:var(--s3);padding:var(--s3) var(--s4);background:rgba(74,173,122,0.06);border:1px solid rgba(74,173,122,0.2);border-radius:var(--r-md)">
          <div style="font-size:var(--text-xs);color:var(--sage);text-transform:uppercase;letter-spacing:.08em;margin-bottom:var(--s2)">✓ Why this worked — ${entry.framework}</div>
          <div style="font-size:var(--text-xs);color:var(--text-muted);line-height:1.5">${why}</div>
          ${entry.expertContinuation ? `<div style="margin-top:var(--s3);padding-top:var(--s3);border-top:1px solid rgba(74,173,122,0.15);font-size:var(--text-xs);color:var(--text-muted);font-style:italic;line-height:1.5">↗ "${entry.expertContinuation}"</div>` : ''}
        </div>
      ` : '';

      const missed = !entry.wasOptimal && entry.optimal ? `
        <div style="margin-top:var(--s3);padding:var(--s3) var(--s4);background:rgba(155,114,248,0.06);border:1px solid rgba(155,114,248,0.2);border-radius:var(--r-md)">
          <div style="font-size:var(--text-xs);color:var(--violet);text-transform:uppercase;letter-spacing:.08em;margin-bottom:var(--s2)">📚 ${entry.optimal.framework} — Optimal Move</div>
          <div style="font-size:var(--text-sm);color:var(--text);margin-bottom:var(--s2);font-style:italic">"${entry.optimal.text}"</div>
          <div style="font-size:var(--text-xs);color:var(--text-muted);line-height:1.5">${entry.optimal.frameworkDetail}</div>
        </div>
      ` : '';

      return `
        <div style="border:1px solid var(--border);border-radius:var(--r-lg);padding:var(--s4);background:var(--surface);margin-bottom:var(--s3)">
          <div style="display:flex;align-items:flex-start;gap:var(--s3)">
            <div style="font-size:1.1rem;line-height:1">${icon}</div>
            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--s2)">
                <span style="font-size:var(--text-xs);text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted)">${entry.phase}${entry.phaseLabel ? ' — '+entry.phaseLabel : ''}</span>
                <div style="display:flex;align-items:center;gap:var(--s2)">${statusDot} <span style="font-size:var(--text-xs);color:var(--text-muted)">rapport ${delta}</span></div>
              </div>
              <div style="font-size:var(--text-sm);color:var(--text);line-height:1.4">${entry.chosen}</div>
              ${frameworkUsed}
              ${reinforced}
              ${missed}
            </div>
          </div>
        </div>
      `;
    }).join('');

    body.innerHTML = `
      <div style="margin-bottom:var(--s4)">
        <div style="font-size:var(--text-xs);text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:var(--s2)">Post-Encounter Debrief</div>
        <div style="padding:var(--s4);background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);margin-bottom:var(--s4)">
          <div style="display:flex;align-items:center;justify-content:space-between">
            <div>
              <div style="font-size:var(--text-xl);font-weight:800;color:${outcomeColor}">${scoreLabel}</div>
              <div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:2px">${optimalCount} of ${totalPhases} moves optimal</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:2rem;font-weight:900;color:${outcomeColor}">${scorePct}%</div>
              <div style="font-size:var(--text-xs);color:var(--text-muted)">execution score</div>
            </div>
          </div>
          ${frameworksBar}
        </div>
        ${rows}
      </div>
      <button class="btn btn-primary" id="btn-debrief-return" style="width:100%">Return to City →</button>
    `;

    document.getElementById('btn-debrief-return')?.addEventListener('click', () => returnCallback(), { once: true });
  }

    // ── Early Exit / Ejection Screen ───────────────────────────
  showEjected(biz, phase, cashDrain, cooldownDays) {
    const body = document.getElementById('encounter-body');
    if (!body) return;

    const phaseLabels = {
      opener:     'the opening',
      discovery:  'discovery',
      pitch:      'your pitch',
      pricing:    'the pricing conversation',
      objections: 'handling objections',
    };
    const phaseLabel = phaseLabels[phase] || 'the meeting';

    const phaseCoaching = {
      opener: [
        'Cold openers tank rapport fast. Do Market Research first to warm them up.',
        'Leading with features instead of curiosity signals you\'re not listening.',
        'Try: "I noticed your business does X — are you finding Y is a challenge?"',
      ],
      discovery: [
        'Discovery is about their pain, not your pitch. Ask more, talk less.',
        'SPIN Selling: Situation → Problem → Implication → Need-Payoff. You skipped ahead.',
        'When you stop asking questions, the prospect stops trusting you.',
      ],
      pitch: [
        'A pitch lands when their problem is crystal-clear. You rushed it.',
        'Challenger Sale: Teach something unexpected. Tailor it to their business. Take control.',
        'Never pitch until you\'ve heard them say the pain in their own words.',
      ],
      pricing: [
        'Pricing without anchoring is leaving money on the table — and trust.',
        '$100M Offers: Stack the value first. Price second. Never apologize for your rate.',
        'If they balk at price, go back to pain — never discount immediately.',
      ],
      objections: [
        'Objections are buying signals. A walkout means you ran out of answers.',
        'Never Split the Difference: Label the emotion. "It sounds like cost is a real concern."',
        'Tactical empathy beats logical argument every time in objection handling.',
      ],
    };
    const tips = phaseCoaching[phase] || phaseCoaching.discovery;
    const tip = tips[Math.floor(Math.random() * tips.length)];

    body.innerHTML = `
      <div class="outcome-overlay" style="border:2px solid var(--crimson)">
        <div class="outcome-icon" style="font-size:2.5rem">🚪</div>
        <div class="outcome-title lose" style="color:var(--crimson)">${biz.owner} ended the meeting early.</div>
        <div class="outcome-body" style="font-style:italic;color:var(--text-muted)">
          "${this._getEjectionQuote(phase, biz.owner)}"
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--s3);margin:var(--s4) 0">
          <div class="panel panel-sm" style="text-align:center;border-color:var(--crimson)">
            <div style="font-size:var(--text-xl);font-weight:700;color:var(--crimson);">-$${cashDrain.toLocaleString()}</div>
            <div style="font-size:var(--text-xs);color:var(--text-muted)">Time & opportunity cost</div>
          </div>
          <div class="panel panel-sm" style="text-align:center;border-color:var(--amber)">
            <div style="font-size:var(--text-xl);font-weight:700;color:var(--amber)">${cooldownDays}d</div>
            <div style="font-size:var(--text-xs);color:var(--text-muted)">Burned — won\'t meet again</div>
          </div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:8px;padding:var(--s4);text-align:left;margin-bottom:var(--s4)">
          <div style="font-size:var(--text-xs);text-transform:uppercase;letter-spacing:.08em;color:var(--violet);margin-bottom:var(--s2)">Coach's Corner — Failed at ${phaseLabel}</div>
          <div style="font-size:var(--text-sm);line-height:1.5">${tip}</div>
        </div>

        <button class="btn btn-secondary" id="btn-return-city-ejected" style="margin-top:var(--s2);width:100%">Back to City →</button>
      </div>
    `;

    document.getElementById('btn-return-city-ejected')?.addEventListener('click', () => {
      this.closeEncounter();
    });
  }

  _getEjectionQuote(phase, ownerName) {
    const quotes = {
      opener: [
        `Look, I'm going to stop you right there — we're not looking for this right now.`,
        `I appreciate you stopping by, but this isn't a good time. Please don't come back without an appointment.`,
        `I've heard this pitch before. We're all set.`,
      ],
      discovery: [
        `You're asking a lot of questions that don't seem relevant to us. I've got a business to run.`,
        `Honestly? I feel like you're fishing for problems we don't have. We're done here.`,
        `I don't think you understand what we do. This isn't going anywhere.`,
      ],
      pitch: [
        `That pitch had nothing to do with our situation. I'm not interested.`,
        `You clearly didn't listen to anything I said. Good luck out there.`,
        `This solution doesn't fit us at all. I need to get back to work.`,
      ],
      pricing: [
        `That number is completely out of range. This conversation is over.`,
        `You've got to be kidding me. We're not spending that. Have a good day.`,
        `I feel like you're not being realistic. We're done here.`,
      ],
      objections: [
        `You haven't addressed a single one of my concerns. I'm going to pass.`,
        `Every answer you gave made me more unsure. We're not moving forward.`,
        `I've heard enough. This isn't going to work for us.`,
      ],
    };
    const pool = quotes[phase] || quotes.discovery;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  closeEncounter() {
    this.state.currentEncounter = null;
    this.showScreen('map');
    if (this.el.hud) this.el.hud.style.display = 'block';
  }

  _refreshEncounterHeader(enc) {
    const header = document.querySelector('.encounter-header');
    if (header && enc) {
      const newHeader = document.createElement('div');
      newHeader.innerHTML = this._renderEncounterHeader(enc.business, enc);
      header.replaceWith(newHeader.firstElementChild);
    }
  }

  // ── Skill Tree ─────────────────────────────────────────────
  showSkillTree() {
    const panel = document.getElementById('skill-tree-panel');
    if (!panel || !this.state) return;
    this.renderSkillTree(this.state);

    const screen = document.getElementById('screen-skills');
    if (screen) {
      screen.classList.remove('hidden');
      screen.style.display = 'flex';
    }

    // listener re-attached in renderSkillTree after every innerHTML replacement
  }

  renderSkillTree(state) {
    const panel = document.getElementById('skill-tree-panel');
    if (!panel) return;

    const spDisplay = `<div style="font-size:var(--text-xs);color:var(--text-muted)">Skill Points: <strong style="color:var(--gold)">${state.skillPoints}</strong> available</div>`;

    const branchHTML = Object.entries(SKILL_TREE).map(([key, branch]) => `
      <div class="skill-branch">
        <div class="branch-label">${branch.label}</div>
        <div class="skill-nodes">
          ${branch.skills.map(skill => {
            const unlocked = state.unlockedSkills.includes(skill.id);
            const prereqMet = skill.prereq.every(p => state.unlockedSkills.includes(p));
            const canUnlock = !unlocked && prereqMet && state.skillPoints >= Math.ceil(skill.cost / 100);
            const status = unlocked ? '✓' : !prereqMet ? '🔒' : canUnlock ? '' : '•';
            const costLabel = skill.cost === 0 ? 'Free' : `${Math.ceil(skill.cost / 100)} SP`;
            return `
              <div class="skill-node ${unlocked ? 'unlocked' : prereqMet ? 'available' : 'locked'}"
                   data-skill="${skill.id}"
                   title="${skill.longDesc}">
                <div class="skill-node-icon">${skill.icon}</div>
                <div class="skill-node-info">
                  <div class="skill-node-name">${skill.name}</div>
                  <div class="skill-node-desc">${skill.desc}</div>
                  ${!unlocked ? `<div class="skill-node-cost">${costLabel}</div>` : ''}
                </div>
                <div class="skill-node-status">${status}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `).join('');

    panel.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div class="skill-tree-title">Skill Tree <span>// ${state.level > 1 ? `Lv. ${state.level}` : 'Foundations'}</span></div>
        <div style="display:flex;align-items:center;gap:var(--s4)">
          ${spDisplay}
          <button class="btn btn-secondary" id="btn-close-skills" style="padding:var(--s2) var(--s4);font-size:var(--text-xs)">✕ Close</button>
        </div>
      </div>
      <div style="font-size:var(--text-sm);color:var(--text-muted);font-family:var(--font-flavor);font-style:italic">
        "The most valuable skill you can develop is knowing how to learn new skills." — Tony Robbins
      </div>
      ${branchHTML}
    `;

    panel.querySelectorAll('.skill-node.available[data-skill]').forEach(node => {
      node.addEventListener('click', () => {
        this.gameEngine.unlockSkill(node.dataset.skill);
      });
    });

    // Re-attach close listener every render (innerHTML replacement kills the old one)
    const skillScreen = document.getElementById('screen-skills');
    document.getElementById('btn-close-skills')?.addEventListener('click', () => {
      skillScreen?.classList.add('hidden');
      if (skillScreen) skillScreen.style.display = 'none';
    }, { once: true });
  }

  // ── Field Journal ──────────────────────────────────────────
  showJournal() {
    const screen = document.getElementById('screen-journal');
    if (!screen || !this.state) return;
    this._renderJournal();
    screen.classList.remove('hidden');
    screen.style.display = 'flex';
  }

  showJournalPrompt(prompts, context) {
    const screen = document.getElementById('screen-journal');
    if (!screen || !this.state) return;
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];
    this._renderJournal(prompt, context);
    screen.classList.remove('hidden');
    screen.style.display = 'flex';
  }

  _renderJournal(activePrompt = null, context = null) {
    const panel = document.getElementById('journal-panel');
    if (!panel || !this.state) return;

    const entries = this.state.journalEntries;
    const completionRate = entries.length > 0
      ? Math.round(entries.filter(e => e.done).length / entries.length * 100)
      : 0;

    panel.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div class="journal-title">Field Journal <span>📓</span></div>
        <div style="display:flex;align-items:center;gap:var(--s4)">
          <div style="font-size:var(--text-xs);color:var(--text-muted)">
            Completion rate: <strong style="color:${completionRate > 70 ? 'var(--sage)' : 'var(--amber)'}">${completionRate}%</strong>
          </div>
          <button class="btn btn-secondary" id="btn-close-journal" style="padding:var(--s2) var(--s4);font-size:var(--text-xs)">✕</button>
        </div>
      </div>
      <div style="font-size:var(--text-sm);color:var(--text-muted);line-height:1.6">
        The best learning games create <em>transfer</em> — skills practiced in the game change behavior in the real world. Each commitment you write here is a bridge.
      </div>

      ${activePrompt ? `
        <div class="journal-prompt">
          <div class="journal-prompt-q">"${activePrompt}"</div>
          ${context ? `<div class="journal-prompt-context">Context: ${context.businessName} · Outcome: ${context.outcome}</div>` : ''}
          <div style="display:flex;gap:var(--s2);margin-top:var(--s3)">
            <input type="text" id="journal-input" placeholder="I will..." class="field input" 
              style="flex:1;background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);padding:var(--s2) var(--s4);font-size:var(--text-sm);color:var(--text)">
            <button class="btn btn-primary" id="btn-save-journal" style="white-space:nowrap">Save Commitment</button>
          </div>
          <button class="btn btn-secondary" id="btn-skip-journal" style="margin-top:var(--s2);font-size:var(--text-xs)">Skip for now</button>
        </div>
      ` : ''}

      ${entries.length > 0 ? `
        <div>
          <div style="font-size:var(--text-xs);text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:var(--s3)">Commitments</div>
          <div class="journal-entries">
            ${entries.map(e => `
              <div class="journal-entry ${e.done ? 'done' : 'pending'}">
                <div class="journal-check ${e.done ? 'done' : ''}" data-id="${e.id}">${e.done ? '✓' : ''}</div>
                <div class="journal-entry-text">${e.text}</div>
                <div class="journal-entry-date">${e.createdAt}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : `<div style="font-size:var(--text-sm);color:var(--text-muted);text-align:center;padding:var(--s8)">No commitments yet. Close your first deal to get a journal prompt.</div>`}
    `;

    document.getElementById('btn-save-journal')?.addEventListener('click', () => {
      const text = document.getElementById('journal-input')?.value?.trim();
      if (text) {
        this.gameEngine.addJournalEntry(text, context);
        this.showToast('📓 Commitment saved! Check back in 3 days.', 'gold');
        this._renderJournal();
      }
    });

    document.getElementById('btn-skip-journal')?.addEventListener('click', () => {
      const screen = document.getElementById('screen-journal');
      screen?.classList.add('hidden');
      screen && (screen.style.display = 'none');
    });

    // ── Close button — re-attached every render so it always works ──
    document.getElementById('btn-close-journal')?.addEventListener('click', () => {
      const screen = document.getElementById('screen-journal');
      screen?.classList.add('hidden');
      screen && (screen.style.display = 'none');
    });

    panel.querySelectorAll('.journal-check:not(.done)').forEach(el => {
      el.addEventListener('click', () => {
        this.gameEngine.completeJournalEntry(parseInt(el.dataset.id));
        this._renderJournal();
      });
    });
  }

  // ── Management Screen ──────────────────────────────────────
  showManagement() {
    const screen = document.getElementById('screen-management');
    if (!screen || !this.state) return;
    this._renderManagement();
    screen.classList.remove('hidden');
    screen.style.display = 'flex';
  }

  _renderManagement() {
    const panel = document.getElementById('management-panel');
    if (!panel || !this.state) return;
    const state = this.state;
    const screen = document.getElementById('screen-management');
    const canHire = state.totalDeals >= 5;

    const clientsHTML = state.activeClients.length > 0
      ? state.activeClients.map(c => `
          <div class="employee-card">
            <div class="employee-avatar">${c.icon}</div>
            <div class="employee-info">
              <div class="employee-name">${c.name}</div>
              <div class="employee-role">${c.type}</div>
              <div class="employee-stats">
                <div class="emp-stat">Revenue: <span>$${c.monthlyValue?.toLocaleString()}/mo</span></div>
                <div class="emp-stat">Rapport: <span>${c.closingRapport?.toFixed(1)}</span></div>
              </div>
            </div>
          </div>
        `).join('')
      : '<div style="font-size:var(--text-sm);color:var(--text-muted)">No active clients yet. Close deals in the city.</div>';

    const employeesHTML = state.employees.length > 0
      ? state.employees.map(e => `
          <div class="employee-card">
            <div class="employee-avatar">${e.icon}</div>
            <div class="employee-info">
              <div class="employee-name">${e.name}</div>
              <div class="employee-role">${e.role || e.description || e.id?.replace(/_/g,' ')}</div>
              <div class="employee-stats">
                <div class="emp-stat">Cost: <span>$${e.cost?.toLocaleString()}/mo</span></div>
                <div class="emp-stat">Reliability: <span>${e.reliability}/5</span></div>
                <div class="emp-stat">Skill: <span>${e.skill}/5</span></div>
              </div>
            </div>
          </div>
        `).join('')
      : '<div style="font-size:var(--text-sm);color:var(--text-muted)">No employees yet. Close 5 deals to unlock hiring.</div>';

    const hirableHTML = canHire ? EMPLOYEE_ARCHETYPES.map(arch => {
      const alreadyHired = state.employees.some(e => e.id === arch.id);
      const skillRequired = arch.id === 'experienced_manager' && !state.unlockedSkills.includes('hiring_protocol');
      const opsRequired = arch.id === 'ops_specialist' && !state.unlockedSkills.includes('lean_operations');
      const locked = alreadyHired || skillRequired || opsRequired;

      return `
        <div class="employee-card">
          <div class="employee-avatar">${arch.icon}</div>
          <div class="employee-info">
            <div class="employee-name">${arch.name}</div>
            <div class="employee-role">${arch.description}</div>
            <div class="employee-stats">
              <div class="emp-stat">Salary: <span>$${arch.cost.toLocaleString()}/mo</span></div>
              <div class="emp-stat">Reliability: <span>${arch.reliability}/5</span></div>
            </div>
            <div style="font-size:var(--text-xs);color:var(--violet);margin-top:var(--s2);font-style:italic">${arch.emythLesson}</div>
          </div>
          <button class="btn ${locked ? 'btn-secondary' : 'btn-primary'}" 
                  data-hire="${arch.id}"
                  ${locked ? 'disabled' : ''}
                  style="font-size:var(--text-xs);padding:var(--s2) var(--s3);white-space:nowrap">
            ${alreadyHired ? 'Hired' : locked ? 'Locked' : 'Hire →'}
          </button>
        </div>
      `;
    }).join('') : `
      <div style="font-size:var(--text-sm);color:var(--text-muted);font-style:italic;padding:var(--s4)">
        "Until you can hire, you are the product." — E-Myth Revisited<br><br>
        Close ${5 - state.totalDeals} more deal${5 - state.totalDeals !== 1 ? 's' : ''} to unlock hiring.
      </div>
    `;

    // ── Vendor tab HTML ────────────────────────────────────────
    const vendors = state.vendors || [];
    const totalVendorCost = vendors.filter(v => v.recurring).reduce((s, v) => s + (v.monthlyCost || 0), 0);
    const totalReferralRate = vendors.reduce((s, v) => s + (v.referralRate || 0), 0);

    const vendorsHTML = vendors.length > 0
      ? vendors.map(v => {
          // ── Performance metrics ──────────────────────────────
          const gen  = v.leadsGenerated  || 0;
          const conv = v.leadsConverted  || 0;
          const mos  = v.monthsActive    || 0;
          const spent = v.totalSpent     || (v.recurring ? (v.monthlyCost || 0) * mos : 0);
          const rate = gen > 0 ? Math.round((conv / gen) * 100) : null;
          const rateColor = rate === null ? 'var(--text-muted)'
                          : rate >= 50   ? 'var(--sage)'
                          : rate >= 25   ? 'var(--amber)'
                          :                'var(--crimson)';
          const rateLabel = rate === null ? 'No data yet' : `${rate}% conversion`;

          // ── Performance bar (visual) ─────────────────────────
          const barPct = rate !== null ? Math.min(100, rate) : 0;
          const barColor = rate === null ? 'var(--border)'
                         : rate >= 50   ? 'var(--sage)'
                         : rate >= 25   ? 'var(--amber)'
                         :                'var(--crimson)';

          // ROI: how much revenue this vendor has helped generate (rough: conv * avg deal size)
          // We just show leads in/out — clean and honest
          const perfBar = `
            <div style="margin:var(--s2) 0 var(--s1);font-size:10px;color:var(--text-muted);display:flex;justify-content:space-between">
              <span>Lead Conversion</span>
              <span style="color:${rateColor};font-weight:600">${rateLabel}</span>
            </div>
            <div style="height:6px;background:var(--surface);border-radius:999px;overflow:hidden">
              <div style="height:100%;width:${barPct}%;background:${barColor};border-radius:999px;transition:width .4s ease"></div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-muted);margin-top:var(--s1)">
              <span>${gen} lead${gen !== 1 ? 's' : ''} sent</span>
              <span>${conv} converted</span>
            </div>`;

          // ── Cancel button (recurring only — one-time services are permanent) ──
          const cancelBtn = v.recurring ? `
            <button
              class="btn btn-secondary"
              data-cancel-vendor-biz="${v.bizId}"
              data-cancel-vendor-svc="${v.serviceId}"
              style="font-size:10px;padding:3px 10px;color:var(--crimson);border-color:var(--crimson);margin-top:var(--s3);width:100%">
              Cancel Service
            </button>` : `
            <div style="font-size:10px;color:var(--text-muted);margin-top:var(--s3);text-align:center">One-time — permanent</div>`;

          return `
          <div class="employee-card" style="flex-direction:column;align-items:stretch;gap:0">
            <div style="display:flex;gap:var(--s3);align-items:flex-start">
              <div class="employee-avatar" style="flex-shrink:0">${v.serviceIcon || v.icon || '🏢'}</div>
              <div class="employee-info" style="flex:1;min-width:0">
                <div class="employee-name">${v.serviceName}</div>
                <div class="employee-role" style="color:var(--violet)">${v.bizName}</div>
                <div class="employee-stats" style="margin-top:var(--s2)">
                  ${v.recurring
                    ? `<div class="emp-stat">Monthly: <span style="color:var(--crimson)">-$${(v.monthlyCost||0).toLocaleString()}/mo</span></div>`
                    : `<div class="emp-stat">One-time purchase</div>`}
                  ${mos > 0 ? `<div class="emp-stat">Active: <span>${mos} month${mos !== 1 ? 's' : ''}</span></div>` : ''}
                  ${spent > 0 ? `<div class="emp-stat">Total paid: <span>$${spent.toLocaleString()}</span></div>` : ''}
                </div>
              </div>
            </div>
            ${v.referralRate > 0 ? perfBar : '<div style="font-size:10px;color:var(--text-muted);margin-top:var(--s2)">No referral tracking for this service</div>'}
            ${cancelBtn}
          </div>`;
        }).join('')
      : '<div style="font-size:var(--text-sm);color:var(--text-muted)">No vendor services purchased yet. Visit buildings in the city and choose <strong>"Buy Service"</strong> to expand your reach.</div>';

    const vendorSummaryHTML = vendors.length > 0 ? `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--s3);margin-bottom:var(--s4)">
        <div class="panel panel-sm" style="text-align:center">
          <div style="font-size:var(--text-xl);font-family:var(--font-display);font-weight:700;color:var(--violet)">${vendors.length}</div>
          <div style="font-size:var(--text-xs);color:var(--text-muted)">Services Active</div>
        </div>
        <div class="panel panel-sm" style="text-align:center">
          <div style="font-size:var(--text-xl);font-family:var(--font-display);font-weight:700;color:var(--crimson)">-$${totalVendorCost.toLocaleString()}</div>
          <div style="font-size:var(--text-xs);color:var(--text-muted)">Vendor Overhead/mo</div>
        </div>
        <div class="panel panel-sm" style="text-align:center">
          <div style="font-size:var(--text-xl);font-family:var(--font-display);font-weight:700;color:var(--sage)">~${totalReferralRate}/mo</div>
          <div style="font-size:var(--text-xs);color:var(--text-muted)">Referral Leads</div>
        </div>
      </div>` : '';

    // ── Tab system ─────────────────────────────────────────────
    const activeTab = this._mgmtActiveTab || 'overview';

    const tabBtnStyle = (id) => `
      padding:var(--s2) var(--s4);font-size:var(--text-xs);border-radius:6px;border:1px solid;
      cursor:pointer;font-family:var(--font-body);font-weight:600;
      background:${activeTab===id ? 'var(--violet)' : 'transparent'};
      color:${activeTab===id ? '#fff' : 'var(--text-muted)'};
      border-color:${activeTab===id ? 'var(--violet)' : 'var(--border)'}`;

    const overviewContent = `
      <div>
        <div style="font-size:var(--text-xs);text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:var(--s3)">Active Clients (${state.activeClients.length})</div>
        ${clientsHTML}
      </div>
      <div style="margin-top:var(--s4)">
        <div style="font-size:var(--text-xs);text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:var(--s3)">Team (${state.employees.length})</div>
        ${employeesHTML}
      </div>
      <div style="margin-top:var(--s4)">
        <div style="font-size:var(--text-xs);text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:var(--s3)">Available Hires</div>
        ${hirableHTML}
      </div>`;

    const vendorsContent = `
      ${vendorSummaryHTML}
      <div>
        <div style="font-size:var(--text-xs);text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:var(--s3)">Purchased Services (${vendors.length})</div>
        ${vendorsHTML}
      </div>
      ${state.vendorWarmthBonus > 0 || state.vendorOverheadReduction > 0 || state.monthlyTaxCredit > 0 ? `
      <div style="margin-top:var(--s4)">
        <div style="font-size:var(--text-xs);text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:var(--s3)">Active Effects</div>
        <div class="panel panel-sm" style="display:flex;flex-direction:column;gap:var(--s2)">
          ${state.vendorWarmthBonus > 0 ? `<div style="font-size:var(--text-sm)">🤝 +${state.vendorWarmthBonus} Rapport Bonus on encounters</div>` : ''}
          ${state.vendorOverheadReduction > 0 ? `<div style="font-size:var(--text-sm)">⚡ ${(state.vendorOverheadReduction*100).toFixed(0)}% Overhead Reduction</div>` : ''}
          ${state.monthlyTaxCredit > 0 ? `<div style="font-size:var(--text-sm)">💰 $${state.monthlyTaxCredit.toLocaleString()} Monthly Tax Credit</div>` : ''}
          ${state.hasVehicle ? '<div style="font-size:var(--text-sm)">🚗 Company Vehicle — +40% Movement Speed</div>' : ''}
          ${state.creditLine > 0 ? `<div style="font-size:var(--text-sm)">🏦 $${state.creditLine.toLocaleString()} Credit Line Available</div>` : ''}
        </div>
      </div>` : ''}`;

    panel.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div style="font-family:var(--font-display);font-size:var(--text-xl);font-weight:700">Management Hub</div>
        <button class="btn btn-secondary" id="btn-close-mgmt" style="padding:var(--s2) var(--s4);font-size:var(--text-xs)">✕ Close</button>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--s4)">
        <div class="panel panel-sm" style="text-align:center">
          <div style="font-size:var(--text-2xl);font-family:var(--font-display);font-weight:700;color:var(--sage)">$${state.monthlyRevenue.toLocaleString()}</div>
          <div style="font-size:var(--text-xs);color:var(--text-muted)">Monthly Revenue</div>
        </div>
        <div class="panel panel-sm" style="text-align:center">
          <div style="font-size:var(--text-2xl);font-family:var(--font-display);font-weight:700;color:var(--crimson)">$${state.monthlyOverhead.toLocaleString()}</div>
          <div style="font-size:var(--text-xs);color:var(--text-muted)">Monthly Overhead</div>
        </div>
        <div class="panel panel-sm" style="text-align:center">
          ${(() => {
            const empCosts = (state.employees || []).reduce((s, e) => s + (e.cost || 0), 0);
            const vendorCosts = (state.vendors || []).filter(v => v.recurring).reduce((s, v) => s + (v.monthlyCost || 0), 0);
            const trueNet = state.monthlyRevenue - state.monthlyOverhead - empCosts - vendorCosts;
            return `<div style="font-size:var(--text-2xl);font-family:var(--font-display);font-weight:700;color:${trueNet > 0 ? 'var(--sage)' : 'var(--crimson)'}">$${trueNet.toLocaleString()}</div>
            <div style="font-size:var(--text-xs);color:var(--text-muted)">Net Profit</div>
            ${(empCosts + vendorCosts) > 0 ? `<div style="font-size:10px;color:var(--text-muted);margin-top:2px">incl. $${(empCosts+vendorCosts).toLocaleString()} staff+vendors</div>` : ''}`;
          })()}
        </div>
      </div>

      <div style="display:flex;gap:var(--s2);border-bottom:1px solid var(--border);padding-bottom:var(--s3)">
        <button id="mgmt-tab-overview" style="${tabBtnStyle('overview')}" data-tab="overview">📊 Overview</button>
        <button id="mgmt-tab-vendors" style="${tabBtnStyle('vendors')}" data-tab="vendors">🤝 Vendors ${vendors.length > 0 ? `<span style="background:var(--violet);color:#fff;border-radius:999px;padding:1px 6px;font-size:10px;margin-left:4px">${vendors.length}</span>` : ''}</button>
      </div>

      <div id="mgmt-tab-content">
        ${activeTab === 'vendors' ? vendorsContent : overviewContent}
      </div>
    `;

    document.getElementById('btn-close-mgmt')?.addEventListener('click', () => {
      screen?.classList.add('hidden');
      screen && (screen.style.display = 'none');
    });

    panel.querySelectorAll('button[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        this._mgmtActiveTab = btn.dataset.tab;
        this._renderManagement();
      });
    });

    panel.querySelectorAll('button[data-hire]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.gameEngine.hireEmployee(btn.dataset.hire);
        this._renderManagement();
      });
    });

    // Cancel vendor buttons
    panel.querySelectorAll('button[data-cancel-vendor-biz]').forEach(btn => {
      btn.addEventListener('click', () => {
        const bizId = btn.dataset.cancelVendorBiz;
        const svcId = btn.dataset.cancelVendorSvc;
        const vendor = this.state.vendors.find(v => v.bizId === bizId && v.serviceId === svcId);
        if (!vendor) return;
        this._showVendorCancelConfirm(vendor, bizId, svcId);
      });
    });
  }

  _showVendorCancelConfirm(vendor, bizId, svcId) {
    // Remove any existing confirm overlay
    document.getElementById('vendor-cancel-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'vendor-cancel-overlay';
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9000;
      background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;padding:var(--s4)`;

    const perfNote = vendor.leadsGenerated > 0
      ? `This vendor sent ${vendor.leadsGenerated} lead${vendor.leadsGenerated !== 1 ? 's' : ''} and converted ${vendor.leadsConverted || 0} — a ${Math.round(((vendor.leadsConverted||0)/vendor.leadsGenerated)*100)}% rate.`
      : `This vendor has been active for ${vendor.monthsActive || 0} month${(vendor.monthsActive||0) !== 1 ? 's' : ''} with no referral data yet.`;

    overlay.innerHTML = `
      <div class="panel" style="max-width:360px;width:100%;padding:var(--s6);text-align:center">
        <div style="font-size:1.8rem;margin-bottom:var(--s2)">🗑️</div>
        <div style="font-family:var(--font-display);font-size:var(--text-lg);font-weight:700;margin-bottom:var(--s2)">
          Cancel ${vendor.serviceName}?
        </div>
        <div style="font-size:var(--text-sm);color:var(--text-muted);margin-bottom:var(--s3);line-height:1.5">
          ${perfNote}
        </div>
        <div class="panel panel-sm" style="text-align:left;margin-bottom:var(--s4)">
          <div style="font-size:var(--text-xs);color:var(--text-muted)">
            • Stops the <strong style="color:var(--crimson)">$${(vendor.monthlyCost||0).toLocaleString()}/mo</strong> charge<br>
            • Removes active effects from this service<br>
            • Re-purchase by visiting <strong>${vendor.bizName}</strong> in the city
          </div>
        </div>
        <div style="display:flex;gap:var(--s3)">
          <button id="vcco-cancel-no" class="btn btn-secondary" style="flex:1">Keep It</button>
          <button id="vcco-cancel-yes" class="btn" style="flex:1;background:var(--crimson);border-color:var(--crimson);color:#fff">Yes, Cancel</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    document.getElementById('vcco-cancel-no').addEventListener('click', () => overlay.remove());
    document.getElementById('vcco-cancel-yes').addEventListener('click', () => {
      overlay.remove();
      this.gameEngine.cancelVendor(bizId, svcId);
    });
  }

  // ── Meta-Game Events ───────────────────────────────────────
  showMilestone(milestone) {
    this.showToast(`🏆 Milestone: "${milestone.title}" — ${milestone.reward}`, 'gold');
  }

  // Persistent modal for high-stakes events that can't be missed
  showEventModal({ icon, title, body, ctaLabel = 'OK', onCta = null }) {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.72);z-index:9000;display:flex;align-items:center;justify-content:center;padding:var(--s4)';
    overlay.innerHTML = `
      <div style="background:var(--bg-panel,#1a1a2e);border:1px solid var(--border);border-radius:var(--r-lg,12px);padding:var(--s6);max-width:420px;width:100%;text-align:center;box-shadow:0 24px 80px rgba(0,0,0,.8)">
        <div style="font-size:2.5rem;margin-bottom:var(--s3)">${icon}</div>
        <div style="font-family:var(--font-display);font-size:var(--text-xl);font-weight:700;margin-bottom:var(--s3);color:var(--text)">${title}</div>
        <div style="font-size:var(--text-sm);color:var(--text-muted);line-height:1.6;margin-bottom:var(--s5)">${body}</div>
        <button id="event-modal-cta" class="btn btn-primary" style="width:100%">${ctaLabel}</button>
      </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById('event-modal-cta').addEventListener('click', () => {
      overlay.remove();
      if (onCta) onCta();
    });
  }

  showVCEvent(state) {
    this.showEventModal({
      icon: '💼',
      title: 'Investor Interest',
      body: `Meridian Capital: <em>"We've been watching your growth across ${state.unlockedDistricts.length} districts. We'd like to talk."</em><br><br>Open the <strong>Management tab</strong> to evaluate the VC offer.`,
      ctaLabel: 'Go to Management',
      onCta: () => this.showManagement(),
    });
  }

  showAcquisitionOffer(state) {
    const offer = Math.round(state.monthlyRevenue * 24);
    this.showEventModal({
      icon: '🏢',
      title: 'Acquisition Offer',
      body: `RegionPro Agency wants to acquire <strong>${state.businessName}</strong> for <strong style="color:var(--gold)">$${offer.toLocaleString()}</strong>.<br><br>This is a <em>life-changing</em> decision. Open <strong>Management</strong> to review the terms and decide.`,
      ctaLabel: 'Review the Offer',
      onCta: () => this.showManagement(),
    });
  }

  // ── Utilities ──────────────────────────────────────────────
  showToast(msg, type = 'default') {
    const container = this.el.toastContainer;
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastIn 0.3s reverse forwards';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  showWisdomToast(wisdom) {
    if (!wisdom) return;
    const existing = document.getElementById('wisdom-banner');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.id = 'wisdom-banner';
    el.style.cssText = `
      position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(20px);
      max-width:480px;width:calc(100% - 32px);
      background:#1a1608;border:1px solid rgba(248,200,64,0.35);border-radius:12px;
      padding:14px 16px;z-index:9999;opacity:0;
      transition:opacity .35s ease,transform .35s ease;
      box-shadow:0 4px 24px rgba(0,0,0,0.6);
    `;
    el.innerHTML = `
      <div style="font-size:10px;color:#c8a820;text-transform:uppercase;letter-spacing:.1em;font-weight:700;margin-bottom:6px">💡 Think &amp; Grow Rich — ${wisdom.principle}</div>
      <div style="font-size:12px;color:#e8d898;font-style:italic;line-height:1.6;margin-bottom:6px">"${wisdom.quote}"</div>
      <div style="font-size:11px;color:#888;line-height:1.45"><strong style="color:#aaa">Apply today:</strong> ${wisdom.apply}</div>
      <button style="position:absolute;top:8px;right:10px;background:none;border:none;color:#666;font-size:14px;cursor:pointer;padding:2px 4px" id="btn-dismiss-wisdom">✕</button>
    `;
    document.body.appendChild(el);

    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateX(-50%) translateY(0)';
    });

    const dismiss = () => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(-50%) translateY(10px)';
      setTimeout(() => el.remove(), 350);
    };
    document.getElementById('btn-dismiss-wisdom')?.addEventListener('click', dismiss);
    setTimeout(dismiss, 9000);
  }

  updateDebug(_data) {
    // Debug overlay disabled in production
  }
}
