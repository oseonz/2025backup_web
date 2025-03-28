const Url = "https://dapi.kakao.com/v2/search/web"
const API_KEY = "a5465491af98e1157d847f38bb48bee9"
let query = ""
let currentPage = 1 //현재의 페이지
let totalPage = 1

const inpElm = document.querySelector("#query")

// document.querySelector("#query")
document.querySelector("#searchBtn").addEventListener("click", function () {
  //   alert("test")
  query = inpElm.value.trim()
  search()
})

async function search() {
  // if(query == ""){
  if (!query) {
    alert("검색어를 입력하세요")
    inpElm.focus()
    return
  }

  const apiUrl = Url + "?query=" + query + "&page=" + page
  // const apiUrl = `${Url}?query=${query}&sort=accruracy&page=${page}`
  try {
    const response = await axios.get(apiUrl, {
      headers: { Authorization: `KakaoAK ${API_KEY}` },
    })

    const data = response.data
    console.log(data.documents)

    let kakaoData = ""
    data.documents.forEach(function (item, index) {
      kakaoData += `<div>
                        <a href="${item.url}" class="nav-link" target="_blank"><h4>${item.title}</h4></>
                        <p class="bg-info rounded p-3">${item.contents}</p>
                    </div>`
    })

    document.querySelector(".results").innerHTML = kakaoData
    total = Math.min(50, Math.ceil(data.meta.pageable_))
    currentPage = page
    pagination()
  } catch (error) {
    console.error("에러남" + error)
  }
}

function pagination() {
  const pn = document.querySelector("pagination")
  pn.innerHTML = ""

  const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1
  const endPage = Math.min(startPage + 9, totalPage)

  console.log("page : " + startPage, endPage)

  const prevLi = document.createElement("li")
  prevLi.className = "page-item"
  prevLi.innerHTML = `<a class="page-link prevPage">Previous</a>`
  pn.appendChild(prevLi)

  if (currentPage == 1) {
    prevLi.classList.add("disabled")
  }

  for (let i = startPage; i <= endPage; i++) {
    const liElem = document.createElement("li")
    liElem.className = `page-item ${i == currentPage ? "active" : ""}`
    liElem.innerHTML = `<div class="page-link" onclick="search(${i})">${i}</div>`
    pn.appendChild(liElem)
  }

  const nextLi = document.createElement("li")
  nextLi.className = "page-item"
  nextLi.innerHTML = `<a class="page-link nextPage">Next</a>`
  pn.appendChild(nextLi)

  if (currentPage == totalPage) {
    nextLi.classList.add("disabled")
  }

  document.querySelector(".prevPage").addEventListener("click", function () {
    if (currentPage == totalPage) {
      nextLi.classList.add("disabled")
    }

    document.querySelector(".prevPage").addEventListener("click", function () {
      if (currentPage > 1) {
        searchView(currentPage - 1)
      }
    })

    document.querySelector(".nextPage").addEventListener("click", function () {
      if (currentPage < totalPage) {
        searchView(currentPage + 1)
      }
    })
  })
}
