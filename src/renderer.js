const fileInput = document.getElementById('fileInput');
const audio = new Audio('beep.mp3');
const testButton = document.querySelector('.testButton')
const selectFileButton = document.getElementById('selectFileButton');

window.electronAPI.handleCounter((event, line) => {
    // beep();
    console.log('message: ', line)
    sendMorseMessage(line)
})

// Add an event listener to the button
selectFileButton.addEventListener('click', () => {
    fileInput.click(); // Trigger the file input element
});

// Add an event listener to the file input
fileInput.addEventListener('change', (event) => {
    const selectedFilePath = event.target.value; // Get the selected file path

    // Save the selected file path to localStorage
    localStorage.setItem('selectedFilePath', selectedFilePath);

    // You can display the selected file path or perform other actions here
    console.log(`Selected file path: ${selectedFilePath}`);
});

testButton.addEventListener('click', () => {
    audio.play();
});

function sendMorseMessage (message) {
    if (MorseJs.empty) {
        morseInit()
    }
    MorseJs.Play(message, 20, 800);
}
