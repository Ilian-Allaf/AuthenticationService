import { PrismaClient } from '@prisma/client';
import schedule from 'node-schedule';


async function executeSqlFunction(): Promise<void> {
    const client = new PrismaClient(
      {log: ['query', 'info', 'warn'],}

    );
    try {
      const sessionLifeTime = process.env.SESSION_LIFE_TIME;

      // Validate SESSION_LIFE_TIME
      if (!sessionLifeTime || isNaN(Number(sessionLifeTime))) {
          throw new Error('Invalid SESSION_LIFE_TIME');
      };

      const intervalExpression = `INTERVAL '1 hour' - INTERVAL '${sessionLifeTime} hours'`;
      const result = await client.$executeRawUnsafe(`DELETE FROM auth.session WHERE created_at < NOW() + ${intervalExpression};`);

      console.log('SQL Function executed successfully:', result);
      await client.$disconnect();
      
    } catch (error) {
      await client.$disconnect();
      console.error('Error executing SQL function:', error);
    };
};

export default async function startScheduler() {
  schedule.scheduleJob('0 2 * * *', async () => {
      console.log('Executing scheduled job...');
      await executeSqlFunction();
  });
};
