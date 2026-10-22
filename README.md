# COLAX Youth

A separate youth streetwear concept made with HTML, CSS, and vanilla JavaScript.

Open index.html in your browser. No installation or build step is needed.

- index.html: campaign, sample products, culture section, and lookbook.
- style.css: warm ivory, burgundy, charcoal, and taupe palette, bold typography, responsive layouts.
- script.js: mobile navigation, All / Men / Women collection filters, and a persistent demo bag with quantity controls and INR totals. The main collection displays two men's styles (Men-01 and Men-02) and two women's styles (Ladies-01 and Ladies-02).

All seven images are AI-generated concept imagery, stored locally in images/. They work offline. See images/PROMPTS.md for the generation briefs. Replace concept product images with accurate product photography before selling. Products and prices are examples; there is no checkout or payment processing.

The demo bag saves product IDs and quantities in localStorage when available; it handles invalid saved data and blocked storage. The lookbook combines Lookbook-01.png through Lookbook-03.png with the original friends and city images in matching 2:3 portrait frames. The desktop gallery pairs a staggered trio with a centered pair, becomes two columns on tablets, and stacks on mobile. Images use object-fit: cover for consistent sizing with minimal cropping.
