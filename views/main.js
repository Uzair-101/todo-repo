// === cli/main.js ===
import readline from 'readline';
import API from './apiClient.js';
import authStorage from './authStorage.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

async function mainMenu() {
    const token = authStorage.getToken();
    const isLoggedIn = !!token;

    console.log('\n==== Todo CLI App ====');
    if (!isLoggedIn) {
        console.log('1. Register');
        console.log('2. Login');
    } else {
        console.log('1. Create Todo');
        console.log('2. View Todos');
        console.log('3. Update Todo');
        console.log('4. Delete Todo');
        console.log('5. Logout');
    }
    console.log('0. Exit');

    const choice = await ask('Choose: ');

    switch (choice.trim()) {
        case '1':
            if (!isLoggedIn) {
                const email = await ask('Email: ');
                const password = await ask('Password: ');
                const res = await API.post('/auth/register', { email, password });
                authStorage.setToken(res.data.token);
                console.log('✅ Registered and logged in');
            } else {
                const task = await ask('Task: ');
                await API.post('/todos', { task });
                console.log('✅ Todo created');
            }
            break;

        case '2':
            if (!isLoggedIn) {
                const email = await ask('Email: ');
                const password = await ask('Password: ');
                try {
                    const res = await API.post('/auth/login', { email, password });
                    authStorage.setToken(res.data.token);
                    console.log('Logged in');
                } catch (err) {
                    console.log('Login failed:', err.response?.data?.message || err.message);
                }
            } else {
                const res = await API.get('/todos');
                if (res.data.length === 0) {
                    console.log('No todos found.');
                } else {
                    res.data.forEach((todo, idx) => {
                        console.log(`${idx + 1}. ${todo.task} [${todo.completed ? '✓' : ' '}]`);
                    });
                }
            }
            break;

        case '3':
            if (isLoggedIn) {
                const todosRes = await API.get('/todos');
                const todos = todosRes.data;
                if (todos.length === 0) {
                    console.log('No todos to update.');
                    break;
                }
                todos.forEach((todo, idx) => {
                    console.log(`${idx + 1}. ${todo.task} [${todo.completed ? '✓' : ' '}]`);
                });
                const updateIndex = parseInt(await ask('Enter number of Todo to update: '), 10) - 1;
                if (updateIndex >= 0 && updateIndex < todos.length) {
                    const updatedTask = await ask('New task text: ');
                    const completed = await ask('Is it completed? (yes/no): ');
                    const updates = {
                        task: updatedTask,
                        completed: completed.toLowerCase() === 'yes',
                    };
                    await API.put(`/todos/${todos[updateIndex]._id}`, updates);
                    console.log('Todo updated');
                } else {
                    console.log(' Invalid index');
                }
            } else {
                console.log('Please log in first');
            }
            break;

        case '4':
            if (isLoggedIn) {
                const todosRes = await API.get('/todos');
                const todos = todosRes.data;
                if (todos.length === 0) {
                    console.log(' No todos to delete.');
                    break;
                }
                todos.forEach((todo, idx) => {
                    console.log(`${idx + 1}. ${todo.task} [${todo.completed ? '✓' : ' '}]`);
                });
                const deleteIndex = parseInt(await ask('Enter number of Todo to delete: '), 10) - 1;
                if (deleteIndex >= 0 && deleteIndex < todos.length) {
                    await API.delete(`/todos/${todos[deleteIndex]._id}`);
                    console.log('Todo deleted');
                } else {
                    console.log('Invalid index');
                }
            } else {
                console.log(' Please log in first');
            }
            break;

        case '5':
            if (isLoggedIn) {
                authStorage.clearToken();
                console.log('Logged out');
            } else {
                console.log(' Invalid choice');
            }
            break;

        case '0':
            rl.close();
            return;

        default:
            console.log(' Invalid choice');
    }

    mainMenu();
}

mainMenu();
