# Zip File

A decisão de criar esse programa foi para exercer conhecimento no curso [java-curso-completo](https://www.udemy.com/course/java-curso-completo/learn/lecture/10852516#content), onde aprendi conceitos básicos e avançados de POO.
> O programa é um serviço para zipar arquivos e deletar os aqruivos que já foram zipados.
> A inteção do programa é prevenir grande quantidades de arquivos "lixos".

E meio a decisão de fazer este programa tive que aprender como a manipular arquivos, pastas, sistema operacional e zipar no nodejs.
____
### Referências:
* [W3 schools - Nodejs File System](https://www.w3schools.com/nodejs/nodejs_filesystem.asp)
* [W3 schools - Nodejs Path](https://www.w3schools.com/nodejs/nodejs_path.asp)
* [W3 schools - Nodejs OS](https://www.w3schools.com/nodejs/nodejs_os.asp)
* [W3 schools - Nodejs Streams](https://www.w3schools.com/nodejs/nodejs_streams.asp)
* [Archiver](https://www.archiverjs.com/docs/quickstart/)
* [winston](https://www.npmjs.com/package/winston)

### Pré-requisitos:
* Node: v24.14.0
* Pnpm: 10.30.3
___
### Instruções de Instalação e Execução:
```bash
# Clone este repositório
$ git clone https://github.com/Solrac23/zip-files.git

# Acesse a pasta do projeto no terminal/cmd
$ cd zip-files

# Instale as dependências
$ pnpm install

# Execute a aplicação em modo de desenvolvimento
$ pnpm dev

# (Opcional) Gere e execute o build compilado
$ pnpm build
$ pnpm start
```

### Como configurar as pastas para criar o zip

Para definir em quais pastas o programa vai atuar (zipando os arquivos antigos), você deve configurar o arquivo principal `src/app.ts` dentro da função `main()`. 

Você deve adicionar os caminhos desejados ao `pathRegistry`. O programa utiliza a classe `OsType` para obter o `osHomedir` (diretório raiz do usuário) e a classe `PathService` para unir caminhos de forma segura em diferentes sistemas operacionais.

Abra o arquivo [`src/app.ts`](./src/app.ts) e modifique a seção de "Configuração inicial de Estado" com as suas pastas:

```typescript
// Configuração inicial de Estado
const osHomedir = osType.getOsHomedir(); // Pega o usuário do sistema, ex: "C:\Users\User" ou "/home/user"

// Exemplo 1: Adicionando a pasta Downloads a partir do Home do Usuário
const downloadsAbsolutePath = pathService.safeJoin([osHomedir, 'Downloads']);
pathRegistry.addPathFile(new PathFile(downloadsAbsolutePath));

// Exemplo 2: Adicionando a pasta Documents a partir do Home do Usuário
const documentsAbsolutePath = pathService.safeJoin([osHomedir, 'Documents']);
pathRegistry.addPathFile(new PathFile(documentsAbsolutePath));

// Exemplo 3: Utilizando um caminho absoluto (completo) diretamente
const programFilesAbsolutePath = '/Documents/meus arquivos/PROGRAMAS';
pathRegistry.addPathFile(new PathFile(programFilesAbsolutePath));
```

**Resumo passo a passo:**
1. Crie uma variável que represente o caminho absoluto usando `pathService.safeJoin([osHomedir, 'NOME_DA_SUA_PASTA'])` ou inserindo a string do caminho absoluto diretamente (ex: `C:\\Usuarios\\Carlos\\MinhaPasta`).
2. Instancie um objeto `PathFile` com a variável criada.
3. Chame o método `pathRegistry.addPathFile()` passando essa instância.

Feito isso, ao iniciar a aplicação (`pnpm dev` ou `pnpm start`), os diretórios escolhidos serão processados e os arquivos compactados conforme a lógica estabelecida no serviço.

___
### 🛠 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)

## Autor:
* [Carlos Eduardo](https://github.com/Solrac23)
