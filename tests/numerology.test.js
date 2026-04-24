/**
 * Numerology Engine Tests
 * Run: node tests/numerology.test.js
 */

import { calculateMatrix, getArcanaWithPrevious } from '../shared/numerology.js';

console.log('🧪 Celestial Oracle - Numerology Engine Tests\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`❌ ${name}`);
    console.log(`   ${e.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// Test 1: Basic matrix calculation
test('Calculate matrix for known date (15.08.1990)', () => {
  const date = new Date(1990, 7, 15);
  const result = calculateMatrix(date);

  assert(result.matrix.length === 27, 'Matrix should have 27 positions');
  assert(result.matrix[0].position === 1, 'First position should be 1');
  assert(result.soulCode.length > 0, 'Soul code should not be empty');
  assert(result.soulCode.length <= 22, 'Soul code max 22 unique arcana');
});

// Test 2: Sphere mappings
test('All positions mapped to correct spheres', () => {
  const date = new Date(1990, 0, 1);
  const result = calculateMatrix(date);

  const personalityCount = result.spheres.personality.length;
  const spiritualityCount = result.spheres.spirituality.length;
  const moneyCount = result.spheres.money.length;
  const relationshipsCount = result.spheres.relationships.length;
  const healthCount = result.spheres.health.length;

  assert(personalityCount === 8, `Personality sphere should have 8 positions, got ${personalityCount}`);
  assert(spiritualityCount === 6, `Spirituality sphere should have 6 positions, got ${spiritualityCount}`);
  assert(moneyCount === 6, `Money sphere should have 6 positions, got ${moneyCount}`);
  assert(relationshipsCount === 6, `Relationships sphere should have 6 positions, got ${relationshipsCount}`);
  assert(healthCount === 6, `Health sphere should have 6 positions, got ${healthCount}`);
});

// Test 3: Fatal mistake calculation
test('Fatal mistake (position 21) is calculated', () => {
  const date = new Date(1990, 0, 1);
  const result = calculateMatrix(date);

  assert(result.fatalMistake > 0, 'Fatal mistake should be > 0');
  assert(result.fatalMistake <= 22, `Fatal mistake should be <= 22, got ${result.fatalMistake}`);
});

// Test 4: Chakra calculation (7 chakras)
test('Chakras array has 7 values', () => {
  const date = new Date(1990, 0, 1);
  const result = calculateMatrix(date);

  assert(result.chakras.length === 7, `Should have 7 chakras, got ${result.chakras.length}`);
  result.chakras.forEach((chakra, i) => {
    assert(chakra > 0 && chakra <= 22, `Chakra ${i} should be 1-22, got ${chakra}`);
  });
});

// Test 5: Soul code has unique arcana
test('Soul code contains only unique arcana', () => {
  const date = new Date(1990, 5, 15);
  const result = calculateMatrix(date);

  const unique = new Set(result.soulCode);
  assert(unique.size === result.soulCode.length, 'Soul code should have unique arcana');
});

// Test 6: Arcana values are always valid
test('All arcana values are in range 1-22', () => {
  const testDates = [
    new Date(1990, 0, 1),
    new Date(2000, 11, 31),
    new Date(1985, 5, 15),
    new Date(2023, 2, 7)
  ];

  testDates.forEach(date => {
    const result = calculateMatrix(date);
    result.matrix.forEach(pos => {
      assert(pos.arcana >= 1 && pos.arcana <= 22,
        `Arcana ${pos.arcana} at position ${pos.position} out of range`);
    });
  });
});

// Test 7: getArcanaWithPrevious function
test('getArcanaWithPrevious returns correct previous arcana', () => {
  const result1 = getArcanaWithPrevious(10);
  assert(result1.previous === 1, 'Arcana 10 should have previous 1');

  const result2 = getArcanaWithPrevious(1);
  assert(result2.previous === null, 'Arcana 1 should have no previous');

  const result3 = getArcanaWithPrevious(22);
  assert(result3.previous === 4, 'Arcana 22 should have previous 4');
});

// Test 8: Edge case - leap year date
test('Leap year date calculates correctly', () => {
  const date = new Date(2000, 1, 29);
  const result = calculateMatrix(date);

  assert(result.matrix.length === 27, 'Matrix should have 27 positions');
  assert(result.fatalMistake > 0, 'Fatal mistake should be calculated');
});

// Test 9: Consistency - same date produces same result
test('Same date produces identical results', () => {
  const date = new Date(1995, 3, 12);
  const result1 = calculateMatrix(date);
  const result2 = calculateMatrix(new Date(1995, 3, 12));

  assert(JSON.stringify(result1) === JSON.stringify(result2), 'Results should be identical');
});

// Test 10: Arcana distribution
test('Arcana are distributed across matrix (not all same)', () => {
  const date = new Date(1990, 5, 15);
  const result = calculateMatrix(date);

  const arcanaSet = new Set(result.matrix.map(p => p.arcana));
  assert(arcanaSet.size > 5, 'Should have variety of arcana, not all same');
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`📊 Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

if (failed > 0) {
  process.exit(1);
}
