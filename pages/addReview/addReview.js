import { API_URL } from "../../settings.js"
import {handleHttpErrors} from "../../utils.js"

const URL = API_URL + "/review/"

export function initAddReview() {
    document.getElementById("addReview-btn").onclick = addReview
}

const stars = document.querySelectorAll(".star");
const ratingEl = document.querySelector("#rating");

let rating = 0;

stars.forEach((star) => {
    star.addEventListener("click", () => {
        rating = parseInt(star.dataset.rating);
        updateRating();
    });

    star.addEventListener("mouseover", () => {
        resetStars();
        highlightStars(parseInt(star.dataset.rating));
    });

    star.addEventListener("mouseout", () => {
        resetStars();
        highlightStars(rating);
    });
});

function updateRating() {
    ratingEl.textContent = rating;
}

function resetStars() {
    stars.forEach((star) => {
        star.classList.remove("active");
    });
}

function highlightStars(count) {
    for (let i = 0; i < count; i++) {
        stars[i].classList.add("active");
    }
}


async function addReview() {

}