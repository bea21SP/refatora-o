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

## 🗑️ 4. Limpeza do Escopo do Projeto (Remoção de Pastas)
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

---


---
*Pronto! Com o ambiente seguro, dependências instaladas e o versionamento ajustado, o projeto está pronto para a etapa de refatoração.*
