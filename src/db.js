import io from 'socket.io-client'

class DB {

    socket = null

    constructor() {
        this.socket = io('localhost:3001')
    }

    setListener(collection, action) {
        console.log("fff")
        this.socket.off(collection, action)
        this.socket.on('users', action)
        this.socket.emit('/findAll', collection)
    }

    removeListener(collection, action) {
        this.socket.off(collection, action)
    }

    _collection = null

    collection(collection) {
        this._collection = collection
        return this
    }

    async findAll() {
        console.log('url = ', this._collection)
        const response = await fetch('/api/' + this._collection)
        const json = await response.json()
        return json
    }
}

const db = new DB()
export default db