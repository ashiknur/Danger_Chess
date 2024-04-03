
let dataToSave = {
    mycell: false,
    mysign: false,
    mycolor: '#00ff00',
    opcell: false,
    opsign: false,
    opcolor: '#ff0000'
}

function getData() {
    chrome.runtime.sendMessage({ action: "getData" }, (result) => {
        // console.log("Received data:", result);
        if (Object.keys(result).length) dataToSave = result;
        // console.log("Data loaded from local storage:", dataToSave);
        document.getElementById('mycell').checked = dataToSave.mycell;
        document.getElementById('mysign').checked = dataToSave.mysign;
        document.getElementById('mycolor').value = dataToSave.mycolor;
        document.getElementById('opcell').checked = dataToSave.opcell;
        document.getElementById('opsign').checked = dataToSave.opsign;
        document.getElementById('opcolor').value = dataToSave.opcolor;

        // Use the retrieved data
    });
}

function sendMessageAsync(message) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, (response) => {
            if (chrome.runtime.lastError) {
                // Handle expected errors gracefully
                reject(new Error(chrome.runtime.lastError.message));
            } else {
                resolve(response);
            }
        });
    });
}

async function saveData(data) {
    try {
        const response = await sendMessageAsync({ action: "saveData", data: data });
        // console.log("Received response:", response);
        if (response.success) {
            // console.log("Data saved successfully!");
        } else {
            console.error("Error saving data");
        }
    } catch (error) {
        console.error("Error sending message:", error.message);
    }
}


// function saveData(data) {
//     chrome.runtime.sendMessage({ action: "saveData", data: data }, (response) => {
//         // console.log("Received response:", response)
//         if (response.success) {
//             // console.log("Data saved successfully!");
//         } else {
//             console.error("Error saving data");
//         }
//     });
// }



document.onreadystatechange = function () {
    // console.log(document.readyState);
    if (document.readyState === 'complete') {
        // get data from local storage and update the UI
        // chrome.storage.sync.get(null, function (result) {
        //     dataToSave = result;
        //     // console.log("Data loaded from local storage:", dataToSave);
        //     document.getElementById('mycell').checked = dataToSave.mycell;
        //     document.getElementById('mysign').checked = dataToSave.mysign;
        //     document.getElementById('mycolor').value = dataToSave.mycolor;
        //     document.getElementById('opcell').checked = dataToSave.opcell;
        //     document.getElementById('opsign').checked = dataToSave.opsign;
        //     document.getElementById('opcolor').value = dataToSave.opcolor;
        // });

        getData();

        let mycell = document.getElementById('mycell');
        let mysign = document.getElementById('mysign');
        let mycolor = document.getElementById('mycolor');
        let opcell = document.getElementById('opcell');
        let opsign = document.getElementById('opsign');
        let opcolor = document.getElementById('opcolor');
        
        mycell.addEventListener('change', function () {
            if (this.checked) {
                dataToSave.mycell = true;
                // console.log('mycell is now checked.');
            } else {
                dataToSave.mycell = false;
                // console.log('mycell is now unchecked.');
            }
            saveData(dataToSave);
        });  

        mysign.addEventListener('change', function () {
            if (this.checked) {
                dataToSave.mysign = true;
                // console.log('mysign is now checked.');
            } else {
                dataToSave.mysign = false;
                // console.log('mysign is now unchecked.');
            }
            saveData(dataToSave);
        });

        mycolor.addEventListener('input', function () {
            dataToSave.mycolor = this.value;
            // console.log('Color is now:', this.value);
            saveData(dataToSave);
        });

        opcell.addEventListener('change', function () {
            if (this.checked) {
                dataToSave.opcell = true;
                // console.log('opcell is now checked.');
            } else {
                dataToSave.opcell = false;
                // console.log('opcell is now unchecked.');
            }
            saveData(dataToSave);
        });

        opsign.addEventListener('change', function () {
            if (this.checked) {
                dataToSave.opsign = true;
                // console.log('opsign is now checked.');
            } else {
                dataToSave.opsign = false;
                // console.log('opsign is now unchecked.');
            }
            saveData(dataToSave);
        });

        opcolor.addEventListener('input', function () {
            dataToSave.opcolor = this.value;
            // console.log('Color is now:', this.value);
            saveData(dataToSave);
        });

        // document.getElementById('reset').addEventListener('click', function () {
        //     dataToSave = {
        //         mycell: false,
        //         mysign: false,
        //         mycolor: '#00ff00',
        //         opcell: false,
        //         opsign: false,
        //         opcolor: '#ff0000'
        //     };
        //     // console.log('Data reset to default values.');
        //     chrome.storage.sync.set(dataToSave, function (result) {
        //         if (chrome.runtime.lastError) {
        //             console.error("Error saving data to local storage:", chrome.runtime.lastError);
        //         } else {
        //             // console.log("Data saved successfully!");
        //         }
        //     });
        //     document.getElementById('mycell').checked = dataToSave.mycell;
        //     document.getElementById('mysign').checked = dataToSave.mysign;
        //     document.getElementById('mycolor').value = dataToSave.mycolor;
        //     document.getElementById('opcell').checked = dataToSave.opcell;
        //     document.getElementById('opsign').checked = dataToSave.opsign;
        //     document.getElementById('opcolor').value = dataToSave.opcolor;
        // });
    }
}