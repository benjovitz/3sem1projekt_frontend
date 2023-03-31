import { handleHttpErrors } from "../../utils.js"
import { API_URL,getHeaders } from "../../settings.js"

let headers = getHeaders()
headers.append("content-type","application/json")
export function initCreateCinema(){
    document.getElementById("btn-create-cinema").onclick=createCinema
}

async function createCinema(){
    let newCinema = {}
    newCinema.name=document.getElementById("name").value
    newCinema.description=document.getElementById("description").value
    newCinema.street=document.getElementById("street").value
    newCinema.city=document.getElementById("city").value
    newCinema.zip=document.getElementById("zip").value
    try {
        await fetch(API_URL+"/cinema/",{
            headers:headers,
            body:JSON.stringify(newCinema),
            method:"post"
        }).then(handleHttpErrors)
        document.getElementById("success-message").innerText="success, cinema created!"
    } catch (error) {
        console.log(error)
        document.getElementById("error-message").innerText="Error, could not create cinema!"
    }
}