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
        // Stop the scanner
        htmlscanner.clear(); // Zaustavi skener

        // Parsiranje podataka iz QR koda
        const qrData = parseQRData(decodeText);
        sendDataToGoogleSheets(qrData).then(() => {
            console.log("Podaci su poslati u Google Sheets");
        }).catch(error => {
            console.error("Greška prilikom slanja podataka:", error);
        });
    }

    let htmlscanner = new Html5QrcodeScanner(
        "my-qr-reader",
        { fps: 10, qrbox: 250 }
    );
    htmlscanner.render(onScanSuccess);
});

// Funkcija za slanje podataka u Google Sheets
async function sendDataToGoogleSheets(data) {
    const sheetId = "1vNjknb6PX2Ayi1_cO_4kRFS9sNhCVASu74lEhIRjw4A"; // Novi ID Sheet-a
    const apiKey = "AIzaSyAwdfWjOwX4OvGyYZBpegA45g_yyDdF3Gk"; // Tvoj API ključ
    const sheetName = "Sheet1";

const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A1:append?valueInputOption=RAW&key=${apiKey}`;
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            values: [[data.PFR, data.vreme, data.iznos]]
        })
    };

    const response = await fetch(url, options);
    if (!response.ok) throw new Error("Failed to send data to Google Sheets");
}

// Funkcija za parsiranje podataka iz QR koda
function parseQRData(qrText) {
    const data = {}; 
    data.PFR = qrText.match(/PFR:(\d+)/)[1];
    data.vreme = qrText.match(/Vreme:(\d+:\d+)/)[1];
    data.iznos = qrText.match(/Iznos:(\d+\.\d+)/)[1];
    return data;
}
