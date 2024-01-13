$(document).ready(function () {
  const amenityDict = {};
  const states = {};
  const cities = {};
  const users = {};
  const localhost = 'localhost';
  let stateCityArray = [];

  $('input[data-attribute=amenity]').click(function () {
    if ($(this).is(':checked')) {
      amenityDict[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenityDict[$(this).attr('data-id')];
    }
    $('.amenities h4').text(Object.values(amenityDict).join(', '));
  });

  $('input[data-attribute=state], input[data-attribute=city]').click(
    //add to states and cities objects
    function () {
      if ($(this).attr('data-attribute') === 'city') {
        if ($(this).is(':checked')) {
          cities[$(this).attr('data-id')] = $(this).attr('data-name');
        } else {
          delete cities[$(this).attr('data-id')];
        }
      } else if ($(this).attr('data-attribute') === 'state') {
        if ($(this).is(':checked')) {
          states[$(this).attr('data-id')] = $(this).attr('data-name');
        } else {
          delete states[$(this).attr('data-id')];
        }
      }

      //Display states and cities checked
      if (
        $(this).is(':checked') &&
        !stateCityArray.includes($(this).attr('data-name'))
      ) {
        stateCityArray.push($(this).attr('data-name'));
      } else if (!$(this).is(':checked')) {
        stateCityArray = stateCityArray.filter(
          (name) => name !== $(this).attr('data-name')
        );
      }
      $('.locations h4').text(stateCityArray.join(', '));
      // console.log('checked', stateCityArray);
    }
  );

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
              <b>Owner:</b> ${users[place.user_id]?.first_name} ${
            users[place.user_id]?.last_name
          }
            </div>
            <div class="description">
              ${place.description}
            </div>
            <div class="reviews" id="reviews-${place.id}">
              <h3>Reviews</h3>
              <span id="${place.id}" class="show_review">Show</span>
              <ul id="ul-${place.id}"></ul>
            </div>
          </article>
            `
        );
      }
    }
  });

  $(document).on('click', 'span.show_review', function () {
    let id = $(this).attr('id');
    $(`#ul-${id}`).text('Loading...');
    if ($(this).text() === 'Show') {
      $(this).text('Hide');

      getReviews(id).then((reviews) => {
        $(`#ul-${id}`).empty();
        $(`#ul-${id}`).append(
          `${reviews.map((review) => `<li>${review}</li>`).join('')}`
        );
        $(`#reviews-${id} h3`).text(`${reviews.length} Reviews`);
      });
    } else {
      $(this).text('Show');
      $(`#ul-${id}`).empty();
    }
  });

  $('button.search_btn').click(function () {
    $(this).attr('disabled', true);
    $('button.search_btn').text('Loading...');
    // console.log(
    //   'search:',
    //   Object.values(states),
    //   Object.values(cities),
    //   Object.values(amenityDict)
    // );
    $.ajax({
      type: 'POST',
      url: `http://${localhost}:5001/api/v1/places_search/`,
      contentType: 'application/json',
      data: JSON.stringify({
        amenities: [...Object.keys(amenityDict)],
        states: [...Object.keys(states)],
        cities: [...Object.keys(cities)]
      }),
      success: function (data, status) {
        $('.places').empty();
        $('button.search_btn').removeAttr('disabled');
        $('button.search_btn').text('Search');

        // console.log('success', data);
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
                        <div class="number_rooms">${
                          place.number_rooms
                        } Bedroom${place.number_rooms != 1 ? 's' : ''}</div>
                        <div class="number_bathrooms">${
                          place.number_bathrooms
                        } Bathroom${
              place.number_bathrooms != 1 ? 's' : ''
            }</div>
                </div>
                <div class="user">
                  <b>Owner:</b> ${users[place.user_id]?.first_name} ${
              users[place.user_id]?.last_name
            }
                </div>
                <div class="description">
                  ${place.description}
                </div>
                <div class="reviews" id="reviews-${place.id}" class=reviews>
                  <h3>Reviews</h3>
                  <span id="${place.id}" class="show_review">Show</span>
                  <ul id="ul-${place.id}"></ul>
                </div>
              </article>
            `
          );
        }
      },
      error: function (error) {
        $('button.search_btn').removeAttr('disabled');
        $('button.search_btn').text('Search');
        console.log('error', error);
      }
    });
  });

  function getReviews(id = null) {
    let reviewList = [];
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `http://${localhost}:5001/api/v1/places/${id}/reviews`,
        type: 'GET',
        success: function (data, status) {
          for (const review of data) {
            reviewList.push(review.text);
          }
          resolve(reviewList);
        },
        error: function (error) {
          reject(error);
        }
      });
    });
  }
});
