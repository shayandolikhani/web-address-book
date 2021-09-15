let people;
let prev;
let aToZ = true;
$(document).ready(function () {
    const url = "http://localhost:8080/api/people";
    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            people = JSON.parse(data).people;
            people.sort((a, b) => (a.name > b.name) ? 1 : -1);
            renderContacts(people);
        },
        error: function (error) {
            console.log("Error: " + error);
        }

    })

    $("#contacts").on('click', ".list-group-item", function () {
        let id = $(this).attr("id");
        displayContact(id);
    })

    $("#contacts").on('click', ".btn", function () {
        if (aToZ) {
            people.sort((a, b) => (b.name > a.name) ? 1 : -1);
            aToZ = false;
        } else {
            people.sort((a, b) => (a.name > b.name) ? 1 : -1);
            aToZ = true;
        }
        
        renderContacts(people);
    })
})

function renderContacts(people) {
    $("#contacts").empty();
    let letter = people[0].name[0];
    $("#contacts").append(` <div class = "sortflex">
                                <h1>${letter}</h1>
                                <button class="btn btn-primary" type="button"><span class = "arrow">↓</span></button>
                            </div>`);
    for (let i = 0; i < people.length; i++) {
        if (people[i].name[0] !== letter) {
            letter = people[i].name[0];
            $("#contacts").append(`<h1>${letter}</h1>`);
        }
        $("#contacts").append(`<li class="list-group-item" id = "${i}">${people[i].name}</li>`);
    }

}

function displayContact(contactId) {
    if (prev != undefined) {
        $(`#${prev}`).removeClass("active");
    }
    $(".contact").empty();
    $(`#${contactId}`).addClass("active");
    let person = people[contactId];
    let card = `<div class="card w-100">
    <div class="card-header">
        <img class="photo"
            src="${person.img}"
            alt="${person.name} contact photo">
        <div class="headerinfo">
            <h2 class="contactname">${person.name}</h2>
        </div>
    </div>
    <div class="card-body">
        <h5 class="card-title">Contact Info</h5>
        <p class = "contactinfo">${person.contactInfo.position}</p>
        <p class = "contactinfo">${person.contactInfo.phoneNumber}</p>
        <p class = "contactinfo"><a href="mailto:${person.contactInfo.emailAddress}">${person.contactInfo.emailAddress}</a></p>
        <br>
        <h5>Education</h5>`

    for (let i = 0; i < person.education.length; i++) {
        if (person.education[i].endYear == undefined) {
            person.education[i].endYear = "Present";
        }
        card += `<div class="flexrow">
            <p class="date">${person.education[i].startYear}-${person.education[i].endYear}</p>
            <div class="itembody"><div class = "location">${person.education[i].institution}</div>
                ${person.education[i].degree}
            </div>
        </div>`
    }
    card += `<h5>Experience</h5>`
    for (let i = 0; i < person.workExperience.length; i++) {
        if (person.workExperience[i].endYear == undefined) {
            person.workExperience[i].endYear = "Present";
        }
        card += `<div class="flexrow">
            <p class="date">${person.workExperience[i].startYear}-${person.workExperience[i].endYear}</p>
            <div class="itembody"><div class = "location">${person.workExperience[i].institution}</div>
                ${person.workExperience[i].title}
            </div>
        </div>`
    }
    card += `</div>
                </div>`
    prev = contactId;
    $(card).hide().appendTo(".contact").fadeIn(500);
}