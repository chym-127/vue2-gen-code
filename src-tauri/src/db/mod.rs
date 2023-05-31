pub mod template;
pub mod renderer;

use lazy_static::lazy_static;
use rusqlite::{Connection, Result};
use serde::{Deserialize, Serialize};
lazy_static! {
    static ref DB_FILE: &'static str = "E:\\database\\data.db";
}

#[derive(Debug, Deserialize, Serialize)]
struct Total(usize);

pub fn init() -> Result<()> {
    let conn: Connection = Connection::open(*DB_FILE)?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS template (
            id   INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            attributes TEXT,
            content BLOB  NOT NULL
        )",
        (), // empty list of parameters.
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS renderer (
            id   INTEGER PRIMARY KEY AUTOINCREMENT,
            teamlate_id INTEGER,
            name VARCHAR(255) NOT NULL,
            additional TEXT,
            content BLOB  NOT NULL
        )",
        (), // empty list of parameters.
    )?;
    Ok(())
}

pub fn get_conn() -> Connection {
    let res: std::result::Result<Connection, rusqlite::Error> = Connection::open(*DB_FILE);
    res.unwrap()
}
