let task = {
	priority: '',
	text: '',
	time: '',
	complete: 0,
}

let toggle_date = false;
let toggle_priority = false;
let active = true;
let cancel = true;
let end = true;
let selOpt = 3;

let massiveTasks = [];
let newmas = [];

//Функция получения времени
function getTime() {
	let today = new Date();
	today = (today.getDate() + ".") + (today.getMonth() + 1) + "." + today.getFullYear() + " " + (today.getUTCHours() + 3) + ":" + today.getUTCMinutes();
	return today;
}

//Функция добавления задачи
function addTask() {
	task.text = document.getElementById("form_text").value;
	task.priority = document.getElementById("form_priority").value;
	task.time = getTime();
	return task;
}
//Функция смены цвета
function changeColor(done, id,mas) {
	if (done == 1) {
		document.getElementById('done_' + id).style.display = "none";
		document.getElementById('none_done_' + id).style.display = "flex";
		document.getElementById(`task_${id}`).style.backgroundColor = "#3CB371";
		document.getElementById(`textarea_${id}`).style.backgroundColor = "#3CB371";
		document.getElementById(`task_priority_${id}`).style.color = "#3CB371";
	}
	if (done == 2) {
		document.getElementById('none_done_' + id).style.display = "none";
		document.getElementById('done_' + id).style.display = "flex";
		document.getElementById(`task_${id}`).style.backgroundColor = "#F08080";
		document.getElementById(`textarea_${id}`).style.backgroundColor = "#F08080";
		document.getElementById(`task_priority_${id}`).style.color = "#F08080";
	}
	if (done == 0){
		if (mas[id].priority === 'низкий')
		{
			document.getElementById(`task_priority_${id}`).style.color = "violet";
		}
		if (mas[id].priority === 'средний')
		{
			document.getElementById(`task_priority_${id}`).style.color = "orange";
		}
		if (mas[id].priority === 'высокий')
		{
			document.getElementById(`task_priority_${id}`).style.color = "blue";
		}
	}
}
/*	#arrow_up_date {
		display: flex;
	}
	#arrow_down_date {
		display: none;
	}
	#arrow_up_priority {
		display: flex;
	}
	#arrow_down_priority {
		display: none;
	}*/

//Функция смены класса
function changeClassSort(id, toggle) {
	if (id)
	{
		if (toggle) {
			document.getElementById('arrow_up_priority').classList.add('hide');
			document.getElementById('arrow_down_priority').classList.remove('hide');
			massiveTasks = sortMasPriority(massiveTasks, false);
		}
		else {
			document.getElementById('arrow_up_priority').classList.remove('hide');
			document.getElementById('arrow_down_priority').classList.add('hide');
			massiveTasks = sortMasPriority(massiveTasks, true);
		}
	}
	else
	{
		if (toggle) {
			document.getElementById('arrow_up_date').classList.add('hide');
			document.getElementById('arrow_down_date').classList.remove('hide');
			massiveTasks = sortMasData(massiveTasks, true);

		}
		else {
			document.getElementById('arrow_up_date').classList.remove('hide');
			document.getElementById('arrow_down_date').classList.add('hide');
			massiveTasks = sortMasData(massiveTasks, false);
		}
	}
}
//Функция переключения значка стрелочки в сортировке и вызов функций сортировки
function clickSortButtonDate() {
	toggle_date = !toggle_date;
	changeClassSort(false,toggle_date);
	outputMassive(massiveTasks);
}
//Функция переключения значка стрелочки в сортировке и вызов функций сортировки
function clickSortButtonPriority() {
	toggle_priority = !toggle_priority;
	changeClassSort(true,toggle_priority);
	outputMassive(massiveTasks);
}
//Функция получения задач с сервера
const getResourse = async (url) => {
	return await fetch(url)
		.then(response => response.json());
}
//Функция отправки задачи на сервер
async function sendResourse(url, task) {
	let response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(task)
	});
}
//Функция обнавления задачи на сервере
async function putResourse(url, newTask) {
	let response = await fetch(url, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(newTask)
	});
}
//Функция удаления задачи на сервере
async function deleteResourse(url) {
	let response = await fetch(url, {
		method: 'DELETE',
	});
}
//Функция вывода массива в HTML
function outputMassive(mas) {
	let out_arr = document.getElementById('out_arr');
	document.getElementById('out_arr').innerHTML = '';
	for (let i = 0; i < mas.length; i++) {
		if (mas[i] !== undefined) {
			out_arr.innerHTML +=
				"<div class='task'" + ">" +
					"<div id='task_priority_" + i + "' class='task_priority'>" +
						mas[i].priority +
					"</div>" +
					"<div id='task_" + i + "' class='task_content'>" +
						"<div class='task_top'>" +
							"<textarea class='task_text' rows='5'" + "id='textarea_" + i + "'onblur='changeText(" + i + ")'>" +
								mas[i].text +
							"</textarea>" +
							"<div class='task_interactive'>" +
								"<div class='done' id='done_" + i + "' onclick='changeOnDone(" + i + ")'>" + "</div>" +
								"<div id='none_done_" + i + "' onclick='changeOnNoneDone(" + i + ")' class='none_done'>" +	"</div>" +
							"</div>" +
						"</div>" +
						"<div class='task_date'>" +
							mas[i].time +
						"</div>" +
					"</div>" +
					"<div class='task_delete' onclick='deleteTask(" + i + ")'>" +
					"</div>" +
				"</div>";
			changeColor(mas[i].complete, i,mas);
			putResourse('http://127.0.0.1:3000/items/' + (i + 1), mas[i]);
		}

	}
}
//Функция фильтра по приоретету 
function filterMasPriority(mas, select) {
	let newMas = [];

	if (select == 0) {
		newMas = mas.filter(function (item) {
			return item.priority === "низкий";
		})
	}
	if (select == 1) {
		newMas = mas.filter(function (item) {
			return item.priority === "средний";
		})
	}
	if (select == 2) {
		newMas = mas.filter(function (item) {
			return item.priority === "высокий";
		})
	}
	if (select == 3) { newMas = massiveTasks }
	return newMas;
}
//Функция сортировки массива по приоритету 0-в порядке возрастания, 1-убывания
function sortMasPriority(mas, select) {
	let newMas = [];
	if (select) {
		for (let j = 0; j < 3; j++) {
			for (let i = 0; i < mas.length; i++) {
				if (mas[i].priority === 'высокий' && j === 0) {
					newMas.push(mas[i]);
				}
				if (mas[i].priority === 'средний' && j === 1) {
					newMas.push(mas[i]);
				}
				if (mas[i].priority === 'низкий' && j === 2) {
					newMas.push(mas[i]);
				}
			}
		}
	}
	if (!select) {
		for (let j = 0; j < 3; j++) {
			for (let i = 0; i < mas.length; i++) {
				if (mas[i].priority === 'низкий' && j === 0) {
					newMas.push(mas[i]);
				}
				if (mas[i].priority === 'средний' && j === 1) {
					newMas.push(mas[i]);
				}
				if (mas[i].priority === 'высокий' && j === 2) {
					newMas.push(mas[i]);
				}
			}
		}
	}
	return newMas;
}
//Функция фильтра завершения/отмены/активности
function filterMasComplete(mas) {
	let newMas = mas;

	if (active && cancel && end) {
		newMas = mas;
	}
	if (!active && cancel && end) {
		newMas = mas.filter(function (item) { return item.complete != 0; })
	}
	if (active && !cancel && end) {
		newMas = mas.filter(function (item) { return item.complete != 2; })
	}
	if (active && cancel && !end) {
		newMas = mas.filter(function (item) { return item.complete != 1; })
	}
	if (!active && !cancel && end) {
		newMas = mas.filter(function (item) { return item.complete == 1; })
	}
	if (!active && cancel && !end) {
		newMas = mas.filter(function (item) { return item.complete == 2; })
	}
	if (active && !cancel && !end) {
		newMas = mas.filter(function (item) { return item.complete == 0; })
	}
	if (!active && !cancel && !end) {
		newMas = [];
	}
	return newMas;
}

//Функция сортировки массива по дате
function sortMasData(mas, select) {
	if (select) {
		mas.sort(function (a, b) {
			return a.id - b.id;
		});
	}
	if (!select) {
		mas.sort(function (a, b) {
			return b.id - a.id;
		});
	}
	return mas;
}

//Функция редактирования текста
function changeText(id) {
	let result = confirm('Сохраняем изменение?');
	if (result) {
		let textChange = document.getElementById('textarea_' + id);
		massiveTasks[id].text = textChange.value;
		putResourse('http://127.0.0.1:3000/items/' + (id + 1), massiveTasks[id]);
		localStorage.clear;
		localStorage.setItem('myTasks', JSON.stringify(massiveTasks));
		getRosponseFromServer();
	}
}
//Функция удаления задачи
function deleteTask(id) {
	massiveTasks.splice(id, 1);
	massiveTasks.splice(id, 1);
	localStorage.clear;
	localStorage.setItem('myTasks', JSON.stringify(massiveTasks));
	deleteResourse('http://127.0.0.1:3000/items/' + (id + 1));
	getRosponseFromServer();
}
//Функция смены завершенности задачи на 'завершенная'
function changeOnDone(id) {
	massiveTasks[id].complete = 1;
	changeColor(massiveTasks[id].complete, id);
	putResourse('http://127.0.0.1:3000/items/' + (id + 1), massiveTasks[id]);
	localStorage.clear;
	localStorage.setItem('myTasks', JSON.stringify(massiveTasks));
	getRosponseFromServer();
}
//Функция смены завершенности задачи на 'отмененная'
function changeOnNoneDone(id) {
	massiveTasks[id].complete = 2;
	changeColor(massiveTasks[id].complete, id);
	putResourse('http://127.0.0.1:3000/items/' + (id + 1), massiveTasks[id]);
	localStorage.clear;
	localStorage.setItem('myTasks', JSON.stringify(massiveTasks));
	getRosponseFromServer();
}

//Функции для переключения чекбокса и вывода массива
function changeActive() {
	active = !active;
	newmas = massiveTasks;
	newmas = filterMasPriority(newmas, selOpt);
	newmas = filterMasComplete(newmas);
	outputMassive(newmas);
}
function changeEnd() {
	end = !end;
	newmas = massiveTasks;
	newmas = filterMasPriority(newmas, selOpt);
	newmas = filterMasComplete(newmas);
	outputMassive(newmas);
}
function changeCancel() {
	cancel = !cancel;
	newmas = massiveTasks;
	newmas = filterMasPriority(newmas, selOpt);
	newmas = filterMasComplete(newmas);
	outputMassive(newmas);
}

//Функция для селекта фильтра 
function changeFilterButton(select) {

	selectedOption = select.options[select.selectedIndex];
	selOpt = selectedOption.value
	newmas = filterMasPriority(massiveTasks, selOpt);
	newmas = filterMasComplete(newmas);
	outputMassive(newmas);

}

//Функция фильтра по тексту
function filterMasText() {
	let item = document.getElementById('search').value;
	if (item.length > 2) {
		newmas = newmas.filter(function (txt) {
			for (i = 0; i < item.length; i++) {
				if (txt.text[i] === item[i]) {
					return txt;
				}
			}
		})
	}
	if (item.length <= 2) {
		newmas = massiveTasks;
	}
	outputMassive(newmas);
}
//Функция отправки значений на сервер
function sendToServer() {
	if (document.getElementById('form_text').value != '') {
		let task = addTask();
		sendResourse('http://127.0.0.1:3000/items', task)
	}
	else {
		alert('Введите текст');
	}
}
//Функция получения данных с сервера и вывод на страницу
function getRosponseFromServer() {
	getResourse('http://127.0.0.1:3000/items').then((data) => {
		localStorage.setItem('myTasks', JSON.stringify(data));
		massiveTasks = data;
		outputMassive(data);
	});
}

//Функция для сабмита формы
{
	document.getElementById('submitButton').addEventListener('click', sendToServer);

	getRosponseFromServer();
	massiveTasks = JSON.parse(localStorage.getItem('myTasks'));
	newmas = massiveTasks
	outputMassive(newmas);

}
















/*textarea.addEventListener('textarea', function (e) {
	textarea.value = textarea.value.replace(/(\r\n|\n|\r)/gm, "");
})
document.querySelector('textarea').addEventListener('input', function (e) {
	e.target.style.height = 'auto'
	e.target.style.height = e.target.scrollHeight + 2 + "px"
})*/
