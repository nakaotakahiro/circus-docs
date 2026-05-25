import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';

// This script loads the latest API spec from the GitHub API.

const url =
  'https://api.github.com/repos/utrad-ical/circus/git/trees/master?recursive=1';


// This token is now optional.
// Just be aware of GitHub's rate limits for unauthenticated requests.
const token = process.env.CIRCUS_DOCS_GH_TOKEN;

const dirname = import.meta.dirname;

const categoryName = path => path.match(/src\/api\/(.+)\/index/)[1];

const asyncMap = async (arr, fn) => await Promise.all(arr.map(fn));

const requestHeaders = () => ({
  'User-Agent': 'circus-docs',
  ...(token
    ? {
      Authorization:
        'Basic ' + Buffer.from(`anyone:${token}`).toString('base64'),
    }
    : {}),
});

const fetchJson = async url => {
  const res = await fetch(url, { headers: requestHeaders() });
  if (!res.ok) {
    throw new Error(`Request failed with ${res.status}: ${url}`);
  }
  return await res.json();
};

const fileExists = async path => {
  try {
    await fs.access(path);
    return true;
  } catch (e) {
    return false;
  }
};

const load = async () => {
  const data = await fetchJson(url);
  const tree = data.tree;
  const deny = ['debug', 'login-info', 'logout', 'plugin-displays'];
  const yamlFiles = tree
    .filter(t => /^packages\/circus-api\/src\/api\/.*\.yaml$/.test(t.path))
    .filter(t => !deny.includes(categoryName(t.path)));

  const augumentWithExamples = async (category, route) => {
    const exampleFile = path.join(
      dirname,
      'docs/dev/api-examples',
      category + '.md'
    );
    const mdExists = await fileExists(exampleFile);
    if (!mdExists) return route;
    const mdContent = await fs.readFile(exampleFile, 'utf8');
    const routeExists = mdContent.includes(
      `verb="${route.verb}" path="${route.path}"`
    );
    return routeExists ? { ...route, hasExample: true } : route;
  };

  const routes = await asyncMap(yamlFiles, async yamlFile => {
    const blobData = await fetchJson(yamlFile.url);
    const yamlData = Buffer.from(blobData.content, 'base64');
    const data = yaml.load(yamlData);
    const category = categoryName(yamlFile.path);
    return {
      category,
      name: data.name,
      description: data.description,
      routes: await asyncMap(data.routes, r =>
        augumentWithExamples(category, r)
      ),
    };
  });
  routes.sort((a, b) => {
    const aa = a.category.replace('admin/', 'zzz/');
    const bb = b.category.replace('admin/', 'zzz/');
    return aa.localeCompare(bb);
  });
  return routes;
};

const main = async () => {
  const routes = await load();
  await fs.writeFile(
    path.join(dirname, 'static/api.json'),
    JSON.stringify(routes),
    'utf8'
  );
  console.log(`Wrote api.json with ${routes.length} categories`);
};

main().catch(err => {
  console.error(err);
  process.exit(-1);
});
