// Portfolio launch date and time (local time, 24h format).
const LAUNCH_DATE = "2026-09-14T09:00:00";


(function () {
  var target = new Date(LAUNCH_DATE).getTime();

  var days = document.getElementById("days");
  var hours = document.getElementById("hours");
  var minutes = document.getElementById("minutes");
  var seconds = document.getElementById("seconds");
  var title = document.querySelector(".timer-title");
  var ticker;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function update() {
    var diff = target - Date.now();

    if (diff <= 0) {
      days.textContent = hours.textContent = minutes.textContent = seconds.textContent = "00";
      title.textContent = "Portfolio is now available";
      clearInterval(ticker);
      return;
    }

    var s = Math.floor(diff / 1000);
    days.textContent = pad(Math.floor(s / 86400));
    hours.textContent = pad(Math.floor((s % 86400) / 3600));
    minutes.textContent = pad(Math.floor((s % 3600) / 60));
    seconds.textContent = pad(s % 60);
  }

  update();
  ticker = setInterval(update, 1000);
})();
