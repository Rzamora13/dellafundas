<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250507152307 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE order_cart_product (id INT AUTO_INCREMENT NOT NULL, cart_product_id INT DEFAULT NULL, purchase_id INT DEFAULT NULL, INDEX IDX_2C5058C025EE16A8 (cart_product_id), INDEX IDX_2C5058C0558FBEB9 (purchase_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE order_cart_product ADD CONSTRAINT FK_2C5058C025EE16A8 FOREIGN KEY (cart_product_id) REFERENCES cart_product (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE order_cart_product ADD CONSTRAINT FK_2C5058C0558FBEB9 FOREIGN KEY (purchase_id) REFERENCES `order` (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE order_cart_products DROP FOREIGN KEY FK_80465DE325EE16A8
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE order_cart_products DROP FOREIGN KEY FK_80465DE3558FBEB9
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE order_cart_products
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE `order` ADD status VARCHAR(20) NOT NULL
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE order_cart_products (id INT AUTO_INCREMENT NOT NULL, cart_product_id INT DEFAULT NULL, purchase_id INT DEFAULT NULL, INDEX IDX_80465DE325EE16A8 (cart_product_id), INDEX IDX_80465DE3558FBEB9 (purchase_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = '' 
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE order_cart_products ADD CONSTRAINT FK_80465DE325EE16A8 FOREIGN KEY (cart_product_id) REFERENCES cart_product (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE order_cart_products ADD CONSTRAINT FK_80465DE3558FBEB9 FOREIGN KEY (purchase_id) REFERENCES `order` (id)
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
            ALTER TABLE `order` DROP status
        SQL);
    }
}
