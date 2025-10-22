"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg"); // Importa a classe Client do módulo pg para interagir com PostgreSQL
const readlineSync = __importStar(require("readline-sync")); // Importa o módulo readline-sync para coletar entrada do usuário no terminal
// Configurações de conexão com o banco de dados PostgreSQL.
// ATENÇÃO: Em um ambiente de produção, credenciais como essas devem ser gerenciadas
// por variáveis de ambiente (e.g., com arquivos .env e a biblioteca 'dotenv') para segurança.
const dbConfig = {
    user: 'aluno', // Nome de usuário para conectar ao banco de dados
    host: 'localhost', // Endereço do host onde o banco de dados está rodando (o container Docker)
    database: 'db_trabalho', // Nome do banco de dados a ser utilizado, conforme solicitado na atividade
    password: '102030', // Senha do usuário do banco de dados
    port: 5432, // Porta em que o PostgreSQL está escutando
};
/**
 * Função principal assíncrona que coordena a execução do programa.
 */
async function main() {
    // Cria uma nova instância do cliente PostgreSQL com as configurações definidas.
    const client = new pg_1.Client(dbConfig);
    try {
        // Tenta conectar ao banco de dados.
        await client.connect();
        console.log('Conectado ao banco de dados PostgreSQL.');
        // 1. Criar a tabela 'alunos' se ela ainda não existir.
        // Esta query SQL define a estrutura da tabela 'alunos'.
        // - id: Chave primária auto-incrementável para identificar cada aluno de forma única.
        // - nome, serie, idade: Campos básicos para os dados do aluno.
        // - materias: Campo do tipo JSONB para armazenar um objeto complexo de matérias,
        //   incluindo notas e a média individual de cada matéria.
        // - media_geral: Campo numérico para armazenar a média de todas as matérias do aluno,
        //   com precisão de 5 dígitos no total e 2 após a vírgula.
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS alunos (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                serie VARCHAR(50) NOT NULL,
                idade INTEGER NOT NULL,
                materias JSONB NOT NULL,
                media_geral NUMERIC(5, 2) NOT NULL
            );
        `;
        await client.query(createTableQuery); // Executa a query para criar a tabela.
        console.log('Tabela "alunos" verificada/criada com sucesso.');
        // 2. Coletar dados do aluno através de perguntas no terminal.
        const nome = readlineSync.question('Nome do aluno: ');
        const serie = readlineSync.question('Série do aluno: ');
        const idade = readlineSync.questionInt('Idade do aluno: '); // Pede um número inteiro para a idade
        // Define as matérias que serão avaliadas.
        const materias = ['Matematica', 'Geografia', 'Historia'];
        const notasPorMateria = {}; // Objeto para armazenar as notas de cada matéria
        const mediasPorMateria = {}; // Objeto para armazenar as médias de cada matéria
        let somaTotalDasMedias = 0; // Variável para acumular a soma das médias de todas as matérias
        // Loop para coletar as notas de cada matéria.
        for (const materia of materias) {
            console.log(`\n--- Notas de ${materia} ---`);
            const notas = []; // Array para armazenar as 8 notas da matéria atual
            let somaNotasMateria = 0; // Variável para somar as notas da matéria atual
            // Loop para coletar 8 notas para a matéria atual.
            for (let i = 1; i <= 8; i++) {
                let notaValida = false;
                let nota;
                // Loop para garantir que a nota inserida seja válida (entre 0 e 10).
                while (!notaValida) {
                    nota = readlineSync.questionFloat(`Nota da prova ${i} para ${materia} (0-10): `);
                    if (nota >= 0 && nota <= 10) {
                        notas.push(nota);
                        somaNotasMateria += nota;
                        notaValida = true;
                    }
                    else {
                        console.log('Nota inválida. Digite um valor entre 0 e 10.');
                    }
                }
            }
            notasPorMateria[materia] = notas; // Armazena as notas coletadas
            const mediaMateria = somaNotasMateria / 8; // Calcula a média da matéria
            mediasPorMateria[materia] = parseFloat(mediaMateria.toFixed(2)); // Arredonda e armazena a média
            somaTotalDasMedias += mediaMateria; // Adiciona a média da matéria à soma total
        }
        // Calcula a média geral do aluno dividindo a soma total das médias pelo número de matérias.
        const mediaGeral = parseFloat((somaTotalDasMedias / materias.length).toFixed(2));
        // Estrutura os dados das matérias (nome, notas e média) em um formato adequado para JSONB.
        const materiasComMedias = materias.map(materia => ({
            nome: materia,
            notas: notasPorMateria[materia],
            media: mediasPorMateria[materia]
        }));
        // 3. Inserir dados do aluno no banco de dados.
        // A query SQL INSERT INTO utiliza placeholders ($1, $2, etc.) para evitar injeção SQL
        // e garantir que os valores sejam tratados corretamente.
        const insertQuery = `
            INSERT INTO alunos (nome, serie, idade, materias, media_geral)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id; -- Retorna o ID gerado para o novo aluno
        `;
        // Os valores são passados como um array, correspondendo aos placeholders na query.
        // JSON.stringify() é usado para converter o objeto 'materiasComMedias' em uma string JSON,
        // que é o formato esperado para o campo JSONB.
        const values = [nome, serie, idade, JSON.stringify(materiasComMedias), mediaGeral];
        // Executa a query de inserção.
        const res = await client.query(insertQuery, values);
        console.log(`\nDados do aluno "${nome}" inseridos com sucesso! ID: ${res.rows[0].id}`);
        console.log('Média Geral do aluno:', mediaGeral);
    }
    catch (err) {
        // Captura e exibe qualquer erro que ocorra durante a execução.
        console.error('Erro ao executar o programa:', err);
    }
    finally {
        // Garante que a conexão com o banco de dados seja sempre encerrada,
        // independentemente de ter ocorrido um erro ou não.
        await client.end();
        console.log('Conexão com o banco de dados encerrada.');
    }
}
// Inicia a execução da função principal.
main();
