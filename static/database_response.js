class LeaveDatabase_API {
    async insertLeaves(stringifiedJSON) {
        const url = '/insert'
        const body = {
            method: 'POST',
            body: stringifiedJSON,
        }
        const response = await fetch(url, body)
        const result = await response.json()
        return result
  }
}