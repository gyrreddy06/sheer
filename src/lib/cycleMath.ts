import { CyclePhase, CyclePrediction, FlowIntensity, PeriodLog, RedFlagAlert, SymptomLog } from '../types';

/**
 * Format a Date object to YYYY-MM-DD local string
 */
export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Format a Date or date string to a human friendly format e.g. "Nov 25"
 */
export function formatFriendlyDate(dateStrOrObj: string | Date, locale: string = 'en'): string {
  const d = typeof dateStrOrObj === 'string' ? new Date(dateStrOrObj + 'T00:00:00') : dateStrOrObj;
  try {
    return new Intl.DateTimeFormat(locale === 'te' ? 'te-IN' : 'en-IN', {
      month: 'short',
      day: 'numeric'
    }).format(d);
  } catch {
    return d.toDateString();
  }
}

/**
 * Add or subtract days from a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Difference in days between two dates (b - a)
 */
export function diffDays(dateA: Date, dateB: Date): number {
  const utc1 = Date.UTC(dateA.getFullYear(), dateA.getMonth(), dateA.getDate());
  const utc2 = Date.UTC(dateB.getFullYear(), dateB.getMonth(), dateB.getDate());
  return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
}

/**
 * Calculate cycle prediction range and current phase
 * Strict rule: NEVER return a single precise date. Always a range.
 */
export function calculateCyclePrediction(
  lastPeriodStartDate: string,
  cycleLength: number = 28,
  periodDuration: number = 5,
  isIrregular: boolean = false,
  todayDate: Date = new Date()
): CyclePrediction {
  const lastStart = new Date(lastPeriodStartDate + 'T00:00:00');
  const daysSinceStart = diffDays(lastStart, todayDate);
  const cycleDay = Math.max(1, (daysSinceStart % cycleLength) + 1);

  // Estimated next period central date
  const cyclesPassed = Math.floor(daysSinceStart / cycleLength) + 1;
  const centralNextDate = addDays(lastStart, cyclesPassed * cycleLength);

  // Range window (narrow for regular, wide for irregular)
  const rangeMargin = isIrregular ? 4 : 2;
  const rangeStart = addDays(centralNextDate, -rangeMargin);
  const rangeEnd = addDays(centralNextDate, rangeMargin + 1);

  // Estimated Ovulation window (roughly 14 days prior to next period)
  const centralOvulationDate = addDays(centralNextDate, -14);
  const ovulationStart = addDays(centralOvulationDate, -2);
  const ovulationEnd = addDays(centralOvulationDate, 2);

  // Determine current phase
  let phase: CyclePhase = 'follicular';
  let phaseName = 'Follicular Phase';
  let phaseDescription = 'Rising estrogen levels often bring renewed focus, energy, and mental clarity.';

  const ovulationDayInCycle = Math.max(12, cycleLength - 14);

  if (cycleDay <= periodDuration) {
    phase = 'menstrual';
    phaseName = 'Menstrual Phase';
    phaseDescription = 'Your body is gently shedding the uterine lining. Rest and restorative nourishing foods are ideal.';
  } else if (cycleDay < ovulationDayInCycle - 2) {
    phase = 'follicular';
    phaseName = 'Follicular Phase';
    phaseDescription = 'Energy and confidence naturally begin lifting as follicles mature.';
  } else if (cycleDay <= ovulationDayInCycle + 2) {
    phase = 'ovulatory';
    phaseName = 'Ovulation Window (Estimate)';
    phaseDescription = 'Estrogen peaks around the release of an egg. Energy and social openness are often highest.';
  } else {
    phase = 'luteal';
    phaseName = 'Luteal Phase';
    phaseDescription = 'Progesterone takes center stage. Prioritize calm routines and supportive nutrition as your cycle winds down.';
  }

  const confidenceText = isIrregular 
    ? 'Estimate shown with a wider range due to natural cycle variations.'
    : 'Based on your logged regular rhythm.';

  return {
    cycleDay,
    phase,
    phaseName,
    phaseDescription,
    expectedPeriodStartRange: {
      start: formatDateISO(rangeStart),
      end: formatDateISO(rangeEnd)
    },
    ovulationWindowEstimate: {
      start: formatDateISO(ovulationStart),
      end: formatDateISO(ovulationEnd)
    },
    confidenceText,
    disclaimer: 'This is an estimate for tracking, not medical advice or contraception.'
  };
}

/**
 * Red Flag Detection Algorithm
 * Evaluates symptoms, flow intensity, and pain metrics
 */
export function evaluateRedFlags(
  periodLogs: PeriodLog[],
  symptomLogs: SymptomLog[],
  todayStr: string = formatDateISO(new Date())
): RedFlagAlert | null {
  // Check for very heavy bleeding today or recently
  const recentFlowLogs = periodLogs.filter(p => p.log_date === todayStr);
  const hasVeryHeavyFlow = recentFlowLogs.some(p => p.flow_intensity === 'very_heavy');

  if (hasVeryHeavyFlow) {
    return {
      type: 'heavy_bleeding',
      title: 'Very Heavy Bleeding Alert',
      message: 'You recorded very heavy flow. If you are soaking through 1 or more pads every 1–2 hours for consecutive hours, passing large blood clots (size of a coin or larger), or feel weak/dizzy, please seek medical evaluation.',
      action: 'Contact a healthcare professional or visit an emergency room.',
      urgency: 'high',
      helplines: [
        { name: 'Telangana Emergency Services', number: '108 / 112', description: 'Immediate medical ambulance and emergency triage' },
        { name: 'Women Helpline (India)', number: '181', description: '24/7 dedicated support for women' }
      ]
    };
  }

  // Check for severe pain (intensity >= 8/10) today
  const recentSymptoms = symptomLogs.filter(s => s.log_date === todayStr);
  const severePainLog = recentSymptoms.find(s => s.intensity >= 8 && (s.symptom_code === 'cramps' || s.symptom_code === 'headache' || s.symptom_code === 'backache'));

  if (severePainLog) {
    return {
      type: 'severe_pain',
      title: 'Severe Pain Detected (8+ / 10)',
      message: 'You recorded pain severity at a level that can significantly disrupt daily life. Severe pelvic or abdominal pain that does not ease with rest or standard remedies warrants prompt medical evaluation.',
      action: 'Consult your trusted physician or visit a nearby clinic.',
      urgency: 'high',
      helplines: [
        { name: 'Telangana Health Help & Emergency', number: '108 / 104', description: 'State medical advisory & ambulance' },
        { name: 'National Emergency', number: '112', description: 'All-in-one emergency service' }
      ]
    };
  }

  return null;
}

/**
 * Calculate statistical cycle variability and averages
 */
export function calculateCycleStatistics(cycleLengths: number[]): {
  averageLength: number;
  min: number;
  max: number;
  variability: number;
  isRegular: boolean;
  explanation: string;
} {
  if (cycleLengths.length === 0) {
    return {
      averageLength: 28,
      min: 28,
      max: 28,
      variability: 0,
      isRegular: true,
      explanation: 'Log at least 2 full cycles to calculate your personalized average.'
    };
  }

  const sum = cycleLengths.reduce((acc, val) => acc + val, 0);
  const averageLength = Math.round(sum / cycleLengths.length);
  const min = Math.min(...cycleLengths);
  const max = Math.max(...cycleLengths);
  const variability = max - min;
  const isRegular = variability <= 4;

  const explanation = isRegular
    ? `Your cycles typically span between ${min} and ${max} days (averaging ${averageLength} days), which reflects a consistent rhythm.`
    : `Your cycle has varied by about ${variability} days between ${min} and ${max} days. This is a common pattern worth discussing gently with your gynecologist.`;

  return {
    averageLength,
    min,
    max,
    variability,
    isRegular,
    explanation
  };
}
