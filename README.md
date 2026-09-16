# Preparação do Ambiente e Segurança (Pré-Refatoração)

Antes de iniciar a refatoração do código principal, o repositório passou por um processo de auditoria de segurança e reconfiguração de infraestrutura para seguir as boas práticas de desenvolvimento.

## 1. Correção de Vazamento de Credenciais (Secret Scanning)
Durante o envio inicial dos arquivos, a proteção de push do GitHub (`GitHub Push Protection`) bloqueou o commit devido à exposição de um **Personal Access Token (PAT)** dentro dos scripts `create_issues.py` e `setup_repository.py`.

### Ações de Mitigação:
* **Isolamento de Segredos:** Removi os tokens de dentro do código-fonte.
* **Variáveis de Ambiente:** Armazenei a credencial localmente em um arquivo oculto `.env` sob a chave `GITHUB_TOKEN`.
* **Proteção Oculta:** Adicionei o arquivo `.env` ao `.gitignore` para garantir que senhas locais nunca sejam enviadas ao repositório público.
* **Injeção Dinâmica:** Configurei a biblioteca `python-dotenv` no Python para carregar as credenciais na memória em tempo de execução:
  ```python
  import os
  from dotenv import load_dotenv

  load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))
  GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
  ```

## 2. Resolução de Dependências do Python
O script necessitava de módulos externos que não faziam parte da biblioteca padrão do Python. Foram instaladas com sucesso as dependências:
* `python-dotenv`: Para gerenciamento das variáveis de ambiente.
* `pandas`: Para manipulação e análise dos dados.
* `openpyxl`: Como motor essencial para permitir que o Pandas faça a leitura do arquivo Excel `assignments.xlsx`.
* `requests`: Para comunicação com a API REST do GitHub.

```bash
pip install python-dotenv pandas openpyxl requests
```

## 3. Redirecionamento de Repositório Remoto (Git Workflow)
O ambiente local estava inicialmente configurado para enviar os dados para a organização original do curso (`CinUFPE-2025-IA-EDU`). Para que os scripts pudessem ler e gravar os dados corretamente:
1. Atualizei as constantes `REPO_OWNER` e `REPO_NAME` dentro dos arquivos `.py` para apontarem para minha conta pessoal.
2. Realizei um reset nas configurações locais do Git (`.git`) para limpar referências truncadas de URL (`https://github.com`).
3. Conectei o repositório local ao meu repositório remoto pessoal correto em `https://github.combea21SP/refatora-o.git` via `git remote add origin`.

## 4. Limpeza do Escopo do Projeto (Remoção de Pastas)
Para garantir um ambiente de trabalho focado e evitar o versionamento de arquivos redundantes ou desnecessários para a entrega principal, foi realizada uma limpeza estrutural na árvore de diretórios.

### Ações Realizadas:
* **Identificação de Exclusões:** Mapeamento de pastas acessórias que não faziam parte do núcleo da aplicação ou dos scripts automatizados.
* **Remoção de Arquivos:** Exclusão definitiva das pastas locais redundantes.
* **Sincronização com o Git:** As deleções foram registradas no controle de versão e os metadados foram atualizados no repositório remoto:
  ```bash
  git add .
  git commit -m "Removendo pastas desnecessárias para iniciar a refatoração"
  git push origin main
  ```
# Documentação de Refatoração — Portal Squad B

## Resumo das Melhorias Globais

* **Semântica HTML:** Substituição de `<div>`s genéricas por tags estruturais (`<main>`, `<section>`, `<nav>`, `<article>`).
* **Acessibilidade (A11y):** Adição dos atributos `aria-current`, `aria-label`, `aria-hidden` em elementos decorativos e associação correta entre `<label>` e `<input>`.
* **Padronização:** Tradução de classes, IDs e variáveis CSS para português claro e descritivo.
* **Higienização de Código:** Remoção de `<br>` usados para layout, eliminação de CSS inválido ou redundante e adição de comentários explicativos.
* **Validação:** Todas as páginas foram reestruturadas e validadas sem erros sintáticos de HTML ou CSS.

---

## Detalhamento por Página

### 1. Página Home (`index.html` / `style.css`)
* **Estrutura:** Implementação de `<nav>` e `<section>` para delimitação clara de blocos.
* **Estilização:** Remoção de redundâncias no CSS (duplicação de `margin` no `body` e repetição de regras em `li`).
* **Melhorias:** Adição de responsividade básica e reorganização das folhas de estilo sem alterar os links ou animações originais.

### 2. Página Habilidades (`habilidades.html` / `habilidades.css`)
* **Estrutura:** Troca de `div` por `<article>` e remoção da camada desnecessária `.infos`.
* **Padronização:** Adoção de nomenclatura descritiva (`skill-card--css`) e inclusão do atributo `data-skill`.
* **Correções:** Ajuste da tag `<title>` para "Habilidades - Squad B" e atualização dos seletores CSS.

### 3. Página Depoimentos (`depoimentos.html` / `depoimentos.css`)
* **Nomenclatura:** Tradução de variáveis (`--cor-fundo`, `--cor-principal`) e classes (`.cartao-depoimento`, `.foto-perfil`).
* **Correções:** Solução de fechamento inválido no menu e remoção de quebras de linha manuais (`<br>`) nos textos.
* **Acessibilidade:** Melhoria nos textos alternativos (`alt`) das imagens.

### 4. Página Contato (`contato.html` / `contato.css`)
* **Formulário:** Tradução de campos e grupos (`id="nome"`, `.grupo-formulario`, `.canais-contato`).
* **Layout:** Reorganização estrutural isolando apresentação, canais e formulário.
* **Responsividade:** Atualização dos seletores para garantir boa adaptação em diferentes telas.

### 5. Página Case de Sucesso (`case-de-sucesso.html`)
* **Estrutura:** Modulação das métricas e seções em elementos `<article>` independentes.
* **Correções:** Ajuste de aninhamentos incorretos de elementos e correção de indentação.
* **Acessibilidade:** Ocultação de ícones decorativos para leitores de tela via `aria-hidden`.

### 6. Página Serviços (`servicos.html` / `servicos.css`)
* **Componentização:** Padronização dos serviços em `<article>` utilizando classes compartilhadas.
* **Correções CSS:** Eliminação de valores inválidos (como `gap: -20px` e `padding-bottom: -50px`).
* **Layout:** Aplicação de `flex-wrap` e readequação dos espaçamentos para responsividade.

### 7. Página Sobre (`sobre.html` / `sobre.css`)
* **Estrutura:** Correção de tags `<div>` desbalanceadas e estruturação com `<main>`, `<section>` e `<article>`.
* **Tradução & Bugfix:** Tradução de classes (`.cartao-experiencia`, `.apresentacao-squad`) e remoção do erro de layout `gap: 804px`.
* **Qualidade:** Correção de erros ortográficos no texto e adição de regras de responsividade.

  # Documentação: Assistente Virtual com IA — Squad B

## 1. Visão Geral
Aplicação web interativa desenvolvida para integrar um assistente de IA baseado no Google Gemini ao portal da **Squad B**. A arquitetura utiliza um servidor Node.js como proxy seguro para proteger a chave de API (`GEMINI_API_KEY`).

---

## 2. Arquitetura e Tecnologias

* **Frontend**: HTML5, CSS3 e JavaScript Vanilla (`chat.js`).
* **Backend**: Node.js com Express, CORS e `dotenv`.
* **Serviço de IA**: SDK `@google/genai` (Google Gemini API).
* **Segurança**: Chave de API armazenada exclusivamente no servidor (`.env`).

---

## 3. Estrutura do Projeto

/
├── .env              # Variáveis de ambiente (chave de API)
├── server.js         # Servidor Express (proxy de API e servidor estático)
├── chat.js           # Lógica do frontend e envio de requisições
├── home.html         # Interface do usuário (UI do chat)
└── package.json      # Dependências do projeto Node.js

---

## 4. Resumo do Processo de Desenvolvimento

1. **Configuração Inicial**:
   * Inicialização do projeto (`npm init -y`) e instalação das dependências (`express`, `cors`, `dotenv`, `@google/genai`).
   * Configuração das variáveis de ambiente no arquivo `.env`.

2. **Criação do Servidor (Proxy)**:
   * Implementação da rota `POST /api/chat` no `server.js` para processar chamadas à API Gemini e injetar as instruções de contexto da Squad B.

3. **Interface e Conexão Frontend**:
   * Construção da UI em `home.html` e controle de eventos de envio em `chat.js`.

4. **Resolução de Problemas & Ajustes Finais**:
   * **Conflito de Portas**: Unificação do servidor para a porta `3001`.
   * **Servidor Unificado**: Configuração de `express.static` para servir os arquivos HTML/JS diretamente pelo Node.js, permitindo o uso de rotas relativas (`/api/chat`) e eliminando erros de CORS e parsing de JSON (`Unexpected token '<'`).
   * **Modelo Gemini**: Atualização do identificador do modelo Gemini para a versão ativa no SDK.

---

## 5. Como Executar a Aplicação

1. Certifique-se de preencher a chave no arquivo `.env`:
   ```env
   GEMINI_API_KEY=sua_chave_aqui

---


---
*Pronto! Com o ambiente seguro, dependências instaladas e o versionamento ajustado, o projeto está pronto para a etapa de refatoração.*
