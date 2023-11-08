const fileInput = document.getElementById('fileInput');
const audio = new Audio('beep.mp3');
const testButton = document.querySelector('.testButton')
const selectFileButton = document.getElementById('selectFileButton');
const filePath = document.querySelector('.filePath');
const confirmCallsign = document.querySelector('#confirmCallsign');
const callsignInput = document.querySelector('.callsignInput');
const callsignValue = document.querySelector('.callsignValue');

const selectSoundFileButton = document.getElementById('selectSoundFileButton');
const soundFilePath = document.querySelector('.soundFilePath');
const soundFileInput = document.getElementById('soundFileInput');

let audioVolume = 0.1
let newSettings = {}

const slider = document.getElementById("slider");
const sliderValue = document.getElementById("sliderValue");

if (localStorage.getItem("callsignNotifierSettings")) {

    oldSettings = localStorage.getItem("callSignNotifierSettings")

}
// localStorage.setItem("callSignNotifierSettings", "testValue");



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

confirmCallsign.addEventListener('click', () => {
    let callSignText = callsignInput.value.toUpperCase().trim();
    callsignValue.textContent = callSignText
    newSettings.callSignText = callSignText
    localStorage.setItem(callSignNotifierSettings, newSettings)
    window.electronAPI.setCallSign(callSignText)
});

selectSoundFileButton.addEventListener('click', () => {
    soundFileInput.click(); // Trigger the file input element
});

fileInput.addEventListener('change', () => {
    const selectedFilePath = fileInput.files[0].path;
    // Save the selected file path to localStorage
    localStorage.setItem('selectedFilePath', selectedFilePath);
    filePath.textContent = selectedFilePath
    newSettings.selectedFilePath = selectedFilePath
    localStorage.setItem(callSignNotifierSettings, newSettings)
    window.electronAPI.setAllTxtFilePath(selectedFilePath)
});

soundFileInput.addEventListener('change', () => {
    const selectedSoundFilePath = soundFileInput.files[0].path;
    // Save the selected file path to localStorage
    localStorage.setItem('selectedSoundFilePath', selectedSoundFilePath);
    soundFilePath.textContent = selectedSoundFilePath
    newSettings.selectedSoundFilePath = selectedSoundFilePath
    localStorage.setItem(callSignNotifierSettings, newSettings)
    window.electronAPI.setSoundFilePath(selectedSoundFilePath)

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

function playSoundFile () {
    // play audio file

}
