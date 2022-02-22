let word = []
let shop = []
let oshop = []
let menu = []
let scList = []

let target
let targetMenu

fetch('/resource/json/word.json')
.then(res => res.json())
.then(data => {
    word = data

    $.ajax({
        url:`/resource/api/bakeries.php`,
        method: 'get',
        data : {
            type: 'menuList'
        },
        success: res => {
            menu = res.sort((a, b) => a.idx - b.idx)
            console.log(menu)
    
            targetMenu = menu.filter(x => x.bakerIdx == localStorage.getItem('target'))
            targetMenu.forEach((x, idx) => {
                targetMenu[idx] = x.name
            })
        }
    })

    $.ajax({
        url:`/resource/api/bakeries.php`,
        method: 'get',
        data: {
            type: 'bakeries'
        },
        success: res => {
            shop = res.sort((a, b) => a.idx - b.idx)
            oshop = [...shop]
    
            target = shop[Number(localStorage.getItem('target')) - 1]
            shop.splice(Number(localStorage.getItem('target')) - 1, 1)

            $('.sim-store-list__target').html(`<div class="sim-store-list__left col-4">
                                                    <img src="./resource/img/shop/${target.mainImage}" alt="target-shop" title="target-shop">
                                                </div>
                                                <div class="sim-store-list__right col-8">
                                                    <h4 class="title"><span class="line"></span> ${target.name}</h4>
                                                    <hr>

                                                    <p><i class="fas fa-clock"></i> ${target.openTime} ~ ${target.endTime}</p>
                                                    <p><i class="fas fa-map"></i>${target.location}</p>
                                                    
                                                    <p>${target.intro}</p>
                                                </div>`)
            
            word.forEach((item, idx) => {
                let cnt = 0
                let reg = new RegExp(`${item}`)
                
                target.review.forEach(item1 => {
                    let res = item1.match(reg)
                    
                    if(res) cnt += res.length
                })
                
                word[idx] = {
                    word : item,
                    cnt
                }
            })
            
            word.sort((a, b) => b.cnt - a.cnt).splice(20)
            console.log(word)
            
            shop.forEach((item) => {
                let sc = score(item)
                if (sc > 99) {
                    item.score = sc
    
                    scList.push(item)
                }
            })

            console.log(scList)
    
            scList.sort((a, b) => b.score - a.score)
            let rank = 1

            scList.slice(0, 3).forEach(item => {
                let box = `<div class="card shop__item" style="width: 18rem;">
                                <img src="./resource/img/shop/${item.mainImage}" class="card-img-top" alt="shop-img" title="shop-img">
                                <div class="card-body">
                                    <h5 class="card-title">${rank}. ${item.name}</h5>
                                    <p class="card-text">${item.openTime} ~ ${item.endTime}</p>
                                    <p class="card-text">${item.intro}</p>
                                    <button data-id="${item.idx}" class="btn more btn-primary">상세보기</button>
                                    <button data-id="${item.idx}" class="btn menu btn-primary">메뉴보기</button>
                                    <a href="#" data-id="${item.idx}" class="btn search btn-primary mt-2">유사한 빵집 찾아보기</a>
                                </div>
                            </div>`
                $('.sim-store-list__rank').append(box)
                rank += 1
            })

            scList.slice(3).forEach(item => {
                let box = `<div class="card shop__item" style="width: 18rem;">
                                <img src="./resource/img/shop/${item.mainImage}" class="card-img-top" alt="shop-img" title="shop-img">
                                <div class="card-body">
                                    <h5 class="card-title">${rank}. ${item.name}</h5>
                                    <p class="card-text">${item.openTime} ~ ${item.endTime}</p>
                                    <p class="card-text">${item.intro}</p>
                                    <button data-id="${item.idx}" class="btn more btn-primary">상세보기</button>
                                    <button data-id="${item.idx}" class="btn menu btn-primary">메뉴보기</button>
                                    <a href="#" data-id="${item.idx}" class="btn search btn-primary mt-2">유사한 빵집 찾아보기</a>
                                </div>
                            </div>`
                $('.sim-store-list__box').append(box)
                rank += 1
            })

            document.querySelectorAll('.more').forEach(item => {
                item.addEventListener('click', e => {
                    let id = e.target.dataset.id - 1
    
                    $('#more .modal-body').html(`<div class="left">
                                                    <img src="./resource/img/shop/${oshop[id].mainImage}" alt="main-image" title="main-image">
                                                    ${subImg(id)}
                                                </div>
                                                <div class="right">
                                                    <h3 class="title"><span class="line"></span> ${oshop[id].name}</h3>
                                                    <hr>
    
                                                    <p><i class="fas fa-clock"></i> ${oshop[id].openTime} ~ ${oshop[id].endTime}</p>
                                                    <p><i class="fas fa-map"></i> ${oshop[id].location}</p>
                                                    <p>${oshop[id].intro}</p>
    
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
})

function score(item) {
    let a = new Set(target.hashTag)
    let b = new Set(item.hashTag)
    let re = new Set([...a].filter(x => b.has(x)))

    let sc = re.size * 1.5

    let cnt = 0

    word.forEach(i => {
        let reg = new RegExp(`${i.word}`)

        item.review.forEach(it => {
            let res = it.match(reg)
            if(res) cnt += res.length
        })
    })

    sc += cnt * 0.4

    cnt = 0

    menu.filter(x => x.bakerIdx == item.idx).forEach(i => {
        if(-1 != targetMenu.indexOf(i.name)) {
            cnt += 1
        }
    })

    sc += cnt * 3
    return sc
}

function subImg(id) {
    let str = ''

    shop[id].subImage.forEach(item => {
        str += `<img src="./resource/img/sub/${item}" alt="sub-img" title="sub-img">`
    })

    return str
}