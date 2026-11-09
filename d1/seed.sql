CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  shape TEXT NOT NULL,
  color TEXT NOT NULL,
  material TEXT NOT NULL,
  price REAL NOT NULL,
  rating REAL NOT NULL,
  description TEXT NOT NULL
);

DELETE FROM products;

INSERT INTO products (id, name, brand, category, shape, color, material, price, rating, description) VALUES
  ('ray-ban-aviator-classic', 'Ray-Ban Aviator Classic', 'Ray-Ban', 'sunglasses', 'aviator', 'gold', 'metal', 171.00, 4.8, 'Iconic teardrop aviator with G-15 green lenses that cut glare, plus 100% UV protection. Lightweight metal frame with adjustable silicone nose pads, a timeless pick for driving and everyday sun.'),
  ('ray-ban-chromance-polarized', 'Ray-Ban Chromance Polarized', 'Ray-Ban', 'sunglasses', 'aviator', 'matte black', 'metal', 231.00, 4.9, 'Chromance polarized lenses boost contrast and slash road glare, making these a top pick for long drives. Sleek double-bridge frame in matte black.'),
  ('ray-ban-wayfarer-classic', 'Ray-Ban Original Wayfarer Classic', 'Ray-Ban', 'sunglasses', 'wayfarer', 'tortoise', 'acetate', 165.00, 4.7, 'The bold trapezoidal frame that defined sunglasses culture. Durable acetate build with a warm tortoise finish that flatters most face shapes.'),
  ('ray-ban-round-metal', 'Ray-Ban Round Metal', 'Ray-Ban', 'sunglasses', 'round', 'silver', 'metal', 155.00, 4.6, 'Retro round lenses in a slim silver metal frame with skull temples. Perfect for oval and square faces, full UV protection included.'),
  ('ray-ban-rx5154-blue-light', 'Ray-Ban RX5154 Blue-Light Glasses', 'Ray-Ban', 'blue-light', 'square', 'tortoise', 'acetate', 150.00, 4.5, 'Clubmaster-inspired square frames with blue-light filtering lenses for long screen sessions. Classic tortoise acetate with gold-tone accents.'),
  ('oakley-holbrook-polarized', 'Oakley Holbrook Polarized', 'Oakley', 'sunglasses', 'wayfarer', 'matte black', 'O Matter', 173.00, 4.8, 'Classic American wayfarer styling with Prizm polarized lenses tuned for contrast and clarity. Lightweight O Matter frame with a Three-Point fit.'),
  ('oakley-radar-ev-path', 'Oakley Radar EV Path', 'Oakley', 'sunglasses', 'sport', 'polished white', 'O Matter', 166.00, 4.7, 'Half-rim shield lens built for running and cycling. Prizm Trail lenses sharpen detail on bright roads while the no-slip Unobtainium nose pad keeps everything locked in.'),
  ('oakley-turbine-rotor', 'Oakley Turbine Rotor', 'Oakley', 'sunglasses', 'sport', 'steel', 'O Matter', 200.00, 4.5, 'Wraparound sport sunglasses with a wide Plutonite lens for full coverage. Stress-resistant O Matter frame stays put through workouts and trail runs.'),
  ('persol-649-original', 'Persol 649 Original', 'Persol', 'sunglasses', 'square', 'tortoise', 'acetate', 347.00, 4.7, 'Handcrafted Italian classic with the patented Flexible Tips and light-blue lens tint. Meflecto temples flex for all-day comfort.'),
  ('persol-calligrapher-edition', 'Persol Calligrapher Edition', 'Persol', 'sunglasses', 'square', 'coffee', 'acetate', 336.00, 4.6, 'Artisan acetate inspired by calligraphic lines, with crystal polarized lenses. Bold profile hand-finished in Italy.'),
  ('persol-po3007v', 'Persol PO3007V Eyeglasses', 'Persol', 'eyeglasses', 'square', 'havana', 'acetate', 305.00, 4.6, 'Refined havana acetate optical frames with the signature silver Arrow emblem. Handmade in Italy with Meflecto flexible temples.'),
  ('gucci-cat-eye-crystal', 'Gucci GG0811S Cat-Eye', 'Gucci', 'sunglasses', 'cat-eye', 'black', 'acetate', 450.00, 4.5, 'Statement cat-eye silhouette with crystal-embellished temples and the Interlocking G detail. Full UV protection in a luxury black acetate.'),
  ('gucci-aviator-web', 'Gucci Aviator with Web', 'Gucci', 'sunglasses', 'aviator', 'green gold', 'metal', 430.00, 4.4, 'Aviator frame in gold metal with the signature green-and-red Web stripe. Tinted lenses offer full UV protection with unmistakable Gucci flair.'),
  ('gucci-rectangular-optical', 'Gucci GG0392O Rectangular Glasses', 'Gucci', 'eyeglasses', 'rectangular', 'beige', 'acetate', 440.00, 4.3, 'Minimal rectangular optical frames in a soft beige acetate with engraved Gucci logo on the temple. Ready for prescription lenses.'),
  ('prada-cat-eye-sunglasses', 'Prada PR 01VS Cat-Eye', 'Prada', 'sunglasses', 'cat-eye', 'black', 'acetate', 395.00, 4.6, 'Sculpted cat-eye with an upswept browline and polished black acetate. Oversized lenses deliver category-leading UV protection.'),
  ('prada-linea-rossa-sport', 'Prada Linea Rossa PS 04WS', 'Prada', 'sunglasses', 'sport', 'gunmetal', 'nylon fiber', 320.00, 4.5, 'Aerodynamic sport shield from the Linea Rossa collection. Lightweight nylon frame with wraparound lenses and the signature red stripe.'),
  ('warby-percey-sunglasses', 'Warby Parker Percey Sunglasses', 'Warby Parker', 'sunglasses', 'round', 'sea glass gray', 'acetate', 145.00, 4.6, 'Vintage-inspired round frames with Polarized Gray lenses that reduce glare by the water or on the road. Hand-polished acetate in a soft sea glass gray.'),
  ('warby-durand-sunglasses', 'Warby Parker Durand Sunglasses', 'Warby Parker', 'sunglasses', 'square', 'rose crystal', 'acetate', 155.00, 4.5, 'Wide, square frames with gently angled corners in translucent rose crystal. Polarized lens options make them easy on the eyes in full sun.'),
  ('warby-haskell-eyeglasses', 'Warby Parker Haskell Eyeglasses', 'Warby Parker', 'eyeglasses', 'rectangular', 'oak barrel', 'acetate', 95.00, 4.7, 'Best-selling rectangular frames with softly rounded edges in a warm oak barrel finish. Impact-resistant polycarbonate lenses included.'),
  ('warby-lark-titanium', 'Warby Parker Lark Titanium Glasses', 'Warby Parker', 'eyeglasses', 'round', 'brushed silver', 'titanium', 105.00, 4.6, 'Featherlight wireframe rounds in corrosion-resistant titanium. Adjustable nose pads and a barely-there 12-gram build.'),
  ('warby-fiolet-blue-light', 'Warby Parker Fiolet Blue-Light Glasses', 'Warby Parker', 'blue-light', 'square', 'crystal clear', 'acetate', 95.00, 4.5, 'Crystal-clear square frames with built-in blue-light filtering lenses, standard at no extra cost. Great for all-day laptop work.'),
  ('zenni-titanium-round', 'Zenni Round Titanium Glasses', 'Zenni', 'eyeglasses', 'round', 'gunmetal', 'titanium', 29.95, 4.5, 'Ultra-lightweight full-rim rounds in flexible titanium, barely 9 grams. An affordable everyday frame with spring hinges.'),
  ('zenni-rectangle-classic', 'Zenni Classic Rectangle Glasses', 'Zenni', 'eyeglasses', 'rectangular', 'matte brown', 'acetate', 19.95, 4.3, 'Budget-friendly rectangular acetate frame with a matte finish. Custom prescription lenses and coatings available at checkout.'),
  ('zenni-blokz-blue-light-round', 'Zenni Blokz Blue-Light Round Glasses', 'Zenni', 'blue-light', 'round', 'tortoise', 'acetate', 25.95, 4.4, 'Blokz blue-light lenses filter up to 98% of screen glare in a lightweight tortoise round frame. An easy upgrade for students and remote workers.'),
  ('kirkland-signature-polarized-sunglasses', 'Kirkland Signature Polarized Sunglasses', 'Costco', 'sunglasses', 'wayfarer', 'black', 'nylon', 39.99, 4.4, 'Polarized wayfarer-style sunglasses with 100% UVA and UVB protection at a warehouse-club price. Includes a hard case and microfiber pouch.'),
  ('kirkland-signature-blue-light-readers', 'Kirkland Signature Blue-Light Reading Glasses', 'Costco', 'blue-light', 'rectangular', 'black', 'plastic', 29.99, 4.3, 'Three-pair multipack of rectangular readers with anti-glare blue-light coating. Spring-hinge temples for a comfortable fit.'),
  ('persol-suprema-blue-light', 'Persol Suprema Blue-Light Glasses', 'Persol', 'blue-light', 'oval', 'transparent brown', 'acetate', 280.00, 4.4, 'Handcrafted transparent brown acetate with blue-light filtering lenses and the legendary Templed Arrow. Italian craft meets screen-time comfort.');
