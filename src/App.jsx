import { useEffect, useState } from 'react'
import Dexie from 'dexie'
import './App.css'

function Card({ task, onDelete }) {
  return (
    <div className='task-card'>
      <p>{task.task}</p>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </div>
  )
}

function createdb() {
    const db = new Dexie("To Do List")

    db.version(1).stores({
      todo: '++id, task, tags'
    })
    return db
}

const db = createdb()

function App() {

  async function search(query) {
    /*
    Search function. IndexedDB doesn't support things like includes
    so had to get the whole array and filter it manually with vanilla JS.

    parameters:
      query - string to search for in task descriptions
    */
    const results = await db.todo
      .toArray()
      .then(tasks => tasks.filter(
        task => task.task.toLowerCase().includes(query.toLowerCase())))
    setAllTasks(results)
  }

  async function addTodo() {
    /* 
    Add a new to-do task to the database and refresh state.
    */
    await db.todo.add({ task: text, tags: null })
    const tasks = await db.todo.toArray()
    setAllTasks(tasks) // refresh state so UI updates
    setText('') // clear textarea
  }

  async function deleteTodo(id) {
    /*
    Delete a to-do task from the database and refresh state.

    parameters:
      id - the id of the task to delete
    */
    await db.todo.delete(id)
    const tasks = await db.todo.toArray()
    setAllTasks(tasks) // refresh state so UI updates
  }

  useEffect(() => {
    // Load all tasks from the database on initial render
    async function loadTasks() {
      // function to load all of the tasks from the database
      const tasks = await db.todo.toArray()
      setAllTasks(tasks)
    }
    loadTasks()
  }, [] // leave black to run only once on mount
  )
  
  const [text, setText] = useState('')
  const [allTasks, setAllTasks] = useState([])
  //const [search, setSearch] = useState('')

  return (
    <>
      <h1>To-Do-App</h1>
      <textarea 
        value={text} 
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => addTodo()}>Add</button>
      <textarea
        id='search'
        onChange={e => search(e.target.value)}
        placeholder="Search tasks..."
      /><br />
      <div className="task-list">
        {allTasks.map(task => <Card key={task.id} task={task} onDelete={deleteTodo}/>)}
      </div>
    </>
  )
}

export default App
