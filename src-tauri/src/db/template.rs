use super::get_conn;
use rusqlite::Error::QueryReturnedNoRows;
use rusqlite::{params, Error, Result};

use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct Template {
    pub id: Option<usize>,
    pub name: Option<String>,
    pub attributes: Option<String>,
    pub content: Option<String>,
}

pub fn all(p: &super::super::ListTemplateReq) -> Result<Vec<Template>, Error> {
    let mut resp: Vec<Template> = Vec::new();
    let conn = get_conn();
    let mut stmt =
        conn.prepare("SELECT id, name, attributes,content FROM template LIMIT ?1 OFFSET ?2")?;
    // let person_iter = stmt.unwrap().query([]);
    let person_iter = stmt.query_map(params![p.page_size, p.page_num - 1], |row| {
        Ok(Template {
            id: row.get(0)?,
            name: row.get(1)?,
            attributes: row.get(2)?,
            content: row.get(3)?,
        })
    })?;

    for person in person_iter {
        resp.push(person?);
    }

    Ok(resp)
}

pub fn create(t: &Template) -> Result<(), Error> {
    let conn = get_conn();

    conn.execute(
        "INSERT INTO template (name, attributes,content) VALUES (?1, ?2,?3)",
        (&t.name, &t.attributes, &t.content),
    )?;

    Ok(())
}

pub fn update(t: &Template) -> Result<(), Error> {
    let conn = get_conn();

    conn.execute(
        "UPDATE template SET name = ?1 , attributes = ?2 , content = ?3 WHERE id = ?4",
        (&t.name, &t.attributes, &t.content, &t.id),
    )?;

    Ok(())
}

pub fn find_one(id: usize) -> Result<Option<Template>, Error> {
    let conn = get_conn();
    let mut stmt =
        conn.prepare("SELECT id, name, attributes,content FROM template WHERE id = ?1")?;
    let row: std::result::Result<Option<Template>, Error> = stmt.query_row(params!(id), |row| {
        Ok(Some(Template {
            id: row.get(0)?,
            name: row.get(1)?,
            attributes: row.get(2)?,
            content: row.get(3)?,
        }))
    });
    if let Err(QueryReturnedNoRows) = row {
        return Ok(None);
    }
    row
}

pub fn del_by_id(id: usize) -> Result<(), Error> {
    let conn = get_conn();

    conn.execute("DELETE FROM template WHERE id = ?1", params!(id))?;

    Ok(())
}
