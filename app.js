//for testing MutationObserver is not called when I ran from other devices.

// const observer = new MutationObserver(() => {
//     console.log("callback that runs when observer is triggered");
//   });
  
//   console.log(document.getElementsByTagName('cg-board')[0].childNodes);
//   // call `observe()`, passing it the element to observe, and the options object
//   observer.observe(document.querySelector("cg-board"), {
//     subtree: true,
//     childList: true,
//     attributes: true
//   });




console.log("Starting");
function placeRedRectWithinContainer(container, gridIndexX, gridIndexY, totalSquares) {
    // Get the computed style of the container to find its size
    const containerStyle = window.getComputedStyle(container);
    const containerWidth = parseInt(containerStyle.width);
    const containerHeight = parseInt(containerStyle.height);

    // Calculate the size of each square
    const squareSize = containerWidth / totalSquares; // Assuming a square grid

    // Calculate the top-left position of the square
    const posY = gridIndexX * squareSize;
    const posX = gridIndexY * squareSize;

    // Create a new div element for the red rectangle
    const redRect = document.createElement('div');

    // Set styles for the red rectangle
    redRect.style.position = 'absolute';
    redRect.style.left = (posX + 3) + 'px';
    redRect.style.top = (posY + 3) + 'px';
    redRect.style.width = (squareSize - 2 * 3) + 'px';
    redRect.style.height = (squareSize - 2 * 3) + 'px';
    redRect.style.border = '3px solid red';
    redRect.style.boxSizing = 'border-box';
    redRect.style.backgroundColor = 'transparent';
    redRect.style.pointerEvents = 'none';
    // redRect.style.stroke = 'red';
    redRect.style.zIndex = '0'; // Make sure it's above other items in the container

    // Append the red rectangle to the container
    container.appendChild(redRect);
    return redRect;
}

// Use the function and keep a reference to the created rectangle
const cgContainer = document.querySelector('cg-container');

let squares = [];



// This function will run every time there are changes in the DOM
function customExtensionUpdate() {

    for(let i = 0; i < squares.length; i++){
        squares[i].remove();
    }

    squares = [];

    console.log('Changes detected, running custom extension code.');
    // Your custom code here
    // perse the height and width of the board
    const cgContainer = document.querySelector('cg-container');
    const style = window.getComputedStyle(cgContainer);
    const height = parseInt(style.getPropertyValue('height'), 10); // Converts height to integer
    const width = parseInt(style.getPropertyValue('width'), 10); // Converts width to integer
    console.log('Height:', height, 'Width:', width);

    const side = height / 8;

    // get elements from html code
    a = document.getElementsByTagName("cg-board");

    b = a[0].childNodes;

    // Extracts the URL from the meta property "og:url"
    const gameUrlContent = document.querySelector('meta[property="og:url"]').getAttribute("content");

    // Determines the user's color based on the URL
    const userColor = gameUrlContent.endsWith("/black") ? "black" : "white";
    const opColor = (userColor == 'black') ? 'white' : 'black';
    console.log('User is playing as:', userColor);

    // Declaring grid
    let grid = new Array(8);
    for (let i = 0; i < 8; i++) {
        grid[i] = new Array(8);
        for (let j = 0; j < 8; j++) {
            grid[i][j] = '.';
        }
    }

    // rename the pieces
    let map = new Map();
    map.set(opColor + " king", 'k');
    map.set(opColor + " queen", 'q');
    map.set(opColor + " bishop", 'b');
    map.set(opColor + " knight", 'n');
    map.set(opColor + " rook", 'r');
    map.set(opColor + " pawn", 'p');


    map.set(userColor + " king", 'K');
    map.set(userColor + " queen", 'Q');
    map.set(userColor + " bishop", 'B');
    map.set(userColor + " knight", 'N');
    map.set(userColor + " rook", 'R');
    map.set(userColor + " pawn", 'P');


    // represent the board in grid
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            grid[i][j] = '.';
        }
    }
    for (let i = 0; i < b.length; i++) {

        const style = b[i].getAttribute('style');

        // Extract the positions from the style string using a regular expression
        const translateRegex = /translate\((\d+px), (\d+px)\)/;
        const match = style.match(translateRegex);

        // If the translate values are found, parse them to integers and log them
        if (match) {
            const positionX = parseInt(match[1], 10) / side; // Parse the X position
            const positionY = parseInt(match[2], 10) / side; // Parse the Y position
            console.log(`Element: ${b[i].className}, Position X: ${positionX}, Position Y: ${positionY}`);
            if (b[i].className != "last-move" && map.get(b[i].className) != null) {
                let row = positionY;
                let col = positionX;

                grid[row][col] = map.get(b[i].className);
            }
        }

    }
    console.log(grid);




    let mark = new Array(8);
    for (let i = 0; i < 8; i++) {
        mark[i] = new Array(8);
        for (let j = 0; j < 8; j++) {
            mark[i][j] = '.';
        }
    }

    function straight(x, y, grid, mark) {
        let posx = x;
        let posy = y;
        let flag = true;
        while (posx > 0 && flag) {
            posx -= 1;
            if (grid[posx][posy] == '.' || mark[posx][posy] == 'x') {
                mark[posx][posy] = 'x';
            }
            else {
                mark[posx][posy] = 'X';
                flag = false;
            }
        }
        flag = true;
        posx = x;
        posy = y;
        while (posy > 0 && flag) {
            posy -= 1;
            if (grid[posx][posy] == '.' || mark[posx][posy] == 'x') {
                mark[posx][posy] = 'x';
            }
            else {
                mark[posx][posy] = 'X';
                flag = false;
            }
        }
        flag = true;
        posx = x;
        posy = y;
        while (posx < 7 && flag) {
            posx += 1;
            if (grid[posx][posy] == '.' || mark[posx][posy] == 'x') {
                mark[posx][posy] = 'x';
            }
            else {
                mark[posx][posy] = 'X';
                flag = false;
            }
        }
        flag = true;
        posx = x;
        posy = y;
        while (posy < 7 && flag) {
            posy += 1;
            if (grid[posx][posy] == '.' || mark[posx][posy] == 'x') {
                mark[posx][posy] = 'x';
            }
            else {
                mark[posx][posy] = 'X';
                flag = false;
            }
        }
    }

    function diagonal(x, y, grid, mark) {
        let posx = x;
        let posy = y;
        let flag = true;
        while (posx > 0 && posy > 0 && flag) {
            posx -= 1;
            posy -= 1;
            if (grid[posx][posy] == '.' || mark[posx][posy] == 'x') {
                mark[posx][posy] = 'x';
            }
            else {
                mark[posx][posy] = 'X';
                flag = false;
            }
        }
        posx = x;
        posy = y;
        flag = true;
        while (posx > 0 && posy < 7 && flag) {
            posx -= 1;
            posy += 1;
            if (grid[posx][posy] == '.' || mark[posx][posy] == 'x') {
                mark[posx][posy] = 'x';
            }
            else {
                mark[posx][posy] = 'X';
                flag = false;
            }
        }
        posx = x;
        posy = y;
        flag = true;
        while (posx < 7 && posy > 0 && flag) {
            posx += 1;
            posy -= 1;
            if (grid[posx][posy] == '.' || mark[posx][posy] == 'x') {
                mark[posx][posy] = 'x';
            }
            else {
                mark[posx][posy] = 'X';
                flag = false;
            }
        }
        posx = x;
        posy = y;
        flag = true;
        while (posx < 7 && posy < 7 && flag) {
            posx += 1;
            posy += 1;
            if (grid[posx][posy] == '.' || mark[posx][posy] == 'x') {
                mark[posx][posy] = 'x';
            }
            else {
                mark[posx][posy] = 'X';
                flag = false;
            }
        }
    }

    function pawn(x, y, grid, mark) {
        if (x + 1 < 8 && y - 1 >= 0) {
            let posx = x + 1;
            let posy = y - 1;
            if (grid[posx][posy] == '.' || mark[posx][posy] == 'x') {
                mark[posx][posy] = 'x';
            }
            else {
                mark[posx][posy] = 'X';
                flag = false;
            }
        }
        if (x + 1 < 8 && y + 1 < 8) {
            let posx = x + 1;
            let posy = y + 1;
            if (grid[posx][posy] == '.' || mark[posx][posy] == 'x') {
                mark[posx][posy] = 'x';
            }
            else {
                mark[posx][posy] = 'X';
                flag = false;
            }
        }
    }

    function horse(x, y, grid, mark) {
        let dx = [2, 2, -2, -2, 1, 1, -1, -1];
        let dy = [1, -1, 1, -1, 2, -2, 2, -2];

        for (let i = 0; i < 8; i++) {
            let posx = x + dx[i];
            let posy = y + dy[i];
            if (posx < 8 && posx >= 0 && posy < 8 && posy >= 0) {
                if (grid[posx][posy] == '.' || mark[posx][posy] == 'x') {
                    mark[posx][posy] = 'x';
                }
                else {
                    mark[posx][posy] = 'X';
                }
            }
        }

    }


    function denger(grid, mark) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                mark[i][j] = '.';
            }
        }
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (grid[i][j] <= 'z' && grid[i][j] >= 'a') {
                    if (grid[i][j] == 'q') {
                        straight(i, j, grid, mark);
                        diagonal(i, j, grid, mark);
                    }
                    else if (grid[i][j] == 'b') {
                        diagonal(i, j, grid, mark);
                    }
                    else if (grid[i][j] == 'n') {
                        horse(i, j, grid, mark);
                    }
                    else if (grid[i][j] == 'r') {
                        straight(i, j, grid, mark);
                    }
                    else if (grid[i][j] == 'p') {
                        pawn(i, j, grid, mark);
                    }
                }
            }
        }
    }

    // straight(3, 4, grid, mark);
    // diagonal(3, 4, grid, mark);
    // pawn(3, 4, grid, mark);
    // horse(3, 4, grid, mark);
    denger(grid, mark);
    console.log(mark);

    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            if(mark[i][j] == 'X' || mark[i][j] == 'x'){
                squares.push(placeRedRectWithinContainer(cgContainer, i, j, 8));
            }
        }
    }
}

// Select the target node to observe
const targetNode = document.querySelector('cg-board') || document; // Fallback to document if 'cg-board' does not exist

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function (mutationsList, observer) {
    console.log("Observed mutations");
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
            console.log("changes made");
            customExtensionUpdate();
            // break; // Optional: if you only care about the first mutation
        }
        // Add other checks for different types of mutations if necessary
    }
};

const observer = new MutationObserver(callback);
// Create an observer instance linked to the callback function
console.log("all ok");

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

// Later, you can stop observing
// observer.disconnect();












