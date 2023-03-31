import { handleHttpErrors } from "../../utils.js";
import { getHeaders,API_URL } from "../../settings.js";

let headers = getHeaders()
headers.append("content-type","application/json")
export async function initUserProfile(){
document.getElementById("btn-save-userinfo").onclick=updateUserInfo
getUserInfo()

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
    <label for="password">Password</label>
    <li><input id="password" type="password"></li>
    </ul>
    `
    document.getElementById("user-information").innerHTML=userInfo
}

async function updateUserInfo(){
    let newUserInfo={}
    newUserInfo.fullName = document.getElementById("fullName").value
    newUserInfo.email = document.getElementById("email").value
    newUserInfo.phone = document.getElementById("phone").value
    newUserInfo.address = document.getElementById("address").value
    newUserInfo.city = document.getElementById("city").value
    newUserInfo.zip = document.getElementById("zip").value
    newUserInfo.password=document.getElementById("password").value

    try {
        await fetch(API_URL+"/users/"+localStorage.getItem("user"),{
            method: "put",
            headers:headers,
            body:JSON.stringify(newUserInfo)
        }).then(handleHttpErrors)
        document.getElementById("success").innerText="New info saved"
    } catch (error) {
        console.log(error)
    }
}

async function getUserInfo(){
    try {
        const response = await fetch(API_URL+"/users/userprofile",{
            headers: headers
        }).then(handleHttpErrors)
        renderUserInfo(response)
       document.getElementById("user-rating").innerText=response.ranking
        console.log(response)
    } catch (error) {
        
    }
}