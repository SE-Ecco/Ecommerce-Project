// WHAT: Creates the "shops" table — run FIRST (no dependencies)
// HOW TO RUN: pnpm migrate (from database/ folder)
// ⚠️ Must run before all other migrations!
// COLUMNS: id, name, slug (unique), description, logo_url, is_active, created_at, updated_at

'use strict';  // Enable strict mode to catch silent errors 

/** @type {import('sequelize-cli').Migration} */ //help the vscode to know the type of the object being exported

module.exports={ //to export the object on the file
    async up(queryInterface, Sequelize){ //up function to add the table to the database
        await queryInterface.sequelize.query(`
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tenant_status') THEN
                    CREATE TYPE tenant_status AS ENUM('active','inactive','suspended');
                END IF;
            END $$;
        `);
        await queryInterface.createTable('tenants',{  //creating table with attributes
              id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      // Cloudinary fields — store reference only, never binary data!
      cloudinary_logo_url: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      cloudinary_logo_public_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true,  // each image has a unique public_id on Cloudinary
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'suspended'),
        allowNull: false,
        defaultValue: 'inactive',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('tenants',['slug'],{ //create index for the column slug in table tenants
        name:'idx_tenants_slug',
    });

    await queryInterface.sequelize.query(  //create function of update in each row
        `create or replace function updated_timestamp()
        returns TRIGGER as $$
        begin
        NEW.updated_at=NOW();
        return NEW;
        end;
        $$ language plpgsql;`
    );

    await queryInterface.sequelize.query(  //create trigger. and trigger tells the function when to work
        `create trigger set_timestamp
        before update on tenants
        for each row execute function updated_timestamp();`
    );
},   

    async down(queryInterface,Sequelize){  //used down function if we have an error or have changes
        await queryInterface.sequelize.query(
            `drop trigger if exists set_timestamp on tenants`
        );

        await queryInterface.dropTable('tenants');

        await queryInterface.sequelize.query(
            `drop type if exists tenant_status cascade`
        );

        await queryInterface.sequelize.query(
            `drop type if exists "enum_tenants_status" cascade`
        );

        await queryInterface.sequelize.query(
            `drop function if exists updated_timestamp`
        );
    },

};
//khalil-database-migrations