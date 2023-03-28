import { handleHttpErrors,sanitizeStringWithTableRows } from "../../utils.js"
import { API_URL,getHeaders } from "../../settings.js"

let URL = API_URL+"/cinema/"

export async function initCinema(match){
    if(match?.params?.id){
        const id= match.params.id
        try {
            const cinema = await fetch(URL+id).then(handleHttpErrors)
            console.log(cinema)
            renderCinema(cinema)
        } catch (error) {
            
        }
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


