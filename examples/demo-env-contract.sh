#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

npm run build >/dev/null

scan_json="$(mktemp)"
trap 'rm -f "$scan_json"' EXIT

node dist/bin.js scan fixtures/basic --format json >"$scan_json"

node - "$scan_json" <<'NODE'
const fs = require("node:fs");
const report = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const names = [...new Set(report.references.map((item) => item.name))].sort();

console.log("envsample demo: discovered variables");
for (const name of names) {
  console.log(`- ${name}`);
}

console.log("");
console.log("secret-like files skipped:");
for (const file of report.skippedFiles) {
  console.log(`- ${file}`);
}
NODE

echo ""
node dist/bin.js validate fixtures/basic --example .env.example --format json | node -e '
let data = "";
process.stdin.on("data", (chunk) => { data += chunk; });
process.stdin.on("end", () => {
  const report = JSON.parse(data);
  console.log(`validation: ${report.missing.length} missing, ${report.stale.length} stale, ${report.suspicious.length} suspicious`);
});
'
