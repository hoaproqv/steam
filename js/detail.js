const getDetailData = async (appid) => {
  try {
    const url = `https://steam-api-mass.onrender.com/single-game/${appid}`;
    const res = await fetch(url);
    const { data } = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

const queryRegex = /^\?id\=([0-9]+)$/;
const appid = queryRegex.exec(window.location.search);
const id = appid[1];
const loadDataGameDetail = async () => {
  const dataGameDetail = await getDetailData(id);
  const imgPage = document.querySelector("#content img");
  imgPage.setAttribute("src", dataGameDetail["header_image"]);
  const priceGame = document.querySelector("#price-item");
  const price = dataGameDetail.price;
  if (price) {
    priceGame.innerHTML = `${price} $`;
  } else {
    priceGame.innerHTML = "Free";
  }
  const nameGame = document.querySelectorAll(".name-detail");
  nameGame.forEach((e) => {
    e.innerHTML = dataGameDetail.name;
  });
  const requiredAge = document.querySelector("#required-age");
  const ageRequired = dataGameDetail["required_age"];
  if (ageRequired) {
    requiredAge.innerHTML = `${ageRequired} +`;
  } else {
    requiredAge.innerHTML = "Playable for all ages";
  }
  const developer = document.querySelector("#developer");
  developer.innerHTML = dataGameDetail.developer.join(", ");
  const platforms = document.querySelector("#platforms");
  platforms.innerHTML = dataGameDetail.platforms.join(", ");
  const description = document.querySelector("#description");
  description.innerHTML = dataGameDetail.description;
  const main = document.querySelector("main");
  main.style.backgroundImage = "url(" + `${dataGameDetail.background}` + ")";
  const releaseDate = document.querySelector("#release-date");
  const d = new Date(dataGameDetail["release_date"])
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let month = months[d.getMonth()];
  releaseDate.innerHTML = `${d.getDate()}  ${month}, ${d.getFullYear()}`

  //create steam tags//
  const steamTags = dataGameDetail["steamspy_tags"];
  const steamspyTags = document.querySelector("#steamspy-tags");
  const ulList = document.createElement("ul")
  steamspyTags.appendChild(ulList);
  steamTags.forEach(e=>{
    const liList = document.createElement("li");
    liList.innerHTML = e;
    ulList.appendChild(liList);
  })
};

window.addEventListener("load", () => {
  loadDataGameDetail();
});
