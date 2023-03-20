const AppAPI = new LeaveDatabase_API()
const AppHelpers = new LeaveDatabase_Helpers()
const dt = 'leaveApplicationDB'
const dtBody = 'leaveApplicationDBBody'
let dbmsg = document.getElementById("dbmsg")
let posts = document.getElementById("posts")
let insert = document.getElementById("insertToDB")
let leaveTypeOptions = ["Annual Leave", "Medical Leave"]
let data = {}
let databaseData = {}
let dataArray = []

const addAnnualButton = document.getElementById("addAnnual")
addAnnualButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log("button clicked");
    dataArray.push({type: 'Annual Leave', date: "", reason: ""})
    populateTable();
})

const addMedicalButton = document.getElementById("addMedical")
addMedicalButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log("button clicked");
    dataArray.push({type: 'Medical Leave', date: "", reason: ""})
    populateTable();
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


function acceptData() {
    
    dataArray[hidden.value].type = type.value;
    dataArray[hidden.value].date = date.value;
    dataArray[hidden.value].reason = reason.value;
    console.log(dataArray);
    hidden.value = "";
    populateTable();
};


function populateTable() {
    if (dataArray.length != 0) {
        const tableBody = document.getElementById("applications");
        tableBody.innerHTML = `
        <tr>
            <th scope="col">#</th>
            <th scope="col">Type</th>
            <th scope="col">Date</th>
            <th scope="col">Reason</th>
            <th scope="col">Options</th>
            <th scope="col">Delete</th>
        </tr>`;

        const f = dataArray.entries();
        console.log(dataArray)
        for (let x of f) {
            const newRow = document.createElement("tr");
            newRow.id = x[0];
            const col1 = document.createElement("th");
            col1.scope = "row";
            col1.innerHTML = x[0];
            newRow.appendChild(col1);

            const col2 = document.createElement("td");
            col2.id = "type" + x[0];
            const col2Select = document.createElement("select");
            col2Select.id = "leaveType" + x[0];
            col2Select.name = "leaveType";
            col2Select.disabled = true;
            for (var i = 0; i < leaveTypeOptions.length; i++) {
                const option = document.createElement("option");
                option.value = leaveTypeOptions[i];
                option.text = leaveTypeOptions[i];
                col2Select.appendChild(option);
            }
            col2Select.value = x[1].type;
            col2.appendChild(col2Select);
            newRow.appendChild(col2);

            const col3 = document.createElement("td");
            col3.id  = "date" + x[0];
            const col3Date = document.createElement("input");
            col3Date.id = "leaveDate" + x[0];
            col3Date.type = "date";
            col3Date.name = "leaveDate";
            col3Date.value = x[1].date;
            col3Date.disabled = true;
            col3.appendChild(col3Date);
            newRow.appendChild(col3);

            const col4 = document.createElement("td");
            col4.id = "reason" + x[0];
            const col4Reason = document.createElement("input");
            col4Reason.id = "leaveReason" + x[0];
            col4Reason.name = "leaveReason";
            col4Reason.value = x[1].reason;
            col4Reason.disabled = true;
            col4.appendChild(col4Reason);
            newRow.appendChild(col4);

            const col5 = document.createElement("td");
            col5.id = "options" + x[0];
            col5.innerHTML = `<i onClick="editPost(this, ${x[0]}, '${x[1].type}', '${x[1].date}', '${x[1].reason}')" class="fas fa-edit"></i>`;
            newRow.appendChild(col5);

            const col6 = document.createElement("td");
            col6.id = "delete" + x[0];
            col6.innerHTML = `<i onClick="deletePost(this, ${x[0]})" class="fas fa-trash-alt"></i>`;
            newRow.appendChild(col6);
            tableBody.appendChild(newRow);

        }
    } else {
        posts.innerHTML = ``;   
    }

};

function editPost (e, index, typeInput, dateInput, reasonInput) {
    let typeID = "leaveType" + index;
    let dateID = "leaveDate" + index;
    let reasonID = "leaveReason" + index;
    let typeField = document.getElementById(typeID);
    let dateField = document.getElementById(dateID);
    let reasonField = document.getElementById(reasonID);
    typeField.value = typeInput;
    dateField.value = dateInput;
    reasonField.value = reasonInput;
    typeField.disabled = false;
    dateField.disabled = false;
    reasonField.disabled = false;
    let optionID = "options" + index;
    let optionField = document.getElementById(optionID)
    optionField.innerHTML = `<i onClick="savePost(this, ${index})" class="fas fa-save"></i>`;
};

function savePost (e, index) {
    let typeID = "leaveType" + index;
    let dateID = "leaveDate" + index;
    let reasonID = "leaveReason" + index;
    let typeField = document.getElementById(typeID);
    let dateField = document.getElementById(dateID);
    let reasonField = document.getElementById(reasonID);
    console.log(index, typeField.value, dateField.value, reasonField.value);
    dataArray[index].type = typeField.value;
    dataArray[index].date = dateField.value;
    dataArray[index].reason = reasonField.value;
    console.log(dataArray);
    populateTable();
}

function deletePost (e, index) {
    e.parentElement.parentElement.remove();
    dataArray.splice(index, 1);
    populateTable();
};


window.addEventListener('DOMContentLoaded', () => {
    AppAPI.fetchLeaves().then(resp => {
        console.log(resp);
        AppHelpers.insertRows(dtBody, resp)
        // AppHelpers.triggerDT(dt, dtBody)
    })
})
