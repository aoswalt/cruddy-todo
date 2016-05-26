/* eslint-disable no-console */
"use strict";

$(() => {
  const API_URL = "https://cruddy-todo.firebaseio.com/task.json";

  //NOTE(adam): READ:   GET data from firebase and display in table
  $.get(API_URL).done((data) => {
    if(data) {
      Object.keys(data).forEach((key) => addItemToTable(data[key]));
    }
  });

  //TODO(adam): CREATE: form submit event to POST data to firebase
  $("form").submit(() => {
    //TODO(adam): grab the form text
    $.post(API_URL, JSON.stringify({task: "I was posted"}));
    //TODO(adam): make this not refresh the page
  })

});

//TODO(adam): DELETE: click event on delete to send DELETE to firebase
//TODO(adam): UPDATE: click event on complete to send PUT/PATCH to firebase

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
