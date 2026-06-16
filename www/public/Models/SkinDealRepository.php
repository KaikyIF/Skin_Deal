<?php
namespace Models;
use Config\Database;

class SkinDealRepository
{
    private Database $db;

    public function __construct()
    {
        $this->db = new Database();
    }

    public function createUser(string $name, string $email, string $password): int
    {
        $exists = $this->db->query('SELECT usuarios_id FROM usuarios WHERE usuarios_email = ?', [$email])->fetch();
        if ($exists) {
            throw new \InvalidArgumentException('Este e-mail ja esta cadastrado.');
        }
        $this->db->query(
            'INSERT INTO usuarios (usuarios_nome, usuarios_email, usuarios_senha, usuarios_saldo, usuarios_nivel) VALUES (?, ?, ?, 0, 2)',
            [$name, $email, password_hash($password, PASSWORD_DEFAULT)]
        );
        return (int) $this->db->lastInsertId();
    }

    public function authenticate(string $email, string $password, string $ip = ''): ?array
    {
        $user = $this->db->query('SELECT * FROM usuarios WHERE usuarios_email = ?', [$email])->fetch();
        if (!$user || !password_verify($password, $user['usuarios_senha'])) {
            return null;
        }
        $this->db->query(
            'INSERT INTO historico_login (usuarios_id, historico_ip) VALUES (?, ?)',
            [$user['usuarios_id'], $ip]
        );
        unset($user['usuarios_senha']);
        return $user;
    }

    public function listSkins(?string $search = null): array
    {
        $where = '';
        $params = [];
        if ($search) {
            $where = 'WHERE s.skins_nome LIKE ? OR j.jogos_nome LIKE ?';
            $params = ['%' . $search . '%', '%' . $search . '%'];
        }
        return $this->db->query(
            "SELECT s.skins_id AS id,
                    s.skins_nome AS name,
                    s.skins_preco AS price,
                    s.skins_imagem AS image,
                    s.skins_descricao AS description,
                    s.skins_exterior AS exterior,
                    j.jogos_nome AS game,
                    j.jogos_icone AS gameIcon
               FROM skins s
         INNER JOIN jogos j ON j.jogos_id = s.jogos_id
              $where
           ORDER BY s.skins_id DESC",
            $params
        )->fetchAll();
    }

    public function getSkin(int $id): ?array
    {
        $skin = $this->db->query(
            "SELECT s.skins_id AS id,
                    s.skins_nome AS name,
                    s.skins_preco AS price,
                    s.skins_imagem AS image,
                    s.skins_descricao AS description,
                    s.skins_exterior AS exterior,
                    j.jogos_nome AS game,
                    j.jogos_icone AS gameIcon
               FROM skins s
         INNER JOIN jogos j ON j.jogos_id = s.jogos_id
              WHERE s.skins_id = ?",
            [$id]
        )->fetch();
        return $skin ?: null;
    }

    public function createSaleProposal(int $userId, int $skinId, float $announcedPrice): int
    {
        $commission = round($announcedPrice * 0.05, 2);
        $receive = round($announcedPrice - $commission, 2);
        $this->db->query(
            'INSERT INTO propostas_venda (usuarios_id, skins_id, propostas_preco_anunciado, propostas_comissao, propostas_valor_receber, propostas_status) VALUES (?, ?, ?, ?, ?, ?)',
            [$userId, $skinId, $announcedPrice, $commission, $receive, 'Pendente']
        );
        return (int) $this->db->lastInsertId();
    }

    public function createPurchase(int $buyerId, int $skinId, string $paymentMethod = 'PIX'): int
    {
        $skin = $this->getSkin($skinId);
        if (!$skin) {
            throw new \InvalidArgumentException('Skin nao encontrada.');
        }
        $this->db->query(
            'INSERT INTO transacoes (comprador_id, skins_id, transacoes_valor, transacoes_metodo, transacoes_status) VALUES (?, ?, ?, ?, ?)',
            [$buyerId, $skinId, $skin['price'], $paymentMethod, 'Confirmada']
        );
        return (int) $this->db->lastInsertId();
    }

    public function getUserSummary(int $userId): ?array
    {
        $user = $this->db->query(
            'SELECT usuarios_id AS id, usuarios_nome AS name, usuarios_email AS email, usuarios_saldo AS balance, usuarios_data_criacao AS createdAt FROM usuarios WHERE usuarios_id = ?',
            [$userId]
        )->fetch();
        if (!$user) {
            return null;
        }
        $totals = $this->db->query(
            "SELECT COALESCE(SUM(propostas_valor_receber), 0) AS earnings
               FROM propostas_venda
              WHERE usuarios_id = ? AND propostas_status IN ('Concluida', 'Pendente')",
            [$userId]
        )->fetch();
        $user['earnings'] = (float) $totals['earnings'];
        return $user;
    }

    // ====================== MÉTODOS PARA ALTERAR E-MAIL ======================

    public function getUserById(int $userId): ?array
    {
        $user = $this->db->query(
            'SELECT usuarios_id, usuarios_nome, usuarios_email, usuarios_senha, usuarios_saldo, usuarios_nivel 
             FROM usuarios 
             WHERE usuarios_id = ?',
            [$userId]
        )->fetch();
        return $user ?: null;
    }

    public function getUserByEmail(string $email): ?array
    {
        $user = $this->db->query(
            'SELECT usuarios_id, usuarios_nome, usuarios_email, usuarios_saldo, usuarios_nivel 
             FROM usuarios 
             WHERE usuarios_email = ?',
            [$email]
        )->fetch();
        return $user ?: null;
    }

    public function emailExists(string $email, ?int $excludeUserId = null): bool
    {
        if ($excludeUserId) {
            $stmt = $this->db->query(
                'SELECT COUNT(*) FROM usuarios WHERE usuarios_email = ? AND usuarios_id != ?',
                [$email, $excludeUserId]
            );
        } else {
            $stmt = $this->db->query(
                'SELECT COUNT(*) FROM usuarios WHERE usuarios_email = ?',
                [$email]
            );
        }
        return $stmt->fetchColumn() > 0;
    }

    public function updateUserEmail(int $userId, string $newEmail): bool
    {
        $stmt = $this->db->query(
            'UPDATE usuarios SET usuarios_email = ? WHERE usuarios_id = ?',
            [$newEmail, $userId]
        );
        return $stmt->rowCount() > 0;
    }

    public function updateEmail(string $currentEmail, string $newEmail): bool
    {
        $stmt = $this->db->query(
            'UPDATE usuarios SET usuarios_email = ? WHERE usuarios_email = ?',
            [$newEmail, $currentEmail]
        );
        return $stmt->rowCount() > 0;
    }

    public function updatePassword(string $email, string $newPassword): bool
    {
        $hash = password_hash($newPassword, PASSWORD_DEFAULT);
        $stmt = $this->db->query(
            'UPDATE usuarios SET usuarios_senha = ? WHERE usuarios_email = ?',
            [$hash, $email]
        );
        return $stmt->rowCount() > 0;
    }

    // ====================== DELETE USER ======================
public function deleteUser(string $email, string $password): bool
{
    $user = $this->db->query(
        'SELECT usuarios_id, usuarios_senha FROM usuarios WHERE usuarios_email = ?',
        [$email]
    )->fetch();

    if (!$user) {
        return false;
    }

    if (!password_verify($password, $user['usuarios_senha'])) {
        return false;
    }

    // Remove histórico de login
    $this->db->query(
        'DELETE FROM historico_login WHERE usuarios_id = ?',
        [$user['usuarios_id']]
    );

    // Remove usuário
    $stmt = $this->db->query(
        'DELETE FROM usuarios WHERE usuarios_id = ?',
        [$user['usuarios_id']]
    );

    return $stmt->rowCount() > 0;
}
}