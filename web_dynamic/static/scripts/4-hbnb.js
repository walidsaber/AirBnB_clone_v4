$(document).ready(function () {
  /**@type {Object<string, string>}*/
  const amenityDict = {};
  const users = {};
  const localhost = 'localhost';

  $('input[type=checkbox]').click(function () {
    if ($(this).is(':checked')) {
      amenityDict[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenityDict[$(this).attr('data-id')];
    }
    $('.amenities h4').text(Object.values(amenityDict).join(', '));
  });
  $.get(`http://${localhost}:5001/api/v1/status/`, function (data, status) {
    if (status === 'success') {
      $('DIV#api_status').addClass('available');
    } else {
      $('DIV#api_status').removeClass('available');
    }
  });

  $.ajax({
    url: `http://${localhost}:5001/api/v1/users/`,
    type: 'GET',
    success: function (data, status) {
      for (const user of data) {
        users[user.id] = {
          first_name: user.first_name,
          last_name: user.last_name
        };
      }
    }
  });

  $.ajax({
    type: 'POST',
    url: `http://${localhost}:5001/api/v1/places_search/`,
    data: '{}',
    contentType: 'application/json',
    success: function (data, status) {
      for (const place of data) {
        $('.places').append(
          `
          <article>
          <div class="title_box">
            <h2>${place.name}</h2>
            <div class="price_by_night">$${place.price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest">${place.max_guest} Guest${
            place.max_guest != 1 ? 's' : ''
          }</div>
                  <div class="number_rooms">${place.number_rooms} Bedroom${
            place.number_rooms != 1 ? 's' : ''
          }</div>
                  <div class="number_bathrooms">${
                    place.number_bathrooms
                  } Bathroom${place.number_bathrooms != 1 ? 's' : ''}</div>
          </div>
          <div class="user">
            <b>Owner:</b> ${users[place.user_id].first_name} ${
            users[place.user_id].last_name
          }
          </div>
          <div class="description">
            ${place.description}
          </div>
        </article>
          `
        );
      }
    }
  });

  $('button.search_btn').click(function () {
    $.ajax({
      type: 'POST',
      url: `http://${localhost}:5001/api/v1/places_search/`,
      contentType: 'application/json',
      data: JSON.stringify(
        Object.values(amenityDict).length > 1
          ? {
              amenities: [...Object.keys(amenityDict)]
            }
          : {}
      ),
      success: function (data, status) {
        $('.places').empty();
        for (const place of data) {
          $('.places').append(
            `
            <article>
            <div class="title_box">
              <h2>${place.name}</h2>
              <div class="price_by_night">$${place.price_by_night}</div>
            </div>
            <div class="information">
              <div class="max_guest">${place.max_guest} Guest${
              place.max_guest != 1 ? 's' : ''
            }</div>
                    <div class="number_rooms">${place.number_rooms} Bedroom${
              place.number_rooms != 1 ? 's' : ''
            }</div>
                    <div class="number_bathrooms">${
                      place.number_bathrooms
                    } Bathroom${place.number_bathrooms != 1 ? 's' : ''}</div>
            </div>
            <div class="user">
              <b>Owner:</b> ${users[place.user_id].first_name} ${
              users[place.user_id].last_name
            }
            </div>
            <div class="description">
              ${place.description}
            </div>
          </article>
            `
          );
        }
      }
    });
  });
});
