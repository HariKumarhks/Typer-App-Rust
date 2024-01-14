import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { invoke } from "@tauri-apps/api/tauri";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  sleepBetweenChar = 100;
  greetingMessage = "";
  enter = false;
  tab = false;
  sleepTime = 1.5;
  text = "";
  selectedText = "";

  selectTextMain = ["harikumarjc007@gmail.com", "s.harikumar08@gmail.com"];
  selectTextNew: string[] = [];

  type(): void {
    // event.preventDefault();
    console.log("TEXT :: ", this.text);
    console.log("sleep :: ", (this.sleepTime * 1000).toString());

    if (this.sleepTime > 9999) {
      this.sleepTime = 5;
      console.log("Sleep Time is too long, so changind to 5s");
    }

    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

    setTimeout(() => {
      /* // Single Invoke
      invoke<string>("start_typing", {
        // sleeptime: ((this.sleepTime * 1000) | 0).toString(),
        sleeptime: (~~this.sleepTime * 1000).toString(),
        text: this.text,
      }).then((resp) => {
        console.log("POST TYPE :: ", resp);
      }); */

      // Partially Invoke
      [...this.text].forEach(async (char) => {
        invoke<string>("start_typing", {
          // sleeptime: ((this.sleepTime * 1000) | 0).toString(),
          sleeptime: (~~this.sleepTime * 1000).toString(),
          text: char,
        }).then((_) => {});
        // sleepBetweenChar
        await new Promise((resolve) =>
          setTimeout(resolve, this.sleepBetweenChar)
        );
      });
    }, this.sleepTime * 1000);
  }

  clearSleep() {
    this.sleepTime = 0;
  }

  optionSelected(selectedOption: string) {
    this.selectedText = selectedOption;
  }

  addSelected() {
    if (this.selectedText !== "") {
      this.text = this.selectedText;
    }
  }

  saveText() {
    this.selectTextNew.push(this.text);
  }

  clearSaved() {
    this.selectTextNew = [];
  }

  clearText() {
    this.text = "";
  }

  toggleEnter() {
    this.enter = !this.enter;
    this.tab = this.enter ? false : this.tab;
  }

  toggleTab() {
    this.tab = !this.tab;
    this.enter = this.tab ? false : this.enter;
  }
}
