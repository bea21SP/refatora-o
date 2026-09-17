function createChatMarkup() {
    const chat = document.createElement('div');
    chat.id = 'squad-b-chat';
    chat.className = 'chat-container is-minimized';
    chat.innerHTML = `
        <div class="chat-header">
            <h3>Assistente Squad B</h3>
            <span class="status-dot" aria-label="Assistente online"></span>
        </div>
        <div id="chat-messages" class="chat-messages">
            <div class="message bot-message">
                Ola! Sou o assistente virtual da Squad B. Como posso ajudar voce hoje?
            </div>
        </div>
        <div class="chat-input-area">
            <input type="text" id="user-input" placeholder="Digite sua duvida..." />
            <button id="send-btn" type="button">Enviar</button>
        </div>
    `;
    document.body.appendChild(chat);
    return chat;
}

function setupChat() {
    const chat = document.getElementById('squad-b-chat') || createChatMarkup();
    const header = chat.querySelector('.chat-header');
    let toggleButton = chat.querySelector('.chat-toggle');

    if (!toggleButton) {
        toggleButton = document.createElement('button');
        toggleButton.className = 'chat-toggle';
        toggleButton.type = 'button';
        toggleButton.title = 'Abrir ou minimizar o chat';
        header.appendChild(toggleButton);
    }

    const setMinimizedState = (isMinimized) => {
        chat.classList.toggle('is-minimized', isMinimized);
        toggleButton.textContent = isMinimized ? '+' : '-';
        toggleButton.setAttribute('aria-label', isMinimized ? 'Maximizar chat' : 'Minimizar chat');
        toggleButton.setAttribute('aria-expanded', String(!isMinimized));
    };

    setMinimizedState(true);
    toggleButton.addEventListener('click', () => {
        setMinimizedState(!chat.classList.contains('is-minimized'));
    });

    const chatMessages = chat.querySelector('#chat-messages');
    const userInput = chat.querySelector('#user-input');
    const sendBtn = chat.querySelector('#send-btn');

    function addMessage(text, senderType) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', senderType === 'user' ? 'user-message' : 'bot-message');
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function handleSend() {
        const text = userInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        userInput.value = '';

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();

            if (!response.ok) {
                addMessage(`[Erro do Servidor]: ${data.error || 'Falha ao gerar resposta'}`, 'bot');
            } else {
                addMessage(data.text, 'bot');
            }
        } catch (error) {
            addMessage(`[Erro de Conexao]: ${error.message}`, 'bot');
        }
    }

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') handleSend();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupChat);
} else {
    setupChat();
}
