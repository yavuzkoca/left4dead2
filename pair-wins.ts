import * as fs from "fs";
import * as path from "path";
import inquirer from "inquirer";

type Match = {
  map: string;
  teamA: string[]; // Kazanan takım
  teamB: string[]; // Kaybeden takım
  date: string;
};

async function main() {
  const matchesPath = path.resolve(__dirname, "matches.json");
  const matches: Match[] = JSON.parse(fs.readFileSync(matchesPath, "utf-8"));

  const allPlayers = Array.from(
    new Set(matches.flatMap((m) => [...m.teamA, ...m.teamB]))
  ).sort();

  const { player1 } = await inquirer.prompt({
    type: "list",
    name: "player1",
    message: "İlk oyuncuyu seç:",
    choices: allPlayers,
  });

  const { player2 } = await inquirer.prompt({
    type: "list",
    name: "player2",
    message: "İkinci oyuncuyu seç:",
    choices: allPlayers.filter((p) => p !== player1),
  });

  // İstatistikler
  let sameTeam = 0;
  let sameTeamWins = 0;
  let sameTeamLosses = 0;
  let opposingTeam = 0;
  let player1WinsVs2 = 0;
  let player2WinsVs1 = 0;

  matches.forEach((m) => {
    const inTeamA1 = m.teamA.includes(player1);
    const inTeamB1 = m.teamB.includes(player1);
    const inTeamA2 = m.teamA.includes(player2);
    const inTeamB2 = m.teamB.includes(player2);

    // Aynı takımda mı oynadılar?
    if ((inTeamA1 && inTeamA2) || (inTeamB1 && inTeamB2)) {
      sameTeam++;
      if (inTeamA1 && inTeamA2) sameTeamWins++;
      if (inTeamB1 && inTeamB2) sameTeamLosses++;
    }

    // Karşı takımlarda mı oynadılar?
    if ((inTeamA1 && inTeamB2) || (inTeamB1 && inTeamA2)) {
      opposingTeam++;
      if (inTeamA1 && inTeamB2) player1WinsVs2++;
      if (inTeamB1 && inTeamA2) player2WinsVs1++;
    }
  });

  // Sonuçları yazdır
  console.log(`\n${player1} & ${player2} İstatistikleri:\n`);
  console.log(`- Aynı takımda oynadıkları maç sayısı: ${sameTeam}`);
  console.log(`  • Beraber kazandıkları: ${sameTeamWins}`);
  console.log(`  • Beraber kaybettikleri: ${sameTeamLosses}`);
  console.log(`- Rakip olarak oynadıkları maç sayısı: ${opposingTeam}`);
  console.log(`  • ${player1} ${player2}'ye karşı kazandı: ${player1WinsVs2}`);
  console.log(`  • ${player2} ${player1}'e karşı kazandı: ${player2WinsVs1}`);

  console.log("\nDetaylı Maçlar (Aynı Takımda):");
  const sameTeamMatches = matches.filter(
    (m) =>
      (m.teamA.includes(player1) && m.teamA.includes(player2)) ||
      (m.teamB.includes(player1) && m.teamB.includes(player2))
  );
  if (sameTeamMatches.length > 0) {
    console.table(
      sameTeamMatches.map((m) => ({
        Map: m.map,
        Date: m.date,
        Kazanma: m.teamA.includes(player1) ? "Kazandı" : "Kaybetti",
      }))
    );
  }

  console.log("\nDetaylı Maçlar (Rakip):");
  const opposingMatches = matches.filter(
    (m) =>
      (m.teamA.includes(player1) && m.teamB.includes(player2)) ||
      (m.teamB.includes(player1) && m.teamA.includes(player2))
  );
  if (opposingMatches.length > 0) {
    console.table(
      opposingMatches.map((m) => ({
        Map: m.map,
        Date: m.date,
        Kazanan: m.teamA.includes(player1) ? player1 : player2,
      }))
    );
  }
}

main();
