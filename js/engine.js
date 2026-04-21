// ═══════════════════════════════════════════════════════════
//  BizAmpire: Street Level — Game Engine
//  City map, player movement, encounter triggers
// ═══════════════════════════════════════════════════════════

import {
  DISTRICTS, SKILL_TREE, ENCOUNTER_PHASES, OBJECTION_LIBRARY,
  DISCOVERY_QUESTIONS, MILESTONES, JOURNAL_PROMPTS,
  COMPETITORS, EMPLOYEE_ARCHETYPES, createInitialState,
  getProspectCategory, getVendorServices, isVendorEligible
} from './data.js';
import {
  ICP_FIT_MATRIX, FIT_DIALOGUE
} from './q_shared.js';

// Per-industry question files — dynamically imported at encounter start
// Each file is ~60-75KB instead of the full 676KB questions.js
const _questionCache = {};
async function loadIndustryQuestions(industry) {
  if (_questionCache[industry]) return _questionCache[industry];
  try {
    const mod = await import(`./q_${industry}.js`);
    _questionCache[industry] = mod.QUESTIONS;
    return mod.QUESTIONS;
  } catch(e) {
    console.warn('[BizAmpire] Failed to load q_' + industry + '.js:', e.message);
    return null;
  }
}

// ── Constants ────────────────────────────────────────────────
const TILE = 48;
const MAP_W = 60;
const MAP_H = 40;
const PLAYER_SPEED = 3.5;

// ── City Map Generation ──────────────────────────────────────
// Tile types:
//   0 = road      (asphalt, walkable)
//   1 = sidewalk  (concrete, walkable)
//   2 = building  (blocked)
//   3 = park/grass (walkable)
//   4 = water/lake (blocked)
//   5 = tree       (blocked, drawn as canopy)
//   6 = parking lot (walkable)
function generateCityMap() {
  const map = [];

  for (let y = 0; y < MAP_H; y++) {
    map[y] = [];
    for (let x = 0; x < MAP_W; x++) {
      const isRoadH = (y % 8 === 4 || y % 8 === 5);
      const isRoadV = (x % 10 === 5 || x % 10 === 6);
      if (isRoadH || isRoadV) map[y][x] = 0;
      else map[y][x] = 2;
    }
  }

  // Sidewalks adjacent to roads
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

  // ── Parks ──────────────────────────────────────────────────
  _carveRect(map,  1,  1,  9, 6, 3);   // top-left
  _carveRect(map, 42, 26,  9, 6, 3);   // bottom-right
  _carveRect(map, 33, 12,  6, 5, 3);   // center plaza

  // ── Lakes / ponds inside parks ─────────────────────────────
  _carveRect(map,  3,  2,  4, 3, 4);   // pond in park 1
  _carveRect(map, 44, 27,  4, 3, 4);   // pond in park 2
  _carveRect(map, 35, 13,  2, 2, 4);   // fountain in plaza

  // ── Canal strip (mid-map, horizontal) ──────────────────────
  for (let x = 17; x <= 28; x++) {
    if (map[17]?.[x] !== 0) map[17][x] = 4;
    if (map[18]?.[x] !== 0) map[18][x] = 4;
  }

  // ── Tree rings around parks ─────────────────────────────────
  _addTreeRing(map,  1,  1,  9, 6);
  _addTreeRing(map, 42, 26,  9, 6);
  _addTreeRing(map, 33, 12,  6, 5);

  // ── Street trees on sidewalk tiles ─────────────────────────
  const streetTrees = [
    [2,10],[2,20],[2,30],[7,10],[7,22],[7,30],
    [11,2],[19,2],[27,2],[34,2],
    [11,57],[19,57],[27,57],
    [14,15],[22,15],[14,45],[22,45],
    [32,35],[38,35],[3,35],[3,44],
    // Extra street trees
    [2,15],[2,25],[2,35],[2,45],[2,50],
    [7,15],[7,25],[7,35],[7,45],
    [15,2],[23,2],[31,2],[38,2],
    [15,57],[23,57],[31,57],[38,57],
    [12,10],[12,20],[12,30],[12,40],[12,50],
    [20,10],[20,20],[20,30],[20,40],[20,50],
    [28,10],[28,20],[28,30],[28,40],[28,50],
    [35,10],[35,20],[35,30],[35,40],[35,50],
  ];
  for (const [ty,tx] of streetTrees) {
    if (ty>=0&&ty<MAP_H&&tx>=0&&tx<MAP_W&&map[ty]?.[tx]===1) map[ty][tx]=5;
  }

  // ── Interior trees scattered in block areas (Pokémon style) ───────
  const interiorTrees = [
    [2,2],[2,3],[3,7],[3,8],[6,2],[6,3],
    [2,12],[2,13],[3,16],[6,13],[6,14],
    [2,22],[3,25],[3,26],[6,22],[6,23],
    [2,32],[3,36],[6,33],[6,37],
    [2,42],[3,46],[2,48],[6,43],[6,47],
    [2,52],[3,55],[6,53],
    [10,2],[10,3],[11,7],[10,8],
    [10,12],[11,14],[10,16],
    [10,22],[10,23],[11,26],
    [10,32],[10,36],[11,37],
    [10,42],[10,43],[11,47],
    [16,2],[17,3],[16,7],
    [16,12],[17,16],[16,14],
    [16,22],[16,26],[17,24],
    [16,42],[17,46],[16,44],
    [16,52],[17,54],
    [24,2],[24,3],[25,7],
    [24,12],[25,14],[24,16],
    [24,22],[24,26],[25,24],
    [24,32],[25,34],[24,36],
    [24,42],[24,46],[25,44],
    [24,52],[25,55],
    [32,2],[32,3],[33,7],
    [32,12],[33,14],[32,16],
    [32,22],[32,26],[33,24],
    [32,32],[33,34],[32,36],
    [32,42],[32,46],[33,44],
    [32,52],[33,54],
  ];
  for (const [ty,tx] of interiorTrees) {
    if (ty>=0&&ty<MAP_H&&tx>=0&&tx<MAP_W&&map[ty]?.[tx]===2) map[ty][tx]=5;
  }

  // ── Parking lots ───────────────────────────────────────────
  for (const [px,py,pw,ph] of [
    [6,8,3,2],[17,6,3,2],[27,14,3,2],[38,6,3,2],
    [50,14,3,2],[7,22,3,2],[17,30,3,2],[38,22,3,2],
  ]) {
    for (let dy=0;dy<ph;dy++) for (let dx=0;dx<pw;dx++) {
      const ty=py+dy,tx=px+dx;
      if (ty>=0&&ty<MAP_H&&tx>=0&&tx<MAP_W&&(map[ty][tx]===1||map[ty][tx]===2))
        map[ty][tx]=6;
    }
  }

  return map;
}

function _carveRect(map, x, y, w, h, type) {
  for (let dy=0;dy<h;dy++) for (let dx=0;dx<w;dx++) {
    const ty=y+dy,tx=x+dx;
    if (ty>=0&&ty<MAP_H&&tx>=0&&tx<MAP_W&&map[ty][tx]!==0) map[ty][tx]=type;
  }
}

function _addTreeRing(map, x, y, w, h) {
  for (let dx=0;dx<w;dx++) for (let dy=0;dy<h;dy++) {
    if (dx===0||dx===w-1||dy===0||dy===h-1) {
      const ty=y+dy,tx=x+dx;
      if (ty>=0&&ty<MAP_H&&tx>=0&&tx<MAP_W&&(map[ty][tx]===3||map[ty][tx]===1))
        map[ty][tx]=5;
    }
  }
}

// District building placement
function buildDistrictBlocks() {
  const blocks = [];

  // Pre-generate the map so we can test tile types during placement
  const tempMap = generateCityMap();

  // Returns true if a 2x2 footprint at (tx,ty) is entirely on non-road,
  // non-water, non-park, non-tree tiles — i.e. genuine building-lot space
  function isValidBuildingSpot(tx, ty) {
    if (tx < 1 || ty < 1 || tx + 2 > MAP_W - 1 || ty + 2 > MAP_H - 1) return false;
    for (let dy = 0; dy < 2; dy++) {
      for (let dx = 0; dx < 2; dx++) {
        const t = tempMap[ty+dy]?.[tx+dx];
        // Must be interior block (2) — not road(0), sidewalk(1), park(3), water(4), tree(5), parking(6)
        if (t !== 2) return false;
      }
    }
    // Also ensure the spot isn't already occupied by another block
    return true;
  }

  // Find the nearest valid 2x2 spot to a preferred (px,py) tile coordinate
  function snapToBlock(preferX, preferY) {
    // Search in expanding rings around the preferred position
    for (let radius = 0; radius <= 6; radius++) {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue; // ring only
          const tx = preferX + dx, ty = preferY + dy;
          if (isValidBuildingSpot(tx, ty)) return { tx, ty };
        }
      }
    }
    return null; // fallback — shouldn't happen
  }

  DISTRICTS.forEach(d => {
    const cx = Math.floor(d.x * MAP_W);
    const cy = Math.floor(d.y * MAP_H);
    const used = new Set();

    d.businesses.forEach((biz, i) => {
      const angle = (i / d.businesses.length) * Math.PI * 2;
      const radius = 3 + (i % 3) * 2;
      const prefX = cx + Math.round(Math.cos(angle) * radius);
      const prefY = cy + Math.round(Math.sin(angle) * radius);

      // Snap to valid non-road interior tile
      const spot = snapToBlock(prefX, prefY);
      if (!spot) return;

      const key = `${spot.tx},${spot.ty}`;
      if (used.has(key)) return;
      used.add(key);

      // Mark those tiles as occupied so next building won't overlap
      for (let dy = 0; dy < 2; dy++)
        for (let dx = 0; dx < 2; dx++)
          if (tempMap[spot.ty+dy]?.[spot.tx+dx] !== undefined)
            tempMap[spot.ty+dy][spot.tx+dx] = 2; // keep as 2 (already is)

      blocks.push({
        x: spot.tx,
        y: spot.ty,
        w: 2, h: 2,
        districtId: d.id,
        districtColor: d.color,
        business: biz,
      });
    });

    // District sign — snap to nearest sidewalk tile near center
    let signX = cx, signY = cy;
    for (let r = 0; r <= 4; r++) {
      let found = false;
      for (let dy = -r; dy <= r && !found; dy++) {
        for (let dx = -r; dx <= r && !found; dx++) {
          if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
          const tx = cx+dx, ty = cy+dy;
          if (tx>=0&&tx<MAP_W&&ty>=0&&ty<MAP_H&&tempMap[ty]?.[tx]===1) {
            signX = tx; signY = ty; found = true;
          }
        }
      }
      if (found) break;
    }
    blocks.push({
      x: signX, y: signY,
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
      if (e.key === 'p') window.__bizampirePortfolio?.show();
    }, { signal: ac.signal });
    window.addEventListener('keyup', e => {
      this.keys[e.key.toLowerCase()] = false;
    }, { signal: ac.signal });

    // Touch/click on canvas for building interaction (desktop)
    this.canvas.addEventListener('click', e => {
      const rect = this.canvas.getBoundingClientRect();
      const wx = (e.clientX - rect.left) * (this.canvas.width / rect.width) + this.cam.x;
      const wy = (e.clientY - rect.top) * (this.canvas.height / rect.height) + this.cam.y;
      const bld = this._getBuildingAt(wx, wy);
      if (bld && bld.business) {
        this._startEncounter(bld.business);
      }
    }, { signal: ac.signal });

    // ── Virtual joystick (mobile) ─────────────────────────────
    this._joystick = { active: false, dx: 0, dy: 0 };
    const base  = document.getElementById('joystick-base');
    const knob  = document.getElementById('joystick-knob');
    const zone  = document.getElementById('joystick-zone');

    if (base && knob) {
      const RADIUS = 31; // max knob travel (base 110px, knob 48px → (110-48)/2 ≈ 31)

      const onMove = (cx, cy) => {
        const rect = base.getBoundingClientRect();
        const ox = cx - (rect.left + rect.width  / 2);
        const oy = cy - (rect.top  + rect.height / 2);
        const dist = Math.sqrt(ox * ox + oy * oy);
        const clamped = Math.min(dist, RADIUS);
        const angle   = Math.atan2(oy, ox);
        const kx = Math.cos(angle) * clamped;
        const ky = Math.sin(angle) * clamped;

        knob.style.transform = `translate(calc(-50% + ${kx}px), calc(-50% + ${ky}px))`;

        // Normalise to -1..1, apply dead-zone of 15%
        const norm = clamped / RADIUS;
        const dead = 0.15;
        const effective = norm < dead ? 0 : (norm - dead) / (1 - dead);
        this._joystick.dx = effective * Math.cos(angle);
        this._joystick.dy = effective * Math.sin(angle);
      };

      const onEnd = () => {
        this._joystick.active = false;
        this._joystick.dx = 0;
        this._joystick.dy = 0;
        knob.style.transform = 'translate(-50%, -50%)';
      };

      base.addEventListener('touchstart', e => {
        e.preventDefault();
        this._joystick.active = true;
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: false, signal: ac.signal });

      base.addEventListener('touchmove', e => {
        e.preventDefault();
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: false, signal: ac.signal });

      base.addEventListener('touchend',    onEnd, { signal: ac.signal });
      base.addEventListener('touchcancel', onEnd, { signal: ac.signal });
    }

    // Mobile interact button
    const mobileInteract = document.getElementById('btn-mobile-interact');
    if (mobileInteract) {
      mobileInteract.addEventListener('touchstart', e => {
        e.preventDefault();
        this._tryInteract();
      }, { passive: false, signal: ac.signal });
    }
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
    // Player movement — keyboard + virtual joystick
    let dx = 0, dy = 0;
    if (this.keys['a'] || this.keys['arrowleft'])  dx -= 1;
    if (this.keys['d'] || this.keys['arrowright']) dx += 1;
    if (this.keys['w'] || this.keys['arrowup'])    dy -= 1;
    if (this.keys['s'] || this.keys['arrowdown'])  dy += 1;

    // Joystick overrides keyboard if active
    if (this._joystick?.active) {
      dx = this._joystick.dx;
      dy = this._joystick.dy;
    } else if (dx !== 0 && dy !== 0) {
      dx *= 0.707; dy *= 0.707;
    }

    const speed = (PLAYER_SPEED + (this.state.hasVehicle ? PLAYER_SPEED * 0.4 : 0)) * TILE;
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

    // Block water (4) and trees (5)
    const tile = this.map[ty]?.[tx] ?? 2;
    if (tile === 4 || tile === 5) return true;

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

  async _startEncounter(business) {
    // Training lock: new business must complete training before taking encounters
    if (this.state.trainingDaysLeft > 0) {
      const d = this.state.trainingDaysLeft;
      this.ui.showToast(`📚 ${this.state.businessName} is still in training. ${d} day${d !== 1 ? 's' : ''} until you can take meetings.`, 'warn');
      return;
    }

    if (business.cooldownDays > 0) {
      this.ui.showToast(`${business.owner} is still cooling off. Come back in ${business.cooldownDays} day${business.cooldownDays > 1 ? 's' : ''}.`, 'warn');
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

    // If vendor-eligible, show Sell vs Buy choice first
    const vendorServices = getVendorServices(business.type);
    const isVendor = vendorServices.length > 0;
    const alreadyClient = business.closed;

    if (isVendor) {
      // Show the approach modal — player picks Sell or Buy
      this.ui.showApproachChoice(business, this.state, {
        canSell: !alreadyClient,
        services: vendorServices,
        onSell: () => this._beginSellEncounter(business),
        onBuy:  (svcId) => this.purchaseVendorService(business, svcId),
      });
      return;
    }

    if (alreadyClient) {
      this.ui.showToast(`${business.name} is already a client!`, 'success');
      return;
    }

    await this._beginSellEncounter(business);
  }

  // ── Separated so Sell path can be called from approach choice ─
  async _beginSellEncounter(business) {
    if (business.closed) {
      this.ui.showToast(`${business.name} is already a client!`, 'success');
      return;
    }

    // Resolve prospect category and ICP fit score
    const playerIndustry = this.state.businessIndustry || 'consulting';
    const prospectCategory = getProspectCategory(business.type);
    const fitScore = (ICP_FIT_MATRIX[playerIndustry] || {})[prospectCategory] ?? 2;

    // Dynamically load only the player's industry question file (~70KB vs 676KB)
    const industryBank = await loadIndustryQuestions(playerIndustry);
    const bankSets = industryBank ? industryBank[prospectCategory] : null;
    const setIdx = bankSets ? Math.floor(Math.random() * bankSets.length) : -1;
    const generatedQuestions = bankSets
      ? bankSets[setIdx]
      : DISCOVERY_QUESTIONS;  // fallback to static questions if file load fails
    console.log(`[BizAmpire] Encounter: player=${playerIndustry} prospect=${prospectCategory} fit=${fitScore} set=${setIdx >= 0 ? setIdx : 'FALLBACK'} biz="${business.type}"`);
    if (!bankSets) console.warn(`[BizAmpire] No question bank for ${playerIndustry}/${prospectCategory}`);
    if (fitScore === 0) console.log(`[BizAmpire] Poor ICP fit — showing fit block`);

    // Fit dialogue for score 0 or 1
    const fitDialogue = FIT_DIALOGUE[`score_${fitScore}`] || null;

    this.state.currentEncounter = {
      business,
      phase: 'recon',
      rapport: (fitScore === 1 ? -1 : 0) + (this.state.pendingRapportBonus || 0),  // rapport penalty for weak-fit; bonus from coffee meetings etc
      stateFlags: {
        didRecon: false,
        openerQuality: 'cold',
        discoveryScore: 0,
        spinPhase: 0,
        generatedQuestions,   // industry-aware SPIN questions for this encounter
        fitScore,             // 0=poor, 1=possible, 2=good, 3=perfect
        fitDialogue,          // flavour text if fit is weak
        prospectCategory,     // for UI display
        pricingSet: false,
        price: null,
        objections: [],
        resolved: [],
      },
    };
    this.state.pendingRapportBonus = 0;  // consume the coffee bonus
    this.ui.showEncounter(business, this.state);
  }

  _updateCompetitors(dt) {
    const COMP_SPEED = TILE * 0.8; // ~0.8 tiles per second (slower walk — gives player more time)
    const ARRIVE_DIST = TILE * 0.8; // mark stolen when this close
    const WANDER_INTERVAL = 45; // seconds before picking a new destination (gives player much more time)

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
          const aggressionChance = comp.aggressionLevel * 0.006; // ~5% max for most aggressive NPC per decision window
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

    // Training countdown for newly launched businesses
    if (this.state.trainingDaysLeft > 0) {
      this.state.trainingDaysLeft--;
      if (this.state.trainingDaysLeft === 0) {
        this.ui.showToast(`🎓 ${this.state.businessName} training complete! You can now take meetings.`, 'gold');
        this.ui.updateHUD(this.state);
      } else if (this.state.trainingDaysLeft <= 3) {
        this.ui.showToast(`📚 ${this.state.trainingDaysLeft} training day${this.state.trainingDaysLeft !== 1 ? 's' : ''} left for ${this.state.businessName}.`, 'default');
      }
    }

    // Decrement cooldowns on all businesses each day
    for (const district of DISTRICTS) {
      for (const biz of district.businesses) {
        if (biz.cooldownDays > 0) {
          biz.cooldownDays--;
          if (biz.cooldownDays === 0) {
            this.ui.showToast(`${biz.owner} at ${biz.name} is ready to talk again.`, 'default');
          }
        }
      }
    }

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

      // ── Vendor: recurring costs ───────────────────────────────
      const recurringVendors = this.state.vendors.filter(v => v.recurring);
      recurringVendors.forEach(v => {
        this.state.cash -= v.monthlyCost;
      });
      if (recurringVendors.length > 0) {
        const totalRecurring = recurringVendors.reduce((s, v) => s + v.monthlyCost, 0);
        this.ui.showToast(`💸 Vendor payments: -$${totalRecurring.toLocaleString()}/mo (${recurringVendors.length} service${recurringVendors.length > 1 ? 's' : ''})`, 'default');
      }

      // ── Vendor: tax credit ─────────────────────────────────
      if (this.state.monthlyTaxCredit > 0) {
        this.state.cash += this.state.monthlyTaxCredit;
        this.ui.showToast(`🧾 Tax strategy credit: +$${this.state.monthlyTaxCredit.toLocaleString()}`, 'gold');
      }

      // ── Vendor: passive ad leads ────────────────────────────
      if (this.state.passiveLeadsPerMonth > 0) {
        this.ui.showToast(`📣 Ad campaign: ${this.state.passiveLeadsPerMonth} inbound lead${this.state.passiveLeadsPerMonth > 1 ? 's' : ''} heading your way!`, 'gold');
        this._spawnReferralLeads(this.state.passiveLeadsPerMonth, 'retail_food');
      }

      // ── Vendor: referral leads from active vendors ────────────
      this.state.vendors.forEach(v => {
        v.monthsActive = (v.monthsActive || 0) + 1;
        if (v.recurring) v.totalSpent = (v.totalSpent || 0) + v.monthlyCost;
        if (Math.random() < v.referralRate) {
          v.leadsGenerated = (v.leadsGenerated || 0) + 1;
          this._spawnReferralLeads(1, v.referralType, v);
          this.ui.showToast(`🤝 ${v.owner} at ${v.bizName} sent you a referral lead!`, 'success');
        }
      });

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

  // ── Spawn referral/inbound lead NPCs near player ─────────────
  _spawnReferralLeads(count, preferredCategory, sourceVendor = null) {
    // Find unlocked, unclosed, not-lost buildings that match the preferred category
    const pool = this.buildings.filter(b => {
      if (!b.business) return false;
      const biz = b.business;
      if (biz.closed || biz.lostToCompetitor || biz.cooldownDays > 0) return false;
      const cat = getProspectCategory ? getProspectCategory(biz.type) : null;
      return !preferredCategory || cat === preferredCategory;
    });

    // Fallback: any open building if nothing matches the category
    const fallbackPool = pool.length > 0 ? pool : this.buildings.filter(b =>
      b.business && !b.business.closed && !b.business.lostToCompetitor
    );

    const chosen = [...fallbackPool]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);

    chosen.forEach(bld => {
      // Give the building a temporary "lead incoming" warmth boost so player knows
      if (bld.business) {
        bld.business.warmth = Math.min(3, (bld.business.warmth || 0) + 1);
        bld.business.isReferral = true;   // flag for rendering
        if (sourceVendor) bld.business.referralVendorId = sourceVendor.bizId;
      }
    });

    // If we have a referral lead, pulse the HUD
    if (chosen.length > 0) {
      this.ui.showToast(`📌 Referral lead warming up: ${chosen.map(b => b.business?.name).join(', ')}`, 'success');
    }
  }

  _triggerEmployeeEvent(employee) {
    const events = [
      { msg: `${employee.name} made an error on a client report. A client is unhappy.`, type: 'danger', reputationHit: -10 },
      { msg: `${employee.name} proactively solved a client issue. Reputation +5!`, type: 'success', reputationHit: 5 },
      { msg: `${employee.name} is asking for a raise. Their skill has grown.`, type: 'warn', reputationHit: 0 },
    ];
    const hasSOPs = this.state.unlockedSkills.includes('lean_operations');
    // With SOPs unlocked, only positive/neutral events (indices 1-2); otherwise all 3
    const event = events[Math.floor(Math.random() * (hasSOPs ? 2 : events.length))];
    this.state.reputation = Math.max(0, Math.min(1000, this.state.reputation + event.reputationHit));
    this.ui.showToast(event.msg, event.type);
    this.ui.updateHUD(this.state);
  }

  closeDeal(business, revenue, rapport) {
    business.closed = true;
    this.state.totalDeals++;

    // If this prospect was a referral lead, credit the originating vendor
    if (business.isReferral && business.referralVendorId) {
      const vendor = this.state.vendors.find(v => v.bizId === business.referralVendorId);
      if (vendor) vendor.leadsConverted = (vendor.leadsConverted || 0) + 1;
    }
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

  // ── Vendor purchase ────────────────────────────────────────────
  purchaseVendorService(business, serviceId) {
    const services = getVendorServices(business.type);
    const svc = services.find(s => s.id === serviceId);
    if (!svc) return;

    // Check cash
    if (this.state.cash < svc.cost) {
      this.ui.showToast(`Not enough cash. You need $${svc.cost.toLocaleString()}.`, 'danger');
      return;
    }

    // Check if already purchased (one-time only)
    const alreadyOwned = this.state.vendors.some(v => v.bizId === business.id && v.serviceId === svc.id);
    if (alreadyOwned && svc.oneTime) {
      this.ui.showToast(`You already have ${svc.name}.`, 'warn');
      return;
    }

    // Deduct cost
    this.state.cash -= svc.cost;

    // Record vendor relationship
    if (!alreadyOwned) {
      this.state.vendors.push({
        bizId:          business.id,
        bizName:        business.name,
        bizType:        business.type,
        icon:           business.icon,
        owner:          business.owner,
        serviceId:      svc.id,
        serviceName:    svc.name,
        serviceIcon:    svc.icon,
        recurring:      !svc.oneTime,
        monthlyCost:    svc.oneTime ? 0 : svc.cost,
        referralRate:   svc.referralRate,
        referralType:   svc.referralType,
        referralCooldown: 0,
        purchasedAt:    this.state.totalDeals,
        // Performance tracking
        monthsActive:      0,
        leadsGenerated:    0,
        leadsConverted:    0,
        totalSpent:        svc.oneTime ? svc.cost : 0,  // running total paid
      });
    }

    // Apply the effect immediately
    this._applyVendorEffect(svc, business);

    // Feedback
    this.ui.showToast(`✅ Purchased: ${svc.name} from ${business.name}`, 'success');
    this.ui.updateHUD(this.state);
    this.ui.closeEncounter();

    // Show a short debrief
    setTimeout(() => {
      this.ui.showToast(`🤝 ${business.owner} says: “Glad to have you as a client. I’ll keep you in mind if anyone needs what you do.”`, 'default');
    }, 1200);
  }

  _applyVendorEffect(svc, business) {
    const fx = svc.effect;
    if (!fx) return;

    // Find the just-pushed vendor record so we can annotate it for reversal
    const vendorRecord = this.state.vendors.find(
      v => v.bizId === business.id && v.serviceId === svc.id
    );

    if (fx.warmthBonus) {
      this.state.vendorWarmthBonus = (this.state.vendorWarmthBonus || 0) + fx.warmthBonus;
      if (vendorRecord) vendorRecord.warmthBonusApplied = fx.warmthBonus;
    }
    if (fx.overheadReduction) {
      this.state.monthlyOverhead = Math.max(0, this.state.monthlyOverhead - fx.overheadReduction);
      this.state.vendorOverheadReduction = (this.state.vendorOverheadReduction || 0) + fx.overheadReduction;
      if (vendorRecord) vendorRecord.overheadReductionApplied = fx.overheadReduction;
    }
    if (fx.reputationBonus) {
      this.state.reputation = Math.min(1000, this.state.reputation + fx.reputationBonus);
    }
    if (fx.skillPoints) {
      this.state.skillPoints += fx.skillPoints;
    }
    if (fx.unlockSkill) {
      if (!this.state.unlockedSkills.includes(fx.unlockSkill)) {
        this.state.unlockedSkills.push(fx.unlockSkill);
        this.ui.showToast(`⚡ Skill unlocked: ${fx.unlockSkill.replace(/_/g,' ')}`, 'gold');
      }
    }
    if (fx.nextEncounterRapportBonus) {
      this.state.pendingRapportBonus = (this.state.pendingRapportBonus || 0) + fx.nextEncounterRapportBonus;
    }
    if (fx.playerSpeedBonus) {
      this.state.hasVehicle = true;
      if (vendorRecord) vendorRecord.hadVehicle = true;
    }
    if (fx.passiveLeadsPerMonth) {
      this.state.passiveLeadsPerMonth = (this.state.passiveLeadsPerMonth || 0) + fx.passiveLeadsPerMonth;
    }
    if (fx.monthlyTaxCredit) {
      this.state.monthlyTaxCredit = (this.state.monthlyTaxCredit || 0) + fx.monthlyTaxCredit;
    }
    if (fx.creditLine) {
      this.state.creditLine = (this.state.creditLine || 0) + fx.creditLine;
    }
    if (fx.unlockEnterprise) {
      this.state.enterpriseUnlocked = true;
    }
    if (fx.preventBurnout) {
      this.state.burnoutPrevented = true;
    }
    if (fx.employeeCapacityBonus) {
      this.state.employeeCapacity = (this.state.employeeCapacity || 3) + fx.employeeCapacityBonus;
    }
  }

  // ── Cancel / Swap vendor ──────────────────────────────────────────
  cancelVendor(vendorBizId, vendorServiceId) {
    const idx = this.state.vendors.findIndex(
      v => v.bizId === vendorBizId && v.serviceId === vendorServiceId
    );
    if (idx === -1) return;
    const v = this.state.vendors[idx];

    // Reverse recurring cost effect on overhead
    if (v.recurring && v.monthlyCost > 0) {
      this.state.monthlyOverhead = Math.max(0, this.state.monthlyOverhead - v.monthlyCost);
    }

    // Reverse warmth bonus
    if (v.warmthBonusApplied) {
      this.state.vendorWarmthBonus = Math.max(0, (this.state.vendorWarmthBonus || 0) - v.warmthBonusApplied);
    }

    // Reverse overhead reduction effect
    if (v.overheadReductionApplied) {
      this.state.monthlyOverhead += v.overheadReductionApplied;
      this.state.vendorOverheadReduction = Math.max(0, (this.state.vendorOverheadReduction || 0) - v.overheadReductionApplied);
    }

    // Vehicle: only remove if no other vehicle vendor exists
    if (v.hadVehicle) {
      const otherVehicle = this.state.vendors.some((ov, oi) => oi !== idx && ov.hadVehicle);
      if (!otherVehicle) this.state.hasVehicle = false;
    }

    // Remove vendor record
    this.state.vendors.splice(idx, 1);

    this.ui.showToast(`🗑️ Cancelled ${v.serviceName} from ${v.bizName}.`, 'warn');
    this.ui.updateHUD(this.state);
    // Re-render management if open
    const mgmtPanel = document.getElementById('management-panel');
    if (mgmtPanel && mgmtPanel.children.length) {
      this.ui._renderManagement();
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
    this.ui.showToast(`👋 ${employee.name} joined your team as ${archetype.name}!`, 'success');
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
    const T = TILE;
    const startTX = Math.floor(this.cam.x / T);
    const startTY = Math.floor(this.cam.y / T);
    const endTX = Math.min(MAP_W - 1, startTX + Math.ceil(this.canvas.width  / T) + 2);
    const endTY = Math.min(MAP_H - 1, startTY + Math.ceil(this.canvas.height / T) + 2);

    // Pixel-art palette (warm, flat, hard-edged — Pokémon FireRed / EarthBound style)
    const C = {
      road:       '#8a8070',  // warm grey asphalt
      roadDark:   '#7a7060',  // slightly darker road variant
      roadLine:   '#f0e080',  // yellow center line
      roadWhite:  '#e8e0d0',  // white edge line
      sidewalk:   '#c8b890',  // warm cream concrete
      sidewalkDk: '#b0a07a',  // grout lines / joints
      sidewalkLt: '#d8c8a0',  // highlight edge
      grass:      '#50a838',  // bright Pokémon-style grass
      grassDk:    '#3d8a28',  // darker grass variant
      grassLt:    '#68c048',  // lighter grass highlight
      water:      '#3878c8',  // bright Pokémon water blue
      waterLt:    '#58a0e8',  // water shimmer
      waterDk:    '#2058a0',  // deep water
      tree:       '#2a7a20',  // dark tree base
      treeMid:    '#3a9a30',  // tree mid
      treeLt:     '#50c040',  // tree highlight
      path:       '#c0a870',  // stone path / brick
      pathDk:     '#a08858',  // grout between bricks
      parking:    '#706860',  // parking asphalt
      parkingLn:  '#f0e080',  // parking bay line
      buildBase:  '#111323',  // building lot base
    };

    for (let ty = startTY; ty <= endTY; ty++) {
      for (let tx = startTX; tx <= endTX; tx++) {
        if (ty < 0 || tx < 0) continue;
        const tile = this.map[ty]?.[tx] ?? 2;
        const px = tx * T, py = ty * T;

        // ── ROAD ──────────────────────────────────────────────
        if (tile === 0) {
          const isHRoad = ty % 8 === 4 || ty % 8 === 5;
          const isVRoad = tx % 10 === 5 || tx % 10 === 6;
          const isInter = isHRoad && isVRoad;

          // Alternate tile shade for texture
          ctx.fillStyle = (tx + ty) % 2 === 0 ? C.road : C.roadDark;
          ctx.fillRect(px, py, T, T);

          if (isInter) {
            // Intersection — slightly lighter, crosswalk stripes
            ctx.fillStyle = '#958872';
            ctx.fillRect(px, py, T, T);
            ctx.fillStyle = 'rgba(240,224,208,0.22)';
            for (let s = 0; s < 4; s++) {
              ctx.fillRect(px + 4 + s * 10, py, 6, 5);
              ctx.fillRect(px + 4 + s * 10, py + T - 5, 6, 5);
              ctx.fillRect(px, py + 4 + s * 10, 5, 6);
              ctx.fillRect(px + T - 5, py + 4 + s * 10, 5, 6);
            }
          } else if (isHRoad) {
            if (ty % 8 === 4) {
              // Top lane: white edge top, dashed yellow bottom
              ctx.fillStyle = C.roadWhite;
              ctx.fillRect(px, py, T, 2);
              if (tx % 4 < 2) { ctx.fillStyle = C.roadLine; ctx.fillRect(px + 2, py + T - 3, T - 4, 3); }
            } else {
              // Bottom lane: dashed yellow top, white edge bottom
              if (tx % 4 < 2) { ctx.fillStyle = C.roadLine; ctx.fillRect(px + 2, py, T - 4, 3); }
              ctx.fillStyle = C.roadWhite;
              ctx.fillRect(px, py + T - 2, T, 2);
            }
          } else if (isVRoad) {
            if (tx % 10 === 5) {
              ctx.fillStyle = C.roadWhite;
              ctx.fillRect(px, py, 2, T);
              if (ty % 4 < 2) { ctx.fillStyle = C.roadLine; ctx.fillRect(px + T - 3, py + 2, 3, T - 4); }
            } else {
              if (ty % 4 < 2) { ctx.fillStyle = C.roadLine; ctx.fillRect(px, py + 2, 3, T - 4); }
              ctx.fillStyle = C.roadWhite;
              ctx.fillRect(px + T - 2, py, 2, T);
            }
          }

        // ── SIDEWALK ──────────────────────────────────────────
        } else if (tile === 1) {
          // Alternating tile pattern (like real concrete slabs)
          const slabAlt = ((tx + ty) % 2 === 0);
          ctx.fillStyle = slabAlt ? C.sidewalk : '#c0b088';
          ctx.fillRect(px, py, T, T);

          // Hard grout lines on every tile edge
          ctx.fillStyle = C.sidewalkDk;
          ctx.fillRect(px, py, T, 1);         // top grout
          ctx.fillRect(px, py, 1, T);         // left grout

          // Curb edge (bright raised lip toward road)
          const au = this.map[ty-1]?.[tx], ad = this.map[ty+1]?.[tx];
          const al = this.map[ty]?.[tx-1],  ar = this.map[ty]?.[tx+1];
          ctx.fillStyle = C.sidewalkLt;
          if (au === 0) ctx.fillRect(px, py, T, 3);
          if (ad === 0) ctx.fillRect(px, py+T-3, T, 3);
          if (al === 0) ctx.fillRect(px, py, 3, T);
          if (ar === 0) ctx.fillRect(px+T-3, py, 3, T);

        // ── PARK / GRASS ──────────────────────────────────────
        } else if (tile === 3) {
          // Checkerboard grass variation (Pokémon style)
          const v = (tx + ty) % 2;
          ctx.fillStyle = v === 0 ? C.grass : C.grassDk;
          ctx.fillRect(px, py, T, T);

          // Tiny blade marks (2x2 dot clusters)
          if ((tx * 3 + ty * 7) % 5 === 0) {
            ctx.fillStyle = C.grassLt;
            ctx.fillRect(px + (tx*7)%36 + 4, py + (ty*11)%36 + 4, 2, 3);
            ctx.fillRect(px + (tx*13)%36 + 4, py + (ty*5)%36 + 8, 2, 3);
          }

          // Stone path inside park (every 3 tiles horizontal)
          const isParkPath = (ty % 3 === 0) && (tx % 2 === 0);
          if (isParkPath) {
            ctx.fillStyle = C.path;
            ctx.fillRect(px + 4, py + T/2 - 3, T - 8, 6);
            ctx.fillStyle = C.pathDk;
            ctx.fillRect(px + 4, py + T/2 - 3, T - 8, 1);
            ctx.fillRect(px + 4, py + T/2 + 2, T - 8, 1);
          }

          // Flower dots
          if ((tx * 11 + ty * 13) % 17 === 0) {
            ctx.fillStyle = '#f8e040';
            ctx.fillRect(px + (tx*7)%30 + 8, py + (ty*9)%30 + 8, 3, 3);
          }
          if ((tx * 17 + ty * 7) % 19 === 0) {
            ctx.fillStyle = '#f86080';
            ctx.fillRect(px + (tx*11)%28 + 10, py + (ty*13)%28 + 10, 3, 3);
          }

        // ── WATER ─────────────────────────────────────────────
        } else if (tile === 4) {
          // Flat water base
          ctx.fillStyle = C.water;
          ctx.fillRect(px, py, T, T);

          // Animated sparkle tiles (time-based, only every other tile)
          const sparkle = (tx + ty + Math.floor(Date.now() / 500)) % 4;
          if (sparkle === 0) {
            ctx.fillStyle = C.waterLt;
            ctx.fillRect(px + 4, py + 4, T - 8, T - 8);
          } else if (sparkle === 2) {
            ctx.fillStyle = C.waterDk;
            ctx.fillRect(px + 6, py + 6, T - 12, T - 12);
          }

          // Hard white edge foam
          const au4 = this.map[ty-1]?.[tx], ad4 = this.map[ty+1]?.[tx];
          const al4 = this.map[ty]?.[tx-1],  ar4 = this.map[ty]?.[tx+1];
          ctx.fillStyle = '#a8d8f8';
          if (au4 !== 4 && au4 !== undefined) ctx.fillRect(px, py, T, 4);
          if (ad4 !== 4 && ad4 !== undefined) ctx.fillRect(px, py+T-4, T, 4);
          if (al4 !== 4 && al4 !== undefined) ctx.fillRect(px, py, 4, T);
          if (ar4 !== 4 && ar4 !== undefined) ctx.fillRect(px+T-4, py, 4, T);

        // ── TREE CANOPY ───────────────────────────────────────
        } else if (tile === 5) {
          // Ground underneath — always grass since everything is green
          const treeGroundV = (tx + ty) % 2;
          ctx.fillStyle = treeGroundV === 0 ? '#488a30' : '#387820';
          ctx.fillRect(px, py, T, T);

          // Pixel-art tree: 3-layer hard-edged circles, no blur
          // Shadow
          ctx.fillStyle = 'rgba(0,0,0,0.4)';
          ctx.fillRect(px + 8, py + T - 10, T - 10, 6);

          // Outer canopy (dark ring)
          ctx.fillStyle = C.tree;
          ctx.beginPath();
          ctx.arc(px + T/2, py + T/2, T * 0.44, 0, Math.PI*2);
          ctx.fill();

          // Mid canopy
          ctx.fillStyle = C.treeMid;
          ctx.beginPath();
          ctx.arc(px + T/2, py + T/2 - 3, T * 0.35, 0, Math.PI*2);
          ctx.fill();

          // Highlight (top-left, hard pixel block style)
          ctx.fillStyle = C.treeLt;
          ctx.fillRect(px + Math.floor(T*0.22), py + Math.floor(T*0.12), Math.floor(T*0.28), Math.floor(T*0.22));
          // Clip to circle feel — just round the highlight
          ctx.fillStyle = C.treeMid;
          ctx.fillRect(px + Math.floor(T*0.22), py + Math.floor(T*0.12), 2, 2);
          ctx.fillRect(px + Math.floor(T*0.22) + Math.floor(T*0.28) - 2, py + Math.floor(T*0.12), 2, 2);

          // Trunk
          ctx.fillStyle = '#6a4020';
          ctx.fillRect(px + T/2 - 2, py + T/2 + 8, 4, 8);

          // Hard 1px dark outline around whole canopy
          ctx.strokeStyle = '#1a3010';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(px + T/2, py + T/2, T * 0.44, 0, Math.PI*2);
          ctx.stroke();

        // ── PARKING LOT ───────────────────────────────────────
        } else if (tile === 6) {
          ctx.fillStyle = C.parking;
          ctx.fillRect(px, py, T, T);
          // Bay lines
          ctx.fillStyle = C.parkingLn;
          ctx.fillRect(px + 1, py + 4, 2, T - 8);
          ctx.fillRect(px + T - 3, py + 4, 2, T - 8);
          // Occasional parked car (pixel-art box)
          if ((tx * 7 + ty * 11) % 9 === 0) {
            ctx.fillStyle = ['#4060a0','#a04040','#408040','#806020'][(tx+ty)%4];
            ctx.fillRect(px + 6, py + 6, T - 12, T - 16);
            ctx.fillStyle = '#203040';
            ctx.fillRect(px + 9, py + 9, T - 18, 8);
            // Hard outline
            ctx.strokeStyle = '#101020';
            ctx.lineWidth = 1;
            ctx.strokeRect(px + 6, py + 6, T - 12, T - 16);
          }

        // ── BUILDING LOT (tile=2) ─────────────────────────────
        // Rendered as GRASS — Pokémon FireRed style: world is green,
        // buildings sit on the grass, no dark block zones
        } else {
          // Checkerboard grass (same as park tile, just slightly darker hue)
          const v2 = (tx + ty) % 2;
          ctx.fillStyle = v2 === 0 ? '#488a30' : '#387820';
          ctx.fillRect(px, py, T, T);

          // Subtle darker grass detail / blade marks
          if ((tx * 5 + ty * 9) % 7 === 0) {
            ctx.fillStyle = '#2d6818';
            ctx.fillRect(px + (tx*7)%34 + 5,  py + (ty*11)%34 + 5,  2, 4);
            ctx.fillRect(px + (tx*13)%34 + 12, py + (ty*7)%34 + 10,  2, 4);
          }
          // Occasional lighter blade
          if ((tx * 11 + ty * 3) % 11 === 0) {
            ctx.fillStyle = '#60aa38';
            ctx.fillRect(px + (tx*9)%30 + 8,  py + (ty*13)%30 + 6,  2, 3);
          }
          // Scattered tiny flowers
          if ((tx * 7 + ty * 17) % 23 === 0) {
            ctx.fillStyle = '#f8e040';
            ctx.fillRect(px + (tx*11)%32 + 8, py + (ty*7)%32 + 8, 3, 3);
          }
          if ((tx * 19 + ty * 5) % 29 === 0) {
            ctx.fillStyle = '#f8a0c0';
            ctx.fillRect(px + (tx*7)%28 + 12, py + (ty*11)%28 + 14, 3, 3);
          }
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

    // ── Pixel-art palette ────────────────────────────
    // Warm FireRed / EarthBound style — flat colors, hard edges
    const PA = {
      wallA:    '#c87848',  // terracotta brick (warm)
      wallB:    '#b86838',  // darker terracotta
      wallLt:   '#d89868',  // sunlit highlight
      wallSh:   '#904828',  // shadow side
      roofA:    '#8a4828',  // dark red-brown roof
      roofB:    '#703820',  // roof shadow
      roofLt:   '#a05830',  // roof highlight
      roofEdge: '#582810',  // parapet outline
      winGlass: '#88c0f0',  // window blue-white
      winFr:    '#703820',  // window frame
      winLit:   '#f8e090',  // lit window warm yellow
      winDark:  '#203040',  // unlit window dark
      door:     '#502010',  // dark wood door
      doorFr:   '#382008',  // door frame
      doorKnob: '#e0b020',  // brass handle
      awning:   '#e04828',  // awning base (district-tinted)
      awningS:  '#c03820',  // awning stripe
      step:     '#c8b890',  // entrance step (sidewalk colour)
      outline:  '#3a2010',  // hard pixel outline
      signBg:   '#201008',  // sign background
      closedWall: '#386028', closedRoof: '#285020', closedBadge: '#50e058',
      lostWall:   '#6a2028', lostRoof:   '#501820', lostBadge:  '#ff5060',
      lockedWall: '#282030', lockedRoof: '#1c1828',
    };

    // State-driven colour overrides
    let wallA = PA.wallA, wallB = PA.wallB, wallLt = PA.wallLt, wallSh = PA.wallSh;
    let roofA = PA.roofA, roofB = PA.roofB, roofLt = PA.roofLt;
    let outlineC = PA.outline;

    if (isLocked) {
      wallA = PA.lockedWall; wallB = '#1e1828'; wallLt = '#302840'; wallSh = '#181420';
      roofA = PA.lockedRoof; roofB = '#141020'; roofLt = '#242030';
      outlineC = '#302848';
    } else if (isClosed) {
      wallA = '#386028'; wallB = '#2e5020'; wallLt = '#50804a'; wallSh = '#204018';
      roofA = '#285020'; roofB = '#1e3c18'; roofLt = '#3a6830';
      outlineC = '#385028';
    } else if (isLostToComp) {
      wallA = '#6a2028'; wallB = '#581820'; wallLt = '#883038'; wallSh = '#401018';
      roofA = '#501820'; roofB = '#3c1018'; roofLt = '#682028';
      outlineC = '#582020';
    }

    // ── Hard drop shadow (offset pixel block) ────────
    ctx.fillStyle = 'rgba(0,0,0,0.38)';
    ctx.fillRect(bx + 4, by + 5, bw, bh);

    // ── Outer outline (chunky pixel-art border) ───────
    if (isNearby) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 16;
    }
    ctx.fillStyle = outlineC;
    ctx.fillRect(bx - 2, by - 2, bw + 4, bh + 4);
    ctx.shadowBlur = 0;

    // ── Rooftop band ──────────────────────────────────
    // Visible sloped roof above the front wall — FireRed style
    const roofH = Math.max(10, Math.floor(T * 0.28));
    // Roof base
    ctx.fillStyle = roofA;
    ctx.fillRect(bx, by, bw, roofH);
    // Roof highlight (top 3px — sunlit parapet edge)
    ctx.fillStyle = roofLt;
    ctx.fillRect(bx, by, bw, 3);
    // Roof shadow at bottom of roof band
    ctx.fillStyle = roofB;
    ctx.fillRect(bx, by + roofH - 4, bw, 4);
    // Crenellation / parapet bumps across top (pixel blocks)
    const crenW = 8, crenH = 4, crenGap = 6;
    ctx.fillStyle = roofLt;
    for (let cx2 = bx + 3; cx2 < bx + bw - crenW; cx2 += crenW + crenGap) {
      ctx.fillRect(cx2, by - crenH, crenW, crenH);
      // Outline on each bump
      ctx.fillStyle = outlineC;
      ctx.fillRect(cx2 - 1, by - crenH - 1, crenW + 2, 1); // top
      ctx.fillRect(cx2 - 1, by - crenH - 1, 1, crenH + 1); // left
      ctx.fillRect(cx2 + crenW, by - crenH - 1, 1, crenH + 1); // right
      ctx.fillStyle = roofLt;
    }

    // ── Main wall face ────────────────────────────────
    // Alternating brick-row texture (2 shades)
    const wallTop = by + roofH;
    const wallBot = by + bh;
    const rowH = 8;
    for (let ry = wallTop; ry < wallBot; ry += rowH) {
      const rowAlt = Math.floor((ry - wallTop) / rowH) % 2;
      ctx.fillStyle = rowAlt === 0 ? wallA : wallB;
      ctx.fillRect(bx, ry, bw, Math.min(rowH, wallBot - ry));
    }
    // Left shadow strip
    ctx.fillStyle = wallSh;
    ctx.fillRect(bx, wallTop, 3, bh - roofH);
    // Right shadow strip
    ctx.fillStyle = wallSh;
    ctx.fillRect(bx + bw - 3, wallTop, 3, bh - roofH);
    // Sunlit highlight strip (top-right corner)
    ctx.fillStyle = wallLt;
    ctx.fillRect(bx + 2, wallTop, bw - 5, 3);

    if (isLocked) {
      this._drawLockedBuilding(ctx, bx, by, bw, bh, color);
      return;
    }

    // ── Awning / canopy ───────────────────────────────
    const awningY = by + bh - Math.floor(T * 0.48);
    const awningH = Math.floor(T * 0.22);
    // Pick district-tinted awning colour
    const awHex = isLostToComp ? '#a02030' : isClosed ? '#207a38' : color;
    ctx.fillStyle = awHex;
    ctx.fillRect(bx, awningY, bw, awningH);
    // Awning stripes (alternating lighter)
    const stripeW = Math.max(6, Math.floor(bw / 7));
    for (let s = 0; s < bw; s += stripeW * 2) {
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fillRect(bx + s, awningY, stripeW, awningH);
    }
    // Awning hard outline
    ctx.fillStyle = outlineC;
    ctx.fillRect(bx - 1, awningY - 1, bw + 2, 2);  // top edge
    ctx.fillRect(bx - 1, awningY + awningH, bw + 2, 2); // bottom edge
    // Fringe dots
    for (let f = bx + 3; f < bx + bw - 3; f += 6) {
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillRect(f, awningY + awningH, 2, 3);
    }

    // ── Windows ───────────────────────────────────────
    const winAreaTop  = wallTop + 5;
    const winAreaBot  = awningY - 4;
    const winRows = winAreaBot - winAreaTop > 28 ? 2 : 1;
    const winCols = bw >= T * 2.5 ? 3 : 2;
    const winW = Math.max(6, Math.floor((bw - 10) / winCols) - 5);
    const winH = Math.max(6, Math.floor((winAreaBot - winAreaTop) / winRows) - 6);

    for (let r = 0; r < winRows; r++) {
      for (let c = 0; c < winCols; c++) {
        const wx = bx + 5 + c * Math.floor((bw - 10) / winCols) + 1;
        const wy = winAreaTop + 3 + r * (winH + 6);
        const lit = ((Math.round(bx) + Math.round(by) + r * 7 + c * 13) % 5) < 3;

        // Frame (hard pixel outline)
        ctx.fillStyle = PA.winFr;
        ctx.fillRect(wx - 2, wy - 2, winW + 4, winH + 4);

        // Glass
        if (isLostToComp)  ctx.fillStyle = '#a02020';
        else if (isClosed) ctx.fillStyle = '#30c048';
        else if (lit)      ctx.fillStyle = PA.winLit;
        else               ctx.fillStyle = PA.winDark;
        ctx.fillRect(wx, wy, winW, winH);

        // Window divider cross
        ctx.fillStyle = PA.winFr;
        ctx.fillRect(wx + Math.floor(winW/2) - 1, wy, 2, winH);
        ctx.fillRect(wx, wy + Math.floor(winH/2) - 1, winW, 2);

        // Reflection (top-left pixel corner)
        if (lit && !isLostToComp) {
          ctx.fillStyle = 'rgba(255,255,255,0.45)';
          ctx.fillRect(wx + 1, wy + 1, 3, 2);
        }
      }
    }

    // ── Front door ───────────────────────────────────
    const doorW = Math.max(10, Math.floor(T * 0.28));
    const doorH = Math.floor(T * 0.36);
    const doorX = bx + Math.floor(bw / 2) - Math.floor(doorW / 2);
    const doorY = awningY - doorH;
    // Frame
    ctx.fillStyle = PA.doorFr;
    ctx.fillRect(doorX - 2, doorY - 2, doorW + 4, doorH + 3);
    // Panel
    ctx.fillStyle = PA.door;
    ctx.fillRect(doorX, doorY, doorW, doorH);
    // Upper glass inset
    ctx.fillStyle = isLostToComp ? 'rgba(200,40,40,0.4)' :
                    isClosed     ? 'rgba(40,200,80,0.35)' :
                                   'rgba(140,200,255,0.22)';
    ctx.fillRect(doorX + 2, doorY + 2, doorW - 4, Math.floor(doorH * 0.5));
    // Brass knob
    ctx.fillStyle = PA.doorKnob;
    ctx.fillRect(doorX + doorW - 5, doorY + Math.floor(doorH * 0.52), 3, 3);
    // Step
    ctx.fillStyle = PA.step;
    ctx.fillRect(doorX - 2, doorY + doorH, doorW + 4, 4);
    ctx.fillStyle = outlineC;
    ctx.fillRect(doorX - 3, doorY + doorH + 3, doorW + 6, 1);

    // ── Business sign (above awning) ─────────────────
    const signW = bw - 6;
    const signH = 11;
    const signX = bx + 3;
    const signY = awningY - signH - 2;
    ctx.fillStyle = PA.signBg;
    ctx.fillRect(signX, signY, signW, signH);
    ctx.fillStyle = outlineC;
    ctx.fillRect(signX - 1, signY - 1, signW + 2, 1);
    ctx.fillRect(signX - 1, signY + signH, signW + 2, 1);
    ctx.fillStyle = isNearby ? '#ffffff' : (isClosed ? '#60ff80' : isLostToComp ? '#ff6060' : color);
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText((biz?.name || '').substring(0, 14), bx + bw / 2, signY + signH - 2);

    // ── Business icon on roof ─────────────────────────
    if (biz) {
      const iconSize = Math.floor(T * 0.38);
      ctx.font = `${iconSize}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText(biz.icon, bx + bw / 2, by + Math.floor(roofH * 0.82));
    }

    // ── Status badge (CLIENT / TAKEN) ─────────────────
    if (isClosed || isLostToComp) {
      const badgeLabel = isClosed ? '✓ CLIENT' : '✗ TAKEN';
      const badgeColor = isClosed ? PA.closedBadge : PA.lostBadge;
      const badgeBg    = isClosed ? '#102808' : '#280808';
      const bW = 44, bH = 12;
      const bBx = bx + Math.floor(bw / 2) - Math.floor(bW / 2);
      const bBy = by + bh - bH - 2;
      ctx.fillStyle = outlineC;
      ctx.fillRect(bBx - 1, bBy - 1, bW + 2, bH + 2);
      ctx.fillStyle = badgeBg;
      ctx.fillRect(bBx, bBy, bW, bH);
      ctx.fillStyle = badgeColor;
      ctx.font = 'bold 7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(badgeLabel, bx + bw / 2, bBy + bH - 3);
    }

    // ── Warmth dot (top-right corner) ─────────────────
    if (biz && !isClosed && biz.warmth > 0) {
      const dotColors = ['#f5a623', '#ffd166', '#50e058'];
      const dc = dotColors[Math.min(biz.warmth - 1, 2)];
      ctx.fillStyle = outlineC;
      ctx.fillRect(bx + bw - 8, by + 3, 8, 8);
      ctx.fillStyle = dc;
      ctx.fillRect(bx + bw - 7, by + 4, 6, 6);
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
    mc.fillStyle = '#3a6e22';  // warm grass green base
    mc.fillRect(0, 0, mw, mh);

    // Tile-accurate minimap (roads, parks, water, trees)
    for (let ty = 0; ty < MAP_H; ty++) {
      for (let tx = 0; tx < MAP_W; tx++) {
        const t = this.map[ty]?.[tx];
        let col = null;
        if      (t === 0) col = '#706050';  // road — warm grey
        else if (t === 1) col = '#a89870';  // sidewalk — warm cream
        else if (t === 2) col = '#3a6e22';  // grass block — green
        else if (t === 3) col = '#4a8a28';  // park/grass — brighter green
        else if (t === 4) col = '#2858a8';  // water — blue
        else if (t === 5) col = '#285820';  // trees — dark green
        else if (t === 6) col = '#585048';  // parking — dark asphalt
        if (col) {
          mc.fillStyle = col;
          mc.fillRect(tx * TILE * scaleX, ty * TILE * scaleY, TILE * scaleX + 0.5, TILE * scaleY + 0.5);
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
  // Chunky Pokémon FireRed style — big head, flat colors, hard pixel outline
  _drawPlayer(ctx) {
    const px = Math.round(this.player.x);
    const py = Math.round(this.player.y);
    const frame = this.player.animFrame;
    const facing = this.player.facing;

    const walk = this.player.animTimer > 0 ||
      (this.keys && (this.keys['a']||this.keys['d']||this.keys['w']||this.keys['s']||
        this.keys['arrowleft']||this.keys['arrowright']||this.keys['arrowup']||this.keys['arrowdown']));
    const legSwing = walk ? Math.sin(frame * Math.PI / 2) * 3 : 0;
    const armSwing = walk ? Math.cos(frame * Math.PI / 2) * 2 : 0;
    const bobY = walk ? Math.abs(Math.sin(frame * Math.PI / 2)) * -2 : 0;
    const oy = Math.round(bobY);

    // Palette — warm teal suit, terracotta skin
    const P = {
      skin:    '#d4946a',
      skinLt:  '#e8b080',
      skinDk:  '#b07040',
      hair:    '#2a1808',
      suit:    '#006858',
      suitLt:  '#008870',
      suitDk:  '#004838',
      shirt:   '#f0ece0',
      tie:     '#00c8b8',
      trouser: '#182850',
      shoe:    '#1a1008',
      brief:   '#8a6010',
      briefLt: '#b08028',
      outline: '#1a0c04',
    };

    // ── Ground shadow (flat pixel rect) ──────────────────────────
    ctx.fillStyle = 'rgba(0,0,0,0.30)';
    ctx.fillRect(px - 9, py + 14, 18, 4);

    // Layout constants
    const footY  = py + 16 + oy;
    const legH   = 9;
    const legW   = 5;
    const bodyY  = footY - legH - 14;
    const bodyH  = 14;
    const bodyW  = 13;
    const headR  = 9;   // big chunky head
    const headCX = px;
    const headCY = bodyY - headR - 2 + oy;
    const neckY  = bodyY - 3 + oy;

    // ── Legs ──────────────────────────────────────────────────────
    const lLegX = px - 7;
    const rLegX = px + 2;
    const legY2  = footY - legH;
    const lSwing = (facing !== 'left' && facing !== 'right') ? legSwing : 0;
    const rSwing = (facing !== 'left' && facing !== 'right') ? -legSwing : 0;

    ctx.fillStyle = P.outline;
    ctx.fillRect(lLegX - 1, legY2 - 1 + lSwing, legW + 2, legH + 3);
    ctx.fillRect(rLegX - 1, legY2 - 1 + rSwing, legW + 2, legH + 3);
    ctx.fillStyle = P.trouser;
    ctx.fillRect(lLegX, legY2 + lSwing, legW, legH + 1);
    ctx.fillRect(rLegX, legY2 + rSwing, legW, legH + 1);
    // Shoes
    ctx.fillStyle = P.outline;
    ctx.fillRect(lLegX - 1, footY - 2 + lSwing, legW + 4, 5);
    ctx.fillRect(rLegX - 1, footY - 2 + rSwing, legW + 4, 5);
    ctx.fillStyle = P.shoe;
    ctx.fillRect(lLegX, footY - 1 + lSwing, legW + 2, 3);
    ctx.fillRect(rLegX, footY - 1 + rSwing, legW + 2, 3);

    // ── Body (suit jacket) ────────────────────────────────────────
    const bBodyX = px - Math.floor(bodyW / 2);
    ctx.fillStyle = P.outline;
    ctx.fillRect(bBodyX - 1, bodyY - 1 + oy, bodyW + 2, bodyH + 2);
    ctx.fillStyle = P.suit;
    ctx.fillRect(bBodyX, bodyY + oy, bodyW, bodyH);
    ctx.fillStyle = P.suitLt;
    ctx.fillRect(bBodyX, bodyY + oy, bodyW, 2);
    ctx.fillRect(bBodyX, bodyY + oy, 2, bodyH);
    ctx.fillStyle = P.suitDk;
    ctx.fillRect(bBodyX + bodyW - 2, bodyY + oy, 2, bodyH);
    ctx.fillStyle = P.shirt;
    ctx.fillRect(px - 2, bodyY + 1 + oy, 4, bodyH - 2);
    ctx.fillStyle = P.tie;
    ctx.fillRect(px - 1, bodyY + 2 + oy, 3, bodyH - 4);

    // ── Arms ──────────────────────────────────────────────────────
    const armX_L = bBodyX - 4;
    const armX_R = bBodyX + bodyW + 1;
    const armTopY = bodyY + 2 + oy;
    const armLen  = 9;

    ctx.fillStyle = P.outline;
    ctx.fillRect(armX_L - 1, armTopY + armSwing - 1, 5, armLen + 2);
    ctx.fillStyle = P.suit;
    ctx.fillRect(armX_L, armTopY + armSwing, 3, armLen);
    ctx.fillStyle = P.outline;
    ctx.fillRect(armX_R - 1, armTopY - armSwing - 1, 5, armLen + 2);
    ctx.fillStyle = P.suit;
    ctx.fillRect(armX_R, armTopY - armSwing, 3, armLen);

    // Left hand
    ctx.fillStyle = P.skinDk;
    ctx.fillRect(armX_L - 1, armTopY + armLen + armSwing - 1, 5, 5);
    ctx.fillStyle = P.skin;
    ctx.fillRect(armX_L, armTopY + armLen + armSwing, 3, 3);

    // Briefcase (right hand)
    const bfY = armTopY + armLen - armSwing;
    ctx.fillStyle = P.outline;
    ctx.fillRect(armX_R - 1, bfY - 1, 10, 8);
    ctx.fillStyle = P.brief;
    ctx.fillRect(armX_R, bfY, 8, 6);
    ctx.fillStyle = P.briefLt;
    ctx.fillRect(armX_R + 3, bfY - 2, 2, 2);
    ctx.fillStyle = P.outline;
    ctx.fillRect(armX_R + 3, bfY + 2, 2, 1);

    // ── Neck ──────────────────────────────────────────────────────
    ctx.fillStyle = P.outline;
    ctx.fillRect(px - 3, neckY - 1, 7, 5);
    ctx.fillStyle = P.skin;
    ctx.fillRect(px - 2, neckY, 5, 3);

    // ── Head ──────────────────────────────────────────────────────
    ctx.fillStyle = P.outline;
    ctx.fillRect(headCX - headR - 1, headCY - headR - 1, headR * 2 + 3, headR * 2 + 3);
    ctx.fillStyle = P.skin;
    ctx.fillRect(headCX - headR, headCY - headR, headR * 2 + 1, headR * 2 + 1);
    ctx.fillStyle = P.skinLt;
    ctx.fillRect(headCX - headR + 1, headCY - headR + 1, 5, 3);
    ctx.fillRect(headCX - headR + 1, headCY - headR + 1, 2, 6);

    // Hair (top pixel block)
    ctx.fillStyle = P.outline;
    ctx.fillRect(headCX - headR - 1, headCY - headR - 1, headR * 2 + 3, 2);
    ctx.fillStyle = P.hair;
    ctx.fillRect(headCX - headR, headCY - headR, headR * 2 + 1, 5);
    ctx.fillStyle = '#4a3020';
    ctx.fillRect(headCX - headR + 2, headCY - headR + 1, 4, 2);

    // Face features (pixel blocks)
    if (facing === 'down') {
      ctx.fillStyle = P.outline;
      ctx.fillRect(headCX - 5, headCY, 4, 4);
      ctx.fillRect(headCX + 2, headCY, 4, 4);
      ctx.fillStyle = '#f0f8ff';
      ctx.fillRect(headCX - 4, headCY + 1, 2, 2);
      ctx.fillRect(headCX + 3, headCY + 1, 2, 2);
      ctx.fillStyle = '#2040e0';
      ctx.fillRect(headCX - 4, headCY + 1, 1, 1);
      ctx.fillRect(headCX + 3, headCY + 1, 1, 1);
      ctx.fillStyle = P.outline;
      ctx.fillRect(headCX - 3, headCY + 4, 7, 2);
      ctx.fillStyle = '#d07060';
      ctx.fillRect(headCX - 2, headCY + 5, 5, 1);
    } else if (facing === 'right') {
      ctx.fillStyle = P.outline;
      ctx.fillRect(headCX + 3, headCY, 4, 4);
      ctx.fillStyle = '#f0f8ff';
      ctx.fillRect(headCX + 4, headCY + 1, 2, 2);
      ctx.fillStyle = '#2040e0';
      ctx.fillRect(headCX + 5, headCY + 1, 1, 1);
    } else if (facing === 'left') {
      ctx.fillStyle = P.outline;
      ctx.fillRect(headCX - 6, headCY, 4, 4);
      ctx.fillStyle = '#f0f8ff';
      ctx.fillRect(headCX - 5, headCY + 1, 2, 2);
      ctx.fillStyle = '#2040e0';
      ctx.fillRect(headCX - 5, headCY + 1, 1, 1);
    }

    // ── Name badge (pixel-art box) ────────────────────────────────
    const name = (this.state.businessName || 'Player').substring(0, 14);
    const nameW = Math.min(100, name.length * 6 + 12);
    const nameX2 = px - Math.floor(nameW / 2);
    const nameY2 = headCY - headR - 16;
    ctx.fillStyle = P.outline;
    ctx.fillRect(nameX2 - 2, nameY2 - 2, nameW + 4, 14);
    ctx.fillStyle = '#081418';
    ctx.fillRect(nameX2 - 1, nameY2 - 1, nameW + 2, 12);
    ctx.fillStyle = P.tie;
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(name, px, nameY2 + 8);
  }
  // ── Competitor NPC ───────────────────────────────────────────────
  _drawCompetitors(ctx) {
    this.competitorAgents.forEach((comp, i) => {
      this._drawNPC(ctx, comp.x, comp.y, comp, i);
    });
  }

  _drawNPC(ctx, px, py, comp, idx) {
    px = Math.round(px); py = Math.round(py);
    const bob = Math.round(Math.sin(Date.now() / 600 + idx * 1.3) * -1.5);
    const oy = bob;

    // Unique warm palette per competitor (villain colors)
    const npcPalettes = [
      // 0 — QuickClose (red undercutter)
      { suit: '#882020', suitLt: '#b03030', suitDk: '#601010',
        hair: '#1a0808', skin: '#c07050', skinLt: '#d89060',
        tie: '#ff5050', shoe: '#100808', outline: '#180404' },
      // 1 — RegionPro (navy incumbent)
      { suit: '#1a3870', suitLt: '#284fa0', suitDk: '#102050',
        hair: '#0a0808', skin: '#c88050', skinLt: '#e09860',
        tie: '#4488ff', shoe: '#080810', outline: '#080820' },
      // 2 — Pinnacle (purple premium)
      { suit: '#4a1868', suitLt: '#6a2890', suitDk: '#301040',
        hair: '#1a0818', skin: '#b86848', skinLt: '#d08060',
        tie: '#cc44ff', shoe: '#100810', outline: '#180018' },
    ];
    const pal = npcPalettes[idx % npcPalettes.length];

    // ── Ground shadow ─────────────────────────────────────────────
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.fillRect(px - 8, py + 14, 16, 4);

    const footY  = py + 16 + oy;
    const legH   = 8;
    const legW   = 4;
    const bodyY  = footY - legH - 13;
    const bodyH  = 13;
    const bodyW  = 12;
    const headR  = 8;
    const headCX = px;
    const headCY = bodyY - headR - 2 + oy;

    // ── Legs ──────────────────────────────────────────────────────
    const lLX = px - 6, rLX = px + 2;
    const legY2 = footY - legH;
    ctx.fillStyle = pal.outline;
    ctx.fillRect(lLX - 1, legY2 - 1, legW + 2, legH + 3);
    ctx.fillRect(rLX - 1, legY2 - 1, legW + 2, legH + 3);
    ctx.fillStyle = '#181828';
    ctx.fillRect(lLX, legY2, legW, legH + 1);
    ctx.fillRect(rLX, legY2, legW, legH + 1);
    // Shoes
    ctx.fillStyle = pal.outline;
    ctx.fillRect(lLX - 1, footY - 2, legW + 4, 5);
    ctx.fillRect(rLX - 1, footY - 2, legW + 4, 5);
    ctx.fillStyle = pal.shoe;
    ctx.fillRect(lLX, footY - 1, legW + 2, 3);
    ctx.fillRect(rLX, footY - 1, legW + 2, 3);

    // ── Body ──────────────────────────────────────────────────────
    const bBodyX = px - Math.floor(bodyW / 2);
    ctx.fillStyle = pal.outline;
    ctx.fillRect(bBodyX - 1, bodyY - 1 + oy, bodyW + 2, bodyH + 2);
    ctx.fillStyle = pal.suit;
    ctx.fillRect(bBodyX, bodyY + oy, bodyW, bodyH);
    ctx.fillStyle = pal.suitLt;
    ctx.fillRect(bBodyX, bodyY + oy, bodyW, 2);
    ctx.fillRect(bBodyX, bodyY + oy, 2, bodyH);
    ctx.fillStyle = pal.suitDk;
    ctx.fillRect(bBodyX + bodyW - 2, bodyY + oy, 2, bodyH);
    // Shirt + tie
    ctx.fillStyle = '#f0ece0';
    ctx.fillRect(px - 2, bodyY + 1 + oy, 4, bodyH - 2);
    ctx.fillStyle = pal.tie;
    ctx.fillRect(px - 1, bodyY + 2 + oy, 3, bodyH - 4);

    // ── Arms ──────────────────────────────────────────────────────
    const armX_L = bBodyX - 3;
    const armX_R = bBodyX + bodyW + 1;
    const armTopY = bodyY + 2 + oy;
    const armLen = 8;
    ctx.fillStyle = pal.outline;
    ctx.fillRect(armX_L - 1, armTopY - 1, 4, armLen + 2);
    ctx.fillRect(armX_R - 1, armTopY - 1, 4, armLen + 2);
    ctx.fillStyle = pal.suit;
    ctx.fillRect(armX_L, armTopY, 2, armLen);
    ctx.fillRect(armX_R, armTopY, 2, armLen);
    // Hands
    ctx.fillStyle = pal.skin;
    ctx.fillRect(armX_L - 1, armTopY + armLen - 1, 4, 4);
    ctx.fillRect(armX_R - 1, armTopY + armLen - 1, 4, 4);

    // ── Neck ──────────────────────────────────────────────────────
    ctx.fillStyle = pal.outline;
    ctx.fillRect(px - 3, bodyY - 4 + oy, 7, 5);
    ctx.fillStyle = pal.skin;
    ctx.fillRect(px - 2, bodyY - 3 + oy, 5, 3);

    // ── Head ──────────────────────────────────────────────────────
    ctx.fillStyle = pal.outline;
    ctx.fillRect(headCX - headR - 1, headCY - headR - 1, headR * 2 + 3, headR * 2 + 3);
    ctx.fillStyle = pal.skin;
    ctx.fillRect(headCX - headR, headCY - headR, headR * 2 + 1, headR * 2 + 1);
    ctx.fillStyle = pal.skinLt;
    ctx.fillRect(headCX - headR + 1, headCY - headR + 1, 4, 2);
    // Hair block
    ctx.fillStyle = pal.outline;
    ctx.fillRect(headCX - headR - 1, headCY - headR - 1, headR * 2 + 3, 2);
    ctx.fillStyle = pal.hair;
    ctx.fillRect(headCX - headR, headCY - headR, headR * 2 + 1, 5);
    // Menacing eyes (glowing color)
    ctx.fillStyle = pal.outline;
    ctx.fillRect(headCX - 5, headCY, 4, 4);
    ctx.fillRect(headCX + 2, headCY, 4, 4);
    ctx.fillStyle = pal.tie;  // eye glow matches tie color
    ctx.fillRect(headCX - 4, headCY + 1, 2, 2);
    ctx.fillRect(headCX + 3, headCY + 1, 2, 2);
    // Scowl
    ctx.fillStyle = pal.outline;
    ctx.fillRect(headCX - 3, headCY + 4, 7, 2);

    // ── Name tag ──────────────────────────────────────────────────
    const nameTag = (comp.name || ['QuickClose','RegionPro','Pinnacle'][idx % 3]).split(' ')[0].substring(0, 10);
    const tagW = Math.min(72, nameTag.length * 6 + 12);
    const tagX = px - Math.floor(tagW / 2);
    const tagY = headCY - headR - 15;
    ctx.fillStyle = pal.outline;
    ctx.fillRect(tagX - 2, tagY - 2, tagW + 4, 14);
    ctx.fillStyle = '#100408';
    ctx.fillRect(tagX - 1, tagY - 1, tagW + 2, 12);
    ctx.fillStyle = pal.tie;
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(nameTag, px, tagY + 8);
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

  // ── Failure gate ─────────────────────────────────────────────
  // Called after every rapport mutation. Returns true if the meeting was ended early.
  _checkEarlyExit(phase) {
    // Thresholds per phase — later phases are harder to bomb out of
    const thresholds = {
      opener:     -1,   // one bad open → they're already suspicious
      discovery:  -2,   // two wasted discovery questions → they lose patience
      pitch:      -3,   // bad pitch on top of weak discovery
      pricing:    -4,   // they'll tolerate a bad price attempt longer
      objections: -3,
    };
    const floor = thresholds[phase] ?? -3;
    if (this.enc.rapport <= floor) {
      this._triggerEarlyExit(phase);
      return true;
    }
    return false;
  }

  _triggerEarlyExit(phase) {
    const biz = this.biz;
    // Longer cooldown + cash drain (wasted time, damaged relationship)
    const cooldown = 10 + (this.state.survivalMode ? 5 : 0);
    const cashDrain = Math.round(150 + Math.random() * 200); // $150–$350
    biz.cooldownDays = cooldown;
    biz.ejectedPhase = phase;  // track where it went wrong for journal
    this.state.cash   = Math.max(0, this.state.cash - cashDrain);
    this.state.reputation = Math.max(0, this.state.reputation - 10);
    this.state.currentEncounter.phase = 'ejected';
    this.ui.showEjected(biz, phase, cashDrain, cooldown);
    this.ui.updateHUD(this.state);
  }

  handleOpener(choice) {
    const baseRapport = choice.rapport || 0;
    const bonus = this.flags.didRecon ? 0.5 : 0;
    const patternBonus = this.state.unlockedSkills.includes('pattern_interrupt') ? 0.5 : 0;
    this.enc.rapport += baseRapport + bonus + patternBonus;
    this.flags.openerQuality = this.enc.rapport >= 2 ? 'warm' : 'cold';

    if (choice.technique) this.flags.lastTechnique = choice.technique;

    if (this._checkEarlyExit('opener')) return;

    this.enc.phase = 'discovery';
    this.ui.showDiscoveryPhase(this.enc, this.state);
  }

  handleDiscovery(questionId, responseType) {
    // Use the pre-generated industry-aware questions (fallback to static DISCOVERY_QUESTIONS)
    const questions = this.flags.generatedQuestions || DISCOVERY_QUESTIONS;
    const q = questions.find(q => q.skillTag === questionId) ||
              DISCOVERY_QUESTIONS.find(q => q.skillTag === questionId);
    if (!q) return;

    const hasSkill = this.state.unlockedSkills.includes(q.skillTag);
    const effectiveResponse = hasSkill ? responseType : (responseType === 'good' ? 'ok' : responseType);

    if (effectiveResponse === 'good') {
      this.enc.rapport += q.rapportOnGood;
      this.flags.discoveryScore += q.rapportOnGood;
      this.ui.showToast(`✓ ${q.framework}`, 'success');
    } else {
      this.enc.rapport += q.rapportOnBad || 0;
      this.ui.showToast(`Missed opportunity — ${q.framework}`, 'warn');
    }

    if (this._checkEarlyExit('discovery')) return;

    this.flags.spinPhase++;
    const totalSPIN = questions.length;  // use dynamic question count

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

    if (this._checkEarlyExit('pitch')) return;

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
      if (this._checkEarlyExit('pricing')) return;
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

    if (this._checkEarlyExit('objections')) return;

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
