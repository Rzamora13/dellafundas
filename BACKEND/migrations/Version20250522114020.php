<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250522114020 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE order_product (id INT AUTO_INCREMENT NOT NULL, purchase_id INT NOT NULL, product_name VARCHAR(255) NOT NULL, product_price DOUBLE PRECISION NOT NULL, quantity INT NOT NULL, subtotal DOUBLE PRECISION NOT NULL, INDEX IDX_2530ADE6558FBEB9 (purchase_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE order_product ADD CONSTRAINT FK_2530ADE6558FBEB9 FOREIGN KEY (purchase_id) REFERENCES `order` (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE order_cart_product DROP FOREIGN KEY FK_2C5058C025EE16A8
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE order_cart_product DROP FOREIGN KEY FK_2C5058C0558FBEB9
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE order_cart_product
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE `order` ADD total DOUBLE PRECISION NOT NULL
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE order_cart_product (id INT AUTO_INCREMENT NOT NULL, cart_product_id INT NOT NULL, purchase_id INT NOT NULL, INDEX IDX_2C5058C0558FBEB9 (purchase_id), INDEX IDX_2C5058C025EE16A8 (cart_product_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = '' 
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE order_cart_product ADD CONSTRAINT FK_2C5058C025EE16A8 FOREIGN KEY (cart_product_id) REFERENCES cart_product (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE order_cart_product ADD CONSTRAINT FK_2C5058C0558FBEB9 FOREIGN KEY (purchase_id) REFERENCES `order` (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE order_product DROP FOREIGN KEY FK_2530ADE6558FBEB9
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE order_product
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE `order` DROP total
        SQL);
    }
}
