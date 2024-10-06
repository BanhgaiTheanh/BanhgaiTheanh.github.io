////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Making copyright year be up-to-date
const yearElement = document.getElementById('year');
const currentYear = new Date().getFullYear();
yearElement.textContent = currentYear.toString();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Making the mobile navigation work
const buttonMobileNavElement = document.querySelector('.btn-mobile-nav');
const headerElement = document.querySelector('.header');

buttonMobileNavElement.addEventListener('click', function (event) {
    headerElement.classList.toggle('nav-open');
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Making smooth scrolling
const allLinks = document.querySelectorAll('a:link');
allLinks.forEach((link) => {
    link.addEventListener('click', function (event) {
        event.preventDefault();
        const href = link.getAttribute('href');
        if (href === '#') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }

        if (href !== '#' && href.startsWith('#')) {
            const sectionElement = document.querySelector(href);
            sectionElement.scrollIntoView({behavior: 'smooth'});
        }

        if (link.classList.contains('main-nav-link')) {
            console.log(link);
            headerElement.classList.toggle('nav-open');
        }
    })
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Making sticky navbar

const sectionHeroElement = document.querySelector('.section-hero');
const observer = new IntersectionObserver(function (entries){
    const entry =  entries[0];
    if (!entry.isIntersecting) {
        document.body.classList.add('sticky');
    }

    if (entry.isIntersecting) {
        document.body.classList.remove('sticky');
    }
}, {
    root: null,
    threshold: 0,
    rootMargin: '-80px'
})
observer.observe(sectionHeroElement);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Fixing flexbox gap property missing in some Safari versions
function checkFlexGap() {
    var flex = document.createElement("div");
    flex.style.display = "flex";
    flex.style.flexDirection = "column";
    flex.style.rowGap = "1px";

    flex.appendChild(document.createElement("div"));
    flex.appendChild(document.createElement("div"));

    document.body.appendChild(flex);
    var isSupported = flex.scrollHeight === 1;
    flex.parentNode.removeChild(flex);
    console.log(isSupported);

    if (!isSupported) document.body.classList.add("no-flexbox-gap");
}

checkFlexGap();

// https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Set Viet Nam address
const host = "https://provinces.open-api.vn/api/";
var callAPI = (api) => {
    return axios.get(api)
        .then((response) => {
            renderData(response.data, "city");
        });
}
callAPI('https://provinces.open-api.vn/api/?depth=1');
var callApiDistrict = (api) => {
    return axios.get(api)
        .then((response) => {
            renderData(response.data.districts, "district");
        });
}
var callApiWard = (api) => {
    return axios.get(api)
        .then((response) => {
            renderData(response.data.wards, "ward");
        });
}

var renderData = (array, select) => {
    let row = ' <option disable value="">Chọn</option>';
    array.forEach(element => {
        row += `<option data-id="${element.code}" value="${element.name}">${element.name}</option>`
    });
    document.querySelector("#" + select).innerHTML = row
}

$("#city").change(() => {
    callApiDistrict(host + "p/" + $("#city").find(':selected').data('id') + "?depth=2");
});
$("#district").change(() => {
    callApiWard(host + "d/" + $("#district").find(':selected').data('id') + "?depth=2");
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Submit order form
const form = document.getElementById('order-form');
form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get the current date and time
    const currentDateTime = new Date();
    const orderDate = currentDateTime.toLocaleDateString();
    const orderTime = currentDateTime.toLocaleTimeString();

    const fullName = document.getElementById('full-name').value;
    const phone = document.getElementById('phone').value;
    const city = document.getElementById('city').value;
    const district = document.getElementById('district').value;
    const ward = document.getElementById('ward').value;
    const product = document.getElementById('product').value;
    const quantity = document.getElementById('quantity').value;

    const confirmOrder = confirm(
        `Xác nhận đặt hàng với thông tin sau:\n\n
        Họ và tên: ${fullName}\n
        Số điện thoại: ${phone}\n
        Thành phố: ${city}\n
        Quận/Huyện: ${district}\n
        Phường/Xã: ${ward}\n
        Loại bánh: ${product}\n
        Số lượng: ${quantity}\n
        Ngày đặt: ${orderDate}\n
        Thời gian đặt: ${orderTime}\n\n
        Bạn có chắc chắn muốn đặt hàng không?`);

    if (confirmOrder) {
        const formData = {
            orderDate: orderDate,
            orderTime: orderTime,
            fullName: fullName,
            phone: phone,
            city: city,
            district: district,
            ward: ward,
            product: product,
            quantity: quantity
        };

        fetch(WEB_APP_URL, {
            method: 'POST',
            body: JSON.stringify(formData)
        }).then(response => response.json())
            .then(data => {
                if (data.result === "success") {
                    alert("Đơn hàng đã được gửi thành công!");
                } else {
                    alert("Có lỗi xảy ra, vui lòng thử lại.");
                }
            }).catch(error => console.error('Error:', error));
    }
});