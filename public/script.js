/* eslint-disable no-console */
"use strict";

$(() => {
  const API_URL = "https://cruddy-todo.firebaseio.com/task.json";

  $.get(API_URL)
    .done((data) => {
      Object.keys(data).forEach((key) => addItemToTable(data[key]));
    });
})

//TODO(adam): CREATE: form submit event to POST data to firebase
//TODO(adam): READ:   GET data from firebase and display in table
//TODO(adam): UPDATE: click event on complete to send PUT/PATCH to firebase
//TODO(adam): DELETE: click event on delete to send DELETE to firebase

function addItemToTable(item) {
  const row = `<tr>
    <td>${item.task}</td>
    <td>
      <button class="btn btn-success">Complete</button>
      <button class="btn btn-danger">Delete</button>
    </td>
  </tr>`;

  $("tbody").append(row);
}
