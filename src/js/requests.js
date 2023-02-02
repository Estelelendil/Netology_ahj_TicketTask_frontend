const baseUrl = 'http://localhost:7070';

const getFullPath = (postfix) => baseUrl + postfix;

function formTicketBody(obj) {
  return Object.entries(obj).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
}

function sendRequest(method, url, body, onSuccess) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);

  if (body != null) {
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  }

  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const data = JSON.parse(xhr.responseText);

        onSuccess(data);
      } catch (err) {
        console.error(err);
      }
    }
  });

  xhr.send(body);
}

export function deleteTicket(id, onSuccess) {
  sendRequest(
    'DELETE',
    getFullPath(`?method=deleteTicketById&id=${id}`),
    undefined,
    onSuccess,
  );
}

export function createTicket({ name, description }, onSuccess) {
  sendRequest(
    'POST',
    getFullPath('?method=createTicket'),
    formTicketBody({ name, description, status: false }),
    onSuccess,
  );
}

export function getTickets(onSuccess) {
  sendRequest('GET', getFullPath('?method=allTickets'), undefined, onSuccess);
}

export function getTicketById(id, onSuccess) {
  sendRequest('GET', getFullPath(`?method=ticketById&id=${id}`), undefined, onSuccess);
}

export function editTicket(id, partialObj, onSuccess) {
  sendRequest(
    'PATCH',
    getFullPath(`?method=editTicket&id=${id}`),
    formTicketBody(partialObj),
    onSuccess,
  );
}
