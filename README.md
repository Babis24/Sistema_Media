## Autor
**Bárbara Falcão                RA:2506486**
**Giovanna Falgetano            RA:2512938**
**Glória Mariano                RA:2504112**
**Leonardo dos Santos Costa     RA:2505420**

# 🎓 Sistema de Gerenciamento de Notas de Alunos com TypeScript e PostgreSQL

Este `README` contém todas as informações necessárias para configurar o ambiente, executar a aplicação e entender seu funcionamento.

## 🌟 Visão Geral do Projeto

A aplicação é um script de terminal que interage com o usuário para coletar informações de um aluno, suas notas em três matérias específicas, calcula as médias individuais por matéria e a média geral do aluno, e então armazena todos esses dados em um banco de dados PostgreSQL.

### Funcionalidades Principais:

*   **Coleta de Dados do Aluno:** Solicita nome, série e idade.
*   **Registro de Notas:** Para cada uma das matérias (Matemática, Geografia, História), o sistema pede 8 notas.
*   **Validação de Notas:** Garante que as notas inseridas estejam no intervalo de 0 a 10.
*   **Cálculo de Médias:** Calcula a média para cada matéria individualmente e uma média geral para o aluno.
*   **Persistência de Dados:** Armazena todas as informações do aluno, incluindo as notas detalhadas e as médias, em um banco de dados.

<p align="center">
  <img src="https://github.com/user-attachments/assets/74b13711-87cc-4b2f-9077-c5a6c5478079" alt="Image showcasing the project's purpose and initial instructions." width="700"/>
</p>


## 🛠️ Tecnologias Utilizadas

Para rodar este projeto, você precisará das seguintes ferramentas:

*   **Node.js:** Ambiente de execução JavaScript.
*   **TypeScript:** Linguagem de programação que adiciona tipagem estática ao JavaScript.
*   **Docker:** Para rodar o container do banco de dados PostgreSQL.
*   **PGAdmin (Opcional, mas Recomendado):** Ferramenta gráfica para gerenciar seu banco de dados PostgreSQL.
*   **VS Code (Opcional, mas Recomendado):** Editor de código-fonte.
*   **Git Bash (Opcional, mas Recomendado no Windows):** Terminal Unix-like.

## ⚠️ Aviso de Segurança Importante: Credenciais no Código

No arquivo `index.ts`, as credenciais de conexão com o banco de dados (usuário e senha) estão diretamente no código (prática conhecida como *hardcoding*):

```typescript
const dbConfig = {
    user: 'aluno',
    host: 'localhost',
    database: 'db_trabalho',
    password: '102030', 
    port: 5432,
};
```

## 📦 Estrutura do Projeto

Ao clonar este repositório, você encontrará a seguinte estrutura principal:

```
/ATIVIDADE_MATERIAS
|
|-- /dist/
|   |-- index.js                <-- Versão JavaScript compilada do nosso código.
|
|-- index.ts                    <-- Nosso código-fonte principal em TypeScript.
|
|-- package.json                <-- Manifest do projeto: lista scripts e dependências.
|
|-- package-lock.json           <-- Garante que todos instalem as mesmas versões de dependências.
|
|-- tsconfig.json               <-- Configurações para o compilador TypeScript.
|
|-- .gitignore                  <-- Arquivo que especifica o que o Git deve ignorar (ex: node_modules).
|
|-- README.md                   <-- Este arquivo de documentação.
```

## 🚀 Como Configurar e Executar o Projeto

Siga os passos abaixo para colocar o projeto em funcionamento.

### Pré-requisitos

Certifique-se de ter **Node.js** e **Docker** instalados e configurados em sua máquina.

### Passo 1: Inicializar o Projeto Node.js e Instalar Dependências

Se você está começando o projeto do zero (sem ter clonado um repositório), comece criando um diretório e inicializando um projeto Node.js:

```bash
# Crie e entre no diretório do seu projeto
mkdir ATIVIDADE_MATERIAS
cd ATIVIDADE_MATERIAS

# Inicialize um novo projeto Node.js (cria o package.json)
npm init -y
```

Em seguida, instale as bibliotecas necessárias para o funcionamento da aplicação (`pg` para PostgreSQL e `readline-sync` para interação no terminal) como dependências de produção:

```bash
npm install pg readline-sync
```

E instale o TypeScript e seus respectivos tipos como dependências de desenvolvimento. Os tipos (`@types/...`) são essenciais para que o TypeScript entenda as funcionalidades das bibliotecas JavaScript:

```bash
npm install -D typescript @types/pg @types/readline-sync
```

### Passo 2: Criar o Arquivo de Configuração do TypeScript

Crie o arquivo de configuração do TypeScript (`tsconfig.json`), que define como o compilador TypeScript deve se comportar. Este comando gera um arquivo `tsconfig.json` com configurações padrão que você pode ajustar:

```bash
npx tsc --init
```
**Observação:** O `tsconfig.json` fornecido neste repositório está pré-configurado para este projeto. Se você executou `npx tsc --init`, você pode substituir seu conteúdo pelo `tsconfig.json` no repositório para garantir a compatibilidade e as configurações otimizadas.

### Passo 3: Criar o `.gitignore`

Crie um arquivo chamado `.gitignore` na raiz do seu projeto e adicione as seguintes linhas. Isso garante que arquivos gerados e dependências não sejam incluídos no controle de versão do Git, mantendo seu repositório limpo e leve.

```
# Node
node_modules/
dist/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.env
.DS_Store
```

### Passo 4: Criar o `index.ts`

Crie o arquivo `index.ts` na raiz do seu projeto e cole o código-fonte da aplicação nele. Este é o coração do sistema, que lida com a lógica de negócio, entrada/saída e interação com o banco de dados.

### Passo 5: Iniciar o Container com Docker

Abra seu terminal (Git Bash, PowerShell, ou terminal Linux/macOS) e execute o seguinte comando Docker. 

```bash
docker run -d \
  --name meu-postgres \
  -e POSTGRES_USER=aluno \
  -e POSTGRES_PASSWORD=102030 \
  -e POSTGRES_DB=db_trabalho \
  -p 5432:5432 \
  postgres:latest
```

*   `docker run -d`: Inicia o container em segundo plano (detached mode).
*   `--name meu-postgres`: Atribui o nome `meu-postgres` ao container.
*   `-e POSTGRES_USER=aluno`: Define o usuário do PostgreSQL como `aluno`.
*   `-e POSTGRES_PASSWORD=102030`: Define a senha para o usuário `aluno`.
*   `-e POSTGRES_DB=db_trabalho`: Cria um banco de dados chamado `db_trabalho`.
*   `-p 5432:5432`: Mapeia a porta 5432 do seu host para a porta 5432 do container.
*   `postgres:latest`: Usa a imagem mais recente do PostgreSQL.

### Passo 6: Compilar o Código TypeScript

No terminal, dentro da pasta raiz do projeto (`ATIVIDADE_MATERIAS`), compile o código TypeScript para JavaScript:

```bash
npx tsc
```
Este comando usará o compilador TypeScript (`tsc`) para transformar `index.ts` em `index.js`, que será salvo na pasta `dist/`, conforme configurado em `tsconfig.json`.

### Passo 7: Executar a Aplicação

Finalmente, execute o arquivo JavaScript compilado:

```bash
node dist/index.js
```

A aplicação começará a fazer perguntas no terminal. Responda-as para inserir os dados do aluno e suas notas.

<p align="center">
  <img src="https://github.com/user-attachments/assets/74b13711-87cc-4b2f-9077-c5a6c5478079" alt="Image showcasing the project's purpose and initial instructions." width="700"/>
</p>

### Passo 8: Verificar os Dados no PGAdmin (Opcional)

Após a execução do script e a inserção dos dados, você pode usar o PGAdmin para verificar se os dados foram salvos corretamente:

1.  Abra o PGAdmin.
2.  Conecte-se ao seu servidor PostgreSQL (geralmente `localhost:5432`).
    *   Host: `localhost`
    *   Port: `5432`
    *   Maintenance database: `db_trabalho`
    *   Username: `aluno`
    *   Password: `102030`
3.  Navegue até o banco de dados `db_trabalho`.
4.  Expanda "Schemas" -> "public" -> "Tables".
5.  Clique com o botão direito na tabela `alunos` e selecione "View/Edit Data" -> "All Rows".

Você deverá ver os dados do aluno que você inseriu através do terminal!

<p align="center">
  <img src="https://github.com/user-attachments/assets/74b13711-87cc-4b2f-9077-c5a6c5478079" alt="Image showcasing the project's purpose and initial instructions." width="700"/>
</p>

