import { useEffect, useState } from 'react'
import { addTodo, search, deleteTodo, 
  completeTodo, loadCompletedTasks, loadAllTasks, loadDeletedTasks } from './core.jsx'
import Dexie from 'dexie'
import './App.css'
import './nav-bar.css'

function Card({ task, onDelete, onComplete, setAllTasks}) {
  task.tags = ['home', 'work'] // temporary tags for testing
  return (
    <div className='task-card'>
      <div className='task-card-text'>
        <p>{task.task}</p>
        <div className='task-card-tags'>
          {task.tags && task.tags.map((tag, index) => (
            <span key={index} className='task-card-tag'>{tag}</span>
          ))}
        </div>
      </div>
      <div className='task-card-buttons'>
        <button onClick={() => onDelete(task.id, db, setAllTasks)}>Delete</button>
        <button>Edit</button>
        <button onClick={() => onComplete(task.id, db, setAllTasks)}>Complete</button>
      </div>
    </div>
  )
}

function createdb() {
    const db = new Dexie("To Do List")

    db.version(1).stores({
      todo: '++id, task, tags, deleted, completed'
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
      const filteredTasks = tasks.filter(t => !t.completed && !t.deleted)
      setAllTasks(filteredTasks)
    }
    loadTasks()
  }, [] // leave black to run only once on mount
  )
  
  const [text, setText] = useState('')
  const [allTasks, setAllTasks] = useState([])

  return (
    <>
      <div className="side-bar"> {/* this prevents side bar eating the corners of the content area */}
       
          <h1>To-Done</h1>
          <textarea
            id='search'
            onChange={e => search(e.target.value, db, setAllTasks)}
            placeholder="Search"
          /><br />
          <div className='nav-buttons'>
            <button onClick={() => loadAllTasks(db, setAllTasks)}><img src="./src/assets/task.png" className="icon" />All Tasks</button>
            <button onClick={() => loadDeletedTasks(db, setAllTasks)}><img src="./src/assets/trash.png" className="icon" />Deleted</button>
            <button onClick={() => loadCompletedTasks(db, setAllTasks)}><img src="./src/assets/check.png" className="icon" />Completed</button>
        </div>
      </div>
      <div className="content">

        <div className="add-task">
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
        </div>

        <div className="task-list">
          {allTasks.map(task => <Card key={task.id} task={task} 
            onDelete={deleteTodo} onComplete={completeTodo} setAllTasks={setAllTasks}/>)}
        </div>

      </div>
    </>
  )
}

export default App
