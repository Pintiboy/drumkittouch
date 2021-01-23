let context;
let keyToSoundMap = {
  w: 'sounds/snare.mp3',
  a: 'sounds/kick-bass.mp3',
  s: 'sounds/crash.mp3',
  d: 'sounds/tom-1.mp3',
  j: 'sounds/tom-2.mp3',
  k: 'sounds/tom-3.mp3',
  l: 'sounds/tom-4.mp3',
};

/**
 * Load sound into AudioBuffer
 * @param url
 * @returns {Promise<AudioBuffer>}
 */
function loadSound(url) {
  return window.fetch(url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => {
      return new Promise((resolve, reject) => {
        context.decodeAudioData(arrayBuffer, (buffer) => {
          resolve(buffer);
        }, (e) => { reject(e); });
      })
    });
}

/**
 * Initialize sound map
 * @returns {Promise<void>}
 */
async function initSoundMap() {
  Object.entries(keyToSoundMap).forEach(async entry => {
    await loadSound(entry[1]).then(audioBuffer => keyToSoundMap[entry[0]] = audioBuffer);
  })
}

/**
 * Initialise app
 * @returns {Promise<void>}
 */
async function init() {
  if (context) return;

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  await initSoundMap();
}

/**
 * Play Sound
 * @param buffer
 * @param time
 */
const playSound = (buffer, time) => {
    if (typeof buffer !== 'object') return;

    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(time);
};

/**
 * Play sound and highlight the pressed
 * @param letter
 */
const processInteraction = letter => {
    // Play audio
    const sound = document.querySelector(`audio[data-key=${letter}]`);
    if (!sound) return;

    context
        ? playSound(keyToSoundMap[letter])
        : sound.cloneNode().play();


    // Highlight button
    const elem = document.getElementById(letter);
    elem.classList.add('active');
    setTimeout(() => elem.classList.remove('active'), 100);
};

document.addEventListener('keydown', async key => {
    await init();
    const letter = key.key.toLocaleLowerCase();
    /[asdfghjkl]/.test(letter) && processInteraction(letter);
});

document.addEventListener('click', async ev => {
    await init();
    const letter = ((ev.target.closest('div') || {}).id || '').toLocaleLowerCase();
    /[asdfghjkl]/.test(letter) && processInteraction(letter);
});
