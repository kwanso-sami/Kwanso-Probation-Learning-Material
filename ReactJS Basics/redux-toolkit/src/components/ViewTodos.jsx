import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTodo } from "../store/todosSlice";

const ViewTodos = () => {
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();
  const handleToggleTodo = (id) => {
    dispatch(toggleTodo(id));
  };

  return (
    <>
      <h1>Todos</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} onClick={() => handleToggleTodo(todo.id)}>
            {todo.completed ? <del>{todo.text}</del> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
};

export default ViewTodos;
