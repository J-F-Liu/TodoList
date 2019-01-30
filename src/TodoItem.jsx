import React from "react";
import styled from "styled-components";
import { format } from "date-fns";
import Checkbox from "./components/Checkbox";
import { Row } from "./components/FlexboxGrid";

const Item = styled(Row)`
  position: relative;
  font-size: 24px;
  border-bottom: 1px solid #ededed;
  &:last-child {
    border-bottom: none;
  }

  label {
    word-break: break-all;
    padding: 15px;
    display: block;
    line-height: 1.2;
    transition: color 0.4s;
  }
  label.completed {
    color: #d9d9d9;
    text-decoration: line-through;
  }

  label.time {
    margin-left: 2em;
    font-size: 50%;
    color: #737373;
  }

  button.destroy {
    visibility: hidden;
    width: 30px;
    height: 40px;
    margin: auto 0;
    font-size: 30px;
    text-align: left;
    color: #cc9a9a;
    transition: color 0.2s ease-out;
    cursor: pointer;
    &:hover {
      color: #af5b5e;
    }
  }
  &:hover {
    button.destroy {
      visibility: visible;
    }
  }
`;

class TodoItem extends React.Component {
  state = {
    editText: "",
  };

  render() {
    const { todo, onToggle, onDestroy } = this.props;
    return (
      <Item>
        <Checkbox checked={todo.completed} onToggle={onToggle} />
        <Row grow={1} space="between" valign="baseline">
          <label className={todo.completed ? "completed" : ""}>
            {todo.title}
          </label>
          <label className="time">
            {format(
              todo.completed ? todo.completedAt : todo.createdAt,
              "YYYY-MM-DD HH:mm"
            )}
          </label>
        </Row>
        <button className="destroy" onClick={onDestroy}>
          ×
        </button>
      </Item>
    );
  }
}

export default TodoItem;
