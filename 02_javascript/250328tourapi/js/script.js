let currentPage = 1
let totalPage = 1

const GO_KEY =
  "fvqYaGbexxakRPZj75oysm6y0Hos5Li3Vq47UgAYNvrYTeOzWmK9%2F5vzNC9OnAgbyG%2BtIWWqRIdTFKxa010hVA%3D%3D"

async function getTourData(page = 1) {
  const loading = document.querySelector(".loading")

  try {
    const tourRes = await axios.get(
      `http://apis.data.go.kr/B551011/KorService1/areaBasedList1?numOfRows=12&pageNo=${page}&MobileOS=ETC&MobileApp=AppTest&ServiceKey=${GO_KEY}&listYN=Y&arrange=A&contentTypeId=12&_type=json`
    )
    const tourDataList = tourRes.data.response.body.items.item
    const totalCount = tourRes.data.response.body.totalCount

    // console.log(tourDataList)
    renderTourList(tourDataList)
    totalEl.innerHTML = totalCount

    totalPage = Math.ceil(totalCount / 12)

    currentPage = page
    renerPagination() //페이지네이션 불러오기

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
      const imageUrl = item.firstimage || "image/no_image.jpg"
      return `
                <div class="col-6 col-md-3 mb-3">
                    <div class="card overflow-hidden">
                        <div class="imgView">
                        <img src="${
                          tourData.firstimage != "" ? tourData.firstimage : "images/no_image.jpg"
                        }" alt="" />
                        </div>
                        <div class="card-body">
                        <h5>${tourData.title}</h5>
                        <button class="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        data-title="${tourData.title}"
                        data-lat="${tourData.mapy}"
                        data-lng="${tourData.mapx}"
                        >상세보기</button>
                        </div>
                    </div>
                </div>
                `
    })
    .join("")
}

function pagenation() {
  const startPage = Math.max(currentPage - 1 / 10) * 10 + 1
  const endPage = Math.min(page + 9, totalPages)

  pageList.innerHTML = ""

  for (let i = startPage; i <= endPage; i++) {
    html += `<span><a href="#">${i}</a></span>`
  }
  console.log(html)
  document.querySelector(".pageNum").innerHTML = html
}

getTourData()

const exampleModal = document.getElementById("exampleModal")

exampleModal.addEventListener("shown.bs.modal", function (e) {
  const button = e.relatedTarget
  console.log(button)
  const title = button.getAttribute("data-title")
  const lat = parseFloat(button.getAttribute("data-lat"))
  const lng = parseFloat(button.getAttribute("data-lng"))

  const modalTitle = exampleModal.querySelector(".modal-title")
  // const modalLat = exampleModal.querySelector(".lat")
  // const modalLng = exampleModal.querySelector(".lng")

  modalTitle.innerHTML = title
  // modalLat.innerHTML = lat
  // modalLng.innerHTML = lng

  const container = document.getElementById("map")
  const mapOption = {
    center: new kakao.maps.LatLng(lat, lng),
    level: 3,
  }

  container.innerHTML = ""

  const map = new kakao.maps.Map(container, mapOption)

  const markerPosition = new kakao.maps.LatLng(lat, lng)
  const marker = new kakao.maps.Maker({
    position: markerPosition,
    map: map,
  })

  setTimeout(() => {
    kakao.maps.event.trigger(map, "resize")
    map.setCenter(markerPosition)
  }, 100)
})
