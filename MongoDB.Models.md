// User
{
  username: string,
  email: string,
  passwordHash: string,   
}

// Item (Movie or Show)
{
  title: string,
  type: string, // "Movie" | "Show"
  releaseDate: Date,
  posterUrl: string,
  description: string,
  genres: [string],
  cast: [string],
  director: string,
  runtime: Number,
  seasons: Number,
}

// Episode
{
  title: string,
  seasonNumber: Number,
  episodeNumber: Number,
  airDate: Date,
  runtime: Number,
  showId: ObjectId, // ref to Item
}

// WatchlistItem
{
  userId: ObjectId,
  itemId: ObjectId,
  itemType: string, // Movie | Show | Episode
  status: string, // Watching | Completed | Plan to Watch | Dropped
}

// Rating
{
  userId: ObjectId,
  itemId: ObjectId,
  itemType: string,
  score: Number,
}

// Review
{
  userId: ObjectId,
  itemId: ObjectId,
  itemType: string,
  content: string,
}
