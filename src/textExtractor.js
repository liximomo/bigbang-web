const extractMap = {};

function register(nodeName, extract) {
  extractMap[nodeName] = extract;
}

register('input', node => node.value);

export default function textContent(node) {
  let text = '';
  if (node.nodeType === 3) {
    text = node.textContent;
  } else {
    const nodeName = node.nodeName.toLowerCase();
    const tractor = extractMap[nodeName];
    if (tractor) {
      text = tractor(node);
    }
  }
  return text.trim();
}
