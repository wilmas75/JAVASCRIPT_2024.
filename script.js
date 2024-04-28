"use strict";

$(document).ready(function() {
    const searchInput = $('#searchInput');
    const resultsTable = $('#resultsTable');
    const resultsBody = $('#resultsBody');
    const noResults = $('#noResults');
    const loader = $('#loader');

    let timeout;

    searchInput.on('input', function() {
        clearTimeout(timeout);
        loader.show();
        resultsTable.hide();
        noResults.hide();
        resultsBody.empty();

        const searchTerm = $(this).val().trim();
        if (searchTerm === '') {
            loader.hide();
            return;
        }

        timeout = setTimeout(() => {
            $.ajax({
                url: '/search',
                method: 'GET',
                data: { term: searchTerm },
                success: function(response) {
                    loader.hide();
                    if (response.error) {
                        noResults.text(response.error).show();
                    } else {
                        if (response.results.length === 0) {
                            noResults.text('No results found.').show();
                        } else {
                            response.results.forEach(result => {
                                const row = `<tr>
                                    <td>${result.trackName}</td>
                                    <td>${result.artistName}</td>
                                </tr>`;
                                resultsBody.append(row);
                            });
                            resultsTable.show();
                        }
                    }
                },
                error: function() {
                    loader.hide();
                    noResults.text('Error fetching data.').show();
                }
            });
        }, 500); 
    });
});

