/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
import Item from './Item';
import {
  createTicket, deleteTicket, editTicket, getTicketById, getTickets,
} from './requests';

const subscribeForm = document.querySelector('.subscribe-form');
const uploadBtn = document.querySelector('.upload');
const list = document.querySelector('.list');
const modalAdd = document.querySelector('.modal_add');
const addBtn = document.querySelector('.add_button');
const modalDelete = document.querySelector('.modal_delete');
const modalEdit = document.querySelector('.modal_edit');

function render(listList) {
  listList.forEach((item) => {
    const element = new Item(item);
    element.pushItem(list);
  });

  // eslint-disable-next-line no-use-before-define
  addItemFunctionality();
}

function refreshTasks() {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  getTickets(render);
}

document.addEventListener('DOMContentLoaded', refreshTasks);

const closeBtnModalAdd = document.querySelector('.close');

closeBtnModalAdd.addEventListener('click', () => {
  modalAdd.style.display = 'none';
});

addBtn.addEventListener('click', () => {
  modalAdd.style.display = 'flex';
});

uploadBtn.addEventListener('click', refreshTasks);

subscribeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  modalAdd.style.display = 'none';
  const body = new FormData(subscribeForm);
  const name = body.get('name');
  const description = body.get('description');

  createTicket({ name, description }, () => {
    subscribeForm.reset();
    refreshTasks();
  });
});

function addItemFunctionality() {
  const items = Array.from(document.querySelectorAll('.item'));

  for (let i = 0; i < items.length; i += 1) {
    const element = items[i];
    const id = element.getAttribute('id');
    const btnEdit = element.querySelector('.edit');
    const btnCheckbox = element.querySelector('.checkbox');
    const btnDelete = element.querySelector('.delete');

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
      const description = element.querySelector('.descriotion');
      if (!description.classList.contains('toggle')) {
        description.style.display = 'flex';
        addDescription(description, id);
      } else {
        description.style.display = 'none';
        description.textContent = '';
        description.classList.toggle('toggle');
      }
    });
  }
}

function addDescription(element, id) {
  getTicketById(id, ({ ticket: { description } }) => {
    // eslint-disable-next-line no-param-reassign
    element.textContent = description;
    element.classList.toggle('toggle');
  });
}

function deleteTask(id) {
  modalDelete.style.display = 'flex';

  modalDelete.addEventListener('click', (e) => {
    if (e.target.className.includes('no')) {
      modalDelete.style.display = 'none';
      refreshTasks();
    } else {
      deleteTicket(id, () => {
        modalDelete.style.display = 'none';
        refreshTasks();
      });
    }
  });
}

function editTask(id) {
  const updateForm = document.querySelector('.update-form');
  modalEdit.style.display = 'flex';
  const inputName = modalEdit.querySelector('.name');
  const inputDescription = modalEdit.querySelector('.text');
  const closeBtn = modalEdit.querySelector('.cansel');

  getTicketById(id, ({ ticket: { name, description } }) => {
    inputName.value = name;
    inputDescription.value = description;
  });

  closeBtn.addEventListener('click', () => {
    modalEdit.style.display = 'none';
  });

  updateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const body = new FormData(updateForm);

    const name = body.get('name');
    const description = body.get('description');

    editTicket(id, { name, description }, () => {
      refreshTasks();
      modalEdit.style.display = 'none';
      body.delete('name');
      body.delete('description');
      updateForm.reset();
    });

    return null;
  });
}
