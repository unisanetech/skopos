import '@material-symbols/font-400/outlined.css';
import { bootstrapSkoposUiApp } from './bootstrap.js';
import './globals.css';
import './styles.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Skopos UI app root container was not found.');
}

void bootstrapSkoposUiApp(container);
