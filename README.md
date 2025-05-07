
# Projeto Laravel - Teste Prático

Este é um projeto desenvolvido como parte de um **teste prático** para avaliação técnica.

A aplicação utiliza o framework **Laravel** e está totalmente preparada para ser executada em containers Docker, facilitando a configuração e execução do ambiente.

---

## 🐳 Pré-requisitos

Antes de iniciar, certifique-se de ter os seguintes softwares instalados na sua máquina:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## ⚙️ Instalação e execução

Siga os passos abaixo para rodar o projeto localmente utilizando Docker:

### 1. Clone o repositório

```bash
git clone https://github.com/Lucas-MSF/digital_wallet.git
cd seu-repositorio
```

### 2. Copie o arquivo `.env.example` para `.env`

```bash
cp .env.example .env
```

### 3. Crie os hosts locais

Adicione as seguintes linhas ao seu arquivo `/etc/hosts`:

```
127.0.0.1 backend
127.0.0.1 frontend
```

> Isso é necessário para que o Nginx consiga rotear corretamente as requisições entre frontend e backend.

### 4. Suba os containers

```bash
docker-compose up -d --build
```

> Isso irá criar e iniciar os containers da aplicação, banco de dados e demais serviços necessários.

### 5. Instale as dependências do Laravel

```bash
docker exec -it backend composer install
```

### 6. Gere a chave da aplicação

```bash
docker exec -it backend php artisan key:generate
```

### 7. Rode as migrations (e seeders se necessário)

```bash
docker exec -it backend php artisan migrate
```

---

## 🌐 Acessando o projeto

Após iniciar os containers, o projeto estará disponível em:

- Backend: http://backend
- Frontend: http://frontend

---


## 📝 Considerações

Este projeto tem como finalidade única demonstrar conhecimento técnico para um teste prático. Para dúvidas, entre em contato.
