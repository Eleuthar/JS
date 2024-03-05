<script>
    // maintaining the state of each variable.
    var current_page = 1; // maintains the current page
    var page_limit = 10; // the limit of results shown on page.
    var sort_by = ""; // maintains the select option for sort_by
    var country = ""; // maintains the select option for country
    var start_year = ""; // maintains the select option for start_yr
    var end_year = ""; // maintains the select option for end_yr

    function get_list_url(page) {
        // returns the consructed url with query params.
        return `api/get/top_songs?page=${page}&limit=${page_limit}&country=${country}&sort_by=${sort_by}&start=${start_year}&end=${end_year}`;
    }

    function getCountries() {
        // call the ajax and populates the country select options
        $.ajax({
            method: 'GET',
            url: $("#countries").attr("url"),
            success: function (response) {
                countries_option = "<option value='all' selected>All Countries</option>";
                $.each(response["country"], function (a, b) {
                    countries_option += "<option>" + b + "</option>"
                });
                $("#countries").html(countries_option)
            },
            error: function (response) {
                console.log(response)
            }
        });
    }

    // On select change of the country select, call the getAPIData
    $("#countries").on("change", function (e) {
        current_page = 1;
        country = this.value
        getAPIData(get_list_url(current_page));
    });
    // On select change of the year select, call the getAPIData
    $("#year").on("change", function (e) {
        current_page = 1;
        start_year = $(this).find(':selected').attr("start");
        end_year = $(this).find(':selected').attr("end");
        getAPIData(get_list_url(current_page));
    })
    // On select change of the sort select, call the getAPIData with sortby.
    $("#sort").on("change", function (e) {
        current_page = 1;
        sort_by = this.value
        getAPIData(get_list_url(current_page));
    })

    // Helper method that popluates the html table with next and prev
    // url, and current page number.
    function putTableData(response) {
        // creating table row for each response and
        // pushing to the html cntent of table body of table_body table
        let row;
        $("#table_body").html("");
        if (response["data"].length > 0) {
            $.each(response["data"], function (a, b) {
                row = "<tr> <td>" + b.title + "</td>" +
                    "<td>" + b.country + "</td>" +
                    "<td>" + b.top_genre + "</td>" +
                    "<td>" + b.artist + "</td>" +
                    "<td>" + b.duration + "</td>" +
                    "<td>" + b.pop + "</td>" +
                    "<td>" + b.year + "</td>" +
                    $("#table_body").append(row);
            });
        }
        else{
            // if there is no results found!
           $("#table_body").html("No results found."); 
        }
        if (response.pagination.has_prev) {
            // sets the previous page url.
            $("#previous").attr("data-url", get_list_url(current_page - 1));
            $("#previous").attr("disabled", false);
        } else {
            // if there is no prev page available, disable the btn.
            $("#previous").attr("disabled", true);
        }
        if (response.pagination.has_next) {
            // sets the next page url.
            $("#next").attr("data-url", get_list_url(current_page + 1));
            $("#next").attr("disabled", false);
        } else {
            // if there is no next page available, disable the btn.
            $("#next").attr("disabled", true)
        }
    }

    // On click of next/prev button, call the getAPIData with the given url.
    $(".page-link").click(function (e) {
        e.preventDefault();
        let url = $(this).attr("data-url");
        getAPIData(url);
    })

    // Main method which calls AJAX to get the data from backend.
    function getAPIData(url) {
        $.ajax({
            method: 'GET',
            url: url,
            success: function (response) {
                current_page = parseInt(response.pagination.page)
                putTableData(response);
                // put the total result count.
                $("#result-count span").html(response.pagination.total)
                $("#page-count span").html(response.pagination.page)
            },
            error: function (response) {
                $("#hero_table").hide();
            }
        });
    }

    //on page load, call this two methods.
    getAPIData(get_list_url(current_page));
    getCountries()
</script>
