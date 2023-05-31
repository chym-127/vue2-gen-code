// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
mod db;
use crate::db::renderer;
use crate::db::template;
use serde::{Deserialize, Serialize};

fn main() {
    let _ = db::init();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            handle_create_teamlate,
            handle_list_teamlate,
            handle_update_teamlate,
            handle_del_teamlate,
            handle_create_renderer,
            handle_list_renderer,
            handle_update_renderer,
            handle_del_renderer,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
#[derive(Debug, Deserialize, Serialize)]
struct Resp<T> {
    data: Option<T>,
    message: String,
    code: u8,
}

#[derive(Debug, Deserialize, Serialize)]
struct Empty([i8; 0]);

#[tauri::command]
fn handle_create_teamlate(t: template::Template) -> Resp<Empty> {
    let _ = template::create(&t);
    Resp {
        data: None,
        message: "success".to_string(),
        code: 200,
    }
}

#[tauri::command]
fn handle_update_teamlate(t: template::Template) -> Resp<Empty> {
    let row = template::find_one(t.id.unwrap());
    if let Ok(Some(_)) = row {
        let r = template::update(&t);
        if let Ok(_) = r {
            Resp {
                data: None,
                message: "success".to_string(),
                code: 200,
            }
        } else {
            Resp {
                data: None,
                message: "操作失败".to_string(),
                code: 100,
            }
        }
    } else {
        Resp {
            data: None,
            message: "记录不存在".to_string(),
            code: 101,
        }
    }
}

#[tauri::command]
fn handle_del_teamlate(id: usize) -> Resp<Empty> {
    let _ = template::del_by_id(id);
    Resp {
        data: None,
        message: "success".to_string(),
        code: 200,
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ListTemplateReq {
    page_size: usize,
    page_num: usize,
}

#[tauri::command]
fn handle_list_teamlate(req: ListTemplateReq) -> Resp<Vec<template::Template>> {
    let resp = template::all(&req);
    Resp {
        data: Some(resp.unwrap()),
        message: "success".to_string(),
        code: 200,
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ListRendererReq {
    page_size: usize,
    page_num: usize,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ListAns<T> {
    items: Option<T>,
    total: usize,
}

#[tauri::command]
fn handle_list_renderer(req: ListRendererReq) -> Resp<ListAns<Vec<renderer::Renderer>>> {
    let resp = renderer::all(&req).unwrap();
    Resp {
        data: Some(ListAns {
            items: Some(resp.0),
            total: resp.1,
        }),
        message: "success".to_string(),
        code: 200,
    }
}

#[tauri::command]
fn handle_create_renderer(t: renderer::Renderer) -> Resp<Empty> {
    let _ = renderer::create(&t);
    Resp {
        data: None,
        message: "success".to_string(),
        code: 200,
    }
}

#[tauri::command]
fn handle_update_renderer(t: renderer::Renderer) -> Resp<Empty> {
    let row = renderer::find_one(t.id.unwrap());
    println!("{:?}", row);
    if let Ok(Some(_)) = row {
        let r = renderer::update(&t);
        if let Ok(_) = r {
            Resp {
                data: None,
                message: "success".to_string(),
                code: 200,
            }
        } else {
            Resp {
                data: None,
                message: "操作失败".to_string(),
                code: 100,
            }
        }
    } else {
        Resp {
            data: None,
            message: "记录不存在".to_string(),
            code: 101,
        }
    }
}

#[tauri::command]
fn handle_del_renderer(id: usize) -> Resp<Empty> {
    let _ = renderer::del_by_id(id);
    Resp {
        data: None,
        message: "success".to_string(),
        code: 200,
    }
}
