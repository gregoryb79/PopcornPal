import {getRatingsbyUser, returnedRating} from "../model.js";

export async function index(ratingsList: HTMLElement) {
       
    const raitings = await getRatingsbyUser(); 
    console.log(`raitings = ${raitings}`); 
   
    renderRaitings(raitings);     

    ratingsList.addEventListener("click", async (event) => {
        const target = event.target as HTMLElement;
        const listItem = target.closest("li.reviewCard");
        if (!listItem) return;  

        const itemId = listItem.getAttribute("data-id");
        if (!itemId) return;

       window.location.replace(`/item#${itemId}`);
    }); 

    function renderRaitings(raitings : returnedRating[]) {
        ratingsList.innerHTML=` 
                ${raitings.map((raiting) => `
                    <li class="reviewCard u-clickable" data-id="${raiting.itemId}"> 
                        <span class="u-bold u-largeFont">${raiting.itemTitle}: </span>
                        <span>you rated it: ${raiting.score}!</span>
                    </li>
                    `).join("\n")}`;
        console.log("Raitings rendered successfully");
    }
}