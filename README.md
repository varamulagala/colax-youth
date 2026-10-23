# COLAX Youth

A separate youth streetwear concept made with HTML, CSS, and vanilla JavaScript.

Open index.html in your browser. No installation or build step is needed.

Each of the 22 outfits has a static detail page in products/, linked from its image and name on both grids. Detail pages include the full garment image, sale price, material, pictured colour, XS–XXL size selection, related styles, and the shared saved bag and demo checkout. Only the pictured colour is offered. After editing catalog data or shared page markup, regenerate with `node scripts/build-products.cjs`. product-detail.js handles inline size selection and uses the same bag logic as the collection popup.

The full collection page includes a Sort By control for sale price (low to high or high to low), plus Featured to restore the original order. Sorting works with All / Men / Women filters. The home page has no sorting control.

Search outfits by name on the full collection page. Search is case-insensitive, matches all entered words, and combines with the selected category and price order. Clear removes the search text; the no-results message offers a reset of search and category. Search and sorting leave the home page unchanged.

- index.html: campaign, sample products, culture section, and lookbook.
- collection.html: full clothing gallery reached through See More, displaying all 13 men's and 9 women's images with All / Men / Women filters. The home page keeps its four featured styles.
- style.css: warm ivory, burgundy, charcoal, and taupe palette, bold typography, responsive layouts.
- script.js: mobile navigation, All / Men / Women collection filters, and a persistent demo bag with quantity controls and INR totals. The main collection displays two men's styles (Men-01 and Men-02) and two women's styles (Ladies-01 and Ladies-02).

All seven images are AI-generated concept imagery, stored locally in images/. They work offline. See images/PROMPTS.md for the generation briefs. Replace concept product images with accurate product photography before selling. Products and prices are examples; checkout is a browser-only simulation with no payment processing.

checkout.js adds Demo Checkout to nonempty bags on both pages. It validates name, email, Indian mobile number, street address, city, state, and a six-digit PIN code, with inline errors and keyboard focus on the first invalid field. The summary shows outfit thumbnails, sizes, quantities, and totals; legacy unsized items require a size before submitting. Successful submission shows a demo reference and total, then clears the saved bag. Cancelling preserves the bag. Customer details are never stored or sent and are cleared on closing the form.

The demo bag saves product IDs and quantities in localStorage when available; it handles invalid saved data and blocked storage. The lookbook combines Lookbook-01.png through Lookbook-03.png with the original friends and city images in matching 2:3 portrait frames. The desktop gallery pairs a staggered trio with a centered pair, becomes two columns on tablets, and stacks on mobile. Images use object-fit: cover for consistent sizing with minimal cropping.

Add to Bag opens a size picker on both pages, with XS, S, M, L, XL, and XXL. Choose a size before confirming. Each product/size combination has its own quantity and is saved across reloads and pages. Older saved bags are preserved with “Size not selected” rather than assigning a size automatically.

Removing an item (including reducing its quantity to zero) or clearing the bag shows an Undo button inside the bag for three seconds. Undo restores the most recent removal with its sizes and quantities.
