/**
 * Groups raw XP transactions by project and date (YYYY-MM-DD),
 * and sums XP amounts for identical project-date combinations.
 */
export function transformXPData(rawTransactions) {
  const grouped = new Map();

  for (const tx of rawTransactions) {
    if (!tx.createdAt || !tx.path || typeof tx.amount !== "number") continue;

    const date = new Date(tx.createdAt).toISOString().split("T")[0];
    const project = tx.path.split("/").pop() || "unknown";
    const key = `${project}_${date}`;

    if (!grouped.has(key)) {
      grouped.set(key, { project, date, xp: tx.amount });
    } else {
      grouped.get(key).xp += tx.amount;
    }
  }

  return Array.from(grouped.values());
}
