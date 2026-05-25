import fs from 'node:fs';
import yaml from 'js-yaml';

// We are loading the sidebar from the following yaml file
const fileContent = fs.readFileSync('./sidebars.yaml');
export default yaml.load(fileContent);
