console.log("CULOOOOOOOOO");

$(document).ready(function (e) {
    e.preventDefault();

    let registrationData = {};

    $("#signUpBtn").click(function () {
        registrationData["name"] = $("#nameInput").val();
        registrationData["license_plate"] = $("#licensePlateInput").val();
        registrationData["email"] = $("#emailInput").val();
        registrationData["hash"] = $("#passwordInput").val();
    });

    let jsonStr = JSON.stringify(registrationData);
    console.log("Devo fare la post");
    console.log(jsonStr);

    $.post("car_registration", jsonStr);

    // redirect to thanks.html landing page
    // window.location.href = 'thanks.html';
});