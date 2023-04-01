import { handleHttpErrors,sanitizeStringWithTableRows } from "../../utils.js"
import { API_URL,getHeaders } from "../../settings.js"

let URL = API_URL+"/cinema/"

let headers = getHeaders()
let oldTicketId
let oldSeats =[]
let id = 0
export async function initCinema(match){
    document.getElementById("review-link").onclick=reviewCinema
    document.getElementById("showings").onclick = evt => showingEvent(evt)
    if(match?.params?.id){
        id = match.params.id
        try {
            const cinema = await fetch(URL+id).then(handleHttpErrors)
            getShows(id)
            getReviews(id)
            renderCinema(cinema)
        } catch (error) {
           console.log(error)
        }
    }
    
}

function renderCinema(cinema){
    document.getElementById("cinema-name").innerText=cinema.name
    document.getElementById("rating").innerText="Rating: "+cinema.rating+" Number of ratings: "+cinema.numberOfRatings
    document.getElementById("cinema-description").innerText=cinema.description
    document.getElementById("owner-name").innerText=cinema.ownerName
    document.getElementById("owner-address").innerText=cinema.street
    document.getElementById("owner-city").innerText=cinema.city
    document.getElementById("owner-zip").innerText=cinema.zip
    createSeats(cinema.seats)
    //email
    //phone
}

async function getReviews(id){
    
    try {
        
        const reviews = await fetch (API_URL+"/review/cinema/"+id,{
            headers: headers
        }).then(handleHttpErrors)
        reviews.forEach(review => {
            const div = document.createElement("div")
            div.innerHTML=`
            <h5>${review.username}</h5>
            <h5>score: ${review.score}</h5>
            <div><p>Comment: ${review.comment}</p></div>`
            document.getElementById("reviews").appendChild(div)
        });
    } catch (error) {
        
    }
}

async function getShows(id){
    
    try {
        const shows = await fetch (API_URL+"/showings/cinema/"+id,{
            headers: headers
        }).then(handleHttpErrors)

        shows.forEach(show => {
            const div = document.createElement("div")
            div.className="ticket"
            div.id="showing_"+show.id
            div.innerHTML=`
            <h5>${show.movieName}</h5>
            <h5>${show.price}</h5>
            <div><p>${show.dateTime}</p></div>
            <button id="btn-create-reservation-${show.cinemaId}-${show.id}" type="button" class="btn btn-primary" style="width:90px; height:50px">Book</button>
            `
            document.getElementById("showings").appendChild(div)
        });
    } catch (error) {
        console.log(error.message)
    }
}

function createSeats(arr){
    arr.sort();

    // Create an empty object to store the rows
    const rows = {};
    
    // Loop through the sorted array and put each element into its respective row
    for (const element of arr) {
      const firstLetter = element.charAt(0);
      if (!rows[firstLetter]) {
        rows[firstLetter] = [];
      }
      rows[firstLetter].push(element);
    }
    
    // Output the rows in HTML format
    const container = document.getElementById("seats");
    for (const row in rows) {
      const rowContainer = document.createElement("div");
      rowContainer.classList.add("row-cinema");
      container.appendChild(rowContainer);
    
      for (const seat of rows[row]) {
        const seatElement = document.createElement("div");
        seatElement.id=seat
        seatElement.classList.add("seat");
        seatElement.innerText = seat;
        rowContainer.appendChild(seatElement);
      }
    }    
}

async function showReservedSeats(evt){
    if(oldSeats){
        colorSeats(oldSeats,"green")
    }
    if(oldTicketId){
        document.getElementById("showing_"+oldTicketId).style.backgroundColor="transparent"
    }
    const target = evt.target.id

    if(!target.startsWith("showing_")){
        return
    }

    const parts = target.split("_")
    const id = parts[1]
    if(oldTicketId==id){
        oldTicketId=null
        return
    }
    try {
        const reservations = await fetch(API_URL+"/reservations/cinema/"+id,{
            headers:headers
        }).then(handleHttpErrors)
        document.getElementById("showing_"+id).style.backgroundColor="#dc143c"
        colorSeats(reservations,"#dc143c")
        oldSeats=reservations
    } catch (error) {
        
    }
    oldTicketId=id
}

function colorSeats(reservations,color){
    
    let seats = reservations.map(r => r.seats)
    seats.forEach(seatRes => {
        seatRes.forEach(seat => {
            document.getElementById(seat).style.backgroundColor=color
        });
    });
}

function reviewCinema() {
    window.router.navigate("add-review?id="+id)
}

function showingEvent(evt){
        const target = evt.target
        const targetId = target.id
        const targetIdSplit = targetId.split("-")
        const cinemaId = targetIdSplit[3]
        const showingId = targetIdSplit[4]
        if(targetIdSplit[1]=='create'){
            window.router.navigate(`/create-reservation?showingid=${showingId}&cinemaid=${cinemaId}`)
        }
        else{
            showReservedSeats(evt)
        }
}

