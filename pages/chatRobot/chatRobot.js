import { API_URL } from "../../settings.js"
import { handleHttpErrors } from "../../utils.js"

let URL = API_URL+"/chat/"

let headers = new Headers()

localStorage.setItem("chatStarted","false")

headers.set("content-type","application/json")

document.getElementById("collapse").onclick=collapse
let isCollapsed = false;

export async function initChatRobot(){
    try{
        let chatObject = {}
        chatObject.chatStarted=localStorage.getItem("chatStarted")
        chatObject.chatMessage=document.getElementById("chat-message").value
        const response = await fetch(URL,{
            headers: headers,
            method: "post",
            body: JSON.stringify(chatObject)
        }).then(handleHttpErrors)
        renderChat(chatObject.chatMessage,response.chatMessage)
    }catch (err){
        console.log(err)
    }
    localStorage.setItem("chatStarted","true")
}

function renderChat(sent,received){
    const messageSent = document.createElement("div")
    messageSent.className="message sent"
    messageSent.innerHTML=`<p>${sent}</p>`
    const messageReceived = document.createElement("div")
    messageReceived.className="message received"
    messageReceived.innerHTML=`<p>${received}</p>`
    console.log(messageSent)
    document.getElementById("messages").appendChild(messageSent)
    document.getElementById("messages").appendChild(messageReceived)
    
}
function collapse(){
    if(isCollapsed){
        document.getElementById("messages").style.display="block"
        isCollapsed=false
    }else{
        document.getElementById("messages").style.display="none"
        isCollapsed=true;
    }
    
}