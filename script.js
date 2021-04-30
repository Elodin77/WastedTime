function time_diff(start, end) {
  start = start.split(":");
  end = end.split(":");
  var startDate = new Date(0, 0, 0, start[0], start[1], 0);
  var endDate = new Date(0, 0, 0, end[0], end[1], 0);
  var diff = endDate.getTime() - startDate.getTime();
  var hours = Math.floor(diff / 1000 / 60 / 60);
  diff -= hours * 1000 * 60 * 60;
  var minutes = Math.floor(diff / 1000 / 60);
  if (hours < 0) {
    hours += 24;
  }
  return (hours < 9 ? "0" : "") + hours + ":" + (minutes < 9 ? "0" : "") + minutes;
}

function time_to_hours(time) {
  var hours = parseFloat(time.split(":")[0]);
  hours += parseFloat(time.split(":")[1]/60.0);
  return hours;
}

function update() {
  // Makes calculations based on inputs and updates the webpage.
  try {
    var current_sleep = time_diff(document.getElementById("current_bed_time").value,
    document.getElementById("current_wake_time").value);

    var new_sleep = time_diff(document.getElementById("new_bed_time").value,
    document.getElementById("new_wake_time").value);

    var saved_hours = (time_to_hours(new_sleep) < time_to_hours(current_sleep) ? time_diff(new_sleep,current_sleep) : time_diff(current_sleep,new_sleep));
    if (saved_hours != "NaN:NaN") {
      document.getElementById("saved_hours").innerHTML = (Math.round(time_to_hours(saved_hours)*365)).toString();
      document.getElementById("saved_days").innerHTML = (Math.round(time_to_hours(saved_hours)*365/(24.0-time_to_hours(current_sleep)))).toString();
      try {
        // Calculate the saved_years by getting life expectancy from WorldBank.
        var country_code = document.getElementById("country_code").value;
        var request = new XMLHttpRequest();
        request.open("GET", 'http://api.worldbank.org/v2/country/'+country_code+'/indicator/SP.DYN.LE00.IN?mrnev=1', true);
        request.responseType = 'document';
        request.overrideMimeType('text/xml');
        request.onload = function () {
          if (request.readyState === request.DONE) {
            if (request.status === 200) {
              var xml = request.responseXML;
              document.getElementById("year").innerHTML = xml.getElementsByTagName("date")[0];
              document.getElementById("country").innerHTML = xml.getElementsByTagName("country")[0];
              document.getElementById("saved_years").innerHTML = saved_hours*parseFloat(xml.getElementsByTagName("value")[0])/24/365;
            }
          }
        };
        request.send(null);
      } catch (err) {
        document.getElementById("saved_years").innerHTML = "---"
      }
    }
  } catch (err) {
    document.getElementById("saved_time").innerHTML = "---";
  }

}


setInterval(update, 1000);
