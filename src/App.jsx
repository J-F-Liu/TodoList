import React from "react";
import styled from "styled-components";
import { Grid, Col, Row } from "./components/FlexboxGrid";
import { KeyCode } from "./utils/constants";
import { getHashPath } from "./utils/hashHistory";
import Todos from "./utils/TodoList";
import GlobalStyle from "./GlobalStyle";
import TodoItem from "./TodoItem";
import Footer from "./Footer";

const Page = styled.div`
  visibility: visible !important;

  .info {
    margin: 65px auto 0;
    color: #bfbfbf;
    font-size: 10px;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
    text-align: center;
  }

  .info p {
    line-height: 1;
  }

  .info a {
    color: inherit;
    text-decoration: none;
    font-weight: 400;
  }

  .info a:hover {
    text-decoration: underline;
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

const TodoList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

class App extends React.Component {
  state = {
    newTodo: "",
    todos: new Todos(),
    filter: getHashPath() || "active",
  };

  inputText = event => {
    this.setState({ newTodo: event.target.value });
  };

  newTodoKeyDown = event => {
    if (event.keyCode == KeyCode.Enter) {
      event.preventDefault();
      var title = this.state.newTodo.trim();
      if (title) {
        this.state.todos.add(title);
        this.setState({ newTodo: "" });
      }
    }
  };

  toggle = todo => {
    return () => {
      this.state.todos.toggle(todo);
      this.forceUpdate();
    };
  };

  update = todo => {
    return newName => {
      this.state.todos.rename(todo.id, newName);
      this.forceUpdate();
    };
  };

  destroy = todo => {
    return () => {
      this.state.todos.delete(todo);
      this.forceUpdate();
    };
  };

  hashchange = () => {
    this.setState({ filter: getHashPath() });
  };

  componentDidMount() {
    window.addEventListener("hashchange", this.hashchange);
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.hashchange);
  }

  render() {
    const { newTodo, todos, filter } = this.state;
    const showItems = todos.filter(filter);
    return (
      <Page>
        <GlobalStyle />
        <Title>todos</Title>
        <TodoApp id="active">
          <label className="indicator">❯</label>
          <Input
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={this.inputText}
            onKeyDown={this.newTodoKeyDown}
            autoFocus={true}
          />
          <TodoList>
            {showItems.map((todo, index) => (
              <TodoItem
                key={index}
                todo={todo}
                filter={filter}
                onToggle={this.toggle(todo)}
                onUpdate={this.update(todo)}
                onDestroy={this.destroy(todo)}
              />
            ))}
          </TodoList>
          <Footer filter={filter} itemCount={showItems.length} />
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

export default App;
