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

const addForm = document.forms.addForm;

function getTime() {
	let today = new Date();
	today = (today.getDate() + ".") + (today.getMonth() + 1) + "." + today.getFullYear() + " " + (today.getUTCHours() + 3) + ":" + today.getUTCMinutes();
	return today;
}

function addTask() {
	task.priority = addForm.elements[0].value;
	task.text = addForm.elements[1].value;
	task.time = getTime();
	return task;
}
const getResource = async (url) => {
	return fetch(url)
		.then(result => result.json())
		.then(result => {
			massiveTasks = result;
			outputMassive(result);
		});
}

async function sendResource(url, task) {
	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(task)
	})
		.then(result => result.json())
		.then(result => {
			massiveTasks.push(result);
			outputMassive(massiveTasks);
		});
}

async function putResource(url, newTask) {
	fetch(url, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(newTask)
	}).then(result => result.json())
		.then(result => {
			outputMassive(massiveTasks);
		});
}

async function deleteResource(url) {
	fetch(url, {
		method: 'DELETE',
	})
		.then(result => result.json())
		.then(result => {
			massiveTasks.forEach(function (item,index) {
				if (item.id === result.id)
					massiveTasks.splice(index,1);
			})
			outputMassive(massiveTasks);
		})
}
function changeColor(done, index,mas) {
	if (done == 1) {
		document.getElementById(`done_${index}`).style.display = "none";
		document.getElementById(`none_done_${index}`).style.display = "flex";
		document.getElementById(`task_${index}`).style.backgroundColor = "#3CB371";
		document.getElementById(`textarea_${index}`).style.backgroundColor = "#3CB371";
		document.getElementById(`task_priority_${index}`).style.color = "#3CB371";
	}
	if (done == 2) {
		document.getElementById(`none_done_${index}`).style.display = "none";
		document.getElementById(`done_${index}`).style.display = "flex";
		document.getElementById(`task_${index}`).style.backgroundColor = "#F08080";
		document.getElementById(`textarea_${index}`).style.backgroundColor = "#F08080";
		document.getElementById(`task_priority_${index}`).style.color = "#F08080";
	}
	if (done == 0){
		if (mas[index].priority === 'низкий')
		{
			document.getElementById(`task_priority_${index}`).style.color = "violet";
		}
		if (mas[index].priority === 'средний')
		{
			document.getElementById(`task_priority_${index}`).style.color = "orange";
		}
		if (mas[index].priority === 'высокий')
		{
			document.getElementById(`task_priority_${index}`).style.color = "blue";
		}
	}
}
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
function changeFilterButton(select) {
	selectedOption = select.options[select.selectedIndex];
	selOpt = selectedOption.value
	newmas = filterMasPriority(massiveTasks, selOpt);
	newmas = filterMasComplete(newmas);
	outputMassive(newmas);

}
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

function clickSortButtonDate() {
	toggle_date = !toggle_date;
	changeClassSort(false,toggle_date);
	outputMassive(massiveTasks);
}

function clickSortButtonPriority() {
	toggle_priority = !toggle_priority;
	changeClassSort(true,toggle_priority);
	outputMassive(massiveTasks);
}
function outputMassive(mas) {
	let out_arr = document.getElementById('out_arr');
	document.getElementById('out_arr').innerHTML = '';
	for (let i = 0; i < mas.length; i++) {
		if (mas[i] !== undefined) {
			out_arr.innerHTML +=
				`
				<div class="task">
					<div id="task_priority_${i}" class="task_priority">
						${mas[i].priority}
					</div>
					 <div id="task_${i}" class="task_content">
						<div class="task_top">
							<textarea class='task_text' rows='5' id="textarea_${i}" onblur="changeText(${mas[i].id},${i})">${mas[i].text}</textarea>
							<div class="task_interactive">
								<div class="done" id="done_${i}" onclick="changeOnDone(${mas[i].id},${i})"></div>
								<div id="none_done_${i}" onclick="changeOnNoneDone(${mas[i].id},${i})" class="none_done"></div>				
							</div> 
						</div>
						<div class="task_date"> 
							${mas[i].time}
						</div>
					</div>
					<div class="task_delete" onclick="deleteTask(${mas[i].id})">
					</div>
				</div>`;
			changeColor(mas[i].complete, i, mas);
		}
	}
}
function changeText(id,index) {
	let result = confirm('Сохраняем изменение?');
	if (result) {
		let textChange = document.getElementById(`textarea_${index}`);
		massiveTasks[index].text = textChange.value;
		putResource(`http://127.0.0.1:3000/items/${id}`, massiveTasks[index]);
	}
}

function changeOnDone(id,index) {
	massiveTasks[index].complete = 1;
	changeColor(massiveTasks[index].complete, index);
	putResource(`http://127.0.0.1:3000/items/${id}`, massiveTasks[index]);
}

function changeOnNoneDone(id, index) {
	massiveTasks[index].complete = 2;
	changeColor(massiveTasks[index].complete, index);
	putResource(`http://127.0.0.1:3000/items/${id}`, massiveTasks[index]);
}
function deleteTask(id) {
	deleteResource(`http://127.0.0.1:3000/items/${id}`);
}

function sendToServer() {
	if (addForm.elements[1].value != '') {
		let task = addTask();
		sendResource('http://127.0.0.1:3000/items', task)
		addForm.elements[1].value = '';
	}
	else {
		alert('Введите текст');
	}
}
{ 
	document.getElementById('submitButton').addEventListener('click', sendToServer);
	newmas = getResource('http://127.0.0.1:3000/items');
}



