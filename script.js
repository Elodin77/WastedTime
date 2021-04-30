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

  // Calculate the saved_hours and saved_days from user input
  try {
    var current_sleep = time_diff(document.getElementById("current_bed_time").value,
    document.getElementById("current_wake_time").value);

    var new_sleep = time_diff(document.getElementById("new_bed_time").value,
    document.getElementById("new_wake_time").value);

    var saved_hours = (time_to_hours(new_sleep) < time_to_hours(current_sleep) ? time_diff(new_sleep,current_sleep) : "-"+time_diff(current_sleep,new_sleep));

    if (!saved_hours.includes("NaN")) {
      saved_hours_num = time_to_hours(saved_hours);
      if (saved_hours_num > 0) {
        document.getElementById("saved_hours").className = "positive";
        document.getElementById("saved_days").className = "positive";
        document.getElementById("saved_years").className = "positive";
        document.getElementById("saved_hours").innerHTML = "+"+(Math.round(time_to_hours(saved_hours))).toString();
        document.getElementById("saved_days").innerHTML = "+"+(Math.round(time_to_hours(saved_hours)*365/(24.0-time_to_hours(current_sleep)))).toString();
      } else if (saved_hours_num < 0) {
        document.getElementById("saved_hours").className = "negative";
        document.getElementById("saved_days").className = "negative";
        document.getElementById("saved_years").className = "negative";
        document.getElementById("saved_hours").innerHTML = (Math.round(time_to_hours(saved_hours))).toString();
        document.getElementById("saved_days").innerHTML = (Math.round(time_to_hours(saved_hours)*365/(24.0-time_to_hours(current_sleep)))).toString();
      } else {
        document.getElementById("saved_hours").className = document.getElementById("saved_hours").className.replace(/\bmystyle\b/g, "");
        document.getElementById("saved_days").className = document.getElementById("saved_days").className.replace(/\bmystyle\b/g, "");
        document.getElementById("saved_years").className = document.getElementById("saved_years").className.replace(/\bmystyle\b/g, "");
        document.getElementById("saved_hours").innerHTML = (Math.round(time_to_hours(saved_hours))).toString();
        document.getElementById("saved_days").innerHTML = (Math.round(time_to_hours(saved_hours)*365/(24.0-time_to_hours(current_sleep)))).toString();
      }

    } else {
      document.getElementById("saved_hours").innerHTML = "---";
      document.getElementById("saved_days").innerHTML = "---";
      document.getElementById("saved_years").innerHTML = "---";
    }
  } catch (err) {
    document.getElementById("saved_hours").innerHTML = "XXX";
    document.getElementById("saved_days").innerHTML = "XXX";
    document.getElementById("saved_years").innerHTML = "XXX";
  }
  // Calculate the saved_years by getting life expectancy from WorldBank.
  try {
    var country_code = document.getElementById("country_code").value;
    var request = new XMLHttpRequest();
    request.open("GET", 'https://api.worldbank.org/v2/country/'+country_code+'/indicator/SP.DYN.LE00.IN?mrnev=1', true);
    request.responseType = 'document';
    request.overrideMimeType('text/xml');
    request.onload = function () {
      if (request.readyState === request.DONE) {
        if (request.status === 200) {
          var xml = request.responseXML;
          var dates = xml.getElementsByTagName("wb:date");
          var countries = xml.getElementsByTagName("wb:country");
          var values = xml.getElementsByTagName("wb:value");
          if (dates.length != 0 && countries.length != 0) {
            document.getElementById("year").innerHTML = dates[0].childNodes[0].nodeValue;
            document.getElementById("country").innerHTML = countries[0].childNodes[0].nodeValue;
          } else {
            document.getElementById("year").innerHTML = "---";
            document.getElementById("country").innerHTML = "---"
          }

          if (typeof(saved_hours) !== 'undefined' && saved_hours != "NaN:NaN" && values.length != 0 && typeof(current_sleep) !== "undefined") {
            document.getElementById("saved_years").innerHTML = Math.round(time_to_hours(saved_hours)*parseFloat(values[0].childNodes[0].nodeValue)/(24-time_to_hours(current_sleep)));
          } else {
            document.getElementById("saved_years").innerHTML = "---";
          }
        } else {
          document.getElementById("year").innerHTML = "XXX";
          document.getElementById("country").innerHTML = "XXX";
          document.getElementById("saved_years").innerHTML = "XXX";
        }
      } else {
        document.getElementById("year").innerHTML = "XXX";
        document.getElementById("country").innerHTML = "XXX";
        document.getElementById("saved_years").innerHTML = "XXX";
      }
    };
    request.send(null);
  } catch (err) {
    document.getElementById("year").innerHTML = "XXX";
    document.getElementById("country").innerHTML = "XXX";
    document.getElementById("saved_years").innerHTML = "XXX";
  }

}


setInterval(update, 100);
