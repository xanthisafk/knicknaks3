import { useState, useMemo, useEffect } from "react";
import confetti from "canvas-confetti";
import { Panel } from "@/components/layout";
import InfoToolTip from "@/components/advanced/InfoTooltip";
import StatBox from "@/components/ui/StatBox";

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalHours: number;
  nextBirthdayDate: Date;
  nextBirthdayText: string;
  dayOfWeek: string;
  zodiac: { name: string; emoji: string };
  chineseZodiac: string;
}

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getZodiacSign(date: Date): { name: string; emoji: string } {
  const d = date.getDate();
  const m = date.getMonth() + 1;

  if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return { name: "Aries", emoji: "♈" };
  if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return { name: "Taurus", emoji: "♉" };
  if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return { name: "Gemini", emoji: "♊" };
  if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return { name: "Cancer", emoji: "♋" };
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return { name: "Leo", emoji: "♌" };
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return { name: "Virgo", emoji: "♍" };
  if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return { name: "Libra", emoji: "♎" };
  if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return { name: "Scorpio", emoji: "♏" };
  if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return { name: "Sagittarius", emoji: "♐" };
  if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return { name: "Capricorn", emoji: "♑" };
  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return { name: "Aquarius", emoji: "♒" };

  return { name: "Pisces", emoji: "♓" };
}

function getChineseZodiac(year: number) {
  const animals = [
    { name: "Rat", emoji: "🐀", traits: "Clever & resourceful", },
    { name: "Ox", emoji: "🐂", traits: "Diligent & dependable" },
    { name: "Tiger", emoji: "🐅", traits: "Brave & unpredictable" },
    { name: "Rabbit", emoji: "🐇", traits: "Gentle & elegant" },
    { name: "Dragon", emoji: "🐉", traits: "Confident & intelligent" },
    { name: "Snake", emoji: "🐍", traits: "Enigmatic & wise" },
    { name: "Horse", emoji: "🐎", traits: "Animated & active" },
    { name: "Goat", emoji: "🐐", traits: "Calm & gentle" },
    { name: "Monkey", emoji: "🐒", traits: "Quick-witted & curious" },
    { name: "Rooster", emoji: "🐓", traits: "Observant & confident" },
    { name: "Dog", emoji: "🐕", traits: "Loyal & honest" },
    { name: "Pig", emoji: "🐖", traits: "Compassionate & generous" },
  ];
  const idx = (year - 1900) % 12;
  return animals[((idx % 12) + 12) % 12];
}

function countLeapDays(birthDate: Date, toDate: Date): number {
  let count = 0;
  for (let y = birthDate.getFullYear(); y <= toDate.getFullYear(); y++) {
    if (isLeapYear(y)) {
      const leapDay = new Date(y, 1, 29);
      if (leapDay >= birthDate && leapDay <= toDate) count++;
    }
  }
  return count;
}

function calculateAge(birthDate: Date, toDate: Date): AgeResult {
  const from = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  const to = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());

  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) { years--; months += 12; }

  const totalMs = to.getTime() - from.getTime();
  const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;
  const totalHours = Math.floor(totalMs / (1000 * 60 * 60));

  const today = new Date();
  const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let nextBday = new Date(todayNormalized.getFullYear(), birthDate.getMonth(), birthDate.getDate());

  if (birthDate.getMonth() === 1 && birthDate.getDate() === 29 && !isLeapYear(todayNormalized.getFullYear())) {
    nextBday = new Date(todayNormalized.getFullYear(), 1, 28);
  }
  if (nextBday < todayNormalized) nextBday.setFullYear(nextBday.getFullYear() + 1);

  const diffMs = nextBday.getTime() - todayNormalized.getTime();
  const daysUntilBirthday = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const nextBirthdayText = daysUntilBirthday === 0 ? "🎉 Happy Birthday!" : `${daysUntilBirthday} day${daysUntilBirthday > 1 ? "s" : ""} away`;

  const chinese = getChineseZodiac(birthDate.getFullYear());

  return {
    years, months, days, totalDays, totalWeeks, totalMonths, totalHours,
    nextBirthdayDate: nextBday,
    nextBirthdayText,
    dayOfWeek: birthDate.toLocaleDateString("en-US", { weekday: "long" }),
    zodiac: getZodiacSign(birthDate),
    chineseZodiac: `${chinese.emoji} ${chinese.name}`,
  };
}

/* ---------------- FUN STAT CARD ---------------- */
function FunStat({
  emoji,
  label,
  value,
  subLabel,
  infoText,
  infoUrl,
  highlight,
}: {
  emoji: string;
  label: string;
  value: string;
  subLabel?: string;
  infoText: string;
  infoUrl?: string;
  highlight?: boolean;
}) {
  highlight = false;
  return (
    <div
      className="flex flex-col gap-2 p-4 rounded-2xl"
      style={
        highlight
          ? {
            background: "var(--color-primary-500)",
            color: "white",
          }
          : {
            background: "var(--surface-secondary)",
            border: "1px solid var(--border-default)",
            color: "inherit",
          }
      }
    >
      <div className="flex items-center gap-2">
        <span className="text-lg leading-none hover:animate-pulse cursor-default">{emoji}</span>
        <span
          className="text-[10px] font-semibold tracking-widest uppercase"
          style={{ color: highlight ? "rgba(255,255,255,0.65)" : "var(--text-tertiary)" }}
        >
          {label}
        </span>
        <span className="ml-auto">
          <InfoToolTip text={infoText} url={infoUrl} />
        </span>
      </div>

      <span
        className="text-2xl font-bold tabular-nums leading-none"
        style={{ color: highlight ? "white" : "var(--color-primary-500)" }}
      >
        {value}
      </span>

      {subLabel && (
        <span
          className="text-[10px] leading-snug"
          style={{ color: highlight ? "rgba(255,255,255,0.5)" : "var(--text-tertiary)" }}
        >
          {subLabel}
        </span>
      )}
    </div>
  );
}

/* ================= COMPONENT ================= */

export default function AgeCalculatorTool() {
  const today = new Date().toISOString().split("T")[0];
  const [birthDate, setBirthDate] = useState("1999-10-24");
  const [toDate, setToDate] = useState(today);
  const [liveNow, setLiveNow] = useState(new Date());
  const [countdown, setCountdown] = useState("");
  const [zodiacMode, setZodiacMode] = useState<"western" | "chinese">("western");

  useEffect(() => {
    const interval = setInterval(() => setLiveNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const result = useMemo(() => {
    if (!birthDate || !toDate) return null;
    const from = new Date(birthDate);
    const to = new Date(toDate);
    if (isNaN(from.getTime()) || isNaN(to.getTime()) || from > to) return null;
    return calculateAge(from, to);
  }, [birthDate, toDate]);

  const liveAge = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const diff = liveNow.getTime() - birth.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours.toLocaleString()} hrs ${minutes % 60} min ${seconds % 60} sec`;
  }, [birthDate, liveNow]);

  useEffect(() => {
    if (!result) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = result.nextBirthdayDate.getTime() - now;
      if (distance <= 0) {
        setCountdown("🎉 It's your birthday!");
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
        clearInterval(interval);
        return;
      }
      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const m = Math.floor((distance / 1000 / 60) % 60);
      const s = Math.floor((distance / 1000) % 60);
      setCountdown(`${d}d ${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [result]);

  const funStats = useMemo(() => {
    if (!result) return null;
    const { totalDays } = result;
    const birthDateObj = new Date(birthDate);
    const toDateObj = new Date(toDate);
    const heartbeats = Math.floor(totalDays * 24 * 60 * 60 * 60);
    const breaths = Math.floor(totalDays * 24 * 60 * 16);
    const sleepHours = Math.floor(totalDays * 8);
    const fullMoons = Math.floor(totalDays / 29.53);
    const totalHoursAlive = totalDays * 24;
    const distanceKm = Math.floor(totalHoursAlive * 107226);
    const revolutions = (totalDays / 365.25).toFixed(2);
    const blinks = Math.floor(totalDays * 16 * 60 * 17);
    const calories = Math.floor(totalDays * 1800);
    const leapDays = countLeapDays(birthDateObj, toDateObj);
    const fmt = (n: number) => n.toLocaleString();
    return { heartbeats: fmt(heartbeats), breaths: fmt(breaths), sleepHours: fmt(sleepHours), fullMoons, distanceKm: fmt(distanceKm), revolutions, blinks: fmt(blinks), calories: fmt(calories), leapDays };
  }, [result, birthDate, toDate]);

  const chineseInfo = useMemo(() => {
    if (!birthDate) return null;
    return getChineseZodiac(new Date(birthDate).getFullYear());
  }, [birthDate]);

  return (
    <div className="space-y-6">
      <Panel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text(--text-primary)">Date of Birth</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={toDate}
              className="px-3 py-2 rounded-xl bg-(--surface-elevated) border border-(--border-default) text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text(--text-primary)">Calculate to</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-3 py-2 rounded-xl bg-(--surface-elevated) border border-(--border-default) text-sm"
            />
          </div>
        </div>
      </Panel>

      {result && funStats && (
        <>
          {/* Main age display */}
          <Panel>
            <div className="text-center py-4 space-y-3">
              <p className="text-4xl md:text-5xl font-bold">
                <span className="text-primary-500">{result.years}</span>{" "}
                years{" "}
                <span className="text-primary-500">{result.months}</span>{" "}
                months{" "}
                <span className="text-primary-500">{result.days}</span>{" "}
                days
              </p>

              {liveAge && (
                <p className="text-xs text-(--text-tertiary) tabular-nums">⏱ Live age: {liveAge}</p>
              )}
            </div>
          </Panel>

          {/* Core stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatBox label="Total Days" value={result.totalDays} />
            <StatBox label="Total Weeks" value={result.totalWeeks} />
            <StatBox label="Total Months" value={result.totalMonths} />
            <StatBox label="Total Hours" value={result.totalHours} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatBox label="Born On" value={result.dayOfWeek} />
            <StatBox label="Next Birthday" value={result.nextBirthdayText} tooltip={`Next birthday in\n${countdown}`} />
            <StatBox label={`${result.zodiac.name}`} value={result.zodiac.emoji} tooltip="Zodiac Sign" url={`https://www.zodiacsign.com/zodiac-signs/${result.zodiac.name.toLowerCase()}/`} />
            <StatBox label={`Year of the ${chineseInfo?.name}`} value={`${chineseInfo?.emoji}`} tooltip={`Chinese Zodiac\n${chineseInfo?.traits}`} url={`https://chinesenewyear.net/zodiac/${chineseInfo?.name.toLowerCase()}/`} />
          </div>

          {/* Fun cosmic stats */}
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-(--text-tertiary) mb-3">
              🌌 Your Life, By The Numbers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <FunStat
                emoji="❤️"
                label="Heartbeats"
                value={funStats.heartbeats}
                subLabel="~60 beats per minute"
                infoText="Based on average resting heart rate of 60 beats per minute (bpm) for adults."
                infoUrl="https://www.heart.org/en/health-topics/high-blood-pressure/the-facts-about-high-blood-pressure/all-about-heart-rate-pulse"
                highlight
              />
              <FunStat
                emoji="💨"
                label="Breaths Taken"
                value={funStats.breaths}
                subLabel="~16 breaths per minute"
                infoText="Based on the average adult respiratory rate of 16 breaths per minute."
                infoUrl="https://my.clevelandclinic.org/health/articles/10881-vital-signs"
              />
              <FunStat
                emoji="😴"
                label="Hours Slept"
                value={funStats.sleepHours}
                subLabel="Assuming 8 hrs/night"
                infoText="Based on the recommended 8 hours of sleep per night for adults (National Sleep Foundation)."
                infoUrl="https://www.sleepfoundation.org/how-sleep-works/how-much-sleep-do-we-really-need"
              />
              <FunStat
                emoji="🌕"
                label="Full Moons Witnessed"
                value={funStats.fullMoons.toString()}
                subLabel="Lunar cycle ≈ 29.53 days"
                infoText="One full lunar cycle (new moon to new moon) is approximately 29.53 days, known as a synodic month."
                infoUrl="https://science.nasa.gov/moon/moon-phases/"
              />
              <FunStat
                emoji="🚀"
                label="km Through Space"
                value={funStats.distanceKm}
                subLabel="Earth's orbital speed ~107,226 km/h"
                infoText="Earth travels at approximately 107,226 km/h (66,627 mph) in its orbit around the Sun, per NASA."
                infoUrl="https://en.wikipedia.org/wiki/Earth's_orbit"
                highlight
              />
              <FunStat
                emoji="🌍"
                label="Orbits Around the Sun"
                value={funStats.revolutions}
                subLabel="One orbit = 365.25 days"
                infoText="Earth completes one revolution around the Sun in approximately 365.25 days (one sidereal year), per NASA."
                infoUrl="https://en.wikipedia.org/wiki/Earth's_orbit"
              />
              <FunStat
                emoji="👁️"
                label="Times You've Blinked"
                value={funStats.blinks}
                subLabel="~17 blinks/min while awake"
                infoText="The average person blinks about 15-20 times per minute. We use ~17 blinks/min x 16 waking hours/day."
                infoUrl="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4043155/"
              />
              <FunStat
                emoji="🔥"
                label="Calories Burned (BMR)"
                value={funStats.calories}
                subLabel="~1,800 kcal/day just existing"
                infoText="The average adult basal metabolic rate (BMR) — calories burned just staying alive — is roughly 1,600-2,000 kcal/day."
                infoUrl="https://www.betterhealth.vic.gov.au/health/conditionsandtreatments/metabolism"
              />
              <FunStat
                emoji="🗓️"
                label="Leap Days Survived"
                value={funStats.leapDays.toString()}
                subLabel="Feb 29 only comes every 4 years!"
                infoText="A leap year occurs every 4 years (with exceptions for century years), adding an extra day to February. You've lived through this many of them!"
                infoUrl="https://spaceplace.nasa.gov/leap-year/en/"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}