/**
 * Shuffle the array using Fisher-Yates shuffling algorithm.
 * 
*/
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
                
    return array;
}

function isUnlocked(letter) {
    return document.getElementById(letter).previousSibling.previousSibling.className == "fas fa-lock-open";
}

function addClickListeners() {
    document.getElementById("unlockAll").addEventListener("click", function () {
        for (let el of document.getElementsByTagName("I"))
            el.className = "fas fa-lock-open";
    });

    document.getElementById("lockAll").addEventListener("click", function () {
        for (let el of document.getElementsByTagName("I"))
            el.className = "fas fa-lock";
    });
    
    // Change All button click listener
    document.getElementById("changeAll").addEventListener("click", function () {
        for (let letter of ["U", "M", "B", "C"])
            if (isUnlocked(letter))
                generate(letter);
    });

    // Add click listners to the locks for toggling
    for (let el of document.getElementsByClassName("fa-lock")) {
        el.addEventListener("click", function (event) {
            var src = event.target;

            if (src.className == "fas fa-lock") 
                src.className = "fas fa-lock-open";
            else
                src.className = "fas fa-lock";
        });
    }

    document.addEventListener("click", function(e) {
        let el = e.srcElement;

        // Change the span into editing mode
        if (el.tagName == "SPAN" || el.tagName == "INPUT") {
            if (!el.children.length) 
                el.innerHTML = "<input type='text' value='" + el.innerHTML + "'/>";
        }
        // Change the span back into static text
        else {
            for (let element of document.getElementsByClassName("noselect")) {
                if (element.children.length) 
                    element.innerHTML = element.children[0].value;
            }
        }
    });

    document.addEventListener('keydown', function(e) {
        const keyName = e.key;

        if (keyName == "Enter") {
            // Go through each span and change into static text
            for (let element of document.getElementsByClassName("noselect")) {
                if (element.children.length) 
                    element.innerHTML = element.children[0].value;
            }
        }
    });
}

function generate(letter) {
    // Create a request variable and assign a new XMLHttpRequest object to it.
    var request = new XMLHttpRequest();

    // Open a new connection, using the GET request on the URL endpoint
    request.open("GET", "https://api.datamuse.com/words?sp=" + letter + "*&max=1000", true);

    request.onload = function() {
        // Begin accessing JSON data here
        var data = JSON.parse(this.response);

        // Shuffle the words returned by API
        var words = shuffle(data);

        var newWord = words.pop().word;
                
        document.getElementById(newWord.substring(0, 1).toUpperCase()).innerHTML = newWord.substring(0, 1).toUpperCase() + newWord.substring(1);
    };

    // Send request
    request.send();
}

addClickListeners();