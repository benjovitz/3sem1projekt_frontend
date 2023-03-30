import { handleHttpErrors } from "../../utils.js";
import { getHeaders,API_URL } from "../../settings.js";

let headers = getHeaders()
export async function initUserProfile(){

    try {
        const response = await fetch(API_URL+"/users/userprofile",{
            headers: headers
        }).then(handleHttpErrors)
        renderUserInfo(response)
       document.getElementById("user-rating").innerText=response.ranking
       const reviews = `` 
        console.log(response)
    } catch (error) {
        
    }
}

function renderUserInfo(response){
    document.getElementById("username").innerText="Welcome "+response.username
    const userInfo = `
    <ul>
    <label for="fullName">Full Name</label>
    <li><input id="fullName" type="text" value="${response.fullName}"></li>
    <label for="email">Email</label>
    <li><input id="email" type="text" value="${response.email}"></li>
    <label for="phone">Phone</label>
    <li><input id="phone" type="text" value="${response.phone}"></li>
    <label for="address">Address</label>
    <li><input id="address" type="text" value="${response.address}"></li>
    <label for="city">City</label>
    <li><input id="city" type="text" value="${response.city}"></li>
    <label for="zip">Zip</label>
    <li><input id="zip" type="text" value="${response.zip}"></li>
    <button id="btn-save-userinfo">Save changes</button>
    </ul>
    `
    document.getElementById("user-information").innerHTML=userInfo
}