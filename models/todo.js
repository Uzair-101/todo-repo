import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    task: { type: String, required: true },
    completed: { type: Boolean, default: false },
});

export default mongoose.model('Todo', todoSchema);