import { db } from './client';
import { tasksTable, usersTable } from './schema';
import { emailFromName } from '../lib/emailFromName';

type SeedUser = {
  name: string;
  profile: 'admin' | 'developer' | 'agile';
};

type SeedTask = {
  title: string;
  status: 'not_started' | 'in_progress' | 'paused' | 'homolog' | 'prod';
  description: string;
  dueDate: string;
  assignee: string; // user name
};

const seedUsers: SeedUser[] = [
  { name: 'Felipe Gomes', profile: 'admin' },
  { name: 'Ana Costa', profile: 'agile' },
  { name: 'Luiza Barros', profile: 'agile' },
  { name: 'João Silva', profile: 'developer' },
  { name: 'Rafael Alves', profile: 'developer' },
  { name: 'Marina Mendes', profile: 'developer' },
  { name: 'Lucas Gomes', profile: 'developer' },
  { name: 'Marcos Ribeiro', profile: 'developer' },
];

const seedTasks: SeedTask[] = [
  {
    title: 'Implementar tela de login',
    status: 'not_started',
    description:
      'Desenvolver a tela de login do sistema seguindo o layout definido no protótipo, com validações de campos e redirecionamento após autenticação.',
    dueDate: '2026-05-28',
    assignee: 'João Silva',
  },
  {
    title: 'Criar relatório de vendas',
    status: 'not_started',
    description:
      'Montar o relatório de vendas com filtros por período, responsável e status de fechamento.',
    dueDate: '2026-06-02',
    assignee: 'Ana Costa',
  },
  {
    title: 'Ajustes no dashboard',
    status: 'not_started',
    description:
      'Corrigir cards e indicadores do dashboard para refletir os dados mais recentes das demandas.',
    dueDate: '2026-06-05',
    assignee: 'Marina Mendes',
  },
  {
    title: 'Integração com API externa',
    status: 'not_started',
    description:
      'Integrar o sistema com a API externa de cadastros, incluindo tratamento de erros e retry.',
    dueDate: '2026-08-18',
    assignee: 'Lucas Gomes',
  },
  {
    title: 'Desenvolver módulo de usuários',
    status: 'in_progress',
    description:
      'Implementar listagem, cadastro e edição de usuários com os perfis Administrador, Desenvolvedor e Agilista.',
    dueDate: '2026-05-26',
    assignee: 'Rafael Alves',
  },
  {
    title: 'Correção de bugs',
    status: 'in_progress',
    description:
      'Corrigir bugs reportados no quadro kanban, incluindo filtros e atualização de status.',
    dueDate: '2026-05-30',
    assignee: 'João Silva',
  },
  {
    title: 'Melhorias na performance',
    status: 'in_progress',
    description:
      'Otimizar carregamento do quadro e reduzir re-renders durante a movimentação dos cards.',
    dueDate: '2026-06-03',
    assignee: 'Ana Costa',
  },
  {
    title: 'Homologar integração',
    status: 'paused',
    description:
      'Validar a integração com o ambiente de homologação e documentar os cenários de teste.',
    dueDate: '2026-05-28',
    assignee: 'Luiza Barros',
  },
  {
    title: 'Homologar fluxo de cadastro',
    status: 'homolog',
    description:
      'Homologar o fluxo de cadastro de demandas, conferindo validações e permissões de perfil.',
    dueDate: '2026-05-27',
    assignee: 'Marcos Ribeiro',
  },
  {
    title: 'Módulo de autenticação',
    status: 'prod',
    description:
      'Módulo de autenticação publicado em produção, com sessão persistente durante toda a sessão do usuário.',
    dueDate: '2026-05-20',
    assignee: 'Rafael Alves',
  },
  {
    title: 'Nova home institucional',
    status: 'prod',
    description:
      'Página inicial institucional publicada em produção com a identidade visual da CSP Tech.',
    dueDate: '2026-05-22',
    assignee: 'João Silva',
  },
];

async function seed() {
  console.log('Clearing existing data...');
  await db.delete(tasksTable);
  await db.delete(usersTable);

  console.log('Seeding users...');
  const insertedUsers = await db
    .insert(usersTable)
    .values(
      seedUsers.map((user) => ({
        name: user.name,
        email: emailFromName(user.name),
        profile: user.profile,
      })),
    )
    .returning();

  const userIdByName = new Map(insertedUsers.map((user) => [user.name, user.id]));

  console.log('Seeding tasks...');
  await db.insert(tasksTable).values(
    seedTasks.map((task) => {
      const assignedTo = userIdByName.get(task.assignee);
      if (!assignedTo) {
        throw new Error(`Seed assignee not found: ${task.assignee}`);
      }
      return {
        title: task.title,
        status: task.status,
        description: task.description,
        dueDate: new Date(`${task.dueDate}T00:00:00.000Z`),
        assignedTo,
      };
    }),
  );

  console.log(`Seed complete: ${insertedUsers.length} users, ${seedTasks.length} tasks.`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
