/**
 * Celestial Oracle - Numerology Calculation Engine
 * Based on 27x27 Matrix system
 */

export interface MatrixPosition {
  position: number;
  arcana: number;
  sphere: 'personality' | 'spirituality' | 'money' | 'relationships' | 'health' | null;
}

export interface NumerologyResult {
  matrix: MatrixPosition[];
  spheres: {
    personality: number[];
    spirituality: number[];
    money: number[];
    relationships: number[];
    health: number[];
  };
  fatalMistake: number;
  chakras: number[];
  soulCode: number[];
}

// Sphere mappings from source
const SPHERE_MAP: Record<number, 'personality' | 'spirituality' | 'money' | 'relationships' | 'health'> = {
  5: 'personality', 22: 'personality', 7: 'personality', 19: 'personality',
  8: 'personality', 12: 'personality', 28: 'personality', 29: 'personality',
  1: 'spirituality', 18: 'spirituality', 17: 'spirituality', 9: 'spirituality',
  30: 'spirituality', 31: 'spirituality',
  2: 'money', 11: 'money', 27: 'money', 14: 'money', 32: 'money', 33: 'money',
  3: 'relationships', 26: 'relationships', 25: 'relationships', 16: 'relationships',
  34: 'relationships', 35: 'relationships',
  4: 'health', 24: 'health', 23: 'health', 15: 'health', 36: 'health', 37: 'health'
};

const CHAKRA_POSITIONS = [5, 7, 8, 9, 10, 11, 2];
const FATAL_MISTAKE = 21;

function calculatePosition(day: number, month: number, year: number, pos: number): number {
  const base = day + month + year + pos;
  return reduceToBaseNumber(base);
}

function reduceToBaseNumber(n: number): number {
  while (n > 22) {
    const digits = n.toString().split('').map(Number);
    n = digits.reduce((a, b) => a + b, 0);
  }
  return n === 0 ? 22 : n;
}

export function calculateMatrix(date: Date): NumerologyResult {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const yearSum = reduceToBaseNumber(
    year.toString().split('').map(Number).reduce((a, b) => a + b, 0)
  );

  const matrix: MatrixPosition[] = [];
  const soulCode: number[] = [];

  for (let pos = 1; pos <= 37; pos++) {
    const arcana = calculatePosition(day, month, yearSum, pos);
    const sphere = SPHERE_MAP[pos] || null;

    matrix.push({ position: pos, arcana, sphere });

    if (pos <= 22 && !soulCode.includes(arcana)) {
      soulCode.push(arcana);
    }
  }

  const spheres = {
    personality: matrix.filter(p => p.sphere === 'personality').map(p => p.arcana),
    spirituality: matrix.filter(p => p.sphere === 'spirituality').map(p => p.arcana),
    money: matrix.filter(p => p.sphere === 'money').map(p => p.arcana),
    relationships: matrix.filter(p => p.sphere === 'relationships').map(p => p.arcana),
    health: matrix.filter(p => p.sphere === 'health').map(p => p.arcana)
  };

  const chakras = CHAKRA_POSITIONS.map(pos =>
    matrix.find(m => m.position === pos)?.arcana || 0
  );

  return {
    matrix: matrix.slice(0, 27),
    spheres,
    fatalMistake: matrix.find(m => m.position === FATAL_MISTAKE)?.arcana || 0,
    chakras,
    soulCode
  };
}

export function getArcanaWithPrevious(arcana: number): { arcana: number; previous: number | null } {
  const previousMap: Record<number, number> = {
    10: 1, 11: 2, 12: 3, 13: 4, 14: 5, 15: 6, 16: 7, 17: 8,
    18: 9, 19: 1, 20: 2, 21: 3, 22: 4, 23: 5, 24: 6, 25: 7,
    26: 8, 27: 9, 28: 10, 29: 11
  };

  return {
    arcana,
    previous: previousMap[arcana] || null
  };
}
