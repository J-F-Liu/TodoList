import _ from "lodash";

export default class TodoList {
  constructor(storagekey) {
    this.storagekey = storagekey;
    this.load();
  }

  load() {
    const data = window.localStorage.getItem(this.storagekey);
    if (data != null) {
      this.items = JSON.parse(data);
    } else {
      this.items = [];
    }
    this.maxId = _.isEmpty(this.items) ? 0 : _.maxBy(this.items, "id").id;
  }

  save() {
    window.localStorage.setItem(this.storagekey, JSON.stringify(this.items));
  }

  newId() {
    this.maxId += 1;
    return this.maxId;
  }

  add(name) {
    const item = {
      id: this.newId(),
      name,
      completed: false,
      createdAt: Date.now(),
    };
    this.items.unshift(item);
    this.save();
  }

  delete(todo) {
    this.items = this.items.filter(item => item.id != todo.id);
    this.save();
  }

  toggle(todo) {
    let item = _.find(this.items, it => it.id == todo.id);
    if (item) {
      item.completed = !item.completed;
      if (item.completed) {
        item.completedAt = Date.now();
      }
      this.save();
    }
  }

  rename(id, newName) {
    let item = _.find(this.items, it => it.id == id);
    if (item) {
      item.name = newName;
      this.save();
    }
  }

  move(itemId, beforeId) {
    const itemIndex = this.items.findIndex(item => item.id == itemId);
    const beforeIndex = this.items.findIndex(item => item.id == beforeId);
    const item = this.items.splice(itemIndex, 1)[0];
    this.items.splice(beforeIndex, 0, item);
  }

  filter(status) {
    switch (status) {
      case "active":
        return this.items.filter(item => item.completed == false);
      case "completed":
        return this.items.filter(item => item.completed == true);
      case "all":
      default:
        return this.items;
    }
  }
}
