export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}min`;
  if (m > 0) return `${m}min ${s}s`;
  return `${s}s`;
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export function yesterdayISO(): string {
  return new Date(Date.now() - 86400000).toISOString().split("T")[0];
}

export function calcPoints(durationSeconds: number, setsCompleted: number): number {
  return Math.floor(durationSeconds / 60) * 2 + setsCompleted * 3;
}

export function calcNewStreak(
  lastWorkoutDate: string | null,
  currentStreak: number
): number {
  const today = todayISO();
  const yesterday = yesterdayISO();
  if (lastWorkoutDate === yesterday || lastWorkoutDate === today) {
    return currentStreak + 1;
  }
  return 1;
}

export function muscleGroupLabel(group: string | null): string {
  const map: Record<string, string> = {
    chest: "Pectoraux",
    back: "Dos",
    shoulders: "Épaules",
    arms: "Bras",
    legs: "Jambes",
    core: "Abdos",
    full_body: "Corps entier",
    cardio: "Cardio",
  };
  return group ? (map[group] ?? group) : "—";
}

export function equipmentLabel(eq: string | null): string {
  const map: Record<string, string> = {
    barbell: "Barre",
    dumbbell: "Haltères",
    machine: "Machine",
    bodyweight: "Poids du corps",
    cable: "Câble",
    other: "Autre",
  };
  return eq ? (map[eq] ?? eq) : "—";
}
