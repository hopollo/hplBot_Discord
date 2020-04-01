document.querySelector('select').onchange = () => {
  getData(document.querySelector('select').value);
}

function getData(guild) {
  fetch(`/guild/${guild}`)
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
}