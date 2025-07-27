import * as fs from "fs";
import fetch from "node-fetch";
import { parse } from "csv-parse/sync";

type Player = {
  name: string;
  wins: number;
  losses: number;
};

type Match = {
  map: string;
  teamA: string[];
  teamB: string[];
  date: string;
};

async function main() {
  const playerStatsUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQf2j1_f7U9RZt88sONniplCQpKHPyJkyZhPtllk6qy-W5H6AyGPomJuSIvIltgAZNOZQ7NMsY80P_j/pub?output=csv";

  const gameResultsCsvUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQf2j1_f7U9RZt88sONniplCQpKHPyJkyZhPtllk6qy-W5H6AyGPomJuSIvIltgAZNOZQ7NMsY80P_j/pub?gid=1587580525&single=true&output=csv";

  console.log("Veriler çekiliyor...");
  const [playerStatsResponse, gameResultsResponse] = await Promise.all([
    fetch(playerStatsUrl),
    fetch(gameResultsCsvUrl),
  ]);

  const playerStatsCsv = await playerStatsResponse.text();
  const gameResultsCsv = await gameResultsResponse.text();

  // 1. Oyuncu istatistikleri
  const playerRecords = parse(playerStatsCsv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const players: Player[] = playerRecords.map((row: any) => ({
    name: row["Players"],
    wins: Number(row["Wins"]),
    losses: Number(row["Losses"]),
  }));

  fs.writeFileSync("players.json", JSON.stringify(players, null, 2), "utf-8");
  console.log(`players.json güncellendi. Toplam ${players.length} oyuncu.`);

  // 2. Maç sonuçları
  const gameRecords = parse(gameResultsCsv, {
    columns: false,
    skip_empty_lines: true,
    trim: true,
  });

  // İlk satır (header) atla
  const dataRows = gameRecords.slice(1);

  const matches: Match[] = dataRows.map((row: string[]) => {
    return {
      map: row[0]?.trim() || "Unknown",
      teamA: [row[2], row[3], row[4], row[5]].map((p) => p.trim()).filter(Boolean),
      teamB: [row[7], row[8], row[9], row[10]].map((p) => p.trim()).filter(Boolean),
      date: row[11]?.trim() || "Unknown",
    };
  });

  fs.writeFileSync("matches.json", JSON.stringify(matches, null, 2), "utf-8");
  console.log(`matches.json güncellendi. Toplam ${matches.length} maç işlendi.`);
}

main();
