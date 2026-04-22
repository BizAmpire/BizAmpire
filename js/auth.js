// ═══════════════════════════════════════════════════════════
//  BizAmpire — Auth & Save System (Supabase)
//  Handles: email/password, magic link, guest mode,
//           cloud saves (Supabase), local fallback,
//           auto-save, HUD indicator
// ═══════════════════════════════════════════════════════════

// ── Supabase Client ──────────────────────────────────────────
// Supabase loaded via <script src="js/supabase.min.js"> before this module
const SUPABASE_URL  = 'https://pfcegzcbpywmrruwlgdw.supabase.co';
const SUPABASE_KEY  = 'sb_publishable_28TdBif96AmznzbEqWMINg_PnMvitw8';
// Guard: if supabase.min.js failed to load, fall back to a no-op stub so the
// module can still parse and boot() can run (auth will just be unavailable)
const supabase = (window.supabase && window.supabase.createClient)
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
  : {
      auth: {
        getSession:      () => Promise.resolve({ data: { session: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: {}, error: { message: 'Auth unavailable — please reload.' } }),
        signUp:          () => Promise.resolve({ data: {}, error: { message: 'Auth unavailable — please reload.' } }),
        signInWithOtp:   () => Promise.resolve({ data: {}, error: { message: 'Auth unavailable — please reload.' } }),
        signOut:         () => Promise.resolve({}),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({ select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }), order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }) }), upsert: () => Promise.resolve({ error: null }) }) }),
    };

// ── Safe Local Storage (fallback when storage unavailable) ───
const _mem = {};
const store = {
  get(k)    { try { const s = window['local'+'Storage']; return s ? s.getItem(k) : (_mem[k] ?? null); } catch { return _mem[k] ?? null; } },
  set(k, v) { try { const s = window['local'+'Storage']; if (s) s.setItem(k, v); } catch {} _mem[k] = v; },
  remove(k) { try { const s = window['local'+'Storage']; if (s) s.removeItem(k); } catch {} delete _mem[k]; },
};

const SAVE_KEY_GUEST  = 'ba_save_guest';
const SAVE_KEY_PREFIX = 'ba_save_';

// ── Auth State ───────────────────────────────────────────────
export const Auth = {
  user:        null,  // { id, email, name, provider }
  isGuest:     false,
  _session:    null,  // raw Supabase session

  // Called once on page load — restores session from Supabase
  // Always resolves within 3s so a slow/blocked network can't freeze the boot screen
  async init() {
    const timeout = new Promise(resolve => setTimeout(resolve, 3000));
    try {
      const sessionReq = supabase.auth.getSession();
      const result = await Promise.race([sessionReq, timeout]);
      const session = result?.data?.session;
      if (session?.user) {
        this._setFromSession(session);
      } else {
        // Fall back to locally cached user (guest or previously signed-in)
        try {
          const raw = store.get('ba_auth_user');
          if (raw) {
            const parsed = JSON.parse(raw);
            this.user    = parsed;
            this.isGuest = parsed.provider === 'guest';
          }
        } catch {}
      }
    } catch {
      // Network error — fall back to local cache silently
      try {
        const raw = store.get('ba_auth_user');
        if (raw) {
          const parsed = JSON.parse(raw);
          this.user    = parsed;
          this.isGuest = parsed.provider === 'guest';
        }
      } catch {}
    }

    // Listen for auth state changes (OAuth redirects, sign-outs)
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        this._setFromSession(session);
        window.__bizampireAuth?.updateTitle?.();
      } else if (!this.isGuest) {
        this.user    = null;
        this.isGuest = false;
        window.__bizampireAuth?.updateTitle?.();
      }
    });

    return this;
  },

  _setFromSession(session) {
    const u      = session.user;
    this._session = session;
    this.user    = {
      id:       u.id,
      email:    u.email,
      name:     u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'Player',
      provider: u.app_metadata?.provider || 'email',
    };
    this.isGuest = false;
    store.set('ba_auth_user', JSON.stringify(this.user));
  },

  // ── Email + Password ───────────────────────────────────────
  async signInWithEmail(email, password) {
    if (!email || !password) return { error: 'Please enter email and password.' };
    if (!email.includes('@')) return { error: 'Please enter a valid email address.' };
    if (password.length < 6)  return { error: 'Password must be at least 6 characters.' };
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      this._setFromSession(data.session);
      return { ok: true };
    } catch (e) { return { error: 'Sign in failed. Please try again.' }; }
  },

  async registerWithEmail(email, password, name) {
    if (!email || !password) return { error: 'Please fill in all fields.' };
    if (!email.includes('@')) return { error: 'Please enter a valid email address.' };
    if (password.length < 6)  return { error: 'Password must be at least 6 characters.' };
    try {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name || email.split('@')[0] } },
      });
      if (error) return { error: error.message };
      // If email confirmation is required, session will be null
      if (!data.session) return { ok: true, confirm: true };
      this._setFromSession(data.session);
      return { ok: true };
    } catch (e) { return { error: 'Registration failed. Please try again.' }; }
  },

  // ── Magic Link (passwordless) ─────────────────────────────
  async sendMagicLink(email) {
    if (!email || !email.includes('@')) return { error: 'Please enter a valid email address.' };
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: 'https://bizampire.com' },
      });
      if (error) return { error: error.message };
      return { ok: true };
    } catch (e) { return { error: 'Could not send magic link. Please try again.' }; }
  },

  // ── Guest ─────────────────────────────────────────────────
  continueAsGuest() {
    this.user    = { id: 'guest_' + Date.now(), email: null, name: 'Guest', provider: 'guest' };
    this.isGuest = true;
    store.set('ba_auth_user', JSON.stringify(this.user));
    return { ok: true };
  },

  // ── Sign Out ───────────────────────────────────────────────
  async signOut() {
    try { await supabase.auth.signOut(); } catch {}
    this.user     = null;
    this.isGuest  = false;
    this._session = null;
    store.remove('ba_auth_user');
  },

  get saveKey() {
    if (!this.user) return SAVE_KEY_GUEST;
    return this.isGuest ? SAVE_KEY_GUEST : SAVE_KEY_PREFIX + this.user.id;
  },

  get displayName() {
    if (!this.user) return null;
    return this.isGuest ? 'Guest' : (this.user.name || this.user.email);
  },

  get isSignedIn() {
    return !!this.user && !this.isGuest;
  },
};

// ── Save / Load ───────────────────────────────────────────────
export const SaveSystem = {

  _buildPayload(state) {
    // Snapshot mutable district/business state (warmth, closed, cooldown, lostToCompetitor)
    const districtSnapshot = (state.districts || []).map(d => ({
      id: d.id,
      businesses: (d.businesses || []).map(b => ({
        id:               b.id,
        warmth:           b.warmth,
        closed:           b.closed,
        cooldownDays:     b.cooldownDays,
        lostToCompetitor: b.lostToCompetitor,
      })),
    }));
    return {
      version:             3,
      savedAt:             Date.now(),
      businessName:        state.businessName,
      businessIndustry:    state.businessIndustry,
      businessDescription: state.businessDescription,
      cash:                state.cash,
      totalDeals:          state.totalDeals,
      reputation:          state.reputation,
      level:               state.level,
      xp:                  state.xp,
      skillPoints:         state.skillPoints,
      monthlyRevenue:      state.monthlyRevenue,
      monthlyOverhead:     state.monthlyOverhead,
      activeClients:       state.activeClients,
      employees:           state.employees,
      unlockedSkills:      state.unlockedSkills,
      unlockedDistricts:   state.unlockedDistricts,
      milestonesReached:   state.milestonesReached,
      legacyArc:           state.legacyArc,
      journalEntries:      state.journalEntries,
      relationshipMap:     state.relationshipMap,
      competitorDeals:     state.competitorDeals,
      totalXpEarned:       state.totalXpEarned,
      survivalMode:        state.survivalMode,
      playerName:          state.playerName,
      businessPersonas:    state.businessPersonas,
      monthTimer:          state.monthTimer,
      daysSinceLastDeal:   state.daysSinceLastDeal,
      referralPartners:    state.referralPartners,
      districtSnapshot,
    };
  },

  // Save — cloud if signed in, local always as fallback
  async save(state) {
    if (!state) return false;
    try {
      const payload = this._buildPayload(state);
      const json    = JSON.stringify(payload);

      // Always write local first (instant, offline-safe)
      store.set(Auth.saveKey, json);

      // Cloud save for signed-in users
      if (Auth.isSignedIn) {
        const { error } = await supabase
          .from('saves')
          .upsert(
            { user_id: Auth.user.id, state: payload, updated_at: new Date().toISOString() },
            { onConflict: 'user_id' }
          );
        if (error) console.warn('Cloud save failed, local save intact:', error.message);
      }

      return true;
    } catch (e) { console.warn('Save error:', e); return false; }
  },

  // Load — cloud if signed in (fresher), else local
  async load() {
    try {
      if (Auth.isSignedIn) {
        const { data, error } = await supabase
          .from('saves')
          .select('state')
          .eq('user_id', Auth.user.id)
          .single();
        if (!error && data?.state?.businessName) {
          // Sync cloud save back to local
          store.set(Auth.saveKey, JSON.stringify(data.state));
          return data.state;
        }
      }
      // Fallback to local
      const raw = store.get(Auth.saveKey);
      if (!raw) return null;
      const d = JSON.parse(raw);
      // Accept v2 (legacy) and v3+ saves
      return (d.version >= 2 && d.businessName) ? d : null;
    } catch { return null; }
  },

  // Sync load — for UI rendering (local only, no async)
  loadLocal() {
    try {
      const raw = store.get(Auth.saveKey);
      if (!raw) return null;
      const d = JSON.parse(raw);
      return (d.version && d.businessName) ? d : null;
    } catch { return null; }
  },

  hasSave()      { return !!this.loadLocal(); },

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
    return `${data.businessName} · Lv ${data.level || 1} · ${data.totalDeals || 0} deals · ${ago}`;
  },
};

// ── Auto-save ─────────────────────────────────────────────────
let _autoSaveTimer  = null;
let _saveIndicator  = null;
let _saveText       = null;

export function initAutoSave(getState) {
  _saveIndicator = document.getElementById('save-indicator');
  _saveText      = document.getElementById('save-indicator-text');
  clearInterval(_autoSaveTimer);
  _autoSaveTimer = setInterval(() => {
    const s = getState();
    if (s) triggerSave(s);
  }, 60_000);
}

export async function triggerSave(state) {
  if (!state) return;
  _setSaving();
  const ok = await SaveSystem.save(state);
  if (ok) _setSaved(); else _setSaveError();
}

function _setSaving() {
  if (_saveIndicator) _saveIndicator.className = 'save-indicator saving';
  if (_saveText)      _saveText.textContent = 'Saving...';
}
function _setSaved() {
  if (_saveIndicator) _saveIndicator.className = 'save-indicator saved';
  if (_saveText)      _saveText.textContent = Auth.isSignedIn ? '☁ Saved' : 'Saved';
  setTimeout(() => {
    if (_saveIndicator) _saveIndicator.className = 'save-indicator';
  }, 2500);
}
function _setSaveError() {
  if (_saveIndicator) _saveIndicator.className = 'save-indicator';
  if (_saveText)      _saveText.textContent = 'Save failed';
}

// ── Auth UI ───────────────────────────────────────────────────
export const AuthUI = {
  _tab:        'signin',
  _onComplete: null,
  _magicSent:  false,

  open(onComplete) {
    this._onComplete = onComplete;
    this._magicSent  = false;
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
    replace('btn-auth-submit',  () => this._submit());
    replace('btn-auth-guest',   () => this._guest());
    replace('btn-auth-magic',   () => this._magic());

    document.getElementById('auth-tab-signin')?.addEventListener('click',    () => this._switchTab('signin'));
    document.getElementById('auth-tab-register')?.addEventListener('click',  () => this._switchTab('register'));

    ['auth-email','auth-password','auth-displayname'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') this._submit(); });
    });
  },

  _switchTab(tab) {
    this._tab       = tab;
    this._magicSent = false;
    document.getElementById('auth-tab-signin')?.classList.toggle('active',   tab === 'signin');
    document.getElementById('auth-tab-register')?.classList.toggle('active', tab === 'register');
    const nameF = document.getElementById('auth-displayname');
    if (nameF) nameF.style.display = tab === 'register' ? 'block' : 'none';
    const sub = document.getElementById('btn-auth-submit');
    if (sub) sub.textContent = tab === 'signin' ? 'Sign In' : 'Create Account';
    const pw = document.getElementById('auth-password');
    if (pw) pw.setAttribute('autocomplete', tab === 'register' ? 'new-password' : 'current-password');
    this._clearError();
    this._resetMagicBtn();
  },

  _clearError() {
    const el = document.getElementById('auth-error');
    if (el) el.textContent = '';
    ['auth-email','auth-password'].forEach(id => document.getElementById(id)?.classList.remove('error'));
  },

  _showError(msg, isSuccess = false) {
    const el = document.getElementById('auth-error');
    if (el) {
      el.textContent = msg;
      el.style.color = isSuccess ? 'var(--sage)' : 'var(--crimson)';
    }
  },

  _resetMagicBtn() {
    const btn = document.getElementById('btn-auth-magic');
    if (btn) btn.textContent = '✉ Send Magic Link';
  },

  async _submit() {
    this._clearError();
    const email = document.getElementById('auth-email')?.value.trim() || '';
    const pass  = document.getElementById('auth-password')?.value || '';
    const name  = document.getElementById('auth-displayname')?.value.trim() || '';

    const btn = document.getElementById('btn-auth-submit');
    if (btn) btn.textContent = 'Please wait...';

    const res = this._tab === 'signin'
      ? await Auth.signInWithEmail(email, pass)
      : await Auth.registerWithEmail(email, pass, name);

    if (btn) btn.textContent = this._tab === 'signin' ? 'Sign In' : 'Create Account';

    if (res.error) {
      this._showError(res.error);
    } else if (res.confirm) {
      this._showError('Check your email to confirm your account, then sign in.', true);
    } else {
      this.close();
      const save = await SaveSystem.load();
      this._onComplete?.(Auth.user, save);
    }
  },

  async _magic() {
    if (this._magicSent) return;
    this._clearError();
    const email = document.getElementById('auth-email')?.value.trim() || '';
    const btn   = document.getElementById('btn-auth-magic');

    if (btn) btn.textContent = 'Sending...';
    const res = await Auth.sendMagicLink(email);
    if (btn) btn.textContent = '✉ Send Magic Link';

    if (res.error) {
      this._showError(res.error);
    } else {
      this._magicSent = true;
      if (btn) btn.textContent = '✓ Link sent!';
      this._showError('Magic link sent! Check your email and click the link to sign in.', true);
    }
  },

  async _guest() {
    Auth.continueAsGuest();
    this.close();
    const save = SaveSystem.loadLocal();
    this._onComplete?.(Auth.user, save);
  },
};

window.__authSwitchTab = (tab) => AuthUI._switchTab(tab);

// ── Helpers ───────────────────────────────────────────────────
function _timeAgo(ts) {
  if (!ts) return 'unknown';
  const d = Date.now() - ts;
  const m = Math.floor(d / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60);
  if (h < 24) return h + 'h ago';
  return Math.floor(h / 24) + 'd ago';
}
