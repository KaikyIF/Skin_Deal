const API_URL = '/api.php';

// Validação de e-mail
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Limpar erros
function clearErrors() {
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    if (emailError) {
        emailError.textContent = '';
        emailError.classList.remove('active');
    }
    if (passwordError) {
        passwordError.textContent = '';
        passwordError.classList.remove('active');
    }
}

// Mostrar erro
function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('active');
    }
}

// Submit do formulário
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        clearErrors();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        let isValid = true;
        
        if (!email) {
            showError('email', 'Por favor, insira seu e-mail');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('email', 'Por favor, insira um e-mail válido');
            isValid = false;
        }
        
        if (!password) {
            showError('password', 'Por favor, insira sua senha');
            isValid = false;
        }
        
        if (!isValid) return;

        try {
            const response = await fetch(`${API_URL}?route=login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (!result.success) {
                showError('password', result.message || 'E-mail ou senha inválidos');
                return;
            }

            // SALVAR DADOS CORRETAMENTE
            const user = result.user;
            
            // Salvar o ID do usuário
            if (user.usuarios_id) {
                localStorage.setItem('user_id', user.usuarios_id.toString());
            }
            
            // Salvar o EMAIL CORRETO
            if (user.usuarios_email) {
                localStorage.setItem('userEmail', user.usuarios_email);
            } else if (user.email) {
                localStorage.setItem('userEmail', user.email);
            }
            
            // Salvar objeto completo
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Verificar se salvou corretamente
            console.log('Dados salvos no login:');
            console.log('user_id:', localStorage.getItem('user_id'));
            console.log('userEmail:', localStorage.getItem('userEmail'));
            
            // Redirecionar
            window.location.href = 'home.html';

        } catch (error) {
            console.error('Erro no login:', error);
            showError('password', 'Não foi possível conectar ao servidor');
        }
    });
}

// Botão Steam
const steamBtn = document.getElementById('steamBtn');
if (steamBtn) {
    steamBtn.addEventListener('click', function() {
        window.open('https://steamcommunity.com/login', '_blank');
        setTimeout(function() {
            window.location.href = 'home.html';
        }, 500);
    });
}