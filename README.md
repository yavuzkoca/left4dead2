# Left 4 Dead 2 Team Balancer & Stats

This repository provides a **Node.js + TypeScript** application for managing Left 4 Dead 2 player statistics, generating balanced teams based on win/loss records, and analyzing player match histories based on this [google sheet](https://docs.google.com/spreadsheets/d/1JKcCcxOc7WVT43a07FFUHhbMnu-rFYftQBzf8Gf2hhM/edit?usp=sharing)

---

## Features

- **Balanced Team Generation**  
  - Uses win/loss ratio and experience (number of matches) to calculate player scores.
  - Finds the most balanced team splits among 8 selected players.

- **Player Score Calculation**  
  - Combines success rate (wins vs. total matches) with an experience factor.

- **Match History Analysis**  
  - Tracks how often two players were on the same team, their win/loss record together, and head-to-head results.

- **Data Sync from Google Sheets**  
  - Automatically updates `players.json` and `matches.json` by fetching CSV data from Google Sheets.

---

## Requirements

- **Node.js** >= 18
- **npm** >= 9

---

## Installation

```bash
git clone https://github.com/yavuzkoca/left4dead2.git
cd left4dead2
npm install
```

---

## Scripts

The following npm scripts are available:

- **Start balance UI (select players & find balanced teams):**
  ```bash
  npm run start
  ```
  Runs `balance-ui.ts` and prompts you to select 8 players.

- **Update players and matches from Google Sheets:**
  ```bash
  npm run update
  ```
  Fetches data and updates `players.json` and `matches.json`.

- **Show player scores:**
  ```bash
  npm run score
  ```

- **Compare two players' win/loss history:**
  ```bash
  npm run pair
  ```

---

## Project Structure

```
├── balance-ui.ts        # Interactive CLI for team balancing
├── pair-wins.ts         # Compare stats between two players
├── score.ts             # List players by calculated score
├── update-players.ts    # Update players & matches from Google Sheets
├── players.json         # Player stats (auto-generated)
├── matches.json         # Match history (auto-generated)
├── package.json
└── tsconfig.json
```

---

## Player Score Formula

```ts
score = (wins / (wins + losses)) * (1 + log2(wins + losses))
```

- **Success rate:** Rewards players with more wins.
- **Experience factor:** Increases score for experienced players but with diminishing returns.

---

## Example Output

**Balanced Teams:**
```
En dengeli takımlar:

Seçenek 1:

  Team A (Toplam Puan: 4.231):
  ┌─────────┬─────────────┬──────┬────────┬─────────┐
  │ (index) │ Name        │ Wins │ Losses │ Score   │
  ├─────────┼─────────────┼──────┼────────┼─────────┤
  │    0    │ Sansarinyo  │  29  │   18   │ 1.456   │
  │    1    │ Astro       │  26  │   19   │ 1.352   │
  │    2    │ Efe         │   8  │   11   │ 0.811   │
  │    3    │ Violence    │  11  │   13   │ 0.612   │
  └─────────┴─────────────┴──────┴────────┴─────────┘
```

---

## Contributing

1. Fork the repo.
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request.

---

## License

This project is licensed under the **MIT License**.
