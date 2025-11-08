import { mkdir, readFile, writeFile, rename } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const defaultDataDirectory = path.join(moduleDirectory, "../../data");

function resolveDataDirectory(input) {
  if (!input) {
    return defaultDataDirectory;
  }

  if (path.isAbsolute(input)) {
    return input;
  }

  return path.resolve(process.cwd(), input);
}

const dataDirectory = resolveDataDirectory(process.env.DATA_DIRECTORY);

async function ensureDirectory() {
  await mkdir(dataDirectory, { recursive: true });
}

export async function readJson(fileName, defaultValue) {
  await ensureDirectory();
  const filePath = path.join(dataDirectory, fileName);

  try {
    const raw = await readFile(filePath, "utf-8");
    try {
      return JSON.parse(raw);
    } catch (error) {
      if (error instanceof SyntaxError) {
        await backupCorruptedFile(filePath, raw);
        await writeJson(fileName, defaultValue);
        return JSON.parse(JSON.stringify(defaultValue));
      }
      throw error;
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeJson(fileName, defaultValue);
      return JSON.parse(JSON.stringify(defaultValue));
    }

    throw error;
  }
}

export async function writeJson(fileName, value) {
  await ensureDirectory();
  const filePath = path.join(dataDirectory, fileName);
  const serialized = JSON.stringify(value, null, 2);
  const tempFilePath = path.join(
    dataDirectory,
    `${fileName}.${process.pid}.${Date.now()}.${randomUUID()}.tmp`
  );

  await writeFile(tempFilePath, `${serialized}\n`, "utf-8");
  await rename(tempFilePath, filePath);
}

async function backupCorruptedFile(filePath, raw) {
  const extension = path.extname(filePath);
  const baseName = path.basename(filePath, extension);
  const dirName = path.dirname(filePath);
  const timeStamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupName = `${baseName}.corrupted-${timeStamp}${extension || ".json"}`;
  const backupPath = path.join(dirName, backupName);

  await writeFile(backupPath, raw, "utf-8");
}


