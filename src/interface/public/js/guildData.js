window.onload = () => {
  document.querySelector('.loader').style.display = 'none';
  document.querySelector('.wrapper').style.display = 'flex';
}

function openTab(evt, tabName) {
  console.log(`openTab: ${evt} ${tabName}`);
  let i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabContent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}