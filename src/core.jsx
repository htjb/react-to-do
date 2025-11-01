export async function addTodo(db, text, setAllTasks, setText) {
    /* 
    Add a new to-do task to the database and refresh state.
    */
    await db.todo.add({ task: text, tags: null })
    const tasks = await db.todo.toArray()
    setAllTasks(tasks) // refresh state so UI updates
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
    setAllTasks(results)
}

export async function deleteTodo(id, db, setAllTasks) {
    /*
    Delete a to-do task from the database and refresh state.

    parameters:
      id - the id of the task to delete
    */
    await db.todo.delete(id)
    const tasks = await db.todo.toArray()
    setAllTasks(tasks) // refresh state so UI updates
}