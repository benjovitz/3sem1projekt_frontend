//import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import "./navigo_EditedByLars.js"  //Will create the global Navigo, with a few changes, object used below
//import "./navigo.min.js"  //Will create the global Navigo object used below

import {
  setActiveLink, adjustForMissingHash, renderTemplate, loadTemplate
} from "./utils.js"

import { initLogin,logout } from "./pages/login/login.js"
import { initSignup } from "./pages/signup/signup.js"
import { initMap } from "./pages/map/map.js";
import { initEditCinema } from "./pages/editCinema/editCinema.js";
import { initCinema } from "./pages/cinemaSite/cinemaSite.js";
import { initAllCinemas } from "./pages/allCinemas/allCinemas.js";


window.addEventListener("load", async () => {


  const templateSignup = await loadTemplate("./pages/signup/signup.html")
  const templateLogin = await loadTemplate("./pages/login/login.html")
  const templateNotFound = await loadTemplate("./pages/notFound/notFound.html")
  const templateMap = await loadTemplate("./pages/map/map.html")
  const templateEditCinema = await loadTemplate("./pages/editCinema/editCinema.html")
  const templateCineamSite = await loadTemplate("./pages/cinemaSite/cinemaSite.html")
  const templateAllCinemas = await loadTemplate("./pages/allCinemas/allCinemas.html")

  adjustForMissingHash()

  const router = new Navigo("/", { hash: true });
  //Not especially nice, BUT MEANT to simplify things. Make the router global so it can be accessed from all js-files
  window.router = router

  router
    .hooks({
      before(done, match) {
        setActiveLink("menu", match.url)
        done()
      }
    })
    .on({
      //For very simple "templates", you can just insert your HTML directly like below
      "/": () => document.getElementById("content").innerHTML = `
        <h2>Home</h2>
        <p style='margin-top:1em;font-size: 1.5em;color:darkgray;'>
          TBD
        </p>
     `,
      "/signup": () => {
        renderTemplate(templateSignup, "content")
        initSignup()
      },
      "/login": () => {
        renderTemplate(templateLogin, "content")
        initLogin()
      },
      "/logout": () => {
        logout()
      },
      "/map": () => {
        renderTemplate(templateMap,"content")
        initMap()
      },
      "/edit-cinema": () => {
        renderTemplate(templateEditCinema,"content")
        initEditCinema()
      },
      "/cinemaSite": (match) => {
        renderTemplate(templateCineamSite,"content")
        initCinema(match)
      },
      "/all-cinemas": () => {
        renderTemplate(templateAllCinemas,"content")
        initAllCinemas()
      }
    })
    .notFound(() => {
      renderTemplate(templateNotFound, "content")
    })
    .resolve()
});


window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
  alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber
    + ' Column: ' + column + ' StackTrace: ' + errorObj);
}