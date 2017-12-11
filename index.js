/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

/****************************
 * higher lexical scope var
 * and xhr for one joke
 ****************************/
var btn = document.getElementById("jokeBtn");
var tenJokes;
var jokes;
var xhr = new XMLHttpRequest();
btn.addEventListener("click", () => {
  xhr.open("GET", "https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_joke");
  xhr.onload = loadJoke;
  xhr.send();
});


let putBtn = document.getElementById("tenJokeBtn");
putBtn.addEventListener("click", () => {

  xhr.open('GET', 'https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_ten');
  xhr.onload = loadTenJokes;
  xhr.send();
});

function loadJoke() {
  console.log(JSON.parse(xhr.responseText));
  var table = document.getElementById("oneJoke");
  joke = JSON.parse(xhr.responseText);

  if (table.rows.length == 1) {
    insertJoke(table, joke);

  } else {
    while (table.rows.length > 1) {
      table.deleteRow(1);
    }
    insertJoke(table, joke);
  }


}

function loadTenJokes() {
  //  console.log(JSON.parse(xhr.responseText));
  var table10 = document.getElementById("tenJokes");
  //  console.log("table10: ", table10);
  tenJokes = JSON.parse(xhr.responseText);
  console.log("tenJokes object length: ", tenJokes.length);

  if (table10.rows.length == 1) {
    insertJokes(table10, tenJokes);
  } else {
    while (table10.rows.length > 1) {
      table10.deleteRow(1);
    }
    insertJokes(table10, tenJokes);

  }
  setupListeners(tenJokes);

}

function insertJoke(table, joke) {
  let row = table.insertRow(1);
  // console.log("table oneJoke row: ", row);
  let cell0 = row.insertCell(0);
  cell0.innerHTML = joke.type;
  cell0.classList.add("appear");

  let cell1 = row.insertCell(1);
  cell1.innerHTML = joke.setup;
  cell1.classList.add("appear");

  let cell2 = row.insertCell(2);
  cell2.innerHTML = joke.punchline;
  cell2.classList.add("appear");

  let cell3 = row.insertCell(3);
  cell3.innerHTML = "<button id=oneJokeBtn" + " class=" + " btn-primary>Save</button>";
  cell3.classList.add("appear");

  let jokeButton = document.getElementById("oneJokeBtn");
  jokeButton.addEventListener("click", (evt) => {
    // TODO
    // save to local storage
    var saveJoke = {
      id: joke.id,
      type: joke.type,
      setup: joke.setup,
      punchline: joke.punchline
    }
    var saveJokeString = JSON.stringify(saveJoke);
    localStorage.setItem('joke'+joke.id, saveJokeString);
    showP(evt);
  });
}

function insertJokes(table, jokes) {

  for (var i = 0; i < jokes.length; i++) {
    let row = table.insertRow(i + 1);
    //console.log("table10 row: ", row);
    let cell0 = row.insertCell(0);
    cell0.classList.add("appear");
    cell0.innerHTML = jokes[i].type;
    // console.log("ten jokes cell0: ", cell0);
    let cell1 = row.insertCell(1);
    cell1.innerHTML = jokes[i].setup;
    cell1.classList.add("appear");
    // console.log("ten jokes cell1: ", cell1);
    let cell2 = row.insertCell(2);
    cell2.innerHTML = jokes[i].punchline;
    cell2.classList.add("appear");
    //  console.log("ten jokes cell2: ", cell2);
    let button = document.createElement("button");
    button.classList.add("btn-secondary");
    button.id = i + 1;
    button.innerHTML = "Save to LS";
    let cell3 = row.insertCell(3);
    cell3.innerHTML = "<button id=" + (i + 1) + " class=" + "btn-primary>Save</button>";
    cell3.classList.add("appear");
    //console.log(cell3.innerHTML);
  }
  //   console.log(tenJokes);
}

/*******************************************************************
 * allows me ot setup an one event listener for the ten jokes table
 ********************************************************************/
function setupListeners(jokes) {
  var listener = document.getElementById("tenJokes");
  listener.addEventListener("click", (evt) => {
    // current target is the target that has the eventListenver attached to it
    // evt.target is the actual child element that fired the event
    if (evt.target != evt.currentTarget) {
      var clicked = evt.target.id;
      console.log("clicked: ", clicked);
      // TODO
      // save to local storage
      let joke = {
        id: jokes[clicked -1].id,
        type: jokes[clicked -1].type,
        setup: jokes[clicked -1].setup,
        punchline: jokes[clicked -1].punchline
      }
      console.log(joke);
      var saveJokes = JSON.stringify(joke);
      localStorage.setItem('joke'+joke.id, saveJokes);
      //jokeIDs.push(joke.id);
    }
    showP(evt);
    evt.stopPropagation();
  });
}

function showP(event) {

  if (event.target.id == "oneJokeBtn") {
    var p1 = document.getElementById("oneP");
    p1.style.visibility = "initial";
    setTimeout(() => {
      p1.style.visibility = "hidden";
    }, 1000);
  } else if (event.currentTarget.id == "tenJokes") {
    var p2 = document.getElementById("tenP");
    p2.style.visibility = "initial";
    setTimeout(() => {
      p2.style.visibility = "hidden";
    }, 1000);
  } else if (event.target.id == "addJokeBtn") {
    var p3 = document.getElementById("addP");
    p3.style.visibility = "initial";
    setTimeout(() => {
      p3.style.visibility = "hidden";
    }, 1000);
  }
  else{
    var p4 = document.getElementById("removeP");
    p4.style.visibility = "initial";
    setTimeout(()=>{
      p4.style.visibility = "hidden";
    }, 1000);
  }
}

/************************************
 * eventListener for viewing jokes
 ************************************/
var viewJokes = document.getElementById('viewJokesBtn');
viewJokes.addEventListener('click', () => {
  jokes = getFromLS();
  console.log("from event listener: ", jokes);
  var table = document.getElementById("tableDB");
  if (table.rows.length == 1){
      populateTable(jokes, table);
  }
  else {
    while (table.rows.length > 1){
      table.deleteRow(1);
    }
    populateTable(jokes, table);
  }
  while (jokes.length){
    jokes.pop();
  }
  console.log("jokes.length: ", jokes.length);
});

function getFromLS() {
  var temp = [];    // holds joke objects retrieved with keyArray
  for (var i = 0; i < localStorage.length; i++){
    if (localStorage.key(i).includes('joke')){
      temp.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
      console.log(temp[i].id);
    }
  }
  return temp;
}

function populateTable(jokes, table){
  console.log("popualteTable jokes.length: ", jokes.length);
  for (var i = 0; i < jokes.length; i++){
    let row = table.insertRow(i + 1);
    //console.log("table10 row: ", row);
    let cell0 = row.insertCell(0);
    cell0.innerHTML = jokes[i].id;
    cell0.classList.add("appear");
    // console.log("ten jokes cell0: ", cell0);
    let cell1 = row.insertCell(1);
    cell1.innerHTML = jokes[i].type;
    cell1.classList.add("appear");
    // console.log("ten jokes cell1: ", cell1);
    let cell2 = row.insertCell(2);
    cell2.innerHTML = jokes[i].setup;
    cell2.classList.add("appear");
    //  console.log("ten jokes cell2: ", cell2);
    let cell3 = row.insertCell(3);
    cell3.innerHTML = jokes[i].punchline;
    cell3.classList.add("appear");
  }
}

// setup event listener for removal of jokes
var removeBtn = document.getElementById("removeBtn");
removeBtn.addEventListener("click", (evt)=>{
  var removeID = document.getElementById("removeNum").value;
  var key = "joke" + removeID;
  console.log(key);
  localStorage.removeItem(key);
  showP(evt);
});

// add event listener for adding jokes to LS
var addJokeBtn = document.getElementById("addJokeBtn");
addJokeBtn.addEventListener("click", (evt)=>{
  var id = getRandomInt(100, 1000);
  var type = document.getElementById("addType").value;
  var setup = document.getElementById("addSetup").value;
  var punchline = document.getElementById("addPunchline").value;

  var addJoke = {
    id: id,
    type: type,
    setup: setup,
    punchline: punchline
  }
  var jokeString = JSON.stringify(addJoke);

  var stringID = 'joke' + id;
  localStorage.setItem(stringID, jokeString);
  showP(evt);
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
