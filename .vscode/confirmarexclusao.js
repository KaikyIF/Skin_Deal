const API_URL = '/api.php';

// DOM Elements
const backBtn = document.getElementById('back-btn');
const passwordInput = document.getElementById('password');
const confirmTextInput = document.getElementById('confirm-text');
const deleteBtn = document.getElementById('delete-btn');
const cancelBtn = document.getElementById('cancel-btn');
const modalOverlay = document.getElementById('modal-overlay');
const modalDeleteBtn = document.getElementById('modal-delete-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');

// Back button
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'configuracoes.html';
    });
}

// Cancel button
if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        window.location.href = 'configuracoes.html';
    });
}

// Verificar se os campos estão preenchidos
function checkForm() {
    const password = passwordInput.value;
    const confirmText = confirmTextInput.value.trim().toUpperCase();
    const isValid = password.length > 0 && confirmText === 'EXCLUIR';
    deleteBtn.disabled = !isValid;
}

passwordInput?.addEventListener('input', checkForm);
confirmTextInput?.addEventListener('input', checkForm);

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

// Pegar email do usuário
function getUserEmail() {
    let email = localStorage.getItem('userEmail');
    if (!email) {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            try {
                const user = JSON.parse(currentUser);
                email = user.usuarios_email || user.email;
                if (email) {
                    localStorage.setItem('userEmail', email);
                }
            } catch(e) {}
        }
    }
    return email;
}

// Modal functions
function showModal() {
    if (modalOverlay) {
        modalOverlay.classList.add('active');
    }
}

function closeModal() {
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
    }
}

// Botão excluir
if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
        const email = getUserEmail();
        if (!email) {
            showNotification('E-mail não encontrado. Faça login novamente.', 'error');
            return;
        }
        showModal();
    });
}

// Confirmar exclusão
if (modalDeleteBtn) {
    modalDeleteBtn.addEventListener('click', async () => {
        const email = getUserEmail();
        const password = passwordInput.value;

        if (!email) {
            showNotification('E-mail não encontrado.', 'error');
            closeModal();
            return;
        }

        if (!password) {
            showNotification('Senha é obrigatória', 'error');
            closeModal();
            return;
        }

        const originalText = modalDeleteBtn.textContent;
        modalDeleteBtn.textContent = 'Excluindo...';
        modalDeleteBtn.disabled = true;

        try {
            const response = await fetch(`${API_URL}?route=delete-user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            modalDeleteBtn.textContent = originalText;
            modalDeleteBtn.disabled = false;

            if (!data.success) {
                showNotification(data.message || 'Erro ao excluir conta', 'error');
                closeModal();
                return;
            }

            showNotification('Conta excluída com sucesso!', 'success');
            localStorage.clear();
            closeModal();

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);

        } catch (err) {
            console.error('Erro:', err);
            modalDeleteBtn.textContent = originalText;
            modalDeleteBtn.disabled = false;
            showNotification('Erro de conexão com o servidor', 'error');
            closeModal();
        }
    });
}

// Cancelar modal
if (modalCancelBtn) {
    modalCancelBtn.addEventListener('click', () => {
        closeModal();
    });
}

// Fechar modal ao clicar fora
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}

// Inicializar
window.addEventListener('DOMContentLoaded', () => {
    console.log('Página de exclusão carregada');
    
    if (!getUserEmail()) {
        showNotification('Você precisa estar logado para excluir a conta', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }
});