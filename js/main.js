const $modal_close_button = document.querySelector('.btn-close');

const $editor_close_button = document.querySelector('.close-editor')

const $add_button = document.querySelector('.add');

const $modal = document.querySelector('.mymodal');

const $modal_body = document.querySelector('.mymodal-body');

const $modal_editor = document.querySelector('.modal-editor');

const array = [];

const regexpNumber = /^(\+7|[78])9\d{9}$/;

const regexpName = /^([a-zA-Zа-яА-Я]{1,})$/;

const URL = 'http://localhost:3050/api/v1/contacts'

const getAllContacts = async function () {
    try {
        const response = await (await fetch(URL)).json();
        return response;
    } catch (error) {
        throw Error(error);
    }
}

const getContact = async function (id) {
    try {
        const response = await (await fetch(URL + `/${id}`)).json();
        return response;
    } catch (error) {
        throw Error(error);
    }
}

const postContact = async function (object) {
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(object)
        });
        return response;
    } catch (error) {
        throw Error(error);
    }
}

// const deleteContact = async function (id) {
//     try {
//         const response = await (await fetch(URL + `/${id}`, {
//             method: 'DELETE',
//             headers: {
//                 'Content-Type': 
//             }
//         }));
//     } catch (error) {
//         throw Error(error);
//     }
// }

getAllContacts().then(result => {
    if (result.length > 0) {
        result.forEach(item => {
            document.querySelector('.article').insertAdjacentHTML('beforeend', generateHTML(item));
        })
    }
})

function scrollBlock(isBlock) {
    if (isBlock) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
}

$modal_close_button.addEventListener("click", () => {
    scrollBlock(false);
    document.querySelector('.mymodal').style.display = "none";
});

$add_button.addEventListener("click", () => {
    scrollBlock(true);
    $modal.style.display = "flex";
});

$modal.addEventListener('mousedown', (event) => {
    if (event.target.className != 'mymodal') {
        return;
    }
    scrollBlock(false);
    $modal.style.display = 'none';
});

document.querySelector('#form').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData);

    if (document.querySelector('#form .form-check-input').checked) {
        data['favourite'] = true;
    }
    else {
        data['favourite'] = false;
    }

    const postData = getAllContacts().then(arr => {
        const match = arr.find(elem => elem.id === data.id);
        if (!isNaN(data.id)) {
            if (match) {
                alert('Контакт с данным ID уже существует!')
            }
            else {
                if (!regexpNumber.test(data.phoneNumber)) {
                    alert('Поддерживаемые форматы: +79001014567, 79001014567, 89001014567');
                }
                else {
                    if ((data.name && !regexpName.test(data.name)) || (data.lastName && !regexpName.test(data.lastName))) {
                        console.log(data.firstName);
                        alert('Имя и фамилия должны состоять из букв!')
                    }
                    else {
                        postContact(data).then(() => {
                            document.querySelector('.article').insertAdjacentHTML('beforeend', generateHTML(data));
                            scrollBlock(false);
                            $modal.style.display = 'none';
                        });
                    }
                }
            }
        }
        else {
            alert('ID в неверном формате!');
        }
    });
});

document.querySelector('.article').addEventListener('click', event => {
    if (event.target.matches('.open')) {
        const openCard = getContact(event.target.closest('.card-body').getAttribute('data-id')).then((item) => {
            document.querySelector('.modal-edit').insertAdjacentHTML('beforeend', generateOpenCard(item));
            let $card_close_button = document.querySelector('.btn-close');
            let $modal_card = document.querySelector('.modal-card');

            scrollBlock(true);

            $card_close_button.addEventListener('click', (event) => {
                scrollBlock(false);
                $modal_card.remove();
            })

            $modal_card.addEventListener('mousedown', (event) => {
                if (event.target.closest('.modal-card-body')) return;

                scrollBlock(false);
                $modal_card.remove();
            });
        })
    }
    if (event.target.matches('.delete')) {
        let target = event.target;

        const deleteCard = get
        const index = array.findIndex((item) => {
            if (item.id == target.closest('.card-body').dataset.id) {
                return true;
            }
        })

        array.splice(index, 1);
        target.closest('.mycard').remove();
    }
})

document.querySelector('.modal-edit').addEventListener('click', event => {
    if (event.target.classList.contains('edit')) {
        const item = array.find(item => item.id == event.target.closest('.modal-card-body').getAttribute('data-id'));
        let $inputs = document.querySelectorAll('.modal-editor [name]');

        $inputs.forEach(input => {
            if (input.name === 'favourite') input.checked = item[input.name];
            else input.value = item[input.name];
        });

        document.querySelector('.modal-editor-body').dataset.id = item.id;
        event.target.closest('.modal-card').remove();
        $modal_editor.style.display = 'flex';
    }
});

$editor_close_button.addEventListener('click', () => {
    scrollBlock(false);
    $modal_editor.style.display = 'none';
})

$modal_editor.addEventListener('mousedown', (event) => {
    if (event.target.closest('.modal-editor-body')) return;
    scrollBlock(false);
    $modal_editor.style.display = 'none';
})

document.querySelector('#form-edit').addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData);

    if (document.querySelector('#form-edit .form-check-input').checked) {
        data['favourite'] = true;
    }
    else {
        data['favourite'] = false;
    }

    if (!regexpNumber.test(data.phoneNumber)) {
        alert('Поддерживаемые форматы: +79001014567, 79001014567, 89001014567');
    }
    else {
        if ((data.firstName && !regexpName.test(data.firstName)) || (data.lastName && !regexpName.test(data.lastName))) {
            alert('Имя и фамилия должны состоять из букв!')
        }
        else {
            const item = array.find(item => item.id === document.querySelector('.modal-editor-body').dataset.id);

            for (let value in item) {
                item[value] = data[value];
            }

            const $card = document.querySelector(`.card-body[data-id='${data.id}']`);
            $card.previousElementSibling.src = data['picture_link'];
            $card.firstElementChild.innerHTML = `<h2 class='card-title'>${data.firstName}</h2>
                                         <p class='card-number'>${data.phoneNumber}</p>
                                         <p class='card-text'>${data.description}</p>`
            scrollBlock(false);
            $modal_editor.style.display = 'none';
        }
    }
})

const generateHTML = (object) => `
<section class="mycard">
    <img src = "${object.avatar}" class="card-img" alt = "">
    <div class="card-body" data-id="${object.id}">
            <div class='card-body-info'>
                <h2 class="card-title">${object.firstName}</h2>
                <p class="card-number">${object.phoneNumber}</p>
                <p class="card-text">${object.description}</p>
        </div>
        <div class="article-section-button">
                <button type="button" class="open">Open card</button>
                <button type="button" class="delete">Delete</button>
        </div>
    </div>
</section > `;

const generateOpenCard = (object) => `
<div class="modal-card">
    <div class="modal-card-body" data-id='${object.id}'>
        <button type="button" class='btn-close' aria-label="Close"></button>
        <div class=modal-card-inner>
            <div class=modal-card-img>
            <img class='modal-card-img-inner' src='${object.avatar}' alt=''>
        </div>
        <div class="modal-card-info">
            <p class='modal-card-text'>
                ID: ${object.id}
            </p>
            <p class='modal-card-text'>
                Name: ${object.firstName}
            </p>
            <p class='modal-card-text'>
                Surname: ${object.lastName}
            </p>
            <p class='modal-card-text'>
                Number: ${object.phoneNumber}
            </p>
            <p class='modal-card-text'>
                Description: ${object.description}
            </p>
            <p class='modal-card-text'>
                Favourite: ${object.favourite}
            </p>
            <p class='modal-card-text'>
                Picture link: ${object.avatar}
        </div>
        </div>
        <button type="button" class="btn btn-primary edit">Edit</button>
    </div>
</div>`;