// Menu and filters progressively enhance the working HTML links.
const menu = document.querySelector('#menu-toggle');
const nav = document.querySelector('#nav');
menu.hidden = false;
nav.classList.add('ready');
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
window.matchMedia('(min-width: 701px)').addEventListener('change', closeMenu);

const filters = document.querySelectorAll('[data-filter]');
const productSearch = document.querySelector('#product-search');
const clearSearch = document.querySelector('#search-clear');
const noResults = document.querySelector('#no-results');
const filterGroup = document.querySelector('.filters');
if (filterGroup) filterGroup.hidden = false;
function filterProducts(category) {
  if (!document.querySelector('.product-grid')) return;
  const terms = (productSearch?.value || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
  document.querySelector('.product-grid').dataset.filter = category;
  filters.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
  const products = document.querySelectorAll('.product-grid [data-category]');
  let visibleCount = 0;
  products.forEach((product) => {
    const name = product.querySelector('h3').textContent.toLowerCase();
    product.hidden = (category !== 'all' && product.dataset.category !== category) || !terms.every((term) => name.includes(term));
    if (!product.hidden) visibleCount++;
  });
  document.querySelector('#collection-count').textContent = `${category.toUpperCase()} / ${String(visibleCount).padStart(2, '0')} STYLES${terms.length ? ' matching your search' : ''}`;
  if (noResults) noResults.hidden = visibleCount !== 0;
  if (clearSearch) clearSearch.hidden = !productSearch.value;
}
if (productSearch) {
  productSearch.closest('.collection-search').hidden = false;
  const applySearch = () => filterProducts(document.querySelector('.product-grid').dataset.filter || 'all');
  productSearch.addEventListener('input', applySearch);
  clearSearch.addEventListener('click', () => {
    productSearch.value = '';
    applySearch();
    productSearch.focus();
  });
  document.querySelector('#search-reset').addEventListener('click', () => {
    productSearch.value = '';
    filterProducts('all');
    productSearch.focus();
  });
  applySearch();
}
filters.forEach((button) => button.addEventListener('click', () => filterProducts(button.dataset.filter)));
document.querySelectorAll('a[href="#drop"]').forEach((link) => link.addEventListener('click', () => filterProducts('all')));

// Prices and product details always come from this catalog.
const catalog = new Map([
  ["men-quarter-zip", {"name":"Cream Quarter Zip Knit","price":1393,"image":"men outfits/Men-01.png","originalPrice":1990}],
  ["men-essential-tee", {"name":"White Essential Tee","price":693,"image":"men outfits/Men-02.png","originalPrice":990}],
  ["men-style-03", {"name":"Black Crew Neck Tee","price":833,"image":"men outfits/Men-03.png","originalPrice":1190}],
  ["men-style-04", {"name":"Slate Blue Relaxed Tee","price":1043,"image":"men outfits/Men-04.png","originalPrice":1490}],
  ["men-style-05", {"name":"Mustard V-Neck Cardigan","price":1253,"image":"men outfits/Men-05.png","originalPrice":1790}],
  ["men-style-06", {"name":"Stone Zip Jacket","price":1043,"image":"men outfits/Men-06.png","originalPrice":1490}],
  ["men-style-07", {"name":"Cobalt Track Jacket","price":1393,"image":"men outfits/Men-07.png","originalPrice":1990}],
  ["men-style-08", {"name":"Sage Oversized Tee","price":1603,"image":"men outfits/Men-08.png","originalPrice":2290}],
  ["men-style-09", {"name":"Burgundy Polo Shirt","price":1183,"image":"men outfits/Men-09.png","originalPrice":1690}],
  ["men-style-10", {"name":"Charcoal Fitted Tee","price":1323,"image":"men outfits/Men-10.png","originalPrice":1890}],
  ["men-style-11", {"name":"Indigo Straight Leg Jeans","price":1743,"image":"men outfits/Men-11.png","originalPrice":2490}],
  ["men-style-12", {"name":"Brown Corduroy Trousers","price":1253,"image":"men outfits/Men-12.png","originalPrice":1790}],
  ["men-style-13", {"name":"Cream Pleated Trousers","price":1113,"image":"men outfits/Men-13.png","originalPrice":1590}],
  ["women-satin-shirt", {"name":"Champagne Satin Crop Shirt","price":1043,"image":"ladies outfits/Ladies-01.png","originalPrice":1490}],
  ["women-crop-bomber", {"name":"Charcoal Cropped Bomber","price":1953,"image":"ladies outfits/Ladies-02.png","originalPrice":2790}],
  ["women-style-03", {"name":"Grey Crew Neck Sweatshirt","price":903,"image":"ladies outfits/Ladies-03.png","originalPrice":1290}],
  ["women-style-04", {"name":"Light Wash Denim Jacket","price":1113,"image":"ladies outfits/Ladies-04.png","originalPrice":1590}],
  ["women-style-05", {"name":"Taupe Cropped Cardigan","price":1253,"image":"ladies outfits/Ladies-05.png","originalPrice":1790}],
  ["women-style-06", {"name":"Taupe Wide Leg Trousers","price":1393,"image":"ladies outfits/Ladies-06.png","originalPrice":1990}],
  ["women-style-07", {"name":"Ivory Pleated Shorts","price":1043,"image":"ladies outfits/Ladies-07.png","originalPrice":1490}],
  ["women-style-08", {"name":"Champagne Satin Skirt","price":1603,"image":"ladies outfits/Ladies-08.png","originalPrice":2290}],
  ["women-style-09", {"name":"Light Wash Straight Leg Jeans","price":1323,"image":"ladies outfits/Ladies-09.png","originalPrice":1890}],
]);
// Sorting is available only on the full collection page; use catalog sale prices.
const priceSort = document.querySelector('#price-sort');
if (priceSort) {
  const grid = document.querySelector('.product-grid');
  const featuredProducts = [...grid.children];
  const priceOf = (product) => catalog.get(product.querySelector('[data-add]').dataset.add).price;
  function sortProducts() {
    const products = [...featuredProducts];
    if (priceSort.value === 'price-asc') products.sort((a, b) => priceOf(a) - priceOf(b));
    else if (priceSort.value === 'price-desc') products.sort((a, b) => priceOf(b) - priceOf(a));
    // Move existing cards so their size-picker listeners and category visibility stay intact.
    grid.append(...products);
  }
  priceSort.closest('label').hidden = false;
  priceSort.addEventListener('change', sortProducts);
  sortProducts();
}
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const storageKey = 'colax-youth-bag-v2';
const lineKey = (id, size) => `${id}:${size || ''}`;
const bag = new Map();
try {
  const current = localStorage.getItem(storageKey);
  const saved = JSON.parse(current ?? localStorage.getItem('colax-youth-bag-v1'));
  if (Array.isArray(saved)) saved.forEach((entry) => {
    const [id, quantity, size] = Array.isArray(entry) ? entry : [];
    const validSize = current === null ? size === undefined : size === null || sizes.includes(size);
    if (catalog.has(id) && Number.isInteger(quantity) && quantity > 0 && quantity <= 99 && validSize) {
      bag.set(lineKey(id, size), { id, quantity, size: size || null });
    }
  });
} catch { /* A blocked or invalid store must not prevent using the demo. */ }
const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
function productImagePath(image) {
  return document.body.classList.contains('product-page') ? `../${image}` : image;
}
const dialog = document.querySelector('#bag');
const items = document.querySelector('#bag-items');
const toast = document.querySelector('#toast');
const closeButton = document.querySelector('#bag-close');
let toastTimer;
function announce(message, productId, theme) {
  toast.replaceChildren();
  toast.dataset.theme = theme || (productId?.startsWith('men-') ? 'men' : productId?.startsWith('women-') ? 'women' : 'mixed');
  const product = catalog.get(productId);
  if (product) {
    const thumbnail = document.createElement('img');
    thumbnail.className = 'toast-thumbnail';
    thumbnail.src = productImagePath(product.image);
    thumbnail.alt = product.name;
    thumbnail.width = 40;
    thumbnail.height = 48;
    toast.append(thumbnail);
  }
  const text = document.createElement('span');
  text.textContent = message;
  toast.append(text);
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3000);
}
// Keep Undo inside the modal so it remains clickable and keyboard accessible.
const undoNotice = document.createElement('div');
undoNotice.className = 'bag-undo';
undoNotice.hidden = true;
undoNotice.setAttribute('role', 'status');
undoNotice.setAttribute('aria-live', 'polite');
const undoMessage = document.createElement('span');
undoMessage.className = 'bag-undo-message';
const undoThumbnails = document.createElement('div');
undoThumbnails.className = 'bag-undo-thumbnails';
const undoButton = document.createElement('button');
undoButton.type = 'button';
undoButton.textContent = 'UNDO';
const undoProgress = document.createElement('span');
undoProgress.className = 'bag-undo-progress';
undoProgress.setAttribute('aria-hidden', 'true');
undoNotice.append(undoThumbnails, undoMessage, undoButton, undoProgress);
dialog.append(undoNotice);
let undoTimer;
let undoAnimation;
function dismissUndo() {
  clearTimeout(undoTimer);
  undoAnimation?.cancel();
  if (document.activeElement === undoButton) closeButton.focus();
  undoNotice.hidden = true;
  undoButton.disabled = true;
  undoButton.onclick = null;
  undoThumbnails.replaceChildren();
}
function offerUndo(removed, message) {
  dismissUndo();
  const hasMen = removed.some(({ id }) => id.startsWith('men-'));
  const hasWomen = removed.some(({ id }) => id.startsWith('women-'));
  undoNotice.dataset.theme = hasMen && hasWomen ? 'mixed' : hasMen ? 'men' : 'women';
  const products = [...new Set(removed.map(({ id }) => id))];
  products.slice(0, 3).forEach((id) => {
    const product = catalog.get(id);
    const thumbnail = document.createElement('img');
    thumbnail.src = productImagePath(product.image);
    thumbnail.alt = product.name;
    thumbnail.width = 40;
    thumbnail.height = 48;
    undoThumbnails.append(thumbnail);
  });
  if (products.length > 3) {
    const more = document.createElement('span');
    more.className = 'bag-undo-more';
    more.textContent = `+${products.length - 3}`;
    more.setAttribute('aria-label', `${products.length - 3} more outfits`);
    undoThumbnails.append(more);
  }
  undoMessage.textContent = message;
  undoButton.disabled = false;
  undoNotice.hidden = false;
  undoAnimation = undoProgress.animate(
    [{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }],
    { duration: 3000, easing: 'linear', fill: 'forwards' }
  );
  undoButton.onclick = () => {
    removed.forEach(({ id, size, quantity }) => {
      const key = lineKey(id, size);
      const currentQuantity = bag.get(key)?.quantity || 0;
      bag.set(key, { id, size, quantity: Math.min(99, currentQuantity + quantity) });
    });
    dismissUndo();
    updateBag();
    announce('Removed items restored to your bag.', undefined, undoNotice.dataset.theme);
  };
  undoTimer = setTimeout(dismissUndo, 3000);
}
function updateBag() {
  try { localStorage.setItem(storageKey, JSON.stringify([...bag.values()].map(({ id, quantity, size }) => [id, quantity, size]))); }
  catch { announce('Bag updated. Browser storage is unavailable; items will reset on reload.'); }
  renderBag();
}
function renderBag() {
  items.replaceChildren();
  let count = 0;
  let total = 0;
  bag.forEach(({ id, quantity, size }, key) => {
    const { name, price, image } = catalog.get(id);
    count += quantity;
    total += price * quantity;
    const item = document.createElement('li');
    item.dataset.product = key;
    const description = `${name}, ${size ? `size ${size}` : 'size not selected'}`;
    const thumbnail = document.createElement('img');
    thumbnail.className = 'bag-thumbnail';
    thumbnail.src = productImagePath(image);
    thumbnail.alt = name;
    thumbnail.width = 72;
    thumbnail.height = 72;
    const details = document.createElement('div');
    details.className = 'bag-details';
    const label = document.createElement('span');
    label.className = 'bag-product';
    label.textContent = `${name} · ${size ? `Size: ${size}` : 'Size not selected'}`;
    const controls = document.createElement('div');
    controls.className = 'bag-controls';
    const decrease = document.createElement('button');
    decrease.textContent = '−';
    decrease.dataset.action = 'decrease';
    decrease.setAttribute('aria-label', `Decrease quantity of ${description}`);
    const amount = document.createElement('span');
    amount.textContent = quantity;
    amount.setAttribute('aria-label', `Quantity: ${quantity}`);
    const increase = document.createElement('button');
    increase.textContent = '+';
    increase.dataset.action = 'increase';
    increase.disabled = quantity >= 99;
    increase.setAttribute('aria-label', `Increase quantity of ${description}`);
    const changeQuantity = (change, action) => {
      const next = quantity + change;
      if (next <= 0) bag.delete(key);
      else bag.set(key, { id, size, quantity: next });
      updateBag();
      if (next <= 0) offerUndo([{ id, size, quantity }], `${description} removed.`);
      const row = [...items.children].find((element) => element.dataset.product === key);
      const target = row?.querySelector(`[data-action="${action}"]:not(:disabled)`) || row?.querySelector('[data-action="decrease"]');
      (target || closeButton).focus();
    };
    decrease.addEventListener('click', () => changeQuantity(-1, 'decrease'));
    increase.addEventListener('click', () => changeQuantity(1, 'increase'));
    const remove = document.createElement('button');
    remove.textContent = 'Remove';
    remove.setAttribute('aria-label', `Remove ${description} from preview bag`);
    remove.addEventListener('click', () => {
      bag.delete(key);
      updateBag();
      offerUndo([{ id, size, quantity }], `${description} removed.`);
      closeButton.focus();
    });
    const subtotal = document.createElement('strong');
    subtotal.textContent = currency.format(price * quantity);
    controls.append(decrease, amount, increase, remove);
    details.append(label, subtotal);
    item.append(thumbnail, details, controls);
    items.append(item);
  });
  const badge = document.querySelector('#bag-count');
  badge.textContent = count > 99 ? '99+' : count;
  badge.hidden = count === 0;
  document.querySelector('#bag-toggle').setAttribute('aria-label', count === 0
    ? 'Open shopping cart, empty'
    : `Open shopping cart, ${count} ${count === 1 ? 'item' : 'items'}`);
  document.querySelector('#bag-total').textContent = currency.format(total);
  document.querySelector('#empty').hidden = count > 0;
  document.querySelector('#bag-clear').hidden = count === 0;
  const checkoutButton = document.querySelector('#checkout-open');
  if (checkoutButton) checkoutButton.hidden = count === 0;
}
// One native modal serves every outfit on both pages, including keyboard focus handling.
const sizeDialog = document.createElement('dialog');
sizeDialog.id = 'size-picker';
sizeDialog.setAttribute('aria-labelledby', 'size-title');
sizeDialog.innerHTML = `
  <div class="dialog-heading"><h2 id="size-title">CHOOSE YOUR SIZE.</h2><button type="button" id="size-close" aria-label="Cancel size selection">✕</button></div>
  <p id="size-product" class="size-product"></p>
  <form id="size-form">
    <fieldset class="size-options"><legend>Select a size</legend>
      ${sizes.map((size) => `<label><input type="radio" name="size" value="${size}" required><span>${size}</span></label>`).join('')}
    </fieldset>
    <p id="size-error" role="alert"></p>
    <button type="submit" class="button black size-confirm" disabled>ADD TO BAG <span aria-hidden="true">+</span></button>
  </form>`;
document.body.append(sizeDialog);
const sizeForm = sizeDialog.querySelector('form');
const sizeConfirm = sizeForm.querySelector('[type="submit"]');
const sizeError = sizeDialog.querySelector('#size-error');
let pendingProduct;
function addToBag(id, size) {
  if (!catalog.has(id) || !sizes.includes(size)) return false;
  const key = lineKey(id, size);
  const quantity = bag.get(key)?.quantity || 0;
  if (quantity >= 99) return false;
  bag.set(key, { id, size, quantity: quantity + 1 });
  announce(`${catalog.get(id).name} (size ${size}) added to your demo bag.`, id);
  updateBag();
  return true;
}
sizeDialog.querySelector('#size-close').addEventListener('click', () => sizeDialog.close());
sizeDialog.addEventListener('close', () => { pendingProduct = null; });
sizeForm.addEventListener('change', () => {
  sizeConfirm.disabled = false;
  sizeError.textContent = '';
});
sizeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const size = new FormData(sizeForm).get('size');
  if (!catalog.has(pendingProduct) || !sizes.includes(size)) return;
  const key = lineKey(pendingProduct, size);
  const quantity = bag.get(key)?.quantity || 0;
  if (quantity >= 99) {
    sizeError.textContent = 'Maximum quantity is 99 per size. Choose another size or update your bag.';
    return;
  }
  addToBag(pendingProduct, size);
  sizeDialog.close();
});
document.querySelectorAll('[data-add]').forEach((button) => {
  button.hidden = false;
  button.setAttribute('aria-haspopup', 'dialog');
  button.setAttribute('aria-controls', 'size-picker');
  button.addEventListener('click', () => {
    pendingProduct = button.dataset.add;
    const theme = getComputedStyle(button.closest('.product-grid'));
    sizeDialog.style.setProperty('--bag-background', theme.getPropertyValue('--bag-background'));
    sizeDialog.style.setProperty('--bag-foreground', theme.getPropertyValue('--bag-foreground'));
    sizeForm.reset();
    sizeConfirm.disabled = true;
    sizeError.textContent = '';
    sizeDialog.querySelector('#size-product').textContent = catalog.get(pendingProduct).name;
    sizeDialog.showModal();
  });
});
const bagToggle = document.querySelector('#bag-toggle');
bagToggle.hidden = false;
bagToggle.addEventListener('click', () => dialog.showModal());
closeButton.addEventListener('click', () => dialog.close());
document.querySelector('#bag-clear').addEventListener('click', () => {
  const removed = [...bag.values()].map((entry) => ({ ...entry }));
  if (!removed.length) return;
  bag.clear();
  updateBag();
  offerUndo(removed, 'Bag cleared.');
  closeButton.focus();
});
renderBag();
document.querySelector('#year').textContent = new Date().getFullYear();

// Show a touch-friendly shortcut after the first screen of content.
const backToTop = document.createElement('button');
backToTop.type = 'button';
backToTop.className = 'back-to-top';
backToTop.setAttribute('aria-label', 'Back to top');
backToTop.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 12 6-6 6 6M12 6v14"/></svg>';
backToTop.hidden = true;
document.body.append(backToTop);
function updateBackToTop() {
  backToTop.hidden = window.scrollY < window.innerHeight * 0.75;
  if (backToTop.hidden) return;
  const bounds = backToTop.getBoundingClientRect();
  const behind = document.elementsFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2)
    .find((element) => !backToTop.contains(element));
  let section = behind?.closest('section, footer, header, main') || document.body;
  let channels;
  while (section) {
    const values = getComputedStyle(section).backgroundColor.match(/[\d.]+/g)?.map(Number);
    if (values && (values.length === 3 || values[3] === 1)) {
      channels = values.slice(0, 3);
      break;
    }
    section = section.parentElement;
  }
  const inverse = (channels || [247, 241, 232]).map((value) => 255 - value);
  const luminance = inverse.map((value) => {
    const channel = value / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  }).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
  backToTop.style.setProperty('--top-background', `rgb(${inverse.join(', ')})`);
  backToTop.style.setProperty('--top-foreground', luminance > 0.179 ? '#000' : '#fff');
}
window.addEventListener('scroll', updateBackToTop, { passive: true });
window.addEventListener('resize', updateBackToTop);
updateBackToTop();
backToTop.addEventListener('click', () => {
  const main = document.querySelector('#main');
  main.setAttribute('tabindex', '-1');
  main.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
});
