let currentPage = 1
let totalPage = 1

const API_KEY =
  "l0WtV%2F7q2V%2FEH86zOC4y54rjJIci1FU1Dx8yW149%2F2RoPbMkLFPBsMUxIr97MJRg%2FlxhrnVx9xKksuIihnSJsw%3D%3D"

const loading = document.querySelector(".loading")
const tourContainer = document.querySelector(".tourData")
const totalEl = document.querySelector(".total")
const pageList = document.querySelector(".pageNation .pageList")
const prevBtn = document.querySelector(".prev")
const nextBtn = document.querySelector(".next")
const fNextBtn = document.querySelector(".fNext")

async function getTourData(page = 1) {
  // const loading = document.querySelector(".loading")
  loading.style.display = "block"

  try {
    const { data } = await axios.get(
      `http://apis.data.go.kr/B551011/KorService1/areaBasedList1?numOfRows=12&pageNo=${page}&MobileOS=ETC&MobileApp=AppTest&ServiceKey=${API_KEY}&listYN=Y&arrange=A&contentTypeId=12&_type=json`
    )
    const tourList = data.response.body.items.item || []
    const totalCount = data.response.body.totalCount

    // console.log(tourDataList)
    renderTourList(tourList)
    totalEl.innerHTML = totalCount

    totalPage = Math.ceil(totalCount / 12)

    currentPage = page
    renderPagination() //페이지네이션 불러오기

    // let html = ""
    // for (const tourData of tourDataList) {
    //   html += `
    //             <div class="col-6 col-md-3 mb-3">
    //                 <div class="card overflow-hidden">
    //                     <div class="imgView">
    //                     <img src="${
    //                       tourData.firstimage != "" ? tourData.firstimage : "images/no_image.jpg"
    //                     }" alt="" />
    //                     </div>
    //                     <div class="card-body">
    //                     <h5>${tourData.title}</h5>
    //                     <button class="btn btn-primary"
    //                     data-bs-toggle="modal"
    //                     data-bs-target="#exampleModal"
    //                     data-title="${tourData.title}"
    //                     data-lat="${tourData.mapy}"
    //                     data-lng="${tourData.mapx}"
    //                     >상세보기</button>
    //                     </div>
    //                 </div>
    //             </div>
    //             `
    // }
    // document.querySelector(".tourData").innerHTML = html
    // document.querySelector(".total").innerHTML = totalCount
    // pagenation()
  } catch (error) {
    console.error("데이터를 불러올 수 없습니다.", error)
  } finally {
    loading.style.display = "none"
  }
}

function renderTourList(tourList) {
  tourContainer.innerHTML = tourList
    .map((item) => {
      const imageUrl = item.firstimage || "images/no_img.jpg"
      return `
        <div class="col-6 col-md-3 mb-3">
          <div class="card overflow-hidden">
            <div class="imgView">
              <img src="${imageUrl}" alt="${item.title}" />
            </div>
            <div class="card-body">
              <h5>${item.title}</h5>
              <div class="">
              <button class="btn btn-primary" 
                data-bs-toggle="modal" 
                data-bs-target="#exampleModal"
                data-title="${item.title}"
                data-lat="${item.mapy}"
                data-lng="${item.mapx}">
                상세보기
              </button>

              <button class="btn btn-info">추천</button>
              </div>
              
            </div>

          </div>
        </div>
      `
    })
    .join("")
}

function renderPagination() {
  const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1
  const endPage = Math.min(startPage + 9, totalPage)

  pageList.innerHTML = ""

  for (let i = startPage; i <= endPage; i++) {
    const activeClass = currentPage === i ? "active" : ""
    const span = document.createElement("span")
    span.className = `pageNum ${activeClass}`
    span.innerHTML = `<a href="javascript:void(0)" class="nav-link" onclick="getTourData(${i})">${i}</a>`
    pageList.appendChild(span)
  }

  prevBtn.style.display = currentPage === 1 ? "none" : "block" //현재 페이지가 첫번째 페이지면 이전 버튼 안 보이게
  nextBtn.style.dispaly = currentPage === totalPage ? "none" : "block" //마지막 페이지면 다음 버튼 안 보이게
}

function setupPageinationEvents() {
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) getTourData(currentPage - 1)
  }) //현재 페이지가 1보다 클 때, 현재 페이지에 1을 뺀 이전 페이지 데이터 가져옴

  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPage) getTourData(currentPage + 1)
  }) //현재 페이지가 마지막 페이지보다 작을 때, 현재 페이지에서 1을 더한 다음 페이지 데이터 가져옴

  fNextBtn.addEventListener("click", () => getTourData(totalPage))
}

function setupModalEvent() {
  const exampleModal = document.getElementById("exampleModal")

  exampleModal.addEventListener("shown.bs.modal", function (e) {
    const button = e.relatedTarget
    const title = button.getAttribute("data-title")
    const lat = parseFloat(button.getAttribute("data-lat"))
    const lng = parseFloat(button.getAttribute("data-lng"))
    exampleModal.querySelector(".modal-title").innerHTML = title

    const container = document.getElementById("map")
    container.innerHTML = ""

    const mapOption = {
      center: new kakao.maps.LatLng(lat, lng),
      level: 3,
    }

    const map = new kakao.maps.Map(container, mapOption)

    const marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(lat, lng),
      map: map,
    })

    setTimeout(() => {
      kakao.maps.event.trigger(map, "resize")
      map.setCenter(marker.getPosition())
    }, 100)
  })
}

getTourData()
setupPageinationEvents()
setupModalEvent()
