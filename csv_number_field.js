// remove non numeric characters except "."
function sanitize_number(num) {
    let integer = [];
    if (isNaN(parseInt(num))) {
        // remove isNaN part
        for (let ndx = 0; ndx <= num.length; ndx++) {
            if (!isNaN(num[ndx])) {
                integer.push(num[ndx]);
            }
        }
        if (integer.length > 0) {
            return parseInt(integer.join('')).toLocaleString();
        }
        return '';
    }
    return parseInt(num).toLocaleString();
}

// make text field behave like a number field
// remove comma and extra dots from num to allow conversion to float
function number_input_behaviour(input, max_decimal_length) {
    // handle invalid pasted input like [ "3", "4,5", "67,6", "7", "", "", "77", "", "", "", "666"].join('.')
    const splitted = pin.value.split('.');
    // value has no decimal
    if (splitted.length == 1) {
        // remove potential commas, as they act as decimal
        // parseFloat & parseInt removes the part beyond ","
        let integer = splitted[0].split(',').join('');
        return sanitize_number(integer, splitted.length);
    }
    else if (splitted.length >= 2) {
        let [integer, decimals] = splitted;
        for (let num of [integer, decimals]) {
            num = num.split(',').join('');
            num = sanitize_number(num, splitted.length);
        }
        if (decimals.length > max_decimal_length) {
            decimals = decimals.slice(0, max_decimal_length);
        }
        else if (decimals == '') {
            decimals == '00';
        }
        return integer + '.' + decimals;
    }
}
 
function convert_to_text_field(field) {
    let dot_quant = 0;
    const max_decimal_length = 2;
    field.type = 'text';
    field.placeholder = `${max_decimal_length}-digit floating point values only!`
    field.title = `${max_decimal_length}-digit floating point values only!`
    if (field.value != '') {
        field.value = parseFloat(field.value).toLocaleString();
    }
    field.addEventListener('keyup', function(event) {
        if (!['Backspace', 'Delete'].includes(event.key )) {
            this.value = number_input_behaviour(field, max_decimal_length);
        }
    });
}

$( document ).ready(function() { 
    const change_form = document.querySelector('#content-main > form');
    const inhabitants = document.getElementById('id_inhabitants');
    convert_to_text_field(inhabitants);
    change_form.addEventListener('submit', function(event) {
        inhabitants.value = inhabitants.value.split(',').join('');
        document.getElementById('id_inhabitants').type = 'number';
    });
});
