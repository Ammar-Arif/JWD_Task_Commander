const currentTasks = new TaskManager();
currentTasks.load();
currentTasks.render();
if (currentTasks.tasks.length === 0) {
  console.log(`current tasks are ${currentTasks.tasks}`);
}

const taskHtml = createTaskHtml();

const form = document.querySelector("#new-task-form");

let validationFail = 0;


function validate(validateData, validLength) {
  if (validateData.value.length >= validLength) {
    validateData.classList.remove("is-invalid");
  } else {
    validateData.classList.add("is-invalid");
    validationFail++;
  }
};

form.addEventListener("submit", (event) => {
  const validateName = document.querySelector("#taskName");
  const validateDescription = document.querySelector("#taskDescription");
  const validateAssignedTo = document.querySelector("#taskAssignedTo");
  const validateDueDate = document.querySelector("#taskDueDate");
  const validateStatus = document.querySelector("#taskStatus");


  event.preventDefault();
  event.stopPropagation();

  // Form validation for Task Name Field min length 6
  validate(validateName, 6);

  // Form validation for Task Description Field min length 8
  validate(validateDescription, 8);

  // Form validation for Task Assigned Field min length 5
  validate(validateAssignedTo, 5);

  // Form validation for Due Date Field not empty
  if (validateDueDate.value) {
    validateDueDate.classList.remove("is-invalid");
  } else {
    validateDueDate.classList.add("is-invalid");
    validationFail++;
  }

  // try your own validation for a date in the future
  let now = new Date();
  let nowDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
    .toISOString()
    .split("T")[0];
  console.log("Task Due Date :" + validateDueDate.value + " vs Date Now " + nowDate);
  if (validateDueDate.value >= nowDate) {
    validateDueDate.classList.remove("is-invalid");
  } else {
    validateDueDate.classList.add("is-invalid");
    validationFail++;
  }

  // If validation fails then function will not proceed further and
  // will return. The value of validationFail will also needed to be
  // reset to 0.
  if (validationFail > 0) {
    validationFail = 0;
    //alert("Please correct any error and submit again")
    $("#myModal").modal();
    document.querySelector('#modal-body').innerHTML = 'Please correct the errors and submit again';
    return;
  } else {
    form.classList.add("was-validated");
    
    currentTasks.addTask(validateName.value,validateDescription.value,validateAssignedTo.value,validateDueDate.value,validateStatus.value);
    form.reset();
    form.classList.remove("was-validated");
    $("#myModal").modal();
    document.querySelector('#modal-body').innerHTML = 'Are you sure you want to create a new task? ';
    $('#okBtn').click(function () {
      currentTasks.save();
      currentTasks.render();
  });
  }
});

const taskList = document.querySelector("#task_cards");

taskList.addEventListener("click", (event) => {

  //if done button was clicked
  if (event.target.classList.contains('done-button')) {
    //console.log(`Done button clicked on task ${event.target.parentElement.dataset.id}`);
    //change status
    let taskId = event.target.parentElement.dataset.id;
    currentTasks.closeTask(taskId);
    currentTasks.save();
    currentTasks.render();
    //disable the button
    event.target.setAttribute('disabled',true);

    
  }
  //if done button was clicked
  if (event.target.classList.contains('delete-button')) {
    let taskId = event.target.parentElement.dataset.id;
    let taskName = event.target.parentElement.firstElementChild.innerHTML;
      
      $("#exampleModal").modal();
      $('#delete').click(function () {
        currentTasks.deleteTask(taskId);
        currentTasks.save();
        currentTasks.render();  
        $('#exampleModal').modal('hide');
    });
  }
  
});