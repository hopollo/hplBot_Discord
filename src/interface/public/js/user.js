window.onload = () => {
  document.querySelector('.loader').style.display = 'none';
  document.querySelector('.wrapper').style.display = 'flex';
}

function getData(guild) {
  console.log('fetching guild data');
  fetch(`/${guild}`)
  .then(res => res.json())
  // removove this then after
  .then(data => {
    console.log(data);
    const table = document.querySelector('table');
    for (const i in data.commands) {
      const elTable = document.createElement('tr');
      
      const state = document.createElement('td');
        const stateBtn = document.createElement('button');
          stateBtn.appendChild(document.createTextNode('ON/OFF'));
        state.appendChild(stateBtn);
      
      const elCmd = document.createElement('td')
        elCmd.appendChild(document.createTextNode(i));
        state.appendChild(elCmd);

      const elResp = document.createElement('td');
        elResp.appendChild(document.createTextNode(data.commands[i]));
        state.appendChild(elResp);

      const actions = document.createElement('td');
        const editBtn = document.createElement('button');
          editBtn.appendChild(document.createTextNode('Edit'));
        actions.appendChild(editBtn)
       
        const deleteBtn = document.createElement('button');
          deleteBtnImg = document.createElement('img')
            deleteBtn.srcset = './images/bin.svg';
            deleteBtn.src = './images/bin.svg';
          deleteBtn.appendChild(deleteBtnImg);
        actions.appendChild(deleteBtn)
      state.appendChild(actions);

      elTable.appendChild(state);
      elTable.appendChild(elCmd);
      elTable.appendChild(elResp);
      elTable.appendChild(actions);

      table.appendChild(elTable);
    }
  })
  .catch(console.error);
}

getData(document.querySelector('select').value);

document.querySelector('select').onchange = () => {
  getData(document.querySelector('select').value);
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