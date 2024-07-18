import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTodo } from "../store/todosSlice";

const AddTodo = () => {
  const dispatch = useDispatch();
  const [newTodo, setNewTodo] = useState("");

  const handleAddTodo = () => {
    dispatch(addTodo(newTodo));
    setNewTodo("");
  };

  return (
    <>
      <br />
      <label>Todo: </label>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <br />
      <br />
      <button onClick={handleAddTodo}>Add Todo</button>
    </>
  );
};

export default AddTodo;
