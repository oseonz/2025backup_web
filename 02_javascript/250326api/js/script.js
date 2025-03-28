console.log("script")

function initMap() {
  // var container = document.querySelector("#map")
  var container = document.getElementById("map")
  var mapOption = {
    center: new kakao.maps.LatLng(37.56826, 126.977829), //지도의 중심
    level: 10, //확대 정도
  } //지도 만들기: 지도를 화면에 표시함

  var map = new kakao.maps.Map(container, mapOption)

  axios
    .get("city1.json")
    .then((res) => {
      console.log(res.data.city)
      const cityData = res.data.city

      //   cityData.forEach(function(item,index){})
      cityData.forEach((item, i) => {
        if (!item.title) {
          var markerPosition = new kakao.maps.LatLng(item.lat, item.lon)
          var marker = new kakao.maps.Marker({
            position: markerPosition,
          })
          marker.setMap(map)

          //   //이벤트
          //   var infowindow = new kakao.maps.InfoWindow({
          //     content: `<div class="mapinfo">${item.name}</div>`,
          //   })

          //   kakao.maps.event.addListener(marker, "mouseover", function () {
          //     infowindow.open(map, marker)
          //   })

          //   kakao.maps.event.addListener(marker, "mouseout", function () {
          //     infowindow.close()
          //   })

          getWeather(item.lat, item.lon).then((wData) => {
            console.log(wData)

            var infowindodw = new kakao.maps.infowindodw({
              content: `
                        <img src="http://openweathermap.org/img/wn/${wData.icon}@2x.png">
                        <div class="mapinfo">도시 : ${item.name}</div>
                        <div>온도 : ${wData.temp}</div>
                        <div>상태 : ${wData.desc}</div>
                        `,
            })

            kakao.maps.event.addListener(marker, "mouseover", function () {
              infowindodw.open(map, maker)
            })
          })
        }
      })
    })
    .catch((error) => {
      console.error("파일에러" + error)
    })
}

function getWeather(lat, lon) {
  console.log(lat, lon)
  const API_KEY = "1c13c57a25b2a3b4075bde3d4338f87e"
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=kr&appid=${API_KEY}`
  let wData = axios
    .get(url)
    .then((response) => {
      const data = response.data
      return {
        temp: data.main.temp,
        desc: data.weather[0].description,
        icon: data.weather[0].icon,
      }
    })
    .catch((err) => {
      console.error("에러" + err)
    })

  return wData
}

initMap()
