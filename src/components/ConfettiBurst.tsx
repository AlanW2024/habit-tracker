"use client";

import confetti from "canvas-confetti";

export function fireConfetti(opts?: { x?: number; y?: number }): void {
  const x = opts?.x ?? 0.5;
  const y = opts?.y ?? 0.45;
  confetti({
    particleCount: 60,
    startVelocity: 28,
    spread: 70,
    origin: { x, y },
    colors: ["#fbbf24", "#f59e0b", "#5eead4", "#f5f1eb"],
    scalar: 0.85,
    ticks: 120,
    disableForReducedMotion: true,
  });
}
