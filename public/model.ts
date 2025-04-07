type Item = {
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

export async function getRatingbyID(itemID: string) : Promise<number>{
    try {
        const res = await fetch(`/api/ratings?search=${itemID}`);
        if (!res.ok) {
            const message = await res.text();             
            throw new Error(`Failed to fetch raitings for ${itemID}. Status: ${res.status}. Message: ${message}`);
        }       
        const ratings =  await res.json();
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

export async function getRatings (items: returnedItems[]): Promise<Map<string,number>>{

    const ratingMap: Map<string, number> = new Map();
    for (const item of items){
        try{
            const rating = await getRatingbyID(item._id);
            ratingMap.set(item._id,rating);
        }catch(error){
            console.error(`Cant get raitings for id=${item._id}`,error);
            ratingMap.set(item._id,0);
        }        
    }  

    return ratingMap;

}