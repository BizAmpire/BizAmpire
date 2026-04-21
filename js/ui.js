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
    const rapportDisplay = enc.rapport > 0 ? `<span style="color:var(--sage)">+${enc.rapport.toFixed(1)} Rapport</span>` : '';

    body.innerHTML = `
      <div class="dialogue-box">
        <div class="dialogue-speaker">${biz.owner} — ${biz.ownerTitle}</div>
        <div class="dialogue-text" id="dialogue-text">
          ${isWarm
            ? `"Hey! Good to see you again. What brings you by?"` 
            : `"${biz.owner} looks up from their desk. 'Can I help you?'"`}
        </div>
        ${enc.rapport > 0 ? `<div class="dialogue-sub">${rapportDisplay} from market research</div>` : ''}
      </div>
      <div class="choices" id="choices-container">
        <div style="font-size:var(--text-xs);color:var(--text-muted);padding:var(--s2) 0;text-transform:uppercase;letter-spacing:.08em;">Choose your opener</div>
        ${this._renderOpenerChoices(biz, state)}
      </div>
      <button class="btn btn-secondary" style="margin-top:var(--s3);align-self:flex-end" id="btn-exit-encounter">✕ Leave</button>
    `;

    body.querySelectorAll('.choice-btn[data-opener]').forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          const choice = JSON.parse(btn.dataset.choice || '{}');
          if (!this.encounterEngine) { console.error('[BizAmpire] encounterEngine not set on UI'); return; }
          this.encounterEngine.handleOpener(choice);
        } catch(e) { console.error('[BizAmpire] opener click error:', e); }
      });
    });

    document.getElementById('btn-exit-encounter')?.addEventListener('click', () => {
      this.closeEncounter();
    });
  }

  _renderOpenerChoices(biz, state) {
    const warmthLabel = ['cold','familiar','warm','advocate'][biz.warmth] || 'cold';
    const hasPatternInterrupt = state.unlockedSkills.includes('pattern_interrupt');
    const serviceLabels = {
      it: 'IT & managed services', marketing: 'marketing & lead generation',
      finance: 'accounting & financial advisory', law: 'legal services',
      construction: 'construction & renovations', auto: 'auto & fleet services',
      realestate: 'real estate & property management', health: 'healthcare services',
      consulting: 'operations consulting',
    };

    const _indId = state.businessIndustry?.id || state.businessIndustry;
    const choices = [
      {
        text: `"Hi, I'm ${state.businessName} — we provide ${serviceLabels[_indId] || 'business services'} to companies in this area. Do you have 2 minutes?"`,
        rapport: 0,
        label: 'Generic opener',
        badge: null,
        technique: null,
      },
      {
        text: `"I work with ${pluralize(biz.type)} specifically on ${biz.pain?.split(' ').slice(0,6).join(' ')}... I've helped a few businesses in this district with exactly that — mind if I ask one quick question?"`,
        rapport: 1,
        label: 'Pain-specific opener',
        badge: 'Targeted',
        technique: 'Pattern Interrupt',
        requiresSkill: 'pattern_interrupt',
      },
      {
        text: `"Quick question — when it comes to ${serviceLabels[_indId] || 'what we do'}, what's your biggest frustration right now with how you're handling it?"`,
        rapport: biz.warmth >= 1 ? 2 : 0,
        label: warmthLabel === 'cold' ? 'Direct (risky cold)' : 'Direct (warm relationship)',
        badge: warmthLabel !== 'cold' ? 'Relationship Capital' : null,
        technique: 'Direct Discovery',
      },
    ];

    return choices.map((c, i) => {
      const locked = c.requiresSkill && !state.unlockedSkills.includes(c.requiresSkill);
      return `
        <button class="choice-btn ${c.badge ? 'technique' : ''} ${locked ? 'locked' : ''}" 
                data-opener="${i}" 
                data-choice='${JSON.stringify({rapport: c.rapport, technique: c.technique})}'
                ${locked ? 'disabled' : ''}>
          <span class="choice-key">${i+1}</span>
          <div class="choice-body">
            <span class="choice-text">${c.text}</span>
            ${c.badge ? `<span class="choice-badge">${c.badge}</span>` : ''}
            ${locked ? `<span class="choice-badge" style="color:var(--text-muted);background:var(--surface)">🔒 Needs ${c.requiresSkill.replace(/_/g,' ')}</span>` : ''}
          </div>
        </button>
      `;
    }).join('');
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

    // Use pre-generated industry-aware questions cached at encounter start in engine.js
    const questions = enc.stateFlags?.generatedQuestions || DISCOVERY_QUESTIONS;
    const q = questions[questionIdx];
    if (!q) {
      // No more questions — advance to pitch
      if (window.__bizampireEngine) window.__bizampireEngine.encounterEngine?.handleDiscovery('_advance', 'good');
      return;
    }

    const biz = enc.business;
    const hasSkill = state.unlockedSkills.includes(q.skillTag);

    // Player service label for UI context
    const serviceLabels = {
      it: 'IT Services', marketing: 'Marketing', finance: 'Accounting/Finance',
      law: 'Legal Services', construction: 'Construction', auto: 'Auto/Fleet',
      realestate: 'Real Estate', health: 'Healthcare', consulting: 'Consulting',
    };
    const _indId2 = state.businessIndustry?.id || state.businessIndustry;
    const playerServiceLabel = serviceLabels[_indId2] || state.businessName;

    // Phase-keyed prospect implied reply lines — what the NPC says after your question
    const prospectReplies = {
      situation: [
        `"Yeah, I mean... it's been working alright. We make do."`,
        `"Honestly? We've never really looked at it that way before."`,
        `"It's fine. Nothing crazy going on there."`
      ],
      problem: [
        `"It comes up more than I'd like, honestly."`,
        `"Yeah, that's... actually been a bit of a headache."`,
        `"[pauses] More often than it should, probably."`
      ],
      implication: [
        `"Huh. When you put it like that... yeah, that adds up."`,
        `"I never actually looked at the total cost of it."`,
        `"[shifts] That's a real number. I didn't realize it was that much."`
      ],
      need_payoff: [
        `"I mean... if it actually did all that, yeah. That'd be huge."`,
        `"That would take a lot off my plate, honestly."`,
        `"[nods] Yeah. That's exactly what I'd want."`
      ]
    };
    const phaseReplies = prospectReplies[q.phase] || prospectReplies.situation;
    const prospectLine = phaseReplies[questionIdx % phaseReplies.length];

    body.innerHTML = `
      <div style="font-size:var(--text-xs);color:var(--text-muted);padding-bottom:var(--s2);text-transform:uppercase;letter-spacing:.08em">
        📍 ${q.framework} · ${biz.name}
        ${!hasSkill ? ` · <span style="color:var(--amber)">⚡ Unlock "${q.skillTag.replace(/_/g,' ')}" for bonus Rapport</span>` : ''}
      </div>

      <!-- YOU SAY -->
      <div class="dialogue-box player-dialogue" style="background:rgba(79,152,163,0.08);border-color:var(--teal,#4f98a3);margin-bottom:var(--s3)">
        <div class="dialogue-speaker" style="color:var(--teal,#4f98a3)">You → ${biz.owner}</div>
        <div class="dialogue-text">${this._subQText(q.question, biz)}</div>
      </div>

      <!-- THEY SAY -->
      <div class="dialogue-box" style="margin-bottom:var(--s3)">
        <div class="dialogue-speaker">${biz.owner} — ${biz.ownerTitle}</div>
        <div class="dialogue-text" style="font-style:italic">${prospectLine}</div>
      </div>

      <!-- YOUR FOLLOW-UP -->
      <div style="font-size:var(--text-xs);color:var(--text-muted);padding:var(--s2) 0;text-transform:uppercase;letter-spacing:.08em">
        How do you respond?
      </div>
      <div class="choices">
        <button class="choice-btn technique" data-response="good" data-qid="${q.skillTag}">
          <span class="choice-key">1</span>
          <div class="choice-body">
            <span class="choice-text">${this._subQText(q.goodResponse, biz)}</span>
            <span class="choice-badge">${hasSkill ? `+${q.rapportOnGood} Rapport` : 'Partial effect'}</span>
          </div>
        </button>
        <button class="choice-btn" data-response="bad" data-qid="${q.skillTag}">
          <span class="choice-key">2</span>
          <div class="choice-body">
            <span class="choice-text">${this._subQText(q.badResponse, biz)}</span>
            <span class="choice-badge" style="color:var(--text-muted);background:var(--surface)">Missed opportunity</span>
          </div>
        </button>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:var(--s3)">
        <div style="font-size:var(--text-xs);color:var(--text-muted)">Rapport: <strong style="color:${enc.rapport >= 3 ? 'var(--sage)' : enc.rapport >= 1 ? 'var(--amber)' : 'var(--text)'}">${enc.rapport.toFixed(1)}</strong></div>
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

    document.getElementById('btn-exit-encounter')?.addEventListener('click', () => {
      this.closeEncounter();
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
        <button class="choice-btn" data-pitch="bad">
          <span class="choice-key">1</span>
          <div class="choice-body">
            <span class="choice-text">"We're ${businessName}. We provide ${pitchServiceLabel} to businesses like ${biz.name}. We've helped similar companies and our clients see real results."</span>
          <span class="choice-badge" style="color:var(--text-muted);background:var(--surface)">Feature-led pitch</span>
          </div>
        </button>
        <button class="choice-btn technique" data-pitch="good">
          <span class="choice-key">2</span>
          <div class="choice-body">
            <span class="choice-text">"Based on what you told me — ${biz.pain || 'your growth challenge'} — that's exactly the problem our ${pitchServiceLabel} solves. We don't just deliver a service; we deliver a specific outcome: ${state.businessDescription || 'measurable results that compound'}. That's what I'd like to explore with you."</span>
          <span class="choice-badge">StoryBrand — outcome-led</span>
          </div>
        </button>
        ${hasChallenger ? `
        <button class="choice-btn technique" data-pitch="technique">
          <span class="choice-key">3</span>
          <div class="choice-body">
            <span class="choice-text">"Most ${pluralize(biz.type)} I work with think ${biz.pain?.split(' ').slice(0,5).join(' ')}... is the main problem. But in my experience delivering ${pitchServiceLabel}, what's really underneath it is a systems gap. Here's what the top performers in your space are doing differently."</span>
          <span class="choice-badge" style="color:var(--violet)">🔬 Challenger Insight</span>
          </div>
        </button>
        ` : ''}
      </div>
    `;

    body.querySelectorAll('.choice-btn[data-pitch]').forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          if (!this.encounterEngine) { console.error('[BizAmpire] encounterEngine not set'); return; }
          this.encounterEngine.handlePitch(btn.dataset.pitch);
        } catch(e) { console.error('[BizAmpire] pitch click error:', e); }
      });
    });
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
    const obj = objSet[0];

    body.innerHTML = `
      <div class="dialogue-box">
        <div class="dialogue-speaker">${biz.owner}</div>
        <div class="dialogue-text">"${obj.objection}"</div>
        <div class="dialogue-sub">Objection type: <strong style="color:var(--crimson)">${objectionType.charAt(0).toUpperCase() + objectionType.slice(1)}</strong> · Current Rapport: ${enc.rapport.toFixed(1)}</div>
      </div>
      <div style="font-size:var(--text-xs);color:var(--text-muted);padding:var(--s2) 0;text-transform:uppercase;letter-spacing:.08em">How do you respond?</div>
      <div class="choices">
        ${Object.entries(obj.counters).map(([key, c], i) => {
          const locked = c.skillRequired && !state.unlockedSkills.includes(c.skillRequired);
          return `
            <button class="choice-btn ${c.rapport > 1 ? 'technique' : ''} ${locked ? 'locked' : ''}"
                    data-objection="${objectionType}" data-response="${key}"
                    ${locked ? 'disabled' : ''}>
              <span class="choice-key">${i+1}</span>
              <div class="choice-body">
                <span class="choice-text">${c.text.replace('{impliedCost}', `$${Math.round(biz.budget[0]*0.5).toLocaleString()}/month`).replace('{impliedAnnual}', `$${(biz.budget[0]*0.5*12).toLocaleString()}`).replace('{price}', enc.stateFlags?.price ? `$${enc.stateFlags.price.toLocaleString()}/mo` : 'our fee')}</span>
                ${c.framework ? `<span class="choice-badge" style="color:var(--violet);background:rgba(155,114,248,0.1)">${c.framework}</span>` : ''}
                <span class="choice-badge ${c.rapport <= 0 ? 'style="color:var(--crimson);background:rgba(255,68,102,.1)"' : ''}">${c.label}</span>
                ${locked ? `<span class="choice-badge" style="color:var(--text-muted);background:var(--surface)">🔒 Requires ${c.skillRequired?.replace(/_/g,' ')}</span>` : ''}
              </div>
            </button>
          `;
        }).join('')}
      </div>
    `;

    body.querySelectorAll('.choice-btn[data-objection]').forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          if (!this.encounterEngine) { console.error('[BizAmpire] encounterEngine not set'); return; }
          this.encounterEngine.handleObjection(btn.dataset.objection, btn.dataset.response);
        } catch(e) { console.error('[BizAmpire] objection click error:', e); }
      });
    });
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
        <button class="choice-btn technique" data-close="close_direct">
          <span class="choice-key">1</span>
          <div class="choice-body">
            <span class="choice-text">"Based on everything we discussed, I'd love to move forward. Can we get started this month for $${price.toLocaleString()}/mo?"</span>
          <span class="choice-badge">Direct Close — then silence</span>
          </div>
        </button>
        <button class="choice-btn technique" data-close="pilot_offer">
          <span class="choice-key">2</span>
          <div class="choice-body">
            <span class="choice-text">"What if we do a 30-day pilot — reduced scope, specific metrics. If we hit them, we scale. No risk on your end."</span>
          <span class="choice-badge">Lean Startup — MVP Pilot</span>
          </div>
        </button>
        <button class="choice-btn" data-close="schedule_followup">
          <span class="choice-key">3</span>
          <div class="choice-body">
            <span class="choice-text">"I don't want to rush you. Can we schedule a follow-up this week to get your questions answered?"</span>
          <span class="choice-badge" style="color:var(--text-muted);background:var(--surface)">Soft close — lower odds</span>
          </div>
        </button>
      </div>
    `;

    body.querySelectorAll('.choice-btn[data-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          if (!this.encounterEngine) { console.error('[BizAmpire] encounterEngine not set'); return; }
          this.encounterEngine.resolveEncounter(btn.dataset.close);
        } catch(e) { console.error('[BizAmpire] close click error:', e); }
      });
    });
  }

  showOutcome(type, biz, price, rapport) {
    const body = document.getElementById('encounter-body');
    if (!body) return;

    const outcomes = {
      closed: {
        icon: '🤝', title: 'Deal Closed!', className: 'win',
        body: `${biz.owner} extends their hand. "${biz.name} is in — let's make this work." You've closed your first deal in this district.`,
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
        <button class="btn btn-primary" id="btn-return-city" style="margin-top:var(--s4)">Return to City →</button>
      </div>
    `;

    document.getElementById('btn-return-city')?.addEventListener('click', () => {
      this.closeEncounter();
    });
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
          <div style="font-size:var(--text-2xl);font-family:var(--font-display);font-weight:700;color:${state.monthlyRevenue - state.monthlyOverhead > 0 ? 'var(--sage)' : 'var(--crimson)'}">$${(state.monthlyRevenue - state.monthlyOverhead).toLocaleString()}</div>
          <div style="font-size:var(--text-xs);color:var(--text-muted)">Net Profit</div>
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

  showVCEvent(state) {
    this.showToast(`💼 Meridian Capital: "We've been watching your growth in ${state.unlockedDistricts.length} districts. Can we talk?" — Check Management tab.`, 'gold');
  }

  showAcquisitionOffer(state) {
    const offer = Math.round(state.monthlyRevenue * 24);
    this.showToast(`🤝 RegionPro Agency offers $${offer.toLocaleString()} to acquire ${state.businessName}. Go to Management to evaluate.`, 'amber');
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

  updateDebug(_data) {
    // Debug overlay disabled in production
  }
}
