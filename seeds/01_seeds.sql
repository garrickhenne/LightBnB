INSERT INTO users (name, email, password) VALUES 
  ('tyurhruo', 'garrickhenne@outlook.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('garrick', 'garrickhenne@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('sowl', 'garrickhenne@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, country, street, city, province, post_code) VALUES
  (1, 'Bootyful one bedroom', 'something', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 'canada', '123', 'calgary', 'AB', 't3k0l4'),
  (1, 'Bootyful two bedroom', 'something d', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 'canada', '103', 'calgary', 'AB', 't1y5m2'),
  (1, 'Bootyful three bedroom', 'something dssd', 'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg', 'canada', '132', 'calgary', 'AB', 't3k1l4');

INSERT INTO reservations (start_date, end_date, property_id, guest_id) VALUES
  ('2023-06-29', '2023-07-01', 1, 2),
  ('2023-07-29', '2023-08-01', 2, 3),
  ('2023-08-29', '2023-09-01', 3, 2);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, message) VALUES
  (2, 1, 1, 'Was good'),
  (2, 3, 2, 'Was not good'),
  (3, 2, 3, 'Was okay');
