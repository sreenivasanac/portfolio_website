export default function noModulePlugin() {
  return {
    name: 'no-module-plugin',
    // Build only: the dev server needs type="module" to load src/main.js (and the CSS it imports).
    apply: 'build',
    transformIndexHtml(html) {
      return html
        .replace(/type="module"\s*/g, '')
        .replace(/\s*crossorigin/g, '');
    }
  };
}
