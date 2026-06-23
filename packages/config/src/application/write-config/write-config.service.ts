import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import type { SkoposRootConfig } from '@skopos/model';
import YAML from 'yaml';

import { skoposRootConfigSchema } from '../../contracts/skopos-root-config.schema.js';

export const writeSkoposConfig = async (
  configPath: string,
  config: SkoposRootConfig,
): Promise<void> => {
  const parsedConfig = skoposRootConfigSchema.parse(config);

  await mkdir(dirname(configPath), { recursive: true });
  await writeFile(configPath, YAML.stringify(parsedConfig), 'utf8');
};
