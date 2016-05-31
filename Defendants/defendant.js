// JavaScript source code

var json;

function updateValues() {
    var gender = document.getElementById("gender");
    gender = gender.options[gender.selectedIndex].value;
    var crime = document.getElementById("crime");
    crime = crime.options[crime.selectedIndex].value;

    var holder = 0;

    if (gender === "M" && crime === "M") {
        holder = 0;
    } else if (gender === "F" && crime === "M") {
        holder = 1;
    } else if (gender === "M" && crime === "F") {
        holder = 2;
    } else if (gender === "F" && crime === "F") {
        holder = 3;
    }
    update(holder);
}

function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            json = JSON.parse(xhttp.responseText);
            update(0);
        }
    };
    xhttp.open("GET", "https://cdn.rawgit.com/BlackstoneTrialAnalytics/BlackstoneTrialAnalytics.github.io/master/Defendants/analytics.json", true);
    xhttp.send();
}

function update(holder) {
    document.getElementById("PD").innerHTML = String(json.analytics[holder].PD).substring(0, 4);
    document.getElementById("Q1").innerHTML = String(json.analytics[holder].Q1).substring(0, 4);
    document.getElementById("Q2").innerHTML = String(json.analytics[holder].Q2).substring(0, 4);
    document.getElementById("Q3").innerHTML = String(json.analytics[holder].Q3).substring(0, 4);
    document.getElementById("Q4").innerHTML = String(json.analytics[holder].Q4).substring(0, 4);
    document.getElementById("Q5").innerHTML = String(json.analytics[holder].Q5).substring(0, 4);
}
