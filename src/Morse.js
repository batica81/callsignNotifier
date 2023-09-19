/*!
 * MorseJs JavaScript Object
 * https://github.com/JoshuaCarroll/MorseJs/
 *
 * Copyright Joshua Carroll and other contributors
 * Released under the MIT license
 */
let MorseJs = { empty: true }

function morseInit (gainVAlue) {
  MorseJs = {
    _wpm: 20,
    setWpm: function (wpm) {
      this._wpm = wpm
      this._ditLength = 1.2 / this._wpm
      this._dahLength = (1.2 / this._wpm) * 3
    },
    _context: {},
    _oscillator: {},
    _gain: {},
    init: function () {
      this._context = new (window.AudioContext || window.webkitAudioContext)()
      this._ditLength = 1.2 / this._wpm
      this._dahLength = (1.2 / this._wpm) * 3
      this._oscillator = this._context.createOscillator()
      this._oscillator.type = 'sine'
      this._oscillator.frequency.value = 800

      this._gain = this._context.createGain()
      this._gain.gain.value = 0

      this._oscillator.connect(this._gain) // Sound to gain
      this._gain.connect(this._context.destination) // Gain to output
      this._start()

      return this
    },
    _start: function () {
      this._oscillator.start()
    },
    _stop: function () {
      this._oscillator.stop()
    },
    _ditLength: 0,
    _dahLength: 0,
    _playCharacter: function (character, startTime) {
      for (let i = 0; i < character.length; i++) {
        switch (character[i]) {
          case '.':
            this._gain.gain.setValueAtTime(gainVAlue, startTime)
            startTime += this._ditLength
            this._gain.gain.setValueAtTime(0.0, startTime)
            break
          case '-':
            this._gain.gain.setValueAtTime(gainVAlue, startTime)
            startTime += this._dahLength
            this._gain.gain.setValueAtTime(0.0, startTime)
            break
        }

        if (i + 1 < character.length) {
          startTime += this._ditLength // Inter-element gap
        }
      }
      return startTime
    },
    Play: function (words, speed, toneFrequency) {
      let startTime = this._context.currentTime

      if (speed != null) {
        this.setWpm(speed)
      }

      if (toneFrequency != null) {
        if (this._oscillator.frequency.value !== toneFrequency) {
          startTime += 1
        }
        this._oscillator.frequency.value = toneFrequency
      }

      words = words.toUpperCase()

      for (let i = 0; i < words.length; i++) {
        if (words[i] === ' ') {
          startTime += this._ditLength * 7 // Medium gap (between words)
        } else if (this.codes[words[i]] !== undefined) {
          startTime = this._playCharacter(this.codes[words[i]], startTime)
          startTime += this._ditLength * 3 // Short gap (between letters)
        }
      }

      // Returns the length of the message in seconds.
      return startTime - this._context.currentTime
    },
    codes: {
      A: '.-',
      B: '-...',
      C: '-.-.',
      D: '-..',
      E: '.',
      F: '..-.',
      G: '--.',
      H: '....',
      I: '..',
      J: '.---',
      K: '-.-',
      L: '.-..',
      M: '--',
      N: '-.',
      O: '---',
      P: '.--.',
      Q: '--.-',
      R: '.-.',
      S: '...',
      T: '-',
      U: '..-',
      V: '...-',
      W: '.--',
      X: '-..-',
      Y: '-.--',
      Z: '--..',

      1: '.----',
      2: '..---',
      3: '...--',
      4: '....-',
      5: '.....',
      6: '-....',
      7: '--...',
      8: '---..',
      9: '----.',
      0: '-----',

      '.': '.-.-.-',
      ',': '--..--',
      '?': '..--..',
      "'": '.----.',
      '!': '-.-.--',
      '/': '-..-.',
      '(': '-.--.',
      ')': '-.--.-',
      '&': '.-...',
      ':': '---...',
      ';': '-.-.-.',
      "-": "-....-",
      "+": ".-.-."
    }
  }.init()
}
