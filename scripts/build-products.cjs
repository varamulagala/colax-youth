// Build static detail pages from the existing catalog and collection cards.
// Run from the project root: node scripts/build-products.cjs
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const catalogSource = script.slice(script.indexOf('const catalog ='), script.indexOf('// Sorting is available'));
const catalog = vm.runInNewContext(`${catalogSource}\ncatalog`);
const collection = fs.readFileSync(path.join(root, 'collection.html'), 'utf8');
const header = collection.match(/<header>[^]*?<\/header>/)[0].replace('href="#drop" aria-current="page"', 'href="collection.html"');
const footer = collection.match(/<footer[^]*?<\/footer>/)[0].replaceAll('href="#drop"', 'href="collection.html"');
const bagMarkup = collection.match(/<dialog id="bag"[^]*?<\/dialog><div id="toast"[^]*?<\/div>/)[0];
const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const money = (value) => `&#8377;${value.toLocaleString('en-IN')}`;
const pageUrl = (id) => `products/${id}.html`;
const colourData = {
  'Cream': ['Cream', '#e9dfc9'], 'White': ['White', '#ffffff'], 'Black': ['Black', '#202020'],
  'Slate Blue': ['Slate blue', '#6a7b89'], 'Mustard': ['Mustard', '#b48b30'], 'Stone': ['Stone', '#b7b0a0'],
  'Cobalt': ['Cobalt', '#2458ab'], 'Sage': ['Sage', '#9ba68d'], 'Burgundy': ['Burgundy', '#751f38'],
  'Charcoal': ['Charcoal', '#494949'], 'Indigo': ['Indigo', '#344766'], 'Brown': ['Brown', '#78563e'],
  'Champagne': ['Champagne', '#d9c7a5'], 'Grey': ['Grey', '#a5a5a5'], 'Light Wash': ['Light wash denim', '#a2bbd0'],
  'Taupe': ['Taupe', '#aa9986'], 'Ivory': ['Ivory', '#f1ebdd'],
};
const products = [...catalog].map(([id, product]) => {
  const card = [...collection.matchAll(/<article data-category="[^"]+">[^]*?<\/article>/g)]
    .map((m) => m[0]).find((html) => html.includes(`data-add="${id}"`));
  if (!card) throw new Error(`Missing card: ${id}`);
  const material = card.match(/Material: ([^<]+)/)[1];
  const colour = Object.entries(colourData).find(([prefix]) => product.name.startsWith(prefix))?.[1];
  if (!colour) throw new Error(`Missing colour: ${id}`);
  return { id, ...product, material, colour, category: id.startsWith('men-') ? 'men' : 'women' };
});
fs.mkdirSync(path.join(root, 'products'), { recursive: true });
for (const product of products) {
  const { id, name, price, originalPrice, image, material, colour, category } = product;
  const related = products.filter((p) => p.category === category && p.id !== id).slice(0, 3);
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(name)} | COLAX</title><meta name="description" content="Explore the COLAX ${esc(name)} in ${esc(colour[0])}. View details, choose XS–XXL, and add your fit to the demo bag."><link rel="stylesheet" href="style.css"><script src="script.js" defer></script><script src="product-detail.js" defer></script><script src="checkout.js" defer></script></head>
<body class="product-page" data-category="${category}"><a class="skip" href="#main">Skip to content</a>${header}
<main id="main" class="product-main"><nav class="product-breadcrumbs" aria-label="Breadcrumb"><a href="index.html">HOME</a><span aria-hidden="true">/</span><a href="collection.html">COLLECTION</a><span aria-hidden="true">/</span><span aria-current="page">${esc(name)}</span></nav>
<section class="product-detail" aria-labelledby="product-title"><div class="detail-image"><span class="detail-category">${category.toUpperCase()} / THE COLAX EDIT</span><img src="${esc(image)}" alt="${esc(name)} in ${esc(colour[0])}" width="1254" height="1254" fetchpriority="high"></div>
<div class="detail-copy"><p class="eyebrow">EVERYDAY ROTATION / COLAX</p><h1 id="product-title">${esc(name)}</h1><div class="detail-price"><strong>${money(price)}</strong><del>${money(originalPrice)}</del><span>30% OFF</span></div><p class="detail-savings">Save ${money(originalPrice - price)} on this style.</p>
<p class="detail-description">Make the ${esc(name.toLowerCase())} part of your everyday rotation. Style it your way, from simple pairings to layered looks.</p>
<div class="detail-colour"><span class="detail-label">COLOUR</span><span class="colour-value"><span class="colour-swatch" style="--swatch:${colour[1]}" aria-hidden="true"></span>${esc(colour[0])}</span></div>
<form id="product-form" data-product="${id}"><fieldset class="size-options"><legend>CHOOSE YOUR SIZE</legend>${['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => `<label><input type="radio" name="size" value="${size}" required><span>${size}</span></label>`).join('')}</fieldset><p id="product-error" role="alert"></p><button type="submit" class="button detail-add" hidden>ADD TO BAG <span aria-hidden="true">+</span></button><noscript><p>Enable JavaScript to choose a size and use the demo bag.</p></noscript></form>
<p class="detail-demo">Portfolio demo · No real payments or orders.</p><div class="detail-facts"><details open><summary>THE DETAILS</summary><dl><div><dt>Material</dt><dd>${esc(material)}</dd></div><div><dt>Colour</dt><dd>${esc(colour[0])}</dd></div><div><dt>Sizes</dt><dd>XS, S, M, L, XL, XXL</dd></div></dl></details><details><summary>STYLE &amp; SIZING</summary><p>Choose your usual letter size for this demo. Product measurements and additional colour variants are not available.</p></details></div></div></section>
<section class="related-products" aria-labelledby="related-title"><div class="related-heading"><div><p class="eyebrow">KEEP THE ROTATION GOING</p><h2 id="related-title">MORE YOUR STYLE.</h2></div><a class="text-link" href="collection.html">VIEW COLLECTION ↗</a></div><div class="related-grid">${related.map((p) => `<a class="related-card" href="${pageUrl(p.id)}"><img src="${esc(p.image)}" width="1254" height="1254" alt="${esc(p.name)}" loading="lazy"><h3>${esc(p.name)}</h3><span>${money(p.price)}</span></a>`).join('')}</div></section>
</main>${footer}${bagMarkup}</body></html>
`;
  const relativeHtml = html.replace(/(href|src)="([^"]+)"/g, (match, attr, url) => {
    if (/^(#|mailto:|https?:)/.test(url)) return match;
    return `${attr}="../${url}"`;
  });
  fs.writeFileSync(path.join(root, pageUrl(id)), relativeHtml);
}
// Link cards without wrapping Add to Bag inside an anchor; repeat runs are safe.
for (const filename of ['index.html', 'collection.html']) {
  const file = path.join(root, filename);
  const html = fs.readFileSync(file, 'utf8').replace(/<article data-category="[^"]+">[^]*?<\/article>/g, (card) => {
    const id = card.match(/data-add="([^"]+)"/)[1];
    if (card.includes('class="product-image-link"')) return card;
    return card.replace(/<img [^>]+>/, (img) => `<a class="product-image-link" href="${pageUrl(id)}" aria-label="View ${esc(catalog.get(id).name)}">${img}</a>`)
      .replace(/<h3>([^<]+)<\/h3>/, `<h3><a href="${pageUrl(id)}">$1</a></h3>`);
  });
  fs.writeFileSync(file, html);
}
console.log(`Generated ${products.length} product pages and linked both collection grids.`);
