import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js"
import { API_URL } from "../../settings.js"

const URL = API_URL + "/showings/"
const movieURL = API_URL + "/movies/"

export function initEditShowing(match){
    if (match?.params?.showingid) {
        const showingId = match.params.showingid
        getSingleShowingDetails(showingId)
        document.getElementById("btn-edit-showing").onclick = evt => editShowing(showingId)
        document.getElementById("btn-delete-showing").onclick = evt => deleteShowing(showingId)
        document.getElementById("btn-openmodal-movie").onclick = evt => getMoviesForShowing()
        document.getElementById("modal-tbody").onclick = evt => chooseMovie(evt)

    }else{
        document.getElementById("error-text").innerText = 'Missing match parameter cinemaid'
    }
}

async function getSingleShowingDetails(showingId){
    const token = localStorage.getItem("token")
    const movieId = document.getElementById("movie-id")
    const movieName = document.getElementById("movie-name")
    const price = document.getElementById("movie-price")
    const dateTime = document.getElementById("movie-date")
    try{
        const response = await fetch(URL+showingId,{
            headers: { 
                'Authorization': 'Bearer ' + token},
        }).then(handleHttpErrors)
        movieId.value = response.movieId
        movieName.value = response.movieName
        price.value = response.price
        dateTime.value = response.dateTime
        
    }catch(err){
        document.getElementById("error-text").innerText = err.message
    }  
}

async function editShowing(showingId){
    const token = localStorage.getItem("token")
    const movieId = document.getElementById("movie-id").value
    const price = document.getElementById("movie-price").value
    const dateTime = document.getElementById("movie-date").value.replace("T", " ")
    try{
        const response = await fetch(URL+showingId,{
            method:'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token},
            body:JSON.stringify({movieId, price, dateTime})
        }).then(handleHttpErrors)

        window.router.navigate("/owner-showings")
    }catch(err){
        document.getElementById("error-text").innerText = err.message
    }
}

async function deleteShowing(showingId){
    const token = localStorage.getItem("token")
    try{
        const response = await fetch(URL + showingId,{
            method:'DELETE',
            headers: { 'Authorization': 'Bearer ' + token}
        })

        window.router.navigate("/owner/showings")
    }catch(err){
        document.getElementById("error-text").innerText = err.message
    }
}

export async function getMoviesForShowing(){
    const token = localStorage.getItem("token")

    try {
        const movies = await fetch(movieURL, {
            headers: { 'Authorization': 'Bearer ' + token}
        }).then(handleHttpErrors)
        let tableRows = movies.map(m=>`
    <td>${m.name}</td>
    <td>${m.playTime}</td>
    <td>${m.genre}</td>
    <td>
        <button id="btn-movie-${m.id}-${m.name}" type="button" class="btn btn-primary" data-bs-dismiss="modal">Choose</button>
    </td>
    </tr>`).join("")

        document.getElementById("modal-tbody").innerHTML=sanitizeStringWithTableRows(tableRows)
    } catch (err) {
        document.getElementById("error-text").innerText = err.message
    }
  }

  export function chooseMovie(evt){
    
    const target = evt.target
    const targetId = target.id
    const targetIdSplit = targetId.split("-")
    const movieId =  targetIdSplit[2]
    const movieName =  targetIdSplit[3]
    if(targetIdSplit[1] == "movie"){
        document.getElementById("movie-id").value = movieId
        document.getElementById("movie-name").value = movieName
    }
  }

