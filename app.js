const video = document.getElementById("video");

async function startScan() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    video.srcObject = stream;

    video.addEventListener("loadeddata", () => scanQRCode(video), false);
  } catch (error) {
    console.error("Greška prilikom pokretanja kamere: ", error);
  }
}

function scanQRCode(video) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  setInterval(() => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code) {
      const result = parseQRCode(code.data);  // parsiraj QR kod
      document.getElementById("result").textContent = `PFR: ${result.pfr}, Vreme: ${result.time}, Iznos: ${result.amount}`;
      sendToGoogleSheets(result);  // šalje podatke u Google Sheets
    }
  }, 1000);
}

function parseQRCode(data) {
  // Ovde postavi logiku za parsiranje QR koda (primer: razdvajanje podataka po delimiterima)
  const [pfr, time, amount] = data.split(";");  // primer parsiranja
  return { pfr, time, amount };
}

async function sendToGoogleSheets(result) {
  const SHEET_ID = "1ZCf7JHeAG21TM9BWY9wLVAZ0GnvaHhI7hLzxhERHMZ0";
  const API_KEY = "320647357285-2slvkr2jadah6hch048isjjoejhg3u8p";

  const SHEET_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;

  const response = await fetch(SHEET_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      values: [[result.pfr, result.time, result.amount]]
    })
  });

  if (response.ok) {
    console.log("Podaci uspešno poslati u Google Sheets");
  } else {
    console.error("Greška prilikom slanja podataka", response.statusText);
  }
}
