import type { EnvReference } from "./types.js";

const ENV_NAME = "[A-Z_][A-Z0-9_]*";

const PATTERNS: Array<{ syntax: string; regex: RegExp; group: number }> = [
  { syntax: "process.env.NAME", regex: new RegExp("process\\\\.env\\\\.(" + ENV_NAME + ")", "g"), group: 1 },
  { syntax: "process.env['NAME']", regex: new RegExp("process\\\\.env\\\\[['\\\"](" + ENV_NAME + ")['\\\"]\\\\]", "g"), group: 1 },
  { syntax: "import.meta.env.NAME", regex: new RegExp("import\\\\.meta\\\\.env\\\\.(" + ENV_NAME + ")", "g"), group: 1 },
  { syntax: "Deno.env.get('NAME')", regex: new RegExp("Deno\\\\.env\\\\.get\\\\(['\\\"](" + ENV_NAME + ")['\\\"]\\\\)", "g"), group: 1 },
  { syntax: "os.environ['NAME']", regex: new RegExp("os\\\\.environ\\\\[['\\\"](" + ENV_NAME + ")['\\\"]\\\\]", "g"), group: 1 },
  { syntax: "os.getenv('NAME')", regex: new RegExp("os\\\\.getenv\\\\(['\\\"](" + ENV_NAME + ")['\\\"]", "g"), group: 1 },
  { syntax: "$NAME", regex: new RegExp("(?<![A-Z0-9_])\\\\$(" + ENV_NAME + ")", "g"), group: 1 },
  { syntax: "\${NAME}", regex: new RegExp("\\\\$\\\\{(" + ENV_NAME + ")(?::[-?][^}]*)?\\\\}", "g"), group: 1 }
];

const RESERVED = new Set([
  "PATH",
  "HOME",
  "PWD",
  "OLDPWD",
  "SHELL",
  "USER",
  "UID",
  "RANDOM",
  "SECONDS"
]);

export function extractEnvReferences(content: string, file: string): EnvReference[] {
  const references: EnvReference[] = [];
  const lineStarts = getLineStarts(content);

  for (const pattern of PATTERNS) {
    for (const match of content.matchAll(pattern.regex)) {
      const name = match[pattern.group];
      if (!name || RESERVED.has(name)) {
        continue;
      }

      references.push({
        name,
        file,
        line: lineForIndex(lineStarts, match.index ?? 0),
        syntax: pattern.syntax
      });
    }
  }

  return references;
}

function getLineStarts(content: string): number[] {
  const starts = [0];
  for (let index = 0; index < content.length; index += 1) {
    if (content[index] === "\n") {
      starts.push(index + 1);
    }
  }
  return starts;
}

function lineForIndex(starts: number[], index: number): number {
  let low = 0;
  let high = starts.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (starts[mid] <= index) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return high + 1;
}
