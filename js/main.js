const $modal_close_button = document.querySelector('.btn-close');

const $add_button = document.querySelector('.add');

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
    if (!data['favorite']) {
        let picture = data['picture_link'];
        delete data['picture_link'];
        data['favorite'] = 'no';
        data['picture_link'] = picture;
    }
    let match = array.find(item => item.id == data.id)
    if (match) {
        alert('Контакт с данным ID уже существует!')
    }
    else {
        array.push(data);
        document.querySelector('.article').insertAdjacentHTML('beforeend', generateHTML(data));
        $modal.style.display = 'none';
    }
});

document.querySelector('.article').addEventListener('click', event => {
    if (event.target.matches('.open')) {
        array.find((item) => {
            if (event.target.closest('.card-body').getAttribute('data-id') === item.id) document.querySelector('.modal-edit').insertAdjacentHTML('beforeend', generateOpenCard(item));
        })
        let $card_close_button = document.querySelector('.btn-close');
        $card_close_button.addEventListener('click', (event) => {
            document.querySelector('.modal-card').remove();
        })
    }
    if (event.target.matches('.delete')) {
        let target = event.target;
        const index = array.findIndex((item) => {
            if (item.id == target.closest('.card-body').dataset.id) {
                return true;
            }
        })
        array.splice(index, 1);
        target.closest('.card').remove();
    }
})

document.querySelector('.modal-edit').addEventListener('click', event => {
    if (event.target.classList.contains('edit')) {
        array.find(item => {
            if (item.id == event.target.closest('.modal-card-body').getAttribute('data-id')) {
                let $element = document.querySelectorAll('.modal-editor [name]');
                let i = 0;
                document.querySelector('.modal-editor-body').dataset.id = item.id;
                for (let val in item) {
                    $element[i].value = item[val];
                    i++;
                }
                if (item['favorite'] == 'on') document.querySelector('.modal-editor [name="favorite"]').checked = true;
            }
        })
        event.target.closest('.modal-card').remove();
        document.querySelector('.modal-editor').style.display = 'flex';
    }
});

document.querySelector('.close-editor').addEventListener('click', () => {
    document.querySelector('.modal-editor').style.display = 'none';
})

document.querySelector('#form-edit').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData);
    if (!data['favorite']) {
        let picture = data['picture_link'];
        delete data['picture_link'];
        data['favorite'] = 'no';
        data['picture_link'] = picture;
    }
    array.find(item => {
        if (item.id == document.querySelector('.modal-editor-body').dataset.id) {
            for (let val in item) {
                item[val] = data[val]
            }
        }
    })
    let $card = document.querySelector(`.card-body[data-id='${data.id}']`);
    $card.previousElementSibling.src = data['picture_link'];
    $card.firstElementChild.innerHTML = data.name;
    $card.children[1].innerHTML = `${data.number}<br>${data.description}</br>`
    document.querySelector('.modal-editor').style.display = 'none';
})

const generateHTML = (object) => `<section class="card" style="width: 12rem;">
    <img src = "${object.picture_link}" class="card-img" alt = "фото контакта">
        <div class="card-body" data-id="${object.id}">
            <h2 class="card-title">${object.name}</h2>
            <p class="card-text">${object.number}<br>${object.description}</br></p>
            <div class="article-section-button">
                <button type="button" class="btn btn-primary open">Open card</button>
                <button type="button" class="btn btn-danger delete">Delete</button>
            </div>
        </div>
            </section > `;

const generateOpenCard = (object) => `<div class="modal-card">
        <div class="modal-card-body" data-id='${object.id}'>
            <button type="button" class='btn-close' aria-label="Close"></button>
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
            <button type="button" class="btn btn-primary edit">Edit</button>
        </div>
    </div>`;