
let data = localStorage.getItem("movieData");
let jsonData = JSON.parse(data);

const h = document.getElementById("title");
const img = document.getElementById("poster");
h.innerHTML = jsonData.Title;
img.src = jsonData.Poster;
img.alt = "Poster of " + jsonData.Title;
