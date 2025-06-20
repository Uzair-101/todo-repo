import readline from 'readline/promises';
import API from './apiClient.js';
import authStorage from './authStorage.js';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const showAuthMenu = async () => {
    console.log('\n==== Auth Menu ====');
    console.log('1. Register');
    console.log('2. Login');
    console.log('0. Exit');

    const choice = await rl.question('Choose: ');
    switch (choice.trim()) {
        case '1': {
            const email = await rl.question('Email: ');
            const password = await rl.question('Password: ');
            try {
                const res = await API.post('/auth/register', { email, password });
                authStorage.setTokens(res.data.accessToken, res.data.refreshToken);
                console.log('✅ Registered and logged in');
            } catch (err) {
                const msg = err.response?.data?.message || err.message;
                console.log(`❌ Registration failed: ${msg}`);
            }
            break;
        }
        case '2': {
            const email = await rl.question('Email: ');
            const password = await rl.question('Password: ');
            const res = await API.post('/auth/login', { email, password });
            authStorage.setTokens(res.data.accessToken, res.data.refreshToken);
            console.log('✅ Logged in');
            break;
        }
        case '0':
            rl.close();
            process.exit(0);
        default:
            console.log('❌ Invalid choice');
    }
};

const showTodoMenu = async () => {
    console.log('\n==== Todo Menu ====');
    console.log('1. Create Todo');
    console.log('2. View Todos');
    console.log('3. Logout');
    console.log('0. Exit');

    const choice = await rl.question('Choose: ');
    switch (choice.trim()) {
        case '1': {
            const task = await rl.question('Task: ');
            await API.post('/todos', { task });
            console.log('✅ Todo created');
            break;
        }
        case '2': {
            const res = await API.get('/todos');
            const todos = res.data;
            if (todos.length === 0) {
                console.log('📭 Todo list is empty');
            } else {
                todos.forEach((todo, idx) => {
                    console.log(`${idx + 1}. ${todo.task} [${todo.completed ? '✓' : ' '}]`);
                });
            }
            break;
        }
        case '3':
            authStorage.clearTokens();
            console.log('✅ Logged out');
            break;
        case '0':
            rl.close();
            process.exit(0);
        default:
            console.log('❌ Invalid choice');
    }
};

async function mainMenu() {
    while (true) {
        const isLoggedIn = !!authStorage.getAccessToken();
        if (!isLoggedIn) {
            await showAuthMenu();
        } else {
            await showTodoMenu();
        }
    }
}

mainMenu();
