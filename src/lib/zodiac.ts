export function getZodiacSign(date: Date): { name: string; emoji: string } {
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

export function getChineseZodiac(year: number) {
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