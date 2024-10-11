import { AppDataSource } from './ormconfig';

async function runMigrations() {
    try {
        await AppDataSource.initialize();
        await AppDataSource.runMigrations();
        console.log('Migrations are run successfully!');
    } catch (error) {
        console.error('Error running migrations:', error);
    } finally {
        await AppDataSource.destroy();
    }
}

runMigrations();
