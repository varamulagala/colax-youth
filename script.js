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
document.querySelector('.filters').hidden = false;
function filterProducts(category) {
  document.querySelector('.product-grid').dataset.filter = category;
  filters.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
  const products = document.querySelectorAll('.product-grid [data-category]');
  let visibleCount = 0;
  products.forEach((product) => {
    product.hidden = category !== 'all' && product.dataset.category !== category;
    if (!product.hidden) visibleCount++;
  });
  document.querySelector('#collection-count').textContent = `${category.toUpperCase()} / ${String(visibleCount).padStart(2, '0')} STYLES`;
}
filters.forEach((button) => button.addEventListener('click', () => filterProducts(button.dataset.filter)));
document.querySelectorAll('a[href="#drop"]').forEach((link) => link.addEventListener('click', () => filterProducts('all')));

// Only product IDs and quantities are stored; prices come from this catalog.
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
const storageKey = 'colax-youth-bag-v1';
const bag = new Map();
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (Array.isArray(saved)) saved.forEach((entry) => {
    if (Array.isArray(entry) && catalog.has(entry[0]) && Number.isInteger(entry[1]) && entry[1] > 0 && entry[1] <= 99) {
      bag.set(entry[0], entry[1]);
    }
  });
} catch { /* A blocked or invalid store must not prevent using the demo. */ }
const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const dialog = document.querySelector('#bag');
const items = document.querySelector('#bag-items');
const toast = document.querySelector('#toast');
const closeButton = document.querySelector('#bag-close');
let toastTimer;
function announce(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3000);
}
function updateBag() {
  try { localStorage.setItem(storageKey, JSON.stringify([...bag])); }
  catch { announce('Bag updated. Browser storage is unavailable; items will reset on reload.'); }
  renderBag();
}
function renderBag() {
  items.replaceChildren();
  let count = 0;
  let total = 0;
  bag.forEach((quantity, id) => {
    const { name, price, image } = catalog.get(id);
    count += quantity;
    total += price * quantity;
    const item = document.createElement('li');
    item.dataset.product = id;
    const thumbnail = document.createElement('img');
    thumbnail.className = 'bag-thumbnail';
    thumbnail.src = image;
    thumbnail.alt = name;
    thumbnail.width = 72;
    thumbnail.height = 72;
    const details = document.createElement('div');
    details.className = 'bag-details';
    const label = document.createElement('span');
    label.className = 'bag-product';
    label.textContent = `${name} · ${currency.format(price)} each`;
    const controls = document.createElement('div');
    controls.className = 'bag-controls';
    const decrease = document.createElement('button');
    decrease.textContent = '−';
    decrease.dataset.action = 'decrease';
    decrease.setAttribute('aria-label', `Decrease quantity of ${name}`);
    const amount = document.createElement('span');
    amount.textContent = quantity;
    amount.setAttribute('aria-label', `Quantity: ${quantity}`);
    const increase = document.createElement('button');
    increase.textContent = '+';
    increase.dataset.action = 'increase';
    increase.disabled = quantity >= 99;
    increase.setAttribute('aria-label', `Increase quantity of ${name}`);
    const changeQuantity = (change, action) => {
      const next = quantity + change;
      if (next <= 0) bag.delete(id);
      else bag.set(id, next);
      updateBag();
      const row = [...items.children].find((element) => element.dataset.product === id);
      const target = row?.querySelector(`[data-action="${action}"]:not(:disabled)`) || row?.querySelector('[data-action="decrease"]');
      (target || closeButton).focus();
    };
    decrease.addEventListener('click', () => changeQuantity(-1, 'decrease'));
    increase.addEventListener('click', () => changeQuantity(1, 'increase'));
    const remove = document.createElement('button');
    remove.textContent = 'Remove';
    remove.setAttribute('aria-label', `Remove ${name} from preview bag`);
    remove.addEventListener('click', () => {
      bag.delete(id);
      updateBag();
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
}
document.querySelectorAll('[data-add]').forEach((button) => {
  button.hidden = false;
  button.addEventListener('click', () => {
    const id = button.dataset.add;
    if ((bag.get(id) || 0) >= 99) {
      announce('Maximum quantity is 99 per product.');
      return;
    }
    bag.set(id, (bag.get(id) || 0) + 1);
    announce(`${catalog.get(id).name} added to your demo bag.`);
    updateBag();
  });
});
const bagToggle = document.querySelector('#bag-toggle');
bagToggle.hidden = false;
bagToggle.addEventListener('click', () => dialog.showModal());
closeButton.addEventListener('click', () => dialog.close());
document.querySelector('#bag-clear').addEventListener('click', () => {
  bag.clear();
  updateBag();
  closeButton.focus();
});
renderBag();
document.querySelector('#year').textContent = new Date().getFullYear();
