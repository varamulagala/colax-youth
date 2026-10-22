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
  ['men-quarter-zip', { name: 'Quarter Zip Knit', price: 2490 }],
  ['men-essential-tee', { name: 'Essential Tee', price: 1290 }],
  ['women-satin-shirt', { name: 'Satin Crop Shirt', price: 1990 }],
  ['women-crop-bomber', { name: 'Cropped Bomber', price: 3490 }],
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
    const { name, price } = catalog.get(id);
    count += quantity;
    total += price * quantity;
    const item = document.createElement('li');
    item.dataset.product = id;
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
    item.append(label, subtotal, controls);
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
