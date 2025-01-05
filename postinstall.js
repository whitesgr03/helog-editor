import fse from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fse.emptyDirSync(path.join(__dirname, 'public', 'tinymce'));
fse.copySync(
	path.join(__dirname, 'node_modules', 'tinymce'),
	path.join(__dirname, 'public', 'tinymce'),
	{ overwrite: true },
);
