/* =================== UTILITIES ==================== */

const alertPlaceholder = document.getElementById('liveAlertPlaceholder');

/* Display an alert */
function showAlert(message, type) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');

    alertPlaceholder.append(wrapper);
}


/* ================ JQUERY CALLBACKS ================ */
$(document).ready(function () {

    // min trip count required to submit the survey
    const MIN_TRIP_COUNT = 5;

    // contains data of the entire survey
    let surveyData = {}
    let i = 0;
    // contains data of a single trip
    let tripsData = {};

    // true if editing a trip
    let editMode = false;
    let editIndex = null;

    // index of the trip to delete
    let deleteIndex = null;

    // address to pick with location picker (orig | dest | defaultOrig)
    let targetAddress = null;

    /* Init location picker */
    $("#mapOffcanvas").one('show.bs.offcanvas', function () {
        var locationPicker = $('.location-picker').locationPicker({
            locationChanged: function (data) {
            },
            init: {current_location: true}
        });
    });

    /* Handle insertion of default location */
    $('.insertDefaultLocation').click(function () {
        let inputText = $(this).parent().parent().find('input[id$="Input"]');
        inputText.val(surveyData["defaultOrigin"]);

        let inputHidden = $(this).parent().parent().parent().find('input[id$="Json"]');
        inputHidden.val(JSON.stringify(surveyData["fullDefaultOrigin"]));
    });

    /* Handle location selection */
    $('button[id$="SelectionBtn"]').click(function () {
        targetAddress = $(this).attr("id").replace("SelectionBtn", "");
    });

    $("#selectAddressBtn").click(function () {
        if (targetAddress) {
            let targetInputId = "#" + targetAddress + "Input";
            let targetHiddenId = "#" + targetAddress + "Json"
            $(targetInputId).val(DOMPurify.sanitize($("#txtAddress").val()));
            $(targetHiddenId).val(DOMPurify.sanitize($("#txtLocation").val()));
        }
    });

    /* Handle next step button */
    $("#generalInfoForm").submit(function (event) {
        event.preventDefault(); // avoid page reload

        if (!this.checkValidity()) {
            console.log("Invalid modal form.");
            return;
        }

        surveyData["email"] = DOMPurify.sanitize($("#emailInput").val());
        surveyData["gender"] = DOMPurify.sanitize($('input[name="genderRadio"]:checked').attr("value"));
        surveyData["age"] = DOMPurify.sanitize($("#ageSelect").val());
        surveyData["defaultOrigin"] = DOMPurify.sanitize($("#defaultOrigInput").val());

        try {
            surveyData["fullDefaultOrigin"] = JSON.parse(DOMPurify.sanitize($("#defaultOrigJson").val()));
        } catch (e) {
            surveyData["fullDefaultOrigin"] = {};
        }

        console.log("General user info stored successfully.");

        $("#firstStepDiv").hide();
        $("#secondStepDiv").show();
        $("#bottomNavbar").show();
    });

    /* Handle edit trip button */
    $("body").on("click", 'button[id^="editTripBtn-"]', function () {
        editMode = true
        editIndex = $(this).attr("id").split("-")[1];
    });

    /* Handle new trips and trips editing */
    $("#modalForm").submit(function (event) {
        event.preventDefault(); // avoid page reload

        if (!this.checkValidity()) {
            console.log("Invalid modal form.");
            return;
        }

        let modalData = {};

        modalData["origin"] = DOMPurify.sanitize($("#origInput").val());
        modalData["dest"] = DOMPurify.sanitize(($("#destInput").val()));
        modalData["roundtrip"] = DOMPurify.sanitize($("#roundtripCheckbox").is(":checked"));

        try {
            modalData["fullOrigin"] = JSON.parse(DOMPurify.sanitize($("#origJson").val()));
        } catch (e) {
            modalData["fullOrigin"] = {};
        }

        try {
            modalData["fullDest"] = JSON.parse(DOMPurify.sanitize($("#destJson").val()));
        } catch (e) {
            modalData["fullDest"] = {};
        }

        modalData["freq"] = DOMPurify.sanitize($("#freqInput").val());
        modalData["period"] = DOMPurify.sanitize(($("#periodSelect").val()));
        modalData["kind"] = DOMPurify.sanitize($('input[name="kindRadio"]:checked').attr("value"));

        if (editMode) {
            console.log("Editing data at index " + editIndex);
            $("#tr-" + editIndex).html(
                `<td>
                    <input class="form-check-input m-0 align-middle" type="checkbox"
                        aria-label="Select invoice">
                </td>
                <td><span class="text-muted">${editIndex}</span></td>
                <td>${modalData["origin"]}</td>
                <td>${modalData["dest"]}</td>
                <td>${modalData["roundtrip"]}</td>
                <td>${modalData["freq"]}</td>
                <td>${modalData["period"]}</td>
                <td>${modalData["kind"]}</td>
                <td>
                    <div class="btn-list flex-nowrap">
                        <button type="button" class="btn btn-outline-secondary btn-sm" data-bs-toggle="modal"
                                data-bs-target="#addTripModal" id="editTripBtn-${editIndex}">
                            Modifica
                        </button>
                        <button type="button" class="btn btn-outline-danger btn-sm" id="deleteTripBtn-${editIndex}" data-bs-toggle="modal" data-bs-target="#deleteTripModal">
                            Elimina
                        </button>
                    </div>
                </td>`
            );

            tripsData[editIndex] = modalData;
            editMode = false;
            console.log("Trip data edited successfully.");
        } else {
            $("tbody").prepend(
                `<tr id="tr-${i}">
                            <td>
                                <input class="form-check-input m-0 align-middle" type="checkbox"
                                    aria-label="Select invoice">
                            </td>
                            <td><span class="text-muted">${i}</span></td>
                            <td>${modalData["origin"]}</td>
                            <td>${modalData["dest"]}</td>
                            <td>${modalData["roundtrip"]}</td>
                            <td>${modalData["freq"]}</td>
                            <td>${modalData["period"]}</td>
                            <td>${modalData["kind"]}</td>
                            <td>
                                <div class="btn-list flex-nowrap">
                                    <button type="button" class="btn btn-outline-secondary btn-sm" data-bs-toggle="modal"
                                            data-bs-target="#addTripModal" id="editTripBtn-${i}">
                                        Modifica
                                    </button>
                                    <button type="button" class="btn btn-outline-danger btn-sm" id="deleteTripBtn-${i}" data-bs-toggle="modal" data-bs-target="#deleteTripModal">
                                        Elimina
                                    </button>
                                </div>
                            </td>
                        <\tr>`
            )

            tripsData[i] = modalData;
            i++;
            console.log("Trip data added successfully.");
        }

        this.reset(); // reset form fields
        $("#addTripModal").modal("hide");
        console.log(tripsData);
    });

    /* Handle trip deletion */
    $("table").on("click", 'button[id^="deleteTripBtn-"]', function () {
        deleteIndex = $(this).attr("id").split("-")[1];
    });

    $("#confirmDeleteTripBtn").click(function () {
        if (deleteIndex) {
            delete tripsData[deleteIndex];
            console.log("Deleted modalData at index " + deleteIndex);
            $("#tr-" + deleteIndex).remove();
        }
    });

    /* Submit all data */
    $('#sendSurveyBtn').click(function () {
        console.log(Object.keys(tripsData).length);

        if (Object.keys(tripsData).length < MIN_TRIP_COUNT) {
            $("#warningPlaceholderP").text(
                "Hai inserito meno di 5 viaggi. " +
                "Per ottenere un resoconto migliore, sarebbe opportuno inserire un numero più elevato di viaggi"
            );
        }
    });

    $("#confirmSubmitSurveyBtn").click(function (){
        surveyData["trips"] = tripsData;

        let jsonObj = JSON.stringify(surveyData);
        $.post("submit", jsonObj);

        // redirect to thanks.html landing page
        window.location.href = 'thanks.html';
    });

    /* Handle forms validation */
    const forms = document.querySelectorAll('.needs-validation')
    Array.from(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
});
