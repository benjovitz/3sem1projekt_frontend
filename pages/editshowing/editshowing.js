import { handleHttpErrors } from "../../utils.js"
import { API_URL } from "../../settings.js"

const URL = API_URL + "/showings/"

export function initEditShowing(match){
    if (match?.params?.showingid) {
        const showingId = match.params.showingid
        document.getElementById("btn-edit-showing").onclick = evt => editShowing(showingId)
        document.getElementById("btn-delete-showing").onclick = evt => deleteShowing(showingId)

    }else{
        document.getElementById("error-text").innerText = 'Missing match parameter cinemaid'
    }
}


async function editShowing(showingId){
    const token = localStorage.getItem("token")
    const movieId = document.getElementById("movie-id").value
    const price = document.getElementById("movie-price").value
    const dateTime = document.getElementById("movie-date").value
    try{
        const response = await fetch(URL+showingId,{
            method:'PUT',
            headers: { 'Authorization': 'Bearer ' + token},
            body:JSON.stringify({movieId, price, dateTime})
        }).then(handleHttpErrors)

        //window.router.navigate("/")
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
        }).then(handleHttpErrors)
    }catch(err){
        document.getElementById("error-text").innerText = err.message
    }
}