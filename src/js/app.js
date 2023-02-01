/* eslint-disable no-debugger */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable no-loop-func */
/* eslint-disable prefer-template */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable array-callback-return */
/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import Item from './Item';

const subscribeForm = document.querySelector('.subscribe-form');
const nameInput = document.querySelector('.name');
const namePhone = document.querySelector('.phone');
const unsubscribeBtn = document.querySelector('.unsubscribe');
const uploadBtn = document.querySelector('.upload');
const createBtn = document.querySelector('.create');
const list = document.querySelector('.list');
const modalAdd = document.querySelector('.modal_add');
const addBtn = document.querySelector('.add_button');
const modalDelete = document.querySelector('.modal_delete');
const modalEdit = document.querySelector('.modal_edit');
console.log('modalEdit', modalEdit);

const closeBtnModalAdd = document.querySelector('.close');
console.log(modalAdd);

closeBtnModalAdd.addEventListener('click', () => {
  console.log('close');
  modalAdd.style.display = 'none';
});
addBtn.addEventListener('click', () => {
  console.log('open');
  modalAdd.style.display = 'flex';
});

function render(listList) {
  console.log('render');
  listList.map((item) => {
    const element = new Item(item);
    console.log('element', element);
    element.pushItem(list);
  });

  addItemFunctionality();
}

uploadBtn.addEventListener('click', getTasks);

subscribeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  modalAdd.style.display = 'none';
  const body = new FormData(subscribeForm);
  const xhr = new XMLHttpRequest();
  const name = body.get('name');
  const description = body.get('description');
  const sendObject = 'name=' + encodeURIComponent(name) + '&description=' + encodeURIComponent(description) + '&status=' + encodeURIComponent(false);
  console.log(sendObject);
  xhr.onreadystatechange = () => {
    if (xhr.readyState !== 4) return null;
  };
  xhr.open('POST', 'http://localhost:7070?method=createTicket');
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.send(sendObject);
  body.delete('name');
  body.delete('description');
  subscribeForm.reset();
  getTasks();
});

function addItemFunctionality() {
  const items = Array.from(document.querySelectorAll('.item'));
  console.log('ElementsFromLoop', items[0]);

  for (let i = 0; i < items.length; i++) {
    const element = items[i];
    const id = element.getAttribute('id');
    const btnEdit = element.querySelector('.edit');
    const btnCheckbox = element.querySelector('.checkbox');
    const btnDelete = element.querySelector('.delete');
    console.log('btnBtn', btnDelete);

    btnCheckbox.addEventListener('click', () => {
      btnCheckbox.classList.toggle('true');
    });

    btnDelete.addEventListener('click', () => {
      deleteTask(id);
    });

    btnEdit.addEventListener('click', (e) => {
      e.preventDefault();
      editTask(id);
    });

    element.addEventListener('click', () => {
      console.log('descriotion click');
      const descriotion = element.querySelector('.descriotion');
      if (!descriotion.classList.contains('toggle')) {
        console.log('!TOGGLE');
        descriotion.style.display = 'flex';
        addDascription(descriotion, id);
      } else {
        console.log('TOGGLE');
        descriotion.style.display = 'none';
        descriotion.textContent = '';
        descriotion.classList.toggle('toggle');
      }
    });
  }
}

function addDascription(element, id) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `http://localhost:7070?method=ticketById&id=${id}`);
  xhr.send();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      console.log('ответ', xhr.responseText);
      try {
        const data = JSON.parse(xhr.responseText);
        console.log('descriotion', data.ticket.description);
        element.textContent = data.ticket.description;
        element.classList.toggle('toggle');
      } catch (err) {
        console.error(err);
      }
    }
  });
}
function deleteTask(id) {
  modalDelete.style.display = 'flex';
  const yesBtn = modalDelete.querySelector('yes');
  const noBtn = modalDelete.querySelector('no');
  console.log(yesBtn, noBtn);
  modalDelete.addEventListener('click', (e) => {
    if (e.target.className.includes('no')) {
      console.log('e.target', e.target);
      modalDelete.style.display = 'none';
    } else {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4);
        return null;
        // alert(xhr.responseText);
      };
      xhr.open('DELETE', `http://localhost:7070?method=deleteTicketById&id=${id}`);
      xhr.send();
      modalDelete.style.display = 'none';
      getTasks();
    }
  });
}

function getTasks() {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:7070?method=allTickets');
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.send();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      console.log('ответ', xhr.responseText);
      try {
        const data = JSON.parse(xhr.responseText);
        console.log('Data', data);
        render(data);
      } catch (err) {
        console.error(err);
      }
    }
  });
}
function editTask(id) {
  const updateForm = document.querySelector('.update-form');
  modalEdit.style.display = 'flex';
  const inputName = modalEdit.querySelector('.name');
  const inputDescription = modalEdit.querySelector('.text');
  const editBtn = modalEdit.querySelector('.save');
  const closeBtn = modalEdit.querySelector('.cansel');

  console.log(editBtn, closeBtn);
  console.log('inputs', inputName, inputDescription);

  const xhr = new XMLHttpRequest();
  xhr.open('GET', `http://localhost:7070?method=ticketById&id=${id}`);
  xhr.send();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      console.log('ответ', xhr.responseText);
      try {
        const data = JSON.parse(xhr.responseText);
        console.log('descriotion', data.ticket.description);
        inputName.value = data.ticket.name;
        inputDescription.value = data.ticket.description;
      } catch (err) {
        console.error(err);
      }
    }
  });

  closeBtn.addEventListener('click', () => {
    console.log('close');
    modalEdit.style.display = 'none';
  });
  updateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const body = new FormData(updateForm);

    const name = body.get('name');
    const description = body.get('description');
    const sendObject = 'name=' + encodeURIComponent(name) + '&description=' + encodeURIComponent(description) + '&status=' + encodeURIComponent(false);
    console.log(sendObject);
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return null;
    };
    xhr.open('PATCH', `http://localhost:7070?method=editTicket&id=${id}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(sendObject);
    getTasks();
    modalEdit.style.display = 'none';
    body.delete('name');
    body.delete('description');
    updateForm.reset();
    return null;
  });
}
