use super::get_conn;
use rusqlite::Error::QueryReturnedNoRows;
use rusqlite::{params, Error, Result};

use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct Renderer {
    pub id: Option<usize>,
    pub name: Option<String>,
    pub teamlate_id: Option<usize>,
    pub additional: Option<String>,
    pub content: Option<String>,
}

pub fn all(p: &super::super::ListRendererReq) -> Result<Vec<Renderer>, Error> {
    let mut resp: Vec<Renderer> = Vec::new();
    let conn = get_conn();
    let mut stmt = conn.prepare(
        "SELECT id, name, teamlate_id,content,additional FROM renderer LIMIT ?1 OFFSET ?2",
    )?;
    // let person_iter = stmt.unwrap().query([]);
    let person_iter = stmt.query_map(params![p.page_size, p.page_num - 1], |row| {
        Ok(Renderer {
            id: row.get(0)?,
            name: row.get(1)?,
            teamlate_id: row.get(2)?,
            content: row.get(3)?,
            additional: row.get(4)?,
        })
    })?;

    for person in person_iter {
        resp.push(person?);
    }

    Ok(resp)
}

pub fn create(t: &Renderer) -> Result<(), Error> {
    let conn = get_conn();

    conn.execute(
        "INSERT INTO renderer (name, teamlate_id,content,additional) VALUES (?1, ?2,?3,?4)",
        (&t.name, &t.teamlate_id, &t.content, &t.additional),
    )?;

    Ok(())
}

pub fn update(t: &Renderer) -> Result<(), Error> {
    let conn = get_conn();

    conn.execute(
        "UPDATE renderer SET name = ?1 , teamlate_id = ?2 , content = ?3,additional=?4 WHERE id = ?5",
        (&t.name, &t.teamlate_id, &t.content, &t.additional, &t.id),
    )?;

    Ok(())
}

pub fn find_one(id: usize) -> Result<Option<Renderer>, Error> {
    let conn = get_conn();
    let mut stmt = conn
        .prepare("SELECT id, name, teamlate_id,content,additional FROM renderer WHERE id = ?1")?;
    let row: std::result::Result<Option<Renderer>, Error> = stmt.query_row(params!(id), |row| {
        Ok(Some(Renderer {
            id: row.get(0)?,
            name: row.get(1)?,
            teamlate_id: row.get(2)?,
            content: row.get(3)?,
            additional: row.get(4)?,
        }))
    });
    if let Err(QueryReturnedNoRows) = row {
        return Ok(None);
    }
    row
}

pub fn del_by_id(id: usize) -> Result<(), Error> {
    let conn = get_conn();

    conn.execute("DELETE FROM renderer WHERE id = ?1", params!(id))?;

    Ok(())
}
