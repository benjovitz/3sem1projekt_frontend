//export const API_URL = "http://localhost:8080/api"
export const API_URL = "https://voxibackend.azurewebsites.net/api"

export const FETCH_NO_API_ERROR = " (Is the API online or did the endpoint exists ?)"


let headers = new Headers()

headers.append("Authorization","Bearer "+localStorage.getItem("token"))

export function setTokenHeader(){
headers.set("Authorization","Bearer "+localStorage.getItem("token"))
}

export function getHeaders(){
    return headers;
}

