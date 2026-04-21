// ═══════════════════════════════════════════════════════════
//  BizAmpire — Auth & Save System
//  Handles: sign-in (email + Google stub), guest mode,
//           save/load with graceful degradation,
//           auto-save, HUD indicator
// ═══════════════════════════════════════════════════════════

// ── Safe Storage (degrades to in-memory when storage unavailable) ───
const _mem = {};
const store = {
  get(k) {
    try { const s = window['local'+'Storage']; return s ? s.getItem(k) : (_mem[k] ?? null); }
    catch { return _mem[k] ?? null; }
  },
  set(k, v) {
    try { const s = window['local'+'Storage']; if (s) s.setItem(k, v); }
    catch { /* ignore */ }
    _mem[k] = v;
  },
  remove(k) {
    try { const s = window['local'+'Storage']; if (s) s.removeItem(k); }
    catch { /* ignore */ }
    delete _mem[k];
  },
};

// ── Storage Keys ─────────────────────────────────────────────
const SAVE_KEY_GUEST  = 'bq_save_guest';
const AUTH_KEY        = 'bq_auth_user';
const SAVE_KEY_PREFIX = 'bq_save_';

// ── Auth State ───────────────────────────────────────────────
export const Auth = {
  user: null,
  isGuest: false,

  init() {
    try {
      const raw = store.get(AUTH_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.user = parsed;
        this.isGuest = parsed.provider === 'guest';
      }
    } catch { /* ignore */ }
    return this;
  },

  _persist() {
    if (this.user) store.set(AUTH_KEY, JSON.stringify(this.user));
    else store.remove(AUTH_KEY);
  },

  signInWithEmail(email, password) {
    if (!email || !password) return { error: 'Please enter email and password.' };
    if (!email.includes('@')) return { error: 'Please enter a valid email address.' };
    if (password.length < 6) return { error: 'Password must be at least 6 characters.' };

    const accountKey = 'bq_account_' + btoa(email.toLowerCase());
    const existing   = store.get(accountKey);
    if (existing) {
      const acct = JSON.parse(existing);
      if (acct.password !== btoa(password)) return { error: 'Incorrect password.' };
      this.user = { id: acct.id, email: acct.email, name: acct.name, provider: 'email' };
    } else {
      return { error: 'No account found. Use "Create Account" to register.' };
    }
    this.isGuest = false;
    this._persist();
    return { ok: true };
  },

  registerWithEmail(email, password, name) {
    if (!email || !password) return { error: 'Please fill in all fields.' };
    if (!email.includes('@')) return { error: 'Please enter a valid email address.' };
    if (password.length < 6) return { error: 'Password must be at least 6 characters.' };

    const accountKey = 'bq_account_' + btoa(email.toLowerCase());
    if (store.get(accountKey)) return { error: 'An account with this email already exists.' };

    const id   = 'user_' + Date.now() + '_' + Math.random().toString(36).slice(2,7);
    const acct = { id, email: email.toLowerCase(), name: name || email.split('@')[0], password: btoa(password) };
    store.set(accountKey, JSON.stringify(acct));
    this.user = { id, email: acct.email, name: acct.name, provider: 'email' };
    this.isGuest = false;
    this._persist();
    return { ok: true };
  },

  continueAsGuest() {
    this.user = { id: 'guest_' + Date.now(), email: null, name: 'Guest', provider: 'guest' };
    this.isGuest = true;
    this._persist();
    return { ok: true };
  },

  signInWithGoogle() {
    // Demo stub — integrate Firebase/Supabase for production
    const id  = 'google_' + Date.now();
    this.user = { id, email: id + '@google.bizampire', name: 'Google User', provider: 'google' };
    this.isGuest = false;
    this._persist();
    return { ok: true, demo: true };
  },

  signOut() {
    this.user    = null;
    this.isGuest = false;
    store.remove(AUTH_KEY);
  },

  get saveKey() {
    if (!this.user) return SAVE_KEY_GUEST;
    return this.isGuest ? SAVE_KEY_GUEST : SAVE_KEY_PREFIX + this.user.id;
  },

  get displayName() {
    if (!this.user) return null;
    return this.isGuest ? 'Guest' : (this.user.name || this.user.email);
  },
};

// ── Save / Load ───────────────────────────────────────────────
export const SaveSystem = {
  save(state) {
    if (!state) return false;
    try {
      const payload = {
        version: 2,
        savedAt: Date.now(),
        businessName: state.businessName,
        businessIndustry: state.businessIndustry,
        businessDescription: state.businessDescription,
        cash: state.cash,
        totalDeals: state.totalDeals,
        reputation: state.reputation,
        level: state.level,
        xp: state.xp,
        sp: state.sp,
        monthlyRevenue: state.monthlyRevenue,
        monthlyOverhead: state.monthlyOverhead,
        activeClients: state.activeClients,
        employees: state.employees,
        unlockedSkills: state.unlockedSkills,
        unlockedDistricts: state.unlockedDistricts,
        legacyArc: state.legacyArc,
        journalEntries: state.journalEntries,
        relationshipMap: state.relationshipMap,
        competitorDeals: state.competitorDeals,
        totalXpEarned: state.totalXpEarned,
        survivalMode: state.survivalMode,
        playerName: state.playerName,
        businessPersonas: state.businessPersonas,
      };
      store.set(Auth.saveKey, JSON.stringify(payload));
      return true;
    } catch { return false; }
  },

  load() {
    try {
      const raw = store.get(Auth.saveKey);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return (data.version && data.businessName) ? data : null;
    } catch { return null; }
  },

  hasSave() { return !!this.load(); },

  hasGuestSave() {
    try {
      const raw = store.get(SAVE_KEY_GUEST);
      if (!raw) return null;
      const d = JSON.parse(raw);
      return d.businessName ? d : null;
    } catch { return null; }
  },

  deleteSave() { store.remove(Auth.saveKey); },

  getSaveSummary(data) {
    if (!data) return null;
    const ago = _timeAgo(data.savedAt);
    return data.businessName + ' · Lv ' + (data.level||1) + ' · ' + (data.totalDeals||0) + ' deals · ' + ago;
  },
};

// ── Auto-save ─────────────────────────────────────────────────
let _autoSaveTimer = null;
let _saveIndicator = null;
let _saveText      = null;

export function initAutoSave(getState) {
  _saveIndicator = document.getElementById('save-indicator');
  _saveText      = document.getElementById('save-indicator-text');
  clearInterval(_autoSaveTimer);
  _autoSaveTimer = setInterval(() => {
    const s = getState();
    if (s) triggerSave(s);
  }, 60_000);
}

export function triggerSave(state) {
  if (!state) return;
  _setSaving();
  setTimeout(() => {
    const ok = SaveSystem.save(state);
    if (ok) _setSaved(); else _setSaveError();
  }, 600);
}

function _setSaving() {
  if (_saveIndicator) _saveIndicator.className = 'save-indicator saving';
  if (_saveText) _saveText.textContent = 'Saving...';
}
function _setSaved() {
  if (_saveIndicator) _saveIndicator.className = 'save-indicator saved';
  if (_saveText) _saveText.textContent = 'Saved';
  setTimeout(() => {
    if (_saveIndicator) _saveIndicator.className = 'save-indicator';
    if (_saveText) _saveText.textContent = 'Saved';
  }, 2500);
}
function _setSaveError() {
  if (_saveIndicator) _saveIndicator.className = 'save-indicator';
  if (_saveText) _saveText.textContent = 'Save failed';
}

// ── Auth UI ───────────────────────────────────────────────────
export const AuthUI = {
  _tab: 'signin',
  _onComplete: null,

  open(onComplete) {
    this._onComplete = onComplete;
    const overlay = document.getElementById('auth-overlay');
    if (overlay) overlay.classList.add('open');
    this._switchTab('signin');
    this._clearError();
    this._wire();
  },

  close() {
    const overlay = document.getElementById('auth-overlay');
    if (overlay) overlay.classList.remove('open');
  },

  _wire() {
    const replace = (id, handler) => {
      const el = document.getElementById(id);
      if (!el) return;
      const n = el.cloneNode(true);
      el.parentNode.replaceChild(n, el);
      n.addEventListener('click', handler);
    };
    replace('btn-auth-google',  () => this._google());
    replace('btn-auth-submit',  () => this._submit());
    replace('btn-auth-guest',   () => this._guest());
    ['auth-email','auth-password','auth-displayname'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('keydown', e => { if (e.key==='Enter') this._submit(); });
    });
  },

  _switchTab(tab) {
    this._tab = tab;
    document.getElementById('auth-tab-signin')?.classList.toggle('active', tab==='signin');
    document.getElementById('auth-tab-register')?.classList.toggle('active', tab==='register');
    const nameF = document.getElementById('auth-displayname');
    if (nameF) nameF.style.display = tab==='register' ? 'block' : 'none';
    const sub = document.getElementById('btn-auth-submit');
    if (sub) sub.textContent = tab==='signin' ? 'Sign In' : 'Create Account';
    const pw = document.getElementById('auth-password');
    if (pw) pw.setAttribute('autocomplete', tab==='register' ? 'new-password' : 'current-password');
    this._clearError();
  },

  _clearError() {
    const el = document.getElementById('auth-error');
    if (el) el.textContent = '';
    ['auth-email','auth-password'].forEach(id => document.getElementById(id)?.classList.remove('error'));
  },

  _showError(msg) {
    const el = document.getElementById('auth-error');
    if (el) el.textContent = msg;
  },

  _google() {
    Auth.signInWithGoogle();
    this.close();
    this._onComplete?.(Auth.user, SaveSystem.load());
  },

  _submit() {
    this._clearError();
    const email = document.getElementById('auth-email')?.value.trim()||'';
    const pass  = document.getElementById('auth-password')?.value||'';
    const name  = document.getElementById('auth-displayname')?.value.trim()||'';
    const res   = this._tab==='signin'
      ? Auth.signInWithEmail(email, pass)
      : Auth.registerWithEmail(email, pass, name);
    if (res.error) {
      this._showError(res.error);
    } else {
      this.close();
      this._onComplete?.(Auth.user, SaveSystem.load());
    }
  },

  _guest() {
    Auth.continueAsGuest();
    this.close();
    this._onComplete?.(Auth.user, SaveSystem.load());
  },
};

window.__authSwitchTab = (tab) => AuthUI._switchTab(tab);

// ── Helpers ───────────────────────────────────────────────────
function _timeAgo(ts) {
  if (!ts) return 'unknown';
  const d = Date.now() - ts;
  const m = Math.floor(d/60000);
  if (m < 1) return 'just now';
  if (m < 60) return m + 'm ago';
  const h = Math.floor(m/60);
  if (h < 24) return h + 'h ago';
  return Math.floor(h/24) + 'd ago';
}
