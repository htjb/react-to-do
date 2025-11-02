import { useEffect, useState } from 'react'
import { addTodo, search, deleteTodo } from './core.jsx'
import Dexie from 'dexie'
import './App.css'

function Card({ task, onDelete, setAllTasks}) {
  return (
    <div className='task-card'>
      <p>{task.task}</p>
      <button onClick={() => onDelete(task.id, db, setAllTasks)}>Delete</button>
      <button>Edit</button>
      <button>Complete</button>
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
      <div className="side-bar"> {/* this prevents side bar eating the corners of the content area */}
       
          <h1>To-Done</h1>
          <textarea
            id='search'
            onChange={e => search(e.target.value, db, setAllTasks)}
            placeholder="Search tasks..."
          /><br />
          <div className='nav-buttons'>
            <button><img src="./src/assets/task.png" className="icon" />All Tasks</button>
            <button><img src="./src/assets/trash.png" className="icon" />Deleted</button>
            <button><img src="./src/assets/check.png" className="icon" />Completed</button>
        </div>
      </div>
      <div className="content">
        <textarea 
          id='new-task'
          value={text} 
          onChange={e => setText(e.target.value)}
          onKeyDown={e => {
            if (e.keyCode === 13) {
              addTodo(db, text, setAllTasks, setText)
            }
          }}
          placeholder='Add a new task... '
        />
        <button 
        onClick={() => addTodo(db, text, setAllTasks, setText)}
        >Add</button>
        <div className="task-list">
          {allTasks.map(task => <Card key={task.id} task={task} 
            onDelete={deleteTodo} setAllTasks={setAllTasks}/>)}
        </div>
      </div>
    </>
  )
}

export default App
