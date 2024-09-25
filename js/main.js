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

const deleteContact = async function (id) {
    try {
        const response = await fetch(URL + `/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        });
    } catch (error) {
        throw Error(error);
    }
}

const updateContact = async function (id, object) {
    try {
        const response = await fetch(URL + `/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(object)
        });

        return response;

    } catch (error) {
        throw Error(error);
    }
}

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
    const $inputs = document.querySelectorAll(`.mymodal [name]`);

    $inputs.forEach(item => {
        localStorage.setItem(item.name, item.value);
    })

    scrollBlock(false);
    document.querySelector('.mymodal').style.display = "none";
});

$add_button.addEventListener("click", () => {
    if (localStorage.length) {
        for (let i = 0; i < localStorage.length; i++) {
            document.querySelector(`.mymodal [name='${localStorage.key(i)}']`).value = localStorage.getItem(localStorage.key(i));
        }
    }
    scrollBlock(true);
    $modal.style.display = "flex";
});

$modal.addEventListener('mousedown', (event) => {
    if (event.target.className != 'mymodal') {
        return;
    }

    const $inputs = document.querySelectorAll(`.mymodal [name]`);

    $inputs.forEach(item => {
        localStorage.setItem(item.name, item.value);
    })

    scrollBlock(false);
    $modal.style.display = 'none';
});

document.querySelector('#form').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    data.avatar = 'https://i.pinimg.com/originals/ff/a0/9a/ffa09aec412db3f54deadf1b3781de2a.png';

    if ((data.firstName && !regexpName.test(data.firstName)) || (data.lastName && !regexpName.test(data.lastName))) {
        alert('Имя и фамилия должны состоять из букв!')
    }
    else {
        localStorage.setItem('email', data.email);
        localStorage.setItem('lastName', data.lastName);
        localStorage.setItem('firstName', data.firstName);

        postContact(data).then(() => {
            getAllContacts().then(result => {
                document.querySelector('.article').insertAdjacentHTML('beforeend', generateHTML(result[0]));
                scrollBlock(false);
                $modal.style.display = 'none';
            })
        });
    }
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

        const deleteCard = deleteContact(target.closest('.card-body').dataset.id).then(() => {
            target.closest('.mycard').remove();
        })
    }
})

document.querySelector('.modal-edit').addEventListener('click', event => {
    if (event.target.classList.contains('edit')) {
        const cardObj = getContact(document.querySelector('.modal-card-body').dataset.id);
        cardObj.then(data => {
            let $inputs = document.querySelectorAll('.modal-editor [name]');

            $inputs.forEach(input => {
                if (input.name === 'favourite') input.checked = data[input.name]
                else input.value = data[input.name];
            });

            document.querySelector('.modal-editor-body').dataset.id = data.id;
            event.target.closest('.modal-card').remove();
            $modal_editor.style.display = 'flex';
        })
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

    if (data['phoneNumber']) {
        if (!regexpNumber.test(data.phoneNumber)) {
            alert('Поддерживаемые форматы: +79001014567, 79001014567, 89001014567');
        }

        else {
            if ((data.firstName && !regexpName.test(data.firstName)) || (data.lastName && !regexpName.test(data.lastName))) {
                alert('Имя и фамилия должны состоять из букв!')
            }

            else {

                const $modal_body = document.querySelector('.modal-editor-body');
                // const item = array.find(item => item.id === document.querySelector('.modal-editor-body').dataset.id);
                getContact($modal_body.dataset.id).then(contact => {
                    for (let value in data) {
                        if (data[value] == contact[value]) {
                            delete data[value];
                        }
                    }
                    if (Object.keys(data).length) {
                        if (!data['firstName']) {
                            data['firstName'] = contact['firstName'];
                        }
                        if (!data['lastName']) {
                            data['lastName'] = contact['lastName'];
                        }
                        if (!data['email']) {
                            data['email'] = contact['email'];
                        }
                        updateContact($modal_body.dataset.id, data).then(() => {
                            const $card = document.querySelector(`.card-body[data-id='${contact.id}']`);
                            if (data['avatar'] !== undefined) $card.previousElementSibling.src = data['avatar'];
                            if (data['firstName'] !== undefined) $card.firstElementChild.children[0].innerHTML = data.firstName;

                            if (data['phoneNumber'] !== undefined) $card.firstElementChild.children[1].innerHTML = data['phoneNumber'];

                            if (data['description'] !== undefined) $card.firstElementChild.children[2].innerHTML = data['description'];

                            scrollBlock(false);
                            $modal_editor.style.display = 'none';
                        })
                    }
                    else {
                        scrollBlock(false);
                        $modal_editor.style.display = 'none';
                    }
                })
            }
        }
    }
})
// }

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
</section> `;

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
                E-mail: ${object.email}
            </p>
            <p class='modal-card-text'>
                Nickname: ${object.nickName}
            </p>
            <p class='modal-card-text'>
                Description: ${object.description}
            </p>
            <p class='modal-card-text'>
                Favourite: ${object.favourite}
            </p>
            <p class='modal-card-text'>
                Avatar link: ${object.avatar}
            </p>
            <p class='modal-card-text'>
                Phone Number: ${object.phoneNumber}
            </p>
        </div>
    </div>
    <div>
        <button type="button" class="btn btn-primary edit">Edit</button>
    </div>
</div>`;