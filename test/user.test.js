let app = require("../src/app");
let supertest = require("supertest");
let request = supertest(app);

let mainUser = { name: "Test User", email: "test@test.com", password: "abc123" };

beforeAll(() => {
  return request.post("/user")
    .send(mainUser)
    .then(res => { })
    .catch(err => { throw new Error(err) });
});

afterAll(() => {
  return request.delete(`/user/${mainUser.email}`)
    .then(res => { })
    .catch(err => { throw new Error(err) });
});

describe("Cadastro de usuário", () => {
  test("Deve cadastrar um usuário com sucesso", () => {
    let time = Date.now();
    let email = `${time}@gmail.com`;
    let user = { name: "Test", email, password: "abc123" };
    return request.post("/user")
      .send(user)
      .then(res => {
        expect(res.statusCode).toEqual(200);
        expect(res.body.email).toEqual(email);
      })
      .catch(err => { throw new Error(err) });
  });

  test("Deve impedir que um usuário se cadastre com os dados vazios", () => {
    let user = { name: "", email: "", password: "" };
    return request.post("/user")
      .send(user)
      .then(res => {
        expect(res.statusCode).toEqual(400);
      })
      .catch(err => { throw new Error(err) });
  });

  test("Deve impedir que um usuário se cadastre com um email repetido", () => {
    let time = Date.now();
    let email = `${time}@gmail.com`;
    let user = { name: "Test", email, password: "abc123" };
    return request.post("/user").send(user).then(res => {
      expect(res.statusCode).toEqual(200);
      expect(res.body.email).toEqual(email);
      return request.post("/user").send(user).then(res => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual("Email já cadastrado");
      }).catch(err => {
        throw new Error(err);
      });
    }).catch(err => {
      throw new Error(err);
    });
  });
});

describe("Autenticação", () => {
  test("Deve me retornar um token quando logar", () => {
    return request.post("/auth")
      .send({ email: mainUser.email, password: mainUser.password })
      .then(res => {
        expect(res.statusCode).toEqual(200);
        expect(res.body.token).toBeDefined();
      })
      .catch(err => { throw new Error(err) });
  });
});