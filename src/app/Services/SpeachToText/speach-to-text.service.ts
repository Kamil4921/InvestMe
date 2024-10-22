import { Injectable } from '@angular/core';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class SpeachToTextService {
  recognition = new webkitSpeechRecognition();
  text = '';
  private isStoppedRecording = false;

  init(): void{
    this.recognition.interimResults = true;
    this.recognition.lang = "pl-PL";

    this.recognition.addEventListener('result', (e: any) =>{
      const transcript = e.results[0][0].transcript;
    });
  }

  start() : void{
    this.isStoppedRecording = false;
    this.recognition.start();

    this.recognition.addEventListener('end', () => {
      if (this.isStoppedRecording) {
        this.recognition.stop();
        console.log("End speach recognition");
      }
      else {
        this.recognition.start();
      }
    });
  }

  stop() : void{
    this.isStoppedRecording = true;
    this.recognition.stop();
    console.log("End speach recognition");
  }
}

