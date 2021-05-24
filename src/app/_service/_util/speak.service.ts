import { Injectable } from '@angular/core';
import Speech from 'speak-tts';
@Injectable({
  providedIn: 'root'
})
export class SpeakService {
  speech: any;

  public activeVoiceReading: boolean = false;

  constructor() {
    this.speech = new Speech() // will throw an exception if not browser supported
    if(this.speech.hasBrowserSupport()) { // returns a boolean
      console.log("speech synthesis supported")
    }
    this.speech.init(  {
      'volume': 1,
      'lang': 'fr-FR',
      'rate': 1,
      'pitch': 1,
      'voice':'Google français',
      'splitSentences': true,
      'listeners': {
        'onvoiceschanged': (voices) => {
          console.log("Event voiceschanged", voices)
        }
      }
    }).then((data) => {
      console.log("Speech is ready, voices are available", data)
    }).catch(e => {
      console.error("An error occured while initializing : ", e)
    });
  }

  readText(textToRead:string){
    this.speech.cancel();
    if (this.activeVoiceReading) {
      this.speech.speak({
        text: textToRead
      }).then(() => {
        console.log("Success !")
      }).catch(e => {
        console.error("An error occurred :", e)
      })
    }
  }

  mute() { this.speech.pause();}
  voiceUp() { this.speech.resume();}
}
