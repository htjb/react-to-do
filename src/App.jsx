import { useEffect, useState } from 'react'
import { addTodo, search, deleteTodo } from './core.jsx'
import Dexie from 'dexie'
import './App.css'

function Card({ task, onDelete, setAllTasks}) {
  return (
    <div className='task-card'>
      <p>{task.task}</p>
      <button onClick={() => onDelete(task.id, db, setAllTasks)}>Delete</button>
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
        id='new-task'
        value={text} 
        onChange={e => setText(e.target.value)}
      /><br />
      <button onClick={() => addTodo(db, text, setAllTasks, setText)}>Add</button>
      <textarea
        id='search'
        onChange={e => search(e.target.value, db, setAllTasks)}
        placeholder="Search tasks..."
      /><br />
      <div className="task-list">
        {allTasks.map(task => <Card key={task.id} task={task} 
          onDelete={deleteTodo} setAllTasks={setAllTasks}/>)}
      </div>
    </>
  )
}

export default App
