import { bootstrapSkoposUiApp } from './bootstrap.js';
import './styles.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Skopos UI app root container was not found.');
}

void bootstrapSkoposUiApp(container);
