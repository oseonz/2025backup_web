let listData = [] //리스트 배열

const inp = document.querySelector(".inp")
const btn = document.querySelector(".btn")
const dBtn = document.querySelector(".dBtn")
const listView = document.querySelector(".listView")

function loadData() {
  const storageData = localStorage.getItem("listData")
  console.log(storageData)
  listData = storageData ? JSON.parse(storageData) : []
  //스토리지 데이터가 잇으면 넣고 없으면 대괄호 안을 넣음
  //parse는 괄호 안의 것을 JSON으로 번역해주는 것
}

function saveData() {
  localStorage.setItem("listData", JSON.stringify(listData))
}

function viewData() {
  console.log("view" + listData)
  let viewList = ""
  listData.forEach(function (item, index) {
    viewList += `<li>
                    <div class="pb-2">
                    <input type="checkbox" ${item.completed ? "checked" : ""}  
                    onclick="toggleCompleted(${index})" />
                        <span class="${item.completed ? "view" : ""}">${item.text}</span>
                    </div> 
                    <div onclick="del(${index})" class="myDel"><i class="fa-solid fa-trash"></i></div>
                </li>`
  })

  console.log(viewList)
  listView.innerHTML = viewList
}

btn.addEventListener("click", function () {
  let value = inp.value
  if (value) {
    listData.push({ text: value, completed: false })
    saveData()
    inp.value = ""
    viewData()
  } else {
    alert("오늘의 할 일을 입력해 주세요.")
  }
})

dBtn.addEventListener("click", function () {
  listData = []
  saveData()
  viewData() //함수 호출
})

function del(index) {
  //   alert(index)
  listData.splice(index, 1)
  saveData()
  viewData()
}

function toggleCompleted(index) {
  listData[index].completed = !listData[index].completed
  saveData()
  viewData()
}

loadData()
viewData()
