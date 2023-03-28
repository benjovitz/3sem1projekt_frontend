import { handleHttpErrors,sanitizeStringWithTableRows } from "../../utils.js"
import { API_URL,getHeaders } from "../../settings.js"

let URL = API_URL+"/cinema/"

let headers = getHeaders()



export async function initEditCinema(){
    document.getElementById("tbody").onclick=saveChanges
    try {
        const cinema = await fetch(URL+"edit",{
            headers:headers
        }).then(handleHttpErrors)
        console.log(cinema)
        renderCinema(cinema)
    } catch (error) {
        
    }
}

function renderCinema(cinema){
let tableRows = cinema.map(c=>`
<tr id="cinema-row-${c.id}">
<td><input id="cinema-name${c.id}" type="text" value="${c.name}"></td>
<td><input id="cinema-description${c.id}" type="text" value="${c.description}"></td>
<td><input id="cinema-street${c.id}" type="text" value="${c.street}"></td>
<td><input id="cinema-city${c.id}" type="text" value="${c.city}"></td>
<td><input id="cinema-zip${c.id}" type="text" value="${c.zip}"></td>
<td>${c.rating}</td>
<td>${c.numberOfRatings}</td>
<td><button id="edit_${c.id}">save changes</button></td>
</tr>`).join("")
document.getElementById("tbody").innerHTML=tableRows
}

async function saveChanges(evt){
const target = evt.target

headers.set("content-type","application/json")

if(!evt.target.id.startsWith("edit")){
    return
}
const parts = target.id.split("_")
const id = parts[1]
console.log(id)
let edittedCinema = {}
edittedCinema.name=document.getElementById("cinema-name"+id).value
edittedCinema.description=document.getElementById("cinema-description"+id).value
edittedCinema.street=document.getElementById("cinema-street"+id).value
edittedCinema.city=document.getElementById("cinema-city"+id).value
edittedCinema.zip=document.getElementById("cinema-zip"+id).value
try {
    const cinema = await fetch(URL+id,{
        headers: headers,
        method:"PUT",
        body: JSON.stringify(edittedCinema)
    })
} catch (error) {
    console.log(error)
}

}


