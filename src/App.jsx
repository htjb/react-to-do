import { useEffect, useState } from 'react'
import { TaskList, SideBar, AddTask } from './components.jsx'
import Dexie from 'dexie'
import './App.css'
import './nav-bar.css'

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
      <SideBar 
        db={db} 
        setAllTasks={setAllTasks} 
        />
      
      <div className="content">

        <AddTask 
          text={text}
          setText={setText}
          db={db}
          setAllTasks={setAllTasks}
          />

        <TaskList 
          allTasks={allTasks} 
          setAllTasks={setAllTasks}
          db={db} 
          />

      </div>
    </>
  )
}

export default App
