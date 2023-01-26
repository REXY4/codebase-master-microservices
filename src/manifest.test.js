const request = require('supertest');
const Manifest = require('./manifest');

describe('Test example', () => {
  beforeAll(async () => {
    this.manifest = new Manifest()

    await this.manifest.setup();

    this.expressApp = this.manifest.server.app;
  });

  afterAll(async () => {
    if (this.manifest.redis) {
      this.manifest.redis.disconnect()
    }
  });

  test('GET /api/v1/healthcheck', (done) => {
    request(this.expressApp)
      .get('/api/v1/healthcheck')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        // res.body.data.forEach(d => console.log(d))
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});
