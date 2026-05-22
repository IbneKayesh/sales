import fs from 'fs';
import path from 'path';
import { query } from './db.js';

const SCHEMA_FILES = [
  't_activity_log.sql',
  't_projects.sql',
  't_modules.sql',

  't_submodules.sql',
  't_tables.sql',
  't_columns.sql',
  't_features.sql',
  't_table_features.sql'
];


export const SCHEMA_SQL = SCHEMA_FILES
  .map(fileName => fs.readFileSync(path.resolve(process.cwd(), 'docs', fileName), 'utf8'))
  .join('\n\n');

const seedTables = [
  {
    name: 'departments',
    description: 'Stores company department records',
    columns: [
      { name: 'id', type: 'SERIAL', primary: true, nullable: false },
      { name: 'name', type: 'VARCHAR', length: 150, nullable: false },
      { name: 'code', type: 'VARCHAR', length: 30, nullable: false },
      { name: 'is_active', type: 'BOOLEAN', nullable: false, default: 'true' }
    ]
  },
  {
    name: 'employees',
    description: 'Stores employee personal and employment details',
    columns: [
      { name: 'id', type: 'SERIAL', primary: true, nullable: false },
      { name: 'department_id', type: 'INTEGER', nullable: false, foreign: true, referencesTable: 'departments' },
      { name: 'first_name', type: 'VARCHAR', length: 100, nullable: false },
      { name: 'last_name', type: 'VARCHAR', length: 100, nullable: false },
      { name: 'email', type: 'VARCHAR', length: 255, nullable: false },
      { name: 'status', type: 'VARCHAR', length: 50, nullable: false, default: 'Active' }
    ]
  },
  {
    name: 'payroll_runs',
    description: 'Stores scheduled payroll calculation runs',
    columns: [
      { name: 'id', type: 'SERIAL', primary: true, nullable: false },
      { name: 'run_month', type: 'DATE', nullable: false },
      { name: 'status', type: 'VARCHAR', length: 50, nullable: false, default: 'Draft' },
      { name: 'processed_at', type: 'TIMESTAMP', nullable: true }
    ]
  },
  {
    name: 'payslips',
    description: 'Stores generated employee payslips',
    columns: [
      { name: 'id', type: 'SERIAL', primary: true, nullable: false },
      { name: 'payroll_run_id', type: 'INTEGER', nullable: false, foreign: true, referencesTable: 'payroll_runs' },
      { name: 'employee_id', type: 'INTEGER', nullable: false, foreign: true, referencesTable: 'employees' },
      { name: 'gross_amount', type: 'NUMERIC', nullable: false, default: '0' },
      { name: 'net_amount', type: 'NUMERIC', nullable: false, default: '0' }
    ]
  },
  {
    name: 'customers',
    description: 'Stores client and prospect information',
    columns: [
      { name: 'id', type: 'SERIAL', primary: true, nullable: false },
      { name: 'company_name', type: 'VARCHAR', length: 200, nullable: false },
      { name: 'contact_name', type: 'VARCHAR', length: 150, nullable: true },
      { name: 'email', type: 'VARCHAR', length: 255, nullable: true },
      { name: 'created_on', type: 'DATE', nullable: false, default: 'CURRENT_DATE' }
    ]
  },
  {
    name: 'opportunities',
    description: 'Tracks sales opportunities by customer',
    columns: [
      { name: 'id', type: 'SERIAL', primary: true, nullable: false },
      { name: 'customer_id', type: 'INTEGER', nullable: false, foreign: true, referencesTable: 'customers' },
      { name: 'title', type: 'VARCHAR', length: 200, nullable: false },
      { name: 'stage', type: 'VARCHAR', length: 80, nullable: false, default: 'New' },
      { name: 'estimated_value', type: 'NUMERIC', nullable: false, default: '0' }
    ]
  },
  {
    name: 'accounts',
    description: 'Stores chart of account definitions',
    columns: [
      { name: 'id', type: 'SERIAL', primary: true, nullable: false },
      { name: 'account_code', type: 'VARCHAR', length: 50, nullable: false },
      { name: 'account_name', type: 'VARCHAR', length: 200, nullable: false },
      { name: 'account_type', type: 'VARCHAR', length: 80, nullable: false }
    ]
  },
  {
    name: 'journal_entries',
    description: 'Stores debit and credit journal entry lines',
    columns: [
      { name: 'id', type: 'SERIAL', primary: true, nullable: false },
      { name: 'account_id', type: 'INTEGER', nullable: false, foreign: true, referencesTable: 'accounts' },
      { name: 'entry_date', type: 'DATE', nullable: false, default: 'CURRENT_DATE' },
      { name: 'debit', type: 'NUMERIC', nullable: false, default: '0' },
      { name: 'credit', type: 'NUMERIC', nullable: false, default: '0' }
    ]
  }
];

const seedModules = [
  {
    name: 'HR',
    description: 'Human Resources management module',
    submodules: [
      {
        name: 'Employee Management',
        description: 'Manage employee records, departments, and assignments',
        features: [
          { name: 'Employee Directory', description: 'View and manage employee lists', status: 'done', tables: ['employees', 'departments'] },
          { name: 'Employee Profile', description: 'View complete employee profile details', status: 'working', tables: ['employees'] }
        ]
      },
      {
        name: 'Payroll',
        description: 'Payroll processing and management',
        features: [
          { name: 'Payroll Processing', description: 'Calculate employee salaries and deductions', status: 'working', tables: ['payroll_runs', 'payslips', 'employees'] },
          { name: 'Payslip Generation', description: 'Generate payslips for employees', status: 'working', tables: ['payslips'] }
        ]
      }
    ]
  },
  {
    name: 'CRM',
    description: 'Customer Relationship Management module',
    submodules: [
      {
        name: 'Sales',
        description: 'Sales pipeline and leads management',
        features: [
          { name: 'Lead Capture Form', description: 'Capture incoming site leads', status: 'done', tables: ['customers'] },
          { name: 'Sales Pipeline', description: 'Manage customer opportunities', status: 'working', tables: ['customers', 'opportunities'] }
        ]
      }
    ]
  },
  {
    name: 'Accounts',
    description: 'Financial accounting module',
    submodules: [
      {
        name: 'General Ledger',
        description: 'Chart of accounts and journal transactions',
        features: [
          { name: 'Account Setup', description: 'Configure chart of accounts', status: 'working', tables: ['accounts'] },
          { name: 'Journal Posting', description: 'Post accounting transactions', status: 'working', tables: ['accounts', 'journal_entries'] }
        ]
      }
    ]
  }
];

export async function initializeSchema() {
  try {
    console.log('Initializing PostgreSQL database schema...');
    await query(SCHEMA_SQL);
    console.log('Database tables verified/created successfully.');

    const modulesCountRes = await query('SELECT COUNT(*) FROM t_modules');
    const modulesCount = parseInt(modulesCountRes.rows[0].count, 10);

    if (modulesCount > 0) {
      return;
    }

    console.log('Seeding initial schema data...');

    const tableIdsByName = new Map();
    const featureLinks = [];

    // for (const [tableSequence, table] of seedTables.entries()) {
    //   const tableRes = await query(
    //     `INSERT INTO t_tables (table_name, description, sequence, created_at)
    //      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
    //      RETURNING id`,
    //     [table.name, table.description, tableSequence]
    //   );
    //   const tableId = tableRes.rows[0].id;
    //   tableIdsByName.set(table.name, tableId);

    //   for (const [columnSequence, col] of table.columns.entries()) {
    //     await query(
    //       `INSERT INTO t_columns (
    //         table_id,
    //         column_name,
    //         data_type,
    //         length,
    //         nullable,
    //         default_value,
    //         is_primary,
    //         is_foreign,
    //         references_table,
    //         sequence,
    //         created_at
    //       )
    //       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)`,
    //       [
    //         tableId,
    //         col.name,
    //         col.type,
    //         col.length || null,
    //         col.nullable !== false,
    //         col.default || null,
    //         col.primary === true,
    //         col.foreign === true,
    //         col.referencesTable || null,
    //         columnSequence
    //       ]
    //     );
    //   }
    // }

    // for (const [moduleSequence, mod] of seedModules.entries()) {
    //   const moduleRes = await query(
    //     `INSERT INTO t_modules (name, description, sequence, created_at)
    //      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
    //      RETURNING id`,
    //     [mod.name, mod.description, moduleSequence]
    //   );
    //   const moduleId = moduleRes.rows[0].id;

    //   for (const [submoduleSequence, submod] of mod.submodules.entries()) {
    //     const submoduleRes = await query(
    //       `INSERT INTO t_submodules (module_id, name, description, sequence, created_at)
    //        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
    //        RETURNING id`,
    //       [moduleId, submod.name, submod.description, submoduleSequence]
    //     );
    //     const submoduleId = submoduleRes.rows[0].id;

    //     for (const feat of submod.features) {
    //       const featureRes = await query(
    //         `INSERT INTO t_features (submodule_id, feature_name, description, status, created_at)
    //          VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
    //          RETURNING id`,
    //         [submoduleId, feat.name, feat.description, feat.status]
    //       );
    //       featureLinks.push({ featureId: featureRes.rows[0].id, tableNames: feat.tables });
    //     }
    //   }
    // }

    // for (const link of featureLinks) {
    //   for (const tableName of link.tableNames) {
    //     const tableId = tableIdsByName.get(tableName);
    //     if (!tableId) continue;

    //     await query(
    //       `INSERT INTO t_table_features (table_id, feature_id, created_at)
    //        VALUES ($1, $2, CURRENT_TIMESTAMP)`,
    //       [tableId, link.featureId]
    //     );
    //   }
    // }

    console.log('Database seeded with initial data successfully.');
  } catch (error) {
    console.error('Error initializing schema or seeding database:', error);
  }
}
