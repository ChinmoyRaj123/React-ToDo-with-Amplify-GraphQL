
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import React, { useEffect, useState } from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createTodo, deleteTodo, updateTodo } from './graphql/mutations'
import { listTodos } from './graphql/queries'
import "./App.css"

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const initialState = { name: '', description: '' }

const App = () => {
  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState([])
  const [todoId, setTodoId] = useState(null)
  const [buttonInnerHTML, setButtonInnerHTML] = useState("Create Todo")

  useEffect(() => {
    fetchTodos()
  }, [todos])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos))
      const todos = todoData.data.listTodos.items
      setTodos(todos)
    } catch (err) { console.log('error fetching todos') }
  }

  async function addTodo() {
    try {
      console.log("Added function Called")

      if (!formState.name || !formState.description) return
      const todo = { ...formState }
      setTodos([...todos, todo])
      setFormState(initialState)
      const response = await API.graphql(graphqlOperation(createTodo, { input: todo }))
      console.log("Added Data", response)
      if (response){
        confirmAlert({message: "Todo data added", buttons:[{label:"Ok"}]})
      }
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  async function Update_Todo(todoid) {
    try {
      console.log("Update Function called with id: ", todoid)
      const todofilter = todos.filter((data) => data.id === todoid)[0]
      console.log("To be updated: ", todofilter)
      const todo = { ...formState }
      console.log("Todo data updated with", todo)
      const response = await API.graphql(graphqlOperation(updateTodo, { id: todoid, name: todo.name, description: todo.description }))
      console.log("Updated Data", response)
      if (response){
        confirmAlert({message: "Todo data updated", buttons:[{label:"Ok"}]})
      }
      setFormState(initialState)
      setButtonInnerHTML("Create Todo")
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  async function DeleteTodo(id) {
    try {
      const todofilter = todos.filter((data) => data.id === id)[0]
      const response = await API.graphql(graphqlOperation(deleteTodo, { id: todofilter.id }))
      console.log("Deleted Data", response)
      if (response){
        confirmAlert({message: "Data Deleted", buttons:[{label:"Ok"}]})
      }
    } catch (err) {
      console.log('error deleting todo:', err)
    }
  }



  const EditTodo = (id) => {
    try {
      const todofilter = todos.filter((data) => data.id === id)[0]
      setFormState(todofilter)
      setButtonInnerHTML("Edit Todo")
    }
    catch (err) {
      console.log('error editing todo:', err)
    }
  }

  const buttonChange = (id) => {
    if (buttonInnerHTML === "Create Todo") {
      addTodo()
    }
    else {
      Update_Todo(id)
    }

  }

  const deleteHandle = async(id) => {
    confirmAlert({
      // title: 'Confirm to Delete',
      message: 'Are you sure to delete this?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => DeleteTodo(id)
        },
        {
          label: 'No',
          // onClick: () => alert('Click No')
        }
      ]
    });
  }


  return (
    <div className='todoContainer' >
      <h2>Amplify Todos</h2>
      <input className='todoInput' id='todoName'
        onChange={event => setInput('name', event.target.value)}
        value={formState.name}
        placeholder="Name"
      />
      <input className='todoInput' id='todoDescription'
        onChange={event => setInput('description', event.target.value)}
        value={formState.description}
        placeholder="Description"
      />
      <button id='create-button' className='button is-primary' onClick={() => { buttonChange(todoId) }}>{buttonInnerHTML}</button>
      {
        todos.map((todo, index) => (
          <div className='todo' key={todo.id ? todo.id : index} >
            <div className="todomain">
              <p className='todoName'>{todo.name}</p>
              <p className='todoDescription'>{todo.description}</p>
            </div>
            <div className="todomorebutton">
              <button className='button is-small is-light is-primary' onClick={() => { EditTodo(todo.id); setTodoId(todo.id) }}>Edit</button>
              <button className='button is-small is-light is-danger' onClick={() => { deleteHandle(todo.id) }}>Delete</button>
            </div>
          </div>
        ))
      }
    </div >
  )
}

export default App