let mediaCount = 0;
let reportCount = 0;

const chatBody = document.getElementById('chat-body');
const chatWelcome = document.querySelector('.dashboard-chat__body-welcome');
const filesWelcome = document.querySelector('.dashboard-files__info');
const filesWrapper = document.querySelector('.dashboard-files__wrapper');
const mediaFiles = document.getElementById('media-files');
const reportFiles = document.getElementById('report-files');

function appendChatMessage(sender, text, messageClass, timeClass) {
	chatWelcome.classList.add('visually-hidden');
	chatBody.classList.remove('visually-hidden');

	const now = new Date();
	const time = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

	const message = document.createElement('div');
	message.classList.add(messageClass);


	// message.innerHTML = `<span class="dashboard-chat__sender">${sender}</span>${text} <span class="${timeClass}">${time}</span>`;

	if (sender === 'Jim') {
		message.innerHTML = `
		
				<img class="dashboard-chat__avatar" width="49" height="49" src="../images/admin-photo.png" alt="">
				<div class="dashboard-chat__content">
			<span class="dashboard-chat__sender">${sender}</span>${text} <span class="${timeClass}">${time}</span>
				</div>
		
			`;
	} else {
		message.innerHTML = `
		<span class="dashboard-chat__sender">${sender}</span>${text} <span class="${timeClass}">${time}</span>
		`;
	}


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

	const imgLeft = document.createElement('img');
	imgLeft.src = '../images/file-icon.svg';
	imgLeft.alt = 'Файл';

	const nameEl = document.createElement('span');
	nameEl.textContent = name;
	nameEl.classList.add('document-name');

	const imgRight = document.createElement('img');
	imgRight.src = '../images/file-dwl.svg';
	imgRight.alt = 'Файл';

	const imgProcess = document.createElement('img');
	imgProcess.src = '../images/file-process.svg';
	imgProcess.alt = 'Файл';

	documentBlock.appendChild(imgLeft);
	documentBlock.appendChild(nameEl);
	documentBlock.appendChild(imgProcess);

	const statusEl = document.createElement('p');
	statusEl.classList.add('dashboard-files__note');
	statusEl.innerHTML = `<img src="../images/status-icon.svg" alt="" style="display:inline; width:16px;height:16px;margin-right: 5px;vertical-align: middle;">${type === 'media' ? 'Медиаплан формируется...' : 'Отчет формируется...'}`;

	container.appendChild(documentBlock);
	container.appendChild(statusEl);

	if (type === 'media') {
		ShowMore(mediaFiles, 'show-more-media', 'media');
	} else {
		ShowMore(reportFiles, 'show-more-report', 'report');
	}

	appendChatMessage("Jim", `Заказ ${type === 'media' ? 'медиаплана' : 'отчета'} принят. Ожидайте.`, 'dashboard-chat__status', 'dashboard-chat__status-time');

	setTimeout(() => {
		statusEl.classList.add('dashboard-files__note');
		statusEl.innerHTML = `<img src="../images/ready-icon.svg" alt="" style="display:inline; width:16px;height:16px;margin-right: 5px;vertical-align: middle;">${type === 'media' ? 'Медиаплан' : 'Отчет'} от ${new Date().toLocaleDateString('ru-RU')} готов`;
		appendChatMessage("Jim", `${type === 'media' ? 'Медиаплан' : 'Отчет'} "${name}" сформирован`, 'dashboard-chat__status', 'dashboard-chat__status-time');

		documentBlock.replaceChild(imgRight, imgProcess);

		setTimeout(() => {
			statusEl.remove();
		}, 2000);
	}, 2000);
}


let mediaIndex = null;
let reportIndex = null;
const limit = 3;

function ShowMore(container, buttonId, type) {
	const children = [...container.querySelectorAll('.dashboard-files__media-document')];
	const button = document.getElementById(buttonId);

	if (children.length <= limit) {
		children.forEach(el => el.style.display = 'flex');
		button.classList.add('visually-hidden');
		return;
	}

	// Всегда показываем кнопку
	button.classList.remove('visually-hidden');

	// Устанавливаем начальный индекс при первом вызове или при добавлении нового документа
	if (type === 'media') {
		mediaIndex = (children.length - limit + children.length) % children.length;
		showDocumentWindow(children, mediaIndex, limit);
	} else {
		reportIndex = (children.length - limit + children.length) % children.length;
		showDocumentWindow(children, reportIndex, limit);
	}

	// Назначаем или переустанавливаем обработчик клика
	button.onclick = () => {
		if (type === 'media') {
			mediaIndex = (mediaIndex - 1 + children.length) % children.length;
			showDocumentWindow(children, mediaIndex, limit);
		} else {
			reportIndex = (reportIndex - 1 + children.length) % children.length;
			showDocumentWindow(children, reportIndex, limit);
		}
	};
}



function showDocumentWindow(documents, startIndex, windowSize) {
	const len = documents.length;

	documents.forEach(el => {
		el.style.display = 'none';
	});

	for (let i = 0; i < windowSize; i++) {
		const index = (startIndex + i) % len;
		documents[index].style.display = 'flex';
	}
}










document.getElementById('order-media').addEventListener('click', () => {
	const toggleArrow = document.getElementById('toggle-media');

	// Если блок свернут — разворачиваем
	if (toggleArrow.classList.contains('collapsed')) {
		toggleArrow.classList.remove('collapsed');

		// Показываем документы и кнопку
		const documents = mediaFiles.querySelectorAll('.dashboard-files__media-document');
		const notes = mediaFiles.querySelectorAll('.dashboard-files__note');
		const showMoreBtn = document.getElementById('show-more-media');

		documents.forEach(doc => doc.classList.remove('visually-hidden'));
		notes.forEach(note => note.classList.remove('visually-hidden'));
		showMoreBtn.classList.remove('visually-hidden');
	}

	// Продолжаем как обычно
	simulateAsync('media');
});







document.getElementById('order-report').addEventListener('click', () => {
	const toggleArrow = document.getElementById('toggle-report');

	if (toggleArrow.classList.contains('collapsed')) {
		toggleArrow.classList.remove('collapsed');

		const documents = reportFiles.querySelectorAll('.dashboard-files__media-document');
		const notes = reportFiles.querySelectorAll('.dashboard-files__note');
		const showMoreBtn = document.getElementById('show-more-report');

		documents.forEach(doc => doc.classList.remove('visually-hidden'));
		notes.forEach(note => note.classList.remove('visually-hidden'));
		showMoreBtn.classList.remove('visually-hidden');
	}

	simulateAsync('report');
});



document.getElementById('send-message').addEventListener('click', () => {
	const input = document.getElementById('chat-message');
	const text = input.value.trim();
	if (text) {
		appendChatMessage("", text, 'dashboard-chat__message', 'dashboard-chat__message-time');
		input.value = '';
	}
});

document.getElementById('chat-message').addEventListener('keydown', (e) => {
	if (e.key === 'Enter') {
		document.getElementById('send-message').click();
	}
});


document.getElementById('toggle-media').addEventListener('click', () => {
	const documents = mediaFiles.querySelectorAll('.dashboard-files__media-document');
	const showMoreBtn = document.getElementById('show-more-media');
	const notes = mediaFiles.querySelectorAll('.dashboard-files__note');
	// Переключаем видимость документов
	documents.forEach(doc => {
		doc.classList.toggle('visually-hidden');
	});
	// Переключаем видимость кнопки "Показать еще"
	if (showMoreBtn && !showMoreBtn.classList.contains('visually-hidden')) {
		showMoreBtn.classList.toggle('visually-hidden');
	}

	// Переключаем видимость p с заметкой
	notes.forEach(note => note.classList.toggle('visually-hidden'));

	// Переключаем стрелку
	document.getElementById('toggle-media').classList.toggle('collapsed');

	// Проверяем, нужно ли показать кнопку "Показать еще" заново
	if (!document.getElementById('toggle-media').classList.contains('collapsed')) {
		ShowMore(mediaFiles, 'show-more-media', 'media');
	} else {
		showMoreBtn.classList.add('visually-hidden');
	}
});

document.getElementById('toggle-report').addEventListener('click', () => {
	const documents = reportFiles.querySelectorAll('.dashboard-files__media-document');
	const showMoreBtn = document.getElementById('show-more-report');
	const notes = reportFiles.querySelectorAll('.dashboard-files__note');

	documents.forEach(doc => {
		doc.classList.toggle('visually-hidden');
	});

	if (showMoreBtn && !showMoreBtn.classList.contains('visually-hidden')) {
		showMoreBtn.classList.toggle('visually-hidden');
	}
	notes.forEach(note => note.classList.toggle('visually-hidden'));

	document.getElementById('toggle-report').classList.toggle('collapsed');

	// Проверяем, нужно ли показать кнопку "Показать еще" заново
	if (!document.getElementById('toggle-report').classList.contains('collapsed')) {
		ShowMore(reportFiles, 'show-more-report', 'report');
	} else {
		showMoreBtn.classList.add('visually-hidden');
	}
});



const btnMore = document.querySelector('.dashboard-chat__top-more');
const windowMore = document.querySelector('.dashboard-chat__top-more__inner');
btnMore.addEventListener('click', function(){
	windowMore.classList.toggle('visually-hidden');
})