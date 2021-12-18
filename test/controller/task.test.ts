import { close, createApp, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/web';
import { Application } from 'egg';

describe('test/controller/task.test.ts', () => {
  let app: Application;

  beforeAll(async () => {
    // create app
    app = await createApp<Framework>();
  });

  afterAll(async () => {
    await close(app);
  });

  it('should add a task and update task content then delete the task', async () => {
    const addResult = await createHttpRequest(app)
      .post('/api/tasks')
      .send({ content: 'learn English' });

    expect(addResult.status).toBe(201);
    expect(addResult.body.content).toBe('learn English');

    const patchResult = await createHttpRequest(app)
      .patch(`/api/tasks/${addResult.body.id}`)
      .send({ content: 'learn Chinese' });

    expect(patchResult.status).toBe(200);
    expect(patchResult.body.content).toBe('learn Chinese');

    const result = await createHttpRequest(app).delete(
      `/api/tasks/${addResult.body.id}`
    );

    expect(result.status).toBe(204);
  });

  it('should throw 404 error when delete the task not exist', async () => {
    const result = await createHttpRequest(app).delete('/api/tasks/10000');

    expect(result.status).toBe(404);
  });

  it('should add a task and close then reOpen', async () => {
    const addResult = await createHttpRequest(app)
      .post('/api/tasks')
      .send({ content: 'learn English' });

    expect(addResult.status).toBe(201);
    expect(addResult.body.content).toBe('learn English');
    expect(addResult.body.completed).toBe(false);

    const result = await createHttpRequest(app).post(
      `/api/tasks/${addResult.body.id}/close`
    );

    expect(result.status).toBe(200);
    expect(result.body.completed).toBe(true);

    const reOpenResult = await createHttpRequest(app).post(
      `/api/tasks/${addResult.body.id}/reopen`
    );

    expect(reOpenResult.status).toBe(200);
    expect(reOpenResult.body.completed).toBe(false);
  });

  it('should remove-closed-tasks and get zero count of tasks', async () => {
    const addResult = await createHttpRequest(app)
      .post('/api/tasks')
      .send({ content: 'learn English 101' });

    expect(addResult.status).toBe(201);
    expect(addResult.body.content).toBe('learn English 101');

    const completeResult = await createHttpRequest(app).post(
      `/api/tasks/${addResult.body.id}/close`
    );

    expect(completeResult.status).toBe(200);
    expect(completeResult.body.completed).toBe(true);

    const result = await createHttpRequest(app).post(
      '/api/tasks/remove-closed-tasks'
    );

    expect(result.status).toBe(204);

    const taskResult = await createHttpRequest(app).get('/api/tasks');

    expect(taskResult.status).toBe(200);
    expect(taskResult.body.filter(task => task.completed)).toStrictEqual([]);
  });
});
