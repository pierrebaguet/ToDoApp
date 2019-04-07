'use strict';

// Definitions des variables du DOM

const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");

const STORAGE_NAME = 'TODO';

// Classes Names
const CHECK = 'fa-check-circle';
const UNCHECK = 'fa-circle';
const LINE_THROUGH = 'lineThrough';

// Variable

let listItems = [];
let id = 0;


// get item from localstorage
let data = localStorage.getItem(STORAGE_NAME);

//check if data is not empty
if(data){
    listItems = JSON.parse(data);
    id = listItems.length;
    loadList(listItems);
} else {
    listItems = [];
    id = 0;
}

function loadList(array){
    array.forEach(function(item){
        addToDo(item.name, item.id, item.done, item.trash)
    });
};

clear.addEventListener('click', function(){
    localStorage.clear();
    location.reload();
});


// Date Element
const options = {
    weekday: 'long',
    month:'short',
    day:'numeric'
};
const today = new Date();

dateElement.innerHTML = today.toLocaleDateString('fr', options);

//Add To Do Functions

function addToDo (toDo, id, done, trash) {
    
    if(trash){
        return;
    }
    
    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : '';
    
    const item = `
    <li class="item animated fadeIn faster">
    <i class="far ${DONE}" job="complete" id="${id}"></i>
    <span class="${LINE} text">${toDo}</span>
    <i class="far fa-trash-alt" job="delete" id="${id}"></i>
    </li>
    `;
    const position = 'beforeend';
    
    list.insertAdjacentHTML(position, item);
}


// add an item to the list user the enter key
document.addEventListener('keyup', function(event){
    if(event.keyCode === 13){
        const toDo = input.value;
        
        // if the item isn't empty
        if(toDo){
            addToDo(toDo, id, false, false);
            
            listItems.push({
                name: toDo,
                id: id,
                done: false,
                trash: false
            })
            
            id++;
        }
        
        // Reset input's value
        input.value = '';

        //add item to local storage
        localStorage.setItem(STORAGE_NAME, JSON.stringify(listItems));
    }
});


// function complete todo tasks 

function completeToDo(element) {
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector('.text').classList.toggle(LINE_THROUGH);
    
    listItems[element.id].done = listItems[element.id].done ? false: true;
};

// function remove todo tasks

function removeToDo(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);
    
    listItems[element.id].trash = true;
}


// Events Manager
list.addEventListener('click', function(event){
    const element = event.target;
    const elementJob = element.attributes.job.value;
    
    if(elementJob === 'complete'){
        completeToDo(element);
    } else if (elementJob === 'delete'){
        removeToDo(element);
    }
})