## 🚀 Como executar a aplicação

### Pré-requisitos

- [Docker](https://www.docker.com/) instalado
- [docker compose](https://github.com/docker/compose) instalado

### Clonar o repositório e construir e rodar com docker compose

#### 1. Clone o repositório:
```bash
git clone git@github.com:denion465/transactions-guard.git
```
Entre na pasta do projeto:
```bash
cd transactions-guard
```
#### 2. Execute com docker compose:
```bash
docker compose up
```
ou se preferir com modo detach

```bash
docker compose up -d
```
Pronto! A aplicação estará acessível em http://localhost:4173

## 📑 Documentação
Documentação utilizando Swagger, você só precisa acessar a rota http://localhost:3000/api#/ ao rodar o projeto que toda documentação vai estar disponível para você.


## Tecnologias Utilizadas
* **Frontend**: Desenvolvido com React e componentes do https://ant.design/

* **Backend**: Implementado com NestJS, um framework Node.js para construção de aplicações server-side, e Prisma para lidar com o banco de dados PostgreSQL, garantindo eficiência e segurança nos dados.

* Todo o backend foi construido com teste unitários, utilizando o Jest.


## 📌 Observação
- Certifique-se de que a porta 4173 está disponível no seu sistema para evitar conflitos.

---
