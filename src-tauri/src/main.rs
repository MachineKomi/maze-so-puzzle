// Prevent an extra console window from opening beside the game on Windows.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    maze_so_puzzle_lib::run();
}
