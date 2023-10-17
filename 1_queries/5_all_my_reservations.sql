SELECT r.id, p.title, r.start_date, p.cost_per_night, AVG(review.rating) as average_rating
FROM property_reviews review
JOIN properties p ON p.id = review.property_id
JOIN reservations r ON r.id = review.reservation_id
WHERE review.guest_id = 5
GROUP BY r.id, p.id
ORDER BY r.start_date ASC
LIMIT 10;
