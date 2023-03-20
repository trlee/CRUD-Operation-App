class LeaveDatabase_Helpers {
    insertRows(id, data){
        const target = document.querySelector('#'+id)
        target.innerHTML = ''
        data.forEach(element =>{
            console.log(element)
            let opt = document.createElement('tr')
            opt.id = element.ID
            opt.innerHTML = `<td>${element.ID}</td>
                            <td>${element.Type}</td>
                            <td>${element.Date}</td>
                            <td>${element.Reason}</td>
                            <td>Edit</td>
                            <td>Delete</td>`
            target.appendChild(opt)
        })
    }

    // triggerDT(dt, dtBody){
    //     const table = $('#'+dt).DataTable()
    // }
}