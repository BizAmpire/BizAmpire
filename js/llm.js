// ═══════════════════════════════════════════════════════════
//  BizAmpire: Street Level — Local LLM Coach
//  Uses transformers.js (HuggingFace) — no API key, no cost.
//  Device priority: WebGPU (fast) → WASM (Safari/fallback) → off
//  Model: SmolLM2-360M-Instruct (400MB, cached after first load)
//  Player inputs never persisted to disk. Only anon signals logged.
// ═══════════════════════════════════════════════════════════

import { pipeline, env }
  from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3/dist/transformers.min.js';

const MODEL_ID  = 'Xenova/TinyLlama-1.1B-Chat-v1.0';
const MODEL_DTYPE = 'q4';   // 4-bit quantised — smallest footprint

// ── State ────────────────────────────────────────────────────
let _pipe        = null;
let _status      = 'idle';   // idle | loading | ready | unsupported | error
let _onProgress  = null;     // set by caller during load

// ── Device detection ─────────────────────────────────────────
async function _bestDevice() {
  try {
    if (navigator.gpu) {
      const adapter = await navigator.gpu.requestAdapter();
      if (adapter) return 'webgpu';
    }
  } catch (_) {}
  return 'wasm';
}

// ── Public API ───────────────────────────────────────────────

export function getStatus() { return _status; }
export function isReady()   { return _status === 'ready'; }
export function detectNoFitOpportunity(text) { return _detectNoFit(text); }

/**
 * Load the model once. Safe to call multiple times.
 * @param {Function} onProgress  called with { progress 0-100, message }
 */
export async function load(onProgress) {
  if (_status === 'ready' || _status === 'loading') {
    console.log('[BizAmpire LLM] Already loading or ready:', _status);
    return;
  }
  _status = 'loading';
  _onProgress = onProgress;
  console.log('[BizAmpire LLM] Starting load...');

  try {
    const device = await _bestDevice();
    console.log('[BizAmpire LLM] Device:', device);
    _notify(0, `Initialising AI Coach (${device.toUpperCase()})…`);

    env.allowLocalModels = false;  // always pull from HF Hub

    console.log('[BizAmpire LLM] Loading pipeline...');
    _pipe = await pipeline('text-generation', MODEL_ID, {
      dtype:  MODEL_DTYPE,
      device,
      progress_callback: (p) => {
        console.log('[BizAmpire LLM] Progress:', p);
        if (p.status === 'progress') {
          const pct = Math.round((p.loaded / p.total) * 100) || 0;
          _notify(pct, `Downloading AI Coach… ${pct}%`);
        }
      },
    });

    _status = 'ready';
    console.log('[BizAmpire LLM] Pipeline loaded, status set to ready');
    _notify(100, 'AI Coach ready');
  } catch (err) {
    console.warn('[BizAmpire LLM] Load failed:', err.message);
    console.warn('[BizAmpire LLM] Error details:', err);
    _status = 'error';
    _notify(0, 'AI Coach unavailable — using standard mode');
  }
}

function _notify(progress, message) {
  if (typeof _onProgress === 'function') _onProgress({ progress, message });
}

/**
 * Detect if prospect is expressing they have no IT/service needs (fits poorly).
 * Honest "no fit" is still valuable for network building.
 */
function _detectNoFit(playerText) {
  const text = (playerText || '').toLowerCase();
  const noFitSignals = [
    'don\'t have', 'doesn\'t have', 'no ', 'never had', 'don\'t use', 'don\'t need',
    'not an issue', 'not a problem', 'everything\'s fine', 'handles it', 'already',
    'in-house', 'internal', 'have someone', 'we manage', 'all set', 'sorted',
  ];
  const count = noFitSignals.filter(sig => text.includes(sig)).length;
  return count >= 2; // 2+ signals = honest "no fit" admission
}

/**
 * Evaluate a player's free-text sales input.
 * Returns structured coaching feedback.
 *
 * @param {string} playerText   - what the player typed
 * @param {string} phase        - situation | problem | implication | need_payoff | opener | close
 * @param {Object} enc          - current encounter { business, rapport }
 * @param {Object} questionRef  - optional reference question from bank { question, goodResponse, coaching }
 * @returns {Promise<EvalResult>}
 */
export async function evaluate(playerText, phase, enc, questionRef = null) {
  if (!isReady()) return null;

  // Check if prospect is honest about no fit — network building path
  const isNoFit = _detectNoFit(playerText);

  const biz     = enc?.business || {};
  const rapport = enc?.rapport  ?? 0;
  const phaseLabel = {
    situation:   'Situation (fact-finding)',
    problem:     'Problem (surfacing pain)',
    implication: 'Implication (amplifying cost)',
    need_payoff: 'Need-Payoff (articulating value)',
    opener:      'Opener (first impression)',
    close:       'Close (asking for the business)',
  }[phase] || phase;

  const exampleBlock = questionRef
    ? `\nStrong example for this scenario: "${questionRef.question}"\nWhy it works: ${questionRef.coaching || questionRef.goodResponse || ''}`
    : '';

  const systemPrompt = `You are an expert sales coach evaluating a trainee's response in a sales simulation.
Framework: SPIN Selling (Situation → Problem → Implication → Need-Payoff).
Prospect: ${biz.owner || 'the owner'}, ${biz.ownerTitle || ''} at ${biz.name || 'the business'}.
Prospect pain: ${biz.pain || 'unknown'}.
Current rapport: ${rapport.toFixed(1)}/5.
Current phase: ${phaseLabel}.${exampleBlock}

Evaluate the trainee's message. Respond ONLY with valid JSON in this exact format:
{"score":0,"rapportDelta":0,"feedback":"one sentence","stronger":"a better version"}

score: 0=deflection/off-topic, 1=weak, 2=solid, 3=excellent
rapportDelta: -1 to +2 (rapport change this message earns)
feedback: one sentence explaining the score
stronger: a better version of what they said (keep same intent, improve technique)${isNoFit ? `

SPECIAL: This prospect just admitted they don't have real need for your service (no fit). If the trainee gracefully accepts this and pivots to building a relationship/referral network instead, reward with +1 rapport and score as "solid". They're doing good sales instinct: a bad fit today is a referral partner tomorrow.` : ''}`;

  const userPrompt = `Trainee said: "${playerText}"`;

  try {
    const out = await _pipe(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
      {
        max_new_tokens: 120,
        do_sample:      false,   // greedy — consistent, not creative
        temperature:    1,
        return_full_text: false,
      }
    );

    const raw  = out?.[0]?.generated_text ?? '';
    const json = _extractJSON(raw);
    if (!json) return _fallback(playerText);

    return {
      score:        Math.max(0, Math.min(3, json.score       ?? 1)),
      rapportDelta: Math.max(-1, Math.min(2, json.rapportDelta ?? 0)),
      feedback:     json.feedback || '',
      stronger:     json.stronger || '',
      fromLLM:      true,
    };
  } catch (err) {
    console.warn('[BizAmpire LLM] evaluate error:', err.message);
    return _fallback(playerText);
  }
}

/**
 * Classify which SPIN phase a free-text question belongs to.
 * Used when player types a custom question outside a guided phase.
 */
export async function classifyPhase(playerText) {
  if (!isReady()) return null;

  const systemPrompt = `Classify this sales question into one SPIN phase.
Respond with ONLY one word: situation, problem, implication, or need_payoff.
situation   = fact-finding about their setup/size/process
problem     = surfacing pain, frustration, or gaps
implication = exploring cost/consequence of the problem
need_payoff = asking about value of solving it`;

  try {
    const out = await _pipe(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: playerText },
      ],
      { max_new_tokens: 5, do_sample: false, return_full_text: false }
    );
    const word = (out?.[0]?.generated_text ?? '').trim().toLowerCase();
    return ['situation','problem','implication','need_payoff'].includes(word) ? word : null;
  } catch (_) { return null; }
}

// ── Helpers ──────────────────────────────────────────────────

function _extractJSON(text) {
  try {
    // Try to pull the first {...} block out of the response
    const match = text.match(/\{[\s\S]*?\}/);
    if (match) return JSON.parse(match[0]);
  } catch (_) {}
  return null;
}

function _fallback(text) {
  // Heuristic fallback when LLM output can't be parsed
  const words = text.trim().split(/\s+/).length;
  const hasQuestion = text.includes('?');
  const score = words < 4 ? 0 : hasQuestion ? 2 : 1;
  return {
    score,
    rapportDelta: score === 2 ? 1 : 0,
    feedback: score === 2
      ? 'Decent question — watch for specificity.'
      : 'Try framing this as a direct question about their situation.',
    stronger: '',
    fromLLM:  false,
  };
}
