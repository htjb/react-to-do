import { loadAllTasks, loadDeletedTasks, loadCompletedTasks, search,
    completeTodo, deleteTodo, addTodo
 } from './core.jsx'

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

export function SideBar({ db, setAllTasks }) {
    return (
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
    )
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