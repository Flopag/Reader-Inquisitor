import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';

const BONJOUR_COMMAND = {
  name: 'bonjour',
  type: 1,
  description: 'Dis bonjour',
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const SHOW_ALL_GOMMETTES_COMMAND = {
  name: 'show_all_gommettes',
  type: 1,
  description: 'Show all gommettes for today',
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const ALL_COMMANDS = [BONJOUR_COMMAND, SHOW_ALL_GOMMETTES_COMMAND];

InstallGlobalCommands(process.env.DISCORD_ID, ALL_COMMANDS);
