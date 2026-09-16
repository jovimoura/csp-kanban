import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { asc, eq } from 'drizzle-orm';
import { db } from '../db';
import { tasksTable, usersTable } from '../db/schema';
import { authenticate } from '../lib/authHook';
import { getAuthUser } from '../lib/getAuthUser';
import {
  badRequest,
  created,
  forbidden,
  notFound,
  ok,
  unauthorized,
} from '../lib/http';
import { can } from '../lib/permissions';
import { serializeTask } from '../lib/serializers';

const statusEnum = z.enum(['not_started', 'in_progress', 'paused', 'homolog', 'prod']);
const dueDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Prazo inválido.');

const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'O título é obrigatório.'),
  description: z.string().trim().min(1, 'A descrição é obrigatória.'),
  dueDate: dueDateSchema,
  assignedTo: z.string().uuid('Responsável inválido.'),
  status: statusEnum.optional(),
});

const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    description: z.string().trim().min(1).optional(),
    dueDate: dueDateSchema.optional(),
    assignedTo: z.string().uuid().optional(),
    status: statusEnum.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Nenhum campo para atualizar.',
  });

const paramsSchema = z.object({ id: z.string().uuid() });

function parseDueDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

export async function tasksRoutes(app: FastifyInstance) {
  app.get('/tasks', { preHandler: authenticate }, async (request, reply) => {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      const response = unauthorized({ error: 'User not found.' });
      return reply.status(response.statusCode).send(response.body);
    }

    const rows = await db.select().from(tasksTable).orderBy(asc(tasksTable.dueDate));

    const response = ok({ tasks: rows.map(serializeTask) });
    return reply.status(response.statusCode).send(response.body);
  });

  app.post('/tasks', { preHandler: authenticate }, async (request, reply) => {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      const response = unauthorized({ error: 'User not found.' });
      return reply.status(response.statusCode).send(response.body);
    }

    if (!can(authUser.profile, 'createTask')) {
      const response = forbidden({ error: 'You are not allowed to create tasks.' });
      return reply.status(response.statusCode).send(response.body);
    }

    const { success, error, data } = createTaskSchema.safeParse(request.body);

    if (!success) {
      const response = badRequest({ errors: error.issues });
      return reply.status(response.statusCode).send(response.body);
    }

    const [assignee] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.id, data.assignedTo))
      .limit(1);

    if (!assignee) {
      const response = badRequest({ error: 'Responsável não encontrado.' });
      return reply.status(response.statusCode).send(response.body);
    }

    const [task] = await db
      .insert(tasksTable)
      .values({
        title: data.title,
        description: data.description,
        dueDate: parseDueDate(data.dueDate),
        assignedTo: data.assignedTo,
        status: data.status ?? 'not_started',
      })
      .returning();

    const response = created({ task: serializeTask(task!) });
    return reply.status(response.statusCode).send(response.body);
  });

  app.patch('/tasks/:id', { preHandler: authenticate }, async (request, reply) => {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      const response = unauthorized({ error: 'User not found.' });
      return reply.status(response.statusCode).send(response.body);
    }

    if (!can(authUser.profile, 'editTask')) {
      const response = forbidden({ error: 'You are not allowed to edit tasks.' });
      return reply.status(response.statusCode).send(response.body);
    }

    const params = paramsSchema.safeParse(request.params);
    if (!params.success) {
      const response = badRequest({ errors: params.error.issues });
      return reply.status(response.statusCode).send(response.body);
    }

    const body = updateTaskSchema.safeParse(request.body);
    if (!body.success) {
      const response = badRequest({ errors: body.error.issues });
      return reply.status(response.statusCode).send(response.body);
    }

    const [task] = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.id, params.data.id))
      .limit(1);

    if (!task) {
      const response = notFound({ error: 'Demanda não encontrada.' });
      return reply.status(response.statusCode).send(response.body);
    }

    // Tasks already in production cannot change status.
    if (
      task.status === 'prod' &&
      body.data.status !== undefined &&
      body.data.status !== 'prod'
    ) {
      const response = forbidden({
        error: 'Demandas em produção não podem mudar de status.',
      });
      return reply.status(response.statusCode).send(response.body);
    }

    const [updated] = await db
      .update(tasksTable)
      .set({
        ...(body.data.title !== undefined ? { title: body.data.title } : {}),
        ...(body.data.description !== undefined
          ? { description: body.data.description }
          : {}),
        ...(body.data.dueDate !== undefined
          ? { dueDate: parseDueDate(body.data.dueDate) }
          : {}),
        ...(body.data.assignedTo !== undefined
          ? { assignedTo: body.data.assignedTo }
          : {}),
        ...(body.data.status !== undefined ? { status: body.data.status } : {}),
        updatedAt: new Date(),
      })
      .where(eq(tasksTable.id, params.data.id))
      .returning();

    const response = ok({ task: serializeTask(updated!) });
    return reply.status(response.statusCode).send(response.body);
  });

  app.delete('/tasks/:id', { preHandler: authenticate }, async (request, reply) => {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      const response = unauthorized({ error: 'User not found.' });
      return reply.status(response.statusCode).send(response.body);
    }

    if (!can(authUser.profile, 'deleteTask')) {
      const response = forbidden({ error: 'You are not allowed to delete tasks.' });
      return reply.status(response.statusCode).send(response.body);
    }

    const params = paramsSchema.safeParse(request.params);
    if (!params.success) {
      const response = badRequest({ errors: params.error.issues });
      return reply.status(response.statusCode).send(response.body);
    }

    const [deleted] = await db
      .delete(tasksTable)
      .where(eq(tasksTable.id, params.data.id))
      .returning({ id: tasksTable.id });

    if (!deleted) {
      const response = notFound({ error: 'Demanda não encontrada.' });
      return reply.status(response.statusCode).send(response.body);
    }

    const response = ok({ id: deleted.id });
    return reply.status(response.statusCode).send(response.body);
  });
}
