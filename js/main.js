const createParams = ({ limit, page, tag, genres, search }) => {
  let paramsString = "";
  if (limit) {
    paramsString += `&limit=${limit}`;
  }
  if (page) {
    paramsString += `&page=${page}`;
  }
  if (tag) {
    paramsString += "&steamspy_tags=" + tag;
  }
  if (genres) {
    paramsString += "&genres=" + genres;
  }
  if (search) {
    paramsString += `&q=${search}`;
  }
  return paramsString;
};

const getSteamAPI = async (params) => {
  try {
    const url = `https://steam-api-mass.onrender.com/games?${createParams(
      params
    )}`;
    const res = await fetch(url);
    const { data } = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

//Choose element
const inputSearch = document.querySelector("#input");
const searchBtn = document.querySelector("#btn-search");
const resultTitle = document.querySelector("#result .head h1");
const freeGameBody = document.querySelector("#best-games .body");
const bodyResult = document.querySelector("#result .body");
const listCategories = document.querySelectorAll("#category li");
const listGenres = document.querySelectorAll("#genres li");
//Variable
let typeOrSearch;
let chooseItems;

//==============CREATE GAMES================//
const createGame = ({ typeList, areaAddGame }) => {
  typeList.forEach((gameItem) => {
    const divItems = document.createElement("div");
    divItems.setAttribute("class", "items");
    areaAddGame.appendChild(divItems);
    const imgGame = document.createElement("img");
    imgGame.setAttribute("src", gameItem["header_image"]);
    divItems.appendChild(imgGame);
    const divInfo = document.createElement("div");
    divInfo.setAttribute("class", "info");
    divItems.appendChild(divInfo);
    const pName = document.createElement("p");
    pName.setAttribute("class", "name");
    pName.innerHTML = gameItem.name;
    divInfo.appendChild(pName);
    const pPrice = document.createElement("p");
    pPrice.setAttribute("class", "price");
    if (gameItem.price) {
      pPrice.innerHTML = `Price: ${gameItem.price} $`;
    } else {
      pPrice.innerHTML = "Free to play";
    }
    divInfo.appendChild(pPrice);
  });
};
//========================END===================//

//====================GET DETAIL GAMES=====================//
const linkToDetail = (listItems) => {
  listItems.forEach((e) => {
    e.addEventListener("click", () => {
      const img = e.querySelector("img");
      const srcImg = img.getAttribute("src");
      console.log(srcImg);
      const queryRegex = /[0-9]+/m;
      const appidItem = queryRegex.exec(srcImg);
      window.location.assign(
        `${window.location.origin}/detail.html?id=${appidItem}`
      );
    });
  });
};

//===================REMOVE LIST=====================//
const removeList = (list) => {
  list.forEach((e) => {
    e.remove();
  });
};

//=====================LIST TYPE GAME====================//
const createGameResult = async (item, page) => {
  const content = item.innerHTML.toLocaleLowerCase();
  const getListGameByType = await getSteamAPI({
    tag: content,
    limit: 6,
    page: page,
  });
  const resultGameItems = document.querySelectorAll("#result .items");
  removeList(resultGameItems);
  createGame({ typeList: getListGameByType, areaAddGame: bodyResult });
  resultTitle.innerHTML = item.innerHTML;
  const listItems = document.querySelectorAll("#result .items");
  linkToDetail(listItems);
};

//===============Category, Genres==============//
listCategories.forEach((item) => {
  item.addEventListener("click", () => {
    typeOrSearch = "type";
    chooseItems = item;
    createGameResult(item, 1);
    index = 1;
    countNumResult.innerHTML = 1;
  });
});

listGenres.forEach((item) => {
  item.addEventListener("click", () => {
    typeOrSearch = "type";
    chooseItems = item;
    createGameResult(item, 1);
    index = 1;
    countNumResult.innerHTML = 1;
  });
});

//==============button next, back===============//
const btnLeftResult = document.querySelector("#result-games-btn .button-left");
const btnRightResult = document.querySelector(
  "#result-games-btn .button-right"
);
const countNumResult = document.querySelector(
  "#result-games-btn .count-number"
);
//==================================================================//

//=========================SEARCH GAME===========================//
const createSearchGames = async (page) => {
  const search = await getSteamAPI({
    search: inputSearch.value,
    limit: 12,
    page: page,
  });
  createGame({ typeList: search, areaAddGame: bodyResult });
  const listResultItems = document.querySelectorAll("#result .items");
  linkToDetail(listResultItems);
};

searchBtn.addEventListener("click", async () => {
  index = 1;
  typeOrSearch = "search";
  const bestGames = document.querySelector("#best-games");
  const listItems = document.querySelectorAll("#result .items");

  countNumResult.innerHTML = 1;

  if (bestGames) {
    bestGames.remove();
  }

  removeList(listItems);
  resultTitle.textContent = "Result game search";
  createSearchGames(index);
});

//==================================================================//

//=============BUTTON LEFT RIGHT RESULT================//
btnRightResult.addEventListener("click", () => {
  const resultGameItems = document.querySelectorAll("#result .items");
  removeList(resultGameItems);
  index += 1;
  if (typeOrSearch === "type") {
    createGameResult(chooseItems, index);
  }

  if (typeOrSearch === "search") {
    createSearchGames(index);
  }

  const listResultItems = document.querySelectorAll("#result .items");
  linkToDetail(listResultItems);
  countNumResult.innerHTML = index;
});

btnLeftResult.addEventListener("click", () => {
  if (index > 1) {
    const resultGameItems = document.querySelectorAll("#result .items");
    removeList(resultGameItems);
    index -= 1;
    if (typeOrSearch === "type") {
      createGameResult(chooseItems, index);
    }

    if (typeOrSearch === "search") {
      createSearchGames(index);
    }

    const listResultItems = document.querySelectorAll("#result .items");
    linkToDetail(listResultItems);
    countNumResult.innerHTML = index;
  }
});

//===================BEST GAME OF ALL TIME=====================//
const dataBestGames = async (page) => {
  const getBestGameList = await getSteamAPI({
    tag: "classic",
    limit: 3,
    page: page,
  });
  const listBestGame = document.querySelectorAll("#best-games .items");
  removeList(listBestGame);
  createGame({
    typeList: getBestGameList,
    areaAddGame: freeGameBody,
  });
  const freeGameTitle = document.querySelector("#best-games h1");
  freeGameTitle.innerHTML = "Best of all time";
  const listItems = document.querySelectorAll("#best-games .items");
  linkToDetail(listItems);
};

//=================Button next, back of best game===============//
const buttonLeftBestGame = document.querySelector(
  "#best-games-btn .button-left"
);
const buttonRightBestGame = document.querySelector(
  "#best-games-btn .button-right"
);
const countNumBestGame = document.querySelector(
  "#best-games-btn .count-number"
);

let index = 1;
buttonRightBestGame.addEventListener("click", () => {
  const listBestGame = document.querySelectorAll("#best-games .items");
  removeList(listBestGame);
  index += 1;
  dataBestGames(index);
  countNumBestGame.innerHTML = index;
});

buttonLeftBestGame.addEventListener("click", () => {
  if (index > 1) {
    const listBestGame = document.querySelectorAll("#best-games .items");
    removeList(listBestGame);
    index -= 1;
    dataBestGames(index);
    countNumBestGame.innerHTML = index;
  }
});
//===================================================//

//=================NEW RELEASE==================//

//================LOAD WEB=================//
window.addEventListener("load", async () => {
  const numberCount = document.querySelector("#best-games-btn .count-number");
  dataBestGames(1);
  numberCount.textContent = 1;
  chooseItems = listCategories[0];
  createGameResult(chooseItems, 1);
  typeOrSearch = "type";
  index = 1;
  countNumResult.innerHTML = 1;
});
