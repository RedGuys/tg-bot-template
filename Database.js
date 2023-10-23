const Pool = require('pg').Pool;
const Cache = require("rgcache").Cache;

module.exports = class Database {
    static _instance = new Database();

    static getInstance() {
        return this._instance;
    }

    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 5
    });

    users = new Cache({
        ttl: 60 * 60 * 24,
        cacheLimit: 500,
        loader: this._getUser,
        thisArg: this
    });

    async createUser(id, name) {
        let client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            await client.query('INSERT INTO users (id, name) VALUES ($1, $2)', [id, name]);
            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }

    async getUser(id) {
        return await this.users.get(id);
    }

    async _getUser(id) {
        let client = await this.pool.connect();
        try {
            let result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
            return result.rows[0];
        } finally {
            client.release();
        }
    }
}