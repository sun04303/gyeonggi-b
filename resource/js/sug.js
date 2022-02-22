let area = []
let shop = []
let state = false

fetch('./resource/json/area.json')
.then(res => res.json())
.then(data => {
    console.log(data)
    data.forEach(item => {
        let box = `<div class="area__item">
                        <img src="./resource/img/area/${item.image}" alt="area" title="area">
                        <button data-id="${item.name}" class="btn area-btn-add btn-primary">선택</button>
                        <button data-id="${item.name}" class="btn area-btn-del btn-danger">선택 취소</button>
                    </div>`
        $('.area__box').append(box)
    })

    document.querySelectorAll('.area-btn-add').forEach(item => {
        item.addEventListener('click', e => {
            e.target.style.display = 'none'
            e.target.nextSibling.nextSibling.style.display = 'inline-block'
    
            area.push(e.target.dataset.id)
    
            $('.next-page').removeAttr('disabled')
        })
    })
    
    document.querySelectorAll('.area-btn-del').forEach(item => {
        item.addEventListener('click', e => {
            e.target.style.display = 'none'
            e.target.previousSibling.previousSibling.style.display = 'inline-block'
    
            area.splice(area.indexOf(e.target.dataset.id), 1)
    
            if (!area.length) {
                $('.next-page').attr('disabled', true)
            }
        })
    })
})


$('.next-page').on('click', e => {
    timer()

    $('.shop__box').html(`  <div class="loadingg">
                                <div class="loading__item"></div>
                                <div class="loading__text">
                                    loading...
                                </div>
                            </div>`)
    $('.area').css('margin-left', '-1140px')

    $.ajax({
        url:`/resource/api/recommend.php`,
        method:'get',
        data : {
            type:'bakeries',
            area
        },
        dataType:'json',
        success: res => {
            state = true
            shop = res
            console.log(res)
            
            $('.shop__box').html('')
            res.forEach(item => {
                let box = `<div class="card shop__item" style="width: 18rem;">
                                <img src="./resource/img/shop/${item.mainImage}" class="card-img-top" alt="shop-img" title="shop-img">
                                <div class="card-body">
                                    <h5 class="card-title">${item.name}</h5>
                                    <p class="card-text">${item.openTime} ~ ${item.endTime}</p>
                                    <p class="card-text">${item.intro}</p>
                                    <a href="#" class="btn btn-primary">Go somewhere</a>
                                </div>
                            </div>`
                $('.shop__box').append(box)
            })

            $('.sort-type').html(`<button class="btn btn-primary review-sort">리뷰 순 추천</button>
                                  <button class="btn btn-primary grade-sort">평점 순 추천</button>
                                  <button class="btn btn-primary ai-sort">AI 추천</button>
                                `)
        }
    })
})


$('.review-sort').on('click', e => {
    let res = shop.sort((a, b) => b.reviewCnt - a.reviewCnt)
    
    $('.shop__box').html('')
    res.forEach(item => {
        let box = `<div class="card shop__item" style="width: 18rem;">
                        <img src="./resource/img/shop/${item.mainImage}" class="card-img-top" alt="shop-img" title="shop-img">
                        <div class="card-body">
                            <h5 class="card-title">${item.name}</h5>
                            <p class="card-text">${item.openTime} ~ ${item.endTime}</p>
                            <p class="card-text">${item.reviewCnt}건의 리뷰</p>
                            <p class="card-text">${item.intro}</p>
                            <a href="#" class="btn btn-primary">Go somewhere</a>
                        </div>
                    </div>`
        $('.shop__box').append(box)
    })
})

$('.grade-sort').on('click', e => {
    let res = shop.sort((a, b) => b.grade - a.grade)

    $('.shop__box').html('')
    res.forEach(item => {
        let box = `<div class="card shop__item" style="width: 18rem;">
                        <img src="./resource/img/shop/${item.mainImage}" class="card-img-top" alt="shop-img" title="shop-img">
                        <div class="card-body">
                            <h5 class="card-title">${item.name}</h5>
                            <p class="card-text">${item.openTime} ~ ${item.endTime}</p>
                            <p class="card-text">${makeStar(item.grade)}</p>
                            <p class="card-text">${item.intro}</p>
                            <a href="#" class="btn btn-primary">Go somewhere</a>
                        </div>
                    </div>`
        $('.shop__box').append(box)
    })
})

$('.ai-sort').on('click', e => {
    let res = shop.sort((a, b) => AIscore(b) - AIscore(a))

    $('.shop__box').html('')
    res.forEach(item => {
        let box = `<div class="card shop__item" style="width: 18rem;">
                        <img src="./resource/img/shop/${item.mainImage}" class="card-img-top" alt="shop-img" title="shop-img">
                        <div class="card-body">
                            <h5 class="card-title">${item.name}</h5>
                            <p class="card-text">${item.openTime} ~ ${item.endTime}</p>
                            <p class="card-text">${AIscore(item)}점</p>
                            <p class="card-text">${item.intro}</p>
                            <a href="#" class="btn btn-primary">Go somewhere</a>
                        </div>
                    </div>`
        $('.shop__box').append(box)
    })
})

function timer() {
    let t = 0

    let time = setInterval(() => {
        if(state) clearInterval(time)

        if(t > 29) {
            clearInterval(time)
            alert("API요청에 실패하였습니다.")
            $('.area').css('margin-left', '0')
        }
        t += 1

        console.log(t)
    }, 1000)
}

function makeStar(n) {
    let str = ''
    for(let i = 0; i < n; i++) str += '<i class="fas fa-star orange"></i>'
    for(let i = 0; i < 5 - n; i++) str += '<i class="fas fa-star"></i>'

    return str
}

function AIscore(item) {
    let score = item.grade

    let vi = item.visitant
    let re = item.reviewCnt
    let sa = item.sales

    if (vi > 0 && vi < 51) score += 1
    else if (vi > 50 && vi < 151) score += 2
    else if (vi > 150 && vi < 251) score += 3
    else if (vi > 250 && vi < 301) score += 4
    else if (vi > 300) score += 5

    if (re > 0 && re < 21) score += 1
    else if (re > 20 && re < 41) score += 2
    else if (re > 40 && re < 61) score += 3
    else if (re > 60 && re < 81) score += 4
    else if (re > 80) score += 5

    if (sa > 0 && sa < 1000001) score += 1
    else if (sa > 1000000 && sa < 1500001) score += 2
    else if (sa > 1500000 && sa < 2000001) score += 3
    else if (sa > 2000000 && sa < 2500001) score += 4
    else if (sa > 2500000) score += 5

    return score
}