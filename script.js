function domReady(fn) {
    if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {
        setTimeout(fn, 1000);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

async function sendToGoogleSheets(data) {
    const url = 'https://script.google.com/macros/s/https://script.google.com/macros/library/d/1Z5jaUgitmOPVoI7XYW5hUO3kNh06-1SOGsi68YryQoq78ZuYkrnVPv-a/2/exec'; // Zamenite sa URL-om koji ste dobili prilikom postavljanja Google Apps Script

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        const result = await response.json();
        console.log('Data sent successfully:', result);
    } catch (error) {
        console.error('Error sending data:', error);
    }
}

domReady(function () {
    function onScanSuccess(decodeText, decodeResult) {
        const data = {
            pfr: decodeText, // Pretpostavljamo da QR kod sadrži PFR broj
            iznos: "1000", // Ovde stavite iznos, ili ga dohvatite iz QR koda ako je to moguće
        };
        
        console.log("QR Code content:", decodeText);
        sendToGoogleSheets(data); // Pozivanje funkcije za slanje podataka
    }

    let htmlscanner = new Html5QrcodeScanner(
        "my-qr-reader",
        { fps: 10, qrbos: 250 }
    );
    htmlscanner.render(onScanSuccess);
});
