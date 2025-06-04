<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250521145124 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE cart_product DROP quantity
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE order_cart_product CHANGE cart_product_id cart_product_id INT NOT NULL, CHANGE purchase_id purchase_id INT NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user DROP is_verified
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE cart_product ADD quantity INT NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE order_cart_product CHANGE cart_product_id cart_product_id INT DEFAULT NULL, CHANGE purchase_id purchase_id INT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user ADD is_verified TINYINT(1) NOT NULL
        SQL);
    }
}
