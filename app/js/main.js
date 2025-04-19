let mediaCount = 0;
let reportCount = 0;

const chatBody = document.getElementById('chat-body');
const chatWelcome = document.querySelector('.dashboard-chat__body-welcome');
const filesWelcome = document.querySelector('.dashboard-files__info');
const filesWrapper = document.querySelector('.dashboard-files__wrapper');
const mediaFiles = document.getElementById('media-files');
const reportFiles = document.getElementById('report-files');

function appendChatMessage(sender, text) {
	chatWelcome.classList.add('visually-hidden');
	chatBody.classList.remove('visually-hidden');

	const now = new Date();
	const time = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

	const message = document.createElement('div');
	message.classList.add('dashboard-chat__message');
	message.innerHTML = ` ${text} <span class="dashboard-chat__message-time">${time}</span>`;
	chatBody.appendChild(message);
	chatBody.scrollTop = chatBody.scrollHeight;
}

function simulateAsync(type) {
	filesWelcome.classList.add('visually-hidden');
	filesWrapper.classList.remove('visually-hidden');

	const count = type === 'media' ? ++mediaCount : ++reportCount;
	const name = `Companyname ${count}/25`;
	const container = type === 'media' ? mediaFiles : reportFiles;

	const documentBlock = document.createElement('div');
	documentBlock.classList.add('dashboard-files__media-document');




// Первая иконка
const imgLeft = document.createElement('img');
imgLeft.src = '../images/file-icon.svg';
imgLeft.alt = 'Файл';
imgLeft.classList.add('file-icon');

// Название компании
const nameEl = document.createElement('span');
nameEl.textContent = name;
nameEl.classList.add('document-name');

// Вторая иконка
const imgRight = document.createElement('img');
imgRight.src = '../images/file-dwl.svg';
imgRight.alt = 'Файл';
imgRight.classList.add('file-icon');

// Добавим элементы в нужном порядке
documentBlock.appendChild(imgLeft);
documentBlock.appendChild(nameEl);
documentBlock.appendChild(imgRight);

	const statusEl = document.createElement('p');
	statusEl.classList.add('dashboard-files__note');
	statusEl.innerHTML = `
	${type === 'media' ? 'Медиаплан формируется...' : 'Отчет формируется...'}
`;

	container.appendChild(documentBlock);
	container.appendChild(statusEl);

	appendChatMessage("PinkChicken", `Заказ ${type === 'media' ? 'медиаплана' : 'отчета'} принят. Ожидайте.`);

	setTimeout(() => {
		statusEl.innerHTML = `${type === 'media' ? 'Медиаплан' : 'Отчет'} от ${new Date().toLocaleDateString('ru-RU')} готов</>`;
		appendChatMessage("PinkChicken", `${type === 'media' ? 'Медиаплан' : 'Отчет'} "${name}" сформирован`);

		setTimeout(() => {
			statusEl.remove();
		}, 3500);

	}, 2000);


}

document.getElementById('order-media').addEventListener('click', () => simulateAsync('media'));
document.getElementById('order-report').addEventListener('click', () => simulateAsync('report'));

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
