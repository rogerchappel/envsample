export interface ParsedExample {
  values: Map<string, string>;
  malformedLines: number[];
}

export function parseEnvExample(content: string): ParsedExample {
  const values = new Map<string, string>();
  const malformedLines: number[] = [];
  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const match = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(line);
    if (!match) {
      malformedLines.push(index + 1);
      return;
    }

    values.set(match[1], match[2].trim());
  });

  return { values, malformedLines };
}
