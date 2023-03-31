import { handleHttpErrors } from "../../utils.js";
import { API_URL,getHeaders } from "../../settings.js";

let headers = getHeaders()
let URL = API_URL+"/cinema/"

export async function initAllCinemas(){
    document.getElementById("tbody").onclick=showCinemaSite
    try {
        const cinemas = await fetch(URL).then(handleHttpErrors)
        renderCinema(cinemas)
    } catch (error) {
        
    }
}

function renderCinema(cinemas){
let tableRows = cinemas.map(c=>`
<tr id="cinema-row-${c.id}">
<td>${c.name}</td>
<td>${c.description}</td>
<td>${c.street}</td>
<td>${c.city}</td>
<td>${c.zip}</td>
<td>${c.rating}</td>
<td>${c.numberOfRatings}</td>
<td><button id="btn_view_${c.id}">View site</button></td>
</tr>`).join("")
document.getElementById("tbody").innerHTML=tableRows
}

function showCinemaSite(evt){
    const target = evt.target.id
    if(!evt.target.id.startsWith("btn")){
        return
    }
    const parts = target.split("_")
    const id = parts[2]
    window.router.navigate("cinemaSite?id="+id)
}