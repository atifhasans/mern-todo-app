import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [input, setInput] = useState('');
  const [description, setDescription] = useState('');
  const [todo, setTodo] = useState(null);
  const [editing, setEditing] = useState({ id: null, index: null, value: '' });

  useEffect(() => {
    async function getData() {
      const response = await axios('https://big-julieta-atifhasan-a35c8884.koyeb.app/api/v1/todo');
      setTodo(response.data.data);
    }
    getData();
  }, []);

  const addTodo = async (event) => {
    event.preventDefault();
    const response = await axios.post('https://big-julieta-atifhasan-a35c8884.koyeb.app/api/v1/todo', {
      title: input,
      description,
    });
    setTodo([...todo, response.data.data]);
    setInput('');
    setDescription('');
  };

  const startEditing = (id, index, currentValue) => {
    setEditing({ id, index, value: currentValue });
  };

  const handleEditChange = (event) => {
    setEditing({ ...editing, value: event.target.value });
  };

  const saveEdit = async () => {
    const { id, index, value } = editing;
    await axios.put(`https://big-julieta-atifhasan-a35c8884.koyeb.app/api/v1/todo/${id}`, {
      title: value,
    });
    todo[index].title = value;
    setTodo([...todo]);
    setEditing({ id: null, index: null, value: '' });
  };

  const cancelEdit = () => {
    setEditing({ id: null, index: null, value: '' });
  };

  const deleteTodo = async (id, index) => {
    await axios.delete(`https://big-julieta-atifhasan-a35c8884.koyeb.app/api/v1/todo/${id}`);
    todo.splice(index, 1);
    setTodo([...todo]);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Todo App</h1>
      <form className="todo-form" onSubmit={addTodo}>
        <input
          type="text"
          className="todo-input"
          placeholder="Enter your todo"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />
        <textarea
          className="todo-textarea"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <button type="submit" className="todo-button">
          Add Todo
        </button>
      </form>
      <ul className="todo-list">
        {todo ? (
          todo.map((item, index) => (
            <li key={item._id} className="todo-item">
              {editing.id === item._id ? (
                <div className="edit-container">
                  <input
                    type="text"
                    className="edit-input"
                    value={editing.value}
                    onChange={handleEditChange}
                  />
                  <button className="save-button" onClick={saveEdit}>
                    Save
                  </button>
                  <button className="cancel-button" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="todo-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              )}
              <div className="todo-actions">
                {editing.id !== item._id && (
                  <>
                    <button
                      className="edit-button"
                      onClick={() => startEditing(item._id, index, item.title)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => deleteTodo(item._id, index)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))
        ) : (
          <h2 className="loading-text">Loading...</h2>
        )}
      </ul>
    </div>
  );
};

export default App;
