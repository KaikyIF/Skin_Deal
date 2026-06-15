const API_URL = '../api.php';

// Validação de e-mail
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Limpar erros
function clearErrors() {
    document.querySelectorAll('.error').forEach(el => {
        el.textContent = '';
        el.classList.remove('active');
    });
}

// Mostrar erro
function showError(fieldId, message) {
    const el = document.getElementById(fieldId + 'Error');
    if (!el) return;
    el.textContent = message;
    el.classList.add('active');
}

// Submit do formulário
document.getElementById('alterarSenhaForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    clearErrors();

    const email = document.getElementById('email').value.trim();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    let valid = true;

    if (!email) {
        showError('email', 'Informe o e-mail');
        valid = false;
    } else if (!validateEmail(email)) {
        showError('email', 'E-mail inválido');
        valid = false;
    }

    if (!newPassword) {
        showError('newPassword', 'Informe a nova senha');
        valid = false;
    } else if (newPassword.length < 6) {
        showError('newPassword', 'Senha deve ter no mínimo 6 caracteres');
        valid = false;
    }

    if (confirmPassword !== newPassword) {
        showError('confirmPassword', 'As senhas não coincidem');
        valid = false;
    }

    if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
        showError('newPassword', 'Senha deve conter letras e números');
        valid = false;
    }

    if (!valid) return;

    try {
        const res = await fetch(`${API_URL}?route=update-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword })
        });

        const data = await res.json();

        if (!data.success) {
            showError('email', data.message || 'Erro ao alterar senha');
            return;
        }

        alert('Senha alterada com sucesso!');
        window.location.href = 'login.html';

    } catch (err) {
        showError('email', 'Erro de conexão com servidor');
    }
});