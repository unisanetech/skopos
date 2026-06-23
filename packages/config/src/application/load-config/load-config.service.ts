import { readFile } from 'node:fs/promises';

import type { SkoposRootConfig } from '@skopos/model';
import YAML from 'yaml';

import { skoposRootConfigSchema } from '../../contracts/skopos-root-config.schema.js';

export const loadSkoposConfig = async (configPath: string): Promise<SkoposRootConfig | null> => {
  try {
    const contents = await readFile(configPath, 'utf8');
    return skoposRootConfigSchema.parse(YAML.parse(contents));
  } catch (error) {
    if (isMissingFileError(error)) {
      return null;
    }

    throw error;
  }
};

const isMissingFileError = (error: unknown): error is NodeJS.ErrnoException =>
  typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';
