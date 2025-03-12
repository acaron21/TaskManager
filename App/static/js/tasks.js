

async function addTask(event){
    event.preventDefault();

    let taskForm = document.getElementById("newTaskModalForm");

    if(taskForm){
        let formData = new FormData(taskForm);

        console.log(`Task to create (name : ${formData.get("name")}, description: ${formData.get("description")})`);
        
        response = await sendRequest(url='/create_task', method="POST" ,data=formData, json=false);
        
        if(response.success){
            closeModal();

            
            console.log("Task created !!!!");

            setTimeout(() => {
                // add task row
                console.log("New task : ", response.new_task);
                let new_row = createTaskRow(response.new_task);
                new_row.classList.add("row-animation");

                let tableBody = document.getElementById('body-task-table');
                

                if(tableBody){tableBody.prepend(new_row);}

                setTimeout(() => {
                    new_row.classList.remove("row-animation");
                }, 500);
            }, 500);
            

        }
    
    }
    
}

// // load all tasks
async function displayAllTasks() {
    let response = await sendRequest(url='/get_all_tasks');
    console.log(response)

    let taskTable = document.getElementById("task-table");
    let taskBody = document.getElementById('body-task-table');
    
    taskBody.innerHTML = "";

    // taskTable.style.display = "none";

    response.forEach(task => {

        new_task_row = createTaskRow(task);
        taskBody.appendChild(new_task_row);
    });

    // taskTable.style.display = "table";
}

function createTaskRow(task){
    let task_id = task.id;
    let task_name = task.name;
    let task_desc = task.description;
    console.log("DESCRIPTION : ", task_desc);

    let row = document.createElement('tr'); //create row
    row.id = `row-${task_id}`;

    // NAME CELL
    let nameCell = document.createElement('td');
    nameCell.innerText = task_name;
    row.appendChild(nameCell);

    // DESCRIPTION CELL
    let descriptionCell = document.createElement('td');
    descriptionCell.innerText = task_desc;
    row.appendChild(descriptionCell);

    // ACTION CELL
    let actionCell = document.createElement('td');
    let doneBtn = document.createElement('button');
    doneBtn.innerText = "Done";

    doneBtn.onclick = function(){deleteRow(`row-${task_id}`);};

    actionCell.appendChild(doneBtn);
    row.appendChild(actionCell);
    
    return row
}

function deleteRow(row_id){
    let row_to_delete = document.getElementById(row_id);
    if(row_to_delete){
        row_to_delete.classList.add("disapear");

        setTimeout(() => {
            row_to_delete.remove();
        }, 300);

        // delete in the server
        let response = sendRequest(url="/delete_task", method="DELETE", data={"row_id":row_id},json=true)
        
    }
}

displayAllTasks();

// Modal to create new task
function createNewTaskModal(){
    console.log("Create new task:");
    
    // Add blocked background for the modal
    let blockedBg = document.createElement("div");
    blockedBg.id = "blockBg";
    blockedBg.classList.add("add-task-modal-background");

    blockedBg.onclick = function() {closeModal();};
    document.body.appendChild(blockedBg);
    

    // add modal
    let modalNewTask = document.createElement("form");
    modalNewTask.id = "newTaskModalForm";
    modalNewTask.classList.add("add-task-modal");

    // create content
    let test = `

    <div class="modal-header">
        <svg class="modal-arrow" onclick=closeModal()  xmlns="http://www.w3.org/2000/svg"  width="34"  height="34"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M5 12l6 6" /><path d="M5 12l6 -6" /></svg>
        <h2>New task</h2>
        <svg class="modal-cross" onclick=closeModal()  xmlns="http://www.w3.org/2000/svg"  width="34"  height="34"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
    </div>

    <div class="modal-body">
        <label for="">Name</label>
        <input id="input-task-name" type="text" name="name">

        <label for="">Description</label>
        <input id="input-task-description" type="text" name="description">
    </div>

    <div class="modal-footer">
        <input onclick=addTask(event) type="submit" name="" id="" class="btn-outline-dark" value="Create !">
    </div>
    `;

    modalNewTask.innerHTML = test;
    
    document.body.appendChild(modalNewTask);
}

// close modal
function closeModal(){
    let bg = document.getElementById('blockBg');
    let modal = document.getElementById('newTaskModalForm');

    modal.classList.add("modal-disappears");
    // bg.classList.add("bg-disappears");

    setTimeout(() => {
        modal.remove();
        bg.remove();
    }, 300);

}
