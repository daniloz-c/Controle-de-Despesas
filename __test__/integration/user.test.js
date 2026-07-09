import {describe, test, expect} from '@jest/global';
const {describe, test, expect} = require('@jest/globals');
const ControllerUser = require("\src\controllers\UserController.js");

describe('Teste de Integração - Usuário', async () => {
    test("Buscar um usuário", () => {
        const nome = "joao"
        const email = "batata@test.com"
        const senha = "123456"
        const ativo = true

        const user = await ControllerUser.store(nome, email, senha, ativo)
        console.log(user)
    })
})