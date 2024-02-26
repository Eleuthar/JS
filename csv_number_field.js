// 'allow' number field to dynamically behave like a text field, allowing thousand comma separator
// on document load, convert number input type to 'text'
// add event listener for converted input field to remove NaN char including ","
// add on submit form event listener
// on valid form submit, transform silently the number field value to allow backend validation as decimal \ float


// function validate_form(change_form) {
//     for (let input of document.querySelectorAll(`#${change_form.id} input:not([type="submit"])`)) {}
// }

// make text field behave like a number field
function number_input_behaviour(integer, dot, decimals, max_decimal_length) {
    if (dot) {
        let csv = integer.toLocaleString;
        // full number including decimal digits
        let decimal = decimals.length > 0 ? csv + '.' + decimals.join('') : csv;
        let char_ndx = decimal.length - 1;
        let splitted = decimal.split('');
        let num_len = decimals.length;

        // delete extra decimal digit
        if (num_len == max_decimal_length) {
            splitted.splice(char_ndx, 1);
        }
        // add decimal digit if valid
        else if (num_len < max_decimal_length) {
            let char = decimal[char_ndx];
            if (isNaN(char)) {
                splitted.splice(char_ndx, 1);
            }
            else {
                decimals.push(char);
            }
        }
    }
    else {
        let char_ndx = integer.length - 1;
        let char = integer[char_ndx];
        // remove automagically character if NaN 
        if (isNaN(char)) {
            if ("." != char) {
                let splitted = integer.split('');
                splitted.splice(ndx, 1);
                csv = parseInt(integer.join('')).toLocaleString();
            }
            // only 2-digit decimals allowed
            else if (char == '.') {
                // store dot index
                if (!dot) {
                    dot = True;
                }
            }
        }
    }    
    return csv, integer, dot, decimals;
}

// remove comma to allow conversion to float
function to_decimal(num) {
    for (let q = 0; q <= num.length; q++) {
        if (num[q] == ',') {
            num.splice(q, 1);
        }
    }
    return num.join('');
}

$( document ).ready(function() {
    let dot = False;
    let decimals = [];
    let csv = null;
    const change_form = document.querySelector('#content-main > form');
    const inhabitants = document.getElementById('id_inhabitants');
    inhabitants.type = 'text';
    // 
    inhabitants.addEventListener('keyup', function(evt) {
        [csv, integer, dot, decimals] = number_input_behaviour(integer, dot, decimals, max_decimal_length);
    });

    change_form.addEventListener('submit', function(event) {
        buffered = to_decimal(inhabitants.value.split(''));
        document.getElementById('id_inhabitants').type = 'number';
        inhabitants.value = buffered;
    });
});
