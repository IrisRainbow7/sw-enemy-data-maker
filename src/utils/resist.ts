export const resistBonus = (totalSwordFragment: number): number => {
  if (totalSwordFragment <= 0) return 0
  return Math.min(4, Math.floor((totalSwordFragment + 4) / 5))
}
