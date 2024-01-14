/*
Created on Sun Jan 14 16:50:03 2024
@author: Hari
*/

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use enigo::{Enigo, KeyboardControllable};
use std::{env, thread::sleep, time::Duration};

const DEFAULT_SLEEP_TIME: u64 = 1500;

fn init() {
    env::set_var("RUST_BACKTRACE", "1");
    use ansi_term::Colour::{Black, Blue, Purple, Red, Yellow};
    use ansi_term::Style;
    use log::Level;
    use std::io::Write;
    let styles = |record: &log::Record<'_>| {
        Style::new().on(Black).fg(match record.level() {
            Level::Error => Red,
            Level::Warn => Yellow,
            Level::Info => Blue,
            _ => Purple,
        })
    };
    env_logger::Builder::new()
        .format(move |buf, record| {
            writeln!(
                buf,
                // "{} {}:{} [{}] - {}",
                "{} {}\n{}",
                // chrono::Local::now().format("D=%d/%m/%Y;T=%H:%M:%S.%3f"),
                styles(record).underline().paint(format!(
                    "{}:{}",
                    record.file().unwrap_or("unknown_Location").to_string(),
                    &record.line().unwrap_or(0).to_string(),
                    // &record.level().to_string()
                )),
                styles(record).paint(format!("[{}] -", &record.level().to_string())),
                record.args().to_string()
            )
        })
        .filter(None, log::LevelFilter::Info)
        .init();
}

fn main() {
    init();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start_typing])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn start_typing(sleeptime: &str, text: &str) -> bool {
    // fn start_typing(text: &str) -> bool {
    let mut sim = Enigo::new();
    let type_text = text.trim();

    // Select the particular area...
    // sim.mouse_move_to(500, 200);
    // sim.mouse_down(MouseButton::Left);
    // sim.mouse_move_relative(100, 100);
    // sim.mouse_up(MouseButton::Left);
    // let sleep_time = "1500";

    // log::info!("GOT INPUT {sleeptime} :: `{}` \n\n\n", type_text);

    // sleep(Duration::from_millis(
    //     sleeptime.parse::<u64>().unwrap_or(DEFAULT_SLEEP_TIME),
    // ));

    sim.key_sequence(type_text);

    true
}
