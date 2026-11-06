/* A small SoundFont (.sf2 and .sf3) reader and sampler for Web Audio. No dependencies.
 * Reads the preset, instrument and sample tables, then plays notes by pitching the
 * right sample, with volume envelope, loop, filter and pan. It does not do modulators,
 * chorus or reverb sends. */
(function (root) {
  'use strict';

  var D = null;              // the loaded file
  var cache = new Map();     // sample id -> {buf, h}
  var pend = new Map();      // sample id -> Promise
  var SF = { ready: false, name: '', count: 0, presets: [], sel: { piano: null, bass: null, drums: null } };

  // Generator defaults (SoundFont 2 spec, section 8.1.2). Everything else defaults to 0.
  var DEF = { 8: 13500, 17: 0, 33: -12000, 34: -12000, 35: -12000, 36: -12000, 38: -12000, 56: 100, 58: -1 };
  var SINGLE = { 54: 1, 57: 1, 58: 1 };   // instrument-level only, never added from the preset

  function tc(x) { return Math.pow(2, x / 1200); }   // timecents to seconds

  /* ---------- reading the file ---------- */

  SF.load = function (buf, name) {
    var dv = new DataView(buf), u8 = new Uint8Array(buf);
    function tag(o) { return String.fromCharCode(u8[o], u8[o + 1], u8[o + 2], u8[o + 3]); }
    function str(o, n) { var s = ''; for (var i = 0; i < n && u8[o + i]; i++) s += String.fromCharCode(u8[o + i]); return s; }
    if (buf.byteLength < 12 || tag(0) !== 'RIFF' || tag(8) !== 'sfbk') {
      throw new Error('That file is not a SoundFont (.sf2 or .sf3).');
    }

    var ch = {}, smpl = null, o = 12, end = Math.min(buf.byteLength, 8 + dv.getUint32(4, true));
    while (o + 8 <= end) {
      var id = tag(o), size = dv.getUint32(o + 4, true), body = o + 8;
      if (id === 'LIST') {
        var type = tag(body), p = body + 4, pe = Math.min(body + size, buf.byteLength);
        while (p + 8 <= pe) {
          var cid = tag(p), cs = dv.getUint32(p + 4, true);
          if (type === 'pdta') ch[cid] = { o: p + 8, n: cs };
          else if (type === 'sdta' && cid === 'smpl') smpl = { o: p + 8, n: cs };
          p += 8 + cs + (cs & 1);
        }
      }
      o = body + size + (size & 1);
    }
    var need = ['phdr', 'pbag', 'pgen', 'inst', 'ibag', 'igen', 'shdr'];
    for (var k = 0; k < need.length; k++) {
      if (!ch[need[k]]) throw new Error('This SoundFont file is damaged or incomplete.');
    }
    if (!smpl) throw new Error('This SoundFont has no sample data.');

    var i, n, q;
    var ph = [];
    n = Math.floor(ch.phdr.n / 38);
    for (i = 0; i < n; i++) {
      q = ch.phdr.o + i * 38;
      ph.push({ name: str(q, 20), prog: dv.getUint16(q + 20, true), bank: dv.getUint16(q + 22, true), bag: dv.getUint16(q + 24, true) });
    }
    var ins = [];
    n = Math.floor(ch.inst.n / 22);
    for (i = 0; i < n; i++) {
      q = ch.inst.o + i * 22;
      ins.push({ name: str(q, 20), bag: dv.getUint16(q + 20, true) });
    }
    function bags(c) { var a = [], m = Math.floor(c.n / 4); for (var j = 0; j < m; j++) a.push(dv.getUint16(c.o + j * 4, true)); return a; }
    function gens(c) {
      var a = [], m = Math.floor(c.n / 4);
      for (var j = 0; j < m; j++) {
        var x = c.o + j * 4;
        a.push({ op: dv.getUint16(x, true), lo: u8[x + 2], hi: u8[x + 3], s: dv.getInt16(x + 2, true), u: dv.getUint16(x + 2, true) });
      }
      return a;
    }
    var sh = [];
    n = Math.floor(ch.shdr.n / 46);
    for (i = 0; i < n; i++) {
      q = ch.shdr.o + i * 46;
      sh.push({
        start: dv.getUint32(q + 20, true), end: dv.getUint32(q + 24, true),
        sl: dv.getUint32(q + 28, true), el: dv.getUint32(q + 32, true),
        rate: dv.getUint32(q + 36, true), pitch: u8[q + 40], corr: dv.getInt8(q + 41), type: dv.getUint16(q + 44, true)
      });
    }

    cache.clear(); pend.clear();
    D = { u8: u8, dv: dv, smplO: smpl.o, smplN: smpl.n, ph: ph, ins: ins, pbg: bags(ch.pbag), ibg: bags(ch.ibag),
          pgen: gens(ch.pgen), igen: gens(ch.igen), sh: sh, pmap: {}, icache: [] };
    SF.presets = [];
    for (i = 0; i < ph.length - 1; i++) {      // the last entry is the end marker
      ph[i].next = ph[i + 1].bag;
      D.pmap[ph[i].bank + ':' + ph[i].prog] = ph[i];
      SF.presets.push({ name: ph[i].name, bank: ph[i].bank, prog: ph[i].prog });
    }
    SF.count = SF.presets.length;
    SF.name = name || 'SoundFont';
    SF.ready = SF.count > 0;
    if (!SF.ready) throw new Error('This SoundFont has no instruments.');
    return SF;
  };

  SF.unload = function () {
    D = null; cache.clear(); pend.clear();
    SF.ready = false; SF.count = 0; SF.presets = []; SF.name = '';
    SF.sel = { piano: null, bass: null, drums: null };
  };

  SF.presetName = function (bank, prog) {
    var p = D && D.pmap[bank + ':' + prog];
    return p ? p.name : null;
  };

  SF.select = function (role, bank, prog) {
    SF.sel[role] = (prog === null || prog === undefined) ? null : { bank: bank, prog: prog };
  };

  /* ---------- finding the samples for a note ---------- */

  function buildZones(bg, gn, from, to, isInst) {
    var out = [], glob = null;
    for (var b = from; b < to && b + 1 < bg.length; b++) {
      var z = { g: {}, kl: 0, kh: 127, vl: 0, vh: 127, ref: -1 };
      for (var i = bg[b]; i < bg[b + 1] && i < gn.length; i++) {
        var e = gn[i];
        if (e.op === 43) { z.kl = e.lo; z.kh = e.hi; }
        else if (e.op === 44) { z.vl = e.lo; z.vh = e.hi; }
        else if (e.op === (isInst ? 53 : 41)) { z.ref = e.u; }
        else z.g[e.op] = e.s;
      }
      if (z.ref >= 0) out.push(z); else if (b === from) glob = z;
    }
    return { zones: out, glob: glob };
  }

  function instOf(i) {
    if (!D.ins[i + 1]) return null;      // the last entry is the end marker
    if (!D.icache[i]) D.icache[i] = buildZones(D.ibg, D.igen, D.ins[i].bag, D.ins[i + 1].bag, true);
    return D.icache[i];
  }

  function makeVoice(sid, ig, pg) {
    function G(k) {
      var v = DEF[k] === undefined ? 0 : DEF[k], a, pv;
      for (a = 0; a < ig.length; a++) if (ig[a] && ig[a][k] !== undefined) v = ig[a][k];
      if (!SINGLE[k]) {
        for (a = 0; a < pg.length; a++) if (pg[a] && pg[a][k] !== undefined) pv = pg[a][k];
        if (pv !== undefined) v += pv;
      }
      return v;
    }
    return {
      sid: sid, delay: G(33), atk: G(34), hold: G(35), dec: G(36), sus: Math.max(0, G(37)), rel: G(38),
      att: Math.max(0, G(48)), pan: G(17), fc: G(8), q: G(9), coarse: G(51), fine: G(52), scale: G(56),
      mode: G(54) & 3, root: G(58), ls: G(2) + G(45) * 32768, le: G(3) + G(50) * 32768
    };
  }

  SF.voices = function (bank, prog, key, vel) {
    var out = [];
    if (!D) return out;
    var p = D.pmap[bank + ':' + prog];
    if (!p) return out;
    if (!p.zd) p.zd = buildZones(D.pbg, D.pgen, p.bag, p.next, false);
    for (var i = 0; i < p.zd.zones.length; i++) {
      var pz = p.zd.zones[i];
      if (key < pz.kl || key > pz.kh || vel < pz.vl || vel > pz.vh) continue;
      var I = instOf(pz.ref);
      if (!I) continue;
      for (var j = 0; j < I.zones.length; j++) {
        var iz = I.zones[j];
        if (key < iz.kl || key > iz.kh || vel < iz.vl || vel > iz.vh) continue;
        if (iz.ref >= D.sh.length - 1) continue;
        out.push(makeVoice(iz.ref, [I.glob && I.glob.g, iz.g], [p.zd.glob && p.zd.glob.g, pz.g]));
      }
    }
    return out;
  };

  /* ---------- samples ---------- */

  SF.decode = function (ctx, sid) {
    if (cache.has(sid)) return Promise.resolve(cache.get(sid));
    if (pend.has(sid)) return pend.get(sid);
    var h = D.sh[sid], p;
    if (h.type & 0x10) {
      // SF3: each sample is a small Ogg Vorbis file, and start/end are byte offsets
      var bytes = D.u8.slice(D.smplO + h.start, D.smplO + h.end);
      p = new Promise(function (res, rej) {
        var r = ctx.decodeAudioData(bytes.buffer, res, rej);
        if (r && r.then) r.then(res, rej);
      });
    } else {
      var n = Math.min(Math.max(1, h.end - h.start), Math.floor(D.smplN / 2) - h.start);
      if (n < 1) return Promise.reject(new Error('bad sample'));
      var rate = Math.min(96000, Math.max(8000, h.rate || 44100));
      var buf = ctx.createBuffer(1, n, rate), data = buf.getChannelData(0), o = D.smplO + h.start * 2;
      for (var i = 0; i < n; i++) data[i] = D.dv.getInt16(o + i * 2, true) / 32768;
      p = Promise.resolve(buf);
    }
    p = p.then(function (b) { var s = { buf: b, h: h }; cache.set(sid, s); pend.delete(sid); return s; },
               function (e) { pend.delete(sid); throw e; });
    pend.set(sid, p);
    return p;
  };

  // Decode every sample the band will need before playing: wants is [{role, keys:[...]}]
  SF.prepare = function (ctx, wants) {
    var jobs = [], seen = {};
    wants.forEach(function (w) {
      var sel = SF.sel[w.role];
      if (!sel) return;
      w.keys.forEach(function (k) {
        [1, 40, 70, 100, 127].forEach(function (v) {
          SF.voices(sel.bank, sel.prog, k, v).forEach(function (vc) {
            if (!cache.has(vc.sid) && !seen[vc.sid]) {
              seen[vc.sid] = 1;
              jobs.push(SF.decode(ctx, vc.sid).catch(function () {}));
            }
          });
        });
      });
    });
    return Promise.all(jobs);
  };

  /* ---------- playing ---------- */

  function play(ctx, v, s, dest, key, vel, t, dur, gain) {
    var h = s.h, rate = h.rate || 44100;
    var root = (v.root >= 0 && v.root <= 127) ? v.root : (h.pitch <= 127 ? h.pitch : 60);
    var cents = (key - root) * v.scale + v.coarse * 100 + v.fine + h.corr;
    var src = ctx.createBufferSource();
    src.buffer = s.buf;
    var pr = Math.pow(2, cents / 1200);
    src.playbackRate.value = pr;

    var loops = (v.mode === 1 || v.mode === 3);
    if (loops) {
      var rel = (h.type & 0x10) ? 0 : h.start;       // SF2 loop points are absolute, SF3 are relative
      var a = (h.sl - rel + v.ls) / rate, b = (h.el - rel + v.le) / rate;
      if (b > a + 0.001 && b <= s.buf.duration + 0.001) { src.loop = true; src.loopStart = Math.max(0, a); src.loopEnd = b; }
      else loops = false;
    }

    var amp = gain * Math.pow(10, -v.att / 200) * Math.pow(vel / 127, 1.2);
    var t0 = t + Math.min(tc(v.delay), 2);
    var atk = Math.max(tc(v.atk), 0.003), hold = Math.min(tc(v.hold), 5), dec = Math.min(tc(v.dec), 60);
    var sus = Math.pow(10, -v.sus / 200);
    var env = ctx.createGain(), g = env.gain;
    g.setValueAtTime(0.0001, t0);
    g.linearRampToValueAtTime(amp, t0 + atk);
    g.setValueAtTime(amp, t0 + atk + hold);
    g.setTargetAtTime(amp * sus, t0 + atk + hold, Math.max(dec / 11.5, 0.005));

    var rg = ctx.createGain(), stopT;
    if (dur !== null && dur !== undefined) {
      var relT = Math.min(Math.max(tc(v.rel), 0.06), 1.2), endT = t + dur;
      rg.gain.setValueAtTime(1, endT);
      rg.gain.setTargetAtTime(0, endT, relT / 6);
      stopT = endT + relT + 0.05;
    } else {
      stopT = loops ? t0 + 2 : t0 + s.buf.duration / Math.max(pr, 0.01) + 0.1;
    }

    var node = src;
    if (v.fc < 13300) {
      var f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = Math.min(20000, 8.176 * Math.pow(2, v.fc / 1200));
      f.Q.value = Math.max(0, v.q / 10);
      node.connect(f); node = f;
    }
    node.connect(env); env.connect(rg); node = rg;
    if (ctx.createStereoPanner) {
      var pn = ctx.createStereoPanner();
      pn.pan.value = Math.max(-1, Math.min(1, v.pan / 500));
      node.connect(pn); node = pn;
    }
    node.connect(dest);
    src.onended = function () { try { node.disconnect(); } catch (e) {} };
    src.start(t0);
    src.stop(stopT);
  }

  // Play one note. dur is in seconds, or null for a one-shot such as a drum hit.
  // Returns false when nothing could play (no preset chosen, or samples not decoded yet).
  SF.note = function (ctx, role, dest, key, vel, t, dur, gain) {
    var sel = SF.sel[role];
    if (!D || !sel) return false;
    var vs = SF.voices(sel.bank, sel.prog, key, vel), any = false;
    for (var i = 0; i < vs.length; i++) {
      var s = cache.get(vs[i].sid);
      if (!s) { SF.decode(ctx, vs[i].sid).catch(function () {}); continue; }
      any = true;
      play(ctx, vs[i], s, dest, key, vel, t, dur, gain);
    }
    return any;
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = SF;
  root.SF = SF;
})(typeof window !== 'undefined' ? window : globalThis);
