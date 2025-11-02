export async function addTodo(db, text, setAllTasks, setText) {
    /* 
    Add a new to-do task to the database and refresh state.
    */
    await db.todo.add({ task: text, tags: null })
    const tasks = await db.todo.toArray()
    const filteredTasks = tasks.filter(t => !t.completed && !t.deleted)
    setAllTasks(filteredTasks) // refresh state so UI updates
    setText('') // clear textarea
}

export async function search(query, db, setAllTasks) {
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
    results.filter(t => !t.completed && !t.deleted)
    setAllTasks(results)
}

export async function deleteTodo(id, db, setAllTasks) {
    /*
    Delete a to-do task from the database and refresh state.

    parameters:
      id - the id of the task to delete
    */
    const task = await db.todo.get(id)
    await db.todo.put({ ...task, deleted: true })
    const tasks = await db.todo.toArray()
    const filteredTasks = tasks.filter(t => !t.completed && !t.deleted)
    setAllTasks(filteredTasks) // refresh state so UI updates
}

export async function completeTodo(id, db, setAllTasks) {
    /*
    Mark a to-do task as completed in the database and refresh state.

    parameters:
      id - the id of the task to mark as completed
    */
    const task = await db.todo.get(id)
    await db.todo.put({ ...task, completed: true })
    const tasks = await db.todo.toArray()
    const filteredTasks = tasks.filter(t => !t.completed && !t.deleted)
    console.log(tasks)
    setAllTasks(filteredTasks) // refresh state so UI updates
}

export async function loadCompletedTasks(db, setAllTasks) {
    const tasks = await db.todo.toArray()
    const completedTasks = tasks.filter(t => t.completed && !t.deleted)
    setAllTasks(completedTasks)
}

export async function loadAllTasks(db, setAllTasks) {
    const tasks = await db.todo.toArray()
    const nonCompletedTasks = tasks.filter(t => !t.completed && !t.deleted)
    setAllTasks(nonCompletedTasks)
}

export async function loadDeletedTasks(db, setAllTasks) {
    const tasks = await db.todo.toArray()
    const deletedTasks = tasks.filter(t => t.deleted)
    setAllTasks(deletedTasks)
}