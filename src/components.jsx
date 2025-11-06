import { loadAllTasks, loadDeletedTasks, loadCompletedTasks, search,
    completeTodo, deleteTodo, addTodo
 } from './core.jsx'
import { useState } from 'react'

export function Card({ db, task, setAllTasks}) {
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
        <button onClick={() => deleteTodo(task.id, db, setAllTasks)}>Delete</button>
        <button>Edit</button>
        <button onClick={() => completeTodo(task.id, db, setAllTasks)}>Complete</button>
      </div>
    </div>
  )
}

export function TaskList({ db, allTasks, setAllTasks}) {
    return (
        <div className="task-list">
          {allTasks.map(task => 
          <Card 
            key={task.id} 
            task={task}
            setAllTasks={setAllTasks} 
            db={db}/>)}
        </div>
    )
}

export function SearchBox({ showingSearch, db, setAllTasks, setShowingSearch }) {
  if (!showingSearch) return null; // only show when true

  return (
    <div id="search-container">
      <textarea
        id="search"
        onChange={(e) => search(e.target.value, db, setAllTasks)}
        placeholder="Search"
        autoFocus
      />
      <button id="search-close-button" onClick={() => setShowingSearch(false)}>x</button>
    </div>
  );
}

export function SideBar({ db, setAllTasks }) {
  const [showingSearch, setShowingSearch] = useState(false);

  return (
    <>
      <div className="side-bar">
        <div className="nav-buttons">
          <button onClick={() => loadAllTasks(db, setAllTasks)}>
            <img src="./src/assets/task.png" className="icon" />
          </button>
          <button onClick={() => loadDeletedTasks(db, setAllTasks)}>
            <img src="./src/assets/trash.png" className="icon" />
          </button>
          <button onClick={() => loadCompletedTasks(db, setAllTasks)}>
            <img src="./src/assets/check.png" className="icon" />
          </button>
          <button onClick={() => setShowingSearch(true)}>
            <img src="./src/assets/glass.png" className="icon" />
          </button>
        </div>
      </div>

      {/* Render search bar overlay */}
      <SearchBox showingSearch={showingSearch} db={db} setAllTasks={setAllTasks}
       setShowingSearch={setShowingSearch}/>
    </>
  );
}

export function AddTask({ text, setText, db, setAllTasks }) {
    return (
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
    )
}