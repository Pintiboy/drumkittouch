var numOfButtons = document.querySelectorAll(".drum").length;
window.AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();

let keyToSoundMap = {
  w: 'sounds/snare.mp3',
  a: 'sounds/kick-bass.mp3',
  s: 'sounds/crash.mp3',
  d: 'sounds/tom-1.mp3',
  j: 'sounds/tom-2.mp3',
  k: 'sounds/tom-3.mp3',
  l: 'sounds/tom-4.mp3',
};

function loadSound(url) {
  return window.fetch(url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => {
      return new Promise((resolve, reject) => {
        context.decodeAudioData(arrayBuffer, (buffer) => {
          resolve(buffer);
          }, (e) => { reject(e); }
        );
      });
    }
  );
}

Object.entries(keyToSoundMap).forEach(async entry => {
  await loadSound(entry[1]).then(audioBuffer => keyToSoundMap[entry[0]] = audioBuffer);
})

for (var i = 0; i < numOfButtons; i++) {
  document.querySelectorAll(".drum")[i].addEventListener("click", function(evt) {
    handleCharacter(this.innerHTML);
  });
}

function handleClick() {
  handleCharacter(this.innerHTML);
}

document.addEventListener("keydown", function(event) {
  handleCharacter(event.key);
});

const playSound = (buffer, time) => {
  if (typeof buffer !== 'object') return;
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(time);
};

function handleCharacter(char) {
  console.log(char);
  animateButton(char);
  playSound(keyToSoundMap[char])
}

function animateButton(currentKey) {

	console.log(currentKey);

  var activeButton = document.querySelector("." + currentKey);
  activeButton.classList.add("pressed");
  
  setTimeout(function() {
    activeButton.classList.remove("pressed");
  }, 100);

}
