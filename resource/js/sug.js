let area = []
let shop = []


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
    console.log('asd')

    $.ajax({
        url:`/resource/api/recommend.php`,
        method:'get',
        data : {
            type:'bakeries',
            area
        },
        dataType:'json',
        success: res => {
            console.log(res)
        },
        error: er => {
            console.log(er)
        }
    })
})