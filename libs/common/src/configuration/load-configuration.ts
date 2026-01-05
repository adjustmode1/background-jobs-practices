import fs from 'fs';
import path from 'path';
import { load } from 'js-yaml';
import { z } from 'zod';

export function loadConfig(schema: z.Schema): Record<string, unknown> {
  const configPath =
    process.env.CONFIGURATION_PATH ?? path.join('config/configuration.yml');

  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file not found: ${configPath}`);
  }

  const parsed = schema.safeParse(load(fs.readFileSync(configPath, 'utf8')));

  if (!parsed.success) {
    console.error('Invalid configuration');
    console.error(parsed.error.message);
    throw new Error('Invalid configuration');
  }

  return parsed.data as Record<string, unknown>;
}
