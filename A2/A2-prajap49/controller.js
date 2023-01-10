// Add all your JS code here
// Vedant Prajapati - 1005137610
function validateUsername() {
    if (!/^[a-zA-Z0-9_]{6,}$/.test($("#username").val())) {
        $('#username_notification').html("Username is invalid")
        $('#username').css("background-color", "red")
    }
    else {
        $('#username_notification').html("")
        $('#username').css("background-color", "")
    }
}

function validatePassword() {

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test($("#password1").val())) {
        $('#password2_notification').html("Password is invalid")
        $('#password1').css("background-color", "red")
    }
    else {
        $('#password2_notification').html("")
        $('#password1').css("background-color", "")
    }

    if ($('#password1_notification').html() !== "Password is invalid") {
        console.log($("#password1_notification").val())
        if ($("#password1").val() !== $("#password2").val()) {
            $('#password2_notification').html("Passwords Don't Match")
            $('#password2').css("background-color", "red")
        }
        else {
            $('#password2_notification').html("")
            $('#password2').css("background-color", "")
        }
    }
}

function validateEmail() {
    //regex (RFC5322 for canonical email addresses)
    //Accepts spaces 
    //modified to not allow IPv6 and allows local domain name with no TLD see: https://en.wikipedia.org/wiki/Email_address#Examples 
    //obtained from https://www.abstractapi.com/guides/email-address-pattern-validation
    //meets requirements as per wikipedia https://en.wikipedia.org/wiki/Email_address 
    var re = /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*)/

    if (!re.test($("#email").val())) {
        $('#email_notification').html("Email is invalid")
        $('#email').css("background-color", "red")
    }
    else {
        $('#email_notification').html("")
        $('#email').css("background-color", "")
    }
}

function validatePhone() {

    if (!/^[1-9]\d{2}-\d{3}-\d{4}/.test($("#phone").val())) {
        $('#phone_notification').html("Phone is invalid")
        $('#phone').css("background-color", "red")
    }
    else {
        $('#phone_notification').html("")
        $('#phone').css("background-color", "")
    }
}

function validateAll() {
    if ($("#username_notification").val() || $("#password1_notification").val() || $("#password2_notification").val() || $("#email_notification").val() || $("#phone_notification").val()) {
        $("notification").html("At least one field is invalid. Please correct it before proceeding")
    }
}

function createItem(item) {
    var item_id = item.name.replace(" ", "_")

    $("#cart-items tbody").append('<tr id="' + item_id + '">\
        <td> ' + item.name + ' </td>\
        <td> ' + item.price + ' </td>\
        <td> ' + item.quantity + ' </td>\
        <td> ' + item.total + ' </td>\
        <td> <button class="decrease"> - </button> </td>\
        <td> <button class="increase"> + </button> </td>\
        <td> <button class="delete"> delete </button> </td>')
    updatetotals()
}

function updatetotals() {
    var total = 0
    for (var i = 0; i < $("#cart-items tbody")[0].rows.length; i++) {
        var currRowTotal = parseFloat($("#cart-items tr:eq(" + (i + 1) + ") td:eq(3)").text()).toFixed(2)
        total += parseFloat(currRowTotal)
    }
    $("#subtotal").html((total).toFixed(2))
    $("#taxes").html((total * 0.13).toFixed(2))
    $("#grand_total").html((total * 1.13).toFixed(2))

}

function modifyItem(name, price, quantity) {
    var rowId = name.replace(" ", "_")
    $("#" + rowId + " td:eq(1)").html(price)
    $("#" + rowId + " td:eq(2)").html(quantity)
    $("#" + rowId + " td:eq(3)").html(quantity * price)

    updatetotals()
}

function renderpages(page) {
    $.ajax({
        type: "GET",
        url: "https://csc309.teach.cs.toronto.edu/a2/text/data?paragraph=" + page,
        success: function (resp) {
            for (var i = 0; i < resp.data.length; i++) {
                $("#data").append("<div id=paragraph_" + resp.data[i].paragraph + ">" + "</div>")
                $("#paragraph_" + resp.data[i].paragraph).append("<p>" + resp.data[i].content + "</p>")
                $("#paragraph_" + resp.data[i].paragraph + " p").append("<b>(Paragraph: " + resp.data[i].paragraph + ")</b>")
                $("#paragraph_" + resp.data[i].paragraph).append('<button class="like">Likes ' + resp.data[i].likes + '</button>')
            }
        },
        error: function (errMsg) {

        }
    });


}
var currParagraph = 1;
$(document).ready(function () {
    // all custom jQuery will go here and are executed
    // once the page is ready   
    $("#username").keyup(function () {
        validateUsername()
    });

    $("#password1").keyup(function () {
        validatePassword()
    });

    $("#password2").keyup(function () {
        validatePassword()
    });

    $("#email").keyup(function () {
        validateEmail()
    });

    $("#phone").keyup(function () {
        validatePhone()
    });

    validateAll()

    $("#register").click(function () {

        var jsondata = JSON.stringify({ username: $("#username").val(), password1: $("#password1").val(), password2: $("#password2").val(), email: $("#email").val(), phone: $("#phone").val() })
        $.ajax({
            type: "POST",
            url: "https://csc309.teach.cs.toronto.edu/a2/register",
            data: jsondata,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data.message === "User added.") {
                    $('#notification').html("User added")
                }
            },
            error: function (errMsg) {
                if (errMsg.status === 409) {
                    $('#notification').html("Username has already been taken")

                }
                else if (errMsg.status === 404) {
                    $('#notification').html("Unknown error occurred")
                }

            }
        });


    });

    $("#add_update_item").click(function () {
        var item_id = $("#name").val().replace(" ", "_")
        if ($("#" + item_id).length === 0) {
            createItem(new Item($("#name").val(), $("#price").val(), $("#quantity").val()))
        }
        else {
            modifyItem($("#name").val(), $("#price").val(), $("#quantity").val())
        }
    });

    $('#cart-items').on('click', '.increase', function () {
        var rowName = $(this).parent().parent().find('td:eq(0)').text().trim()
        var rowPrice = $(this).parent().parent().find('td:eq(1)').text()
        var rowQuantity = parseInt($(this).parent().parent().find('td:eq(2)').text()) + 1

        modifyItem(rowName, rowPrice, rowQuantity)

    })

    $('#cart-items').on('click', '.decrease', function () {
        var rowName = $(this).parent().parent().find('td:eq(0)').text().trim()
        var rowPrice = $(this).parent().parent().find('td:eq(1)').text()
        var rowQuantity = parseInt($(this).parent().parent().find('td:eq(2)').text()) - 1

        if (rowQuantity >= 0) {
            modifyItem(rowName, rowPrice, rowQuantity)
        }

    });

    $('#cart-items').on('click', '.delete', function () {
        var rowId = $(this).parent().parent().find('td:eq(0)').text().trim().replace(" ", "_")
        $("#" + rowId).remove()
        updatetotals()
    });

    renderpages(currParagraph);
    currParagraph += 5;

    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() >= $(document).height() - 1) {
            if (currParagraph <= 21) {
                renderpages(currParagraph)
            }
            if (currParagraph == 26) {
                $("#data").append("<p><b>You have reached the end</b></p>")
            }
            currParagraph += 5

        }
    });
});
