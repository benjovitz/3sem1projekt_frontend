import { API_URL } from "../../settings.js"
import { handleHttpErrors } from "../../utils.js"

const URL = API_URL + "/showings/"
//const movieURL = API_URL + "/movies/"

export function initAddShowing(match){
    if (match?.params?.cinemaid) {
        const cinemaId = match.params.cinemaid
        document.getElementById("btn-create-showing").onclick = evt => createShowing(cinemaId)
        } 
    else{
        document.getElementById("error-text").innerText = 'Missing match parameter cinemaid'
    }
}


async function createShowing(cinemaId){
    const token = localStorage.getItem("token")
    const movieId = document.getElementById("movie-id").value
    const price = document.getElementById("movie-price").value
    const dateTime = document.getElementById("movie-date").value
    try{
        const response = await fetch(URL,{
            method:'POST',
            headers: { 'Authorization': 'Bearer ' + token},
            body:JSON.stringify({movieId, cinemaId, price, dateTime})
        }).then(handleHttpErrors)

        //window.router.navigate("/")
    }catch(err){
        document.getElementById("error-text").innerText = err.message
    }
}

