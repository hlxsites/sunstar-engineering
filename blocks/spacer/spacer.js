import { readBlockConfig } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const blockCfg = readBlockConfig(block);
  block.innerHTML = '';
  block.style.height = window.innerWidth < 992 ? blockCfg.mobile : blockCfg.desktop;
}
