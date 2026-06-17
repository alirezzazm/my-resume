'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

/**
 * AmbientMusic — موزیک متن آرام و generative با Web Audio API
 *
 * بدون نیاز به فایل صوتی — موزیک به‌صورت زنده ساخته می‌شه:
 *  • pad ملایم با چند oscillator (lush, evolving)
 *  • bass drone عمیق
 *  • arpeggio تصادفی روی scale پنتاتونیک ماژور D
 *  • reverb-like delay برای فضای بزرگ
 *
 * کنترل‌ها:
 *  • mute/unmute (کلیک دکمه)
 *  • volume slider (hover/long-press)
 *  • localStorage برای حفظ ترجیحات
 *  • auto-start بعد از اولین تعامل کاربر
 */

const SCALE_HZ = [
  // D major pentatonic across 3 octaves
  146.83, 164.81, 220.00, 246.94, 277.18, // D3 E3 A3 B3 C#4 (extended)
  293.66, 329.63, 369.99, 440.00, 493.88, // D4 E4 F#4 A4 B4
  587.33, 659.25, 739.99, 880.00,          // D5 E5 F#5 A5
];

// pad chords (Dadd9 → Aadd9 → Em9 → G6/9) — relaxing modal progression
const PAD_CHORDS: number[][] = [
  [146.83, 220.00, 277.18, 329.63, 493.88],   // Dadd9
  [110.00, 220.00, 277.18, 329.63, 415.30],   // A  (with E, F# implied)
  [82.41,  246.94, 329.63, 415.30, 587.33],   // Em9
  [98.00,  293.66, 369.99, 440.00, 587.33],   // G6/9
];

const CHORD_DURATION = 8; // seconds per chord
const ARP_INTERVAL = 0.45; // seconds between arpeggio notes

export default function AmbientMusic() {
  // فرض پیش‌فرض: روشن (تا روی load سعی می‌کنیم پخش کنیم).
  // فقط اگه کاربر صراحتاً mute کرده باشه، غیرفعال می‌مونه.
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showSlider, setShowSlider] = useState(false);
  const [needsClick, setNeedsClick] = useState(false); // وقتی autoplay بلاک شد

  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const stopFnRef = useRef<(() => void) | null>(null);
  const isPlayingRef = useRef(false);
  const initializedRef = useRef(false);

  // Read persisted prefs
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const m = localStorage.getItem('music-muted');
    const v = localStorage.getItem('music-volume');
    if (m !== null) setMuted(m === '1');
    if (v !== null) {
      const n = parseFloat(v);
      if (!isNaN(n)) setVolume(Math.min(1, Math.max(0, n)));
    }
  }, []);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  ساخت Audio Context و chain اولیه
  //  اگه context قبلی close شده (مثل بعد از Hot Reload)، یه context جدید می‌سازه
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const ensureCtx = (): AudioContext | null => {
    if (typeof window === 'undefined') return null;

    // Reuse if existing and not closed
    if (ctxRef.current && ctxRef.current.state !== 'closed') {
      return ctxRef.current;
    }

    // Create new context
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return null;

    let ctx: AudioContext;
    try {
      ctx = new Ctx();
    } catch {
      return null;
    }
    ctxRef.current = ctx;

    // Master gain — fresh chain
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    masterGainRef.current = master;

    return ctx;
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  pad note — lush sine + slight detune
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const playPadNote = (
    ctx: AudioContext,
    target: AudioNode,
    freq: number,
    when: number,
    duration: number,
    vel = 0.15,
  ) => {
    // 3 detuned oscillators for richness
    const detunes = [-7, 0, 8];
    detunes.forEach((cents) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.detune.value = cents;

      g.gain.setValueAtTime(0, when);
      g.gain.linearRampToValueAtTime(vel / detunes.length, when + 1.5);
      g.gain.linearRampToValueAtTime(vel / detunes.length, when + duration - 1.5);
      g.gain.linearRampToValueAtTime(0, when + duration);

      osc.connect(g);
      g.connect(target);
      osc.start(when);
      osc.stop(when + duration + 0.1);
    });
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  bell-like arpeggio note
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const playArpNote = (
    ctx: AudioContext,
    target: AudioNode,
    freq: number,
    when: number,
    vel = 0.07,
  ) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;

    // Bell envelope: fast attack, slow decay
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(vel, when + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, when + 2.5);

    osc.connect(g);
    g.connect(target);
    osc.start(when);
    osc.stop(when + 2.6);
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  start playing the music
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const startMusic = () => {
    const ctx = ensureCtx();
    if (!ctx || !masterGainRef.current) return;
    if (ctx.state === 'closed') return; // safety guard
    if (isPlayingRef.current) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});

    isPlayingRef.current = true;

    // Reverb-like feedback delay
    const delay = ctx.createDelay(2);
    delay.delayTime.value = 0.6;
    const fb = ctx.createGain();
    fb.gain.value = 0.45;
    delay.connect(fb);
    fb.connect(delay);

    // Low-pass filter for warmth
    const lpf = ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.value = 2500;
    lpf.Q.value = 0.5;

    // Routing: source → lpf → master
    //                       ↘ delay → master
    const wet = ctx.createGain();
    wet.gain.value = 0.7;
    lpf.connect(masterGainRef.current);
    lpf.connect(delay);
    delay.connect(wet);
    wet.connect(masterGainRef.current);

    // Master fade in
    const now = ctx.currentTime;
    masterGainRef.current.gain.cancelScheduledValues(now);
    masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, now);
    masterGainRef.current.gain.linearRampToValueAtTime(volume, now + 2.5);

    // ─── Schedule chord progression (loop) ───
    let chordIdx = 0;
    const playChord = () => {
      if (!isPlayingRef.current || !ctx) return;
      const at = ctx.currentTime;
      const chord = PAD_CHORDS[chordIdx % PAD_CHORDS.length];

      chord.forEach((freq) => {
        playPadNote(ctx, lpf, freq, at, CHORD_DURATION + 0.5, 0.08);
      });

      // Sometimes trigger arpeggios
      if (Math.random() < 0.7) {
        const baseChord = chord;
        const numNotes = 4 + Math.floor(Math.random() * 5);
        for (let i = 0; i < numNotes; i++) {
          const t = at + Math.random() * (CHORD_DURATION - 0.5);
          let freq: number;
          if (Math.random() < 0.5) {
            // From chord
            freq = baseChord[Math.floor(Math.random() * baseChord.length)];
          } else {
            // From scale (high register)
            freq = SCALE_HZ[8 + Math.floor(Math.random() * 6)];
          }
          // Sometimes octave up
          if (Math.random() < 0.4) freq *= 2;
          playArpNote(ctx, lpf, freq, t, 0.06 + Math.random() * 0.04);
        }
      }

      chordIdx++;
    };

    playChord();
    const interval = setInterval(playChord, CHORD_DURATION * 1000);

    stopFnRef.current = () => {
      isPlayingRef.current = false;
      clearInterval(interval);
      const t = ctx.currentTime;
      if (masterGainRef.current) {
        masterGainRef.current.gain.cancelScheduledValues(t);
        masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, t);
        masterGainRef.current.gain.linearRampToValueAtTime(0, t + 1.0);
      }
    };
  };

  const stopMusic = () => {
    if (stopFnRef.current) {
      stopFnRef.current();
      stopFnRef.current = null;
    }
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  Sync volume → master gain
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  useEffect(() => {
    if (!masterGainRef.current || !ctxRef.current || muted) return;
    if (!isPlayingRef.current) return;
    const t = ctxRef.current.currentTime;
    masterGainRef.current.gain.cancelScheduledValues(t);
    masterGainRef.current.gain.linearRampToValueAtTime(volume, t + 0.3);
  }, [volume, muted]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  Auto-start on page load (با fallback به first-interaction)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    if (muted) return;

    // 1. تلاش فوری برای پخش (اگه browser اجازه بده)
    const tryAutoplay = async () => {
      const ctx = ensureCtx();
      if (!ctx) return false;
      try {
        await ctx.resume();
        if (ctx.state === 'running') {
          startMusic();
          return true;
        }
      } catch (err) {
        // suspended state — autoplay blocked
      }
      return false;
    };

    tryAutoplay().then((started) => {
      if (started) return;

      // 2. اگه autoplay بلاک شد، منتظر اولین تعامل کاربر بمون
      setNeedsClick(true);

      const onInteract = async () => {
        const ctx = ensureCtx();
        if (ctx) {
          try { await ctx.resume(); } catch {}
        }
        if (!muted) startMusic();
        setNeedsClick(false);
        remove();
      };
      const remove = () => {
        window.removeEventListener('click', onInteract);
        window.removeEventListener('keydown', onInteract);
        window.removeEventListener('scroll', onInteract);
        window.removeEventListener('touchstart', onInteract);
      };

      window.addEventListener('click', onInteract);
      window.addEventListener('keydown', onInteract);
      window.addEventListener('scroll', onInteract, { passive: true });
      window.addEventListener('touchstart', onInteract);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  Toggle mute
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    if (typeof window !== 'undefined') localStorage.setItem('music-muted', next ? '1' : '0');
    if (next) {
      stopMusic();
    } else {
      startMusic();
    }
  };

  const onVolumeChange = (v: number) => {
    setVolume(v);
    if (typeof window !== 'undefined') localStorage.setItem('music-volume', String(v));
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMusic();
      // فقط در صورت بسته‌شدن واقعی صفحه context رو close می‌کنیم
      // (در Hot Reload فقط متوقف می‌کنیم تا context قابل استفاده مجدد بمونه)
      if (ctxRef.current && ctxRef.current.state !== 'closed') {
        try {
          ctxRef.current.close();
        } catch {}
        ctxRef.current = null;
        masterGainRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
    >
      <button
        onClick={toggleMute}
        className={`p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative ${
          needsClick ? 'ring-2 ring-brand-500 ring-offset-2 ring-offset-transparent animate-pulse' : ''
        }`}
        aria-label={muted ? 'پخش موزیک' : 'بی‌صدا کردن'}
        title={
          needsClick
            ? '🎵 برای پخش موزیک کلیک کن'
            : muted
              ? 'پخش موزیک متن'
              : `موزیک متن (${Math.round(volume * 100)}%)`
        }
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        {!muted && !needsClick && (
          <span className="absolute top-1 end-1 w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
        )}
      </button>

      {/* Volume slider — appears on hover */}
      {showSlider && !muted && (
        <div className="absolute top-full mt-2 end-0 left-auto z-50 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] rounded-xl shadow-xl p-3 min-w-[180px]">
          <div className="flex items-center gap-2 mb-2 text-xs font-mono text-slate-600 dark:text-slate-400">
            <Music size={12} className="text-brand-500" />
            <span>{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-full accent-brand-500"
            aria-label="Volume"
          />
        </div>
      )}
    </div>
  );
}
