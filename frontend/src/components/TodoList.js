import React, { useState } from "react";
import axios from "axios";
import TodoForm from "./TodoForm";
import Todo from "./Todo";
import { useEffect } from "react";

const apiUrl = "http://localhost:3001/to-dos/";

function TodoList() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    axios.get(apiUrl).then((response) => {
      setTodos(response.data.todos);
    });
  }, []);


  const addTodo = (todo) => {
    if (!todo.title || /^\s*$/.test(todo.title)) {
      return;
    }

    axios.post(apiUrl, {
      title: todo.title,
      description: todo.description,
      isDone: false,
    }).then(() => {
      axios.get(apiUrl).then((response) =>{
        setTodos(response.data.todos);
      });
    },)
  };

  const showDescription = (todoId) => {
    let updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        todo.showDescription = !todo.showDescription;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const updateTodo = (todoId, newValue) => {
    console.log(newValue);
    if (!newValue.title || /^\s*$/.test(newValue.title)) {
      return;
    }

    try {
      axios.patch(`http://localhost:3001/to-dos/${todoId}`, {
        title: newValue.title,
        description: newValue.description,
        isDone: false,
            },
        ).then(() => {
          axios.get(apiUrl).then((response) =>{
            setTodos(response.data.todos);
          });
        },);
      setTodos((prev) =>
        prev.map((item) => (item.id === todoId ? newValue : item))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const removeTodo = (id) => {

    axios.delete(`http://localhost:3001/to-dos/${id}`).then(() => {
      axios.get(apiUrl).then((response) =>{
        setTodos(response.data.todos);
      });
    },)

    const removedArr = [...todos].filter((todo) => todo.id !== id);

    setTodos(removedArr);
  };

  const completeTodo = (id) => {
    
      const updateTodo = todos.find((todo) => todo.id === id);

      axios.patch(`http://localhost:3001/to-dos/${id}`, {
          title: `${updateTodo.title}`,
          description: `${updateTodo.description}`,
          isDone: `${updateTodo.is_done === 1 ? 0 : 1}`,
        },
      ).then(() => {
        axios.get(apiUrl).then((response) =>{
          setTodos(response.data.todos);
        });
      },);;

      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updateTodo : todo))
      );
    
  };

  return (
    <>
      <h1>What's the Plan for Today?</h1>
      <TodoForm onSubmit={addTodo} />
      <Todo
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
        showDescription={showDescription}
      />
    </>
  );
}

export default TodoList;
