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

let newSettings = {}

const slider = document.getElementById("slider");
const sliderValue = document.getElementById("sliderValue");

// Function to update the variable value when the slider is moved
function updateValue() {
    // send to backend to be saved
    window.electronAPI.setConfigData(newSettings)
}

// Add an event listener to the slider to call the updateValue function when it changes
slider.addEventListener("input", () => {
    let audioVolume = slider.value / 100;
    sliderValue.textContent = (Math.floor(audioVolume * 100 )).toString() + '%';
    newSettings.audioVolume = audioVolume
    updateValue()
});

window.electronAPI.handleCallSign((event, line) => {
    console.log('message: ', line)
    sendMorseMessage(line)
})

// Will be triggered on startup by backend
window.electronAPI.storageToRender((event, dataFromStorage) => {
    newSettings = dataFromStorage;

    //update views
    sliderValue.textContent = (Math.floor(newSettings.audioVolume * 100 )).toString() + '%';
    slider.value = newSettings.audioVolume * 100
    callsignValue.textContent = newSettings.callSignText;
    filePath.textContent = newSettings.selectedFilePath

    console.log(dataFromStorage)
})

selectFileButton.addEventListener('click', () => {
    fileInput.click(); // Trigger the file input element
});

confirmCallsign.addEventListener('click', () => {
    let callSignText = callsignInput.value.toUpperCase().trim();
    callsignValue.textContent = callSignText
    newSettings.callSignText = callSignText
    window.electronAPI.setCallSign(callSignText)
    updateValue()
});

selectSoundFileButton.addEventListener('click', () => {
    soundFileInput.click(); // Trigger the file input element
});

fileInput.addEventListener('change', () => {
    const selectedFilePath = fileInput.files[0].path;
    filePath.textContent = selectedFilePath
    newSettings.selectedFilePath = selectedFilePath
    window.electronAPI.setAllTxtFilePath(selectedFilePath)
    updateValue()
});

soundFileInput.addEventListener('change', () => {
    const selectedSoundFilePath = soundFileInput.files[0].path;
    soundFilePath.textContent = selectedSoundFilePath
    newSettings.selectedSoundFilePath = selectedSoundFilePath
    window.electronAPI.setSoundFilePath(selectedSoundFilePath)
});

testButton.addEventListener('click', () => {
    morseInit(newSettings.audioVolume)
    sendMorseMessage("v")
});

function sendMorseMessage (message) {
    morseInit(newSettings.audioVolume)
    MorseJs.Play(message, 20, 800);
}

function playSoundFile () {
    // play audio file
}
