/**
 * Model gas ideal sederhana yang dipakai GASLAB.
 *
 *   P = k · N · (T / T₀) / V
 *
 * dengan:
 *   k  = konstanta kalibrasi
 *   N  = jumlah partikel
 *   V  = volume (L)
 *   T  = suhu (K), T₀ = 300 K
 *
 * Kalibrasi: N = 50 partikel, V = 5 L, T = 300 K  →  P = 1,00 atm
 * sehingga k = (1 × 5) / 50 = 0,1 atm·L per partikel.
 *
 * Pada N dan T tetap: P · V = konstan  →  Hukum Boyle.
 */

export const BASE_PARTICLES = 50;
export const BASE_VOLUME = 5;
export const BASE_TEMP = 300;
export const BASE_PRESSURE = 1;

export const K_PER_PARTICLE = (BASE_PRESSURE * BASE_VOLUME) / BASE_PARTICLES; // 0.1

export const VOLUME_MIN = 1;
export const VOLUME_MAX = 10;
export const PARTICLES_MIN = 10;
export const PARTICLES_MAX = 100;
export const TEMP_MIN = 200;
export const TEMP_MAX = 600;

export const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/** Tekanan gas (atm) berdasarkan model gas ideal sederhana. */
export function computePressure(
  volumeL: number,
  particleCount: number,
  tempK: number,
): number {
  const v = Math.max(0.01, volumeL);
  const t = Math.max(1, tempK);
  return (K_PER_PARTICLE * particleCount * (t / BASE_TEMP)) / v;
}

/**
 * Laju tumbukan partikel terhadap dinding (tumbukan per detik, model).
 * Dikalibrasi: N = 50, V = 5 L, T = 300 K  →  42 tumbukan/detik.
 */
export function computeCollisionRate(
  volumeL: number,
  particleCount: number,
  tempK: number,
): number {
  const v = Math.max(0.01, volumeL);
  const t = Math.max(1, tempK);
  const rate = (4.2 * particleCount * Math.sqrt(t / BASE_TEMP)) / v;
  return Math.round(rate);
}

export function atmToKpa(atm: number): number {
  return atm * 101.325;
}

/** Konstanta Boyle untuk kondisi N dan T tertentu. */
export function boyleConstant(particleCount: number, tempK: number): number {
  return K_PER_PARTICLE * particleCount * (tempK / BASE_TEMP);
}

/** P₂ = (P₁ × V₁) / V₂ */
export function solveBoyle(p1: number, v1: number, v2: number): number {
  if (v2 <= 0) return NaN;
  return (p1 * v1) / v2;
}

export function classifyPressure(atm: number): {
  label: string;
  tone: 'low' | 'normal' | 'high';
} {
  if (atm < 0.75) return { label: 'Rendah', tone: 'low' };
  if (atm <= 1.75) return { label: 'Sedang', tone: 'normal' };
  return { label: 'Tinggi', tone: 'high' };
}