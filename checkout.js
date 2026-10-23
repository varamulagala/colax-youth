// Browser-only demo: customer details are never stored or transmitted.
const checkoutFields = [
  { name: 'fullName', label: 'Full name', autocomplete: 'name', min: 2, max: 100 },
  { name: 'email', label: 'Email address', type: 'email', autocomplete: 'email', max: 254 },
  { name: 'phone', label: 'Mobile number', type: 'tel', autocomplete: 'tel', inputmode: 'tel', max: 20, hint: '10-digit Indian mobile number; +91 is optional.' },
  { name: 'address', label: 'Street address', autocomplete: 'street-address', min: 5, max: 200, wide: true },
  { name: 'city', label: 'City', autocomplete: 'address-level2', min: 2, max: 80 },
  { name: 'state', label: 'State / Union territory', autocomplete: 'address-level1', min: 2, max: 80 },
  { name: 'pin', label: 'PIN code', autocomplete: 'postal-code', inputmode: 'numeric', max: 6, hint: '6-digit Indian PIN code.' },
];
const checkoutDialog = document.createElement('dialog');
checkoutDialog.id = 'checkout';
checkoutDialog.setAttribute('aria-labelledby', 'checkout-title');
checkoutDialog.innerHTML = `
  <div class="dialog-heading"><h2 id="checkout-title">CHECKOUT.</h2><button type="button" id="checkout-close" aria-label="Close demo checkout">✕</button></div>
  <p class="checkout-kicker">YOUR NEXT FIT / DEMO CHECKOUT</p>
  <p class="checkout-note">Try with sample details. No payment, email, or delivery takes place. Your details stay in this form and are cleared when you close it.</p>
  <div id="checkout-content">
    <section class="checkout-summary" aria-labelledby="checkout-summary-title"><h3 id="checkout-summary-title">YOUR ROTATION</h3><ul id="checkout-items"></ul><p class="checkout-delivery">Delivery <span>Included · India only</span></p><p class="bag-total">Demo total <strong id="checkout-total"></strong></p></section>
    <form id="checkout-form" novalidate>
      <fieldset><legend>DELIVERY DETAILS</legend><p class="checkout-required">All fields are required. Country: India.</p><div class="checkout-fields">
      ${checkoutFields.map((field) => `<div class="checkout-field${field.wide ? ' checkout-wide' : ''}"><label for="checkout-${field.name}">${field.label}</label><input id="checkout-${field.name}" name="${field.name}" type="${field.type || 'text'}" autocomplete="${field.autocomplete}" ${field.inputmode ? `inputmode="${field.inputmode}"` : ''} maxlength="${field.max}" required aria-describedby="${field.hint ? `checkout-${field.name}-hint ` : ''}checkout-${field.name}-error">${field.hint ? `<small id="checkout-${field.name}-hint">${field.hint}</small>` : ''}<span class="checkout-error" id="checkout-${field.name}-error"></span></div>`).join('')}
      </div></fieldset>
      <p id="checkout-error" class="checkout-error" role="alert"></p>
      <button class="button checkout-submit" type="submit">PLACE DEMO ORDER <span aria-hidden="true">↗</span></button>
      <button id="checkout-back" class="checkout-back" type="button">Back to bag</button>
    </form>
  </div>
  <section id="checkout-confirmation" hidden aria-labelledby="confirmation-title" tabindex="-1"><span class="confirmation-mark" aria-hidden="true">✓</span><p class="checkout-kicker">DEMO COMPLETE</p><h3 id="confirmation-title">GOOD TASTE.<br>GREAT CHOICE.</h3><p>Your demo order is confirmed.</p><p id="checkout-reference"></p><p id="checkout-confirmed-total"></p><p class="checkout-note">This was a simulation. Nothing was charged, sent, or ordered. Your bag has been cleared.</p><button type="button" class="button checkout-submit" id="checkout-done">CONTINUE EXPLORING <span aria-hidden="true">↗</span></button></section>`;
document.body.append(checkoutDialog);
const checkoutOpen = document.createElement('button');
checkoutOpen.id = 'checkout-open';
checkoutOpen.type = 'button';
checkoutOpen.className = 'button checkout-submit';
checkoutOpen.textContent = 'DEMO CHECKOUT ↗';
checkoutOpen.setAttribute('aria-haspopup', 'dialog');
checkoutOpen.setAttribute('aria-controls', 'checkout');
dialog.insertBefore(checkoutOpen, undoNotice);
const checkoutForm = checkoutDialog.querySelector('form');
const checkoutList = checkoutDialog.querySelector('#checkout-items');
const checkoutError = checkoutDialog.querySelector('#checkout-error');
let checkoutLines = [];
let checkoutComplete = false;

function checkoutFieldError(field, input) {
  const value = input.value.trim();
  if (!value) return `Enter your ${field.label.toLowerCase()}.`;
  if (field.min && value.length < field.min) return `Enter at least ${field.min} characters.`;
  if (value.length > field.max) return `Use ${field.max} characters or fewer.`;
  if (field.type === 'email' && input.validity.typeMismatch) return 'Enter a valid email address, such as you@example.com.';
  if (field.name === 'phone' && !/^(?:\+91[\s-]?)?[6-9]\d{9}$/.test(value.replace(/[\s()-]/g, ''))) return 'Enter a valid 10-digit Indian mobile number.';
  if (field.name === 'pin' && !/^[1-9]\d{5}$/.test(value)) return 'Enter a valid 6-digit Indian PIN code.';
  return '';
}
function validateCheckoutField(field) {
  const input = checkoutForm.elements.namedItem(field.name);
  const error = checkoutFieldError(field, input);
  input.setAttribute('aria-invalid', String(Boolean(error)));
  checkoutDialog.querySelector(`#checkout-${field.name}-error`).textContent = error;
  return !error;
}
checkoutFields.forEach((field) => {
  const input = checkoutForm.elements.namedItem(field.name);
  input.addEventListener('blur', () => validateCheckoutField(field));
  input.addEventListener('input', () => {
    if (input.getAttribute('aria-invalid') === 'true') validateCheckoutField(field);
    checkoutError.textContent = '';
  });
});
function checkoutTotal() {
  return checkoutLines.reduce((sum, line) => sum + catalog.get(line.id).price * line.quantity, 0);
}
checkoutOpen.addEventListener('click', () => {
  if (!bag.size) return;
  checkoutComplete = false;
  checkoutLines = [...bag.values()].map((line) => ({ ...line }));
  checkoutList.replaceChildren();
  checkoutLines.forEach((line, index) => {
    const product = catalog.get(line.id);
    const row = document.createElement('li');
    const image = document.createElement('img');
    image.src = productImagePath(product.image);
    image.alt = product.name;
    image.width = 48;
    image.height = 60;
    const details = document.createElement('div');
    const name = document.createElement('strong');
    name.textContent = product.name;
    const meta = document.createElement('span');
    meta.textContent = `Size: ${line.size || 'Choose below'} · Qty: ${line.quantity}`;
    details.append(name, meta);
    if (!line.size) {
      const label = document.createElement('label');
      label.textContent = 'Choose size ';
      const select = document.createElement('select');
      select.required = true;
      select.setAttribute('aria-label', `Choose size for ${product.name}`);
      select.innerHTML = `<option value="">Select size</option>${sizes.map((size) => `<option>${size}</option>`).join('')}`;
      select.addEventListener('change', () => {
        checkoutLines[index].size = select.value;
        select.setAttribute('aria-invalid', String(!sizes.includes(select.value)));
        checkoutError.textContent = '';
      });
      label.append(select);
      details.append(label);
    }
    const subtotal = document.createElement('strong');
    subtotal.textContent = currency.format(product.price * line.quantity);
    row.append(image, details, subtotal);
    checkoutList.append(row);
  });
  checkoutDialog.querySelector('#checkout-total').textContent = currency.format(checkoutTotal());
  dismissUndo();
  dialog.close();
  checkoutDialog.showModal();
});
checkoutForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (checkoutComplete) return;
  const validFields = checkoutFields.map(validateCheckoutField).every(Boolean);
  const missingSize = [...checkoutList.querySelectorAll('select')].find((select) => !sizes.includes(select.value));
  if (!validFields || missingSize) {
    checkoutError.textContent = 'Check the highlighted fields before placing your demo order.';
    missingSize?.setAttribute('aria-invalid', 'true');
    (checkoutForm.querySelector('[aria-invalid="true"]') || missingSize).focus();
    return;
  }
  if (!checkoutLines.length || !bag.size) {
    checkoutError.textContent = 'Your bag is empty. Add an outfit before checking out.';
    return;
  }
  checkoutComplete = true;
  checkoutDialog.querySelector('#checkout-reference').textContent = `Demo reference: COLAX-${Date.now().toString(36).toUpperCase()}`;
  checkoutDialog.querySelector('#checkout-confirmed-total').textContent = `${checkoutLines.reduce((sum, line) => sum + line.quantity, 0)} items · ${currency.format(checkoutTotal())}`;
  bag.clear();
  updateBag();
  checkoutForm.reset();
  checkoutDialog.querySelector('#checkout-content').hidden = true;
  const confirmation = checkoutDialog.querySelector('#checkout-confirmation');
  confirmation.hidden = false;
  confirmation.focus();
});
['#checkout-close', '#checkout-back', '#checkout-done'].forEach((selector) => {
  checkoutDialog.querySelector(selector).addEventListener('click', () => checkoutDialog.close());
});
checkoutDialog.addEventListener('close', () => {
  checkoutForm.reset();
  checkoutFields.forEach((field) => {
    checkoutForm.elements.namedItem(field.name).removeAttribute('aria-invalid');
    checkoutDialog.querySelector(`#checkout-${field.name}-error`).textContent = '';
  });
  checkoutError.textContent = '';
  checkoutList.replaceChildren();
  checkoutLines = [];
  checkoutDialog.querySelector('#checkout-content').hidden = false;
  checkoutDialog.querySelector('#checkout-confirmation').hidden = true;
  if (!checkoutComplete) {
    dialog.showModal();
    checkoutOpen.focus();
  } else {
    bagToggle.focus();
  }
});
renderBag();
