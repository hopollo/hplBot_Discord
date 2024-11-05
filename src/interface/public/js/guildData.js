globalThis.onload = () => {
  document.querySelector(".loader").style.display = "none";
  document.querySelector(".wrapper").style.display = "flex";
};

function _openTab(evt, tabName) {
  const guildID = document.querySelector("select").value;

  fetch(`${guildID}/${tabName.toLowerCase()}`, {
    headers: {
      "authorization": globalThis.location.href,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (tabName == "Commands") {
        // Clear all commands
        $("#commandsContainer").find('tr:not(".titles")').remove();
        for (el in data) {
          $(`#commandsContainer`).append(`
            <tr>
              <td class="command">${el}</td>
              <td class="response">${data[el]}</td>
              <td>
                <button onClick="editCmd()">Edit</button>
                <button onClick="deleteCmd()">Delete</button>  
              </td>
            </tr>
          `);
        }
      } else {
        for (el in data) {
          $(`#configContainer #optionType`).append(`
            <option value="">${el}</option>
          `);
        }
      }
    })
    .catch(console.error);

  let i;
  const tabcontent = "";
  const tablinks = "";
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

function _editCmd() {
  alert("ok");
}

function _deleteCmd() {
  // delete selected command
  const prompt = `
    <div style='display: "flex"; flex-direction:"column";'>
      <h3>Command delete</h3>
      <p>Are you sure you want to delete : <span style='color:"red";'>TESTCMD</span></p>
      <button class="confirm default" onClick="confirm">Confirm</button>
      <button class="cancel red" onClick="cancel">Cancel</button>
    </div>
  `;
  $(".wrapper").prepend(prompt);
}

function _cancel() {
  console.log("cancelling action");
}

function _confirm() {
  console.log("confirm action");
}
