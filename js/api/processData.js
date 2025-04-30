// transform into usable data
export function transformXPData(rawTransactions) {
    const grouped = new Map();

    for (const tx of rawTransactions) {
      const date = new Date(tx.createdAt).toISOString().split("T")[0];
      const project = tx.path.split("/").pop();
      const key = `${project}_${date}`;
    
      if (!grouped.has(key)) {
        grouped.set(key, { project, date, xp: tx.amount });
      } else {
        grouped.get(key).xp += tx.amount;
      }
    }
    
    return Array.from(grouped.values());
}

export function transformSkillsData(progresses) {
    return progresses
      .filter(p => p.grade > 0)
      .map(p => ({
        name: p.path.split("/").pop().replace("skill-", ""),
        level: parseFloat(p.grade.toFixed(2))
      }));
  }
  