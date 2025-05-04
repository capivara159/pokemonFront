import { authService, tokenManager } from './api.js';

// Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const data = await authService.login({ email, password });
        tokenManager.set(data.token);
        window.location.href = 'dashboard.html';
    } catch (error) {
        showAlert('error', 'Login falhou: ' + error.message);
    }
});

// Registro
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const data = await authService.register({ email, password });
        tokenManager.set(data.token);
        showAlert('success', 'Registro realizado! Redirecionando...');
        setTimeout(() => window.location.href = 'dashboard.html', 1500);
    } catch (error) {
        showAlert('error', 'Registro falhou: ' + error.message);
    }
});

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    tokenManager.remove();
    window.location.href = 'index.html';
});

// Utilitário para exibir alertas
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.textContent = message;
    document.body.prepend(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
}