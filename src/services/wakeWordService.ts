// Wake Word detection service for "Hey Wasu", "Hi Wasu", "Wasu Love"

export class WakeWordService {
  private recognition: any = null;
  private isListening = false;
  private onWakeWord: (() => void) | null = null;
  private onCommand: ((cmd: string) => void) | null = null;
  private awaitingCommand = false;
  private commandTimeout: any = null;

  constructor(
    onWakeWord: () => void,
    onCommand: (cmd: string) => void
  ) {
    this.onWakeWord = onWakeWord;
    this.onCommand = onCommand;
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      console.warn('SpeechRecognition is not supported on this browser.');
      return;
    }

    try {
      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US'; // English phonetic captures 'hey wasu' very reliably

      this.recognition.onresult = (event: any) => {
        const lastIndex = event.results.length - 1;
        const transcript = event.results[lastIndex][0].transcript.toLowerCase().trim();

        // Check if currently awaiting command after wake word
        if (this.awaitingCommand) {
          if (event.results[lastIndex].isFinal) {
            this.awaitingCommand = false;
            if (this.commandTimeout) clearTimeout(this.commandTimeout);
            this.onCommand?.(transcript);
          }
          return;
        }

        // Check wake words
        const wakeWords = [
          'hey wasu',
          'hi wasu',
          'hy wasu',
          'wasu love',
          'wasu',
          'suno wasu',
          'wasu suno',
        ];

        const matched = wakeWords.some((w) => transcript.includes(w));
        if (matched) {
          this.awaitingCommand = true;
          this.onWakeWord?.();

          // Reset awaiting command after 7 seconds if no command spoken
          if (this.commandTimeout) clearTimeout(this.commandTimeout);
          this.commandTimeout = setTimeout(() => {
            this.awaitingCommand = false;
          }, 7000);
        }
      };

      this.recognition.onerror = (e: any) => {
        if (e.error === 'not-allowed') {
          this.isListening = false;
        }
      };

      this.recognition.onend = () => {
        // Auto-restart if still intended to be listening
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch {
            // Ignore restart error
          }
        }
      };
    } catch (err) {
      console.error('WakeWordService init error:', err);
    }
  }

  public start() {
    if (!this.recognition) return;
    this.isListening = true;
    try {
      this.recognition.start();
    } catch {
      // Already running
    }
  }

  public stop() {
    this.isListening = false;
    this.awaitingCommand = false;
    if (this.commandTimeout) clearTimeout(this.commandTimeout);
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore
      }
    }
  }

  public getIsListening() {
    return this.isListening;
  }
}
