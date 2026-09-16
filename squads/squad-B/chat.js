const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

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

    // Adiciona a mensagem do usuário imediatamente
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
        addMessage(`[Erro de Conexão]: ${error.message}`, 'bot');
    }
}

sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});