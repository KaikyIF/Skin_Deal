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

// Back button navigation
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = '/.vscode/minhaconta.html';
    });
}

// Cancel button navigation
if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        window.location.href = '/.vscode/minhaconta.html';
    });
}

// Enable delete button only when both fields are filled correctly
function checkInputs() {
    const passwordFilled = passwordInput?.value?.trim()?.length > 0;
    const confirmTextCorrect = confirmTextInput?.value?.trim()?.toUpperCase() === 'EXCLUIR';
    
    if (deleteBtn) {
        deleteBtn.disabled = !(passwordFilled && confirmTextCorrect);
    }
}

if (passwordInput) {
    passwordInput.addEventListener('input', checkInputs);
}

if (confirmTextInput) {
    confirmTextInput.addEventListener('input', checkInputs);
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
    console.log('📧 Email:', email);
    return email;
}

// TESTAR CONEXÃO COM A API
async function testarConexao() {
    try {
        console.log('🔍 Testando conexão com:', `${API_URL}?route=check`);
        const response = await fetch(`${API_URL}?route=check`);
        const data = await response.json();
        console.log('✅ API respondendo:', data);
        return true;
    } catch (error) {
        console.error('❌ API não responde:', error);
        showNotification('Erro de conexão com o servidor. Verifique se o api.php existe na raiz.', 'error');
        return false;
    }
}

// Modal functions
function showModal() {
    if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideModal() {
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Delete button - show modal
if (deleteBtn) {
    deleteBtn.addEventListener('click', async () => {
        const email = getUserEmail();
        if (!email) {
            showNotification('E-mail não encontrado. Faça login novamente.', 'error');
            return;
        }
        
        // Testar conexão antes de mostrar o modal
        const conectado = await testarConexao();
        if (!conectado) {
            return;
        }
        
        showModal();
    });
}

// Modal delete button - final confirmation
if (modalDeleteBtn) {
    modalDeleteBtn.addEventListener('click', async () => {
        const email = getUserEmail();
        const password = passwordInput?.value || '';

        console.log('=== ENVIANDO EXCLUSÃO ===');
        console.log('📧 Email:', email);
        console.log('🔑 Senha:', password ? '***' : 'VAZIA');
        console.log('📡 API_URL:', API_URL);

        if (!email) {
            showNotification('E-mail não encontrado.', 'error');
            hideModal();
            return;
        }

        if (!password) {
            showNotification('Senha é obrigatória', 'error');
            hideModal();
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

            console.log('📡 Status da resposta:', response.status);
            
            const data = await response.json();
            console.log('📨 Resposta:', data);

            modalDeleteBtn.textContent = originalText;
            modalDeleteBtn.disabled = false;

            if (!data.success) {
                showNotification(data.message || 'Erro ao excluir conta', 'error');
                hideModal();
                return;
            }

            showNotification('Conta excluída com sucesso!', 'success');
            localStorage.clear();
            hideModal();

            setTimeout(() => {
                window.location.href = '/.vscode/login.html';
            }, 2000);

        } catch (err) {
            console.error('❌ Erro:', err);
            modalDeleteBtn.textContent = originalText;
            modalDeleteBtn.disabled = false;
            showNotification('Erro de conexão: ' + err.message, 'error');
            hideModal();
        }
    });
}

// Modal cancel button
if (modalCancelBtn) {
    modalCancelBtn.addEventListener('click', () => {
        hideModal();
    });
}

// Close modal when clicking outside
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            hideModal();
        }
    });
}

// ESC key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay?.classList?.contains('active')) {
        hideModal();
    }
});

// Inicializar
window.addEventListener('DOMContentLoaded', async () => {
    console.log('=== PÁGINA DE EXCLUSÃO CARREGADA ===');
    console.log('📡 API_URL:', API_URL);
    console.log('📧 Email:', localStorage.getItem('userEmail'));
    console.log('🆔 User ID:', localStorage.getItem('user_id'));
    
    checkInputs();
    
    // Testar conexão ao carregar
    await testarConexao();
    
    if (!getUserEmail()) {
        showNotification('Você precisa estar logado para excluir a conta', 'error');
        setTimeout(() => {
            window.location.href = '/.vscode/minhaconta.html';
        }, 2000);
    }
});