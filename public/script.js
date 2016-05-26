/* eslint-disable no-console */
"use strict";

//TODO(adam): handle completed tasks

$(() => {
  const API_URL = "https://cruddy-todo.firebaseio.com/task";

  //NOTE(adam): READ:   GET data from firebase and display in table
  $.get(`${API_URL}.json`).done((data) => {
    if(data) {
      Object.keys(data).forEach((id) => addItemToTable(data[id], id));
    }
  });

  //NOTE(adam): CREATE: form submit event to POST data to firebase
  $("form").submit((ev) => {
    ev.preventDefault();
    const $formInput =$('input[type="text"]');
    const inputData = {task: $formInput.val()};
    $.post(`${API_URL}.json`, JSON.stringify(inputData))
      .done((data) => {
        addItemToTable(inputData, data.name);
        $formInput.val("");
      });
  });

  //NOTE(adam): DELETE: click event on delete to send DELETE to firebase
  //NOTE(adam): dynamic click event on delete buttons
  $("tbody").on("click", ".delete", (e) => {
    const $row = $(e.target).closest("tr");
    const id = $row.data("id");
    $.ajax({
      url: `${API_URL}/${id}.json`,
      type: "DELETE"
    }).done(function() {
      $row.remove();
    });
  });

});

//TODO(adam): UPDATE: click event on complete to send PUT/PATCH to firebase

//NOTE(adam): id as second means it would still show up just not have id
function addItemToTable(item, id) {
  const row = `<tr data-id="${id}">
    <td>${item.task}</td>
    <td>
      <button class="btn btn-success">Complete</button>
      <button class="delete btn btn-danger">Delete</button>
    </td>
  </tr>`;

  $("tbody").append(row);
}
