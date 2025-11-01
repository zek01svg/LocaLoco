-- create db and use
DROP DATABASE IF EXISTS wad2_project;
CREATE DATABASE wad2_project;
USE wad2_project;

INSERT INTO user (id, name, email, email_verified, image, has_business) VALUES
('user-id-001', 'Alice Smith', 'user1@example.com', true, 'https://example.com/img/alice.png', true),
('user-id-002', 'Bob Johnson', 'user2@example.com', true, 'https://example.com/img/bob.png', false),
('user-id-003', 'Charlie Brown', 'user3@example.com', false, NULL, false),
('user-id-004', 'David Lee', 'user4@example.com', true, NULL, NULL),
('user-id-005', 'Emily White', 'user5@example.com', true, 'https://example.com/img/emily.png', true),
('user-id-006', 'Frank Harris', 'user6@example.com', false, NULL, false),
('user-id-007', 'Grace Hall', 'user7@example.com', true, NULL, false),
('user-id-008', 'Henry Clark', 'user8@example.com', true, NULL, NULL),
('user-id-009', 'Ivy Lewis', 'user9@example.com', false, NULL, true),
('user-id-010', 'Jack Walker', 'user10@example.com', true, 'https://example.com/img/jack.png', false),
('user-id-011', 'Kate Young', 'user11@example.com', true, NULL, false),
('user-id-012', 'Liam King', 'user12@example.com', false, NULL, NULL),
('user-id-013', 'Mia Wright', 'user13@example.com', true, NULL, false),
('user-id-014', 'Noah Scott', 'user14@example.com', true, 'https://example.com/img/noah.png', true),
('user-id-015', 'Olivia Green', 'user15@example.com', false, NULL, false),
('user-id-016', 'Peter Adams', 'user16@example.com', true, NULL, false),
('user-id-017', 'Quinn Baker', 'user17@example.com', true, NULL, NULL),
('user-id-018', 'Rachel Nelson', 'user18@example.com', false, NULL, true),
('user-id-019', 'Sam Carter', 'user19@example.com', true, NULL, false),
('user-id-020', 'Tina Roberts', 'user20@example.com', true, 'https://example.com/img/tina.png', false),
('user-id-021', 'Uma Patel', 'user21@example.com', false, NULL, false),
('user-id-022', 'Victor Perez', 'user22@example.com', true, NULL, NULL),
('user-id-023', 'Wendy Hall', 'user23@example.com', true, NULL, true),
('user-id-024', 'Xander Kim', 'user24@example.com', false, NULL, false),
('user-id-025', 'Yara Reed', 'user25@example.com', true, NULL, false),
('user-id-026', 'Zane Turner', 'user26@example.com', true, NULL, NULL),
('user-id-027', 'Amy Davis', 'user27@example.com', false, NULL, true),
('user-id-028', 'Ben Miller', 'user28@example.com', true, NULL, false),
('user-id-029', 'Chloe Wilson', 'user29@example.com', true, NULL, false),
('user-id-030', 'Dan Moore', 'user30@example.com', false, NULL, false);

-- Businesses data
INSERT INTO businesses (uen, business_name, business_category, description, address, open247, email, phone_number, website_link, social_media_link, wallpaper, date_of_creation, price_tier, offers_delivery, offers_pickup) VALUES
('202301234A', 'The Daily Loaf Bakery', 'fnb', 'Artisanal breads and pastries baked fresh daily with premium ingredients', '123 Orchard Road, Singapore 238858', FALSE, 'hello@dailyloaf.sg', '+65 6234 5678', 'https://www.dailyloaf.sg', 'https://instagram.com/dailyloafbakery', 'The_Daily_Loaf_Bakery.jpg', '2023-01-15', 'medium', TRUE, TRUE),
('202302456B', 'Gents Grooming Parlor', 'services', 'Traditional barbershop offering classic cuts and modern styling for gentlemen', '456 Tanjong Pagar Road, Singapore 088463', FALSE, 'book@gentsgrooming.sg', '+65 6345 6789', 'https://www.gentsgrooming.sg', 'https://facebook.com/gentsgrooming', 'Gents_Grooming_Parlor.jpg', '2023-02-20', 'medium', FALSE, FALSE),
('202303789C', 'Java Junction Cafe', 'fnb', 'Specialty coffee and light bites in a cozy atmosphere perfect for work or relaxation', '789 Bugis Street, Singapore 188735', FALSE, 'info@javajunction.sg', '+65 6456 7890', 'https://www.javajunction.sg', 'https://instagram.com/javajunctionsg', 'Java_Junction_Cafe.jpg', '2023-03-10', 'low', TRUE, TRUE),
('202304012D', 'FitCore Studio', 'health_wellness', 'High-intensity fitness training with certified instructors and state-of-the-art equipment', '321 Marina Boulevard, Singapore 018985', FALSE, 'register@fitcorestudio.sg', '+65 6567 8901', 'https://www.fitcorestudio.sg', 'https://instagram.com/fitcoresg', 'FitCore_Studio.jpg', '2023-04-05', 'high', FALSE, FALSE),
('202305345E', 'Artisan Alley Crafts', 'retail', 'Handmade crafts and unique gifts created by local artisans', '234 Haji Lane, Singapore 189218', FALSE, 'shop@artisanalley.sg', '+65 6678 9012', 'https://www.artisanalley.sg', 'https://instagram.com/artisanalleysg', 'Artisan_Alley_Crafts.jpg', '2023-05-18', 'medium', FALSE, TRUE),
('202306678F', 'GreenScape Solutions', 'services', 'Professional landscaping and garden maintenance services for residential and commercial properties', '567 Changi Business Park, Singapore 486025', FALSE, 'enquiry@greenscape.sg', '+65 6789 0123', 'https://www.greenscape.sg', 'https://facebook.com/greenscapesg', 'GreenScape_Solutions.jpg', '2023-06-22', 'high', FALSE, FALSE),
('202307901G', 'Chapter & Verse Books', 'retail', 'Independent bookstore featuring curated selections and rare finds for book lovers', '890 Bras Basah Road, Singapore 189555', FALSE, 'hello@chapterverse.sg', '+65 6890 1234', 'https://www.chapterverse.sg', 'https://instagram.com/chapterversesg', 'Chapter_&_Verse_Books.jpg', '2023-07-08', 'low', TRUE, TRUE),
('202308234H', 'Chic Street Boutique', 'retail', 'Trendy fashion and accessories for the modern woman', '145 Arab Street, Singapore 199827', FALSE, 'shop@chicstreet.sg', '+65 6901 2345', 'https://www.chicstreet.sg', 'https://instagram.com/chicstreetsg', 'Chic_Street_Boutique.jpg', '2023-08-14', 'medium', TRUE, TRUE),
('202309567I', 'Elegance & Co', 'retail', 'Premium designer fashion and luxury accessories for discerning customers', '2 Orchard Turn, ION Orchard, Singapore 238801', FALSE, 'concierge@eleganceco.sg', '+65 6012 3456', 'https://www.eleganceco.sg', 'https://instagram.com/elegancecosg', 'Elegance_&_Co.jpg', '2023-09-01', 'high', FALSE, TRUE),
('202310890J', 'Mama\'s Kitchen', 'fnb', 'Home-style comfort food with authentic local flavors in a warm family setting', '678 Tiong Bahru Road, Singapore 158789', FALSE, 'reservations@mamaskitchen.sg', '+65 6123 4567', 'https://www.mamaskitchen.sg', 'https://facebook.com/mamaskitchensg', 'Mama\'s_Kitchen.jpg', '2023-10-12', 'low', TRUE, TRUE),
('202312456L', 'Pawfect Grooming', 'services', 'Professional pet grooming services with gentle care for your furry friends', '234 Serangoon Road, Singapore 218078', FALSE, 'book@pawfectgrooming.sg', '+65 6345 6789', 'https://www.pawfectgrooming.sg', 'https://instagram.com/pawfectsg', 'Pawfect_Grooming.jpeg', '2023-12-05', 'medium', FALSE, TRUE);

-- Payment options
INSERT INTO business_payment_options (uen, payment_option) VALUES
('202301234A', 'cash'), ('202301234A', 'card'), ('202301234A', 'paynow'), ('202301234A', 'digital_wallets'),
('202302456B', 'cash'), ('202302456B', 'card'), ('202302456B', 'paynow'),
('202303789C', 'cash'), ('202303789C', 'card'), ('202303789C', 'digital_wallets'),
('202304012D', 'card'), ('202304012D', 'paynow'), ('202304012D', 'digital_wallets'),
('202305345E', 'cash'), ('202305345E', 'card'), ('202305345E', 'paynow'),
('202306678F', 'card'), ('202306678F', 'paynow'),
('202307901G', 'cash'), ('202307901G', 'card'), ('202307901G', 'paynow'), ('202307901G', 'digital_wallets'),
('202308234H', 'card'), ('202308234H', 'paynow'), ('202308234H', 'digital_wallets'),
('202309567I', 'card'), ('202309567I', 'digital_wallets'),
('202310890J', 'cash'), ('202310890J', 'card'), ('202310890J', 'paynow'), ('202310890J', 'digital_wallets'),
('202312456L', 'cash'), ('202312456L', 'card'), ('202312456L', 'paynow'), ('202312456L', 'digital_wallets');

-- Opening hours
INSERT INTO business_opening_hours (uen, day_of_week, open_time, close_time) VALUES
-- The Daily Loaf Bakery
('202301234A', 'Monday', '07:00:00', '19:00:00'),
('202301234A', 'Tuesday', '07:00:00', '19:00:00'),
('202301234A', 'Wednesday', '07:00:00', '19:00:00'),
('202301234A', 'Thursday', '07:00:00', '19:00:00'),
('202301234A', 'Friday', '07:00:00', '19:00:00'),
('202301234A', 'Saturday', '08:00:00', '18:00:00'),
('202301234A', 'Sunday', '08:00:00', '17:00:00'),

-- Gents Grooming Parlor
('202302456B', 'Tuesday', '10:00:00', '20:00:00'),
('202302456B', 'Wednesday', '10:00:00', '20:00:00'),
('202302456B', 'Thursday', '10:00:00', '20:00:00'),
('202302456B', 'Friday', '10:00:00', '20:00:00'),
('202302456B', 'Saturday', '09:00:00', '19:00:00'),
('202302456B', 'Sunday', '09:00:00', '18:00:00'),

-- Java Junction Cafe
('202303789C', 'Monday', '08:00:00', '22:00:00'),
('202303789C', 'Tuesday', '08:00:00', '22:00:00'),
('202303789C', 'Wednesday', '08:00:00', '22:00:00'),
('202303789C', 'Thursday', '08:00:00', '22:00:00'),
('202303789C', 'Friday', '08:00:00', '23:00:00'),
('202303789C', 'Saturday', '09:00:00', '23:00:00'),
('202303789C', 'Sunday', '09:00:00', '22:00:00'),

-- FitCore Studio
('202304012D', 'Monday', '06:00:00', '22:00:00'),
('202304012D', 'Tuesday', '06:00:00', '22:00:00'),
('202304012D', 'Wednesday', '06:00:00', '22:00:00'),
('202304012D', 'Thursday', '06:00:00', '22:00:00'),
('202304012D', 'Friday', '06:00:00', '22:00:00'),
('202304012D', 'Saturday', '08:00:00', '20:00:00'),
('202304012D', 'Sunday', '08:00:00', '20:00:00'),

-- Artisan Alley Crafts
('202305345E', 'Wednesday', '11:00:00', '19:00:00'),
('202305345E', 'Thursday', '11:00:00', '19:00:00'),
('202305345E', 'Friday', '11:00:00', '20:00:00'),
('202305345E', 'Saturday', '10:00:00', '20:00:00'),
('202305345E', 'Sunday', '10:00:00', '19:00:00'),

-- GreenScape Solutions
('202306678F', 'Monday', '08:00:00', '18:00:00'),
('202306678F', 'Tuesday', '08:00:00', '18:00:00'),
('202306678F', 'Wednesday', '08:00:00', '18:00:00'),
('202306678F', 'Thursday', '08:00:00', '18:00:00'),
('202306678F', 'Friday', '08:00:00', '18:00:00'),
('202306678F', 'Saturday', '08:00:00', '13:00:00'),

-- Chapter & Verse Books
('202307901G', 'Monday', '10:00:00', '21:00:00'),
('202307901G', 'Tuesday', '10:00:00', '21:00:00'),
('202307901G', 'Wednesday', '10:00:00', '21:00:00'),
('202307901G', 'Thursday', '10:00:00', '21:00:00'),
('202307901G', 'Friday', '10:00:00', '22:00:00'),
('202307901G', 'Saturday', '10:00:00', '22:00:00'),
('202307901G', 'Sunday', '11:00:00', '20:00:00'),

-- Chic Street Boutique
('202308234H', 'Monday', '11:00:00', '20:00:00'),
('202308234H', 'Tuesday', '11:00:00', '20:00:00'),
('202308234H', 'Wednesday', '11:00:00', '20:00:00'),
('202308234H', 'Thursday', '11:00:00', '20:00:00'),
('202308234H', 'Friday', '11:00:00', '21:00:00'),
('202308234H', 'Saturday', '10:00:00', '21:00:00'),
('202308234H', 'Sunday', '11:00:00', '20:00:00'),

-- Elegance & Co
('202309567I', 'Monday', '10:00:00', '22:00:00'),
('202309567I', 'Tuesday', '10:00:00', '22:00:00'),
('202309567I', 'Wednesday', '10:00:00', '22:00:00'),
('202309567I', 'Thursday', '10:00:00', '22:00:00'),
('202309567I', 'Friday', '10:00:00', '22:00:00'),
('202309567I', 'Saturday', '10:00:00', '22:00:00'),
('202309567I', 'Sunday', '10:00:00', '22:00:00'),

-- Mama's Kitchen
('202310890J', 'Monday', '11:00:00', '21:30:00'),
('202310890J', 'Tuesday', '11:00:00', '21:30:00'),
('202310890J', 'Wednesday', '11:00:00', '21:30:00'),
('202310890J', 'Thursday', '11:00:00', '21:30:00'),
('202310890J', 'Friday', '11:00:00', '22:00:00'),
('202310890J', 'Saturday', '10:30:00', '22:00:00'),
('202310890J', 'Sunday', '10:30:00', '21:30:00'),

-- Pawfect Grooming
('202312456L', 'Tuesday', '09:00:00', '18:00:00'),
('202312456L', 'Wednesday', '09:00:00', '18:00:00'),
('202312456L', 'Thursday', '09:00:00', '18:00:00'),
('202312456L', 'Friday', '09:00:00', '18:00:00'),
('202312456L', 'Saturday', '09:00:00', '19:00:00'),
('202312456L', 'Sunday', '10:00:00', '17:00:00');

-- 55 reviews for 'business_reviews' table (5 reviews for each of the 11 businesses)

INSERT INTO business_reviews (user_email, business_uen, rating, body, like_count, created_at) VALUES
-- Reviews for 'The Daily Loaf Bakery' (202301234A)
('user1@example.com', '202301234A', 5, 'Absolutely the best sourdough in Singapore. The crust is perfect and the crumb is so soft. Worth every penny!', 22, '2025-10-20 08:30:00'),
('user2@example.com', '202301234A', 4, 'Great croissants, very flaky and buttery. The coffee is decent too. It gets crowded on weekend mornings, so come early.', 10, '2025-10-21 09:15:00'),
('user3@example.com', '202301234A', 5, 'I love their seasonal pastries. The kouign amann is a must-try! Staff are always friendly.', 15, '2025-10-22 11:00:00'),
('user4@example.com', '202301234A', 3, 'The bread is good, but honestly a bit overpriced. I can find similar quality for less elsewhere.', 2, '2025-10-23 14:20:00'),
('user5@example.com', '202301234A', 4, 'Nice selection of artisanal breads. Their seeded loaf is fantastic for sandwiches. Pickup was easy.', 7, '2025-10-24 10:05:00'),

-- Reviews for 'Gents Grooming Parlor' (202302456B)
('user6@example.com', '202302456B', 5, 'Classic barbershop experience. David gave me a sharp cut and a fantastic hot towel shave. Felt like a new man.', 18, '2025-10-20 13:00:00'),
('user7@example.com', '202302456B', 4, 'Solid haircut. The barbers really listen to what you want. The ambiance is cool and old-school. Easy to book online.', 9, '2025-10-21 17:30:00'),
('user8@example.com', '202302456B', 2, 'The wait was ridiculously long, even with an appointment. My cut felt rushed and wasn''t what I asked for.', 3, '2025-10-22 18:00:00'),
('user9@example.com', '202302456B', 5, 'Best fade I''ve had in Tanjong Pagar. The place is clean, professional, and they take their time. Highly recommend.', 14, '2025-10-23 16:45:00'),
('user10@example.com', '202302456B', 4, 'Good, reliable spot for a gentleman''s cut. A bit pricey, but the quality and service are consistent.', 6, '2025-10-24 12:00:00'),

-- Reviews for 'Java Junction Cafe' (202303789C)
('user11@example.com', '202303789C', 5, 'My favourite cozy corner in Bugis. The flat white is consistently excellent, and there are plenty of power sockets to work.', 25, '2025-10-20 10:10:00'),
('user12@example.com', '202303789C', 4, 'Nice latte art and friendly baristas. Their cheesecake is surprisingly good! A great place to relax.', 11, '2025-10-21 15:00:00'),
('user13@example.com', '202303789C', 3, 'Coffee is decent, but the WiFi is very slow, which is annoying for a cafe that seems geared towards students/workers.', 1, '2025-10-22 13:30:00'),
('user14@example.com', '202303789C', 4, 'Great value for money. The breakfast set is affordable and tasty. Love the chill music they play.', 8, '2025-10-23 09:00:00'),
('user15@example.com', '202303789C', 4, 'A solid choice for a coffee break. Good, strong cold brew and tasty sandwiches.', 5, '2025-10-24 16:00:00'),

-- Reviews for 'FitCore Studio' (202304012D)
('user16@example.com', '202304012D', 5, 'Incredible workout! The instructors are high-energy and really push you. Facilities are spotless.', 30, '2025-10-20 18:30:00'),
('user17@example.com', '202304012D', 2, 'Way too expensive. The classes are always overbooked, so you barely have space to move. Not worth the "high" price tier.', 4, '2025-10-21 19:00:00'),
('user18@example.com', '202304012D', 5, 'Best HIIT studio in the CBD. The equipment is state-of-the-art and the community is very motivating.', 22, '2025-10-22 07:30:00'),
('user19@example.com', '202304012D', 4, 'Tough classes, but you get results. The changing rooms are luxurious. Wish they had more class timings on weekends.', 12, '2025-10-23 18:45:00'),
('user20@example.com', '202304012D', 4, 'The trainers are great at correcting your form. It''s an intense and effective workout.', 9, '2025-10-24 12:30:00'),

-- Reviews for 'Artisan Alley Crafts' (202305345E)
('user21@example.com', '202305345E', 5, 'A hidden gem in Haji Lane! Found the most beautiful handmade pottery and unique jewelry. Perfect for gifts.', 16, '2025-10-20 14:00:00'),
('user22@example.com', '202305345E', 4, 'Lovely collection of items from local artists. A bit pricey, but you''re supporting small creators. The staff was very sweet.', 7, '2025-10-21 16:30:00'),
('user23@example.com', '202305345E', 5, 'I could spend hours in here. So many cute and quirky things. Bought some amazing watercolour prints.', 11, '2025-10-22 17:00:00'),
('user24@example.com', '202305345E', 4, 'Great place to find a unique souvenir that isn''t the usual tourist tat. Love the vibe of the shop.', 5, '2025-10-23 13:10:00'),
('user25@example.com', '202305345E', 4, 'The owner was so passionate and explained the stories behind some of the crafts. A really special shopping experience.', 8, '2025-10-24 15:20:00'),

-- Reviews for 'GreenScape Solutions' (202306678F)
('user26@example.com', '202306678F', 5, 'Transformed our barren office rooftop into a stunning green space. Incredibly professional and creative team.', 19, '2025-10-20 11:30:00'),
('user27@example.com', '202306678F', 1, 'Extremely overpriced and poor communication. The project took twice as long as quoted and the results were mediocre.', 3, '2025-10-21 14:00:00'),
('user28@example.com', '202306678F', 5, 'They handle our monthly garden maintenance, and it''s never looked better. Reliable, thorough, and very knowledgeable.', 10, '2025-10-22 10:00:00'),
('user29@example.com', '202306678F', 4, 'Did a wonderful job landscaping my condo balcony. They were tidy and respectful. It was expensive, but the quality is undeniable.', 6, '2025-10-23 16:00:00'),
('user30@example.com', '202306678F', 4, 'Good design advice, and they were patient with all my changes. The final result is beautiful.', 4, '2025-10-24 11:45:00'),

-- Reviews for 'Chapter & Verse Books' (202307901G)
('user1@example.com', '202307901G', 5, 'My absolute favorite bookstore. The curation is impeccable, with a great mix of bestsellers and obscure indie titles.', 28, '2025-10-20 16:00:00'),
('user2@example.com', '202307901G', 5, 'The staff here actually read books! Their recommendations are always spot on. A true gem for book lovers.', 17, '2025-10-21 13:20:00'),
('user3@example.com', '202307901G', 4, 'Found a rare book I''ve been searching for! The atmosphere is so peaceful. I just wish they had a small cafe inside.', 9, '2025-10-22 19:00:00'),
('user4@example.com', '202307901G', 5, 'Wonderful selection of local authors and poetry. It''s so important to support independent bookstores like this.', 14, '2025-10-23 15:30:00'),
('user5@example.com', '202307901G', 4, 'Cozy, quiet, and well-organized. Prices are reasonable (for a physical bookstore). A lovely place to browse.', 6, '2025-10-24 17:10:00'),

-- Reviews for 'Chic Street Boutique' (202308234H)
('user6@example.com', '202308234H', 4, 'Found the cutest dress here! The styles are very trendy and affordable. Quality is decent for the price.', 11, '2025-10-20 15:15:00'),
('user7@example.com', '202308234H', 5, 'The staff are so helpful with styling and not pushy at all. They helped me put together a great outfit.', 15, '2025-10-21 18:10:00'),
('user8@example.com', '202308234H', 3, 'A lot of fast-fashion items. Sizing is very inconsistent, which makes it hard to buy. But the accessories are nice.', 2, '2025-10-22 12:30:00'),
('user9@example.com', '202308234H', 4, 'This boutique has pieces you don''t see in the big chain stores. Great for finding something unique for an event.', 8, '2025-10-23 17:45:00'),
('user10@example.com', '202308234H', 4, 'Love their selection of bags and shoes. The store is well-merchandised and gives you lots of inspiration.', 6, '2025-10-24 13:00:00'),

-- Reviews for 'Elegance & Co' (202309567I)
('user11@example.com', '202309567I', 5, 'The epitome of luxury. The service is impeccable from the moment you walk in. The personal shoppers are brilliant.', 20, '2025-10-20 17:00:00'),
('user12@example.com', '202309567I', 3, 'I felt a bit judged and ignored by the staff. Just because I wasn''t in a suit doesn''t mean I''m not a serious customer.', 5, '2025-10-21 11:00:00'),
('user13@example.com', '202309567I', 5, 'Beautiful store layout and an unparalleled selection of designer brands. The experience itself is worth it.', 14, '2025-10-22 16:15:00'),
('user14@example.com', '202309567I', 5, 'They handled a complex international purchase for me flawlessly. True white-glove service. This is how luxury should be.', 10, '2025-10-23 12:00:00'),
('user15@example.com', '202309567I', 4, 'The collection is, of course, amazing. The location in ION is perfect. Be prepared to spend, obviously.', 7, '2025-10-24 19:00:00'),

-- Reviews for 'Mama\'s Kitchen' (202310890J)
('user16@example.com', '202310890J', 5, 'This is comfort food at its best. The Beef Rendang was incredibly tender and flavorful. Feels like a home-cooked meal.', 35, '2025-10-20 12:15:00'),
('user17@example.com', '202310890J', 5, 'Authentic, delicious, and so affordable. The Nasi Lemak is a must-try. Warm, family-friendly atmosphere.', 24, '2025-10-21 19:30:00'),
('user18@example.com', '202310890J', 4, 'A fantastic spot for local food. It gets very busy during lunch, so be prepared to queue. The Cendol is amazing.', 12, '2025-10-22 13:00:00'),
('user19@example.com', '202310890J', 3, 'Food was a bit too oily and salty for my personal taste, but I can see why people love the strong flavors.', 3, '2025-10-23 20:00:00'),
('user20@example.com', '202310890J', 5, 'The portions are generous and the service is fast and friendly. A real gem in Tiong Bahru.', 18, '2025-10-24 12:45:00'),

-- Reviews for 'Pawfect Grooming' (202312456L)
('user21@example.com', '202312456L', 5, 'The groomers are so patient and gentle. My dog is usually very anxious, but he came back happy and looking great!', 21, '2025-10-20 09:45:00'),
('user22@example.com', '202312456L', 5, 'They did a fantastic job on my cat, which is not an easy task! Very professional and clearly experienced.', 16, '2025-10-21 11:30:00'),
('user23@example.com', '202312456L', 4, 'Good, clean cut for my poodle. The facility is clean and doesn''t have that strong "wet dog" smell. Booking was easy.', 9, '2025-10-22 14:30:00'),
('user24@example.com', '202312456L', 2, 'They missed trimming some of my dog''s nails and the cut was uneven. I had to point it out. Not very thorough.', 1, '2025-10-23 10:30:00'),
('user25@example.com', '202312456L', 4, 'Staff seem to genuinely love animals. Prices are fair for the area. My dog always comes back looking and smelling pawfect!', 8, '2025-10-24 16:30:00');
-- ========================================
-- Forum Posts
-- ========================================
INSERT INTO forum_posts (user_email, business_uen, title, body, like_count, created_at)
VALUES
-- Posts linked to businesses
('user1@example.com', '202301234A', 'Best bakery in town?', 'Anyone else obsessed with The Daily Loaf’s sourdough? I think it’s the best in SG.', 18, '2025-10-25 09:00:00'),
('user3@example.com', '202303789C', 'Java Junction new seasonal drink', 'They just launched a Pumpkin Spice Latte — tried it yesterday and it’s actually good?? Thoughts?', 12, '2025-10-25 10:30:00'),
('user7@example.com', '202304012D', 'FitCore class schedule changes', 'Anyone know why they removed the 7am HIIT class on Fridays? It was the only one I could make.', 9, '2025-10-25 11:45:00'),
('user14@example.com', '202310890J', 'Mama’s Kitchen lunch crowd', 'Went at 12pm and the queue was insane 😭 worth waiting though, best rendang ever.', 22, '2025-10-25 12:10:00'),
('user25@example.com', '202312456L', 'Pawfect Grooming experiences?', 'Thinking of bringing my dog here — anyone got feedback? Is it worth the price?', 14, '2025-10-25 14:20:00'),

-- General business discussion
('user10@example.com', NULL, 'Best cafes to work from in SG', 'I’m looking for chill cafes with good WiFi and power sockets. Suggestions?', 27, '2025-10-25 15:40:00'),
('user5@example.com', NULL, 'Starting a small F&B business', 'Anyone here started a bakery or cafe recently? Looking for advice on suppliers and licenses.', 19, '2025-10-25 16:30:00'),
('user18@example.com', NULL, 'Is premium gym membership worth it?', 'Been considering switching from ActiveSG to a boutique gym. Worth paying 3x more?', 11, '2025-10-25 17:10:00'),
('user20@example.com', NULL, 'Online business visibility tips', 'Trying to help my friend’s shop get more Google reviews — any tips or best practices?', 8, '2025-10-25 18:00:00'),
('user8@example.com', NULL, 'Underrated local brands', 'Let’s share some cool Singapore brands that deserve more attention!', 15, '2025-10-25 19:00:00');

-- ========================================
-- Forum Replies
-- ========================================
INSERT INTO forum_posts_replies (post_id, user_email, body, like_count, created_at)
VALUES
-- Replies to bakery post
(1, 'user2@example.com', 'Agreed! Their croissants are top tier too. I go every weekend.', 6, '2025-10-25 09:20:00'),
(1, 'user5@example.com', 'Totally worth the calories 😍 I wish they opened earlier tho.', 3, '2025-10-25 09:45:00'),

-- Replies to Java Junction post
(2, 'user12@example.com', 'Yeah it’s surprisingly good! Not too sweet. They nailed the balance.', 5, '2025-10-25 10:50:00'),
(2, 'user14@example.com', 'Pumpkin spice in SG feels weird but I’m here for it lol.', 2, '2025-10-25 11:00:00'),

-- Replies to FitCore post
(3, 'user19@example.com', 'They said it was due to low attendance, but I think it’ll come back soon.', 4, '2025-10-25 12:00:00'),
(3, 'user17@example.com', 'Email them! They’re usually responsive to feedback.', 1, '2025-10-25 12:15:00'),

-- Replies to Mama’s Kitchen post
(4, 'user16@example.com', '100% worth it. Go before 11:30 and you’ll skip the line.', 7, '2025-10-25 12:20:00'),
(4, 'user19@example.com', 'Try their Cendol next time — it’s elite.', 3, '2025-10-25 12:30:00'),

-- Replies to Pawfect Grooming post
(5, 'user23@example.com', 'My poodle looked amazing after! Staff are super gentle.', 6, '2025-10-25 14:40:00'),
(5, 'user24@example.com', 'Had a bad experience once — uneven trim. Might’ve been a one-off though.', 2, '2025-10-25 14:50:00'),

-- Replies to general posts
(6, 'user11@example.com', 'Java Junction and Plain Vanilla are solid choices for working!', 8, '2025-10-25 15:50:00'),
(6, 'user13@example.com', 'Also check out The Book Café — chill vibes + power sockets.', 5, '2025-10-25 16:00:00'),

(7, 'user1@example.com', 'I started a small café last year! Focus on sourcing ingredients locally — saves a ton.', 10, '2025-10-25 16:45:00'),
(7, 'user4@example.com', 'Don’t forget to register for SFA licensing early — they’re super strict.', 7, '2025-10-25 16:50:00'),

(8, 'user15@example.com', 'Depends. If you value community and good trainers, yes. If just for treadmill — no.', 4, '2025-10-25 17:20:00'),

(9, 'user21@example.com', 'Encourage happy customers to leave reviews right after checkout. Works wonders.', 5, '2025-10-25 18:10:00'),
(9, 'user22@example.com', 'Offer a small incentive like discount coupons for verified reviews.', 3, '2025-10-25 18:15:00'),

(10, 'user26@example.com', 'Love brands like The Daily Loaf and Artisan Alley — quality local stuff.', 4, '2025-10-25 19:10:00'),
(10, 'user30@example.com', '+1 for Artisan Alley! Picked up cool handmade gifts there.', 2, '2025-10-25 19:20:00');


user_id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email              VARCHAR(255) NOT NULL,
  password_hash      VARCHAR(255) NOT NULL,
  name               VARCHAR(120) NOT NULL,
  referral_code      CHAR(10)     NOT NULL,     
  referrer_id INT UNSIGNED NULL,         -- who referred the user (if any)
  created_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  UNIQUE KEY uq_user_email (email),
  UNIQUE KEY uq_user_referral_code (referral_code),
  KEY idx_user_referred_by (referrer_id),
  CONSTRAINT fk_user_referred_by
    FOREIGN KEY (referrer_id) REFERENCES user(user_id)
    ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE referrals (
  ref_id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  referrer_id   INT UNSIGNED NOT NULL,
  referred_id   INT UNSIGNED NOT NULL,
  referral_code      CHAR(10) NOT NULL,      -- snapshot of code used
  status             ENUM('claimed','qualified','rewarded','rejected') NOT NULL DEFAULT 'claimed',
  referred_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (ref_id),
  UNIQUE KEY uq_referrer_referred (referrer_id, referred_id),
  KEY idx_referrer (referrer_id),
  KEY idx_referred (referred_id),
  CONSTRAINT fk_ref_referrer FOREIGN KEY (referrer_id) REFERENCES user(user_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ref_referred FOREIGN KEY (referred_id) REFERENCES user(user_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);



CREATE TABLE vouchers (
  voucher_id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  referrer_id            INT UNSIGNED NOT NULL,             -- owner (referrer)
  ref_id        BIGINT UNSIGNED NULL,              -- source referral row
  amount      INT NOT NULL,                      -- store money in cents
  status             ENUM('issued','used','expired','revoked') NOT NULL DEFAULT 'issued',
  issued_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at         DATETIME NULL,
  PRIMARY KEY (voucher_id),
  KEY idx_v_user (referrer_id),
  KEY idx_v_status (status),
  KEY idx_v_expires (expires_at),
  CONSTRAINT fk_v_user FOREIGN KEY (referrer_id) REFERENCES user(user_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_v_referral FOREIGN KEY (ref_id) REFERENCES referrals(ref_id)
    ON DELETE SET NULL ON UPDATE CASCADE
);
