const API_URL = '/api.php';

// DOM Elements
const backBtn = document.getElementById('back-btn');
const passwordForm = document.getElementById('password-form');
const currentEmailInput = document.getElementById('current-email');
const newPasswordInput = document.getElementById('new-password');
const confirmPasswordInput = document.getElementById('confirm-password');

// ========== FUNÇÕES PARA O FLOATING LABEL ==========
function initFloatingLabels() {
    const inputs = document.querySelectorAll('.password-input');
    
    function updateLabelState(input) {
        const container = input.closest('.input-container');
        if (container) {
            if (input.value.trim() !== '') {
                container.classList.add('filled');
            } else {
                container.classList.remove('filled');
            }
        }
    }
    
    inputs.forEach(input => {
        updateLabelState(input);
        input.addEventListener('input', () => updateLabelState(input));
        input.addEventListener('blur', () => updateLabelState(input));
        input.addEventListener('focus', () => updateLabelState(input));
    });
}
// ===================================================

// Back button
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'configuracoes.html';
    });
}

// Toast Notification
function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.textContent = message;
    const color = type === 'error' ? '#d32f2f' : '#10355b';
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: ${color};
        color: white;
        padding: 14px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        font-family: 'Poppins', sans-serif;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Pegar ID do usuário
function getUserId() {
    let userId = localStorage.getItem('user_id');
    if (!userId) {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            try {
                const user = JSON.parse(currentUser);
                userId = user.usuarios_id || user.id;
                if (userId) {
                    localStorage.setItem('user_id', userId);
                }
            } catch(e) {}
        }
    }
    return userId;
}

// Buscar email atual do usuário pela API
async function loadCurrentEmail() {
    const userId = getUserId();
    
    if (!userId) {
        console.log('Usuário não logado');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}?route=get-user-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: parseInt(userId) })
        });
        
        const data = await response.json();
        console.log('Resposta da API ao buscar email:', data);
        
        if (data.success && data.email) {
            currentEmailInput.value = data.email;
            currentEmailInput.disabled = true;
            currentEmailInput.style.backgroundColor = '#f5f5f5';
            currentEmailInput.style.opacity = '0.7';
            
            // Atualizar o floating label
            const container = currentEmailInput.closest('.input-container');
            if (container) {
                container.classList.add('filled');
            }
        } else {
            console.log('Não foi possível buscar o email:', data.message);
            const savedEmail = localStorage.getItem('userEmail');
            if (savedEmail) {
                currentEmailInput.value = savedEmail;
                currentEmailInput.disabled = true;
            } else {
                currentEmailInput.disabled = false;
                currentEmailInput.placeholder = "Digite seu e-mail atual";
            }
        }
    } catch (error) {
        console.error('Erro ao buscar email:', error);
        const savedEmail = localStorage.getItem('userEmail');
        if (savedEmail) {
            currentEmailInput.value = savedEmail;
            currentEmailInput.disabled = true;
        }
    }
}

// Validar senha
function validatePassword(password) {
    return password.length >= 6;
}

// Enviar formulário
if (passwordForm) {
    passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userId = getUserId();
        const currentEmail = currentEmailInput.value.trim();
        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        console.log('Enviando formulário:', { userId, currentEmail });

        if (!userId) {
            return showNotification('Você precisa estar logado. Faça login novamente.', 'error');
        }

        if (!currentEmail) {
            return showNotification('E-mail atual é obrigatório', 'error');
        }

        if (!newPassword || !confirmPassword) {
            return showNotification('Por favor, preencha a nova senha e confirmação', 'error');
        }

        if (!validatePassword(newPassword)) {
            return showNotification('A senha deve ter pelo menos 6 caracteres', 'error');
        }

        if (newPassword !== confirmPassword) {
            return showNotification('As senhas não coincidem', 'error');
        }

        const submitBtn = document.getElementById('submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(`${API_URL}?route=update-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: currentEmail,
                    newPassword: newPassword
                })
            });

            const data = await response.json();
            console.log('Resposta da API:', data);

            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            if (data.success) {
                showNotification('Senha alterada com sucesso!', 'success');
                
                setTimeout(() => {
                    window.location.href = 'configuracoes.html';
                }, 1500);
            } else {
                showNotification(data.message || 'Erro ao alterar senha', 'error');
            }

        } catch (err) {
            console.error('Erro:', err);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            showNotification('Erro de conexão: ' + err.message, 'error');
        }
    });
}

// Inicializar
window.addEventListener('DOMContentLoaded', () => {
    console.log('Página de alterar senha carregada');
    initFloatingLabels();
    loadCurrentEmail();
});