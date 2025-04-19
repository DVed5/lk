let mediaCount = 0;
let reportCount = 0;

const chatBody = document.getElementById('chat-body');
const mediaFiles = document.getElementById('media-files');
const reportFiles = document.getElementById('report-files');

function appendChatMessage(sender, text) {
  const now = new Date();
  const time = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  const message = document.createElement('div');
  message.classList.add('message');
  message.innerHTML = `<strong>${sender}</strong>: ${text} <span class="time">${time}</span>`;
  chatBody.appendChild(message);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function simulateAsyncAction(type) {
  const count = type === 'media' ? ++mediaCount : ++reportCount;
  const name = `Companyname ${count}/25`;
  const container = type === 'media' ? mediaFiles : reportFiles;
  const temp = document.createElement('div');
  temp.innerHTML = `<strong>${name}</strong><p>${type === 'media' ? 'Медиаплан формируется...' : 'Отчет формируется...'}</p>`;
  container.appendChild(temp);

  appendChatMessage("PinkChicken", `Заказ ${type === 'media' ? 'медиаплана' : 'отчета'} принят. Ожидайте.`);

  setTimeout(() => {
    temp.innerHTML = `<strong>${name}</strong><p>${type === 'media' ? 'Медиаплан' : 'Отчет'} от ${new Date().toLocaleDateString('ru-RU')} готов</p>`;
    appendChatMessage("PinkChicken", `${type === 'media' ? 'Медиаплан' : 'Отчет'} "${name}" сформирован`);
  }, 2000);
}

document.getElementById('order-media').addEventListener('click', () => simulateAsyncAction('media'));
document.getElementById('order-report').addEventListener('click', () => simulateAsyncAction('report'));

document.getElementById('send-message').addEventListener('click', () => {
  const input = document.getElementById('chat-message');
  const text = input.value.trim();
  if (text) {
    appendChatMessage("Вы", text);
    input.value = '';
  }
});

document.getElementById('chat-message').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('send-message').click();
  }
});
