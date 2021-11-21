// this code was written by Richard Burd and generates the dynamic endeavor set tables

// create an individual accordion
function createAccordion(title) {
  let accordionBuilder1 = document.createElement("BUTTON");
  accordionBuilder1.setAttribute("class", "set-accordion");
  accordionBuilder1.setAttribute("set", "will-be-dynamic-set-name");
  accordionBuilder1.innerText = title;

  let accordionBuilder2 = document.createElement("div");
  accordionBuilder2.setAttribute("class", "panel");

  let accordionBuilder3 = document.createElement("table");
  accordionBuilder3.setAttribute("id", title);
  // accordionBuilder3.innerText = "a dynamic table will get displayed here";

  // this is where the elements above are merged together
  accordionBuilder2.appendChild(accordionBuilder3);

  // here they are inserted into the DOM
  let insertPoint = document.querySelector(".sets-accordion-group");
  insertPoint.appendChild(accordionBuilder1);
  insertPoint.appendChild(accordionBuilder2);
}

// import the JSON database
let json_data = require("./data_out.json");

// this is a list of all "Sets"
let list_of_sets = [];

// generate a table for a given set
function generateSetSpecificTable(set, data) {
  // -------left off here
  let table = document.getElementById(set);

  for (let element of data) {
    let row = table.insertRow();
    for (let key in element) {
      if (set === element["Set"]) {
        let cell = row.insertCell();
        let text = document.createTextNode(element[key]);
        cell.appendChild(text);
      }
    }
  }
}

// generate a table "head" that displays the title of each column in the database
function generateTableHead(set, data) {
  let table = document.getElementById(set);
  let thead = table.createTHead();
  let row = thead.insertRow();
  let row_titles = data[0];
  for (const row_title in row_titles) {
    let th = document.createElement("th");
    let text = document.createTextNode(row_title);
    th.appendChild(text);
    row.appendChild(th);
  }
}

// create all accordions, one for each 'set' in the JSON database
function createAllAccordionsForEachSet(data) {
  // iterate over the JSON database and find each "Set"
  for (let elem of data) {
    if (!list_of_sets.includes(elem["Set"])) {
      list_of_sets.push(elem["Set"]);
    }
  }

  // now we're itrerating over all sets
  // and creating an accordion for each one
  for (let set of list_of_sets) {
    createAccordion(set);
    generateSetSpecificTable(set, data);
    generateTableHead(set, json_data);
  }
}

// this final call is the starting point and will execute  everything above
// for some reason, this workspace will not execute this if it is made into
// a self-calling function.
createAllAccordionsForEachSet(json_data);

// only run this logic after all accordions have been created,
// this may get packaged into a function later on
// for now it is just running free-form
let acc = document.getElementsByClassName("set-accordion");

for (let i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    // Toggle between adding and removing the "active" class,
    // to highlight the button that controls the panel
    this.classList.toggle("active");

    // Toggle between hiding and showing the active panel
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}
