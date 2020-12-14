window.onload = () => {
  show("sformLogin");
  show("videoback");
  show("about");
  show("aboutBtn");
  clear("after");
  clear("coursesListBtn");
  clear("timetableBtn");
  clear("contentPlace");
  clear("calendarPlace");
  clear("logoutBtn");
}


let theID = '';
formLogin.onsubmit = async (event) => {
  event.preventDefault();
  let url = 'https://rt-students.com/api/getstudent/' + formLogin.elements['username'].value + '&' + formLogin.elements['password'].value;

  try {
    let response = await fetch(url);
    console.log(response.status);

    if (response.ok) {
      let result = await response.json();
      console.log(result[0]);
      theID = result[0].studentID;
      
      clear("sformLogin");
      clear("videoback");
      clear("about");
      clear("aboutBtn");
      show("after");
      show("coursesListBtn");
      show("timetableBtn");
      show("logoutBtn")
      createCardInfo(result);
      clear("calendarPlace")
      formLogin.elements['username'].value = "";
      formLogin.elements['password'].value = "";

    }
  } catch (e) {
    console.log(new Error("Result", e));
    pError.innerText = "Wrong name or password";
  }
}



coursesListBtn.onclick = async (event) => {
  let url = 'https://rt-students.com/api/getcourses/' + theID;
  try {
    let response = await fetch(url);
    if (response.ok) {
      let result = await response.json();
      show("contentPlace");
      clear("calendarPlace")
      clearTable()
      console.log(response.status);
      console.log(result);
      buildCardCourse(result);
    }
  } catch (e) {
    console.log(new Error("Result for courses", e));
  }
}



function clearTable() {
  while (contentPlace.firstChild) {
    contentPlace.removeChild(contentPlace.firstChild);
  }
}


function clear(nameItem) {
  document.getElementById(nameItem).hidden = true;
}


function show(nameItem) {
  document.getElementById(nameItem).hidden = false;
}


function createCardInfo(found) {
  studentName.innerText = `${found[0].firstName}  ${found[0].familyName}`;
  studentID.innerText = `  ${found[0].studentID}`;
  studentEmail.innerText = `  ${found[0].email}`;
  studentAdress.innerText = `  ${found[0].address}`;
  studentMobile.innerText = `  ${found[0].mobileNumber}`;
  studentDate.innerText = `  ${found[0].registeryDate}`;
}


function clearCardInfo() {
  studentName.innerText = '';
  studentID.innerText = '';
  studentEmail.innerText = '';
  studentAdress.innerText = '';
  studentMobile.innerText = '';
  studentDate.innerText = '';
}


function buildCardCourse(list) {
  let sectionTitle = document.createElement("div");
  contentPlace.appendChild(sectionTitle);
  sectionTitle.className = "col-12"

  let sectionName = document.createElement("h1");
  sectionTitle.appendChild(sectionName);
  sectionName.innerText = "Courses List"
  sectionName.className = "col-12 sectionT"

  for (let courseNum in list) {

    let cards = document.createElement("div");
    contentPlace.appendChild(cards);
    cards.className = "card"

    let cardsHeader = document.createElement("div");
    cards.appendChild(cardsHeader);
    cardsHeader.className = "card-header"

    let codeCourse = document.createElement("h6");
    cardsHeader.appendChild(codeCourse);
    codeCourse.innerText = list[courseNum].code;

    let titleCourse = document.createElement("h4");
    cardsHeader.appendChild(titleCourse);
    titleCourse.innerText = list[courseNum].courseName;

    let cardsBody = document.createElement("div");
    cards.appendChild(cardsBody);
    cardsBody.className = "card-body";

    let examMark = document.createElement("p");
    cardsBody.appendChild(examMark);
    examMark.innerText = `Exam Mark: ${list[courseNum].examMark}`

    let cardsFooter = document.createElement("div");
    cards.appendChild(cardsFooter);
    cardsFooter.className = "card-footer";

    let projectMark = document.createElement("p");
    cardsFooter.appendChild(projectMark);
    projectMark.innerText = `Project Mark: ${list[courseNum].projectMark}`
  }
}


timetableBtn.onclick = async (event) => {
  clearTable()
  clear("contentPlace")
  show("calendarPlace")
  let url = 'https://rt-students.com/api/getcalendar/' + theID;
  try {
    let response = await fetch(url);
    if (response.ok) {
      let result = await response.json();
      console.log(response.status);
      console.log(result);
      clear("contentPlace");
      show("calendarPlace");
      letitGo(changeStyle(result));
    }
  } catch (e) {
    console.log(new Error("Result for calendar", e));
  }
};


function letitGo(basis) {
  let calendarEl = document.getElementById('calendar');
  let calendar = new FullCalendar.Calendar(calendarEl, {
    selectable: true,
    headerToolbar: {
      left: 'prev,today,next',
      right: 'title'
    },
    businessHours: {
      daysOfWeek: [0, 1, 2, 3, 4]
    },
    displayEventTime: false,
    eventTimeFormat: { // like '14:30:00'
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    },
    height: '100%',
    expandRows: true,
    height: "auto",
    eventDisplay: "block",
    events: basis,
    eventDidMount: function (info) {
      $(info.el).popover({
        placement: 'top',
        trigger: 'hover',
        container: 'body',
        animation: true,
        html: true,
        title: `<p class="text-center"><u><strong>${info.event.title}</strong></u></p>      
                <h6 class="text-center">${info.event.start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} - ${info.event.end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</h6>`,
        content: `<p>The teacher: <strong> ${info.event.extendedProps.teacher} </strong></p> 
                  <p> Place: <strong class="text-success"> ${info.event.extendedProps.location} </strong></p> 
                  <p class="p-2 mb-2 bg-warning text-dark">Lesson number: <strong>${info.event.extendedProps.sessionNum} / ${info.event.extendedProps.totalLessons}</strong></p>  
                  <h5 class="text-center ${info.event.extendedProps.sessionTypeColor}"><strong>${info.event.extendedProps.sessionType}</strong></h5>`,
        
      });
    },
  });
  calendar.render();
}


function countLessons(data, codeCheck) {
  let count = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].code == codeCheck) { count++ }
  }
  return count;
}


function changeStyle(data) {
  let newStyle = data;
  for (let i in data) {
    newStyle[i]['id'] = data[i].code;
    if (data[i].locationId == 100) { newStyle[i].location = "Tel-Aviv" } else
      if (data[i].locationId == 300) { newStyle[i].location = "Web-lesson" } else { newStyle[i].location = "" }
    newStyle[i].totalLessons = countLessons(newStyle, newStyle[i].id);
    if (data[i].sessionType == 1) { newStyle[i].sessionType = "Theory"; newStyle[i].sessionTypeColor = "text-info" } else
      if (data[i].sessionType == 2) { newStyle[i].sessionType = "Practice"; newStyle[i].sessionTypeColor = "text-success" } else
        if (data[i].sessionType == 3) { newStyle[i].sessionType = "Exam"; newStyle[i].sessionTypeColor = "text-danger" } else { newStyle[i].sessionType = "" }
    if (newStyle[i].id == 621) {
      newStyle[i].title = '621: Web foundations';
      newStyle[i].backgroundColor = "#1C64FA"
      newStyle[i].borderColor = "#1C64FA"
    } else
      if (newStyle[i].id == 622) {
        newStyle[i].title = '622: HTML5';
        newStyle[i].backgroundColor = "#25645C"
        newStyle[i].borderColor = "#25645C"
      } else
        if (newStyle[i].id == 625) {
          newStyle[i].title = '625: CSS3';
          newStyle[i].backgroundColor = "#7F3A3B"
          newStyle[i].borderColor = "#7F3A3B"
        } else
          if (newStyle[i].id == 541) {
            newStyle[i].title = '541: Linux administration';
            newStyle[i].backgroundColor = "#2E4078"
            newStyle[i].borderColor = "#2E4078"
          } else
            if (newStyle[i].id == 623) {
              newStyle[i].title = '623: Bootstrap';
              newStyle[i].backgroundColor = "#6C6BC3"
              newStyle[i].borderColor = "#6C6BC3"
            } else
              if (newStyle[i].id == 624) {
                newStyle[i].title = '624: Javascript';
                newStyle[i].backgroundColor = "#95221F"
                newStyle[i].borderColor = "#95221F"
              } else
                if (newStyle[i].id == 578) {
                  newStyle[i].title = '578: NodeJs';
                  newStyle[i].backgroundColor = "#6C77A6"
                  newStyle[i].borderColor = "#6C77A6"
                } else
                  if (newStyle[i].id == 604) {
                    newStyle[i].title = '604: Source control';
                    newStyle[i].backgroundColor = "#97601C"
                    newStyle[i].borderColor = "#97601C"
                  } else
                    if (newStyle[i].id == 575) {
                      newStyle[i].title = '575: MongoDB';
                      newStyle[i].backgroundColor = "#040B9F"
                      newStyle[i].borderColor = "#040B9F"
                    } else
                      if (newStyle[i].id == 632) {
                        newStyle[i].title = '632: Python programming';
                        newStyle[i].backgroundColor = "#9446EE"
                        newStyle[i].borderColor = "#9446EE"
                      } else
                        if (newStyle[i].id == 631) {
                          newStyle[i].title = '631: Java Fundamentials';
                          newStyle[i].backgroundColor = "#405373"
                          newStyle[i].borderColor = "#405373"
                        } else {
                          newStyle[i]['title'] = data[i].code;
                        }
    newStyle[i]['start'] = data[i].sessionDate;
    newStyle[i]['end'] = data[i].sessionEndDate;
  }
  return newStyle;
}


logoutBtnClick.onclick = async (event) => {
  show("sformLogin");
  show("videoback");
  show("about");
  show("aboutBtn");
  clear("after");
  clear("coursesListBtn");
  clear("timetableBtn");
  clear("contentPlace");
  clear("calendarPlace");
  clear("logoutBtn");
  pError.innerText = "";
  clearCardInfo();
}