/* eslint-disable no-console */
/* global firebase:false */
"use strict";


$(() => {
  const API_URL = "https://cruddy-todo.firebaseio.com";
  let token = null;
  let userId = null;

  const getTasks = () => {
    //NOTE(adam): READ:   GET data from firebase and display in table
    $.get(`${API_URL}/${userId}/task/.json?token=${token}`).done((data) => {
      if(data) {
        Object.keys(data).forEach((id) => addItemToTable(data[id], id));
      }
    });
  };

  //NOTE(adam): CREATE: form submit event to POST data to firebase
  $(".add form").submit((ev) => {
    ev.preventDefault();
    const $formInput =$(".task-input");
    const inputData = {task: $formInput.val()};
    $.post(`${API_URL}/${userId}/task/.json?token=${token}`, JSON.stringify(inputData))
      .done((data) => {
        addItemToTable(inputData, data.name);
        $formInput.val("");
      });
  });

  //NOTE(adam): DELETE: click event on delete to send DELETE to firebase
  //NOTE(adam): dynamic click event on delete buttons
  $("tbody").on("click", ".delete", (e) => {
    const $row = $(e.target).closest("tr");
    const taskId = $row.data("id");
    $.ajax({
      url: `${API_URL}/${userId}/task/${taskId}.json?token=${token}`,
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
      url: `${API_URL}/${userId}/task/${id}.json?token=${token}`,
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

  //NOTE(adam): both return promise-like objects
  const login = (email, password) => (
    firebase.auth().signInWithEmailAndPassword(email, password)
  );

  const register = (email, password) => (
    firebase.auth().createUserWithEmailAndPassword(email, password)
  );

  $(".login form").submit((e) => {
    const form = $(e.target);
    const email = form.find('input[type="text"]').val();
    const password = form.find('input[type="password"]').val();

    login(email, password)
      .then(console.log)
      .catch(console.err);

    e.preventDefault();
  });

  $('input[value="Register"]').click((e) => {
    const form = $(e.target).closest("form");
    const email = form.find('input[type="text"]').val();
    const password = form.find('input[type="password"]').val();

    register(email, password)
      .then(() => login(email, password))
      .then(console.log)
      .catch(console.err);

    e.preventDefault();
  });

  $(".logout").click(() => firebase.auth().signOut());

  firebase.auth().onAuthStateChanged(user => {
    if(user) {
      //NOTE(adam): logged in
      $(".logged_in_user").html(user.email);
      userId = user.uid;

      user.getToken()
        .then(t => token = t)
        .then(() => {
          $(".login").hide();
          $(".app").show();
          getTasks();
        });
    } else {
      //NOTE(adam): logged out
      $(".app").hide();
      $(".login").show();
      $("tbody").empty();
    }
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
