import * as fs from "fs";
import * as path from "path";
import inquirer from "inquirer";

type Player = {
  name: string;
  wins: number;
  losses: number;
};

function calculateTeamPower(team: Player[]): number {
  return team.reduce((sum, p) => sum + calculatePlayerScore(p), 0);
}

function calculatePlayerScore(player: Player): number {
  const totalGames = player.wins + player.losses;
  if (totalGames === 0) return 0;
  const successRate = player.wins / totalGames;
  const experienceFactor = 1 + Math.log2(totalGames);
  return successRate * experienceFactor;
}

function combinations<T>(arr: T[], k: number): T[][] {
  const result: T[][] = [];
  const helper = (start: number, combo: T[]) => {
    if (combo.length === k) {
      result.push(combo);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      helper(i + 1, combo.concat([arr[i]]));
    }
  };
  helper(0, []);
  return result;
}

function findBalancedTeams(players: Player[]) {
  const allCombos = combinations(players, 4);
  const seen = new Set<string>();
  const results: {
    teamA: Player[];
    teamB: Player[];
    powerA: number;
    powerB: number;
    diff: number;
  }[] = [];

  for (const teamA of allCombos) {
    const namesA = teamA.map((p) => p.name).sort().join(",");
    if (seen.has(namesA)) continue;

    const teamB = players.filter((p) => !teamA.includes(p));
    const namesB = teamB.map((p) => p.name).sort().join(",");
    seen.add(namesB);

    const powerA = calculateTeamPower(teamA);
    const powerB = calculateTeamPower(teamB);
    const diff = Math.abs(powerA - powerB);

    results.push({ teamA, teamB, powerA, powerB, diff });
  }

  const minDiff = Math.min(...results.map((r) => r.diff));
  let balanced = results.filter((r) => r.diff === minDiff);

  if (balanced.length < 3) {
    const sorted = results.sort((a, b) => a.diff - b.diff);
    balanced = sorted.slice(0, 3);
  }

  return balanced.slice(0, 1);
}

async function main() {
  const jsonPath = path.resolve(__dirname, "players.json");
  const allPlayers: Player[] = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  const answers = await inquirer.prompt({
    type: "checkbox",
    name: "selected",
    pageSize: 20,
    message: "8 oyuncu seçin (Space ile seç, Enter ile onayla):",
    choices: allPlayers.map((p) => ({
      name: `${p.name} (Wins: ${p.wins}, Losses: ${p.losses})`,
      value: p.name,
    })),
  });

  if (answers.selected.length !== 8) {
    console.error("Lütfen tam olarak 8 oyuncu seçin.");
    process.exit(1);
  }

  const selectedPlayers = answers.selected.map((name: string) => {
    const found = allPlayers.find((p) => p.name === name);
    if (!found) {
      throw new Error(`Oyuncu bulunamadı: ${name}`);
    }
    return found;
  });

  const balancedTeams = findBalancedTeams(selectedPlayers);

  console.log("\nEn dengeli takımlar:\n");
  balancedTeams.forEach((r, idx) => {
    console.log(`Seçenek ${idx + 1}:`);

    console.log(`\n  Team A (Toplam Puan: ${r.powerA.toFixed(3)}):`);
    console.table(
      r.teamA
        .map((p) => ({
          Name: p.name,
          Wins: p.wins,
          Losses: p.losses,
          Score: calculatePlayerScore(p),
        }))
        .sort((a, b) => b.Score - a.Score)
        .map((p) => ({
          ...p,
          Score: p.Score.toFixed(3),
        }))
    );

    console.log(`  Team B (Toplam Puan: ${r.powerB.toFixed(3)}):`);
    console.table(
      r.teamB
        .map((p) => ({
          Name: p.name,
          Wins: p.wins,
          Losses: p.losses,
          Score: calculatePlayerScore(p),
        }))
        .sort((a, b) => b.Score - a.Score)
        .map((p) => ({
          ...p,
          Score: p.Score.toFixed(3),
        }))
    );

    console.log(`  Fark: ${r.diff.toFixed(6)}\n`);
  });
}

main();
