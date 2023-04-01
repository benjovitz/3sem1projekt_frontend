import { API_URL } from "../../settings.js"
import { handleHttpErrors } from "../../utils.js"
import { getMoviesForShowing } from "../editshowing/editshowing.js"
import { chooseMovie } from "../editshowing/editshowing.js"

const URL = API_URL + "/showings/"
//const movieURL = API_URL + "/movies/"

export function initAddShowing(match){
    if (match?.params?.cinemaid) {
        const cinemaId = match.params.cinemaid
        document.getElementById("btn-create-showing").onclick = evt => createShowing(cinemaId)
        document.getElementById("btn-openmodal-movie").onclick = evt => getMoviesForShowing()
        document.getElementById("modal-tbody").onclick = evt => chooseMovie(evt)
        } 
    else{
        document.getElementById("error-text").innerText = 'Missing match parameter cinemaid'
    }
}


async function createShowing(cinemaId){
    const token = localStorage.getItem("token")
    const movieId = document.getElementById("movie-id").value
    const price = document.getElementById("movie-price").value
    const dateTime = document.getElementById("movie-date").value.replace("T", " ")
    try{
        const response = await fetch(URL,{
            method:'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token},
            body:JSON.stringify({movieId, cinemaId, price, dateTime})
        }).then(handleHttpErrors)

        window.router.navigate("/edit-cinema")
    }catch(err){
        document.getElementById("error-text").innerText = err.message
    }
}

