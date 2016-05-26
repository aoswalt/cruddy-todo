/* eslint-disable no-console */
/* global firebase:false */
"use strict";

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

  //NOTE(adam): UPDATE: click event on complete to send PUT/PATCH to firebase
  $("tbody").on("click", ".complete", (e) => {
    const $row = $(e.target).closest("tr");
    const id = $row.data("id");
    const $taskText = $row.children(".task-text");
    const isNowComplete = !$taskText.hasClass("completed");
    $.ajax({
      url: `${API_URL}/${id}.json`,
      type: "PATCH",
      dataType: "json",
      data: JSON.stringify({ complete: isNowComplete })
    }).done(function() {
      $taskText.toggleClass("completed", isNowComplete);
      $row.find(".complete").html(`${isNowComplete ? "Uncomplete" : "Complete"}`);
    });
  });

  firebase.initializeApp({
    apiKey: "AIzaSyCUv6C0cre1ObRwFxe_F0i9rIe9bcgYPV4",
    authDomain: "cruddy-todo.firebaseapp.com",
    databaseURL: "https://cruddy-todo.firebaseio.com",
    storageBucket: "cruddy-todo.appspot.com"
  });

});


//NOTE(adam): id as second means it would still show up just not have id
function addItemToTable(item, id) {
  const row = `<tr data-id="${id}">
    <td class="task-text ${item.complete ? "completed" : ""}">${item.task}</td>
    <td>
      <button class="complete btn btn-success">${item.complete ? "Uncomplete" : "Complete"}</button>
      <button class="delete btn btn-danger">Delete</button>
    </td>
  </tr>`;

  $("tbody").append(row);
}
