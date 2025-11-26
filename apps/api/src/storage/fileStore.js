import { mkdir, readFile, writeFile, rename } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";

// Resolve data directory relative to this file's location
// fileStore.js is at: apps/api/src/storage/fileStore.js
// data directory is at: apps/api/data/
const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const defaultDataDirectory = path.resolve(moduleDirectory, "../../data");

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
        console.error(`Failed to parse JSON file ${filePath}:`, error.message);
        // On Vercel, can't write backup, just return default
        if (process.env.VERCEL) {
          return JSON.parse(JSON.stringify(defaultValue));
        }
        await backupCorruptedFile(filePath, raw);
        await writeJson(fileName, defaultValue);
        return JSON.parse(JSON.stringify(defaultValue));
      }
      throw error;
    }
  } catch (error) {
    // Log the error for debugging
    console.error(`Failed to read file ${filePath}:`, error.message);
    console.error(`Data directory: ${dataDirectory}`);
    console.error(`File path: ${filePath}`);
    
    // On Vercel, if file doesn't exist, return default (can't create it)
    if (process.env.VERCEL && error.code === "ENOENT") {
      console.warn(`File ${fileName} not found on Vercel, returning default. Make sure the file is committed to git.`);
      return JSON.parse(JSON.stringify(defaultValue));
    }
    
    if (error.code === "ENOENT") {
      await writeJson(fileName, defaultValue);
      return JSON.parse(JSON.stringify(defaultValue));
    }

    throw error;
  }
}

export async function writeJson(fileName, value) {
  // On Vercel, filesystem is read-only - can't write files
  // Config file is deployed from git, so writes will fail gracefully
  if (process.env.VERCEL) {
    const error = new Error(`Cannot write to filesystem on Vercel. Update ${fileName} in git and redeploy.`);
    error.code = 'EROFS';
    throw error;
  }

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


