const express = require("express");
const pool = require("./db");

const app = express();

app.use(express.json()); // => req.body

//Routes//

//get all todos

app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query(`SELECT * FROM todo`);
    res.json(allTodos.rows);
  } catch (error) {
    console.log(error);
  }
});
// get a todo

app.get("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await pool.query("SELECT * FROM todo WHERE id = ($1)", [id]);
    res.json(todo.rows[0]);
  } catch (error) {
    console.log(error);
  }
});
//create a todo

app.post("/todos", async (req, res) => {
  try {
    const { task } = req.body;
    const newTodo = await pool.query(
      `INSERT INTO todo (task) VALUES ($1) RETURNING *`,
      [task]
    );
    res.json(newTodo.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});
// update a todo

app.patch("/todo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { task } = req.body;
    const updatedTodo = await pool.query(
      `UPDATE todo SET task = ($1) WHERE id = ($2)`,
      [task, id]
    );
    res.json({
      message: "todo updated",
    });
  } catch (error) {
    console.log(error);
  }
});
// delete a todo

app.delete("/todo/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE * FROM todo WHERE id = ($1)`, [id]);
    res.json({
      message: "Todo was deleted",
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log("Server is listening at port 3000");
});
