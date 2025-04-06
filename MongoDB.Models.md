// User
{
  username: string,
  email: string,
  passwordHash: string,   
}

// Item (Movie or Show)
{
  title: string,
  type: string, // "Movie" | "Show" - required
  releaseDate: Date, // - required
  posterUrl: string, // - optional
  description: string, // - optional
  genres: [string], // - optional
  cast: [string], // - optional
  director: string, // - optional
  runtime: Number, // - optional
  seasons: Number, // - optional
}

// Episode
{
  title: string, // - required
  seasonNumber: Number, // - required
  episodeNumber: Number, // - required
  airDate: Date, // - optional
  runtime: Number, // - optional
  showId: ObjectId, // ref to Item - required
}

// WatchlistItem
{
  userId: ObjectId, // - required
  itemId: ObjectId, // - required
  itemType: string, // Movie | Show | Episode - required
  status: string, // Watching | Completed | Plan to Watch | Dropped - required
}

// Rating
{
  userId: ObjectId, // - required
  itemId: ObjectId, // - required
  itemType: string, // - required
  score: Number, // - required
}

// Review
{
  userId: ObjectId, // - required
  itemId: ObjectId, // - required
  itemType: string, // - required
  content: string, // - required
}
