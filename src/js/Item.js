export default class Item {
  constructor(item) {
    this.element = document.createElement('div');
    this.name = item.name;
    this.status = item.status;
    this.id = item.id;
    this.date = new Date(item.created);
    this.created = `${this.date.getDate()}.${this.date.getMonth()}.${this.date.getFullYear()} ${this.date.getMinutes()}:${this.date.getHours()}`;
  }

  pushItem(parent) {
    this.element.classList.add('item');
    this.element.setAttribute('id', this.id);
    const container = document.createElement('div');
    container.classList.add('container');
    const checkbox = document.createElement('button');
    checkbox.classList.add(`${this.status}`, 'checkbox');
    container.append(checkbox);

    const nameText = document.createElement('p');
    nameText.textContent = this.name;
    container.append(nameText);

    const dateText = document.createElement('p');
    dateText.textContent = this.created;
    container.append(dateText);

    const buttonBox = document.createElement('div');
    buttonBox.classList.add('buttons');
    const buttonEdit = document.createElement('button');
    buttonEdit.classList.add('edit', 'btn');
    const buttonDelete = document.createElement('button');
    buttonDelete.classList.add('delete', 'btn');
    buttonBox.append(buttonEdit);
    buttonBox.append(buttonDelete);
    container.append(buttonBox);
    this.element.append(container);

    const descriotion = document.createElement('div');
    descriotion.classList.add('descriotion');
    this.element.append(descriotion);

    parent.append(this.element);
  }
}
