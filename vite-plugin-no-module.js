export default function noModulePlugin() {
  return {
    name: 'no-module-plugin',
    transformIndexHtml(html) {
      return html
        .replace(/type="module"\s*/g, '')
        .replace(/\s*crossorigin/g, '');
    }
  };
}
