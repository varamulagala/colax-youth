// Product pages share the catalog, saved bag, notifications, and checkout.
const detailForm = document.querySelector('#product-form');
if (detailForm) {
  const detailButton = detailForm.querySelector('[type="submit"]');
  const detailError = document.querySelector('#product-error');
  detailButton.hidden = false;
  detailForm.addEventListener('change', () => { detailError.textContent = ''; });
  detailForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const size = new FormData(detailForm).get('size');
    if (!sizes.includes(size)) {
      detailError.textContent = 'Choose your size before adding this outfit.';
      detailForm.querySelector('input[name="size"]').focus();
      return;
    }
    if (!addToBag(detailForm.dataset.product, size)) {
      detailError.textContent = 'Maximum quantity is 99 per size. Update your bag or choose another size.';
      return;
    }
    detailError.textContent = '';
  });
}
