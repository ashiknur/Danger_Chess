let dataToSave = {
    mycell: false,
    mysign: false,
    mycolor: '#00ff00',
    opcell: true,
    opsign: false,
    opcolor: '#ff0000'
}

// First, create a function that returns a promise which resolves when the message response is received
function getDataAsync() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: "getData" }, (result) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
            } else {
                resolve(result);
            }
        });
    });
}

// Now, use this function with async/await
async function getData() {
    try {
        const result = await getDataAsync();
        // // console.log("Received data:", result);
        if (Object.keys(result).length) dataToSave = result;
        // // console.log("Data loaded from local storage:", dataToSave);
    } catch (error) {
        // console.error("Error fetching data:", error.message);
    }
}


// //onsole.log("running");
function placeRedRectWithinContainer(container, gridIndexX, gridIndexY, totalSquares) {
    // Get the computed style of the container to find its size
    const containerStyle = window.getComputedStyle(container);
    const containerWidth = parseFloat(containerStyle.width);
    const containerHeight = parseFloat(containerStyle.height);

    // Calculate the size of each square
    const squareSize = containerWidth / totalSquares; // Assuming a square grid

    // Calculate the top-left position of the square
    const posY = gridIndexX * squareSize;
    const posX = gridIndexY * squareSize;

    // Create a new div element for the red rectangle
    const redRect = document.createElement('div');

    // Set styles for the red rectangle

    redRect.style.position = 'absolute';
    redRect.style.left = (posX + 8) + 'px';
    redRect.style.top = (posY + 8) + 'px';
    redRect.style.width = (squareSize - 2 * 8) + 'px';
    redRect.style.height = (squareSize - 2 * 8) + 'px';
    redRect.style.border = '3px solid ' + dataToSave.mycolor;
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

let preGrid = new Array(8);
for (let i = 0; i < 8; i++) {
    preGrid[i] = new Array(8);
    for (let j = 0; j < 8; j++) {
        preGrid[i][j] = '.';
    }
}

let squares = [];
let cnt = 0;
function ok(x, y, grid, mark){
    if (grid[x][y] == '.' || mark[x][y] == 'x' || grid[x][y] == 'K'){
        return true;
    }
    return false;
}

// This function will run every time there are changes in the DOM
function customExtensionUpdate() {

    

    //// console.log('Changes detected, running custom extension code.');
    // Your custom code here
    // perse the height and width of the board
    const cgContainer = document.querySelector('cg-container');
    const style = window.getComputedStyle(cgContainer);
    const height = parseFloat(style.getPropertyValue('height'), 10); // Converts height to integer
    const width = parseFloat(style.getPropertyValue('width'), 10); // Converts width to integer
    //// console.log('Height:', height, 'Width:', width);

    const side = height / 8;

    // get elements from html code
    a = document.getElementsByTagName("cg-board");

    b = a[0].getElementsByTagName("piece");

    // Extracts the URL from the meta property "og:url"
    const gameUrlContent = document.querySelector('meta[property="og:url"]').getAttribute("content");

    // Determines the user's color based on the URL
    const userColor = gameUrlContent.endsWith("/black") ? "white" : "black";
    const opColor = (userColor == 'black') ? 'white' : 'black';
    // console.log('User is playing as:', userColor);

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
        const translateRegex = /translate\((\d+(\.\d+)?px), (\d+(\.\d+)?px)\)/;

        const match = style.match(translateRegex);
        // // console.log(b[i].className);
        // // console.log(match);
        // // console.log(style);
        // If the translate values are found, parse them to integers and log them
        if (match) {
            const positionX = parseFloat(match[1]) / side; // Parse the X position
            const positionY = parseFloat(match[3]) / side; // Parse the Y position
            //// console.log(`Element: ${b[i].className}, Position X: ${positionX}, Position Y: ${positionY}`);
            if (map.has(b[i].className)) {
                let row = Math.round(positionY);
                let col = Math.round(positionX);

                grid[row][col] = map.get(b[i].className);
            }
        }

    }
    // // console.log(grid);
    // // console.log(preGrid);
    if(JSON.stringify(grid) == JSON.stringify(preGrid)){
        // // console.log("same");
        return;
    }
    // // console.log(cnt);
    // cnt++;
    for (let i = 0; i < squares.length; i++) {
        squares[i].remove();
    }

    squares = [];
    // // console.log("cleared");
    preGrid = grid;
    // // console.log(grid);
    // // console.log(preGrid);
    // // console.log(b);




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
            if (ok(posx, posy, grid, mark)) {
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
            if (ok(posx, posy, grid, mark)) {
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
            if (ok(posx, posy, grid, mark)) {
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
            if (ok(posx, posy, grid, mark)) {
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
            if (ok(posx, posy, grid, mark)) {
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
            if (ok(posx, posy, grid, mark)) {
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
            if (ok(posx, posy, grid, mark)) {
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
            if (ok(posx, posy, grid, mark)) {
                           mark[posx][posy] = 'x';
            }
            else {
                mark[posx][posy] = 'X';
                flag = false;
            }
        }
    }

    function pawn(x, y, grid, mark) {
        if (x - 1 >= 0 && y - 1 >= 0) {
            let posx = x - 1;
            let posy = y - 1;
            if (ok(posx, posy, grid, mark)) {
                mark[posx][posy] = 'x';
            }
            else {
                mark[posx][posy] = 'X';
                flag = false;
            }
        }
        if (x - 1 >= 0 && y + 1 < 8) {
            let posx = x - 1;
            let posy = y + 1;
            if (ok(posx, posy, grid, mark)) {
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
                if (ok(posx, posy, grid, mark))
                {
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
    //// console.log(mark);

    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            if(mark[i][j] == 'X' || mark[i][j] == 'x'){
                squares.push(placeRedRectWithinContainer(cgContainer, i, j, 8));
            }
        }
    }
}

// Select the target node to observe
// const targetNode = document.querySelector('cg-board') || document; // Fallback to document if 'cg-board' does not exist

// // Options for the observer (which mutations to observe)
// const config = { attributes: true, childList: true, subtree: true };

// // Callback function to execute when mutations are observed
// const callback = function (mutationsList, observer) {
//     for (let mutation of mutationsList) {
//         if (mutation.type === 'childList' || mutation.type === 'attributes') {
//             customExtensionUpdate();
//             // break; // Optional: if you only care about the first mutation
//         }
//         // Add other checks for different types of mutations if necessary
//     }
// };

// // Create an observer instance linked to the callback function
// const observer = new MutationObserver(callback);

// // Start observing the target node for configured mutations
// observer.observe(targetNode, config);

// // Later, you can stop observing
// // // observer.disconnect();
// let cnt = 0;
// // working
// Object.keys(window).forEach(key => {
//     if (/^on/.test(key)) { // Check if the property starts with 'on'
//         document.addEventListener(key.slice(2), function (event) {
//             //// console.log(`${key} event detected:`, event);
//             // customExtensionUpdate();
//             // console.log(cnt);
//             cnt++;
//             getData();
//         });
//     }
// });


document.onreadystatechange = function () {
    if(document.readyState === 'complete'){
        document.addEventListener('click', function (event) {

            for (let i = 0; i < squares.length; i++) {
                squares[i].remove();
            }
            squares = [];

            for (let i = 0; i < opSquares.length; i++) {
                opSquares[i].remove();
            }
            opSquares = [];

            getData();
            if(dataToSave.mycell){
                
                preGrid = new Array(8);
                for (let i = 0; i < 8; i++) {
                    preGrid[i] = new Array(8);
                    for (let j = 0; j < 8; j++) {
                        preGrid[i][j] = '.';
                    }
                }
                customExtensionUpdate();
            }

            if(dataToSave.opcell){
                
                opPreGrid = new Array(8);
                for (let i = 0; i < 8; i++) {
                    opPreGrid[i] = new Array(8);
                    for (let j = 0; j < 8; j++) {
                        opPreGrid[i][j] = '.';
                    }
                }
                opCustomExtensionUpdate();
            }

            Object.keys(window).forEach(key => {
                if (/^on/.test(key)) { // Check if the property starts with 'on'
                    document.addEventListener(key.slice(2), function (event) {
                        if(dataToSave.mycell) customExtensionUpdate();
                        else{
                            for (let i = 0; i < squares.length; i++) squares[i].remove();
                            squares = [];
                        }
                        if(dataToSave.opcell) opCustomExtensionUpdate();
                    });
                }
            });
        });

        window.addEventListener('resize', function () {
            // Your code to handle resize event goes here
            // console.log("Window resized!");
            for (let i = 0; i < squares.length; i++) {
                squares[i].remove();
            }
            squares = [];

            for (let i = 0; i < opSquares.length; i++) {
                opSquares[i].remove();
            }
            opSquares = [];
            // You can also access the new width and height of the window:
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;
            if(dataToSave.mycell){
                
                preGrid = new Array(8);
                for (let i = 0; i < 8; i++) {
                    preGrid[i] = new Array(8);
                    for (let j = 0; j < 8; j++) {
                        preGrid[i][j] = '.';
                    }
                }
                customExtensionUpdate();
            }

            if(dataToSave.opcell){
                
                opPreGrid = new Array(8);
                for (let i = 0; i < 8; i++) {
                    opPreGrid[i] = new Array(8);
                    for (let j = 0; j < 8; j++) {
                        opPreGrid[i][j] = '.';
                    }
                }
                opCustomExtensionUpdate();
            }
            // Use these values to adjust your webpage layout or functionality
        });
    }
}


