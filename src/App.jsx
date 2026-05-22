import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────
//  CHANGE YOUR ACCESS CODE HERE ↓
const ACCESS_CODE = "WAHEGURU2025";
// ─────────────────────────────────────────────────────────────

// ── LocalStorage helpers ─────────────────────────────────────
const LS = {
  get: (k, fb = null) => { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : fb; } catch { return fb; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

const todayKey = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD local

// ── Shabad data ───────────────────────────────────────────────
const SHABAD = [
  { gurmukhi: "ਸਭੁ ਕੋ ਭੁਲਾ ਵਿਸਾਰਿਆ ਗੁਰਿ ਰਾਖੇ ਸੇਈ ॥", transliteration: "Sabh ko bhulaa visaariaa, gur raakhe se-ee.", translation: "Everyone who was forgotten and neglected — the Guru has saved them.", theme: "Forgiveness", prompt: "Who or what have you been carrying that needs to be released today?", source: "Guru Granth Sahib · Ang 544" },
  { gurmukhi: "ਜਿਨਿ ਕੀਤਾ ਤਿਨਿ ਦੇਖਿਆ ਸਭੁ ਕਿਛੁ ਤਿਸ ਹੀ ਪਾਸਿ ॥", transliteration: "Jin keetaa tin dekhiaa, sabh kichh tis hee paas.", translation: "The One who created all also watches over all — everything rests with the Creator alone.", theme: "Forgiveness", prompt: "Can you place one hurt or grievance into the Creator's hands today and let it rest there?", source: "Guru Granth Sahib · Ang 133" },
  { gurmukhi: "ਮਾਫ ਕਰੋ ਭੂਲ ਚੂਕ ਮੇਰੀ ਦਾਤਾ ॥", transliteration: "Maaf karo bhool chook meri daataa.", translation: "Forgive my errors and omissions, O Giver of all gifts.", theme: "Forgiveness", prompt: "Write a letter of forgiveness — to someone else, or to yourself.", source: "Guru Granth Sahib · Ang 612" },
  { gurmukhi: "ਮਨ ਤੂੰ ਜੋਤਿ ਸਰੂਪੁ ਹੈ ਆਪਣਾ ਮੂਲੁ ਪਛਾਣੁ ॥", transliteration: "Man toon jot saroop hai, aapnaa mool pachhaan.", translation: "O my mind, you are the embodiment of Divine Light — recognize your own origin.", theme: "Self-Worth", prompt: "Describe a moment today when you felt the light within you, however small.", source: "Guru Granth Sahib · Ang 441" },
  { gurmukhi: "ਆਪੇ ਜਾਣੈ ਆਪੇ ਦੇਇ ॥ ਆਖਹਿ ਸਿ ਭਿ ਕੇਈ ਕੇਇ ॥", transliteration: "Aape jaanai aape dei, aakhahi si bhi ke-ee ke-i.", translation: "The Creator knows and provides for all — only a rare few truly understand this.", theme: "Self-Worth", prompt: "What is one thing about yourself that Waheguru placed there with intention?", source: "Guru Granth Sahib · Ang 2" },
  { gurmukhi: "ਸੁਖੁ ਦੁਖੁ ਦੋਨੋ ਸਮ ਕਰਿ ਜਾਣੈ ॥", transliteration: "Sukh dukh dono sam kar jaanai.", translation: "One who treats pleasure and pain as equal — that one truly knows the path.", theme: "Equanimity", prompt: "What is a current pain you can begin to hold with more gentleness today?", source: "Guru Granth Sahib · Ang 275" },
  { gurmukhi: "ਜੋ ਤਿਸੁ ਭਾਵੈ ਸੋਈ ਕਾਰ ॥", transliteration: "Jo tis bhaavai so-ee kaar.", translation: "Whatever pleases the Divine — that is the right course of action.", theme: "Equanimity", prompt: "Where are you resisting what is? What would it feel like to soften that resistance by just 10%?", source: "Guru Granth Sahib · Ang 1" },
  { gurmukhi: "ਨਾਨਕ ਨਾਮੁ ਮਿਲੈ ਤਾਂ ਜੀਵਾਂ ਤਨੁ ਮਨੁ ਥੀਵੈ ਹਰਿਆ ॥", transliteration: "Nanak naam milai taan jeevaan, tan man theevai hariaa.", translation: "Nanak: when the Name is received, I truly live — body and mind bloom like spring.", theme: "Gratitude", prompt: "List three small things that made your body or mind feel alive today.", source: "Guru Granth Sahib · Ang 97" },
  { gurmukhi: "ਤੇਰਾ ਕੀਤਾ ਜਾਤੋ ਨਾਹੀ ਮੈਨੋ ਜੋਗੁ ਕੀਤੋਈ ॥", transliteration: "Teraa keetaa jaato naahee maino jog keeto-ee.", translation: "I cannot fully know what You have done for me — You made me worthy when I was not.", theme: "Gratitude", prompt: "Name one way Waheguru has quietly provided for you that you almost missed.", source: "Guru Granth Sahib · Ang 1102" },
  { gurmukhi: "ਸਾਚਾ ਸਾਹਿਬੁ ਸਾਚੁ ਨਾਇ ਭਾਖਿਆ ਭਾਉ ਅਪਾਰੁ ॥", transliteration: "Saachaa saahib saach naai, bhaakhiaa bhaa-o apaar.", translation: "The True Lord, Truth is His Name — spoken with infinite love.", theme: "Truth & Authenticity", prompt: "Where in your life are you not speaking your full truth? What would one small step toward honesty look like?", source: "Guru Granth Sahib · Ang 2" },
  { gurmukhi: "ਸਚਹੁ ਓਰੈ ਸਭੁ ਕੋ ਉਪਰਿ ਸਚੁ ਆਚਾਰੁ ॥", transliteration: "Sachahu orai sabh ko, upar sach aachaar.", translation: "Truth is higher than everything — but higher still is truthful living.", theme: "Truth & Authenticity", prompt: "In what one area of your life can you bring your actions into closer alignment with your values?", source: "Guru Granth Sahib · Ang 62" },
  { gurmukhi: "ਭੈ ਵਿਚਿ ਸੂਰਜੁ ਭੈ ਵਿਚਿ ਚੰਦੁ ॥", transliteration: "Bhai vich sooraj, bhai vich chand.", translation: "In awe, the sun rises. In awe, the moon glows.", theme: "Wonder & Presence", prompt: "What moment of beauty did you witness today, even a tiny one?", source: "Guru Granth Sahib · Ang 464" },
  { gurmukhi: "ਕੀਤਾ ਪਸਾਉ ਏਕੋ ਕਵਾਉ ॥", transliteration: "Keetaa pasaa-o eko kavaa-o.", translation: "With one word, the entire creation was set into motion.", theme: "Wonder & Presence", prompt: "Sit outside or by a window for two minutes. What do you notice that you usually walk past?", source: "Guru Granth Sahib · Ang 3" },
  { gurmukhi: "ਜਿਉ ਜਲ ਮਹਿ ਕਮਲੁ ਨਿਰਾਲਮੁ ਮੁਰਗਾਈ ਨੈ ਸਾਣੇ ॥", transliteration: "Ji-o jal meh kamal niraalam, murgaa-ee nai saane.", translation: "Like the lotus in water — untouched. Like the duck — gliding undisturbed.", theme: "Non-Attachment", prompt: "What are you holding too tightly right now? How might you hold it more lightly?", source: "Guru Granth Sahib · Ang 938" },
  { gurmukhi: "ਮਨੁ ਨਿਰਮਲੁ ਹਰਿ ਰੰਗਿ ਰਾਤਾ ॥", transliteration: "Man nirmal har rang raataa.", translation: "The mind becomes pure when it is dyed in the colour of the Divine alone.", theme: "Non-Attachment", prompt: "What attachment or outcome can you offer up to Waheguru today without clinging to the result?", source: "Guru Granth Sahib · Ang 226" },
  { gurmukhi: "ਰੋਗ ਸੋਕ ਦੁਖ ਹਰਤਾ ਠਾਕੁਰੁ", transliteration: "Rog Sok Dukh Hartaa Thaakur", translation: "The Divine removes disease, grief, and sorrow — the Lord of the universe is the healer.", theme: "Healing", prompt: "What part of you is asking to be healed today? Speak to it gently.", source: "Guru Granth Sahib · Ang 1302" },
  { gurmukhi: "ਨਾਮੁ ਔਖਧੁ ਮਨਿ ਵਸੈ ਸਭਿ ਰੋਗ ਗਵਾਇ ॥", transliteration: "Naam aukhadh man vasai, sabh rog gavaa-ay.", translation: "When the Name of the Divine dwells in the mind, all diseases are driven away.", theme: "Healing", prompt: "How has connecting to something larger than yourself — Naam, prayer, community — helped you feel better?", source: "Guru Granth Sahib · Ang 274" },
  { gurmukhi: "ਨਿਰਭਉ ਨਿਰਵੈਰੁ ਅਕਾਲ ਮੂਰਤਿ ॥", transliteration: "Nirbhau nirvair akaal moorat.", translation: "Without fear. Without enmity. The timeless embodiment of Being.", theme: "Courage", prompt: "What fear has been quietly shrinking your world? What would one courageous step look like today?", source: "Guru Granth Sahib · Ang 1 (Mool Mantar)" },
  { gurmukhi: "ਸੂਰਾ ਸੋ ਪਹਿਚਾਨੀਐ ਜੁ ਲਰੈ ਦੀਨ ਕੇ ਹੇਤ ॥", transliteration: "Sooraa so pahichaanee-ai ju larai deen ke het.", translation: "Know the true warrior as one who fights for the cause of the humble and the broken.", theme: "Courage", prompt: "Where in your life are you being called to stand up — for yourself, or for someone else?", source: "Guru Granth Sahib · Ang 1105" },
  { gurmukhi: "ਜੋ ਆਇਆ ਸੋ ਚਲਸੀ ਸਭੁ ਕੋਈ ਆਈ ਵਾਰੀ ॥", transliteration: "Jo aa-i-aa so chalsee, sabh ko-ee aa-ee vaaree.", translation: "All who come must also go — everyone's turn comes in time.", theme: "Grief & Loss", prompt: "What or who are you grieving right now? Write to them — freely, without needing to make sense of it.", source: "Guru Granth Sahib · Ang 474" },
  { gurmukhi: "ਦੁਖੁ ਦਾਰੂ ਸੁਖੁ ਰੋਗੁ ਭਇਆ ਜਾ ਸੁਖੁ ਤਾਮਿ ਨ ਹੋਈ ॥", transliteration: "Dukh daaroo sukh rog bha-i-aa, jaa sukh taam na ho-ee.", translation: "Pain is the medicine; comfort can become the disease — for ease makes us forget the Divine.", theme: "Grief & Loss", prompt: "What has a painful season taught you that you could not have learned any other way?", source: "Guru Granth Sahib · Ang 469" },
  { gurmukhi: "ਸਾਂਤਿ ਪਾਈ ਗੁਰਿ ਸਾਂਤਿ ਦਿੜਾਈ ਮਨਿ ਤਨਿ ਸੀਤਲੁ ਹੋਇ ॥", transliteration: "Saant paa-ee gur saant diraree, man tan seetal ho-i.", translation: "The Guru instilled peace within me — my mind and body became cool and still.", theme: "Peace", prompt: "Describe the feeling of peace — even a memory of it. What does it feel like in your body?", source: "Guru Granth Sahib · Ang 612" },
  { gurmukhi: "ਮਨੁ ਮਾਰਿਆ ਸਬਦਿ ਕਸਵਟੀ ਲਾਈ ॥ ਅੰਤਰਿ ਸਾਂਤਿ ਸਹਜਿ ਲਿਵ ਲਾਈ ॥", transliteration: "Man maariaa sabad kasvatee laa-ee, antar saant sahaj liv laa-ee.", translation: "The mind was stilled by the touchstone of the Shabad — inner peace arose, and the soul rested in ease.", theme: "Peace", prompt: "What practice, word, or moment of stillness brings your mind home to quiet? Can you give it 5 minutes today?", source: "Guru Granth Sahib · Ang 230" },
  { gurmukhi: "ਨਵਾ ਸਵੇਰਾ ਨਵੀ ਬਹਾਰ ਲੈ ਆਵੇ ॥", transliteration: "Navaa saveraa navee bahaar lai aave.", translation: "Each new dawn carries with it a new spring — fresh life, fresh possibility.", theme: "Hope & Renewal", prompt: "What are you hoping for right now — even something small? Write it without qualification.", source: "Sikh tradition" },
  { gurmukhi: "ਜਬ ਲਗੁ ਜੀਵਹਿ ਕਰਤ ਅਕਾਜੁ ॥ ਤਬ ਗੁਰੁ ਭੇਟਿਐ ਹੋਇ ਸੁਕਾਜੁ ॥", transliteration: "Jab lag jeevahi karat akaaj, tab gur bhetai ho-i sukaaj.", translation: "As long as one lives in error, all efforts go awry — but when the Guru is met, all becomes auspicious.", theme: "Hope & Renewal", prompt: "In what area of life do you feel a turning point coming? What would beginning again look like?", source: "Guru Granth Sahib · Ang 1201" },
];

const HEALING_THEMES = ["Forgiveness","Self-Worth","Equanimity","Gratitude","Truth & Authenticity","Wonder & Presence","Non-Attachment","Healing","Courage","Grief & Loss","Peace","Hope & Renewal"];

const NAAM_OPTIONS = {
  waheguru: { label: "Waheguru Waheguru", gurmukhi: "ਵਾਹਿਗੁਰੂ ਵਾਹਿਗੁਰੂ", words: ["ਵਾਹਿ","ਗੁਰੂ","ਵਾਹਿ","ਗੁਰੂ"], romanWords: ["Waahi","Guru","Waahi","Guru"] },
  satnam: { label: "Satnam Waheguru", gurmukhi: "ਸਤਿਨਾਮੁ ਵਾਹਿਗੁਰੂ", words: ["ਸਤਿ","ਨਾਮੁ","ਵਾਹਿ","ਗੁਰੂ"], romanWords: ["Sat","Naam","Waahi","Guru"] },
};

const MOOL_MANTAR = {
  gurmukhi: "ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ ਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰ ਪ੍ਰਸਾਦਿ ॥",
  transliteration: "Ik Onkar, Sat Naam, Kartaa Purakh, Nirbhau, Nirvair, Akaal Moorat, Ajooni, Saibhang, Gur Prasaad.",
  translation: "One Creator. True Name. Doer of Everything. Without Fear. Without Hatred. Undying Form. Unborn. Self-Illumined. By Guru's Grace.",
};

const DAILY_PRACTICES = [
  { icon: "🌅", title: "Amrit Vela — Sacred Dawn", desc: "Rise before sunrise. Sit in stillness, recite Japji Sahib, and allow Waheguru's name to settle the mind before the world awakens." },
  { icon: "🔮", title: "Simran — Naam Meditation", desc: "Repeat 'Waheguru' or 'Sat Nam' with each breath for 10–20 minutes. The vibration of the Name is itself medicine for the nervous system." },
  { icon: "🤲", title: "Ardas — Intentional Prayer", desc: "Speak your heart honestly to Waheguru. Gurbani teaches that the Creator hears even unspoken pain. Name what hurts, then offer it." },
  { icon: "📖", title: "Hukamnama — Daily Guidance", desc: "Receive the day's Hukamnama. Sit with one line and let it be your compass through the day's challenges." },
  { icon: "🕊️", title: "Seva — Act of Service", desc: "The Gurus taught that in serving others we dissolve the ego that traps us in suffering. Offer one small, anonymous act of kindness today." },
  { icon: "🌙", title: "Sohila — Night Prayer", desc: "Before sleep, recite Kirtan Sohila to cleanse the day's thoughts. The day is complete. You are safe. The Divine watches over you." },
];

const NITNEM_BANIS = [
  { id: "japji", title: "Japji Sahib", gurmukhi: "ਜਪੁ ਜੀ ਸਾਹਿਬ", time: "Amrit Vela — before sunrise", timeIcon: "🌄", duration: 20, meaning: "The foundational prayer of the Sikh faith, composed by Guru Nanak Dev Ji. Recited at the ambrosial hour to cleanse the mind and merge with the Divine.", pauris: 38 },
  { id: "jaap", title: "Jaap Sahib", gurmukhi: "ਜਾਪੁ ਸਾਹਿਬ", time: "Amrit Vela — after Japji", timeIcon: "🌄", duration: 10, meaning: "Composed by Guru Gobind Singh Ji. A meditation on the many names of the Divine — each name dissolving a layer of ego and filling the heart with awe.", pauris: 199 },
  { id: "tvas", title: "Tav Prasad Savaiye", gurmukhi: "ਤ੍ਵ ਪ੍ਰਸਾਦਿ ਸਵੱਯੇ", time: "Amrit Vela — morning nitnem", timeIcon: "🌄", duration: 5, meaning: "Composed by Guru Gobind Singh Ji. A powerful declaration that true worship is found not in empty ritual but in love, truth, and complete surrender to the One.", pauris: 10 },
  { id: "chaupai", title: "Chaupai Sahib", gurmukhi: "ਬੇਨਤੀ ਚੌਪਈ", time: "Amrit Vela — morning nitnem", timeIcon: "🌄", duration: 7, meaning: "A prayer of protection by Guru Gobind Singh Ji. Recited to seek the Divine's shelter and to strengthen the soul against fear, difficulty, and inner darkness.", pauris: 25 },
  { id: "anand", title: "Anand Sahib", gurmukhi: "ਆਨੰਦੁ ਸਾਹਿਬ", time: "Amrit Vela — concluding morning", timeIcon: "🌄", duration: 15, meaning: "The Song of Bliss, composed by Guru Amar Das Ji. A joyful celebration of the soul's union with the Divine — the removal of sorrow through Naam.", pauris: 40 },
  { id: "rehras", title: "Rehras Sahib", gurmukhi: "ਰਹਿਰਾਸਿ ਸਾਹਿਬ", time: "Evening — at sunset", timeIcon: "🌆", duration: 20, meaning: "The evening prayer recited at dusk to close the day with gratitude, restore the soul's energy, and surrender the day's burdens to Waheguru." },
  { id: "sohila", title: "Kirtan Sohila", gurmukhi: "ਸੋਹਿਲਾ", time: "Night — before sleep", timeIcon: "🌙", duration: 5, meaning: "The bedtime prayer recited before sleep. It prepares the soul for rest as a rehearsal for the final journey, filling the heart with peace, love, and trust in the Divine.", pauris: 5 },
];

const MOODS = [
  { emoji: "🌑", label: "Heavy", value: 1 },
  { emoji: "🌒", label: "Low", value: 2 },
  { emoji: "🌓", label: "Neutral", value: 3 },
  { emoji: "🌔", label: "Rising", value: 4 },
  { emoji: "🌕", label: "Luminous", value: 5 },
];

const GREETINGS_MORNING = (name) => [`Waheguru's blessings on this new day, ${name}.`, `Good morning, ${name}. A fresh day, a fresh page.`, `Rise in Chardi Kala, ${name}. The Guru is with you.`];
const GREETINGS_AFTERNOON = (name) => [`How is your heart feeling today, ${name}?`, `Welcome back, ${name}. Take a breath.`, `This moment belongs to you, ${name}.`];
const GREETINGS_EVENING = (name) => [`The day is winding down, ${name}. How did it feel?`, `Evening blessings, ${name}. Reflect and release.`, `Rehras time, ${name}. Surrender the day with grace.`];

function getGreeting(name) {
  const h = new Date().getHours();
  const arr = h < 12 ? GREETINGS_MORNING(name) : h < 17 ? GREETINGS_AFTERNOON(name) : GREETINGS_EVENING(name);
  return arr[new Date().getDate() % arr.length];
}

// ── Khanda SVG ────────────────────────────────────────────────
function KhandaIcon({ size = 40, color = "#C9A84C" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="3" fill="none" opacity="0.4" />
      <line x1="50" y1="8" x2="50" y2="92" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx="50" cy="50" rx="18" ry="22" stroke={color} strokeWidth="2.5" fill="none" />
      <path d="M20 30 Q50 50 80 30" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M20 70 Q50 50 80 70" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ── Password Gate ─────────────────────────────────────────────
function PasswordGate({ onUnlock }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const tryUnlock = () => {
    if (input.trim().toUpperCase() === ACCESS_CODE.toUpperCase()) {
      onUnlock();
    } else {
      setError(true); setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"radial-gradient(ellipse at 20% 20%, #1a1208 0%, #0d0d0d 50%, #0a0f0a 100%)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Georgia, serif", padding:24 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Noto+Sans+Gurmukhi:wght@400;600&display=swap');
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
        .unlock-input:focus{border-color:#C9A84C!important;outline:none}
      `}</style>
      <div style={{ maxWidth:400, width:"100%", textAlign:"center" }}>
        <div style={{ animation:"float 6s ease-in-out infinite", display:"inline-block", marginBottom:24 }}>
          <KhandaIcon size={64} color="#C9A84C" />
        </div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:700, marginBottom:8, background:"linear-gradient(135deg,#C9A84C,#e8d5a3,#8B6914)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Chardi Kala</h1>
        <p style={{ fontFamily:"'Noto Sans Gurmukhi',sans-serif", fontSize:14, color:"#C9A84C", marginBottom:6 }}>ਚੜ੍ਹਦੀ ਕਲਾ</p>
        <p style={{ color:"#888", fontSize:14, marginBottom:36, lineHeight:1.7 }}>Your Gurbani Healing Journal.<br/>Enter your access code to begin.</p>
        <div style={{ animation:shake?"shake 0.5s ease":"none" }}>
          <input className="unlock-input" type="text" value={input}
            onChange={e=>{ setInput(e.target.value); setError(false); }}
            onKeyDown={e=>e.key==="Enter"&&tryUnlock()}
            placeholder="Enter your access code" autoComplete="off" spellCheck="false"
            style={{ width:"100%", padding:"14px 18px", background:"#1a1208", border:`1px solid ${error?"#E24B4A":"#C9A84C44"}`, borderRadius:12, color:"#e8d5a3", fontSize:16, fontFamily:"Georgia,serif", textAlign:"center", letterSpacing:"0.15em", marginBottom:12, transition:"border-color 0.2s" }}
          />
          {error && <p style={{ color:"#E24B4A", fontSize:13, marginBottom:12, fontStyle:"italic" }}>Incorrect code. Please check your purchase email and try again.</p>}
          <button onClick={tryUnlock} style={{ width:"100%", padding:14, background:"linear-gradient(135deg,#C9A84C,#8B6914)", border:"none", borderRadius:12, color:"#1a1208", fontSize:16, fontWeight:700, fontFamily:"'Playfair Display',serif", cursor:"pointer" }}>
            Open Journal ☬
          </button>
        </div>
        <p style={{ color:"#444", fontSize:12, marginTop:24, lineHeight:1.7 }}>Purchased and need help?<br/><span style={{ color:"#C9A84C88" }}>sikhhistorysakhi.com</span></p>
      </div>
    </div>
  );
}

// ── Profile Setup ─────────────────────────────────────────────
function ProfileSetup({ onComplete }) {
  const [name, setName] = useState("");
  const [intention, setIntention] = useState("");
  const INTENTIONS = ["Finding inner peace","Healing from grief or loss","Strengthening my Nitnem practice","Connecting more deeply with Gurbani","Managing anxiety or stress","Gratitude and presence"];
  const G = "#C9A84C";

  const finish = () => {
    if (!name.trim()) return;
    const p = { name:name.trim(), intention, since:todayKey() };
    LS.set("ck_profile", p);
    onComplete(p);
  };

  return (
    <div style={{ minHeight:"100vh", background:"radial-gradient(ellipse at 20% 20%, #1a1208 0%, #0d0d0d 50%, #0a0f0a 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"Georgia,serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Noto+Sans+Gurmukhi:wght@400;600&display=swap');`}</style>
      <div style={{ maxWidth:480, width:"100%" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <KhandaIcon size={52} color={G} />
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:700, color:G, marginTop:12, marginBottom:8 }}>Sat Sri Akal</h1>
          <p style={{ color:"#888", fontSize:14, lineHeight:1.8 }}>Before we begin, tell us a little about yourself.<br/>This journal is yours — private, personal, and sacred.</p>
        </div>
        <div style={{ marginBottom:18 }}>
          <label style={{ fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", color:G, display:"block", marginBottom:8 }}>Your name</label>
          <input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&finish()} placeholder="e.g. Harpreet"
            style={{ width:"100%", background:"#0d0d0d", border:`1px solid ${name?"#4A7B6F66":"#C9A84C33"}`, borderRadius:10, padding:"12px 16px", color:"#e8d5a3", fontSize:14, fontFamily:"Georgia,serif", outline:"none" }} />
        </div>
        <div style={{ marginBottom:28 }}>
          <label style={{ fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", color:G, display:"block", marginBottom:8 }}>What brings you here?</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {INTENTIONS.map(i=>(
              <button key={i} onClick={()=>setIntention(i)} style={{ padding:"7px 14px", borderRadius:20, fontSize:12, background:intention===i?"#C9A84C22":"transparent", border:`1px solid ${intention===i?G:"#333"}`, color:intention===i?G:"#888", cursor:"pointer", fontFamily:"Georgia,serif" }}>{i}</button>
            ))}
          </div>
        </div>
        <button onClick={finish} disabled={!name.trim()} style={{ width:"100%", padding:14, background:name.trim()?"linear-gradient(135deg,#C9A84C,#8B6914)":"#333", border:"none", borderRadius:12, color:name.trim()?"#1a1208":"#555", fontSize:16, fontWeight:700, fontFamily:"'Playfair Display',serif", cursor:name.trim()?"pointer":"not-allowed" }}>
          Begin my journey ☬
        </button>
      </div>
    </div>
  );
}

// ── Breath Circle ─────────────────────────────────────────────
function BreathCircle({ active, onComplete }) {
  const PHASES = [
    { name:"inhale", label:"Breathe In", duration:4, color:"#C9A84C" },
    { name:"hold",   label:"Hold",       duration:4, color:"#8B6914" },
    { name:"exhale", label:"Breathe Out",duration:6, color:"#4A7B6F" },
  ];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [cycles, setCycles] = useState(0);
  const ref = useRef(null);
  useEffect(()=>{
    if(!active){ setPhaseIdx(0); setElapsed(0); setCycles(0); clearInterval(ref.current); return; }
    let p=0, e=0;
    ref.current = setInterval(()=>{
      e++;
      setElapsed(e);
      if(e>=PHASES[p].duration){
        e=0; setElapsed(0);
        p=(p+1)%PHASES.length;
        setPhaseIdx(p);
        if(p===0) setCycles(c=>{ if(c+1>=3){clearInterval(ref.current);onComplete&&onComplete();} return c+1; });
      }
    },1000);
    return ()=>clearInterval(ref.current);
  },[active]);
  const cur=PHASES[phaseIdx];
  const prog=elapsed/cur.duration;
  const scale=cur.name==="inhale"?1+prog*0.33:cur.name==="exhale"?1.33-prog*0.33:1.33;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16 }}>
      <div style={{ position:"relative", width:160, height:160, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ position:"absolute", borderRadius:"50%", width:140*scale, height:140*scale, background:`radial-gradient(circle,${cur.color}33 0%,${cur.color}11 70%)`, border:`2px solid ${cur.color}66`, transition:"all 0.9s ease" }} />
        <div style={{ width:80, height:80, borderRadius:"50%", background:`radial-gradient(circle,${cur.color}88,${cur.color}44)`, display:"flex", alignItems:"center", justifyContent:"center", border:`2px solid ${cur.color}`, zIndex:1 }}>
          <KhandaIcon size={36} color="#fff" />
        </div>
      </div>
      {active&&<div style={{ textAlign:"center" }}>
        <div style={{ fontFamily:"'Playfair Display',serif", color:cur.color, fontSize:18, fontWeight:600 }}>{cur.label}</div>
        <div style={{ color:"#888", fontSize:13, marginTop:4 }}>Cycle {Math.min(cycles+1,3)} of 3 · {cur.duration-elapsed}s</div>
      </div>}
    </div>
  );
}

// ── Simran Timer ──────────────────────────────────────────────
function SimranTimer() {
  const [running,setRunning]=useState(false);
  const [seconds,setSeconds]=useState(0);
  const [wordIdx,setWordIdx]=useState(0);
  const [naamType,setNaamType]=useState("waheguru");
  const ref=useRef(null);
  const naam=NAAM_OPTIONS[naamType];
  useEffect(()=>setWordIdx(0),[naamType]);
  useEffect(()=>{
    if(running){ ref.current=setInterval(()=>{ setSeconds(s=>s+1); setWordIdx(i=>(i+1)%naam.words.length); },1400); }
    else clearInterval(ref.current);
    return()=>clearInterval(ref.current);
  },[running,naamType]);
  const mins=Math.floor(seconds/60).toString().padStart(2,"0");
  const secs=(seconds%60).toString().padStart(2,"0");
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:24 }}>
        {Object.entries(NAAM_OPTIONS).map(([k,v])=>(
          <button key={k} onClick={()=>{ if(!running) setNaamType(k); }} style={{ padding:"8px 18px", borderRadius:24, fontSize:12, background:naamType===k?"#C9A84C22":"transparent", border:`1.5px solid ${naamType===k?"#C9A84C":"#444"}`, color:naamType===k?"#C9A84C":"#666", cursor:running?"not-allowed":"pointer", fontFamily:"Georgia,serif", opacity:running&&naamType!==k?0.4:1 }}>{v.label}</button>
        ))}
      </div>
      <div style={{ minHeight:80, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", marginBottom:8 }}>
        <div style={{ fontFamily:"'Noto Sans Gurmukhi',sans-serif", fontSize:running?34:20, color:"#C9A84C", letterSpacing:"0.06em", transition:"font-size 0.4s ease", lineHeight:1.4 }}>
          {running?naam.words[wordIdx]:naam.gurmukhi}
        </div>
        {running&&<div style={{ color:"#8B6914", fontSize:13, marginTop:4, fontStyle:"italic" }}>{naam.romanWords[wordIdx]}</div>}
      </div>
      <div style={{ fontFamily:"monospace", fontSize:40, color:"#e8d5a3", letterSpacing:"0.12em", margin:"10px 0 20px" }}>{mins}:{secs}</div>
      <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
        <button onClick={()=>setRunning(r=>!r)} style={{ padding:"10px 28px", borderRadius:30, background:running?"transparent":"linear-gradient(135deg,#C9A84C,#8B6914)", border:"2px solid #C9A84C", color:running?"#C9A84C":"#1a1208", fontFamily:"Georgia,serif", fontSize:14, cursor:"pointer", fontWeight:600 }}>{running?"Pause":"Begin Simran"}</button>
        <button onClick={()=>{ setRunning(false); setSeconds(0); setWordIdx(0); }} style={{ padding:"10px 20px", borderRadius:30, background:"transparent", border:"2px solid #444", color:"#888", fontSize:13, cursor:"pointer", fontFamily:"Georgia,serif" }}>Reset</button>
      </div>
    </div>
  );
}

// ── Mool Mantar Card ──────────────────────────────────────────
function MoolMantarCard() {
  const [done,setDone]=useState(false);
  const [running,setRunning]=useState(false);
  const [seconds,setSeconds]=useState(0);
  const TARGET=300;
  const ref=useRef(null);
  useEffect(()=>{
    if(running){ ref.current=setInterval(()=>setSeconds(s=>{ if(s+1>=TARGET){clearInterval(ref.current);setRunning(false);setDone(true);return TARGET;} return s+1; }),1000); }
    else clearInterval(ref.current);
    return()=>clearInterval(ref.current);
  },[running]);
  const prog=Math.min((seconds/TARGET)*100,100);
  const rem=TARGET-seconds;
  const rM=Math.floor(rem/60).toString().padStart(2,"0");
  const rS=(rem%60).toString().padStart(2,"0");
  return (
    <div style={{ background:"linear-gradient(135deg,#0d1a0d,#0d0d0d)", border:"1px solid #4A7B6F66", borderRadius:20, padding:24, marginTop:24 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
        <span style={{ fontSize:22 }}>ੴ</span>
        <div>
          <div style={{ color:"#4A7B6F", fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase" }}>Daily Practice</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:"#e8d5a3" }}>Mool Mantar Jaap · 5 mins</div>
        </div>
        {done&&<span style={{ marginLeft:"auto", fontSize:20 }}>✅</span>}
      </div>
      <div style={{ background:"#0d0d0d", borderRadius:12, padding:16, marginBottom:16, border:"1px solid #4A7B6F33" }}>
        <div style={{ fontFamily:"'Noto Sans Gurmukhi',sans-serif", fontSize:15, color:"#e8d5a3", lineHeight:1.9, marginBottom:8 }}>{MOOL_MANTAR.gurmukhi}</div>
        <div style={{ color:"#4A7B6F99", fontSize:11, fontStyle:"italic", marginBottom:6 }}>{MOOL_MANTAR.transliteration}</div>
        <div style={{ color:"#888", fontSize:12, lineHeight:1.7 }}>{MOOL_MANTAR.translation}</div>
      </div>
      <div style={{ marginBottom:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
          <span style={{ color:"#666", fontSize:12 }}>{done?"Complete — Waheguru 🙏":running?`${rM}:${rS} remaining`:"5:00 goal"}</span>
          <span style={{ color:"#4A7B6F", fontSize:12 }}>{Math.round(prog)}%</span>
        </div>
        <div style={{ height:6, background:"#1a1a1a", borderRadius:3, overflow:"hidden" }}>
          <div style={{ height:"100%", borderRadius:3, width:`${prog}%`, background:done?"linear-gradient(90deg,#4A7B6F,#6bab9b)":"linear-gradient(90deg,#4A7B6F,#C9A84C)", transition:"width 1s linear" }} />
        </div>
      </div>
      {!done?(
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={()=>setRunning(r=>!r)} style={{ padding:"9px 22px", borderRadius:24, fontSize:13, background:running?"transparent":"linear-gradient(135deg,#4A7B6F,#2d5a50)", border:"1.5px solid #4A7B6F", color:running?"#4A7B6F":"#e8d5a3", cursor:"pointer", fontFamily:"Georgia,serif", fontWeight:600 }}>{running?"Pause":seconds>0?"Resume":"Start 5-Min Jaap"}</button>
          {seconds>0&&!running&&<button onClick={()=>setSeconds(0)} style={{ padding:"9px 16px", borderRadius:24, fontSize:12, background:"transparent", border:"1px solid #333", color:"#555", cursor:"pointer" }}>Reset</button>}
          <button onClick={()=>setDone(true)} style={{ padding:"9px 16px", borderRadius:24, fontSize:12, background:"transparent", border:"1px solid #4A7B6F44", color:"#4A7B6F88", cursor:"pointer", marginLeft:"auto" }}>Mark done ✓</button>
        </div>
      ):(
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ color:"#4A7B6F", fontFamily:"'Playfair Display',serif", fontSize:15, fontStyle:"italic" }}>Waheguru Waheguru. Your practice is complete.</span>
          <button onClick={()=>{ setDone(false); setSeconds(0); }} style={{ padding:"6px 14px", borderRadius:16, fontSize:11, background:"transparent", border:"1px solid #333", color:"#555", cursor:"pointer", marginLeft:"auto" }}>Again</button>
        </div>
      )}
    </div>
  );
}

// ── Nitnem Card ───────────────────────────────────────────────
function NitnemCard({ bani, checked, onToggle }) {
  const [running,setRunning]=useState(false);
  const [seconds,setSeconds]=useState(0);
  const [done,setDone]=useState(false);
  const ref=useRef(null);
  const TARGET=bani.duration*60;
  useEffect(()=>{
    if(running){ ref.current=setInterval(()=>setSeconds(s=>{ if(s+1>=TARGET){clearInterval(ref.current);setRunning(false);setDone(true);onToggle(true);return TARGET;} return s+1; }),1000); }
    else clearInterval(ref.current);
    return()=>clearInterval(ref.current);
  },[running]);
  const prog=Math.min((seconds/TARGET)*100,100);
  const rem=TARGET-seconds;
  const rM=Math.floor(rem/60).toString().padStart(2,"0");
  const rS=(rem%60).toString().padStart(2,"0");
  const TC={"🌄":{bg:"#1a1208",accent:"#C9A84C",border:"#C9A84C44"},"🌆":{bg:"#0d1218",accent:"#4A7BAA",border:"#4A7BAA44"},"🌙":{bg:"#0d0d1a",accent:"#7A6FBB",border:"#7A6FBB44"}};
  const col=TC[bani.timeIcon]||TC["🌄"];
  return (
    <div style={{ background:col.bg, border:`1px solid ${col.border}`, borderRadius:14, padding:"14px 16px", marginBottom:10 }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
        <span style={{ fontSize:20, flexShrink:0, marginTop:1 }}>{bani.timeIcon}</span>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:2 }}>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:15, color:"#e8d5a3", fontWeight:600 }}>{bani.title}</span>
            <span style={{ fontFamily:"'Noto Sans Gurmukhi',sans-serif", fontSize:12, color:col.accent }}>{bani.gurmukhi}</span>
          </div>
          <div style={{ fontSize:12, color:"#888", lineHeight:1.5, marginBottom:10 }}>{bani.meaning}</div>
          {!done?(
            <>
              <div style={{ marginBottom:8 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ color:"#555", fontSize:11 }}>{running?`${rM}:${rS} remaining`:`~${bani.duration} min · ${bani.time}`}</span>
                  <span style={{ color:col.accent, fontSize:11 }}>{Math.round(prog)}%</span>
                </div>
                <div style={{ height:3, background:"#1a1a1a", borderRadius:2, overflow:"hidden" }}>
                  <div style={{ height:"100%", borderRadius:2, width:`${prog}%`, background:`linear-gradient(90deg,${col.accent},#e8d5a3)`, transition:"width 1s linear" }} />
                </div>
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <button onClick={()=>setRunning(r=>!r)} style={{ padding:"6px 16px", borderRadius:18, fontSize:12, background:running?"transparent":`${col.accent}22`, border:`1px solid ${col.accent}`, color:col.accent, cursor:"pointer", fontFamily:"Georgia,serif", fontWeight:600 }}>
                  {running?"Pause":seconds>0?"Resume":`Start ${bani.duration}-min Paath`}
                </button>
                {seconds>0&&!running&&<button onClick={()=>setSeconds(0)} style={{ padding:"6px 12px", borderRadius:18, fontSize:11, background:"transparent", border:"1px solid #333", color:"#555", cursor:"pointer" }}>Reset</button>}
                <button onClick={()=>{ setDone(true); onToggle(true); }} style={{ padding:"6px 12px", borderRadius:18, fontSize:11, background:"transparent", border:`1px solid ${col.accent}33`, color:`${col.accent}77`, cursor:"pointer", marginLeft:"auto" }}>Mark done ✓</button>
              </div>
            </>
          ):(
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ color:"#4A7B6F", fontFamily:"'Playfair Display',serif", fontSize:13, fontStyle:"italic" }}>Waheguru. Paath complete. 🙏</span>
              <button onClick={()=>{ setDone(false); setSeconds(0); onToggle(false); }} style={{ padding:"4px 12px", borderRadius:14, fontSize:11, background:"transparent", border:"1px solid #333", color:"#555", cursor:"pointer", marginLeft:"auto" }}>Again</button>
            </div>
          )}
        </div>
        {(checked||done)&&<div style={{ width:22, height:22, borderRadius:"50%", background:"#4A7B6F", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"#fff", flexShrink:0 }}>✓</div>}
      </div>
    </div>
  );
}

// ── Gratitude Section ─────────────────────────────────────────
function GratitudeSection({ saved, onSave }) {
  const PROMPTS = ["A person who showed me kindness today…","Something in my body I am grateful for…","A moment of beauty I witnessed today…","Something Waheguru provided that I take for granted…","A challenge that is quietly making me stronger…","A small comfort that held me today…"];
  const [items,setItems]=useState(saved&&saved.length?saved:["",""]);
  const [done,setDone]=useState(false);
  const update=(i,v)=>{ const n=[...items]; n[i]=v; setItems(n); };
  const handleSave=()=>{ const f=items.filter(x=>x.trim()); if(!f.length) return; onSave(f); setDone(true); setTimeout(()=>setDone(false),2500); };
  const G="#C9A84C"; const T="#4A7B6F";
  return (
    <div style={{ marginTop:28 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
        <span style={{ fontSize:20 }}>🌸</span>
        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:"#e8d5a3", fontWeight:600 }}>What are you grateful for today?</span>
      </div>
      <p style={{ color:"#888", fontSize:13, fontStyle:"italic", marginBottom:10, lineHeight:1.6 }}>ਸ਼ੁਕਰਾਨਾ — The practice of counting Waheguru's gifts, however small.</p>
      <div style={{ background:"linear-gradient(135deg,#0d1a0d,#0d0d0d)", border:"1px solid #4A7B6F44", borderRadius:14, padding:"14px 18px", marginBottom:14 }}>
        <div style={{ color:"#e8d5a3", fontSize:14, lineHeight:1.8, marginBottom:4, fontFamily:"'Playfair Display',serif", fontStyle:"italic" }}>"Give thanks to the One who gives all; in gratitude, the soul finds peace."</div>
        <div style={{ color:"#4A7B6F99", fontSize:12, fontStyle:"italic" }}>Shri Guru Granth Sahib, p. 6</div>
      </div>
      <div style={{ color:G, fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:12 }}>Today I am grateful for…</div>
      {items.map((item,i)=>(
        <div key={i} style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
          <div style={{ width:24, height:24, borderRadius:"50%", background:"#C9A84C22", border:`1px solid ${G}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:G, flexShrink:0 }}>{i+1}</div>
          <input value={item} onChange={e=>update(i,e.target.value)} placeholder={PROMPTS[i]||"Another blessing…"}
            style={{ flex:1, background:"#0d0d0d", border:`1px solid ${item.trim()?"#4A7B6F66":"#C9A84C33"}`, borderRadius:10, padding:"10px 14px", color:"#e8d5a3", fontSize:13, fontFamily:"Georgia,serif", outline:"none" }} />
          {items.length>1&&<button onClick={()=>setItems(items.filter((_,j)=>j!==i))} style={{ background:"none", border:"none", color:"#444", cursor:"pointer", fontSize:16 }}>×</button>}
        </div>
      ))}
      <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap", marginTop:4 }}>
        {items.length<7&&<button onClick={()=>setItems([...items,""])} style={{ padding:"8px 16px", borderRadius:20, background:"transparent", border:`1px solid ${G}33`, color:G, fontSize:12, cursor:"pointer", fontFamily:"Georgia,serif" }}>+ Add more</button>}
        <button onClick={handleSave} style={{ padding:"10px 24px", borderRadius:24, background:`linear-gradient(135deg,${T},#2d5a50)`, border:"none", color:"#e8d5a3", fontSize:14, cursor:"pointer", fontFamily:"Georgia,serif", fontWeight:600 }}>Save gratitude ✦</button>
        {done&&<span style={{ color:T, fontSize:13, fontStyle:"italic" }}>✓ Shukarana. Saved.</span>}
      </div>
    </div>
  );
}

// ── Calendar View ─────────────────────────────────────────────
function CalendarView({ entries, isDark }) {
  const G="#C9A84C";
  const now=new Date();
  const [viewYear,setViewYear]=useState(now.getFullYear());
  const [viewMonth,setViewMonth]=useState(now.getMonth());
  const firstDay=new Date(viewYear,viewMonth,1);
  const daysInMonth=new Date(viewYear,viewMonth+1,0).getDate();
  const startDow=(firstDay.getDay()+6)%7; // Mon=0
  const monthLabel=firstDay.toLocaleDateString("en-CA",{month:"long",year:"numeric"});
  const go=(delta)=>{ let m=viewMonth+delta,y=viewYear; if(m<0){m=11;y--;} if(m>11){m=0;y++;} setViewMonth(m); setViewYear(y); };
  const hasEntry=(d)=>{ const k=`${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; return !!entries[k]; };
  const isToday=(d)=>d===now.getDate()&&viewMonth===now.getMonth()&&viewYear===now.getFullYear();
  const bg=isDark?"#1a120899":"rgba(245,235,220,0.6)";
  const textCol=isDark?"#e8d5a3":"#2C1810";
  const mutedCol=isDark?"#666":"#a08060";
  return (
    <div style={{ background:bg, border:`1px solid ${G}33`, borderRadius:16, padding:"18px 20px", marginBottom:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <button onClick={()=>go(-1)} style={{ background:"none", border:"none", color:G, fontSize:18, cursor:"pointer", padding:"0 8px" }}>‹</button>
        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:G, fontWeight:600 }}>{monthLabel}</span>
        <button onClick={()=>go(1)} style={{ background:"none", border:"none", color:G, fontSize:18, cursor:"pointer", padding:"0 8px" }}>›</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:6 }}>
        {["M","T","W","T","F","S","S"].map((d,i)=>(
          <div key={i} style={{ textAlign:"center", fontSize:11, color:mutedCol, paddingBottom:4 }}>{d}</div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>
        {Array.from({length:startDow}).map((_,i)=><div key={`e${i}`}/>)}
        {Array.from({length:daysInMonth}).map((_,i)=>{
          const d=i+1;
          const has=hasEntry(d);
          const today=isToday(d);
          return (
            <div key={d} style={{ aspectRatio:"1", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", borderRadius:8, background:has?"#C9A84C22":today?`${G}11`:"transparent", border:today?`1px solid ${G}66`:"1px solid transparent", position:"relative" }}>
              <span style={{ fontSize:12, color:has?G:today?G:textCol, fontWeight:has||today?600:400 }}>{d}</span>
              {has&&<span style={{ fontSize:7, color:G, position:"absolute", bottom:2 }}>✦</span>}
            </div>
          );
        })}
      </div>
      <div style={{ display:"flex", gap:16, marginTop:12, justifyContent:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <div style={{ width:10, height:10, borderRadius:3, background:"#C9A84C22", border:`1px solid ${G}66` }}/>
          <span style={{ fontSize:11, color:mutedCol }}>Entry written</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <span style={{ fontSize:10, color:G }}>✦</span>
          <span style={{ fontSize:11, color:mutedCol }}>Completed day</span>
        </div>
      </div>
    </div>
  );
}

// ── Full Entry Viewer ─────────────────────────────────────────
function EntryViewer({ entry, date, onBack, S }) {
  const moodObj=MOODS.find(m=>m.value===entry.mood);
  const formatted=new Date(date+"T12:00:00").toLocaleDateString("en-CA",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
  return (
    <div>
      <button onClick={onBack} style={{ background:"none", border:"none", color:S.gold, fontSize:13, cursor:"pointer", fontFamily:"Georgia,serif", marginBottom:20, display:"flex", alignItems:"center", gap:6 }}>← Back to reflections</button>
      <div style={{ background:"linear-gradient(135deg,#1a1208,#0d0d0d)", border:`1px solid ${S.gold}33`, borderRadius:16, padding:24 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8, marginBottom:16 }}>
          <div>
            <div style={{ color:S.gold, fontSize:13, fontWeight:600, marginBottom:2 }}>{formatted}</div>
            {entry.ts&&<div style={{ color:"#555", fontSize:11 }}>{entry.ts}</div>}
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            {entry.theme&&<span style={{ padding:"3px 12px", borderRadius:12, fontSize:11, background:"#C9A84C22", color:S.gold }}>{entry.theme}</span>}
            {moodObj&&<span style={{ fontSize:18 }} title={moodObj.label}>{moodObj.emoji}</span>}
          </div>
        </div>
        {entry.shabad&&(
          <div style={{ borderLeft:`3px solid ${S.gold}55`, paddingLeft:14, marginBottom:16 }}>
            <div style={{ fontFamily:"'Noto Sans Gurmukhi',sans-serif", fontSize:16, color:S.text, lineHeight:1.9, marginBottom:4 }}>{entry.shabad.gurmukhi}</div>
            <div style={{ color:`${S.gold}88`, fontSize:12, fontStyle:"italic", marginBottom:4 }}>{entry.shabad.transliteration}</div>
            <div style={{ color:"#aaa", fontSize:13, lineHeight:1.6 }}>{entry.shabad.translation}</div>
          </div>
        )}
        {entry.text&&<p style={{ color:"#ccc", fontSize:14, lineHeight:1.9, whiteSpace:"pre-wrap", fontStyle:"italic", marginBottom:entry.gratitudes?20:0 }}>{entry.text}</p>}
        {entry.gratitudes&&entry.gratitudes.length>0&&(
          <div style={{ borderTop:`1px solid ${S.border}`, paddingTop:16 }}>
            <div style={{ color:S.teal, fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:12 }}>🌸 Shukarana — Gratitude</div>
            {entry.gratitudes.map((g,gi)=>(
              <div key={gi} style={{ display:"flex", gap:10, marginBottom:8 }}>
                <span style={{ color:S.gold, fontSize:13, minWidth:20 }}>{gi+1}.</span>
                <span style={{ color:"#ccc", fontSize:14, lineHeight:1.7 }}>{g}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN JOURNAL COMPONENT ────────────────────────────────────
export default function GurbaniJournal() {
  const [unlocked,setUnlocked]=useState(()=>LS.get("ck_unlocked",false));
  const [profile,setProfile]=useState(()=>LS.get("ck_profile",null));
  const [isDark,setIsDark]=useState(()=>LS.get("ck_theme","dark")==="dark");
  const [screen,setScreen]=useState("home");
  const [selectedShabad,setSelectedShabad]=useState(null);
  const [journalEntries,setJournalEntries]=useState(()=>LS.get("ck_entries",{}));
  const today=todayKey();
  const [currentEntry,setCurrentEntry]=useState(()=>{ const e=LS.get("ck_entries",{}); return e[today]?.text||""; });
  const [mood,setMood]=useState(()=>{ const e=LS.get("ck_entries",{}); return e[today]?.mood||null; });
  const [breathActive,setBreathActive]=useState(false);
  const [breathDone,setBreathDone]=useState(false);
  const [activeTheme,setActiveTheme]=useState(null);
  const [savedMessage,setSavedMessage]=useState(false);
  const [checkedPractices,setCheckedPractices]=useState(()=>LS.get(`ck_prac_${today}`,{}));
  const [nitnemChecked,setNitnemChecked]=useState(()=>LS.get(`ck_nitnem_${today}`,{}));
  const [practicesTab,setPracticesTab]=useState("nitnem");
  const [viewingEntry,setViewingEntry]=useState(null);
  const [filterMonth,setFilterMonth]=useState("");
  const [filterTheme,setFilterTheme]=useState("");
  const [searchQuery,setSearchQuery]=useState("");
  const [showSettings,setShowSettings]=useState(false);
  const [dayShabad]=useState(()=>SHABAD[new Date().getDay()%SHABAD.length]);

  // Persist on change
  useEffect(()=>LS.set("ck_entries",journalEntries),[journalEntries]);
  useEffect(()=>LS.set(`ck_prac_${today}`,checkedPractices),[checkedPractices]);
  useEffect(()=>LS.set(`ck_nitnem_${today}`,nitnemChecked),[nitnemChecked]);
  useEffect(()=>LS.set("ck_theme",isDark?"dark":"light"),[isDark]);
  useEffect(()=>{ if(unlocked) LS.set("ck_unlocked",true); },[unlocked]);

  // Streak counter
  const calcStreak=()=>{
    let streak=0;
    const d=new Date();
    for(let i=0;i<365;i++){
      const k=d.toLocaleDateString("en-CA");
      if(journalEntries[k]&&(journalEntries[k].text||journalEntries[k].gratitudes?.length)){
        streak++; d.setDate(d.getDate()-1);
      } else { if(i===0){d.setDate(d.getDate()-1);continue;} break; }
    }
    return streak;
  };
  const streak=calcStreak();

  // Available months
  const availableMonths=[...new Set(Object.keys(journalEntries).map(d=>d.slice(0,7)))].sort().reverse();

  // Filtered entries
  const filteredEntries=Object.entries(journalEntries)
    .filter(([date,e])=>{
      if(filterMonth&&!date.startsWith(filterMonth)) return false;
      if(filterTheme&&e.theme!==filterTheme) return false;
      if(searchQuery){ const q=searchQuery.toLowerCase(); return (e.text||"").toLowerCase().includes(q)||(e.theme||"").toLowerCase().includes(q)||(e.gratitudes||[]).some(g=>g.toLowerCase().includes(q)); }
      return true;
    })
    .sort(([a],[b])=>b.localeCompare(a));

  const saveEntry=()=>{
    if(!currentEntry.trim()) return;
    const updated={ ...journalEntries, [today]:{ ...(journalEntries[today]||{}), text:currentEntry, shabad:selectedShabad, mood, theme:selectedShabad?.theme, ts:new Date().toLocaleString(), date:today }};
    setJournalEntries(updated);
    LS.set("ck_entries",updated);
    setSavedMessage(true);
    setTimeout(()=>setSavedMessage(false),2500);
  };

  const saveGratitudes=(filled)=>{
    const updated={ ...journalEntries, [today]:{ ...(journalEntries[today]||{}), gratitudes:filled, date:today, ts:new Date().toLocaleString() }};
    setJournalEntries(updated);
    LS.set("ck_entries",updated);
  };

  const filteredShabad=activeTheme?SHABAD.filter(s=>s.theme===activeTheme):SHABAD;

  // Theme colors
  const S=isDark
    ?{ gold:"#C9A84C", teal:"#4A7B6F", dark:"#0d0d0d", bg:"#1a120899", border:"#C9A84C33", text:"#e8d5a3", muted:"#888", deep:"#8B6914", pageBg:"radial-gradient(ellipse at 20% 20%, #1a1208 0%, #0d0d0d 50%, #0a0f0a 100%)", navBg:"#0d0d0dcc", cardBg:"#1a120899" }
    :{ gold:"#8B5E0A", teal:"#2d6b5f", dark:"#f5ebe0", bg:"rgba(245,235,220,0.7)", border:"#8B5E0A33", text:"#2C1810", muted:"#7A5C48", deep:"#6B3F06", pageBg:"radial-gradient(ellipse at 20% 20%, #FDF3E3 0%, #F5EBD8 50%, #EDE0C8 100%)", navBg:"rgba(253,243,227,0.92)", cardBg:"rgba(253,243,227,0.8)" };

  const btnPrimary={ padding:"11px 28px", borderRadius:28, background:`linear-gradient(135deg,${S.gold},${S.deep})`, border:"none", color:isDark?"#1a1208":"#fff", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"Georgia,serif" };
  const btnGhost={ padding:"10px 20px", borderRadius:28, background:"transparent", border:`1px solid ${isDark?"#444":"#b89060"}`, color:S.muted, fontSize:13, cursor:"pointer", fontFamily:"Georgia,serif" };
  const cardStyle={ background:S.cardBg, border:`1px solid ${S.border}`, borderRadius:16, padding:24, marginBottom:16 };

  const navItems=[
    {id:"shabad",label:"Shabad"},
    {id:"breathe",label:"Breathe"},
    {id:"simran",label:"Simran"},
    {id:"journal",label:"Journal"},
    {id:"practices",label:"Practices"},
    {id:"entries",label:"Reflections"},
  ];

  // Gates
  if(!unlocked) return <PasswordGate onUnlock={()=>setUnlocked(true)} />;
  if(!profile) return <ProfileSetup onComplete={p=>setProfile(p)} />;

  const greeting=getGreeting(profile.name);
  const streakDaysLabels=["M","T","W","T","F","S","S"];
  const todayDow=(new Date().getDay()+6)%7;
  const weekFilled=streakDaysLabels.map((_,i)=>{
    const d=new Date(); d.setDate(d.getDate()-(todayDow-i));
    return !!journalEntries[d.toLocaleDateString("en-CA")];
  });

  return (
    <div style={{ minHeight:"100vh", background:S.pageBg, color:S.text, fontFamily:"Georgia,'Times New Roman',serif", transition:"background 0.4s ease" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Noto+Sans+Gurmukhi:wght@400;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#C9A84C44;border-radius:2px}
        textarea,input{resize:none}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .hov-card:hover{border-color:#C9A84C88!important;transform:translateY(-2px);transition:all 0.25s}
        .nav-pill:hover{background:#C9A84C22!important}
        .mood-orb:hover{transform:scale(1.12)}
        .practice-row:hover{opacity:0.85}
      `}</style>

      {/* ── Nav ── */}
      <nav style={{ position:"sticky", top:0, zIndex:100, background:S.navBg, backdropFilter:"blur(12px)", borderBottom:`1px solid ${S.border}`, padding:"10px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={()=>setScreen("home")}>
          <KhandaIcon size={26} color={S.gold} />
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, background:`linear-gradient(90deg,${S.gold},${S.text},${S.gold})`, backgroundSize:"200% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", animation:"shimmer 4s linear infinite" }}>Chardi Kala</span>
        </div>
        <div style={{ display:"flex", gap:4, flexWrap:"wrap", alignItems:"center" }}>
          {navItems.map(n=>(
            <button key={n.id} className="nav-pill" onClick={()=>setScreen(n.id)} style={{ padding:"5px 13px", borderRadius:20, fontSize:12, background:screen===n.id?"#C9A84C22":"transparent", border:screen===n.id?`1px solid ${S.gold}66`:"1px solid transparent", color:screen===n.id?S.gold:S.muted, cursor:"pointer", transition:"all 0.2s", fontFamily:"Georgia,serif" }}>{n.label}</button>
          ))}
          {/* Theme toggle */}
          <button onClick={()=>setIsDark(d=>!d)} title={isDark?"Switch to light mode":"Switch to dark mode"} style={{ padding:"5px 10px", borderRadius:20, fontSize:14, background:"transparent", border:`1px solid ${S.border}`, color:S.gold, cursor:"pointer", marginLeft:4 }}>{isDark?"☀️":"🌙"}</button>
          {/* Settings */}
          <button onClick={()=>setShowSettings(s=>!s)} title="Settings" style={{ padding:"5px 10px", borderRadius:20, fontSize:14, background:showSettings?"#C9A84C22":"transparent", border:`1px solid ${showSettings?S.gold:S.border}`, color:S.gold, cursor:"pointer" }}>⚙️</button>
        </div>
      </nav>

      {/* ── Settings Panel ── */}
      {showSettings&&(
        <div style={{ background:S.cardBg, borderBottom:`1px solid ${S.border}`, padding:"16px 24px", display:"flex", flexWrap:"wrap", gap:16, alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", color:S.gold, marginBottom:4 }}>Signed in as</div>
            <div style={{ fontSize:15, color:S.text, fontFamily:"'Playfair Display',serif" }}>{profile.name}</div>
            {profile.intention&&<div style={{ fontSize:12, color:S.muted, marginTop:2 }}>Focus: {profile.intention}</div>}
            {profile.since&&<div style={{ fontSize:11, color:S.muted, marginTop:2 }}>Journaling since {profile.since}</div>}
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <div style={{ background:isDark?"#C9A84C22":"rgba(139,94,10,0.1)", borderRadius:12, padding:"8px 16px", textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:700, color:S.gold }}>{streak}</div>
              <div style={{ fontSize:11, color:S.muted }}>day streak 🔥</div>
            </div>
            <div style={{ background:isDark?"#4A7B6F22":"rgba(45,107,95,0.1)", borderRadius:12, padding:"8px 16px", textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:700, color:S.teal }}>{Object.keys(journalEntries).length}</div>
              <div style={{ fontSize:11, color:S.muted }}>total entries</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>{ if(window.confirm("Reset your name/profile? Entries will be kept.")) { LS.set("ck_profile",null); setProfile(null); setShowSettings(false); } }} style={{ ...btnGhost, fontSize:12, padding:"8px 14px" }}>Reset profile</button>
          </div>
        </div>
      )}

      <main style={{ maxWidth:780, margin:"0 auto", padding:"28px 18px 80px", animation:"fadeIn 0.4s ease" }}>

        {/* ── HOME ── */}
        {screen==="home"&&(
          <div>
            <div style={{ textAlign:"center", padding:"32px 0 40px" }}>
              <div style={{ animation:"float 6s ease-in-out infinite", display:"inline-block", marginBottom:20 }}>
                <KhandaIcon size={68} color={S.gold} />
              </div>
              {/* Personalised greeting */}
              <p style={{ color:S.gold, fontSize:14, fontStyle:"italic", marginBottom:6, letterSpacing:"0.05em" }}>{greeting}</p>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,6vw,48px)", fontWeight:700, lineHeight:1.2, marginBottom:12, background:`linear-gradient(135deg,${S.gold},${S.text},${S.deep})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Chardi Kala</h1>
              <p style={{ color:S.muted, fontSize:13, fontStyle:"italic", letterSpacing:"0.15em", marginBottom:6 }}>ਚੜ੍ਹਦੀ ਕਲਾ — Eternal Optimism</p>

              {/* Streak banner */}
              {streak>0&&(
                <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:isDark?"#C9A84C11":"rgba(139,94,10,0.08)", border:`1px solid ${S.gold}44`, borderRadius:24, padding:"8px 20px", marginBottom:28 }}>
                  <span style={{ fontSize:18 }}>🔥</span>
                  <span style={{ color:S.gold, fontSize:14, fontWeight:600 }}>{streak} Day Chardi Kala Streak</span>
                </div>
              )}
              {streak===0&&<div style={{ marginBottom:28 }}/>}

              {/* Today's Shabad */}
              <div style={{ background:isDark?"linear-gradient(135deg,#1a1208,#0d0d0d)":"linear-gradient(135deg,#FDF3E3,#F5EBD8)", border:`1px solid ${S.gold}44`, borderRadius:20, padding:26, marginBottom:24, textAlign:"left" }}>
                <div style={{ color:S.gold, fontSize:11, letterSpacing:"0.2em", marginBottom:14, textTransform:"uppercase" }}>Today's Shabad · {dayShabad.theme}</div>
                <div style={{ fontFamily:"'Noto Sans Gurmukhi',sans-serif", fontSize:19, color:S.text, lineHeight:1.75, marginBottom:10 }}>{dayShabad.gurmukhi}</div>
                <div style={{ color:`${S.gold}99`, fontSize:12, fontStyle:"italic", marginBottom:8 }}>{dayShabad.transliteration}</div>
                <div style={{ color:S.muted, fontSize:14, lineHeight:1.7, marginBottom:18 }}>{dayShabad.translation}</div>
                <div style={{ color:S.teal, fontSize:13, fontStyle:"italic", borderTop:`1px solid ${S.gold}22`, paddingTop:14, marginBottom:18 }}>💭 {dayShabad.prompt}</div>
                <button onClick={()=>{ setSelectedShabad(dayShabad); setScreen("journal"); }} style={btnPrimary}>Journal on This →</button>
              </div>

              {/* 6 Paths */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))", gap:12 }}>
                {[
                  {id:"shabad",icon:"📖",title:"Shabad Library",desc:"Gurbani by healing theme"},
                  {id:"breathe",icon:"🫁",title:"Sacred Breath",desc:"4-4-6 pranayam"},
                  {id:"simran",icon:"🕉️",title:"Simran Timer",desc:"Sit with the Naam"},
                  {id:"journal",icon:"✍️",title:"Healing Journal",desc:"Gurbani-guided writing"},
                  {id:"practices",icon:"☬",title:"Daily Practices",desc:"Track your nitnem"},
                  {id:"entries",icon:"🌿",title:"Reflections",desc:"Your saved entries"},
                ].map(p=>(
                  <button key={p.id} className="hov-card" onClick={()=>setScreen(p.id)} style={{ padding:18, borderRadius:14, textAlign:"left", background:S.cardBg, border:`1px solid ${S.border}`, cursor:"pointer", color:S.text, transition:"all 0.25s" }}>
                    <div style={{ fontSize:26, marginBottom:8 }}>{p.icon}</div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, marginBottom:5 }}>{p.title}</div>
                    <div style={{ fontSize:12, color:S.muted, lineHeight:1.5 }}>{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SHABAD LIBRARY ── */}
        {screen==="shabad"&&(
          <div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, marginBottom:6, color:S.text }}>Shabad Library</h2>
            <p style={{ color:S.muted, fontSize:13, marginBottom:20 }}>Select a theme or explore all verses. Tap any shabad to journal on it.</p>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:24 }}>
              <button onClick={()=>setActiveTheme(null)} style={{ padding:"5px 15px", borderRadius:20, fontSize:11, background:!activeTheme?"#C9A84C22":"transparent", border:`1px solid ${!activeTheme?S.gold:"#444"}`, color:!activeTheme?S.gold:S.muted, cursor:"pointer" }}>All</button>
              {HEALING_THEMES.map(t=>(
                <button key={t} onClick={()=>setActiveTheme(t===activeTheme?null:t)} style={{ padding:"5px 15px", borderRadius:20, fontSize:11, background:activeTheme===t?"#C9A84C22":"transparent", border:`1px solid ${activeTheme===t?S.gold:"#444"}`, color:activeTheme===t?S.gold:S.muted, cursor:"pointer" }}>{t}</button>
              ))}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {filteredShabad.map((s,i)=>(
                <div key={i} className="hov-card" style={{ ...cardStyle, cursor:"pointer" }} onClick={()=>{ setSelectedShabad(s); setScreen("journal"); }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                    <span style={{ padding:"3px 11px", borderRadius:10, fontSize:11, background:"#C9A84C22", color:S.gold, letterSpacing:"0.08em" }}>{s.theme}</span>
                    <span style={{ color:isDark?"#444":"#b89060", fontSize:11 }}>Tap to journal →</span>
                  </div>
                  <div style={{ fontFamily:"'Noto Sans Gurmukhi',sans-serif", fontSize:18, color:S.text, lineHeight:1.75, marginBottom:10 }}>{s.gurmukhi}</div>
                  <div style={{ color:`${S.gold}88`, fontSize:12, fontStyle:"italic", marginBottom:8 }}>{s.transliteration}</div>
                  <div style={{ color:S.muted, fontSize:13, lineHeight:1.65, marginBottom:10 }}>{s.translation}</div>
                  <div style={{ color:`${S.teal}88`, fontSize:12, fontStyle:"italic", borderTop:`1px solid ${S.border}`, paddingTop:10 }}>💭 {s.prompt}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BREATHE ── */}
        {screen==="breathe"&&(
          <div style={{ textAlign:"center" }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, marginBottom:6, color:S.text }}>Sacred Breath</h2>
            <p style={{ color:S.muted, fontSize:13, marginBottom:8 }}>Inhale 4 · Hold 4 · Exhale 6</p>
            <p style={{ color:isDark?"#555":"#a08060", fontSize:12, fontStyle:"italic", marginBottom:28 }}>"Saas saas simrahu Gobind — with every breath, remember the Creator."</p>
            <div style={{ background:S.cardBg, border:`1px solid ${S.border}`, borderRadius:24, padding:36, marginBottom:24, display:"flex", flexDirection:"column", alignItems:"center", gap:28 }}>
              <BreathCircle active={breathActive} onComplete={()=>{ setBreathDone(true); setBreathActive(false); }} />
              {!breathActive&&!breathDone&&<button onClick={()=>{ setBreathActive(true); setBreathDone(false); }} style={btnPrimary}>Begin Breathwork</button>}
              {breathActive&&<button onClick={()=>{ setBreathActive(false); setBreathDone(false); }} style={btnGhost}>Stop</button>}
              {breathDone&&(
                <div style={{ textAlign:"center" }}>
                  <div style={{ color:S.gold, fontFamily:"'Playfair Display',serif", fontSize:20, marginBottom:8 }}>🌿 Sat Sri Akal</div>
                  <p style={{ color:S.muted, fontSize:13, marginBottom:16 }}>3 cycles complete. You are present.</p>
                  <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
                    <button onClick={()=>{ setBreathActive(true); setBreathDone(false); }} style={{ ...btnGhost, borderColor:`${S.gold}66`, color:S.gold }}>Again</button>
                    <button onClick={()=>setScreen("journal")} style={btnPrimary}>Journal Now →</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SIMRAN ── */}
        {screen==="simran"&&(
          <div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, marginBottom:6, textAlign:"center", color:S.text }}>Simran</h2>
            <p style={{ color:S.muted, fontSize:13, marginBottom:28, textAlign:"center" }}>Sit still. Let the Naam carry you.</p>
            <div style={{ background:S.cardBg, border:`1px solid ${S.border}`, borderRadius:24, padding:32 }}><SimranTimer /></div>
            <MoolMantarCard />
            <div style={{ background:isDark?"#0d0d0d":"rgba(245,235,220,0.8)", border:`1px solid ${isDark?"#333":S.border}`, borderRadius:14, padding:18, marginTop:22 }}>
              <div style={{ color:S.gold, fontSize:11, letterSpacing:"0.2em", marginBottom:12, textTransform:"uppercase" }}>How to Practice</div>
              {["Find a comfortable seated position. You may close your eyes.","Choose your Naam — Waheguru Waheguru or Satnam Waheguru.","When thoughts arise, gently return to the Naam without judgment.","Aim for 11, 22, or 31 minutes. Even 5 minutes brings peace."].map((tip,i)=>(
                <div key={i} style={{ display:"flex", gap:10, marginBottom:10 }}>
                  <span style={{ color:S.gold, fontSize:12, minWidth:18 }}>{i+1}.</span>
                  <span style={{ color:S.muted, fontSize:13, lineHeight:1.7 }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── JOURNAL ── */}
        {screen==="journal"&&(
          <div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, marginBottom:4, color:S.text }}>Healing Journal</h2>
            <p style={{ color:S.muted, fontSize:13, marginBottom:20 }}>
              {new Date().toLocaleDateString("en-CA",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}
              {journalEntries[today]?.text&&<span style={{ color:S.teal, marginLeft:8, fontSize:12 }}>· Entry saved today ✓</span>}
            </p>

            {/* Mood */}
            <div style={cardStyle}>
              <div style={{ color:S.gold, fontSize:11, letterSpacing:"0.2em", marginBottom:14, textTransform:"uppercase" }}>How is your light today?</div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center" }}>
                {MOODS.map(m=>(
                  <button key={m.value} className="mood-orb" onClick={()=>setMood(m.value)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"10px 14px", borderRadius:12, background:mood===m.value?"#C9A84C22":"transparent", border:`1px solid ${mood===m.value?S.gold:"#333"}`, cursor:"pointer", transition:"all 0.2s", color:S.text }}>
                    <span style={{ fontSize:22 }}>{m.emoji}</span>
                    <span style={{ fontSize:10, color:mood===m.value?S.gold:S.muted }}>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Shabad selector */}
            {!selectedShabad?(
              <div style={{ ...cardStyle, border:`1px dashed ${S.gold}44`, textAlign:"center" }}>
                <div style={{ color:S.muted, marginBottom:14, fontSize:13 }}>Choose a Shabad to reflect on:</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginBottom:14 }}>
                  {SHABAD.map((s,i)=>(
                    <button key={i} onClick={()=>setSelectedShabad(s)} style={{ padding:"5px 13px", borderRadius:20, fontSize:11, background:"transparent", border:`1px solid ${S.gold}44`, color:`${S.gold}88`, cursor:"pointer" }}>{s.theme}</button>
                  ))}
                </div>
                <button onClick={()=>setSelectedShabad(dayShabad)} style={{ padding:"8px 20px", borderRadius:20, background:"#C9A84C22", border:`1px solid ${S.gold}66`, color:S.gold, fontSize:12, cursor:"pointer" }}>Use Today's Shabad</button>
              </div>
            ):(
              <div style={{ background:isDark?"linear-gradient(135deg,#1a1208,#0d1a14)":"linear-gradient(135deg,#FDF3E3,#EAF5F0)", border:`1px solid ${S.gold}55`, borderRadius:16, padding:22, marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                  <span style={{ padding:"3px 10px", borderRadius:10, fontSize:11, background:"#C9A84C22", color:S.gold }}>{selectedShabad.theme}</span>
                  <button onClick={()=>setSelectedShabad(null)} style={{ background:"none", border:"none", color:S.muted, cursor:"pointer", fontSize:18, lineHeight:1 }}>×</button>
                </div>
                <div style={{ fontFamily:"'Noto Sans Gurmukhi',sans-serif", fontSize:19, color:S.text, lineHeight:1.75, marginBottom:8 }}>{selectedShabad.gurmukhi}</div>
                <div style={{ color:`${S.gold}88`, fontSize:12, fontStyle:"italic", marginBottom:8 }}>{selectedShabad.transliteration}</div>
                <div style={{ color:S.muted, fontSize:13, lineHeight:1.65, marginBottom:14 }}>{selectedShabad.translation}</div>
                <div style={{ borderTop:`1px solid ${S.gold}22`, paddingTop:14, color:S.teal, fontSize:13, fontStyle:"italic", lineHeight:1.7 }}>💭 {selectedShabad.prompt}</div>
              </div>
            )}

            {/* Journal textarea — loads today's entry if exists */}
            <textarea value={currentEntry} onChange={e=>setCurrentEntry(e.target.value)}
              placeholder="Write freely… This is your sacred space. No judgment, only presence."
              rows={10}
              style={{ width:"100%", padding:18, borderRadius:14, background:isDark?"#0d0d0d":"rgba(253,243,227,0.9)", border:`1px solid ${S.gold}33`, color:S.text, fontSize:14, lineHeight:1.9, fontFamily:"Georgia,serif", outline:"none", marginBottom:14 }}
            />

            <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
              <button onClick={saveEntry} style={btnPrimary}>Save Entry</button>
              <button onClick={()=>setCurrentEntry("")} style={btnGhost}>Clear</button>
              {savedMessage&&<span style={{ color:S.teal, fontSize:13, fontStyle:"italic" }}>✓ Waheguru. Saved.</span>}
            </div>

            {/* Gratitude */}
            <GratitudeSection saved={journalEntries[today]?.gratitudes||[]} onSave={saveGratitudes} />
          </div>
        )}

        {/* ── PRACTICES ── */}
        {screen==="practices"&&(
          <div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, marginBottom:6, color:S.text }}>Daily Practices</h2>
            <p style={{ color:S.muted, fontSize:13, marginBottom:16 }}>Your healing toolkit — rooted in Sikh tradition</p>

            {/* Streak + week */}
            <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap", alignItems:"center" }}>
              {streak>0&&<div style={{ display:"flex", alignItems:"center", gap:6, background:isDark?"#C9A84C11":"rgba(139,94,10,0.08)", border:`1px solid ${S.gold}44`, borderRadius:24, padding:"6px 16px" }}>
                <span style={{ fontSize:16 }}>🔥</span>
                <span style={{ color:S.gold, fontSize:13, fontWeight:600 }}>{streak} day streak</span>
              </div>}
              <span style={{ color:S.muted, fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase" }}>This week:</span>
              {streakDaysLabels.map((d,i)=>(
                <div key={i} style={{ width:28, height:28, borderRadius:6, border:`1px solid ${weekFilled[i]?S.gold:"#333"}`, background:weekFilled[i]?"#C9A84C22":"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:weekFilled[i]?S.gold:S.muted }}>{d}</div>
              ))}
            </div>

            {/* Sub-tabs */}
            <div style={{ display:"flex", gap:0, marginBottom:20, background:isDark?"#0d0d0d":"rgba(245,235,220,0.8)", borderRadius:12, padding:4, border:`1px solid ${S.border}` }}>
              {[{id:"nitnem",label:"☬ Nitnem Banis"},{id:"practices",label:"✦ Other Practices"}].map(t=>(
                <button key={t.id} onClick={()=>setPracticesTab(t.id)} style={{ flex:1, padding:"9px 8px", borderRadius:9, fontSize:13, background:practicesTab===t.id?"#C9A84C22":"transparent", border:practicesTab===t.id?`1px solid ${S.gold}66`:"1px solid transparent", color:practicesTab===t.id?S.gold:S.muted, cursor:"pointer", fontFamily:"Georgia,serif" }}>{t.label}</button>
              ))}
            </div>

            {practicesTab==="nitnem"&&(
              <div>
                <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
                  {[{icon:"🌄",label:"Morning",color:"#C9A84C"},{icon:"🌆",label:"Evening",color:"#4A7BAA"},{icon:"🌙",label:"Night",color:"#7A6FBB"}].map(t=>(
                    <div key={t.icon} style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 12px", borderRadius:20, border:`1px solid ${t.color}44`, background:`${t.color}11` }}>
                      <span style={{ fontSize:13 }}>{t.icon}</span><span style={{ fontSize:11, color:t.color }}>{t.label}</span>
                    </div>
                  ))}
                </div>
                {NITNEM_BANIS.map(bani=>(
                  <NitnemCard key={bani.id} bani={bani} checked={!!nitnemChecked[bani.id]} onToggle={v=>setNitnemChecked(p=>({...p,[bani.id]:v}))} />
                ))}
                <div style={{ marginTop:14, padding:"12px 16px", borderRadius:12, background:S.cardBg, border:`1px solid ${S.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ color:S.muted, fontSize:13 }}>Today's Nitnem</span>
                  <span style={{ color:S.gold, fontSize:15, fontWeight:600 }}>{Object.values(nitnemChecked).filter(Boolean).length} / {NITNEM_BANIS.length} complete</span>
                </div>
              </div>
            )}

            {practicesTab==="practices"&&(
              <div style={{ background:S.cardBg, border:`1px solid ${S.border}`, borderRadius:16, overflow:"hidden" }}>
                {DAILY_PRACTICES.map((p,i)=>(
                  <div key={i} className="practice-row" onClick={()=>setCheckedPractices(prev=>({...prev,[i]:!prev[i]}))} style={{ display:"flex", gap:14, alignItems:"flex-start", padding:"16px 20px", borderBottom:i<DAILY_PRACTICES.length-1?`1px solid ${S.border}`:"none", cursor:"pointer", background:checkedPractices[i]?isDark?"#4A7B6F11":"rgba(45,107,95,0.05)":"transparent", transition:"background 0.15s" }}>
                    <div style={{ width:38, height:38, borderRadius:9, background:"rgba(201,168,76,0.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:18 }}>{p.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:600, color:checkedPractices[i]?S.teal:S.text, marginBottom:4, textDecoration:checkedPractices[i]?"line-through":"none", opacity:checkedPractices[i]?0.7:1 }}>{p.title}</div>
                      <div style={{ fontSize:12, color:S.muted, lineHeight:1.6 }}>{p.desc}</div>
                    </div>
                    <div style={{ width:24, height:24, borderRadius:"50%", border:`1.5px solid ${checkedPractices[i]?S.teal:"#444"}`, background:checkedPractices[i]?S.teal:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:12, color:checkedPractices[i]?"#fff":"transparent", transition:"all 0.2s", marginTop:2 }}>✓</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── REFLECTIONS ── */}
        {screen==="entries"&&(
          <div>
            {viewingEntry?(
              <EntryViewer entry={journalEntries[viewingEntry]} date={viewingEntry} onBack={()=>setViewingEntry(null)} S={S} />
            ):(
              <div>
                <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, marginBottom:6, color:S.text }}>Your Reflections</h2>
                <p style={{ color:S.muted, fontSize:13, marginBottom:20 }}>The record of your journey toward healing</p>

                {/* Calendar */}
                <CalendarView entries={journalEntries} isDark={isDark} />

                {/* Stats row */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:10, marginBottom:20 }}>
                  {[
                    {label:"Total entries",val:Object.keys(journalEntries).length,color:S.gold},
                    {label:"Day streak 🔥",val:streak,color:"#E8A838"},
                    {label:"This month",val:Object.keys(journalEntries).filter(d=>d.startsWith(new Date().toISOString().slice(0,7))).length,color:S.teal},
                  ].map((s,i)=>(
                    <div key={i} style={{ background:isDark?"#1a120866":"rgba(245,235,220,0.7)", borderRadius:12, padding:"12px 16px", textAlign:"center", border:`1px solid ${S.border}` }}>
                      <div style={{ fontSize:22, fontWeight:700, color:s.color }}>{s.val}</div>
                      <div style={{ fontSize:11, color:S.muted, marginTop:2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Filters */}
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
                  <select value={filterMonth} onChange={e=>setFilterMonth(e.target.value)} style={{ padding:"6px 12px", borderRadius:20, background:isDark?"#1a1208":"#F5EBD8", border:`1px solid ${S.border}`, color:S.muted, fontSize:12, cursor:"pointer", outline:"none" }}>
                    <option value="">All months</option>
                    {availableMonths.map(m=><option key={m} value={m}>{new Date(m+"-01").toLocaleDateString("en-CA",{month:"long",year:"numeric"})}</option>)}
                  </select>
                  <select value={filterTheme} onChange={e=>setFilterTheme(e.target.value)} style={{ padding:"6px 12px", borderRadius:20, background:isDark?"#1a1208":"#F5EBD8", border:`1px solid ${S.border}`, color:S.muted, fontSize:12, cursor:"pointer", outline:"none" }}>
                    <option value="">All themes</option>
                    {HEALING_THEMES.map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                  <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search entries…"
                    style={{ padding:"6px 14px", borderRadius:20, background:isDark?"#1a1208":"#F5EBD8", border:`1px solid ${S.border}`, color:S.text, fontSize:12, outline:"none", minWidth:140 }} />
                </div>

                {filteredEntries.length===0?(
                  <div style={{ textAlign:"center", padding:"48px 20px", color:S.muted }}>
                    <div style={{ fontSize:36, marginBottom:14 }}>✍️</div>
                    <p style={{ fontStyle:"italic", lineHeight:1.8, fontSize:14 }}>No entries found.<br/>Begin with a single honest word.</p>
                    <button onClick={()=>setScreen("journal")} style={{ ...btnPrimary, marginTop:20 }}>Open Journal →</button>
                  </div>
                ):(
                  filteredEntries.map(([date,entry])=>{
                    const moodObj=MOODS.find(m=>m.value===entry.mood);
                    const fmtDate=new Date(date+"T12:00:00").toLocaleDateString("en-CA",{weekday:"short",month:"short",day:"numeric",year:"numeric"});
                    return (
                      <div key={date} className="hov-card" onClick={()=>setViewingEntry(date)} style={{ ...cardStyle, cursor:"pointer" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10, flexWrap:"wrap", gap:6 }}>
                          <span style={{ color:S.gold, fontSize:12, letterSpacing:"0.08em" }}>{fmtDate}</span>
                          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                            {entry.theme&&<span style={{ padding:"2px 10px", borderRadius:10, fontSize:10, background:"#C9A84C22", color:S.gold }}>{entry.theme}</span>}
                            {moodObj&&<span style={{ fontSize:14 }} title={moodObj.label}>{moodObj.emoji}</span>}
                          </div>
                        </div>
                        {entry.shabad&&<div style={{ fontFamily:"'Noto Sans Gurmukhi',sans-serif", fontSize:13, color:`${S.text}77`, lineHeight:1.6, marginBottom:8, borderLeft:`2px solid ${S.gold}44`, paddingLeft:10 }}>{entry.shabad.gurmukhi}</div>}
                        {entry.text&&<p style={{ color:S.muted, fontSize:13, lineHeight:1.7, marginBottom:entry.gratitudes?10:0 }}>{entry.text.length>180?entry.text.slice(0,180)+"…":entry.text}</p>}
                        {entry.gratitudes&&entry.gratitudes.length>0&&(
                          <div style={{ borderTop:`1px solid ${S.border}`, paddingTop:10, marginTop:6 }}>
                            <span style={{ color:S.teal, fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase" }}>🌸 {entry.gratitudes.length} gratitudes saved</span>
                          </div>
                        )}
                        <div style={{ marginTop:10, color:isDark?"#444":"#b89060", fontSize:11 }}>Tap to read full entry →</div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
