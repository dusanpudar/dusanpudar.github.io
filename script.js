// script.js

function domReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

domReady(function () {

    // If QR code is found
    function onScanSuccess(decodeText, decodeResult) {
        // Parse QR code data if it's JSON or structured format
        const qrData = parseQRData(decodeText); // Implement this function based on the QR format

        // Send parsed data to Google Sheets
        sendDataToGoogleSheets(qrData);
    }

    let htmlscanner = new Html5QrcodeScanner(
        "my-qr-reader",
        { fps: 10, qrbox: 250 }
    );
    htmlscanner.render(onScanSuccess);
});

// Helper function to send data to Google Sheets
async function sendDataToGoogleSheets(data) {
    const sheetId = "1vNjknb6PX2Ayi1_cO_4kRFS9sNhCVASu74lEhIRjw4A"; // Your sheet ID
    const apiKey = "AIzaSyAwdfWjOwX4OvGyYZBpegA45g_yyDdF3Gk"; // Replace with your actual API key

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:append?valueInputOption=RAW&key=${apiKey}`;
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            values: [[data.PFR, data.vreme, data.iznos]]
        })
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error("Failed to send data to Google Sheets");
        console.log("Data successfully sent to Google Sheets");
    } catch (error) {
        console.error("Error:", error);
    }
}

// Function to parse QR code data based on expected format
function parseQRData(qrText) {
    // Example of extracting PFR, vreme, iznos from the QR text format
    const data = {}; // Parse qrText and fill this object
    data.PFR = qrText.match(/PFR:(\d+)/)[1];
    data.vreme = qrText.match(/Vreme:(\d+:\d+)/)[1];
    data.iznos = qrText.match(/Iznos:(\d+\.\d+)/)[1];
    return data;
}
