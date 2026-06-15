const API_URL = '../api.php';

const backBtn = document.getElementById('back-btn');
const codeInputs = document.querySelectorAll('.code-input');
const resendBtn = document.getElementById('resend-btn');
const confirmBtn = document.getElementById('confirm-btn');

let resendCooldown = false;

// Back button
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'alterarsenha.html';
    });
}

// Code inputs handling
codeInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        if (input.value.length === 1 && index < codeInputs.length - 1) {
            codeInputs[index + 1].focus();
        }
        checkCodeComplete();
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && index > 0) {
            codeInputs[index - 1].focus();
        }
    });
});

function checkCodeComplete() {
    const code = Array.from(codeInputs).map(i => i.value).join('');
    confirmBtn.disabled = code.length !== 5;
}

// Confirm button
if (confirmBtn) {
    confirmBtn.addEventListener('click', async () => {
        const code = Array.from(codeInputs).map(i => i.value).join('');

        if (code.length !== 5) {
            return showNotification('Código inválido', 'error');
        }

        // Simulação de validação (pode ser melhorado depois com backend)
        const pending = localStorage.getItem('pendingPasswordChange');
        
        if (pending) {
            localStorage.removeItem('pendingPasswordChange');
            showNotification('Senha alterada com sucesso!', 'success');

            setTimeout(() => {
                window.location.href = 'configuracoes.html';
            }, 1500);
        } else {
            showNotification('Sessão expirada. Tente novamente.', 'error');
        }
    });
}

// Resend code
if (resendBtn) {
    resendBtn.addEventListener('click', () => {
        if (resendCooldown) return;
        showNotification('Código reenviado para o e-mail!', 'success');
        startCooldown();
    });
}

function startCooldown() {
    resendCooldown = true;
    resendBtn.disabled = true;
    let time = 60;
    resendBtn.textContent = `Reenviar (${time}s)`;

    const interval = setInterval(() => {
        time--;
        resendBtn.textContent = `Reenviar (${time}s)`;
        if (time <= 0) {
            clearInterval(interval);
            resendCooldown = false;
            resendBtn.disabled = false;
            resendBtn.textContent = 'Reenviar código';
        }
    }, 1000);
}

// Notification Toast
function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.textContent = message;
    const color = type === 'error' ? '#d32f2f' : '#10355b';
    toast.style.cssText = `
        position: fixed; bottom: 24px; right: 24px; 
        background: ${color}; color: white; padding: 14px 20px; 
        border-radius: 10px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    codeInputs[0]?.focus();
});