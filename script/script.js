const clear = document.querySelector('.clear');
const dateElement = document.getElementById('date');
const list = document.getElementById('list');
const input = document.getElementById('input');
const addBtn = document.getElementById('add');
const iconElement = document.querySelector('.weather-icon');
const tempElement = document.querySelector('.temperature-value p');
const notificationElement = document.querySelector('.notification');

const CHECK = 'fa-check-circle';
const UNCHECK = 'fa-circle-thin';
const LINE_THROUGH = 'lineThrough';

let LIST = [];
let id = 0;
let data = localStorage.getItem("TODO");
//Use local storage--------------------------------------------------------------------//
if(data){
    LIST = JSON.parse(data);
    id = LIST.length;
    loadList(LIST);
} else {
    LIST = [];
    id = 0;
}
function loadList(array){
    array.forEach(function(item){
        addToDo(item.name, item.id, item.done, item.trash);
    });
}
//Clear local storage-------------------------------------------------------------------//
clear.addEventListener('click', function(){
    localStorage.clear();
    location.reload();
});
//Date----------------------------------------------------------------------------------//
const options = {weekday:'long', month:'short', day:'numeric'};
const today = new Date();
dateElement.innerHTML = today.toLocaleDateString('en-US', options);
//Add function-------------------------------------------------------------------------//
function addToDo(toDo, id, done, trash){
    if(trash){
        return;
    }
    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";

    const item = `<li class="item">  
                    <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                    <p class="text ${LINE}">${toDo}</p>
                    <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                    </li>`;

    const position = 'beforeend';
    list.insertAdjacentHTML(position, item);
}
//Add item with enter key-------------------------------------------------------------------------//
document.addEventListener('keyup',(KeyboardEvent) => {
    if(KeyboardEvent.key === 'Enter'){ //hit enter
        const toDo = input.value;
        if(toDo){
            addToDo(toDo, id, false, false);
            LIST.push({
                name: toDo,
                id: id,
                done: false,
                trash: false
            });
            localStorage.setItem('TODO', JSON.stringify(LIST));
            id++;
            console.log(LIST);
        }
        input.value = "";
    }
});
//Add item with plus button-------------------------------------------------------------------------//
addBtn.addEventListener('click', function(){
    const toDo = input.value;
        if(toDo){
            addToDo(toDo, id, false, false);
            LIST.push({
                name: toDo,
                id: id,
                done: false,
                trash: false
            });
            localStorage.setItem('TODO', JSON.stringify(LIST));
            id++;
            console.log(LIST);
        }
        input.value = "";
});
//Complete a ToDo-------------------------------------------------------------------------//
function completeToDo(element){
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);
    LIST[element.id].done = LIST[element.id].done ? false : true;
}
//Remove a ToDo-------------------------------------------------------------------------//
function removeToDo(element){
    element.parentNode.parentNode.removeChild(element.parentNode);
    LIST[element.id].trash = true;
}
list.addEventListener('click', function(event){
    const element = event.target;
    const elementJob = element.attributes.job.value;
    if(elementJob === 'complete'){
        completeToDo(element);
    } else if(elementJob === 'delete') {
        removeToDo(element);
    }
    localStorage.setItem('TODO', JSON.stringify(LIST));
});
//---------------------------------WEATHER API-----------------------------------------------//
const weather = {};
const apiKey = '001cee30235e1dc103ba5531f0cfad99';
const KELVIN = 273;

weather.temperature = {
    unit: 'celsius'
}
//GeoLoc support check
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = 'block';
    notificationElement.innerHTML = "<p>Browser doesn't support geolocation</p>";
}
//Location
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}
function showError(error){
    notificationElement.style.display = 'block';
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}
//Get Weather
function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    fetch(api).then(function(response){
        let data = response.json();
        return data;
    })
    .then(function(data){
        weather.temperature.value = Math.floor(data.main.temp - KELVIN);
        weather.iconId = data.weather[0].icon;
    })
    .then(function(){
        displayWeather();
    });
}
//Display weather
function displayWeather(){
    iconElement.innerHTML = `<img src="/images/icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
}