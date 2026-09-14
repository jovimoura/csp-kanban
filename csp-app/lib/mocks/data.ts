import type { Task, User } from "@/lib/types";

export const seedUsers: User[] = [
  {
    id: "user-js",
    name: "João Silva",
    email: "joao.silva@csp.tech",
    profile: "developer",
  },
  {
    id: "user-ra",
    name: "Rafael Alves",
    email: "rafael.alves@csp.tech",
    profile: "developer",
  },
  {
    id: "user-ac",
    name: "Ana Costa",
    email: "ana.costa@csp.tech",
    profile: "agile",
  },
  {
    id: "user-mm",
    name: "Marina Mendes",
    email: "marina.mendes@csp.tech",
    profile: "developer",
  },
  {
    id: "user-lg",
    name: "Lucas Gomes",
    email: "lucas.gomes@csp.tech",
    profile: "developer",
  },
  {
    id: "user-lb",
    name: "Luiza Barros",
    email: "luiza.barros@csp.tech",
    profile: "agile",
  },
  {
    id: "user-mr",
    name: "Marcos Ribeiro",
    email: "marcos.ribeiro@csp.tech",
    profile: "developer",
  },
  {
    id: "user-fg",
    name: "Felipe Gomes",
    email: "felipe.gomes@csp.tech",
    profile: "admin",
  },
];

export const seedTasks: Task[] = [
  {
    id: "task-1",
    title: "Implementar tela de login",
    status: "not_started",
    description:
      "Desenvolver a tela de login do sistema seguindo o layout definido no protótipo. A tela deve conter validações de campos, opção de recuperar senha e redirecionamento após autenticação.",
    dueDate: "2025-05-28",
    assignedTo: "user-js",
  },
  {
    id: "task-2",
    title: "Criar relatório de vendas",
    status: "not_started",
    description:
      "Montar o relatório de vendas com filtros por período, responsável e status de fechamento.",
    dueDate: "2025-06-02",
    assignedTo: "user-ac",
  },
  {
    id: "task-3",
    title: "Ajustes no dashboard",
    status: "not_started",
    description:
      "Corrigir cards e indicadores do dashboard para refletir os dados mais recentes das demandas.",
    dueDate: "2025-06-05",
    assignedTo: "user-mm",
  },
  {
    id: "task-4",
    title: "Integração com API externa",
    status: "not_started",
    description:
      "Integrar o sistema com a API externa de cadastros, incluindo tratamento de erros e retry.",
    dueDate: "2025-08-18",
    assignedTo: "user-lg",
  },
  {
    id: "task-5",
    title: "Desenvolver módulo de users",
    status: "in_progress",
    description:
      "Implementar listagem, cadastro e edição de usuários com os perfis Admin, Developer e Agile.",
    dueDate: "2025-05-26",
    assignedTo: "user-ra",
  },
  {
    id: "task-6",
    title: "Correção de bugs",
    status: "in_progress",
    description:
      "Corrigir bugs reportados no quadro kanban, incluindo filtros e atualização de status.",
    dueDate: "2025-05-30",
    assignedTo: "user-js",
  },
  {
    id: "task-7",
    title: "Melhorias na performance",
    status: "in_progress",
    description:
      "Otimizar carregamento do quadro e reduzir re-renders durante a movimentação dos cards.",
    dueDate: "2025-06-03",
    assignedTo: "user-ac",
  },
  {
    id: "task-8",
    title: "Homologar integração",
    status: "paused",
    description:
      "Validar a integração com o ambiente de homologação e documentar os cenários de teste.",
    dueDate: "2025-05-28",
    assignedTo: "user-lb",
  },
  {
    id: "task-9",
    title: "Homologar fluxo de cadastro",
    status: "homolog",
    description:
      "Homologar o fluxo de cadastro de demandas, conferindo validações e permissões de perfil.",
    dueDate: "2025-05-27",
    assignedTo: "user-mr",
  },
  {
    id: "task-10",
    title: "Módulo de autenticação",
    status: "prod",
    description:
      "Módulo de autenticação já publicado em produção, com sessão persistente e recuperação de senha.",
    dueDate: "2025-05-20",
    assignedTo: "user-ra",
  },
  {
    id: "task-11",
    title: "Nova home institucional",
    status: "prod",
    description:
      "Página inicial institucional publicada em produção com a identidade visual da CSP Tech.",
    dueDate: "2025-05-22",
    assignedTo: "user-js",
  },
];
