import { useState, useMemo, useEffect } from "react";
import confetti from "canvas-confetti";
import { Panel } from "@/components/layout";
import StatBox from "@/components/ui/StatBox";
import { getZodiacSign, getChineseZodiac } from "@/lib/zodiac";
import { countLeapDays, isLeapYear } from "@/lib/date";
import { DateInput } from "@/components/ui/DateInput";
import { Label } from "@/components/ui";

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

/* ================= COMPONENT ================= */

export default function AgeCalculatorTool() {
  const today = new Date().toISOString().split("T")[0];
  const [birthDate, setBirthDate] = useState("1999-08-16");
  const [toDate, setToDate] = useState(today);
  const [liveNow, setLiveNow] = useState(new Date());
  const [countdown, setCountdown] = useState("");

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
    const years = Math.floor(seconds / (60 * 60 * 24 * 365));
    const months = Math.floor((seconds % (60 * 60 * 24 * 365)) / (60 * 60 * 24 * 30));
    const days = Math.floor((seconds % (60 * 60 * 24 * 30)) / (60 * 60 * 24));
    const hhours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
    const mminutes = Math.floor((seconds % (60 * 60)) / 60);
    const ssecs = seconds % 60;

    return `${years} years, ${months} months, ${days} days, ${hhours} hours, ${mminutes} minutes, ${ssecs} seconds`;
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
    <div className="space-y-2">
      <Panel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <DateInput
              label="Date of Birth"
              max={toDate}
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              showNow={true}
            />

          </div>
          <div className="flex flex-col gap-1.5">
            <DateInput
              label="Calculate To"
              min={birthDate}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
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
                <Label className="text-xs text-(--text-tertiary) tabular-nums">
                  <span className="font-emoji">🕒</span> Live age: {liveAge}
                </Label>
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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <StatBox label="Born On" value={result.dayOfWeek} />
            <StatBox label="Next Birthday" value={result.nextBirthdayText} tooltip={`Next birthday in\n${countdown}`} />
            <StatBox label={`${result.zodiac.name}`} value={result.zodiac.emoji} tooltip="Zodiac Sign" url={`https://www.zodiacsign.com/zodiac-signs/${result.zodiac.name.toLowerCase()}/`} />
            <StatBox label={`Year of the ${chineseInfo?.name}`} value={`${chineseInfo?.emoji}`} tooltip={`Chinese Zodiac\n${chineseInfo?.traits}`} url={`https://chinesenewyear.net/zodiac/${chineseInfo?.name.toLowerCase()}/`} />
          </div>

          {/* Fun cosmic stats */}
          <div>
            <Label>
              Your Life, By The Numbers <span className="font-emoji">✨</span>
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              <StatBox
                label="Heartbeats"
                value={funStats.heartbeats}
                tooltip="Based on average resting heart rate of 60 beats per minute (bpm) for adults."
                url="https://www.heart.org/en/health-topics/high-blood-pressure/the-facts-about-high-blood-pressure/all-about-heart-rate-pulse"
              />
              <StatBox
                label="Breaths Taken"
                value={funStats.breaths}
                tooltip="Based on the average adult respiratory rate of 16 breaths per minute."
                url="https://my.clevelandclinic.org/health/articles/10881-vital-signs"
              />
              <StatBox
                label="Hours Slept"
                value={funStats.sleepHours}
                tooltip="Based on the recommended 8 hours of sleep per night for adults (National Sleep Foundation)."
                url="https://www.sleepfoundation.org/how-much-sleep-do-you-need"
              />
              <StatBox
                label="Full Moons"
                value={funStats.fullMoons}
                tooltip="Based on the average lunar cycle of 29.53 days."
                url="https://www.timeanddate.com/moon/phases/"
              />
              <StatBox
                label="Distance Traveled"
                value={funStats.distanceKm}
                tooltip="Based on the average human walking speed of 5 km/h."
                url="https://www.worldometers.info/walking/"
              />
              <StatBox
                label="Revolutions"
                value={funStats.revolutions}
                tooltip="Based on the average human walking speed of 5 km/h."
                url="https://www.worldometers.info/walking/"
              />
              <StatBox
                label="Blinks"
                value={funStats.blinks}
                tooltip="Based on the average human walking speed of 5 km/h."
                url="https://www.worldometers.info/walking/"
              />
              <StatBox
                label="Calories"
                value={funStats.calories}
                tooltip="Based on the average human walking speed of 5 km/h."
                url="https://www.worldometers.info/walking/"
              />
              <StatBox
                label="Leap Days"
                value={funStats.leapDays}
                tooltip="Based on the average human walking speed of 5 km/h."
                url="https://www.worldometers.info/walking/"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}