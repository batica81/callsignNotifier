const fileInput = document.getElementById('fileInput');
const audio = new Audio('beep.mp3');
const testButton = document.querySelector('.testButton')
const selectFileButton = document.getElementById('selectFileButton');
const filePath = document.querySelector('.filePath');

let audioVolume = 0.5

var slider = document.getElementById("slider");
var sliderValue = document.getElementById("sliderValue");

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

fileInput.addEventListener('change', () => {
    const selectedFilePath = document.getElementById("fileInput").files[0].path;
    // Save the selected file path to localStorage
    localStorage.setItem('selectedFilePath', selectedFilePath);
    filePath.textContent = selectedFilePath
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
