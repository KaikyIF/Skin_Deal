const API_URL = '/api.php';

// DOM Elements
const backBtn = document.getElementById('back-btn');
const emailForm = document.getElementById('email-form');
const currentEmailInput = document.getElementById('current-email');
const newEmailInput = document.getElementById('new-email');
const confirmEmailInput = document.getElementById('confirm-email');

// ========== FUNÇÕES PARA O FLOATING LABEL ==========
function initFloatingLabels() {
    const inputs = document.querySelectorAll('.email-input');
    
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

// Validação de e-mail
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
            
            // Também atualizar o localStorage com o email correto
            localStorage.setItem('userEmail', data.email);
        } else {
            console.log('Não foi possível buscar o email:', data.message);
            // Tentar usar o localStorage como fallback
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
        // Fallback para localStorage
        const savedEmail = localStorage.getItem('userEmail');
        if (savedEmail) {
            currentEmailInput.value = savedEmail;
            currentEmailInput.disabled = true;
        }
    }
}

// Enviar formulário
if (emailForm) {
    emailForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userId = getUserId();
        const currentEmail = currentEmailInput.value.trim();
        const newEmail = newEmailInput.value.trim();
        const confirmEmail = confirmEmailInput.value.trim();

        console.log('Enviando formulário:', { userId, currentEmail, newEmail });

        if (!userId) {
            return showNotification('Você precisa estar logado. Faça login novamente.', 'error');
        }

        if (!currentEmail) {
            return showNotification('E-mail atual é obrigatório', 'error');
        }

        if (!newEmail || !confirmEmail) {
            return showNotification('Por favor, preencha o novo e-mail e confirmação', 'error');
        }

        if (!validateEmail(newEmail)) {
            return showNotification('Novo e-mail inválido', 'error');
        }

        if (newEmail !== confirmEmail) {
            return showNotification('Os e-mails não coincidem', 'error');
        }

        const submitBtn = document.getElementById('submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(`${API_URL}?route=update-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: parseInt(userId),
                    currentEmail: currentEmail,
                    newEmail: newEmail
                })
            });

            const data = await response.json();
            console.log('Resposta da API:', data);

            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            if (data.success) {
                showNotification('E-mail atualizado com sucesso!', 'success');
                localStorage.setItem('userEmail', newEmail);
                
                // Atualizar currentUser
                const currentUser = localStorage.getItem('currentUser');
                if (currentUser) {
                    try {
                        const user = JSON.parse(currentUser);
                        user.usuarios_email = newEmail;
                        user.email = newEmail;
                        localStorage.setItem('currentUser', JSON.stringify(user));
                    } catch(e) {}
                }
                
                setTimeout(() => {
                    window.location.href = 'configuracoes.html';
                }, 1500);
            } else {
                showNotification(data.message || 'Erro ao atualizar e-mail', 'error');
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
    console.log('Página carregada');
    initFloatingLabels();
    loadCurrentEmail(); // Agora busca o email da API, não do localStorage
});