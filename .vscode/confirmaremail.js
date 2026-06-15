// Substitua o conteúdo de confirmaremail.js por este:

const API_URL = '../api.php';

const backBtn = document.getElementById('back-btn');
const codeInputs = document.querySelectorAll('.code-input');
const resendBtn = document.getElementById('resend-btn');
const confirmBtn = document.getElementById('confirm-btn');

let resendCooldown = false;

// Back button
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'alteraremail.html';
    });
}

// Code input logic (mantido igual)
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

// Confirm
if (confirmBtn) {
    confirmBtn.addEventListener('click', async () => {
        const code = Array.from(codeInputs).map(i => i.value).join('');

        if (code.length !== 5) {
            return showNotification('Código inválido', 'error');
        }

        // Aqui você pode validar o código no backend no futuro
        // Por enquanto, simulamos sucesso e atualizamos o email
        const pending = localStorage.getItem('pendingEmailChange');
        
        if (pending) {
            const { newEmail } = JSON.parse(pending);
            localStorage.setItem('userEmail', newEmail);
            localStorage.removeItem('pendingEmailChange');

            showNotification('E-mail alterado com sucesso!', 'success');

            setTimeout(() => {
                window.location.href = 'configuracoes.html';
            }, 1500);
        }
    });
}

// Resend (simulado)
if (resendBtn) {
    resendBtn.addEventListener('click', () => {
        if (resendCooldown) return;
        showNotification('Código reenviado!', 'success');
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

function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position:fixed; bottom:24px; right:24px; padding:14px 20px; border-radius:10px; 
        background:${type==='error'?'#d32f2f':'#10355b'}; color:white; z-index:9999;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}