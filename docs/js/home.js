const letters = ['S', 'E', 'D', 'Y', '!'];

let index = 0;
setInterval(() => {
    if (index >= letters.length) {
        index = 0;
    }

    document.body.innerHTML = letters[index];
    index++;
}, 1000);
