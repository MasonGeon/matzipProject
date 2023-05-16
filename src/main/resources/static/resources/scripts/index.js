const list = document.getElementById('list');
const searchForm = document.getElementById('searchForm');
const loginButton = document.getElementById('loginButton');
const loginContainer = document.getElementById('loginContainer');
const loginFrame = document.getElementById('loginFrame');


const detailContainer = document.getElementById('detailContainer');
detailContainer.show = (placeObject) => {
    detailContainer.querySelectorAll('[rel="title"]').forEach(x => x.innerText = placeObject['name']);
    detailContainer.querySelector('[rel="score"]').innerText = placeObject['score'].toFixed(1);
    detailContainer.querySelector('[rel="addressText"]').innerText = `${placeObject['addressPrimary']}${placeObject['addressSecondary'] ? `\n${placeObject['addressSecondary']}` : ''}`;

    const openFrom = new Date(placeObject['openFrom']);
    const openTo = new Date(placeObject['openTo']);
    detailContainer.querySelector('[rel=openText]').innerText = `${openFrom.getHours() < 10 ? '0' : ''}${openFrom.getHours()}:${openFrom.getMinutes() < 10 ? '0' : ''}${openFrom.getMinutes()} ~ ${openTo.getHours() < 10 ? '0' : ''}${openTo.getHours()}:${openTo.getMinutes() < 10 ? '0' : ''}${openTo.getMinutes()}`;
    const contact = `${placeObject['contactFirst']}-${placeObject['contactSecond']}-${placeObject['contactThird']}`;
    detailContainer.querySelector('[rel="contactText"]').innerText = contact;
    detailContainer.querySelector('[rel="contactText"]').setAttribute('href', `tel:${contact}}`);
    const homepageTextElement = detailContainer.querySelector('[rel="homepageText"]');
    if (placeObject['homepage']) {
        homepageTextElement.innerText = placeObject['homepage'];
        homepageTextElement.setAttribute('href', placeObject['homepage']);
        homepageTextElement.parentElement.parentElement.classList.remove('hidden');
    } else {
        homepageTextElement.parentElement.parentElement.classList.add('hidden');
    }
    detailContainer.querySelector('[rel="descriptionText"]').innerText = placeObject['description'];
    if (reviewForm) {
        reviewForm['placeIndex'].value = placeObject['index'];
    }
    detailContainer.classList.add('visible');
    loadReviews(placeObject['index']);
};
detailContainer.hide = () => detailContainer.classList.remove('visible');
detailContainer.querySelector('[rel="closeButton"]').addEventListener('click', () => {
    detailContainer.hide();
})

const reviewForm = document.getElementById('reviewForm');
const mapContainer = document.getElementById('mapContainer');

let mapObject;
let places = [];

const loadMap = (lat, lng) => {
    mapObject = new kakao.maps.Map(mapContainer, {
        center: new kakao.maps.LatLng(lat, lng),
        level: 3
    });
    kakao.maps.event.addListener(mapObject, 'dragend', () => { //drag가 멈췄을 때
        // const bounds = mapObject.getBounds();
        // const ne = bounds.getNorthEast();
        // const sw = bounds.getSouthWest();
        // loadPlaces(ne, sw);
        loadPlaces();
    });
    kakao.maps.event.addListener(mapObject, 'zoom_changed', () => { //지도 zoom했을 때도 목록 보이게
        loadPlaces();
    })
    loadPlaces();
};

const loadPlaces = (ne, sw) => {
    if (!ne || !sw) { // ne,sw가 정의되지 않았다면
        const bounds = mapObject.getBounds();
        ne = bounds.getNorthEast();
        sw = bounds.getSouthWest();
    }
    list.innerHTML = '';
    const xhr = new XMLHttpRequest();
    // const formData = new FormData();
    // formData.append('minLat',sw['Ma']);
    // formData.append('minLng',sw['La']);
    // formData.append('maxLat',ne['Ma']);
    // formData.append('maxLng',ne['La']); get방식이라 formData 못씀
    xhr.open('GET', `./data/place?minLat=${sw['Ma']}&minLng=${sw['La']}&maxLat=${ne['Ma']}&maxLng=${ne['La']}`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const placeArray = JSON.parse(xhr.responseText);
                places = placeArray;
                for (const placeObject of placeArray) {
                    const position = new kakao.maps.LatLng(
                        placeObject['latitude'],
                        placeObject['longitude']);
                    const marker = new kakao.maps.Marker({
                        position: position,
                        clickable: true
                    });
                    kakao.maps.event.addListener(marker, 'click', () => {
                        detailContainer.show(placeObject);
                    });
                    marker.setMap(mapObject);

                    const placeHtml = `
            <li class="item visible" rel="item">
                <span class="info">
                    <span class="name-container">
                    <span class="name" rel="name">${placeObject['name']}</span>
                    <span class="category">${placeObject['categoryIndex']}</span>
                </span>
                <span class="rating-container">
                    <span class="star-container">
                        <i class="fa-solid  star fa-star ${placeObject['score'] >= 1 ? 'filled' : ''}" ></i>
                        <i class="fa-solid  star fa-star ${placeObject['score'] >= 2 ? 'filled' : ''}" ></i>
                        <i class="fa-solid  star fa-star ${placeObject['score'] >= 3 ? 'filled' : ''}" ></i>
                        <i class="fa-solid  star fa-star ${placeObject['score'] >= 4 ? 'filled' : ''}" ></i>
                        <i class="fa-solid  star fa-star ${placeObject['score'] >= 5 ? ' filled' : ''}" ></i>
                    </span>
                    <span class="score">${placeObject['score'].toFixed(1)}</span>
                    <span class="count">4건</span>
                    <span class="review-count">리뷰 13</span>
                </span>
            <span class="open-container">
                <span class="working">영업 전</span>
<!--                <span class="hour">${placeObject['openFrom']}</span>-->
                <span class="hour">${new Date(placeObject['openFrom']).toLocaleTimeString("ko-KR", {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</span>
            </span>
            <span class="address">${placeObject['addressPrimary']}
            ${placeObject['addressSecondary'] ?? ''}</span>
            <span class="contact">${placeObject['contactFirst']}-${placeObject['contactSecond']}-${placeObject['contactThird']}</span>
            </span>
            <img alt="" class="image" src="./data/placeImage?pi=${placeObject['index']}">
        </li>`;
                    const placeElement = new DOMParser().parseFromString(placeHtml, 'text/html')
                        .querySelector('[rel="item"]');

                    placeElement.addEventListener('click', () => {
                        const latLng = new kakao.maps.LatLng(placeObject['latitude'], placeObject['longitude']);
                        mapObject.setCenter(latLng);
                        detailContainer.show(placeObject);
                    });
                    list.append(placeElement);
                }
            } else {

            }
        }
    };
    xhr.send();
}


//위치정보 활용시 허용창
navigator.geolocation.getCurrentPosition(e => {
    loadMap(e['coords']['latitude'], e['coords']['longitude']);
}, () => {
    loadMap(35.8715411, 128.601505)
});

searchForm['keyword'].addEventListener('input', () => {
    const keyword = searchForm['keyword'].value;
    const itemArray = Array.from(list.querySelectorAll(`:scope > [rel="item"]`));
    for (let item of itemArray) {
        const name = item.querySelector('[rel="name"]').innerText;
        if (keyword === '' || name.indexOf(keyword) > -1) {
            item.classList.add('visible');
        } else {
            item.classList.remove('visible');
        }
    }
});

loginButton?.addEventListener('click', e => {
    e.preventDefault();
    loginContainer.classList.add('visible');
    window.open('https://kauth.kakao.com/oauth/authorize?client_id=51a9d274b60c31d66fa34bd02e2488dd&redirect_uri=http://localhost:8080/member/kakao&response_type=code', '로그인', 'width=500; height=750');
});

const reviewContainer = detailContainer.querySelector('[rel="reviewContainer"]');
const loadReviews = (placeIndex) => {
    reviewContainer.innerHTML = '';
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    xhr.open('GET', `./data/review?pi=${placeIndex}`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseArray = JSON.parse(xhr.responseText);
                for (const reviewObject of responseArray) {
                    const itemHtml = `
                        <li class="item" rel="item">
                        <span class="nickname" rel="nickname">닉넴</span>
                        <div class="image-container" rel="imageContainer"></div>
                        <span class="content" rel="content">어쩌고</span>
                        <span class="date" rel="date">2022-10-10</span>
                    </li>`;
                    const itemElement = new DOMParser().parseFromString(itemHtml, 'text/html').querySelector('[rel="item"]');
                    const imageContainerElement = itemElement.querySelector('[rel="imageContainer"]');
                    if (reviewObject['imagesIndexes'].length > 0) {
                        //지금 여기가안됨
                        for (const imageIndex of reviewObject['imagesIndexes']) {
                            const imageElement = document.createElement('img');
                            imageElement.setAttribute('alt', '');
                            imageElement.setAttribute('src', `./data/reviewImage?index=${imageIndex}`);
                            imageElement.classList.add('image');
                            imageContainerElement.append(imageElement);
                        }
                    } else {
                        imageContainerElement.remove();
                    }
                    reviewContainer.append(itemElement);
                }
            } else {
                alert('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
            }
        }
    };
    xhr.send();
};


if (reviewForm) {
    reviewForm.querySelector('[rel="imageSelectButton"]').addEventListener('click', e => {
        e.preventDefault();
        reviewForm['images'].click();
    });

    const reviewStarArray = Array.from(reviewForm
        .querySelector('[rel="starContainer"]')
        .querySelectorAll(':scope > .star'));
    for (let i = 0; i < reviewStarArray.length; i++) {
        reviewStarArray[i].addEventListener('click', () => {
            reviewStarArray.forEach(x => x.classList.remove('selected'));
            for (let j = 0; j <= i; j++) {
                reviewStarArray[j].classList.add('selected');
            }
            reviewForm.querySelector('[rel="score"]').innerText = i + 1; // 단순 뷰단에 보이기용
            reviewForm['score'].value = i + 1; // 서버로 보내는 구문, 개발자 도구를 보면 html hidden 속성이 있는 태그의 값이 바뀐다.
        });
    }

    reviewForm['images'].addEventListener('input', () => {
        const imageContainerElement = reviewForm.querySelector('[rel="imageContainer"]');
        imageContainerElement.querySelectorAll('img.image').forEach(x => x.remove());
        if (reviewForm['images'].files.length > 0) {
            reviewForm.querySelector('[rel="noImage"]').classList.add('hidden');
        } else {
            reviewForm.querySelector('[rel="noImage"]').classList.remove('hidden');
        }
        for (let file of reviewForm['images'].files) {
            const imageSrc = URL.createObjectURL(file);
            const imgElement = document.createElement('img');
            imgElement.classList.add('image');
            imgElement.setAttribute('src', imageSrc);
            imageContainerElement.append(imgElement);
        }
    });

    reviewForm.onsubmit = e => {
        if (reviewForm['score'].value === 0) {
            alert('별점을 선택해 주세요');
            return false;
        }
        if (reviewForm['content'].value === '') {
            alert('내용을 입력해 주세요');
            return false;
        }
        e.preventDefault();
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('placeIndex', reviewForm['placeIndex'].value);
        formData.append('score', reviewForm['score'].value);
        formData.append('content', reviewForm['content'].value);
        for (let file of reviewForm['images'].files) {
            formData.append('images', file);
        }
        xhr.open('POST', './data/review');
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const responseObject = JSON.parse(xhr.responseText);
                    switch (responseObject['result']) {
                        case 'not_signed':
                            alert('로그인 되어있지 않습니다. 로그인 후 다시 시도해 주세요.');
                            break;
                        case 'success':
                            loadReviews(reviewForm['placeIndex'].value);
                            break;
                        default:
                            alert('알 수 없는 이유로 리뷰를 작성하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                    }
                } else {
                    alert('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                }
            }
        }
        xhr.send(formData);
    };
}