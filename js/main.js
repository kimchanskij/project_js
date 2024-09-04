const $modal_close_button = document.querySelector('.btn-close');

const $add_button = document.querySelector('.add');

const $add_contact_button = document.querySelector('.modal-add')

const $modal = document.querySelector('.mymodal');

const $modal_body = document.querySelector('.mymodal-body');

const array = [];

$modal_close_button.addEventListener("click", () => {
    document.querySelector('.mymodal').style.display = "none";
});

$add_button.addEventListener("click", () => {
    $modal.style.display = "flex";
});

$modal.addEventListener('mousedown', (event) => {
    if (event.target.className != 'mymodal') {
        return;
    }

    $modal.style.display = 'none';
});



document.querySelector('#form').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData);
    array.push(data);
    if (!('favorite' in data)) data['favorite'] = 'off';
    if (data['number']) data['number'] = `+7${data['number']}`;
    document.querySelector('.article').insertAdjacentHTML('beforeend', generateHTML(data));
    $modal.style.display = 'none';
});

document.addEventListener('click', event => {
    if (event.target.matches('.open')) {
        array.find((item) => {
            if (event.target.closest(`[data-id=_${item.id}]`)) document.querySelector('.footer').insertAdjacentHTML('afterend', generateOpenCard(item));
        })
    }
    if (event.target.matches('.delete')) {
        let target = event.target;
        const index = array.findIndex((item) => {
            if (item.id == target.closest('.card-body').dataset.id.slice(1)) {
                return true;
            }
        })
        array.splice(index, 1);
        console.log(array);
        target.closest('.card').remove();
    }
    if (event.target.matches('#hi')) {
        document.getElementById('hihi').remove();
    }
})


const generateHTML = (object) => `<section class="card" style="width: 12rem;">
    <img src = "${object.picture_link}" class="card-img" alt = "...">
        <div class="card-body" data-id="_${object.id}">
            <h2 class="card-title">${object.name}</h2>
            <p class="card-text">${object.number}<br>${object.description}</br></p>
            <div class="article-section-button">
                <button type="button" class="btn btn-primary open">Open card</button>
                <button type="button" class="btn btn-danger delete">Delete</button>
            </div>
        </div>
            </section > `;

const generateOpenCard = (object) => `<div class="modal-card" id='hihi'>
        <div class="modal-card-body">
            <button type="button" class='btn-close' id='hi' aria-label="Close"></button>
            <div class="modal-card-info">
                <img class='modal-card-img' src='${object.picture_link}'>
                <p class='modal-card-text'>
                    -ID: ${object.id}
                    <br>-Name: ${object.name}</br>
                    -Surname: ${object.surname}
                    <br>-Number: ${object.number}</br>
                    -Description: ${object.description}
                    <br>-Favorite: ${object.favorite}</br>
                    -Picture link: ${object.picture_link}
                </p>
            </div>
        </div>
    </div>`;