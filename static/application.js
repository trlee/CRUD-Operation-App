const AppAPI = new LeaveDatabase_API()
let form = document.getElementById("form")
let hidden = document.getElementById("index")
let type = document.getElementById("leaveType")
let date = document.getElementById("leaveDate")
let reason = document.getElementById("reason")
let msg = document.getElementById("msg")
let dbmsg = document.getElementById("dbmsg")
let posts = document.getElementById("posts")
let insert = document.getElementById("insertToDB")
let data = {}
let databaseData = {}
let dataArray = []

const addAnnualButton = document.getElementById("addAnnual")
addAnnualButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log("button clicked");
    dataArray.push({type: '1', date: "", reason: ""})
    populateTable();
})

const addMedicalButton = document.getElementById("addMedical")
addMedicalButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log("button clicked");
    dataArray.push({type: '2', date: "", reason: ""})
    populateTable();
})

form.addEventListener("submit", (e) => {
    console.log("HIDDEN VALUE: ", hidden.value)
    e.preventDefault();
    console.log("button clicked");
    formValidation();
})

insert.addEventListener('click', (e) => {
    e.preventDefault();
    if (dataArray.length === 0) {
        dbmsg.innerHTML = "Nothing to Insert!!!";
    } else {
        console.log("Inserting to DB: ", JSON.stringify(dataArray))
        AppAPI.insertLeaves(JSON.stringify(dataArray))
    }
})

function formValidation() {
    if (reason.value === "" || date.value === "" || type.value === "") {
        msg.innerHTML = "Type, Date and Reason cannot be blank!!!";
      } else {
        acceptData();
      }
};


function acceptData() {
    if (hidden.value === ""){
        data["type"] = type.value;
        data["date"] = date.value;
        data["reason"] = reason.value;
        dataArray.push({type: data.type, date: data.date, reason: data.reason});
        console.log(dataArray);
        populateTable();
    } else {
        dataArray[hidden.value].type = type.value;
        dataArray[hidden.value].date = date.value;
        dataArray[hidden.value].reason = reason.value;
        console.log(dataArray);
        hidden.value = "";
        populateTable();
    }
    
};


function populateTable() {
    posts.innerHTML = ``;
    const f = dataArray.entries();
    console.log(dataArray)
    for (let x of f) {
        let leaveType = x[1].type;
        let leaveTypeText = ""
        switch (leaveType) {
            case '1':
                leaveTypeText = "Annual Leave"
                break;
            case '2':
                leaveTypeText = "Medical Leave"
                break;
            default:
                leaveTypeText = "Unknown"
                break;
        }
        posts.innerHTML += `
            <div>
            <p>${leaveTypeText} ${x[1].date}</p>
            <p>${x[1].reason}</p>
            <span class="options">
                <i onClick="editPost(this, ${x[0]}, ${x[1].type}, '${x[1].date}', '${x[1].reason}')" class="fas fa-edit"></i>
                <i onClick="deletePost(this, ${x[0]})" class="fas fa-trash-alt"></i>
            </span>
            </div>
    `;
    }
    
};

function editPost (e, index, typeInput, dateInput, reasonInput) {
    hidden.value = index;
    type.value = typeInput;
    date.value = dateInput;
    reason.value = reasonInput;
    console.log("Testing TYPE:  ",dataArray[index].type)
};

function deletePost (e, index) {
    e.parentElement.parentElement.remove();
    dataArray.splice(index, 1);
    populateTable();
};