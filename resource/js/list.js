let shop = []
let menu = []

$.ajax({
    url:`/resource/api/bakeries.php`,
    method: 'get',
    data : {
        type: 'menuList'
    },
    success: res => {
        menu = res.sort((a, b) => a.idx - b.idx)
        console.log(menu)
    }
})

$.ajax({
    url:`/resource/api/bakeries.php`,
    method: 'get',
    data : {
        type: 'bakeries'
    },
    success: res => {
        shop = res.sort((a, b) => a.idx - b.idx)

        console.log(shop)

        shop.forEach(item => {
            let box = `<div class="card shop__item" style="width: 18rem;">
                            <img src="./resource/img/shop/${item.mainImage}" class="card-img-top" alt="shop-img" title="shop-img">
                            <div class="card-body">
                                <h5 class="card-title">${item.name}</h5>
                                <p class="card-text">${item.openTime} ~ ${item.endTime}</p>
                                <p class="card-text">${item.intro}</p>
                                <button data-id="${item.idx}" class="btn more btn-primary">상세보기</button>
                                <button data-id="${item.idx}" class="btn menu btn-primary">메뉴보기</button>
                                <a href="#" data-id="${item.idx}" class="btn search btn-primary mt-2">유사한 빵집 찾아보기</a>
                            </div>
                        </div>`
            $('.store-list__box').append(box)
        });

        document.querySelectorAll('.more').forEach(item => {
            item.addEventListener('click', e => {
                let id = e.target.dataset.id - 1

                $('#more .modal-body').html(`<div class="left">
                                                <img src="./resource/img/shop/${shop[id].mainImage}" alt="main-image" title="main-image">
                                                ${subImg(id)}
                                            </div>
                                            <div class="right">
                                                <h3 class="title"><span class="line"></span> ${shop[id].name}</h3>
                                                <hr>

                                                <p><i class="fas fa-clock"></i> ${shop[id].openTime} ~ ${shop[id].endTime}</p>
                                                <p><i class="fas fa-map"></i> ${shop[id].location}</p>
                                                <p>${shop[id].intro}</p>

                                            </div>`)

                $('#more').modal('show')
            })
        })

        document.querySelectorAll('.menu').forEach(item => {
            item.addEventListener('click', e => {
                let id = e.target.dataset.id
                let res = menu.filter(x => x.bakerIdx == id)

                $('#menu .modal-body').html("")

                res.forEach(item => {
                    let box = `<div class="menu__item mb-4 row">
                                    <div class="menu__img col-4">
                                        <img src="./resource/img/menuList/${item.image}" alt="menu-img" title="menu-img">
                                    </div>
                                    <div class="menu__info col-8">
                                        <h4 class="title"><span class="line"></span> ${item.name}</h4>
                                        <hr>
                                        <p>${Number(item.price).toLocaleString()}￦</p>
                                        <p>${item.intro}</p>
                                        <p>알레르기 정보 : ${item.allergy}</p>
                                    </div>
                                </div>`
                    $('#menu .modal-body').append(box)
                })

                $('#menu').modal('show')
            })
        })

        document.querySelectorAll('.search').forEach(item => {
            item.addEventListener('click', e => {
                e.preventDefault()
                localStorage.setItem('target', e.target.dataset.id)
                location.href = "./sim.html"
            })
        })
    }
})


function subImg(id) {
    let str = ''

    shop[id].subImage.forEach(item => {
        str += `<img src="./resource/img/sub/${item}" alt="sub-img" title="sub-img">`
    })

    return str
}