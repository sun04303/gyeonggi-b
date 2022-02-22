let shop = []
let hashTag = []
let target = []

let targetName = ''
let targetTime = ''
let targetHash = []

$.ajax({
    url:'/resource/api/bakeries.php',
    method: 'get',
    data: {
        type: 'bakeries'
    },
    success: res => {
        shop = res.sort((a, b) => a.idx - b.idx)

        shop.forEach(item => {
            item.hashTag.forEach(x => {
                if(hashTag.indexOf(x) == -1) {
                    hashTag.push(x)
                }
            })
        })

        hashTag.forEach(item => {
            let hash = `<span class="hash-tag-item">#${item}</span>`
            $('.hash-tag-box').append(hash)
        })

        document.querySelectorAll('.hash-tag-item').forEach(item => {
            item.addEventListener('click', e => {
                e.target.classList.toggle('hash-active')

                if(targetHash.indexOf(e.target.innerHTML.split('#')[1]) != -1) {
                    targetHash.splice(targetHash.indexOf(e.target.innerHTML.split('#')[1]), 1)
                } else {
                    if(targetHash.length < 10) {
                        targetHash.push(e.target.innerHTML.split('#')[1])
                    } else {
                        e.target.classList.remove('hash-active')
                    }
                }

                search()
                console.log(targetHash)
            })
        })
    }
})

$('#search-name').on('keyup', e => {
    targetName = e.target.value
    search()
})

$('#search-time').on('keyup', e => {
    targetTime = e.target.value
    search()
})

function search() {
    target = []

    if(targetName) {
        shop.forEach(item => {
            if(item.name.includes(targetName)) {
                item.activeName = true
                target.push(item)
            }
        })
    }

    if(targetName && targetTime) {
        let cShop = [...target]
        target = []

        cShop.forEach(item => {
            if(item.openTime.split(':')[0] < targetTime.split(':')[0] || item.openTime.split(':')[0] == targetTime.split(':')[0] && item.openTime.split(':')[1] < targetTime.split(':')[1]) {
                if(item.endTime.split(':')[0] > targetTime.split(':')[0] || item.endTime.split(':')[0] == targetTime.split(':')[0] && item.endTime.split(':')[1] > targetTime.split(':')[1]) {
                    item.activeTime = true
                    item.activeName = true
                    target.push(item)
                }
            }
        })
    } else if(targetTime) {
        shop.forEach(item => {
            if(item.openTime.split(':')[0] < targetTime.split(':')[0] || item.openTime.split(':')[0] == targetTime.split(':')[0] && item.openTime.split(':')[1] <= targetTime.split(':')[1]) {
                if(item.endTime.split(':')[0] > targetTime.split(':')[0] || item.endTime.split(':')[0] == targetTime.split(':')[0] && item.endTime.split(':')[1] >= targetTime.split(':')[1]) {
                    item.activeTime = true
                    target.push(item)
                }
            }
        })
    } 

    let a = new Set(targetHash)

    if(targetHash.length && targetName && targetTime) {
        let cShop = [...target]
        target = []

        cShop.forEach(item => {
            let b = new Set(item.hashTag)
            let re = new Set([...a].filter(x => b.has(x)))

            if(re.size == targetHash.length) {
                item.activeName = true
                item.activeTime = true
                target.push(item1)
            }
        })
    }  else if(targetHash.length && targetName) {
        let cShop = [...target]
        target = []

        cShop.forEach(item => {
            let b = new Set(item.hashTag)
            let re = new Set([...a].filter(x => b.has(x)))

            if(re.size == targetHash.length) {
                item.activeName = true
                target.push(item)
            }
        })

    } else if(targetHash.length) {

        shop.forEach(item => {
            let b = new Set(item.hashTag)
            let re = new Set([...a].filter(x => b.has(x)))

            if(re.size == targetHash.length) {
                target.push(item)
            }
        })
    }

    console.log(target)
    makeList()
}

function makeList() {
    $('.search__result').html('')
    $('.search__cnt').html(`검색 결과 ${target.length}건`)

    target.forEach(item => {
        let box = `<div class="card shop__item" style="width: 18rem;">
                        <img src="./resource/img/shop/${item.mainImage}" class="card-img-top" alt="shop-img" title="shop-img">
                        <div class="card-body">
                            <h5 class="card-title ${item.activeName ? 'active-back' : ''}">${item.name}</h5>
                            <p class="card-text ${item.activeTime ? 'active-back' : ''}">${item.openTime} ~ ${item.endTime}</p>
                            <p class="card-text">${item.intro}</p>
                            <button data-id="${item.idx}" class="btn more btn-primary">상세보기</button>
                            <button data-id="${item.idx}" class="btn menu btn-primary">메뉴보기</button>
                            <a href="#" data-id="${item.idx}" class="btn search btn-primary mt-2">유사한 빵집 찾아보기</a>
                        </div>
                    </div>`
        $('.search__result').append(box)
    })
}