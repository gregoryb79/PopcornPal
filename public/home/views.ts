import {getItems, getRatings, getWatchlist, addToWatchlist,
        removeFromWatchlist} from "../model.js"

export async function index(itemsList : HTMLElement, searchForm : HTMLFormElement,
    sortingOptions : HTMLSelectElement, loadingSpinner : HTMLElement
){

    console.log("hello PopcornPal");
    
    const watchlist = await getWatchlist();    
    let sort = "Newest";

    try{
        if (loadingSpinner) {
            loadingSpinner.style.display = "block";
        }

        await renderItemsCards("",sort);
    } catch (error) {
        console.error("Error rendering items:", error);
    }finally {        
        if (loadingSpinner) {
            loadingSpinner.style.display = "none";
        }
    }
    

    itemsList.addEventListener("click", async (event) => {
        const target = event.target as HTMLElement;

        const listItem = target.closest("li.itemCard");
        if (!listItem) return; 
    
        const itemId = listItem.getAttribute("data-id");
        
        if (!itemId) return;
        if (target.matches('input[type="checkbox"]')) {
            const checkbox = target as HTMLInputElement;
            console.log(`Checkbox clicked in item ${itemId}, checked: ${checkbox.checked}`);            
            if (checkbox.checked) {
                await addToWatchlist(itemId);
            } else {
                const wlItemId = (watchlist?.find(wlItem => wlItem.itemId === itemId))?._id;
                if (!wlItemId) return;
                await removeFromWatchlist(wlItemId);
            }
        } else if (target.tagName === "IMG") {
            console.log(`Image clicked in item ${itemId}`); 
            window.location.replace(`/item#${itemId}`);
        }
        
    });

    searchForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(searchForm);
        const query = formData.get("search") as string;        
        console.log(`Searching for: ${query}`);

        try{
            if (loadingSpinner) {
                loadingSpinner.style.display = "block";
            }    
            await renderItemsCards(`?search=${query}`, sort);
        } catch (error) {
            console.error("Error rendering items:", error);
        }finally {        
            if (loadingSpinner) {
                loadingSpinner.style.display = "none";
            }
        }
                
    });

    sortingOptions.addEventListener("change", async (event) => {
        sort = (event.target as HTMLSelectElement).value;
        console.log(`Sorting by: ${sort}`);
        try{
            if (loadingSpinner) {
                loadingSpinner.style.display = "block";
            }    
            await renderItemsCards("", sort);
        } catch (error) {
            console.error("Error rendering items:", error);
        }finally {        
            if (loadingSpinner) {
                loadingSpinner.style.display = "none";
            }
        }        
    });
   
   async function renderItemsCards(query : string, sort: string = "Newest"){ 
    try{
        const items = await getItems(query);
        if (sort === "Oldest") {
            items.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
        }  
        console.log(items);

        if(items.length > 0) {
            const ratings = await getRatings(items);
            if (sort === "Top Rated") {
                items.sort((a, b) => {
                    const ratingA = ratings.get(a._id) ?? 0; 
                    const ratingB = ratings.get(b._id) ?? 0; 
                    return ratingB - ratingA; 
                });               
            }
            itemsList.innerHTML = items
                .map((item) => `                                
                                <li class="itemCard" data-id="${item._id}">
                                    <img src=${item.posterUrl ? item.posterUrl : `../placeholder_poster.jpg`} alt="poster image of ${item.title}" tabindex="0"></img>
                                    <h4>${item.title}</h4>
                                    <p class="releaseYear">${(new Date(item.releaseDate)).getFullYear()}</p>
                                    <section class="raitingANDlist">
                                        <p class="raiting">${ratings.get(item._id)?.toFixed(1) ?? "0.0"}</p>
                                        <input type="checkbox" class="checkbox" ${(watchlist ?? []).some(wlItem => wlItem.itemId === item._id) ? "checked" : ""}>                                                           
                                    </section>               
                                </li>
                                `)
                .join("\n");
        }else if (query != ""){
            itemsList.innerHTML = "<h3>No results for your search...</h3>"
        }else{
            itemsList.innerHTML = "<h3>Oops, something went wrong, please retry...</h3>"
        }        
        
    }catch(error){
        console.error(error);
    }     
   }
}