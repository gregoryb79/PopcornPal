# Auth
- POST /auth/register
- POST /auth/login
- GET /auth/me

# Users
- GET /users/:id
- PUT /users/:id/preferences
- GET /users/:id/watchlist
- GET /users/:id/reviews

# Movies / Shows
- GET /items – All items
- POST /items – Add new movie/show (admin)
- GET /items/:id
- PUT /items/:id – Edit info (admin)
- DELETE /items/:id

# Watchlist
- GET /watchlist
- POST /watchlist (add/update)
- DELETE /watchlist/:id

# Ratings
- POST /ratings
- GET /ratings/:itemId
- GET /users/:id/ratings

# Reviews
- POST /reviews
- GET /reviews/:itemId
- GET /users/:id/reviews

