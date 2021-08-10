const db = require('../db');
const bcrypt = require("bcrypt");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require("../expressError");

const BCRYPT_WORK_FACTOR = 14;

class User {
    /** User class will have register and authentication methods.  
     * User=>register=> upadate database. 
     * user=>login=>checks the username and hased password  stored in database.
    */

    

    static async register({ username, password, firstname, lastname } ) {
        
        
        
        const duplicateCheck = await db.query(
            `SELECT username
            From users
            WHERE username =$1`,[username]
        );

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate username: ${username}`);
        }

        const hasedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        console.log(hasedPassword);

        const result = await db.query(
            `INSERT INTO users
            (
                username,
                password,
                firstname,
                lastname
            )
            VALUES ($1,$2,$3,$4)
            RETURNING username, firstname, lastname`,[username,hasedPassword,firstname,lastname],
        );
        const user = result.rows[0];
        return user;
    }

    static async userAuthenticate({ username, password } ) {
        // try to find user first 
        const result = await db.query(
            `SELECT username, password
            FROM users
            WHERE username = $1`,[username]
        );
        const user = result.rows[0];
        console.log(user);
        if (user) {
            //compare the password to a new hash from password
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
                delete user.password;
                return user;
            }
        }
        throw new UnauthorizedError("Invalid username/Password");
        
    }


}

module.exports = User