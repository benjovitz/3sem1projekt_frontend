import { handleHttpErrors,sanitizeStringWithTableRows } from "../../utils.js"
import { API_URL,getHeaders } from "../../settings.js"

let URL = API_URL+"/cinema/"

let headers = getHeaders()

export async function initEditCinema(){
    try {
        const cinema = await fetch(URL+"edit",{
            headers:headers
        }).then(handleHttpErrors)
        console.log(cinema)
        renderCinema(cinema[0])
    } catch (error) {
        
    }
}

function renderCinema(cinema){
    document.getElementById("cinema-name").innerText=cinema.name
    document.getElementById("cinema-description").innerText=cinema.description
    document.getElementById("owner-name").innerText=cinema.ownerName
    document.getElementById("owner-address").innerText=cinema.street
    document.getElementById("owner-city").innerText=cinema.city
    document.getElementById("owner-zip").innerText=cinema.zip
    //email
    //phone
}


