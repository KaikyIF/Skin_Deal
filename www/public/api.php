<?php
declare(strict_types=1);

spl_autoload_register(function ($class) {
    $path = __DIR__ . '/' . str_replace('\\', '/', $class) . '.php';
    if (file_exists($path)) {
        require $path;
    }
});

use Models\SkinDealRepository;

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

function input() {
    $raw = file_get_contents('php://input');
    return $raw ? json_decode($raw, true) : $_POST;
}

function respond($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

$repo = new SkinDealRepository();
$route = $_GET['route'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

try {
    // ==================== CADASTRO ====================
    if ($route === 'register' && $method === 'POST') {
        $data = input();
        $name = $data['name'] ?? '';
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        if (empty($name) || empty($email) || empty($password)) {
            respond(['success' => false, 'message' => 'Todos os campos são obrigatórios'], 422);
        }

        $userId = $repo->createUser($name, $email, $password);
        respond([
            'success' => true, 
            'message' => 'Cadastro realizado com sucesso!',
            'user' => ['id' => $userId, 'usuarios_id' => $userId]
        ]);
    }

    // ==================== LOGIN ====================
    if ($route === 'login' && $method === 'POST') {
        $data = input();
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';

        $user = $repo->authenticate($email, $password, $ip);
        if ($user) {
            respond([
                'success' => true, 
                'user' => $user
            ]);
        } else {
            respond(['success' => false, 'message' => 'Email ou senha incorretos'], 401);
        }
    }

    // ==================== ALTERAR E-MAIL ====================
    if ($route === 'update-email' && $method === 'POST') {
        $data = input();
        
        $userId = isset($data['userId']) ? (int)$data['userId'] : null;
        $currentEmail = $data['currentEmail'] ?? '';
        $newEmail = $data['newEmail'] ?? '';
        
        if (empty($newEmail)) {
            respond(['success' => false, 'message' => 'Novo e-mail é obrigatório'], 422);
        }
        
        if (!filter_var($newEmail, FILTER_VALIDATE_EMAIL)) {
            respond(['success' => false, 'message' => 'E-mail inválido'], 422);
        }
        
        $user = null;
        if ($userId) {
            $user = $repo->getUserById($userId);
        }
        
        if (!$user && !empty($currentEmail)) {
            $user = $repo->getUserByEmail($currentEmail);
        }
        
        if (!$user) {
            respond(['success' => false, 'message' => 'Usuário não encontrado'], 404);
        }
        
        if ($repo->emailExists($newEmail, $user['usuarios_id'])) {
            respond(['success' => false, 'message' => 'Este e-mail já está em uso'], 409);
        }
        
        $updated = $repo->updateUserEmail($user['usuarios_id'], $newEmail);
        
        if ($updated) {
            respond(['success' => true, 'message' => 'E-mail atualizado com sucesso!']);
        } else {
            respond(['success' => false, 'message' => 'Erro ao atualizar e-mail'], 500);
        }
    }

    // ==================== ALTERAR SENHA ====================
    if ($route === 'update-password' && $method === 'POST') {
        $data = input();
        $email = $data['email'] ?? '';
        $newPassword = $data['newPassword'] ?? '';
        
        if (empty($email) || empty($newPassword)) {
            respond(['success' => false, 'message' => 'Todos os campos são obrigatórios'], 422);
        }
        
        if (strlen($newPassword) < 6) {
            respond(['success' => false, 'message' => 'A senha deve ter pelo menos 6 caracteres'], 422);
        }
        
        $updated = $repo->updatePassword($email, $newPassword);
        
        if ($updated) {
            respond(['success' => true, 'message' => 'Senha alterada com sucesso!']);
        } else {
            respond(['success' => false, 'message' => 'E-mail não encontrado'], 404);
        }
    }

    // ==================== EXCLUIR CONTA ====================
    if ($route === 'delete-user' && $method === 'POST') {
        $data = input();
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        
        if (empty($email) || empty($password)) {
            respond(['success' => false, 'message' => 'Todos os campos são obrigatórios'], 422);
        }
        
        $deleted = $repo->deleteUser($email, $password);
        
        if ($deleted) {
            respond(['success' => true, 'message' => 'Conta excluída com sucesso!']);
        } else {
            respond(['success' => false, 'message' => 'E-mail ou senha incorretos'], 401);
        }
    }

    // ==================== LISTAR SKINS ====================
    if ($route === 'skins' && $method === 'GET') {
        $search = $_GET['search'] ?? null;
        $skins = $repo->listSkins($search);
        respond(['success' => true, 'skins' => $skins]);
    }

    // ==================== BUSCAR SKIN POR ID ====================
    if ($route === 'skin' && $method === 'GET') {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            respond(['success' => false, 'message' => 'ID da skin é obrigatório'], 422);
        }
        
        $skin = $repo->getSkin((int)$id);
        if ($skin) {
            respond(['success' => true, 'skin' => $skin]);
        } else {
            respond(['success' => false, 'message' => 'Skin não encontrada'], 404);
        }
    }

    // ==================== CRIAR PROPOSTA DE VENDA ====================
if ($route === 'sale-proposals' && $method === 'POST') {
    $data = input();
    $userId = $data['userId'] ?? null;
    $skinId = $data['skinId'] ?? null;
    $announcedPrice = $data['announcedPrice'] ?? null;
    
    if (!$userId || !$skinId || !$announcedPrice) {
        respond(['success' => false, 'message' => 'Todos os campos são obrigatórios'], 422);
    }
    
    $proposalId = $repo->createSaleProposal((int)$userId, (int)$skinId, (float)$announcedPrice);
    respond(['success' => true, 'proposal_id' => $proposalId]);
}
    // ==================== CRIAR COMPRA (FINALIZAR COMPRA) ====================
    if ($route === 'purchase' && $method === 'POST') {
        $data = input();
        $userId = $data['userId'] ?? null;
        $skinId = $data['skinId'] ?? null;
        $paymentMethod = $data['paymentMethod'] ?? 'PIX';
        
        if (!$userId || !$skinId) {
            respond(['success' => false, 'message' => 'Usuário e skin são obrigatórios'], 422);
        }
        
        $purchaseId = $repo->createPurchase((int)$userId, (int)$skinId, $paymentMethod);
        respond(['success' => true, 'purchase_id' => $purchaseId, 'message' => 'Compra realizada com sucesso!']);
    }

    // ==================== DADOS DO USUÁRIO ====================
    if ($route === 'me' && $method === 'GET') {
        $userId = $_GET['userId'] ?? null;
        
        if (!$userId) {
            respond(['success' => false, 'message' => 'Usuário não identificado'], 401);
        }
        
        $user = $repo->getUserSummary((int)$userId);
        if ($user) {
            respond(['success' => true, 'user' => $user]);
        } else {
            respond(['success' => false, 'message' => 'Usuário não encontrado'], 404);
        }
    }

    // ==================== VERIFICAR SESSÃO ====================
    if ($route === 'check-session' && $method === 'POST') {
        $data = input();
        $userId = $data['userId'] ?? null;
        
        if ($userId) {
            $user = $repo->getUserById((int)$userId);
            if ($user) {
                respond(['success' => true, 'user' => $user]);
            } else {
                respond(['success' => false, 'message' => 'Usuário não encontrado']);
            }
        } else {
            respond(['success' => false, 'message' => 'Não autenticado']);
        }
    }

    // ==================== PEGAR EMAIL DO USUÁRIO ====================
    if ($route === 'get-user-email' && $method === 'POST') {
        $data = input();
        $userId = $data['userId'] ?? null;
        
        if (!$userId) {
            respond(['success' => false, 'message' => 'Usuário não identificado'], 401);
        }
        
        $user = $repo->getUserById((int)$userId);
        if ($user) {
            respond(['success' => true, 'email' => $user['usuarios_email']]);
        } else {
            respond(['success' => false, 'message' => 'Usuário não encontrado'], 404);
        }
    }

    // ==================== LOGOUT ====================
    if ($route === 'logout' && $method === 'POST') {
        respond(['success' => true, 'message' => 'Logout realizado']);
    }

    // ==================== ROTA DE TESTE ====================
    if ($route === 'check' && $method === 'GET') {
        respond(['success' => true, 'message' => 'API funcionando!']);
    }

    // ==================== ROTA NÃO ENCONTRADA ====================
    respond(['success' => false, 'message' => 'Rota não encontrada: ' . $route], 404);

} catch (\Exception $e) {
    respond(['success' => false, 'message' => 'Erro: ' . $e->getMessage()], 400);
}