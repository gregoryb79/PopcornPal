export type Item = {
    _id: string,
    title: string;
    type: "Movie" | "Show";
    releaseDate: string;
    posterUrl?: string;
    description?: string;
    genres: string[];
    cast: string[];
    director?: string;
    runtime?: number;
    seasons?: number;
    createdAt?: string;
    updatedAt?: string;
  };

type Rating = {
    _id: string,
    userId: string; 
    itemId: string; 
    itemTitle: string;
    score: number;
    createdAt?: string; 
    updatedAt?: string; 
}

type Watchlist = {
    _id: string,
    userId: string; 
    itemId: string; 
    itemTitle: string;
    status: "Watching" | "Completed" | "Plan to Watch" | "Dropped";
    createdAt?: string; 
    updatedAt?: string; 
}


export type Review = {
    _id: string;
    userId: string; 
    itemId: string; 
    itemTitle: string;
    content: string;    
    createdAt?: string; 
    updatedAt?: string; 
}

export type returnedItems = Omit<Item,"type"|"description"|"genres"|"cast"|"director"
                                |"runtime"|"seasons"|"createdAt"|"updatedAt">;
export async function getItems(query : string) : Promise<returnedItems[]> {
    console.log(`getItems with query = ${query} starts`);
    try {        
        const res = await fetch(`/api/items${query}`);
        if (!res.ok) {
            const message = await res.text();             
            throw new Error(`Failed to fetch notes. Status: ${res.status}. Message: ${message}`);
        }       
        const items: returnedItems[] =  await res.json();
        return items.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
    }catch (error) {
        console.error("Error fetching items:", error);
        throw error; 
    }    
}

export type returnedRating = Omit<Rating,"userId"|"createdAt"|"updatedAt">
export async function getRatingbyID(itemID: string) : Promise<number>{
    console.log(`getRatingbyID with itemID = ${itemID} starts`);
    try {
        const res = await fetch(`/api/ratings?search=${itemID}`);
        if (!res.ok) {
            const message = await res.text();             
            throw new Error(`Failed to fetch raitings for ${itemID}. Status: ${res.status}. Message: ${message}`);
        }       
        const ratings : returnedRating [] =  await res.json();
        if (ratings.length > 0) {
            const averageScore = ratings.reduce((sum, rating) => sum + rating.score, 0) / ratings.length;
            return averageScore;
        }else{
            return 0;
        }        
    }catch (error) {
        console.error("Error fetching items:", error);
        return 0;        
    } 
}

export async function getRatings(
  items: returnedItems[],
  getRatingbyIDFn: (itemID: string) => Promise<number> = getRatingbyID // to allow for mock function injection in tests jest.spyOn and similar didn't work
): Promise<Map<string, number>> {
  const ratingMap: Map<string, number> = new Map();

  if (items.length === 0) {
    return ratingMap;
  }

  for (const item of items) {
    try {
      const rating = await getRatingbyIDFn(item._id);
      ratingMap.set(item._id, rating);
    } catch (error) {
      console.error(`Failed to fetch rating for item ${item._id}:`, error);
      ratingMap.set(item._id, 0); 
    }
  }

  return ratingMap;
}

export async function getItem(itemId:string) {
  console.log(`getItem with itemId = ${itemId} starts`);
  try {        
      const res = await fetch(`/api/items/${itemId}`);
      if (!res.ok) {
          const message = await res.text();             
          throw new Error(`Failed to fetch item. Status: ${res.status}. Message: ${message}`);
      }       
      const item: Item =  await res.json();
      return item;        
  }catch (error) {
      console.error("Error fetching item:", error);
      throw error; 
  }     
}

export type returnedReview = Omit<Review,"userId"|"itemId"|"createdAt"|"updatedAt">
export async function getReviewsbyID(itemID: string) : Promise<returnedReview[]>{
    console.log(`getReviewsbyID with itemID = ${itemID} starts`);
    try {
        const res = await fetch(`/api/reviews?search=${itemID}`);
        if (!res.ok) {
            const message = await res.text();             
            throw new Error(`Failed to fetch reviews for ${itemID}. Status: ${res.status}. Message: ${message}`);
        }       
        const reviews : returnedReview [] =  await res.json();        
        return reviews;        
    }catch (error) {
        console.error("Error fetching items:", error);
        return [];        
    } 
}

export async function getRatingbyUserID(itemID: string) : Promise<returnedRating|null>{
    console.log(`getRatingbyUserID with itemID = ${itemID} starts`);
    try {
        const res = await fetch(`/api/ratings`);
        if (!res.ok) {
            const message = await res.text();             
            throw new Error(`Failed to fetch raitings for ${itemID}. Status: ${res.status}. Message: ${message}`);
        }       
        const ratings : returnedRating [] =  await res.json();
        if (ratings.length > 0) {
            return ratings.find(rating => rating.itemId === itemID) || null;
        }else{
            return null;
        }        
    }catch (error) {
        console.error("Error fetching items:", error);
        return null;        
    } 
}

export type returnedWatchlist = Omit<Watchlist,"userId"|"itemId"|"createdAt"|"updatedAt">
export async function getWatchlistStatus(itemID: string) : Promise<returnedWatchlist|null>{
    console.log(`getWatchlistStatus with itemID = ${itemID} starts`);
    try {
        const res = await fetch(`/api/watchlist/?search=${itemID}`);
        if (!res.ok) {
            const message = await res.text();             
            throw new Error(`Failed to fetch watchlist status for ${itemID}. Status: ${res.status}. Message: ${message}`);
        }       
        const wlStatus = await res.json();
        console.log(`wlStatus = ${wlStatus}`);
        if (wlStatus.length > 0) {
            return wlStatus;
        }else{
            return null;
        }        
    }catch (error) {
        console.error("Error fetching items:", error);
        return null;        
    } 
}

export async function setRating(item: returnedItems, rating: string, ratingId : string = "newRating") : Promise<void>{
    console.log(`setRating with itemID = ${item._id} and rating = ${rating} starts`);

    const body = {
        itemId: item._id,
        itemTitle: item.title,
        score: rating,};

    try {
        const res = await fetch(`/api/ratings/${ratingId}`, {
            method: "put",
            body: JSON.stringify(body),
            headers: {
                "content-type": "application/json",
            },
        });
        if (!res.ok) {
            const message = await res.text();             
            throw new Error(`Failed to set raitings for ${item._id}. Status: ${res.status}. Message: ${message}`);
        }        
    }catch (error) {
        console.error("Error setting raitings:", error);        
    } 
}

export async function setwlStatus(item: returnedItems, wlStatus: string, wlId : string = "newWL") : Promise<void>{
    console.log(`setwlStatus with itemID = ${item._id} and wlStatus = ${wlStatus} starts`);

    const body = {
        itemId: item._id,
        itemTitle: item.title,
        status: wlStatus,};

    try {
        const res = await fetch(`/api/watchlist/${wlId}`, {
            method: "put",
            body: JSON.stringify(body),
            headers: {
                "content-type": "application/json",
            },
        });
        if (!res.ok) {
            const message = await res.text();             
            throw new Error(`Failed to set watchlist status for ${item._id}. Status: ${res.status}. Message: ${message}`);
        }        
    }catch (error) {
        console.error("Error setting watchlist status:", error);        
    } 
}