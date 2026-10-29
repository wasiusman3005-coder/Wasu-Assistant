// Continuous Always-On Voice Engine for WASU LOVE Cyber Jarvis
// User never needs to type or press buttons: speaking triggers instant execution.

export class ContinuousVoiceEngine {
  private recognition: any = null;
  private isActive = false;
  private isProcessing = false;
  private onInterimText: (text: string) => void;
  private onFinalCommand: (text: string) => void;
  private onStateChange: (listening: boolean) => void;

  constructor(
    onInterimText: (text: string) => void,
    onFinalCommand: (text: string) => void,
    onStateChange: (listening: boolean) => void
  ) {
    this.onInterimText = onInterimText;
    this.onFinalCommand = onFinalCommand;
    this.onStateChange = onStateChange;
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      console.warn('SpeechRecognition not available in this browser environment');
      return;
    }

    try {
      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      // 'ur-PK' handles Pakistani Urdu phonetics and Roman Urdu names accurately
      this.recognition.lang = 'ur-PK';

      this.recognition.onstart = () => {
        this.onStateChange(true);
      };

      this.recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }

        if (interim) {
          this.onInterimText(interim);
        }

        if (final && final.trim().length > 1) {
          const command = final.trim();
          this.onInterimText(command);
          this.onFinalCommand(command);
        }
      };

      this.recognition.onerror = (e: any) => {
        // Auto-recover from silence or transient network issues
        if (e.error !== 'not-allowed') {
          setTimeout(() => {
            if (this.isActive) this.restart();
          }, 400);
        }
      };

      this.recognition.onend = () => {
        // Continuous always-on loop: restart if supposed to be active
        if (this.isActive) {
          setTimeout(() => {
            this.restart();
          }, 300);
        } else {
          this.onStateChange(false);
        }
      };
    } catch (err) {
      console.error('Error initializing SpeechRecognition:', err);
    }
  }

  public start() {
    this.isActive = true;
    if (!this.recognition) return;
    try {
      this.recognition.start();
    } catch {
      // Already running
    }
  }

  public stop() {
    this.isActive = false;
    if (!this.recognition) return;
    try {
      this.recognition.stop();
    } catch {
      // Ignore
    }
    this.onStateChange(false);
  }

  private restart() {
    if (!this.isActive || !this.recognition) return;
    try {
      this.recognition.start();
    } catch {
      // Ignore
    }
  }

  public setProcessing(processing: boolean) {
    this.isProcessing = processing;
  }
}
