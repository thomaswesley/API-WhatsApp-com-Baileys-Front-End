# 💬 Front-end – Chat React da Charlene (Gordice Pizzaria)

Interface web do atendimento automatizado da **Charlene**, a atendente virtual da Gordice Pizzaria. Essa aplicação em React permite que os usuários conversem em tempo real com a IA, que segue regras específicas do cardápio da pizzaria.

---

## 📦 Tecnologias Utilizadas

- **React JS**
- **WebSocket** (Socket.io)

---

## 💻 Funcionalidades

- Interface de chat em tempo real
- Integração com IA via WebSocket e API REST
- Exibição do histórico de conversa
- Respostas automáticas com linguagem simpática e contextual

---

## 🔌 Comunicação com o Back-end

O front-end se conecta com o back-end da Charlene através de:

- **WebSocket** para mensagens em tempo real
  - `message-saved`: confirma mensagem do usuário
  - `bot-response`: resposta gerada pela IA
- **API REST** para recuperação do histórico
  - `GET /messages`: obtém todas as mensagens já trocadas

> O back-end é implementado em Node + Express e pode ser acessado em: [https://github.com/thomaswesley/chat-api-node](https://github.com/thomaswesley/chat-api-node)

---

## 🧾 Exemplo de Conversa

1. Usuário envia: `Quero uma pizza calabresa`
2. A IA responde: `Ótima escolha! Deseja uma bebida para acompanhar?`
3. Após confirmação da bebida, a IA oferece sobremesa.

---

## ⚙️ Como Executar Localmente

```bash
# Clone o repositório
git clone https://github.com/thomaswesley/chat-react
cd chat-react

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o projeto
npm run dev
```

---

## 📄 Variáveis de Ambiente

Exemplo de `.env`:

```env
NEXT_PUBLIC_APP_CHAT_NODE=http://localhost:3001
```

> Certifique-se de que o back-end esteja rodando localmente.

---

## 🔗 Projeto Completo

- Back-end: [https://github.com/thomaswesley/chat-api-node](https://github.com/thomaswesley/chat-api-node)
- Front-end: [https://github.com/thomaswesley/chat-react](https://github.com/thomaswesley/chat-react)
- Demo: [https://charlene.ia.thomaswesleysoftware.com.br/en/apps/chat](https://charlene.ia.thomaswesleysoftware.com.br/en/apps/chat)

---

Feito com ❤️ por [Thomas Wesley](https://github.com/thomaswesley)
