import { Item, getItem, getRatingbyID, getReviewsbyID, returnedReview,
    getRatingbyUserID, getWatchlistStatus,
    setwlStatus, setRating, getReviewbyUserID, setReview } from "../model.js";

export async function index(
    itemTitle: HTMLElement,itemDetails: HTMLElement,reviewsSection: HTMLElement,
    reviewsList: HTMLElement, myRatingSelector: HTMLSelectElement, wlOptionsSelector: HTMLSelectElement,
    reviewForm: HTMLFormElement) {
    
    const itemId = window.location.hash.substring(1); 
    const item = await getItem(itemId);  
    const usersRating = await getRatingbyID (itemId);
    console.log(`usersRating = ${usersRating}`);
    const reviews: returnedReview[] = await getReviewsbyID (itemId); 
    console.log(`reviews = ${reviews}`);
    const myReview = await getReviewbyUserID (itemId);
    const myRaiting = await getRatingbyUserID (itemId);
    console.log(`myRaiting = ${myRaiting?.score}`);    
    const myWatchlistStatus = await getWatchlistStatus(itemId);    

    if(item){
        renderItemOnPage(item,usersRating);
        console.log("done rendering item on page");
        renderReviews(reviews);
        console.log("done rendering reviews");

        myRatingSelector.value = myRaiting ? myRaiting.score.toString() : "none";
        wlOptionsSelector.value = myWatchlistStatus ? myWatchlistStatus.status : "none";
        reviewForm["reviewText"].value = myReview ? myReview.content : "Write your review here...";

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

    wlOptionsSelector.addEventListener("change", async (event) => {
        const wlStatus = (event.target as HTMLSelectElement).value;        
        console.log(`rating = ${wlStatus}`);
        if (myWatchlistStatus){
            console.log(`rating already exists, updating it`);
            await setwlStatus(item, wlStatus, myWatchlistStatus._id);
        } else{
            console.log(`rating does not exist, creating it`);  
            await setwlStatus(item, wlStatus);
        }
    });

    reviewForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const reviewText = reviewForm["reviewText"].value;
        console.log(`reviewText = ${reviewText}`);
        if (myReview){
            console.log(`review already exists, updating it`);
            await setReview(item, reviewText, myReview._id);
        } else{
            console.log(`review does not exist, creating it`);  
            await setReview(item, reviewText);
        }
    });

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
        reviewsList.innerHTML=` 
                ${reviews.map((review) => `
                    <li class="reviewCard"> - ${review.content}</li>
                    `).join("\n")}`;
        console.log("Reviews rendered successfully");
    }
}