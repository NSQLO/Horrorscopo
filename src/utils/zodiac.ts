export const getZodiacSign = (month: number, day: number): string => {
  // Logic based on Italian signs in the JSON
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Ariete";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Toro";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemelli";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancro";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leone";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Vergine";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Bilancia";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpione";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittario";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorno";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Acquario";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pesci";
  return "";
};

export const getMonthNameItalian = (monthIndex: number): string => {
  const months = [
    "GENNAIO", "FEBBRAIO", "MARZO", "APRILE", "MAGGIO", "GIUGNO",
    "LUGLIO", "AGOSTO", "SETTEMBRE", "OTTOBRE", "NOVEMBRE", "DICEMBRE"
  ];
  return months[monthIndex];
};

export const getProvocation = (sign: string): string => {
  const provocations = [
    "Bel colpo.",
    "Si intuiva dal carattere.",
    `Una carriera inevitabile per chi è del ${sign}.`
  ];
  return provocations[Math.floor(Math.random() * provocations.length)];
};
