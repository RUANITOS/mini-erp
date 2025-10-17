import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { Client } from '../clients/client.entity';
import { Transaction, TransactionKind, TransactionStatus } from '../transactions/transaction.entity';
import { AppDataSource } from '../data-source';

const randomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const seed = async () => {
    const dataSource: DataSource = AppDataSource;
    await dataSource.initialize();

    console.log('Database connected. Seeding data...');

    const userRepo = dataSource.getRepository(User);
    const clientRepo = dataSource.getRepository(Client);
    const transactionRepo = dataSource.getRepository(Transaction);

    // ===== Usuário admin =====
    const existingAdmin = await userRepo.findOne({ where: { email: 'admin@example.com' } });
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('Admin@123', 10);
        const adminUser = userRepo.create({
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'ADMIN',
        });
        await userRepo.save(adminUser);
        console.log('Admin user created.');
    }

    // ===== Clientes fictícios =====
    const clientsData: Partial<Client>[] = [
        { name: 'Empresa A', email: 'contato@empresaA.com', document: '12345678901' },
        { name: 'Empresa B', email: 'contato@empresaB.com', document: '23456789012' },
        { name: 'Empresa C', email: 'contato@empresaC.com', document: '34567890123' },
        { name: 'Empresa D', email: 'contato@empresaD.com', document: '45678901234' },
        { name: 'Empresa E', email: 'contato@empresaE.com', document: '56789012345' },
    ];

    const clients = clientRepo.create(clientsData);
    await clientRepo.save(clients);
    console.log(`${clients.length} clients created.`);

    // ===== Transações =====
    const transactions: Partial<Transaction>[] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 60); // 60 dias atrás

    for (let i = 0; i < 30; i++) { // 30 lançamentos
        const client = clients[Math.floor(Math.random() * clients.length)];
        const kind = Math.random() > 0.5 ? TransactionKind.PAYABLE : TransactionKind.RECEIVABLE;
        const dueDate = randomDate(startDate, today);
        const status = Math.random() > 0.3 ? TransactionStatus.PAID : TransactionStatus.PENDING;
        const paidDate = status === TransactionStatus.PAID ? randomDate(dueDate, today) : undefined;

        transactions.push({
            clientId: client.id,
            description: `${kind} - ${client.name} #${i + 1}`,
            amount: parseFloat((Math.random() * 1000 + 100).toFixed(2)),
            kind,
            status,
            dueDate: dueDate.toISOString().split('T')[0],
            paidDate: paidDate ? paidDate.toISOString().split('T')[0] : undefined,
        });
    }

    await transactionRepo.save(transactions);
    console.log(`${transactions.length} transactions created.`);

    await dataSource.destroy();
    console.log('Seeding complete.');
};

seed().catch((error) => {
    console.error('Error seeding data:', error);
});
