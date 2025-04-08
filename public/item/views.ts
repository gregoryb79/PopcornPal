import { Item, getItem, getRatingbyID, getReviewsbyID, returnedReview,
    getRatingbyUserID, getWatchlistStatus,
    setwlStatus, setRating } from "../model.js";

export async function index(
    itemTitle: HTMLElement,itemDetails: HTMLElement,reviewsSection: HTMLElement,
    reviewsList: HTMLElement, myRatingSelector: HTMLSelectElement, wlOptionsSelector: HTMLSelectElement) {
    
    const itemId = window.location.hash.substring(1); 
    const item = await getItem(itemId);  
    const usersRating = await getRatingbyID (itemId);
    console.log(`usersRating = ${usersRating}`);
    const reviews: returnedReview[] = await getReviewsbyID (itemId); 
    console.log(`reviews = ${reviews}`);
    const myRaiting = await getRatingbyUserID (itemId);
    console.log(`myRaiting = ${myRaiting}`);    
    const myWatchlistStatus = await getWatchlistStatus (itemId);
    console.log(`myWatchlistStatus = ${myWatchlistStatus}`);

    if(item){
        renderItemOnPage(item,usersRating);
        console.log("done rendering item on page");
        renderReviews(reviews);
        console.log("done rendering reviews");

        myRatingSelector.value = myRaiting ? myRaiting.score.toString() : "none";
        wlOptionsSelector.value = myWatchlistStatus;

    }else{
        itemDetails.innerHTML = "<h3>Oops, something went wrong, please retry...</h3>";
    }     
    
    myRatingSelector.addEventListener("change", async (event) => {
        const rating = (event.target as HTMLSelectElement).value;        
        console.log(`rating = ${rating}`);
        if (myRaiting){
            console.log(`rating already exists, updating it`);
            await setRating(item, rating, myRaiting._id);
        } else{
            console.log(`rating does not exist, creating it`);  
            await setRating(item, rating);
        }
    });

    // wlOptionsSelector.addEventListener("change", async (event) => {
    //     const wlStatus = (event.target as HTMLSelectElement).value;        
    //     console.log(`rating = ${wlStatus}`);
    //     await setwlStatus(itemId, wlStatus);
    // });

    function renderItemOnPage(item : Item, usersRating : number) {
        
        itemTitle.innerHTML=`
            <h2>
                ${item.title}
            </h2>            
            <p>
                ${item.releaseDate} - ${item.genres[0]} ${item.runtime ? ` - ${item.runtime} min.` : ""}
            </p>
        `;

        itemDetails.innerHTML=`                                             
                <img src="${item.posterUrl ? item.posterUrl : "../placeholder_poster.jpg"}" alt="item poster image">         
                <section class="itemDescription">
                    <h4>Director: ${item.director ? item.director : "" }</h4>                    
                    <h4>Cast: ${item.cast[0] ? item.cast[0] : ""}, ${item.cast[1] ? item.cast[1] : ""}</h4> 
                    <h4>Description:</h4>
                    <p>${item.description ? item.description : ""}</p>                                   
                    <h4>Users rating: ${usersRating.toFixed(1)}</h4>                    
                </section>`;             

        console.log("Page rendered successfully");
    }

    function renderReviews(reviews : returnedReview[]) {
        reviewsSection.innerHTML=`                       
            <h2>Reviews</h2>
            <ul id="reviewsList" class="reviewsList"> 
                ${reviews.map((review) => `
                    <li class="reviewCard">${review.content}</li>
                    `).join("\n")}      
            </ul>`;
        console.log("Reviews rendered successfully");
    }
}