globalThis.onload = () => {
  document.querySelector(".loader").style.display = "none";
  document.querySelector(".wrapper").style.display = "flex";

  StartSliding();
};

function StartSliding() {
  const interval = 3; //seconds
  let currentSection = 0;
  const feature = document.getElementsByTagName("li");
  setInterval(() => nextSection, interval * 1000);

  //Hack to start from the first and not 0 as 1 and 1+1=2 (so the second section);
  feature[currentSection].className = "current";

  function nextSection() {
    feature[currentSection].className = "";
    currentSection = (currentSection + 1) % feature.length;
    feature[currentSection].className = "current";
  }
}

const getItButton = document.querySelector(".getItButton");
const loginButton = document.querySelector(".loginButton");
const templateButton = document.querySelector(".templateButton");

//GET IT BUTTON
getItButton.onmouseenter = () => {
  getItButton.innerText = "NOW !";
};
getItButton.onmouseleave = () => {
  getItButton.innerText = "GET IT";
};

//TEMPLATE BUTTON
templateButton.onmouseenter = () => {
  templateButton.innerHTML = "BOILER";
};
templateButton.onmouseleave = () => {
  templateButton.innerHTML = "SERVER";
};

//LOG IN BUTTON
loginButton.onmouseenter = () => {
  loginButton.innerText = "HELLO";
};
loginButton.onmouseleave = () => {
  loginButton.innerText = "LOG IN";
};
