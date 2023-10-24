const fileInput = document.getElementById('fileInput');
const audio = new Audio('beep.mp3');
const testButton = document.querySelector('.testButton')
const selectFileButton = document.getElementById('selectFileButton');
const filePath = document.querySelector('.filePath');

const selectSoundFileButton = document.getElementById('selectSoundFileButton');
const soundFilePath = document.querySelector('.soundFilePath');
const soundFileInput = document.getElementById('soundFileInput');

let audioVolume = 0.2

const slider = document.getElementById("slider");
const sliderValue = document.getElementById("sliderValue");

// Function to update the variable value when the slider is moved
function updateValue() {
    audioVolume = slider.value;
    sliderValue.textContent = audioVolume * 100 + '%';
}

// Add an event listener to the slider to call the updateValue function when it changes
slider.addEventListener("input", updateValue);
// Call the updateValue function initially to set the initial value
updateValue();

window.electronAPI.handleCounter((event, line) => {
    console.log('message: ', line)
    sendMorseMessage(line)
})

selectFileButton.addEventListener('click', () => {
    fileInput.click(); // Trigger the file input element
});

selectSoundFileButton.addEventListener('click', () => {
    soundFileInput.click(); // Trigger the file input element
});

fileInput.addEventListener('change', () => {
    const selectedFilePath = fileInput.files[0].path;
    // Save the selected file path to localStorage
    localStorage.setItem('selectedFilePath', selectedFilePath);
    filePath.textContent = selectedFilePath
});

soundFileInput.addEventListener('change', () => {
    const selectedSoundFilePath = soundFileInput.files[0].path;
    // Save the selected file path to localStorage
    localStorage.setItem('selectedSoundFilePath', selectedSoundFilePath);
    soundFilePath.textContent = selectedSoundFilePath
    window.electronAPI.setTitle(selectedSoundFilePath)

});

testButton.addEventListener('click', () => {
    morseInit(audioVolume)
//    audio.volume = audioVolume;
    sendMorseMessage("v")
});

function sendMorseMessage (message) {
    morseInit(audioVolume)
    MorseJs.Play(message, 20, 800);
}
