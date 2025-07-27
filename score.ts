import * as fs from "fs";
import * as path from "path";

type Player = {
  name: string;
  wins: number;
  losses: number;
};

function calculatePlayerScore(player: Player): number {
  const totalGames = player.wins + player.losses;
  if (totalGames === 0) return 0;
  const successRate = player.wins / totalGames;
  const experienceFactor = 1 + Math.log2(totalGames);
  return successRate * experienceFactor;
}

const jsonPath = path.resolve(__dirname, "players.json");
const allPlayers: Player[] = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

const playersWithScores = allPlayers.map((player) => ({
  name: player.name,
  wins: player.wins,
  losses: player.losses,
  score: calculatePlayerScore(player),
}));

playersWithScores.sort((a, b) => b.score - a.score);

console.table(
  playersWithScores.map((p) => ({
    Name: p.name,
    Wins: p.wins,
    Losses: p.losses,
    Score: p.score.toFixed(3),
  }))
);