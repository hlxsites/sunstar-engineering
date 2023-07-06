/**
 * @param {HTMLElement} block
 * @returns {Promise<void>}
 */
export default async function decorate(block) {
  // see https://docs.usercentrics.com/#/v2-embeddings
  block.innerHTML = '<div class="uc-embed" uc-embedding-type="category" uc-show-toggle="true" uc-styling="true"></div>';
}
