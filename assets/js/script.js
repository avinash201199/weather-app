import Capitals from "./Capitals.js";
import languages from "../../lang/translation.js";
var userLang;
Object.keys(languages).includes(navigator.language) === true ? userLang = navigator.language : userLang = "en-US";
const AIR_KEY = "427f7ef80457a39a26407e17ef0d604339190901";

const place = document.querySelector("#place");
var CITY = ['Adilabad', 'Agra', 'Ahmedabad', 'Ahmednagar', 'Aizawl', 'Ajitgarh (Mohali)', 'Ajmer', 'Akola', 'Alappuzha', 'Aligarh', 'Alirajpur', 'Allahabad', 'Almora', 'Alwar', 'Ambala', 'Ambedkar Nagar', 'Amravati', 'Amreli district', 'Amritsar', 'Anand', 'Anantapur', 'Anantnag', 'Angul', 'Anjaw', 'Anuppur', 'Araria', 'Ariyalur', 'Arwal', 'Ashok Nagar', 'Auraiya', 'Aurangabad', 'Aurangabad', 'Azamgarh', 'Badgam', 'Bagalkot', 'Bageshwar', 'Bagpat', 'Bahraich', 'Baksa', 'Balaghat', 'Balangir', 'Balasore', 'Ballia', 'Balrampur', 'Banaskantha', 'Banda', 'Bandipora', 'Bangalore Rural', 'Bangalore Urban', 'Banka', 'Bankura', 'Banswara', 'Barabanki', 'Baramulla', 'Baran', 'Bardhaman', 'Bareilly', 'Bargarh (Baragarh)', 'Barmer', 'Barnala', 'Barpeta', 'Barwani', 'Bastar', 'Basti', 'Bathinda', 'Beed', 'Begusarai', 'Belgaum', 'Bellary', 'Betul', 'Bhadrak', 'Bhagalpur', 'Bhandara', 'Bharatpur', 'Bharuch', 'Bhavnagar', 'Bhilwara', 'Bhind', 'Bhiwani', 'Bhojpur', 'Bhopal', 'Bidar', 'Bijapur', 'Bijapur', 'Bijnor', 'Bikaner', 'Bilaspur', 'Bilaspur', 'Birbhum', 'Bishnupur', 'Bokaro', 'Bongaigaon', 'Boudh (Bauda)', 'Budaun', 'Bulandshahr', 'Buldhana', 'Bundi', 'Burhanpur', 'Buxar', 'Cachar', 'Central Delhi', 'Chamarajnagar', 'Chamba', 'Chamoli', 'Champawat', 'Champhai', 'Chandauli', 'Chandel', 'Chandigarh', 'Chandrapur', 'Changlang', 'Chatra', 'Chennai', 'Chhatarpur', 'Chhatrapati Shahuji Maharaj Nagar', 'Chhindwara', 'Chikkaballapur', 'Chikkamagaluru', 'Chirang', 'Chitradurga', 'Chitrakoot', 'Chittoor', 'Chittorgarh', 'Churachandpur', 'Churu', 'Coimbatore', 'Cooch Behar', 'Cuddalore', 'Cuttack', 'Dadra and Nagar Haveli', 'Dahod', 'Dakshin Dinajpur', 'Dakshina Kannada', 'Daman', 'Damoh', 'Dantewada', 'Darbhanga', 'Darjeeling', 'Darrang', 'Datia', 'Dausa', 'Davanagere', 'Debagarh (Deogarh)', 'Dehradun', 'Deoghar', 'Deoria', 'Dewas', 'Dhalai', 'Dhamtari', 'Dhanbad', 'Dhar', 'Dharmapuri', 'Dharwad', 'Dhemaji', 'Dhenkanal', 'Dholpur', 'Dhubri', 'Dhule', 'Dibang Valley', 'Dibrugarh', 'Dima Hasao', 'Dimapur', 'Dindigul', 'Dindori', 'Diu', 'Doda', 'Dumka', 'Dungapur', 'Durg', 'East Champaran', 'East Delhi', 'East Garo Hills', 'East Khasi Hills', 'East Siang', 'East Sikkim', 'East Singhbhum', 'Eluru', 'Ernakulam', 'Erode', 'Etah', 'Etawah', 'Faizabad', 'Faridabad', 'Faridkot', 'Farrukhabad', 'Fatehabad', 'Fatehgarh Sahib', 'Fatehpur', 'Fazilka', 'Firozabad', 'Firozpur', 'Gadag', 'Gadchiroli', 'Gajapati', 'Ganderbal', 'Gandhinagar', 'Ganganagar', 'Ganjam', 'Garhwa', 'Gautam Buddh Nagar', 'Gaya', 'Ghaziabad', 'Ghazipur', 'Giridih', 'Goalpara', 'Godda', 'Golaghat', 'Gonda', 'Gondia', 'Gopalganj', 'Gorakhpur', 'Gulbarga', 'Gumla', 'Guna', 'Guntur', 'Gurdaspur', 'Gurgaon', 'Gwalior', 'Hailakandi', 'Hamirpur', 'Hamirpur', 'Hanumangarh', 'Harda', 'Hardoi', 'Haridwar', 'Hassan', 'Haveri district', 'Hazaribag', 'Hingoli', 'Hissar', 'Hooghly', 'Hoshangabad', 'Hoshiarpur', 'Howrah', 'Hyderabad', 'Hyderabad', 'Idukki', 'Imphal East', 'Imphal West', 'Indore', 'Jabalpur', 'Jagatsinghpur', 'Jaintia Hills', 'Jaipur', 'Jaisalmer', 'Jajpur', 'Jalandhar', 'Jalaun', 'Jalgaon', 'Jalna', 'Jalore', 'Jalpaiguri', 'Jammu', 'Jamnagar', 'Jamtara', 'Jamui', 'Janjgir-Champa', 'Jashpur', 'Jaunpur district', 'Jehanabad', 'Jhabua', 'Jhajjar', 'Jhalawar', 'Jhansi', 'Jharsuguda', 'Jhunjhunu', 'Jind', 'Jodhpur', 'Jorhat', 'Junagadh', 'Jyotiba Phule Nagar', 'Kabirdham (formerly Kawardha)', 'Kadapa', 'Kaimur', 'Kaithal', 'Kakinada', 'Kalahandi', 'Kamrup', 'Kamrup Metropolitan', 'Kanchipuram', 'Kandhamal', 'Kangra', 'Kanker', 'Kannauj', 'Kannur', 'Kanpur', 'Kanshi Ram Nagar', 'Kanyakumari', 'Kapurthala', 'Karaikal', 'Karauli', 'Karbi Anglong', 'Kargil', 'Karimganj', 'Karimnagar', 'Karnal', 'Karur', 'Kasaragod', 'Kathua', 'Katihar', 'Katni', 'Kaushambi', 'Kendrapara', 'Kendujhar (Keonjhar)', 'Khagaria', 'Khammam', 'Khandwa (East Nimar)', 'Khargone (West Nimar)', 'Kheda', 'Khordha', 'Khowai', 'Khunti', 'Kinnaur', 'Kishanganj', 'Kishtwar', 'Kodagu', 'Koderma', 'Kohima', 'Kokrajhar', 'Kolar', 'Kolasib', 'Kolhapur', 'Kolkata', 'Kollam', 'Koppal', 'Koraput', 'Korba', 'Koriya', 'Kota', 'Kottayam', 'Kozhikode', 'Krishna', 'Kulgam', 'Kullu', 'Kupwara', 'Kurnool', 'Kurukshetra', 'Kurung Kumey', 'Kushinagar', 'Kutch', 'Lahaul and Spiti', 'Lakhimpur', 'Lakhimpur Kheri', 'Lakhisarai', 'Lalitpur', 'Latehar', 'Latur', 'Lawngtlai', 'Leh', 'Lohardaga', 'Lohit', 'Lower Dibang Valley', 'Lower Subansiri', 'Lucknow', 'Ludhiana', 'Lunglei', 'Madhepura', 'Madhubani', 'Madurai', 'Mahamaya Nagar', 'Maharajganj', 'Mahasamund', 'Mahbubnagar', 'Mahe', 'Mahendragarh', 'Mahoba', 'Mainpuri', 'Malappuram', 'Maldah', 'Malkangiri', 'Mamit', 'Mandi', 'Mandla', 'Mandsaur', 'Mandya', 'Mansa', 'Marigaon', 'Mathura', 'Mau', 'Mayurbhanj', 'Medak', 'Meerut', 'Mehsana', 'Mewat', 'Mirzapur', 'Moga', 'Mokokchung', 'Mon', 'Moradabad', 'Morena', 'Mumbai City', 'Mumbai suburban', 'Munger', 'Murshidabad', 'Muzaffarnagar', 'Muzaffarpur', 'Mysore', 'Nabarangpur', 'Nadia', 'Nagaon', 'Nagapattinam', 'Nagaur', 'Nagpur', 'Nainital', 'Nalanda', 'Nalbari', 'Nalgonda', 'Namakkal', 'Nanded', 'Nandurbar', 'Narayanpur', 'Narmada', 'Narsinghpur', 'Nashik', 'Navsari', 'Nawada', 'Nawanshahr', 'Nayagarh', 'Neemuch', 'Nellore', 'New Delhi', 'Nilgiris', 'Nizamabad', 'North 24 Parganas', 'North Delhi', 'North East Delhi', 'North Goa', 'North Sikkim', 'North Tripura', 'North West Delhi', 'Nuapada', 'Ongole', 'Osmanabad', 'Pakur', 'Palakkad', 'Palamu', 'Pali', 'Palwal', 'Panchkula', 'Panchmahal', 'Panchsheel Nagar district (Hapur)', 'Panipat', 'Panna', 'Papum Pare', 'Parbhani', 'Paschim Medinipur', 'Patan', 'Pathanamthitta', 'Pathankot', 'Patiala', 'Patna', 'Pauri Garhwal', 'Perambalur', 'Phek', 'Pilibhit', 'Pithoragarh', 'Pondicherry', 'Poonch', 'Porbandar', 'Pratapgarh', 'Pratapgarh', 'Pudukkottai', 'Pulwama', 'Pune', 'Purba Medinipur', 'Puri', 'Purnia', 'Purulia', 'Raebareli', 'Raichur', 'Raigad', 'Raigarh', 'Raipur', 'Raisen', 'Rajauri', 'Rajahmundry', 'Rajgarh', 'Rajkot', 'Rajnandgaon', 'Rajsamand', 'Ramabai Nagar (Kanpur Dehat)', 'Ramanagara', 'Ramanathapuram', 'Ramban', 'Ramgarh', 'Rampur', 'Ranchi', 'Ratlam', 'Ratnagiri', 'Rayagada', 'Reasi', 'Rewa', 'Rewari', 'Ri Bhoi', 'Rohtak', 'Rohtas', 'Rudraprayag', 'Rupnagar', 'Sabarkantha', 'Sagar', 'Saharanpur', 'Saharsa', 'Sahibganj', 'Saiha', 'Salem', 'Samastipur', 'Samba', 'Sambalpur', 'Sangli', 'Sangrur', 'Sant Kabir Nagar', 'Sant Ravidas Nagar', 'Saran', 'Satara', 'Satna', 'Sawai Madhopur', 'Sehore', 'Senapati', 'Seoni', 'Seraikela Kharsawan', 'Serchhip', 'Shahdol', 'Shahjahanpur', 'Shajapur', 'Shamli', 'Sheikhpura', 'Sheohar', 'Sheopur', 'Shimla', 'Shimoga', 'Shivpuri', 'Shopian', 'Shravasti', 'Sibsagar', 'Siddharthnagar', 'Sidhi', 'Sikar', 'Simdega', 'Sindhudurg', 'Singrauli', 'Sirmaur', 'Sirohi', 'Sirsa', 'Sitamarhi', 'Sitapur', 'Sivaganga', 'Siwan', 'Solan', 'Solapur', 'Sonbhadra', 'Sonipat', 'Sonitpur', 'South 24 Parganas', 'South Delhi', 'South Garo Hills', 'South Goa', 'South Sikkim', 'South Tripura', 'South West Delhi', 'Sri Muktsar Sahib', 'Srikakulam', 'Srinagar', 'Subarnapur (Sonepur)', 'Sultanpur', 'Sundergarh', 'Supaul', 'Surat', 'Surendranagar', 'Surguja', 'Tamenglong', 'Tarn Taran', 'Tawang', 'Tehri Garhwal', 'Thane', 'Thanjavur', 'The Dangs', 'Theni', 'Thiruvananthapuram', 'Thoothukudi', 'Thoubal', 'Thrissur', 'Tikamgarh', 'Tinsukia', 'Tirap', 'Tiruchirappalli', 'Tirunelveli', 'Tirupur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Tonk', 'Tuensang', 'Tumkur', 'Udaipur', 'Udalguri', 'Udham Singh Nagar', 'Udhampur', 'Udupi', 'Ujjain', 'Ukhrul', 'Umaria', 'Una', 'Unnao', 'Upper Siang', 'Upper Subansiri', 'Uttar Dinajpur', 'Uttara Kannada', 'Uttarkashi', 'Vadodara', 'Vaishali', 'Valsad', 'Varanasi', 'Vellore', 'Vidisha', 'Viluppuram', 'Virudhunagar', 'Visakhapatnam', 'Vizianagaram', 'Vyara', 'Warangal', 'Wardha', 'Washim', 'Wayanad', 'West Champaran', 'West Delhi', 'West Garo Hills', 'West Kameng', 'West Khasi Hills', 'West Siang', 'West Sikkim', 'West Singhbhum', 'West Tripura', 'Wokha', 'Yadgir', 'Yamuna Nagar', 'Yanam', 'Yavatmal', 'Zunheboto']
for(var i in CITY){
  var option = document.createElement("option");
  option.value = CITY[i];
  option.text = CITY[i];
  place.appendChild(option);
}
function formatAMPM(date) {
  let strTime = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return strTime;
}

const AirQuality = (log, lat) => {
  fetch(`https://api.waqi.info/feed/geo:${lat};${log}/?token=${AIR_KEY}`)
    .then((res) => res.json())
    .then((res) => {
      let aqi = res.data.aqi;
      document.querySelector("#AirQuality").innerText = `${languages[userLang].airQuality}:${aqi}`;
      if (aqi >= 0 && aqi <= 50) {
        document.querySelector(".ml-0").innerText = `(${languages[userLang].good})`;
      }
      if (aqi > 50 && aqi <= 100) {
        document.querySelector(".ml-0").innerText = `(${languages[userLang].satisfactory})`;
      }
      if (aqi > 100 && aqi <= 150) {
        document.querySelector(".ml-0").innerText = `(${languages[userLang].sensitive})`;
      }
      if (aqi > 150 && aqi <= 200) {
        document.querySelector(".ml-0").innerText = `(${languages[userLang].unhealthy})`;
      }
      if (aqi > 200 && aqi <= 300) {
        document.querySelector(".ml-0").innerText = `(${languages[userLang].veryUnhealthy})`;
      }
      if (aqi > 300) {
        document.querySelector(".ml-0").innerText = `(${languages[userLang].hazardous})`;
      }
    });
};

let weather = {
  apiKey: "20a36f8e1152244bbbd9ac296d3640f2",
  fetchWeather: function (city) {
    let isCountry = false;
    let index;
    for (let i = 0; i < Capitals.length; i++) {
      if (Capitals[i].country.toUpperCase() == city.toUpperCase()) {
        isCountry = true;
        index = i;
        break;
      }
    }
    if (isCountry) {
      city = Capitals[index].city;
    }
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=" +
        this.apiKey + 
        `&lang=${languages[userLang].apiLang}`
    )
      .then((response) => {
        if (!response.ok) {
          toastFunction(`${languages[userLang].noWeatherFound}`);
          throw new Error(`${languages[userLang].noWeatherFound}`);
        }
        return response.json();
      })
      .then((data) => {this.displayWeather(data);});
  },
  displayWeather: function (data) {
    //console.log(data);
    const { name } = data;
    //console.log(name);
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    const { sunrise, sunset } = data.sys;
    let date1 = new Date(sunrise * 1000);
    let date2 = new Date(sunset * 1000);
    //console.log(formatAMPM(date));
    const { lat, lon } = data.coord;
    const airIndex = AirQuality(lon, lat);

    document.getElementById("city").innerText = `${languages[userLang].weatherIn} ` + name;

    document.getElementById(
      "icon"
    ).src = `https://openweathermap.org/img/wn/${icon}.png`;

    document.getElementById("description").innerText = description;

    document.getElementById("temp").innerText = temp + "°C";

    document.getElementById("humidity").innerText = `${languages[userLang].humidity}: ${humidity}%`;

    document.getElementById("wind").innerText = `${languages[userLang].windSpeed}: ${speed}km/h`;

    document.getElementById("weather").classList.remove("loading");

    document.getElementById("sunrise").innerText = `${languages[userLang].sunrise}: ${formatAMPM(
      date1
    )}`;

    document.getElementById("sunset").innerText = `${languages[userLang].sunset}: ${formatAMPM(
      date2
    )}`;

    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
    getWeatherWeekly(url);
  },
  search: function () {
    if (document.querySelector(".search-bar").value != "") {
      this.fetchWeather(document.querySelector(".search-bar").value);
    } else {
      toastFunction(languages[userLang].pleaseAddLocation);
    }
  },
};

async function getWeatherWeekly(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      showWeatherData(data);
    });
}

function generateWeatherItem(
  dayString,
  iconName,
  nightTemperature,
  dayTemperature
) {
  let container = document.createElement("div");
  container.className = "weather-forecast-item rounded text-center";

  let day = document.createElement("div");
  day.innerText = dayString;
  day.style.color="#00dcff"
  day.style.fontFamily="cursive"
  day.style.fontWeight="bolder"
  day.style.textTransform="uppercase"
  day.style.fontSize="20px"

  let icon = document.createElement("img");
  icon.src = `https://openweathermap.org/img/wn/${iconName}.png`;


  let dayTemp = document.createElement("div");
  dayTemp.innerHTML = `${languages[userLang].day} \t`+`${dayTemperature}&#176;C`;
  dayTemp.style.fontFamily="cursive"
  dayTemp.style.fontWeight="bolder"
  dayTemp.style.textTransform="uppercase"

  let nightTemp = document.createElement("div");
  nightTemp.innerHTML = `${languages[userLang].night} \t`+`${nightTemperature}&#176;C`;
  nightTemp.style.color="#00dcff"
  nightTemp.style.fontFamily="cursive"
  nightTemp.style.fontWeight="bolder"
  nightTemp.style.textTransform="uppercase"


  
  container.appendChild(day);
  container.appendChild(icon);
  container.appendChild(dayTemp);
  container.appendChild(nightTemp);
  return container;
}

function showWeatherData(data) {
  let container = document.getElementById("weather-forecast");
  container.innerHTML = "";
  data.daily.forEach((day, idx) => {
    let dayString = window.moment(day.dt * 1000).format("dddd");
    let element = generateWeatherItem(
      languages[userLang][dayString.toLowerCase()],
      day.weather[0].icon,
      day.temp.night,
      day.temp.day
    );
    container.appendChild(element);
  });
}
//toast function
function toastFunction(val) {
  var x = document.getElementById("toast");
  x.className = "show";
  //change inner text
  document.getElementById("toast").innerText = val;
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
}
document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });
  
// get user city name via ip api
// identify the user's location without asking for permission
// using the ipinfo.io API

fetch("http://ip-api.com/json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    // get the user's city
    let city = data.city;

    // set the user's location
    weather.fetchWeather(city);
  });

document.getElementsByName("search-bar")[0].placeholder = languages[userLang].search
