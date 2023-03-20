const broker = 'http://localhost:8080/'

class LeaveDatabase_API {

    // Insert Leaves
    async insertLeaves(stringifiedJSON) {
        const url =  broker + 'insert/'
        const body = {
            method: 'POST',
            body: stringifiedJSON,
        }
        const response = await fetch(url, body)
        const result = await response.json()
        return result
    }

    // Fetch Leaves
    async fetchLeaves() {
        const url = broker + 'leave/get/all/'
        const response = await fetch(url)
        const result = await response.json()
        return result
    }
}