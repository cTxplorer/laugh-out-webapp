$(function () {

    // keystroke effect
    document.onkeyup = function (e) {
        var check = document.getElementById("next").disabled;
        if (e.keyCode == 13 && $('#edit').hasClass("secondClick") == true)
            $('#edit').click(); // enter key

        else if (e.keyCode == 27 && $('#edit').hasClass("secondClick") == true)
            $('#edit').click(); // escape key

        else if (e.keyCode == 27 && $('#edit').hasClass("firstClick") == true)
            $('#edit').click(); // escape key

        else if (e.keyCode == 13 && check != true)
            $('#next').click(); // enter key

        else if (e.keyCode == 32 && check != true)
            $('#next').click(); // space key
    };


    // edit button is clicked
    $('#edit').click(
        function () {
            if ((this).classList.contains("firstClick")) {
                $(".editPanel").show();
                $(".jokePanel").hide();
                $('#next').hide();
                $(this).val("Troll!");
                $(this).addClass("secondClick");
                $(this).removeClass("firstClick");
            } else {
                if (document.getElementById("firstName").value.trim() == "") {
                    alert('Insert First Name');
                    return;
                } else if (document.getElementById("lastName").value.trim() == "") {
                    alert('Insert Last Name');
                    return;
                } else {
                    $(".editPanel").hide();
                    $(".jokePanel").show();
                    $('#next').show();
                    $(this).val("Customize"); //    ("edit");
                    $(this).addClass("firstClick");
                    $(this).removeClass("secondClick");
                    $('#next').click();
                }
            }
        });


    // loading effect
    var intrvl;

    function loading() {
        var i = 0;
        var cnt = 0;
        var prefix = "Loading";
        intrvl = setInterval(function () {
            i = (++i) % 4;
            if (i == 4) {
                i = 0;
                ++cnt;
                if (cnt == 3)
                    prefix = "Slow internet detected.<br>Please wait";
            }
            $("#joke").html(prefix + Array(i + 1).join("."));
        }, 300);
    }

    String.prototype.capitalize = function () {
        var ans = this.toLowerCase();
        return ans.charAt(0).toUpperCase() + ans.slice(1);
    };

    // Next button is clicked
    $('#next').on('click', function () {
        document.getElementById("next").disabled = true;
        loading();
        var fn = document.getElementById("firstName").value.trim().capitalize();
        var ln = document.getElementById("lastName").value.trim().capitalize();
        var status = $('#yes')[0].checked;
        var exp = "";
        if (status == false)
            exp = "&exclude=[explicit]";
        var url = "https://api.icndb.com/jokes/random?firstName=" + fn + "&lastName=" + ln + exp + "&escape=javascript";
        fetch(url)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }
                    response.json().then(function (data) {
                        clearInterval(intrvl);
                        document.getElementById("joke").textContent = data.value.joke;
                        $('#next').val("One More!");
                        $("#share").attr("data-text", document.getElementById("joke").textContent);
                        document.getElementById("next").disabled = false;
                    });
                }
            )
            .catch(function (err) {
                console.log('Fetch Error :', err);
            });
    });


    // Whatsapp Share Feature
    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    $(document).on("click", '.whatsapp', function () {
        if (isMobile.any()) {
            var text = "\" " + $(this).attr("data-text") + " \"";
            var url = $(this).attr("data-link");
            var message = encodeURIComponent(text) + "%0A%0A------------%0ACheck%20more%20jokes%20and%20troll%20your%20friends%20at%20" + encodeURIComponent(url);
            var whatsapp_url = "whatsapp://send?text=" + message;
            console.log(message);
            console.log(whatsapp_url);
            window.location.href = whatsapp_url;
        } else {
            alert("Try sharing from mobile device!");
        }
    });
});
