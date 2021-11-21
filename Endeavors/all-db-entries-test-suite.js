// Richard Burd used this code as a starting point:
// https://www.valentinog.com/blog/html-table/
// This is a script with simplified code for purposes of
// de-bugging and testing in the event that s.thing goes wrong.
// if this works but the "endeavor-displays-by-set.js" isn't working,
// that means the database is OK, and s.thing it wrong with JavaScript

let json_from_sheetdb = require("./data_out.json");

function generateTableHead(table, data) {
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

function generateTable(table, data) {
  for (let element of data) {
    let row = table.insertRow();
    for (let key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
}

let table = document.getElementById("master-table");

// temp calls to functions above
generateTableHead(table, json_from_sheetdb);
generateTable(table, json_from_sheetdb);
