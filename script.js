let allTasks = [];
let valueInput = "";
let input = null;

window.onload = async () => {
  input = document.getElementById("addTask");
  input.addEventListener("change", updateValue);
  const resp = await fetch("http://localhost:8000/allTasks", {
    method: "GET"
  })
  const result = await resp.json();
  allTasks = result.data;
  render();
};

const updateValue = (event) => {
  valueInput = event.target.value;
};

const onClickButton = async () => {
  if (!valueInput) {
    alert("Enter text");
    return;
  }
  allTasks.push({
    text: valueInput,
    isCheck: false,
    isEdit: false
  });
  const resp = await fetch("http://localhost:8000/createTask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(
      {
        text: valueInput,
        isCheck: false,
      }
    )
  });
  const result = await resp.json();
  allTasks = result.data;
  valueInput = "";
  input.value = "";
  render();
};

const render = () => {
  const content = document.getElementById("content-page");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  const button = document.querySelector(".deleteItems");
  allTasks.length === 0 ?
    button.classList.add("displayNone") :
    button.classList.remove("displayNone");
  button.onclick = () => {
    onClickDeleteAll();
  };

  allTasks.sort((a, b) => a.isCheck === b.isCheck ? 0 : a.isCheck ? 1 : -1);
  allTasks.map((item, idx) => {
    const container = document.createElement("div");
    container.id = `task-${idx}`;
    container.className = "taskContainer";

    const blockOfTasks = document.createElement("div");
    blockOfTasks.className = !item.isEdit ? "blockOfTasks" : "blockOfTasks displayNone";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.isCheck;
    checkbox.onchange = () => {
      onChangeCheckbox(idx);
    };
    blockOfTasks.appendChild(checkbox);
    const text = document.createElement("p");
    text.innerText = item.text;
    text.className = item.isCheck ? "textTask doneText" : "textTask";
    blockOfTasks.appendChild(text);
    container.appendChild(blockOfTasks);

    const input = document.createElement("input");
    input.type = "text";
    input.className = item.isEdit?  "inputEdit" : "inputEdit displayNone";
    input.value = item.text;
    container.appendChild(input);
    input.addEventListener("change", (event) => {
      input.value = event.target.value;
    });

    const blockOfIcons = document.createElement("div");
    blockOfIcons.className = !item.isEdit ? "blockOfIcons" : "blockOfIcons displayNone";
    const iconEdit = document.createElement("img");
    iconEdit.src = "image/edit.png";
    if (!item.isCheck) blockOfIcons.appendChild(iconEdit);
    iconEdit.onclick = () => {
      onClickEdit(idx);
    };
    const iconDelete = document.createElement("img");
    iconDelete.src = "image/close.png";
    iconDelete.onclick = () => {
      onClickDelete(idx);
    };
    blockOfIcons.appendChild(iconDelete);
    container.appendChild(blockOfIcons);

    const blockEdit = document.createElement("div");
    blockEdit.className = item.isEdit?  "blockIcons" : "blockIcons displayNone";
    const iconDone = document.createElement("img");
    iconDone.src = "image/done.png";
    iconDone.onclick = () => {
      onClickSave(input.value, idx);
    };
    blockEdit.appendChild(iconDone);
    const iconClose = document.createElement("img");
    iconClose.src = "image/close.png";
    iconClose.onclick = () => {
      onClickClose(idx);
    };
    blockEdit.appendChild(iconClose);
    container.appendChild(blockEdit);

    content.appendChild(container);
  });
};

const onClickDeleteAll = () => {
  const result = confirm("Are you sure?");
  if (!result) return;
  allTasks.splice(0, allTasks.length);
  render();
};

const onChangeCheckbox = async (idx) => {
  allTasks[idx].isCheck = !allTasks[idx].isCheck;
  delete allTasks[idx].isEdit;
  await fetch("http://localhost:8000/updateTask", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(
      allTasks[idx]
    )
  });
  render();
};

const onClickDelete = async (idx) => {
  const answer = confirm("Are you sure?");
  if (!answer) return;
  const resp = await fetch(`http://localhost:8000/deleteTask?id=${allTasks[idx].id}`, {
    method: "DELETE"
  });
  const result = await resp.json();
  allTasks = result.data;
  render();
};

const onClickEdit = (idx) => {
  allTasks[idx].isEdit = !allTasks[idx].isEdit;
  render();
};

const onClickSave = async (text, idx) => {
  if (text.length === 0) {
    alert("Enter text");
    return;
  }
  allTasks[idx].text = text;
  delete allTasks[idx].isEdit;
  await fetch("http://localhost:8000/updateTask", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(
      allTasks[idx]
    )
  });
  render();
};

const onClickClose = (idx) => {
  allTasks[idx].isEdit = !allTasks[idx].isEdit;
  render();
};
