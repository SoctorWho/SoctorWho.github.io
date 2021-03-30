var now = new Date();

function loadCalendar() {
    populateCalendar(now.getFullYear(), now.getMonth());
}

function populateCalendar(year, month) {
    var tbody = document.getElementById("calendar-tbody");
    tbody.innerHTML = "";

    console.log("populating calendar. year = " + year.toString() + " month = " + month);

    var start = new Date(year, month, 1);

    var col = getDay(start);
    var row = 0;
    var days = daysInMonth(year, month);

    var added = false;

    for (var day = 1; day <= days; day++) {
        if (!added) {
            addRow(row);
            added = true;
        }

        var td = document.getElementById("calendar-" + row + "-" + col);

        var dateEl = document.createElement("div");
        dateEl.classList.add("date");
        dateEl.innerHTML = day;
        td.appendChild(dateEl);

        var evt = document.createElement("div");
        evt.classList.add("event");
        evt.id = "day-" + day;
        td.appendChild(evt);

        col++;
        if (col == 8) {
            col = 1;
            row++;
            added = false;
        }
    }

    fetchEvents(renderEvents);
}

function renderEvents(events) {
    for (var event of events) {
        var date = new Date(event.date);

        var evtEl = document.getElementById("day-" + date.getDate());

        var link = document.createElement("a");
        link.href = event.permalink;
        link.innerHTML = event.title;
        evtEl.appendChild(link);

        var timeEl = document.createElement("div");
        timeEl.classList.add("time");
        timeEl.innerHTML = event.time;
        evtEl.appendChild(timeEl);
    }
}

function addRow(index) {
    var tbody = document.getElementById("calendar-tbody");

    var tr = document.createElement("tr");

    for (var col = 0; col < 7; col++) {
        var td = document.createElement("td");
        td.classList.add("day");
        td.id = "calendar-" + index + "-" + (col+1);
        tr.appendChild(td);
    }

    tbody.appendChild(tr);
}

function getDay(d) {
    day = d.getDay();
    if (day == 0) return 7;
    return day;
}

function daysInMonth(year, month) {
    return new Date(year, month+1, 0).getDate();
}

function fetchEvents(f) {
    var req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        if (this.readyState != 4) return;

        if (this.status != 200) {
            console.error("couldn't fetch the events list.");
            return;
        }

        f(JSON.parse(req.responseText).data);
    }

    req.open("GET", window.location.origin + "/events/index.json", true);
    req.send();
}