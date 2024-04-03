chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getData") {
        // Retrieve data from storage
        chrome.storage.local.get(null, function (result) {
            sendResponse(result); // Send the result back to the sender
        });
        return true; // Indicates you intend to send a response asynchronously
    } else if (message.action === "saveData") {
        // Save data to storage
        chrome.storage.local.set(message.data, function () {
            if (chrome.runtime.lastError) {
                // console.error("Error saving data to local storage:", chrome.runtime.lastError);
                sendResponse({ success: false });
            } else {
                // console.log("Data saved successfully!");
                sendResponse({ success: true });
            }
        });
        return true; // Indicates you intend to send a response asynchronously
    }
    // No need for 'sendResponse(null);' after chrome.storage.local.get
});
