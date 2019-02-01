import React from "react";
import styled from "styled-components";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import _ from "lodash";
import { KeyCode } from "./utils/constants";
import { getQuery, getHashPath } from "./utils/pageAddress";
import Todos from "./utils/TodoList";
import GlobalStyle from "./GlobalStyle";
import TodoItem from "./TodoItem";
import Footer from "./Footer";

const Page = styled.div`
  .info {
    margin: 65px auto 0;
    color: #bfbfbf;
    font-size: 10px;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
    text-align: center;
    p {
      line-height: 1;
    }
    a {
      color: inherit;
      text-decoration: none;
      font-weight: 400;
    }
    a:hover {
      text-decoration: underline;
    }
  }
`;

const Title = styled.h1`
  width: 100%;
  height: 130px;
  line-height: 130px;
  margin: 0;
  font-size: 100px;
  font-weight: 100;
  text-align: center;
  color: rgba(175, 47, 47, 0.15);
`;

const TodoApp = styled.section`
  background: #fff;
  position: relative;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);

  label.indicator {
    position: absolute;
    top: 14px;
    left: -8px;
    font-size: 22px;
    color: #e6e6e6;
    padding: 10px 27px 10px 27px;
  }

  input::-webkit-input-placeholder {
    font-style: italic;
    font-weight: 300;
    color: #e6e6e6;
  }
  input::-moz-placeholder {
    font-style: italic;
    font-weight: 300;
    color: #e6e6e6;
  }
  input::input-placeholder {
    font-style: italic;
    font-weight: 300;
    color: #e6e6e6;
  }
`;

const Input = styled.input`
  position: relative;
  margin: 0;
  width: 100%;
  font-size: 24px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.4em;
  color: inherit;
  padding: 16px 16px 16px 60px;
  border: none;
  background: rgba(0, 0, 0, 0.003);
  box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
`;

const Year = styled.h3`
  margin: 0;
  font-size: 24px;
  padding: 16px;
  background: #eedfdf;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
`;

const TodoList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    border-bottom: 1px solid #ededed;
  }
  li:last-child {
    border-bottom: none;
  }
`;

class App extends React.Component {
  state = {
    newTodo: "",
    filter: getHashPath() || "active",
    items: [],
  };

  todos = new Todos();

  loadTodos() {
    const year = getQuery().year || new Date().getFullYear();
    this.todos = new Todos(`todos::data:${year}`);
    this.setState({ year: _.toNumber(year) });
    this.loadItems();
  }

  loadItems(filter) {
    if (filter == null || filter == this.state.filter) {
      this.setState({ items: this.todos.filter(this.state.filter) });
    } else {
      this.setState({ filter, items: this.todos.filter(filter) });
    }
  }

  inputText = event => {
    this.setState({ newTodo: event.target.value });
  };

  newTodoKeyDown = event => {
    if (event.keyCode == KeyCode.Enter) {
      event.preventDefault();
      var title = this.state.newTodo.trim();
      if (title) {
        const currentYear = new Date().getFullYear();
        if (currentYear != this.state.year) {
          this.todos = new Todos(`todos::data:${currentYear}`);
          this.todos.add(title);
          window.location.href = `?year=${currentYear}#active`;
          return;
        }
        this.todos.add(title);
        this.setState({ newTodo: "" });
        const filter =
          this.state.filter == "completed" ? "active" : this.state.filter;
        this.loadItems(filter);
      }
    }
  };

  toggle = todo => {
    return () => {
      this.todos.toggle(todo);
      this.loadItems();
    };
  };

  update = todo => {
    return newName => {
      this.todos.rename(todo.id, newName);
      this.loadItems();
    };
  };

  destroy = todo => {
    return () => {
      this.todos.delete(todo);
      this.loadItems();
    };
  };

  moveItem = (itemId, beforeId) => {
    this.todos.move(itemId, beforeId);
    this.loadItems();
  };

  endDrag = () => {
    this.todos.save();
  };

  hashchange = () => {
    this.loadItems(getHashPath());
  };

  componentDidMount() {
    this.loadTodos();
    window.addEventListener("hashchange", this.hashchange);
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.hashchange);
  }

  render() {
    const { newTodo, year, filter, items } = this.state;
    const currentYear = new Date().getFullYear();
    return (
      <Page>
        <GlobalStyle />
        <Title>todos</Title>
        {currentYear != year && <Year>{year}</Year>}
        <TodoApp>
          {currentYear == year && (
            <>
              <label className="indicator">❯</label>
              <Input
                placeholder="What needs to be done?"
                value={newTodo}
                onChange={this.inputText}
                onKeyDown={this.newTodoKeyDown}
                autoFocus={true}
              />
            </>
          )}
          <TodoList>
            {items.map((todo, index) => (
              <TodoItem
                key={todo.id}
                index={index}
                todo={todo}
                filter={filter}
                onToggle={this.toggle(todo)}
                onUpdate={this.update(todo)}
                onDestroy={this.destroy(todo)}
                moveItem={this.moveItem}
                endDrag={this.endDrag}
              />
            ))}
          </TodoList>
          <Footer year={year} filter={filter} itemCount={items.length} />
        </TodoApp>
        <footer className="info">
          <p>Double-click to edit a todo</p>
          <p>
            Created by <a href="https://github.com/J-F-Liu">Junfeng Liu</a>
          </p>
          <p>
            Part of <a href="http://todomvc.com">TodoMVC</a>
          </p>
        </footer>
      </Page>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
