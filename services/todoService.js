import Todo from '../models/Todo.js';

export const createTodo = async (userId, task) => {
    return await Todo.create({ user: userId, task });
};

export const getTodos = async (userId) => {
    return await Todo.find({ user: userId });
};

export const updateTodo = async (todoId, updates) => {
    return await Todo.findByIdAndUpdate(todoId, updates, { new: true });
};

export const deleteTodo = async (todoId) => {
    return await Todo.findByIdAndDelete(todoId);
};