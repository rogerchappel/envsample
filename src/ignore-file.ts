import { readFile } from "node:fs/promises";
import path from "node:path";

export async function readIgnoreFile(root: string): Promise<string[]> {
  try {
    const content = await readFile(path.join(root, ".envsampleignore"), "utf8");
    return content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"));
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}
