
-- Clean up existing data
DELETE FROM wishlist_items;
DELETE FROM reviews;
DELETE FROM cart_items;
DELETE FROM carts;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM users;

-- Create Admin and Seller
INSERT INTO users (id, email, hashed_password, full_name, role) VALUES ('adfa1b11-23ee-4594-b0d3-a5091caa94fb', 'admin@nexmart.in', '$2b$10$D2XMhYdr0LJMdNJeFt.neuSGVubQ4jFUzUReEFBPvCipsOPUr3rM2', 'System Admin', 'admin');
INSERT INTO users (id, email, hashed_password, full_name, role) VALUES ('a056b257-f074-4fca-ae5c-caa4eb59d39b', 'seller@nexmart.in', '$2b$10$D2XMhYdr0LJMdNJeFt.neuSGVubQ4jFUzUReEFBPvCipsOPUr3rM2', 'Obsidian Hardware', 'seller');

-- Seed Categories
INSERT INTO categories (id, name, slug) VALUES ('225402ca-3fed-444b-a780-8e68d8a6f8c5', 'Cyber Hardware', 'cyber-hardware');
INSERT INTO categories (id, name, slug) VALUES ('9377869a-6c98-4a9b-a3b4-542430222c3e', 'Obsidian Series', 'obsidian-series');
INSERT INTO categories (id, name, slug) VALUES ('d39523ff-2d2b-4ae3-a3c7-dbf6b780bc11', 'Hyper Performance', 'hyper-performance');
INSERT INTO categories (id, name, slug) VALUES ('e20d21ab-54e0-40f7-9ed2-2e12a10cc30f', 'Studio Audio', 'studio-audio');
INSERT INTO categories (id, name, slug) VALUES ('5915d987-cc6e-416f-bfbc-a2bee237182a', 'Artisan Essentials', 'artisan-essentials');

-- Seed 50 Products
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('863b6fe2-87ec-47dc-a3aa-7c04415f4161', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Studio 01', 'A high-performance asset from the Studio Audio line.', 7104, 10705, 100, 'e20d21ab-54e0-40f7-9ed2-2e12a10cc30f', 'NEXMART', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('7d35aefe-d6e5-479b-9ec4-87acf7200813', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Artisan 02', 'A high-performance asset from the Artisan Essentials line.', 39427, 39512, 100, '5915d987-cc6e-416f-bfbc-a2bee237182a', 'NEXMART', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('1ad88520-82db-47a2-ac9b-ba3b65148bb5', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Hyper 03', 'A high-performance asset from the Hyper Performance line.', 39181, 43163, 100, 'd39523ff-2d2b-4ae3-a3c7-dbf6b780bc11', 'NEXMART', 'https://images.unsplash.com/photo-1526170315870-ef6876fd8418?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('0dc5e406-badc-47f7-9c0f-0dd1ec75c9ac', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Artisan 04', 'A high-performance asset from the Artisan Essentials line.', 51424, 56293, 100, '5915d987-cc6e-416f-bfbc-a2bee237182a', 'NEXMART', 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('53aafbcf-83db-4e6f-af04-3ef889fec0ad', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Studio 05', 'A high-performance asset from the Studio Audio line.', 42771, 46465, 100, 'e20d21ab-54e0-40f7-9ed2-2e12a10cc30f', 'NEXMART', 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('df1be979-5e21-4fe6-9fe3-d155188cc121', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Hyper 06', 'A high-performance asset from the Hyper Performance line.', 27228, 29114, 100, 'd39523ff-2d2b-4ae3-a3c7-dbf6b780bc11', 'NEXMART', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('3bdf87a8-cefe-4f22-9048-14c2a0bdf816', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Cyber 07', 'A high-performance asset from the Cyber Hardware line.', 48862, 53200, 100, '225402ca-3fed-444b-a780-8e68d8a6f8c5', 'NEXMART', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('f946c998-ad98-4a5e-87ad-1b9ff61afc2e', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Artisan 08', 'A high-performance asset from the Artisan Essentials line.', 44514, 48525, 100, '5915d987-cc6e-416f-bfbc-a2bee237182a', 'NEXMART', 'https://images.unsplash.com/photo-1509048191080-d2984bad6ad5?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('c39bbe45-067c-4ddd-9dcb-18e890bedef5', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Cyber 09', 'A high-performance asset from the Cyber Hardware line.', 8121, 8893, 100, '225402ca-3fed-444b-a780-8e68d8a6f8c5', 'NEXMART', 'https://images.unsplash.com/photo-1529336953128-6e17730a9370?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('586b0657-04f4-44e5-af9b-5d5ebffad94a', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Obsidian 10', 'A high-performance asset from the Obsidian Series line.', 10364, 14889, 100, '9377869a-6c98-4a9b-a3b4-542430222c3e', 'NEXMART', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('dcf7f315-26ae-42d8-a3a1-04e842cd73aa', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Artisan 11', 'A high-performance asset from the Artisan Essentials line.', 22068, 24923, 100, '5915d987-cc6e-416f-bfbc-a2bee237182a', 'NEXMART', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('d4b2c7e5-d2d6-4c2b-8b8c-e018fff5bdb4', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Hyper 12', 'A high-performance asset from the Hyper Performance line.', 36053, 36823, 100, 'd39523ff-2d2b-4ae3-a3c7-dbf6b780bc11', 'NEXMART', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('5efddb42-4660-4544-bd07-d9e6bfbb1904', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Artisan 13', 'A high-performance asset from the Artisan Essentials line.', 31326, 33662, 100, '5915d987-cc6e-416f-bfbc-a2bee237182a', 'NEXMART', 'https://images.unsplash.com/photo-1526170315870-ef6876fd8418?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('137cbc2a-d6cc-4c4d-a0c5-27670c11113b', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Studio 14', 'A high-performance asset from the Studio Audio line.', 26313, 29428, 100, 'e20d21ab-54e0-40f7-9ed2-2e12a10cc30f', 'NEXMART', 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('5c218fce-883e-4ca5-bf94-57927db8acf0', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Studio 15', 'A high-performance asset from the Studio Audio line.', 39440, 44127, 100, 'e20d21ab-54e0-40f7-9ed2-2e12a10cc30f', 'NEXMART', 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('dc1af554-ab8d-4bd2-b15b-55d843389555', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Cyber 16', 'A high-performance asset from the Cyber Hardware line.', 39904, 43538, 100, '225402ca-3fed-444b-a780-8e68d8a6f8c5', 'NEXMART', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('15e86b95-83cb-4500-bd49-b3c6447353f3', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Obsidian 17', 'A high-performance asset from the Obsidian Series line.', 8237, 9621, 100, '9377869a-6c98-4a9b-a3b4-542430222c3e', 'NEXMART', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('cf153993-369a-4766-9aab-4e6169284847', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Obsidian 18', 'A high-performance asset from the Obsidian Series line.', 27178, 28995, 100, '9377869a-6c98-4a9b-a3b4-542430222c3e', 'NEXMART', 'https://images.unsplash.com/photo-1509048191080-d2984bad6ad5?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('e4661fb6-1663-4cf1-93d3-9ad0eeffb8a1', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Artisan 19', 'A high-performance asset from the Artisan Essentials line.', 12049, 14324, 100, '5915d987-cc6e-416f-bfbc-a2bee237182a', 'NEXMART', 'https://images.unsplash.com/photo-1529336953128-6e17730a9370?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('92a2e0f2-294b-4827-b55e-f7eec47f3f80', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Obsidian 20', 'A high-performance asset from the Obsidian Series line.', 11928, 12173, 100, '9377869a-6c98-4a9b-a3b4-542430222c3e', 'NEXMART', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('b6c53887-b889-4c0a-b625-924381ea9a0b', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Hyper 21', 'A high-performance asset from the Hyper Performance line.', 18330, 20737, 100, 'd39523ff-2d2b-4ae3-a3c7-dbf6b780bc11', 'NEXMART', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('8c111d29-92c9-483a-8175-4f5d3c10e10b', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Hyper 22', 'A high-performance asset from the Hyper Performance line.', 40437, 43830, 100, 'd39523ff-2d2b-4ae3-a3c7-dbf6b780bc11', 'NEXMART', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('8b8bf6ba-458f-42f7-aac9-148a5df51b48', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Cyber 23', 'A high-performance asset from the Cyber Hardware line.', 22944, 26455, 100, '225402ca-3fed-444b-a780-8e68d8a6f8c5', 'NEXMART', 'https://images.unsplash.com/photo-1526170315870-ef6876fd8418?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('9d81bf52-446b-420b-b927-a11e572b8a6c', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Artisan 24', 'A high-performance asset from the Artisan Essentials line.', 18484, 22651, 100, '5915d987-cc6e-416f-bfbc-a2bee237182a', 'NEXMART', 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('f46c20da-1363-45c9-b32f-281b1c3ce49e', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Artisan 25', 'A high-performance asset from the Artisan Essentials line.', 51294, 54227, 100, '5915d987-cc6e-416f-bfbc-a2bee237182a', 'NEXMART', 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('44ce5f96-6b4e-4e3d-a070-0cf96c8b7db8', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Hyper 26', 'A high-performance asset from the Hyper Performance line.', 31416, 31903, 100, 'd39523ff-2d2b-4ae3-a3c7-dbf6b780bc11', 'NEXMART', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('de49b9be-3cc8-4726-87a2-af6a94b41b8e', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Studio 27', 'A high-performance asset from the Studio Audio line.', 8860, 11297, 100, 'e20d21ab-54e0-40f7-9ed2-2e12a10cc30f', 'NEXMART', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('4de5f74c-0c41-4296-b60d-701bf73084fc', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Obsidian 28', 'A high-performance asset from the Obsidian Series line.', 53858, 57922, 100, '9377869a-6c98-4a9b-a3b4-542430222c3e', 'NEXMART', 'https://images.unsplash.com/photo-1509048191080-d2984bad6ad5?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('0285bc02-0dec-4317-95c3-0c8d5c299fa8', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Studio 29', 'A high-performance asset from the Studio Audio line.', 18309, 20490, 100, 'e20d21ab-54e0-40f7-9ed2-2e12a10cc30f', 'NEXMART', 'https://images.unsplash.com/photo-1529336953128-6e17730a9370?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('abff4aee-95e5-4746-b99b-08fd7761618b', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Obsidian 30', 'A high-performance asset from the Obsidian Series line.', 33510, 37788, 100, '9377869a-6c98-4a9b-a3b4-542430222c3e', 'NEXMART', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('65c3c803-c85f-4580-88fd-6f2ba8750b63', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Hyper 31', 'A high-performance asset from the Hyper Performance line.', 10929, 12582, 100, 'd39523ff-2d2b-4ae3-a3c7-dbf6b780bc11', 'NEXMART', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('4ee9ac2b-a98e-4952-8721-765eba21d529', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Obsidian 32', 'A high-performance asset from the Obsidian Series line.', 20085, 20165, 100, '9377869a-6c98-4a9b-a3b4-542430222c3e', 'NEXMART', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('c16e57f0-30a7-48cd-9237-da91711c62e4', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Obsidian 33', 'A high-performance asset from the Obsidian Series line.', 14835, 19520, 100, '9377869a-6c98-4a9b-a3b4-542430222c3e', 'NEXMART', 'https://images.unsplash.com/photo-1526170315870-ef6876fd8418?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('9774732c-cac3-449c-9fe4-e78343b02420', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Hyper 34', 'A high-performance asset from the Hyper Performance line.', 12697, 17210, 100, 'd39523ff-2d2b-4ae3-a3c7-dbf6b780bc11', 'NEXMART', 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('ccf1ed5d-d5a8-4803-a7e0-19ea515e3e3a', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Studio 35', 'A high-performance asset from the Studio Audio line.', 42436, 45996, 100, 'e20d21ab-54e0-40f7-9ed2-2e12a10cc30f', 'NEXMART', 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('e7319b81-2ba4-493f-8134-3d328f0f5a00', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Cyber 36', 'A high-performance asset from the Cyber Hardware line.', 16748, 21710, 100, '225402ca-3fed-444b-a780-8e68d8a6f8c5', 'NEXMART', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('be2f9b7d-1d39-4ffe-8b15-51079337d8f9', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Studio 37', 'A high-performance asset from the Studio Audio line.', 21156, 21742, 100, 'e20d21ab-54e0-40f7-9ed2-2e12a10cc30f', 'NEXMART', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('76b244c4-d71d-4653-bb8c-60eec230dcad', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Hyper 38', 'A high-performance asset from the Hyper Performance line.', 30927, 31203, 100, 'd39523ff-2d2b-4ae3-a3c7-dbf6b780bc11', 'NEXMART', 'https://images.unsplash.com/photo-1509048191080-d2984bad6ad5?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('d79fac6b-b742-40ee-a79b-51f105d1b29f', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Cyber 39', 'A high-performance asset from the Cyber Hardware line.', 46499, 49462, 100, '225402ca-3fed-444b-a780-8e68d8a6f8c5', 'NEXMART', 'https://images.unsplash.com/photo-1529336953128-6e17730a9370?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('a18d4deb-e6b0-4101-97f8-3303f98ee1e2', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Obsidian 40', 'A high-performance asset from the Obsidian Series line.', 12437, 13660, 100, '9377869a-6c98-4a9b-a3b4-542430222c3e', 'NEXMART', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('fa9c8d3c-4dc2-4869-9cb5-4b90191c5840', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Artisan 41', 'A high-performance asset from the Artisan Essentials line.', 13563, 16456, 100, '5915d987-cc6e-416f-bfbc-a2bee237182a', 'NEXMART', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('24693970-470c-4bfb-90ab-c2131b9e9d1b', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Studio 42', 'A high-performance asset from the Studio Audio line.', 34672, 39527, 100, 'e20d21ab-54e0-40f7-9ed2-2e12a10cc30f', 'NEXMART', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('3bec53df-f20f-42d6-9068-3c64d55a13fb', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Cyber 43', 'A high-performance asset from the Cyber Hardware line.', 17765, 18033, 100, '225402ca-3fed-444b-a780-8e68d8a6f8c5', 'NEXMART', 'https://images.unsplash.com/photo-1526170315870-ef6876fd8418?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('6b024117-7c4a-4857-990f-420afb211a7a', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Obsidian 44', 'A high-performance asset from the Obsidian Series line.', 41870, 45507, 100, '9377869a-6c98-4a9b-a3b4-542430222c3e', 'NEXMART', 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('7ab526d8-7a1c-4762-b046-be825850c2b0', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Obsidian 45', 'A high-performance asset from the Obsidian Series line.', 20970, 23262, 100, '9377869a-6c98-4a9b-a3b4-542430222c3e', 'NEXMART', 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('13ab755c-287a-4083-b73d-c7fb138aa0a5', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Cyber 46', 'A high-performance asset from the Cyber Hardware line.', 45557, 46386, 100, '225402ca-3fed-444b-a780-8e68d8a6f8c5', 'NEXMART', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('be245414-c058-4edd-99fd-07d5e72073f6', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Hyper 47', 'A high-performance asset from the Hyper Performance line.', 9134, 11375, 100, 'd39523ff-2d2b-4ae3-a3c7-dbf6b780bc11', 'NEXMART', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('e0d5ba09-3709-4244-8a0f-4043278b5147', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Studio 48', 'A high-performance asset from the Studio Audio line.', 33703, 33905, 100, 'e20d21ab-54e0-40f7-9ed2-2e12a10cc30f', 'NEXMART', 'https://images.unsplash.com/photo-1509048191080-d2984bad6ad5?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('a74e12fb-6035-4efc-821f-0980b3dfa396', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Obsidian 49', 'A high-performance asset from the Obsidian Series line.', 16024, 20397, 100, '9377869a-6c98-4a9b-a3b4-542430222c3e', 'NEXMART', 'https://images.unsplash.com/photo-1529336953128-6e17730a9370?w=800&q=80', 'active');
INSERT INTO products (id, seller_id, title, description, price, mrp, stock, category_id, brand, image, status) 
VALUES ('43396074-4b51-4bb7-8eda-79ed1533a76d', 'a056b257-f074-4fca-ae5c-caa4eb59d39b', 'NEXMART Cyber 50', 'A high-performance asset from the Cyber Hardware line.', 50674, 55209, 100, '225402ca-3fed-444b-a780-8e68d8a6f8c5', 'NEXMART', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 'active');
