import {
    createTodo,
    getTodos,
    updateTodo,
    deleteTodo,
} from '../services/todoService.js';

class TodoController {
    static async create(req, res) {
        try {
            const todo = await createTodo(req.user._id, req.body.task);
            res.status(201).json(todo);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    static async getAll(req, res) {
        try {
            const todos = await getTodos(req.user._id);
            res.status(200).json(todos);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    static async update(req, res) {
        try {
            const todo = await updateTodo(req.params.id, req.body);
            res.status(200).json(todo);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    static async delete(req, res) {
        try {
            await deleteTodo(req.params.id);
            res.status(204).end();
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
}

export default TodoController;