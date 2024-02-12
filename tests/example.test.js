import supertest from 'supertest';
import {server} from '../src/server.js';
const request = supertest(server);

let testUserId;

describe('API Tests', () => {
  it('GET /api/users - should return an array of users', async () => {
    const response = await request.get('/api/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it('POST /api/users - should create a new user', async () => {
    const newUser = { username: 'testUser', age: 25, hobbies: ['reading', 'gaming'] };
    const response = await request.post('/api/users').send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    testUserId = response.body.id; // Сохраняем ID для последующих тестов
  });

  it('GET /api/users/:id - should return a user by id', async () => {
    const response = await request.get(`/api/users/${testUserId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', testUserId);
  });

  it('PUT /api/users/:id - should update a user', async () => {
    const updatedUser = { username: 'updatedUser', age: 26, hobbies: ['coding'] };
    const response = await request.put(`/api/users/${testUserId}`).send(updatedUser);
    expect(response.status).toBe(200);
    expect(response.body.username).toEqual('updatedUser');
  });

  it('DELETE /api/users/:id - should delete a user', async () => {
    const response = await request.delete(`/api/users/${testUserId}`);
    expect(response.status).toBe(204);
  });

  it('GET /api/users/:id - should return 404 after user deletion', async () => {
    const response = await request.get(`/api/users/${testUserId}`);
    expect(response.status).toBe(404);
  });
});
