import {getReviewsbyUser, returnedReview, updateReview} from "../model.js";

export async function index(    
    reviewsList: HTMLElement, searchForm: HTMLFormElement, reviewForm: HTMLFormElement,) {
        

    const reviews: returnedReview[] = await getReviewsbyUser (); 
    console.log(`reviews = ${reviews}`);  
    renderReviews(reviews);     

    reviewsList.addEventListener("click", async (event) => {
        const target = event.target as HTMLElement;
        const listItem = target.closest("li.reviewCard");
        if (!listItem) return;  

        const reviewId = listItem.getAttribute("data-id");
        if (!reviewId) return;
        console.log(`Review clicked: ${reviewId}`); 
        const review = reviews.find((review) => review._id === reviewId);
        if (!review) return;
        reviewForm.classList.add("active");
        reviewForm["reviewText"].value = review.content;
        reviewForm["reviewId"].value = review._id;
        const label = reviewForm.querySelector('label[for="reviewText"]') as HTMLLabelElement;
        if (label) {
            label.textContent = review.itemTitle;
        }
    });

    reviewForm.addEventListener("submit", async (event) => {
        event.preventDefault();  
        const reviewText = reviewForm["reviewText"].value;  
        const reviewId = reviewForm["reviewId"].value;
        const review = reviews.find((review) => review._id === reviewId);
        if (review) {
            console.log(`Updating review: ${reviewId}`);
            review.content = reviewText;             
            await updateReview(review);  
        }
        reviewForm.reset();
        reviewForm.classList.remove("active"); 
        const updatedReviews: returnedReview[] = await getReviewsbyUser ();
        renderReviews(updatedReviews); 
    });


    function renderReviews(reviews : returnedReview[]) {
        reviewsList.innerHTML=` 
                ${reviews.map((review) => `
                    <li class="reviewCard u-clickable" data-id="${review._id}"> 
                        <h3>${review.itemTitle}</h3>
                        <p>${review.content}</p>
                    </li>
                    `).join("\n")}`;
        console.log("Reviews rendered successfully");
    }
}