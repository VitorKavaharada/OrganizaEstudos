#  OrganizaEstudos

OrganizaEstudos é uma aplicação web desenvolvida com Node.js que permite gerenciar tarefas de estudo. O projeto segue o padrão **MVC (Model-View-Controller)** e utiliza **Sequelize** para integração com banco de dados MySQL.

---

## Funcionalidades

- Criar, editar e excluir registros de estudo
- Marcar estudos como concluídos
- Visualizar todos os estudos cadastrados
- Interface simples e responsiva com Handlebars

---

## Tecnologias Utilizadas

- **Frontend**: Handlebars, CSS
- **Backend**: 	Node.js (v22.14.0), Express
- **Banco de dados**: MySQL via Apache do XAMPP (MariaDB versão 10.4.32-MariaDB)
	
---

##  Instalação

1. **Antes de iniciar o projeto, certifique-se de que o servidor MySQL/MariaDB está rodando (via XAMPP) e execute:**

```bash
CREATE DATABASE organiza_estudos;
```

2. **Clone o repositório:**

```bash
git clone https://github.com/seu-usuario/organiza-estudos.git
cd organiza-estudos

```
3. **Instale as dependências:**

```bash
npm install

```
4. **Copie o arquivo de exemplo e modifique as credenciais:**

```bash
cp .env.example .env
```

5. **Inicie o servidor:**

```bash
npm start
```

6. Abra o navegador e acesse:

```bash
http://localhost:3000/studies
``` 




