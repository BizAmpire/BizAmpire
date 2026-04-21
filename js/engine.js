// ═══════════════════════════════════════════════════════════
//  BizAmpire: Street Level — Game Engine
//  City map, player movement, encounter triggers
// ═══════════════════════════════════════════════════════════

import {
  DISTRICTS, SKILL_TREE, ENCOUNTER_PHASES, OBJECTION_LIBRARY,
  DISCOVERY_QUESTIONS, OPENER_SCRIPTS, MILESTONES, JOURNAL_PROMPTS,
  COMPETITORS, EMPLOYEE_ARCHETYPES, createInitialState
} from './data.js';

// ── Constants ────────────────────────────────────────────────
const TILE = 48;
const MAP_W = 60;
const MAP_H = 40;
const PLAYER_SPEED = 3.5;

// ── City Map Generation ──────────────────────────────────────
function generateCityMap() {
  const map = [];

  // Terrain types: 0=road, 1=sidewalk, 2=building, 3=park, 4=water
  for (let y = 0; y < MAP_H; y++) {
    map[y] = [];
    for (let x = 0; x < MAP_W; x++) {
      const isRoadH = (y % 8 === 4 || y % 8 === 5);
      const isRoadV = (x % 10 === 5 || x % 10 === 6);
      if (isRoadH || isRoadV) map[y][x] = 0;
      else if (isRoadH || isRoadV) map[y][x] = 1;
      else map[y][x] = 2;
    }
  }

  // Add sidewalks adjacent to roads
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      if (map[y][x] === 2) {
        const adj = [[y-1,x],[y+1,x],[y,x-1],[y,x+1]];
        if (adj.some(([ny,nx]) => ny>=0 && ny<MAP_H && nx>=0 && nx<MAP_W && map[ny][nx]===0)) {
          map[y][x] = 1;
        }
      }
    }
  }

  return map;
}

// District building placement
function buildDistrictBlocks() {
  const blocks = [];
  DISTRICTS.forEach(d => {
    const cx = Math.floor(d.x * MAP_W);
    const cy = Math.floor(d.y * MAP_H);
    d.businesses.forEach((biz, i) => {
      const angle = (i / d.businesses.length) * Math.PI * 2;
      const radius = 4 + (i % 2) * 2;
      const bx = cx + Math.round(Math.cos(angle) * radius);
      const by = cy + Math.round(Math.sin(angle) * radius);
      blocks.push({
        x: Math.max(1, Math.min(MAP_W - 3, bx)),
        y: Math.max(1, Math.min(MAP_H - 3, by)),
        w: 2, h: 2,
        districtId: d.id,
        districtColor: d.color,
        business: biz,
      });
    });
    // District sign
    blocks.push({
      x: cx, y: cy,
      w: 1, h: 1,
      type: 'sign',
      districtId: d.id,
      districtColor: d.color,
      districtName: d.name,
    });
  });
  return blocks;
}

// ── Main Game Engine Class ────────────────────────────────────
export class BizAmpireEngine {
  constructor(canvas, state, ui) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.state = state;
    this.ui = ui;

    // Camera
    this.cam = { x: 0, y: 0 };

    // Player
    this.player = {
      x: MAP_W / 2 * TILE,
      y: MAP_H / 2 * TILE,
      vx: 0, vy: 0,
      facing: 'down',
      animFrame: 0,
      animTimer: 0,
    };

    // Map
    this.map = generateCityMap();
    this.buildings = buildDistrictBlocks();

    // Competitor agents — stagger timer so they don't all pick targets at once
    this.competitorAgents = COMPETITORS.map((c, i) => ({
      ...c,
      x: (MAP_W / 2 + (Math.random() - 0.5) * 10) * TILE,
      y: (MAP_H / 2 + (Math.random() - 0.5) * 10) * TILE,
      targetX: undefined,
      targetY: undefined,
      _stealTarget: null,
      timer: i * 1.5, // stagger: comp0 picks after 4s, comp1 after 2.5s, etc.
    }));

    // Input
    this.keys = {};
    this.lastFrameTime = 0;
    this.fps = 60;
    this.frameTime = 0;
    this.running = false;
    this.rafId = null;

    // Interaction
    this.nearbyBuilding = null;
    this.interactCooldown = 0;

    // Day/month simulation
    this.dayTimer = 0;
    this.DAY_DURATION = 30000; // 30s = 1 in-game day

    // Minimap canvas
    this.minimapCanvas = document.getElementById('minimap-canvas');
    this.minimapCtx = this.minimapCanvas ? this.minimapCanvas.getContext('2d') : null;

    this._bindInput();
  }

  _bindInput() {
    const ac = new AbortController();
    this._inputAbort = ac;
    window.addEventListener('keydown', e => {
      this.keys[e.key.toLowerCase()] = true;
      if (e.key === 'e' || e.key === 'Enter') this._tryInteract();
      if (e.key === 'k') this.ui.showSkillTree();
      if (e.key === 'j') this.ui.showJournal();
      if (e.key === 'm') this.ui.showManagement();
    }, { signal: ac.signal });
    window.addEventListener('keyup', e => {
      this.keys[e.key.toLowerCase()] = false;
    }, { signal: ac.signal });

    // Touch/click for buildings
    this.canvas.addEventListener('click', e => {
      const rect = this.canvas.getBoundingClientRect();
      const wx = (e.clientX - rect.left) * (this.canvas.width / rect.width) + this.cam.x;
      const wy = (e.clientY - rect.top) * (this.canvas.height / rect.height) + this.cam.y;
      const bld = this._getBuildingAt(wx, wy);
      if (bld && bld.business) {
        this._startEncounter(bld.business);
      }
    }, { signal: ac.signal });
  }

  start() {
    this.running = true;
    this.lastFrameTime = performance.now();
    const loop = (ts) => {
      if (!this.running) return;
      this.rafId = requestAnimationFrame(loop);
      const raw = Math.min(ts - this.lastFrameTime, 100) / 1000;
      this.lastFrameTime = ts;
      this.frameTime = raw;
      this.fps = 1 / raw;
      this.update(raw);
      this.render();
    };
    this.rafId = requestAnimationFrame(loop);
    // Force an immediate render so the first frame shows before RAF fires
    this.render();
  }

  stop() {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this._inputAbort) this._inputAbort.abort();
  }

  update(dt) {
    // Player movement
    let dx = 0, dy = 0;
    if (this.keys['a'] || this.keys['arrowleft'])  dx -= 1;
    if (this.keys['d'] || this.keys['arrowright']) dx += 1;
    if (this.keys['w'] || this.keys['arrowup'])    dy -= 1;
    if (this.keys['s'] || this.keys['arrowdown'])  dy += 1;

    if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }

    const speed = PLAYER_SPEED * TILE;
    const nx = this.player.x + dx * speed * dt;
    const ny = this.player.y + dy * speed * dt;

    // Collision
    if (!this._collides(nx, this.player.y)) this.player.x = nx;
    if (!this._collides(this.player.x, ny)) this.player.y = ny;

    // Clamp to map
    this.player.x = Math.max(TILE, Math.min((MAP_W - 2) * TILE, this.player.x));
    this.player.y = Math.max(TILE, Math.min((MAP_H - 2) * TILE, this.player.y));

    if (dx > 0) this.player.facing = 'right';
    else if (dx < 0) this.player.facing = 'left';
    else if (dy < 0) this.player.facing = 'up';
    else if (dy > 0) this.player.facing = 'down';

    // Animation
    if (dx !== 0 || dy !== 0) {
      this.player.animTimer += dt;
      if (this.player.animTimer > 0.15) {
        this.player.animFrame = (this.player.animFrame + 1) % 4;
        this.player.animTimer = 0;
      }
    } else {
      this.player.animFrame = 0;
    }

    // Camera tracks player
    const cw = this.canvas.width, ch = this.canvas.height;
    this.cam.x = Math.max(0, Math.min(MAP_W * TILE - cw, this.player.x - cw / 2));
    this.cam.y = Math.max(0, Math.min(MAP_H * TILE - ch, this.player.y - ch / 2));

    // Check nearby buildings
    this.nearbyBuilding = this._getNearbyBuilding();

    // Competitor movement
    this._updateCompetitors(dt);

    // Day timer
    this.dayTimer += dt;
    if (this.dayTimer >= this.DAY_DURATION / 1000) {
      this.dayTimer = 0;
      this._advanceDay();
    }

    // Interact cooldown
    if (this.interactCooldown > 0) this.interactCooldown -= dt;

    // Update minimap (guarded — method may not be defined)
    if (typeof this._drawMinimap === 'function') this._drawMinimap();

    // Update debug
    this.ui.updateDebug({
      fps: this.fps,
      frameTime: this.frameTime * 1000,
      cam: this.cam,
      player: this.player,
      nearby: this.nearbyBuilding?.business?.name || 'None',
    });
  }

  _collides(px, py) {
    const tx = Math.floor(px / TILE);
    const ty = Math.floor(py / TILE);
    if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return true;

    // Check buildings
    const pw = 28;
    for (const b of this.buildings) {
      if (b.type === 'sign') continue;
      const bx = b.x * TILE, by = b.y * TILE;
      const bw = b.w * TILE, bh = b.h * TILE;
      if (px + pw/2 > bx && px - pw/2 < bx + bw &&
          py + pw/2 > by && py - pw/2 < by + bh) {
        return true;
      }
    }
    return false;
  }

  _getNearbyBuilding() {
    const range = TILE * 2.2;
    for (const b of this.buildings) {
      if (b.type === 'sign') continue;
      const bx = (b.x + b.w / 2) * TILE;
      const by = (b.y + b.h / 2) * TILE;
      const dist = Math.hypot(this.player.x - bx, this.player.y - by);
      if (dist < range) return b;
    }
    return null;
  }

  _getBuildingAt(wx, wy) {
    for (const b of this.buildings) {
      if (wx >= b.x * TILE && wx < (b.x + b.w) * TILE &&
          wy >= b.y * TILE && wy < (b.y + b.h) * TILE) {
        return b;
      }
    }
    return null;
  }

  _tryInteract() {
    if (this.interactCooldown > 0) return;
    const bld = this.nearbyBuilding;
    if (bld && bld.business) {
      this.interactCooldown = 0.5;
      this._startEncounter(bld.business);
    }
  }

  _startEncounter(business) {
    if (business.cooldownDays > 0) {
      this.ui.showToast(`${business.owner} is still cooling off. Come back in ${business.cooldownDays} day${business.cooldownDays > 1 ? 's' : ''}.`, 'warn');
      return;
    }
    if (business.closed) {
      this.ui.showToast(`${business.name} is already a client!`, 'success');
      return;
    }
    if (business.lostToCompetitor) {
      this.ui.showToast(`${business.name} signed with a competitor. You waited too long.`, 'danger');
      return;
    }

    // Check district unlocked
    const district = DISTRICTS.find(d => d.businesses.some(b => b.id === business.id));
    if (district && !this.state.unlockedDistricts.includes(district.id)) {
      this.ui.showToast(`${district.name} is locked. Build more reputation first.`, 'warn');
      return;
    }

    this.state.currentEncounter = {
      business,
      phase: 'recon',
      rapport: 0,
      stateFlags: {
        didRecon: false,
        openerQuality: 'cold',
        discoveryScore: 0,
        spinPhase: 0,
        pricingSet: false,
        price: null,
        objections: [],
        resolved: [],
      },
    };
    this.ui.showEncounter(business, this.state);
  }

  _updateCompetitors(dt) {
    const COMP_SPEED = TILE * 1.2; // ~1.2 tiles per second (slightly slower walk)
    const ARRIVE_DIST = TILE * 0.8; // mark stolen when this close
    const WANDER_INTERVAL = 12; // seconds before picking a new destination (gives player time to react)

    this.competitorAgents.forEach(comp => {
      comp.timer += dt;

      // ── Movement toward current target ──────────────────────
      if (comp.targetX !== undefined && comp.targetY !== undefined) {
        const dx = comp.targetX - comp.x;
        const dy = comp.targetY - comp.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 2) {
          const spd = Math.min(COMP_SPEED * dt, dist);
          comp.x += (dx / dist) * spd;
          comp.y += (dy / dist) * spd;
        } else {
          // Arrived — resolve steal or wander point
          comp.x = comp.targetX;
          comp.y = comp.targetY;
          if (comp._stealTarget) {
            const biz = comp._stealTarget;
            if (!biz.closed && !biz.lostToCompetitor) {
              biz.lostToCompetitor = true;
              this.ui.showToast(`${comp.name} just closed ${biz.name}! Don't wait too long.`, 'danger');
            }
            comp._stealTarget = null;
          }
          // Clear so we pick a new destination next frame
          comp.targetX = undefined;
          comp.targetY = undefined;
        }
      }

      // ── Pick new destination every WANDER_INTERVAL seconds ──
      if (comp.timer < WANDER_INTERVAL) return;
      comp.timer = 0;

      // Try to find an unclosed, unguarded prospect to walk toward
      let pickedTarget = false;
      const protected_ = this.state.unlockedSkills.includes('blue_ocean');
      for (const district of DISTRICTS) {
        if (!this.state.unlockedDistricts.includes(district.id)) continue;
        for (const biz of district.businesses) {
          if (biz.closed || biz.lostToCompetitor || biz.cooldownDays > 0) continue;
          if (biz.warmth > 2) continue; // Player has relationship — harder to poach
          const roll = Math.random();
          const aggressionChance = comp.aggressionLevel * 0.018; // ~14% max for most aggressive NPC per decision window
          if (!protected_ && roll < aggressionChance) {
            // Find the building on the map that matches this biz
            const bldg = this.buildings.find(b => b.business === biz);
            if (bldg) {
              comp.targetX = (bldg.x + bldg.w / 2) * TILE;
              comp.targetY = (bldg.y + bldg.h / 2) * TILE;
              comp._stealTarget = biz;
              pickedTarget = true;
              break;
            }
          }
        }
        if (pickedTarget) break;
      }

      // If no steal target, wander to a random road tile
      if (!pickedTarget) {
        const roadTiles = [];
        for (let ty = 1; ty < MAP_H - 1; ty++) {
          for (let tx = 1; tx < MAP_W - 1; tx++) {
            if (this.map[ty]?.[tx] === 0) roadTiles.push({ tx, ty });
          }
        }
        if (roadTiles.length > 0) {
          const pick = roadTiles[Math.floor(Math.random() * roadTiles.length)];
          comp.targetX = (pick.tx + 0.5) * TILE;
          comp.targetY = (pick.ty + 0.5) * TILE;
        }
      }
    });
  }

  _advanceDay() {
    this.state.monthTimer++;
    this.state.daysSinceLastDeal++;

    // Monthly finances
    if (this.state.monthTimer >= 30) {
      this.state.monthTimer = 0;
      const revenue = this.state.activeClients.reduce((sum, c) => sum + (c.monthlyValue || 0), 0);
      this.state.monthlyRevenue = revenue;
      this.state.cash += revenue;
      this.state.cash -= this.state.monthlyOverhead;

      // Employee costs
      this.state.employees.forEach(emp => {
        this.state.cash -= emp.cost;
      });

      // Passive leads from traction skill
      if (this.state.unlockedSkills.includes('traction_channel')) {
        const passiveCount = 2;
        this.ui.showToast(`📡 Traction: ${passiveCount} inbound leads this month!`, 'gold');
      }

      // Survival mode
      if (this.state.cash < this.state.monthlyOverhead * 2) {
        this.state.survivalMode = true;
        this.ui.showSurvivalBanner(true);
        this.ui.showToast('⚠️ Cash flow critical — close a deal this week!', 'danger');
      } else if (this.state.survivalMode && this.state.cash > this.state.monthlyOverhead * 4) {
        this.state.survivalMode = false;
        this.ui.showSurvivalBanner(false);
        this.ui.showToast('💪 You made it out of survival mode!', 'success');
      }

      this.ui.updateHUD(this.state);
    }

    // Random employee event
    if (this.state.employees.length > 0 && Math.random() < 0.04) {
      const emp = this.state.employees[Math.floor(Math.random() * this.state.employees.length)];
      this._triggerEmployeeEvent(emp);
    }
  }

  _triggerEmployeeEvent(employee) {
    const events = [
      { msg: `${employee.name} made an error on a client report. A client is unhappy.`, type: 'danger', reputationHit: -10 },
      { msg: `${employee.name} proactively solved a client issue. Reputation +5!`, type: 'success', reputationHit: 5 },
      { msg: `${employee.name} is asking for a raise. Their skill has grown.`, type: 'warn', reputationHit: 0 },
    ];
    const hasSOPs = this.state.unlockedSkills.includes('lean_operations');
    const event = events[Math.floor(Math.random() * (hasSOPs ? 1.5 : events.length))];
    this.state.reputation = Math.max(0, Math.min(1000, this.state.reputation + event.reputationHit));
    this.ui.showToast(event.msg, event.type);
    this.ui.updateHUD(this.state);
  }

  closeDeal(business, revenue, rapport) {
    business.closed = true;
    this.state.totalDeals++;
    this.state.activeClients.push({
      ...business,
      monthlyValue: revenue,
      closedAt: this.state.totalDeals,
      closingRapport: rapport,
    });
    this.state.cash += revenue;
    this.state.xp += 100 + rapport * 20;
    this.state.reputation += 25 + rapport * 5;
    this.state.daysSinceLastDeal = 0;
    this.state.skillPoints += 1;

    // Level up check
    const xpNeeded = this.state.level * 250;
    if (this.state.xp >= xpNeeded) {
      this.state.level++;
      this.state.skillPoints += 2;
      this.ui.showToast(`🎉 Level Up! Now Level ${this.state.level}. +2 Skill Points!`, 'gold');
    }

    // Milestone check
    this._checkMilestones();
    this.ui.updateHUD(this.state);
  }

  lostDeal(business, reason) {
    business.cooldownDays = 5 + (this.state.survivalMode ? 3 : 0);
    this.state.reputation = Math.max(0, this.state.reputation - 5);
    this.state.cash = Math.max(0, this.state.cash - 50); // Time cost
    this.ui.updateHUD(this.state);
  }

  _checkMilestones() {
    for (const m of MILESTONES) {
      if (this.state.totalDeals >= m.deals && !this.state.milestonesReached.includes(m.deals)) {
        this.state.milestonesReached.push(m.deals);
        this.ui.showMilestone(m);
        this._applyMilestoneUnlock(m.unlocks, m.event);
      }
    }
  }

  _applyMilestoneUnlock(unlock, event) {
    if (unlock === 'first_hire') {
      this.ui.showToast('🏢 Employee hiring is now available. Go to Management (M).', 'gold');
    }
    if (unlock === 'district_2') {
      const locked = DISTRICTS.filter(d => !this.state.unlockedDistricts.includes(d.id));
      if (locked.length > 0) {
        this.state.unlockedDistricts.push(locked[0].id);
        this.ui.showToast(`🗺️ ${locked[0].name} is now accessible!`, 'gold');
      }
    }
    if (event === 'vc_approach') {
      setTimeout(() => this.ui.showVCEvent(this.state), 2000);
    }
    if (event === 'acquisition') {
      setTimeout(() => this.ui.showAcquisitionOffer(this.state), 2000);
    }
  }

  unlockSkill(skillId) {
    if (this.state.unlockedSkills.includes(skillId)) return;
    const skill = this._findSkill(skillId);
    if (!skill) return;
    if (this.state.skillPoints < skill.cost / 100) {
      this.ui.showToast('Not enough Skill Points!', 'warn');
      return;
    }
    const prereqsMet = skill.prereq.every(p => this.state.unlockedSkills.includes(p));
    if (!prereqsMet) {
      this.ui.showToast('Prerequisites not met!', 'warn');
      return;
    }
    this.state.unlockedSkills.push(skillId);
    this.state.skillPoints -= Math.ceil(skill.cost / 100);
    this.ui.showToast(`✨ Unlocked: ${skill.name}!`, 'gold');
    this.ui.updateHUD(this.state);
    this.ui.renderSkillTree(this.state);
  }

  _findSkill(id) {
    for (const branch of Object.values(SKILL_TREE)) {
      const s = branch.skills.find(sk => sk.id === id);
      if (s) return s;
    }
    return null;
  }

  hireEmployee(archetypeId) {
    const archetype = EMPLOYEE_ARCHETYPES.find(e => e.id === archetypeId);
    if (!archetype) return;
    if (this.state.cash < archetype.cost * 3) {
      this.ui.showToast('Not enough cash to make this hire!', 'danger');
      return;
    }
    const employee = {
      ...archetype,
      name: generateEmployeeName(),
      joinedAt: this.state.totalDeals,
      performance: archetype.reliability / 5,
    };
    this.state.employees.push(employee);
    this.ui.showToast(`👋 ${employee.name} joined your team as ${employee.name}!`, 'success');
    this.ui.showToast(`💡 E-Myth lesson: ${archetype.emythLesson}`, 'gold');
    this.ui.updateHUD(this.state);
  }

  addJournalEntry(text, context) {
    const entry = {
      id: Date.now(),
      text,
      context,
      createdAt: new Date().toLocaleDateString(),
      done: false,
    };
    this.state.journalEntries.unshift(entry);
    return entry;
  }

  completeJournalEntry(id) {
    const entry = this.state.journalEntries.find(e => e.id === id);
    if (entry) {
      entry.done = true;
      this.state.xp += 50;
      this.ui.showToast('📓 Field Journal commitment completed! +50 XP', 'gold');
      this.ui.updateHUD(this.state);
    }
  }

  // ── Render ─────────────────────────────────────────────────
  render() {
    // Iframe safety: canvas may be zero-sized on first paint — resize if needed
    if (this.canvas.width < 10 || this.canvas.height < 10) {
      const w = window.innerWidth  || document.documentElement.clientWidth  || document.body.clientWidth  || 800;
      const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 600;
      this.canvas.width  = Math.max(w, 320);
      this.canvas.height = Math.max(h, 240);
    }
    const ctx = this.ctx;
    const cw = this.canvas.width, ch = this.canvas.height;
    ctx.clearRect(0, 0, cw, ch);

    ctx.save();
    ctx.translate(-this.cam.x, -this.cam.y);

    this._drawGround(ctx);
    this._drawBuildings(ctx);
    this._drawCompetitors(ctx);
    this._drawPlayer(ctx);

    if (this.nearbyBuilding && this.nearbyBuilding.business) {
      this._drawInteractPrompt(ctx, this.nearbyBuilding);
    }

    ctx.restore();
  }

  _drawGround(ctx) {
    const startTX = Math.floor(this.cam.x / TILE);
    const startTY = Math.floor(this.cam.y / TILE);
    const endTX = Math.min(MAP_W - 1, startTX + Math.ceil(this.canvas.width / TILE) + 1);
    const endTY = Math.min(MAP_H - 1, startTY + Math.ceil(this.canvas.height / TILE) + 1);

    for (let ty = startTY; ty <= endTY; ty++) {
      for (let tx = startTX; tx <= endTX; tx++) {
        if (ty < 0 || tx < 0) continue;
        const tile = this.map[ty]?.[tx] ?? 2;
        const px = tx * TILE, py = ty * TILE;

        if (tile === 0) {
          // Road surface - asphalt with slight texture
          ctx.fillStyle = '#16182a';
          ctx.fillRect(px, py, TILE, TILE);
          // Road markings - horizontal roads
          if (ty % 8 === 4 || ty % 8 === 5) {
            // Dashed center line
            if (tx % 6 < 3) {
              ctx.fillStyle = 'rgba(255,210,0,0.35)';
              ctx.fillRect(px + 2, py + TILE/2 - 1, TILE - 4, 2);
            }
            // Curb highlight at top of road
            if (ty % 8 === 4) {
              ctx.fillStyle = 'rgba(255,255,255,0.06)';
              ctx.fillRect(px, py, TILE, 2);
            }
          }
          // Vertical roads
          if (tx % 10 === 5 || tx % 10 === 6) {
            if (ty % 6 < 3) {
              ctx.fillStyle = 'rgba(255,210,0,0.35)';
              ctx.fillRect(px + TILE/2 - 1, py + 2, 2, TILE - 4);
            }
            if (tx % 10 === 5) {
              ctx.fillStyle = 'rgba(255,255,255,0.06)';
              ctx.fillRect(px, py, 2, TILE);
            }
          }
          // Intersection corners
          const isHRoad = ty % 8 === 4 || ty % 8 === 5;
          const isVRoad = tx % 10 === 5 || tx % 10 === 6;
          if (isHRoad && isVRoad) {
            ctx.fillStyle = '#1c1e30';
            ctx.fillRect(px + 4, py + 4, TILE - 8, TILE - 8);
            // Crosswalk stripes
            for (let s = 0; s < 4; s++) {
              ctx.fillStyle = 'rgba(255,255,255,0.12)';
              ctx.fillRect(px + 4 + s * 10, py + 2, 5, 4);
              ctx.fillRect(px + 4 + s * 10, py + TILE - 6, 5, 4);
              ctx.fillRect(px + 2, py + 4 + s * 10, 4, 5);
              ctx.fillRect(px + TILE - 6, py + 4 + s * 10, 4, 5);
            }
          }
        } else if (tile === 1) {
          // Sidewalk - concrete texture
          ctx.fillStyle = '#1f2235';
          ctx.fillRect(px, py, TILE, TILE);
          // Concrete joint lines
          ctx.strokeStyle = 'rgba(255,255,255,0.04)';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(px + 2, py + 2, TILE - 4, TILE - 4);
          // Small texture dots
          ctx.fillStyle = 'rgba(255,255,255,0.02)';
          ctx.fillRect(px + 8, py + 8, 3, 3);
          ctx.fillRect(px + 28, py + 20, 3, 3);
          ctx.fillRect(px + 16, py + 36, 3, 3);
        } else {
          // Empty lot / block interior - dark ground
          ctx.fillStyle = '#131525';
          ctx.fillRect(px, py, TILE, TILE);
        }
      }
    }
  }

  _drawBuildings(ctx) {
    // Sort so buildings closer to bottom (higher y) draw on top
    const sorted = [...this.buildings].sort((a, b) => a.y - b.y);

    for (const b of sorted) {
      const bx = b.x * TILE, by = b.y * TILE;
      const bw = b.w * TILE, bh = b.h * TILE;
      const color = b.districtColor;

      if (b.type === 'sign') {
        this._drawDistrictSign(ctx, b);
        continue;
      }

      const biz = b.business;
      const isLocked = !this.state.unlockedDistricts?.includes(b.districtId);
      const isClosed = biz?.closed;
      const isLostToComp = biz?.lostToCompetitor;
      const isNearby = this.nearbyBuilding === b;

      this._drawBuilding(ctx, bx, by, bw, bh, color, {
        isLocked, isClosed, isLostToComp, isNearby, biz,
      });
    }
  }

  _drawDistrictSign(ctx, b) {
    const bx = b.x * TILE, by = b.y * TILE;
    const color = b.districtColor;
    const W = TILE * 2, H = TILE * 0.7;

    // Post
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(bx + W/2 - 1, by + H, 2, TILE * 0.3);

    // Sign board with glow
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = color + '22';
    ctx.strokeStyle = color + '99';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(bx, by, W, H, 4);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // District name text
    ctx.fillStyle = color;
    ctx.font = 'bold 10px "General Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(b.districtName.toUpperCase(), bx + W / 2, by + H * 0.65);
  }

  _drawBuilding(ctx, bx, by, bw, bh, color, { isLocked, isClosed, isLostToComp, isNearby, biz }) {
    const T = TILE;

    // ── Ground shadow ────────────────────────────────
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.roundRect(bx + 5, by + 5, bw, bh, 4);
    ctx.fill();

    // ── Building state colors ────────────────────────
    let wallColor, roofColor, borderColor, glowColor;
    if (isLocked) {
      wallColor = '#1a1c2d'; roofColor = '#161826'; borderColor = '#2a2c3e'; glowColor = null;
    } else if (isClosed) {
      wallColor = '#132a18'; roofColor = '#0e2012'; borderColor = '#4ade80'; glowColor = '#4ade80';
    } else if (isLostToComp) {
      wallColor = '#2a1016'; roofColor = '#200c10'; borderColor = '#ff4466'; glowColor = '#ff4466';
    } else if (isNearby) {
      wallColor = color + '28'; roofColor = color + '18'; borderColor = color; glowColor = color;
    } else {
      wallColor = color + '12'; roofColor = color + '0a'; borderColor = color + '50'; glowColor = null;
    }

    // ── Glow on nearby/status ────────────────────────
    if (glowColor && (isNearby || isClosed)) {
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = isNearby ? 18 : 8;
    }

    // ── Main wall ────────────────────────────────────
    ctx.fillStyle = wallColor;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = isNearby ? 2 : 1;
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, 4);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    if (isLocked) {
      // Locked building — minimal, dark
      this._drawLockedBuilding(ctx, bx, by, bw, bh, color);
      return;
    }

    // ── Roof band ────────────────────────────────────
    ctx.fillStyle = roofColor || (color + '0a');
    ctx.fillRect(bx + 2, by + 2, bw - 4, T * 0.35);

    // ── Awning / storefront band ─────────────────────
    const awningY = by + bh - T * 0.55;
    const awningH = T * 0.22;
    ctx.fillStyle = isLostToComp ? 'rgba(255,68,102,0.25)' : isClosed ? 'rgba(74,222,128,0.18)' : (color + '30');
    ctx.fillRect(bx + 1, awningY, bw - 2, awningH);
    // Awning stripes
    for (let s = 0; s < 5; s++) {
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.fillRect(bx + 2 + s * (bw - 4) / 5, awningY, (bw - 4) / 10, awningH);
    }

    // ── Windows (2 rows) ─────────────────────────────
    const winRows = 2, winCols = bw > T * 2.5 ? 3 : 2;
    const winW = Math.floor((bw - 10) / winCols) - 2;
    const winH = Math.floor((awningY - by - T * 0.4) / winRows) - 3;
    const winStartY = by + T * 0.42;

    for (let r = 0; r < winRows; r++) {
      for (let c = 0; c < winCols; c++) {
        const wx = bx + 5 + c * ((bw - 10) / winCols) + 1;
        const wy = winStartY + r * (winH + 4);
        const lit = ((bx + by + r * 7 + c * 13) % 5) < 3; // deterministic "lights on"

        // Window frame
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(wx - 1, wy - 1, winW + 2, winH + 2);

        // Window glass
        if (isLostToComp) {
          ctx.fillStyle = 'rgba(255,68,102,0.15)';
        } else if (isClosed) {
          ctx.fillStyle = 'rgba(74,222,128,0.2)';
        } else if (lit) {
          ctx.fillStyle = color + '35';
        } else {
          ctx.fillStyle = 'rgba(10,12,24,0.8)';
        }
        ctx.fillRect(wx, wy, winW, winH);

        // Window reflection glint
        if (lit && !isLostToComp) {
          ctx.fillStyle = 'rgba(255,255,255,0.12)';
          ctx.fillRect(wx + 1, wy + 1, Math.floor(winW * 0.4), 2);
        }

        // Window frame outline
        ctx.strokeStyle = 'rgba(255,255,255,0.07)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(wx, wy, winW, winH);
      }
    }

    // ── Front door ───────────────────────────────────
    const doorW = T * 0.32, doorH = T * 0.4;
    const doorX = bx + bw / 2 - doorW / 2;
    const doorY = awningY - doorH;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(doorX, doorY, doorW, doorH);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(doorX, doorY, doorW, doorH);
    // Door handle
    ctx.fillStyle = color + 'aa';
    ctx.beginPath();
    ctx.arc(doorX + doorW * 0.7, doorY + doorH * 0.55, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // ── Business sign above awning ───────────────────
    const signY = awningY - 2;
    ctx.fillStyle = color + 'cc';
    ctx.font = 'bold 7px "General Sans", sans-serif';
    ctx.textAlign = 'center';
    const signText = biz?.name?.split(' ').slice(0, 2).join(' ') || '';
    ctx.fillText(signText, bx + bw / 2, signY);

    // ── Business icon ────────────────────────────────
    if (biz) {
      const iconSize = T * 0.42;
      ctx.font = `${iconSize}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText(biz.icon, bx + bw / 2, by + T * 0.34);
    }

    // ── Status overlay ───────────────────────────────
    if (isClosed) {
      ctx.fillStyle = 'rgba(74,222,128,0.9)';
      ctx.font = 'bold 7px "General Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✓ CLIENT', bx + bw / 2, by + bh - 4);
    } else if (isLostToComp) {
      ctx.fillStyle = 'rgba(255,68,102,0.9)';
      ctx.font = 'bold 7px "General Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✗ TAKEN', bx + bw / 2, by + bh - 4);
    }

    // ── Warmth dot ───────────────────────────────────
    if (biz && !isClosed && biz.warmth > 0) {
      const dotColors = ['#f5a623', '#ffd166', '#4ade80'];
      ctx.fillStyle = dotColors[Math.min(biz.warmth - 1, 2)];
      ctx.shadowColor = dotColors[Math.min(biz.warmth - 1, 2)];
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(bx + bw - 6, by + 6, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // ── Minimap ───────────────────────────────────────────────────
  _drawMinimap() {
    const mc = this.minimapCtx;
    if (!mc || !this.minimapCanvas) return;
    const mw = this.minimapCanvas.width;  // 140
    const mh = this.minimapCanvas.height; // 140
    const scaleX = mw / (MAP_W * TILE);
    const scaleY = mh / (MAP_H * TILE);

    // Background
    mc.clearRect(0, 0, mw, mh);
    mc.fillStyle = '#0c0d14';
    mc.fillRect(0, 0, mw, mh);

    // Road lines (thin grid)
    mc.strokeStyle = 'rgba(255,255,255,0.06)';
    mc.lineWidth = 0.5;
    for (let ty = 0; ty < MAP_H; ty++) {
      for (let tx = 0; tx < MAP_W; tx++) {
        if (this.map[ty]?.[tx] === 0) {
          mc.fillStyle = '#1c1e30';
          mc.fillRect(tx * TILE * scaleX, ty * TILE * scaleY, TILE * scaleX, TILE * scaleY);
        }
      }
    }

    // Buildings as colored dots
    this.buildings.forEach(b => {
      if (b.type === 'sign') return;
      const biz = b.business;
      let color;
      if (biz?.closed)              color = '#4ade80';
      else if (biz?.lostToCompetitor) color = '#ff4466';
      else                            color = b.districtColor || '#ffffff';
      mc.fillStyle = color + '80';
      mc.fillRect(
        b.x * TILE * scaleX,
        b.y * TILE * scaleY,
        b.w * TILE * scaleX,
        b.h * TILE * scaleY
      );
    });

    // Competitor agents as red dots
    this.competitorAgents.forEach(c => {
      mc.fillStyle = '#ff4466';
      mc.beginPath();
      mc.arc(c.x * scaleX, c.y * scaleY, 2.5, 0, Math.PI * 2);
      mc.fill();
    });

    // Player as teal dot
    mc.fillStyle = '#00d4c8';
    mc.shadowColor = '#00d4c8';
    mc.shadowBlur = 4;
    mc.beginPath();
    mc.arc(this.player.x * scaleX, this.player.y * scaleY, 3.5, 0, Math.PI * 2);
    mc.fill();
    mc.shadowBlur = 0;

    // Viewport rectangle
    mc.strokeStyle = 'rgba(255,255,255,0.25)';
    mc.lineWidth = 1;
    mc.strokeRect(
      this.cam.x * scaleX,
      this.cam.y * scaleY,
      this.canvas.width * scaleX,
      this.canvas.height * scaleY
    );
  }

  _drawLockedBuilding(ctx, bx, by, bw, bh, color) {
    // Darkened boarded-up look
    const T = TILE;
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.fillRect(bx + 4, by + 4, bw - 8, bh * 0.3);

    // Boarded windows (X pattern)
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        const wx = bx + 8 + c * (bw / 2 - 8);
        const wy = by + T * 0.4 + r * (T * 0.45);
        const ww = bw / 2 - 12, wh = T * 0.35;
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(wx, wy, ww, wh);
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(wx, wy); ctx.lineTo(wx + ww, wy + wh);
        ctx.moveTo(wx + ww, wy); ctx.lineTo(wx, wy + wh);
        ctx.stroke();
      }
    }

    // Lock icon
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🔒', bx + bw / 2, by + bh / 2 + 6);
  }

  // ── Player Character ─────────────────────────────────────────
  // Top-down person: head, suit jacket, arms, legs with walk cycle
  _drawPlayer(ctx) {
    const px = this.player.x;
    const py = this.player.y;
    const frame = this.player.animFrame;
    const facing = this.player.facing;

    // Walk cycle offsets
    const walk = this.player.animTimer > 0 || (this.keys && (this.keys['a'] || this.keys['d'] || this.keys['w'] || this.keys['s'] || this.keys['arrowleft'] || this.keys['arrowright'] || this.keys['arrowup'] || this.keys['arrowdown']));
    const legSwing = walk ? Math.sin(frame * Math.PI / 2) * 3 : 0;
    const armSwing = walk ? Math.cos(frame * Math.PI / 2) * 2.5 : 0;
    const bobY = walk ? Math.abs(Math.sin(frame * Math.PI / 2)) * -1.5 : 0;

    const oy = bobY; // vertical bob offset

    // ── Ground shadow ────────────────────────────────
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(px, py + 14, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // ── Teal suit jacket (body) ───────────────────────
    ctx.fillStyle = '#006b65';
    ctx.beginPath();
    ctx.roundRect(px - 7, py - 4 + oy, 14, 13, 2);
    ctx.fill();

    // Jacket lapels
    ctx.fillStyle = '#005550';
    ctx.beginPath();
    ctx.moveTo(px - 2, py - 4 + oy);
    ctx.lineTo(px,     py - 1 + oy);
    ctx.lineTo(px + 2, py - 4 + oy);
    ctx.closePath();
    ctx.fill();

    // Shirt / tie
    ctx.fillStyle = '#e8e9f0';
    ctx.fillRect(px - 1, py - 3 + oy, 2, 6);
    ctx.fillStyle = '#00d4c8';
    ctx.fillRect(px - 1, py - 1 + oy, 2, 5);

    // ── Legs ─────────────────────────────────────────
    const legY = py + 9 + oy;
    const legW = 4, legH = 8;
    ctx.fillStyle = '#1a2a5e'; // dark trousers

    if (facing === 'left' || facing === 'right') {
      // Side view — alternating legs
      ctx.fillStyle = '#1a2a5e';
      ctx.beginPath(); ctx.roundRect(px - 4, legY, legW, legH - legSwing, 2); ctx.fill();
      ctx.beginPath(); ctx.roundRect(px + 1, legY, legW, legH + legSwing, 2); ctx.fill();
    } else {
      // Front/back — legs side by side
      ctx.beginPath(); ctx.roundRect(px - 5, legY + legSwing, legW, legH, 2); ctx.fill();
      ctx.beginPath(); ctx.roundRect(px + 1, legY - legSwing, legW, legH, 2); ctx.fill();
    }

    // Shoes
    ctx.fillStyle = '#0c0d14';
    if (facing === 'left' || facing === 'right') {
      const shoeOffX = facing === 'left' ? -2 : 2;
      ctx.beginPath(); ctx.ellipse(px - 4 + shoeOffX, legY + legH - legSwing, 4, 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(px + 3 + shoeOffX, legY + legH + legSwing, 4, 2, 0, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.beginPath(); ctx.ellipse(px - 3, legY + legH + legSwing, 3, 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(px + 3, legY + legH - legSwing, 3, 2, 0, 0, Math.PI * 2); ctx.fill();
    }

    // ── Arms ─────────────────────────────────────────
    ctx.fillStyle = '#006b65';
    const armY = py - 2 + oy;
    if (facing === 'left' || facing === 'right') {
      // Arm reaching forward/back
      const fwdArm = facing === 'right' ? armSwing : -armSwing;
      ctx.beginPath(); ctx.roundRect(px - 9, armY + fwdArm, 3, 9, 1); ctx.fill();
      ctx.beginPath(); ctx.roundRect(px + 6, armY - fwdArm, 3, 9, 1); ctx.fill();
    } else {
      ctx.beginPath(); ctx.roundRect(px - 9, armY + armSwing, 3, 9, 1); ctx.fill();
      ctx.beginPath(); ctx.roundRect(px + 6, armY - armSwing, 3, 9, 1); ctx.fill();
    }

    // Hand / briefcase (right hand)
    ctx.fillStyle = '#c8a882'; // skin tone
    ctx.beginPath(); ctx.arc(px + 7.5, armY + 9.5 - armSwing + oy * 0.5, 2, 0, Math.PI * 2); ctx.fill();
    // Briefcase
    ctx.fillStyle = '#8b6914';
    ctx.beginPath(); ctx.roundRect(px + 5, armY + 8 - armSwing + oy * 0.5, 7, 5, 1); ctx.fill();
    ctx.fillStyle = '#a07820';
    ctx.fillRect(px + 7, armY + 7.5 - armSwing + oy * 0.5, 3, 1);

    // ── Head ─────────────────────────────────────────
    const headY = py - 14 + oy;

    // Neck
    ctx.fillStyle = '#c8a882';
    ctx.fillRect(px - 2, py - 6 + oy, 4, 4);

    // Head shape
    ctx.fillStyle = '#d4a870'; // slightly different skin tone from neck
    ctx.beginPath();
    ctx.arc(px, headY, 7, 0, Math.PI * 2);
    ctx.fill();

    // Face features based on facing direction
    if (facing === 'down' || facing === 'right' || facing === 'left') {
      // Eyes
      ctx.fillStyle = '#1a1a2e';
      if (facing === 'down') {
        ctx.beginPath(); ctx.arc(px - 2.5, headY + 1, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(px + 2.5, headY + 1, 1.5, 0, Math.PI * 2); ctx.fill();
        // Eye whites
        ctx.fillStyle = 'white';
        ctx.beginPath(); ctx.arc(px - 2.5, headY + 0.5, 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(px + 2.5, headY + 0.5, 0.8, 0, Math.PI * 2); ctx.fill();
        // Smile
        ctx.strokeStyle = '#3a2a1a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(px, headY + 2, 2.5, 0.2, Math.PI - 0.2);
        ctx.stroke();
      } else {
        // Side profile — one eye
        const eyeX = facing === 'right' ? px + 3 : px - 3;
        ctx.beginPath(); ctx.arc(eyeX, headY, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'white';
        ctx.beginPath(); ctx.arc(eyeX, headY - 0.3, 0.8, 0, Math.PI * 2); ctx.fill();
      }
    } else {
      // Back of head — just hair
      ctx.fillStyle = '#2a1a0a';
      ctx.beginPath();
      ctx.arc(px, headY - 2, 6.5, Math.PI, 0);
      ctx.fill();
    }

    // Hair
    ctx.fillStyle = '#2a1a0a';
    ctx.beginPath();
    if (facing === 'up') {
      ctx.arc(px, headY, 7, Math.PI, 0);
    } else {
      ctx.arc(px, headY - 1, 7, -Math.PI * 0.9, Math.PI * 0.1);
    }
    ctx.fill();

    // ── Teal glow aura (subtle, brand color) ─────────
    ctx.shadowColor = '#00d4c8';
    ctx.shadowBlur = 16;
    ctx.strokeStyle = 'rgba(0,212,200,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(px, py - 2 + oy, 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // ── Name badge ───────────────────────────────────
    const name = this.state.businessName?.substring(0, 15) || 'Player';
    const nameW = Math.min(110, name.length * 5.5 + 14);
    const nameX = px - nameW / 2;
    const nameY2 = py - 32 + oy;

    ctx.fillStyle = 'rgba(0,12,18,0.9)';
    ctx.strokeStyle = 'rgba(0,212,200,0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(nameX, nameY2, nameW, 14, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#00d4c8';
    ctx.font = 'bold 8px "General Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name, px, nameY2 + 10);
  }

  // ── Competitor NPC ───────────────────────────────────────────
  _drawCompetitors(ctx) {
    this.competitorAgents.forEach((comp, i) => {
      this._drawNPC(ctx, comp.x, comp.y, comp, i);
    });
  }

  _drawNPC(ctx, px, py, comp, idx) {
    const bobY = Math.sin(Date.now() / 600 + idx * 1.3) * -1;
    const oy = bobY;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(px, py + 14, 9, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body — red/competitor color suit
    ctx.fillStyle = '#5a1020';
    ctx.beginPath();
    ctx.roundRect(px - 6, py - 3 + oy, 12, 11, 2);
    ctx.fill();

    // Collar
    ctx.fillStyle = '#7a1830';
    ctx.fillRect(px - 1, py - 3 + oy, 2, 3);

    // Legs
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath(); ctx.roundRect(px - 4, py + 8 + oy, 3.5, 7, 2); ctx.fill();
    ctx.beginPath(); ctx.roundRect(px + 0.5, py + 8 + oy, 3.5, 7, 2); ctx.fill();

    // Arms
    ctx.fillStyle = '#5a1020';
    ctx.beginPath(); ctx.roundRect(px - 8, py - 1 + oy, 2.5, 7, 1); ctx.fill();
    ctx.beginPath(); ctx.roundRect(px + 5.5, py - 1 + oy, 2.5, 7, 1); ctx.fill();

    // Head — slightly different shade per competitor
    const headShades = ['#c07050', '#b06848', '#d08860'];
    ctx.fillStyle = headShades[idx % headShades.length];
    ctx.beginPath();
    ctx.arc(px, py - 13 + oy, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath();
    ctx.arc(px, py - 14 + oy, 6.5, -Math.PI * 0.85, Math.PI * 0.05);
    ctx.fill();

    // Eyes (menacing)
    ctx.fillStyle = '#ff4466';
    ctx.beginPath(); ctx.arc(px - 2, py - 13 + oy, 1.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(px + 2, py - 13 + oy, 1.2, 0, Math.PI * 2); ctx.fill();

    // Competitor glow
    ctx.shadowColor = '#ff4466';
    ctx.shadowBlur = 12;
    ctx.strokeStyle = 'rgba(255,68,102,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(px, py + oy, 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Name tag
    const names = ['QuickClose', 'RegionPro', 'Pinnacle'];
    const nameTag = names[idx % names.length];
    ctx.fillStyle = 'rgba(40,5,10,0.9)';
    ctx.strokeStyle = 'rgba(255,68,102,0.5)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.roundRect(px - 22, py - 30 + oy, 44, 12, 3);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff4466';
    ctx.font = 'bold 7px "General Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(nameTag, px, py - 21 + oy);
  }

  _drawInteractPrompt(ctx, bld) {
    const biz = bld.business;
    const bx = (bld.x + bld.w / 2) * TILE;
    const by = bld.y * TILE - 8;
    const warmthLabel = ['Cold', 'Familiar', 'Warm', 'Advocate'][biz.warmth] || 'Cold';
    const warmthColors = ['#7b7d8e', '#f5a623', '#ffd166', '#4ade80'];

    const boxW = 170, boxH = 54;
    const boxX = bx - boxW / 2;
    const boxY = by - boxH - 6;

    // Box with glow
    ctx.shadowColor = bld.districtColor;
    ctx.shadowBlur = 12;
    ctx.fillStyle = 'rgba(8,10,20,0.97)';
    ctx.strokeStyle = bld.districtColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 8);
    ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;

    // Arrow pointing down
    ctx.fillStyle = bld.districtColor;
    ctx.beginPath();
    ctx.moveTo(bx - 6, boxY + boxH);
    ctx.lineTo(bx + 6, boxY + boxH);
    ctx.lineTo(bx, boxY + boxH + 7);
    ctx.closePath();
    ctx.fill();

    // Business name
    ctx.fillStyle = bld.districtColor;
    ctx.font = 'bold 10px "General Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(biz.name, bx, boxY + 15);

    // Owner and warmth
    ctx.fillStyle = '#7b7d8e';
    ctx.font = '9px "General Sans", sans-serif';
    ctx.fillText(`${biz.owner} · ${biz.ownerTitle}`, bx, boxY + 28);

    // Warmth indicator
    ctx.fillStyle = warmthColors[biz.warmth] || '#7b7d8e';
    ctx.font = 'bold 8px "General Sans", sans-serif';
    const warmDots = ['○○○', '●○○', '●●○', '●●●'][biz.warmth] || '○○○';
    ctx.fillText(`${warmDots} ${warmthLabel}`, bx - 25, boxY + 40);

    // [E] prompt
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('[E] Approach', boxX + boxW - 6, boxY + 40);
  }

} // end BizAmpireEngine

// ── Encounter Engine ──────────────────────────────────────────
export class EncounterEngine {
  constructor(state, gameEngine, ui) {
    this.state = state;
    this.game = gameEngine;
    this.ui = ui;
  }

  get enc() { return this.state.currentEncounter; }
  get biz() { return this.enc?.business; }
  get flags() { return this.enc?.stateFlags; }

  startRecon(business) {
    this.ui.showReconPanel(business);
  }

  completeRecon() {
    this.flags.didRecon = true;
    this.enc.rapport += 1;
    this.enc.phase = 'opener';
    this.ui.showToast('📋 Market intel gathered. Rapport +1', 'success');
    this.ui.showOpenerPhase(this.enc, this.state);
  }

  skipRecon() {
    this.enc.phase = 'opener';
    this.ui.showOpenerPhase(this.enc, this.state);
  }

  handleOpener(choice) {
    const baseRapport = choice.rapport || 0;
    const bonus = this.flags.didRecon ? 0.5 : 0;
    const patternBonus = this.state.unlockedSkills.includes('pattern_interrupt') ? 0.5 : 0;
    this.enc.rapport += baseRapport + bonus + patternBonus;
    this.flags.openerQuality = this.enc.rapport >= 2 ? 'warm' : 'cold';

    if (choice.technique) this.flags.lastTechnique = choice.technique;

    this.enc.phase = 'discovery';
    this.ui.showDiscoveryPhase(this.enc, this.state);
  }

  handleDiscovery(questionId, responseType) {
    const q = DISCOVERY_QUESTIONS.find(q => q.skillTag === questionId);
    if (!q) return;

    const hasSkill = this.state.unlockedSkills.includes(q.skillTag);
    const effectiveResponse = hasSkill ? responseType : (responseType === 'good' ? 'ok' : responseType);

    if (effectiveResponse === 'good') {
      this.enc.rapport += q.rapportOnGood;
      this.flags.discoveryScore += q.rapportOnGood;
      this.ui.showToast(`✓ ${q.framework}`, 'success');
    } else {
      this.enc.rapport += q.rapportOnBad;
      this.ui.showToast(`Missed opportunity — ${q.framework}`, 'warn');
    }

    this.flags.spinPhase++;
    const totalSPIN = DISCOVERY_QUESTIONS.length;

    if (this.flags.spinPhase >= totalSPIN) {
      this.enc.phase = 'pitch';
      this.ui.showPitchPhase(this.enc, this.state);
    } else {
      this.ui.showNextDiscoveryQuestion(this.enc, this.state, this.flags.spinPhase);
    }
  }

  handlePitch(responseType) {
    const bonuses = {
      good: 2,
      technique: 3,
      bad: -1,
    };
    this.enc.rapport += bonuses[responseType] || 0;

    if (responseType === 'technique' && this.state.unlockedSkills.includes('challenger_insight')) {
      this.ui.showToast('🔬 Challenger Insight activated! Rapport +3', 'success');
    }

    this.enc.phase = 'pricing';
    this.ui.showPricingPhase(this.enc, this.state);
  }

  handlePricing(price) {
    const biz = this.biz;
    const [min, max] = biz.budget;
    const midpoint = (min + max) / 2;
    const warmthBonus = biz.warmth * 0.15;
    const rapportBonus = Math.max(0, this.enc.rapport) * 0.05;
    const hasValueStack = this.state.unlockedSkills.includes('value_stack');
    const hasAnchor = this.state.unlockedSkills.includes('anchoring');
    const maxAcceptable = max * (1 + warmthBonus + rapportBonus + (hasValueStack ? 0.3 : 0));

    this.flags.price = price;
    this.flags.pricingSet = true;

    let feedback, pricingState;
    if (price < min * 0.8) {
      feedback = "They raise an eyebrow — 'That's... really low. Are you sure about your value?'";
      pricingState = 'neutral';
      this.enc.rapport -= 1;
    } else if (price <= midpoint) {
      feedback = "They nod. The price feels reasonable but they sense you might go lower.";
      pricingState = 'neutral';
    } else if (price <= maxAcceptable) {
      feedback = "They pause, then say — 'That's on the higher end, but if you deliver what you're promising...'";
      pricingState = 'positive';
      this.enc.rapport += 0.5;
    } else {
      feedback = hasAnchor
        ? "You set the anchor high. They push back but the baseline is set."
        : "Their eyes widen. 'That's outside what we were thinking.'";
      pricingState = hasAnchor ? 'neutral' : 'negative';
      if (!hasAnchor) this.enc.rapport -= 2;
    }

    this.ui.updatePricingFeedback(feedback, pricingState);

    setTimeout(() => {
      this.enc.phase = 'objections';
      this._generateObjections();
      this.ui.showObjectionPhase(this.enc, this.state);
    }, 1500);
  }

  _generateObjections() {
    const objectionPool = [];
    if (this.flags.price > this.biz.budget[1]) objectionPool.push('price');
    if (this.biz.warmth === 0) objectionPool.push('trust');
    if (this.biz.currentVendor !== 'None') objectionPool.push('incumbent');
    objectionPool.push('timing');

    // Pick 1-2 based on rapport
    const count = this.enc.rapport >= 3 ? 1 : 2;
    this.flags.objections = objectionPool.slice(0, count);
  }

  handleObjection(objectionType, responseKey) {
    const objectionSet = OBJECTION_LIBRARY[objectionType];
    if (!objectionSet) {
      this._moveToClose();
      return;
    }
    const obj = objectionSet[0];
    const response = obj.counters[responseKey];
    if (!response) return;

    const hasSkill = !response.skillRequired || this.state.unlockedSkills.includes(response.skillRequired);
    const effectiveRapport = hasSkill ? response.rapport : Math.min(response.rapport, 1);
    this.enc.rapport += effectiveRapport;

    if (response.framework) {
      this.ui.showToast(response.framework, effectiveRapport > 0 ? 'success' : 'warn');
    }

    this.flags.resolved.push(objectionType);
    const remaining = this.flags.objections.filter(o => !this.flags.resolved.includes(o));

    if (remaining.length === 0) {
      this._moveToClose();
    } else {
      this.ui.showNextObjection(this.enc, this.state, remaining[0]);
    }
  }

  _moveToClose() {
    this.enc.phase = 'close';
    this.ui.showClosePhase(this.enc, this.state);
  }

  resolveEncounter(playerChoice) {
    const rapport = this.enc.rapport;
    const biz = this.biz;
    const price = this.flags.price || (biz.budget[0] + biz.budget[1]) / 2;

    const baseCloseRate = 0.35;
    const warmthBonus = biz.warmth * 0.1;
    const rapportBonus = Math.max(0, rapport) * 0.08;
    const skillBonus = this.state.unlockedSkills.includes('need_payoff') ? 0.15 : 0;
    const survivalPenalty = this.state.survivalMode ? -0.1 : 0;

    const closeRate = Math.min(0.92, baseCloseRate + warmthBonus + rapportBonus + skillBonus + survivalPenalty);

    let outcome;
    if (playerChoice === 'close_direct') {
      const roll = Math.random();
      if (roll < closeRate) {
        outcome = 'closed';
      } else if (roll < closeRate + 0.2) {
        outcome = 'followup';
      } else {
        outcome = 'ghosted';
      }
    } else if (playerChoice === 'pilot_offer') {
      outcome = rapport >= 2 ? 'closed' : 'followup';
    } else {
      outcome = 'lost';
    }

    biz.warmth = Math.min(3, biz.warmth + 1);
    biz.visits++;

    const journalContext = this._getJournalContext(outcome);

    if (outcome === 'closed') {
      this.game.closeDeal(biz, price, rapport);
      this.ui.showOutcome('closed', biz, price, rapport);
      setTimeout(() => this.ui.showJournalPrompt(JOURNAL_PROMPTS.after_close, journalContext), 2000);
    } else if (outcome === 'followup') {
      biz.cooldownDays = 3;
      this.ui.showOutcome('followup', biz, price, rapport);
      setTimeout(() => this.ui.showJournalPrompt(JOURNAL_PROMPTS.after_objection, journalContext), 2000);
    } else {
      this.game.lostDeal(biz, outcome);
      this.ui.showOutcome('lost', biz, price, rapport);
      setTimeout(() => this.ui.showJournalPrompt(JOURNAL_PROMPTS.after_cold_fail, journalContext), 2000);
    }
  }

  _getJournalContext(outcome) {
    return {
      businessName: this.biz.name,
      outcome,
      rapport: this.enc.rapport,
      technique: this.flags.lastTechnique,
      price: this.flags.price,
    };
  }
}

// ── Helper ────────────────────────────────────────────────────
function generateEmployeeName() {
  const first = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Cameron', 'Dakota', 'Drew', 'Reese'];
  const last = ['Smith', 'Johnson', 'Garcia', 'Martinez', 'Lee', 'Brown', 'Davis', 'Wilson', 'Moore', 'Taylor'];
  return `${first[Math.floor(Math.random() * first.length)]} ${last[Math.floor(Math.random() * last.length)]}`;
}

export { TILE, MAP_W, MAP_H };
