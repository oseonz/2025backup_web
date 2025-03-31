let page = 1
let totalCount = 0
const numOfRows = 12

async function getTourData() {
  const loading = document.querySelector(".loading")

  const GO_KEY =
    "l0WtV%2F7q2V%2FEH86zOC4y54rjJIci1FU1Dx8yW149%2F2RoPbMkLFPBsMUxIr97MJRg%2FlxhrnVx9xKksuIihnSJsw%3D%3D"

  try {
    const tourRes = await axios.get(
      `http://apis.data.go.kr/B551011/KorService1/areaBasedList1?numOfRows=${numOfRows}&pageNo=${page}&MobileOS=ETC&MobileApp=AppTest&ServiceKey=${GO_KEY}&listYN=Y&arrange=A&contentTypeId=12&_type=json`
    )
    console.log(tourRes)
    const tourDataList = tourRes.data.response.body.items.item
    totalCount = tourRes.data.response.body.totalCount

    console.log(tourDataList)

    let html = ""
    for (const tourData of tourDataList) {
      html += `
        <div class="col-6 col-md-3 mb-3">
          <div class="card overflow-hidden">
            <div class="imgView">
              <img src="${
                tourData.firstimage !== "" ? tourData.firstimage : "images/no_img.jpg"
              }" alt="" />
            </div>
            <div class="card-body">
              <h4>${tourData.title}</h4>
              <div class="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                data-title="${tourData.title}"
                data-lat="${tourData.mapy}"
                data-lng="${tourData.mapx}"
              >상세보기</div>
            </div>
          </div>
        </div>
      `
    }

    document.querySelector(".tourData").innerHTML = html
    document.querySelector(".total").innerHTML = totalCount

    generatePagination()
  } catch (error) {
    console.error("정보x" + error)
  } finally {
    loading.style.display = "none"
  }
}

function generatePagination() {
  const paginationContainer = document.querySelector(".pagination")
  paginationContainer.innerHTML = ""

  const totalPages = Math.ceil(totalCount / numOfRows)

  const prevButton = document.createElement("button")
  prevButton.classList.add("page-link")
  prevButton.textContent = "<"
  prevButton.disabled = page === 1
  prevButton.addEventListener("click", () => {
    if (page > 1) {
      page--
      getTourData()
    }
  })

  const prevItem = document.createElement("li")
  prevItem.classList.add("page-item")
  prevItem.appendChild(prevButton)
  paginationContainer.appendChild(prevItem)

  const startPage = Math.max(page - 2, 1)
  const endPage = Math.min(page + 2, totalPages)

  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement("button")
    pageButton.classList.add("page-link")
    pageButton.textContent = i

    if (i === page) {
      pageButton.classList.add("active")
    }

    pageButton.addEventListener("click", () => {
      page = i
      getTourData()
    })

    const pageItem = document.createElement("li")
    pageItem.classList.add("page-item")
    pageItem.appendChild(pageButton)

    paginationContainer.appendChild(pageItem)
  }

  const nextButton = document.createElement("button")
  nextButton.classList.add("page-link")
  nextButton.textContent = ">"
  nextButton.disabled = page === totalPages
  nextButton.addEventListener("click", () => {
    if (page < totalPages) {
      page++
      getTourData()
    }
  })

  const nextItem = document.createElement("li")
  nextItem.classList.add("page-item")
  nextItem.appendChild(nextButton)
  paginationContainer.appendChild(nextItem)
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
  modalTitle.innerHTML = title

  const container = document.getElementById("map")
  const mapOption = {
    center: new kakao.maps.LatLng(lat, lng),
    level: 3,
  }

  container.innerHTML = ""

  const map = new kakao.maps.Map(container, mapOption)

  const markerPosition = new kakao.maps.LatLng(lat, lng)
  const marker = new kakao.maps.Marker({
    position: markerPosition,
    map: map,
  })
})
