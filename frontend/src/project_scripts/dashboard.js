import { initializeApp } from "firebase/app";
import {
  getFirestore,
  getDocs,
  query,
  collectionGroup,
} from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyC-ib62fjrfWgq7jis-8EngXAfRnEaV2t4",
  authDomain: "blood-bank-3f5d5.firebaseapp.com",
  projectId: "blood-bank-3f5d5",
  storageBucket: "blood-bank-3f5d5.appspot.com",
  messagingSenderId: "934584022747",
  appId: "1:934584022747:web:da72b3e3d80a408030befe",
};
initializeApp(firebaseConfig);
const db = getFirestore();

function request_handler() {
  const click_request_button = document.getElementById("check_request");
  if (click_request_button) {
    click_request_button.addEventListener("click", function () {
      const select_b = document.getElementById("Blood_group_request_page");

      const donator_blood = select_b.options[select_b.selectedIndex].value;
      change_request_html(donator_blood);
    });
  }
}

function donate_handler() {
  const click_donate_button = document.getElementById("check_donate");
  if (click_donate_button) {
    click_donate_button.addEventListener("click", function () {
      const select_b = document.getElementById("Blood_group_donate_page");

      const donator_blood = select_b.options[select_b.selectedIndex].value;
      change_donate_html(donator_blood);
    });
  }
}

async function change_donate_html(blood_group) {
  var rows = await view_blood_donate(blood_group);

  var html1 =
    "<table border='1|1' style=\"width:100%\"><tr><th>Name</th><th>Blood Group</th><th>Age</th><th>Gender</th><th>E-mail</th><th>Phone Number</th><th>Date of Form Filling</th></tr>";
  for (var i = 0; i < rows.length; i++) {
    const dateOne = new Date();
    var dateTwo = new Date(rows[i].Date_of_creation.seconds * 1000);

    const time = Math.abs(dateTwo - dateOne);
    const days = Math.ceil(time / (1000 * 60 * 60 * 24));

    if (days > 90) {
      html1 += '<tr bgcolor="green">';
      html1 += "<td>" + rows[i].Name + "</td>";
      html1 += "<td>" + rows[i].Blood_group + "</td>";
      html1 += "<td>" + rows[i].age + "</td>";
      html1 += "<td>" + rows[i].Gender + "</td>";
      html1 += "<td>" + rows[i].Email + "</td>";
      html1 += "<td>" + rows[i].Phone + "</td>";
      html1 += "<td>" + dateTwo + "</td>";

      html1 += "</tr>";
    }
    if (days <= 90) {
      html1 += '<tr bgcolor="red">';
      html1 += "<td>" + rows[i].Name + "</td>";
      html1 += "<td>" + rows[i].Blood_group + "</td>";
      html1 += "<td>" + rows[i].age + "</td>";
      html1 += "<td>" + rows[i].Gender + "</td>";
      html1 += "<td>" + rows[i].Email + "</td>";
      html1 += "<td>" + rows[i].Phone + "</td>";
      html1 += "<td>" + dateTwo + "</td>";

      html1 += "</tr>";
    }
  }
  html1 += "</table>";

  document.getElementById("table_div").innerHTML = html1;
}

async function view_blood_donate(blood_group) {
  // eslint-disable-next-line no-array-constructor
  var docs = new Array();
  if (blood_group === "all") {
    const donation_A_minus = query(collectionGroup(db, "A-_donate"));

    const querySnapshot_A_minus = await getDocs(donation_A_minus);

    querySnapshot_A_minus.forEach((doc) => {
      docs.push(doc.data());
    });
    const donation_A_plus = query(collectionGroup(db, "A+_donate"));

    const querySnapshot_A_plus = await getDocs(donation_A_plus);

    querySnapshot_A_plus.forEach((doc) => {
      docs.push(doc.data());
    });
    const donation_O_minus = query(collectionGroup(db, "O-_donate"));

    const querySnapshot_O_minus = await getDocs(donation_O_minus);

    querySnapshot_O_minus.forEach((doc) => {
      docs.push(doc.data());
    });
    const donation_O_plus = query(collectionGroup(db, "O+_donate"));

    const querySnapshot_O_plus = await getDocs(donation_O_plus);

    querySnapshot_O_plus.forEach((doc) => {
      docs.push(doc.data());
    });
    const donation_B_minus = query(collectionGroup(db, "B-_donate"));

    const querySnapshot_B_minus = await getDocs(donation_B_minus);

    querySnapshot_B_minus.forEach((doc) => {
      docs.push(doc.data());
    });
    const donation_B_plus = query(collectionGroup(db, "B+_donate"));

    const querySnapshot_B_plus = await getDocs(donation_B_plus);

    querySnapshot_B_plus.forEach((doc) => {
      docs.push(doc.data());
    });
    const donation_AB_minus = query(collectionGroup(db, "AB-_donate"));

    const querySnapshot_AB_minus = await getDocs(donation_AB_minus);

    querySnapshot_AB_minus.forEach((doc) => {
      docs.push(doc.data());
    });
    const donation_AB_plus = query(collectionGroup(db, "AB+_donate"));

    const querySnapshot_AB_plus = await getDocs(donation_AB_plus);

    querySnapshot_AB_plus.forEach((doc) => {
      docs.push(doc.data());
    });
    const donation_Others = query(collectionGroup(db, "Others_donate"));

    const querySnapshot_Others = await getDocs(donation_Others);

    querySnapshot_Others.forEach((doc) => {
      docs.push(doc.data());
    });
  } else {
    const donation = query(collectionGroup(db, blood_group + "_donate"));

    const querySnapshot = await getDocs(donation);

    await querySnapshot.forEach((doc) => {
      docs.push(doc.data());
    });
  }

  docs.sort(function (a, b) {
    var date1 = new Date(a.Date_of_creation);
    var date2 = new Date(b.Date_of_creation);
    const time = date2 - date1;
    return time / (1000 * 60 * 60 * 24);
  });

  return docs;
}
async function change_request_html(blood_group) {
  var rows = await view_blood_request(blood_group);

  var html =
    "<table border='1|1' style=\"width:100%\"><tr><th>Name</th><th>Blood Group</th><th>Age</th><th>Gender</th><th>E-mail</th><th>Phone Number</th><th>Purpose</th><th>Units required</th><th>Required Date</th><th>Date of Form Filling</th></tr>";
  for (var i = 0; i < rows.length; i++) {
    var datetoshow = new Date(rows[i].Date_of_creation.seconds * 1000);
    html += "<tr>";
    html += "<td>" + rows[i].Name + "</td>";
    html += "<td>" + rows[i].Blood_group + "</td>";
    html += "<td>" + rows[i].age + "</td>";
    html += "<td>" + rows[i].Gender + "</td>";
    html += "<td>" + rows[i].Email + "</td>";
    html += "<td>" + rows[i].Phone + "</td>";
    html += "<td>" + rows[i].Purpose + "</td>";
    html += "<td>" + rows[i].No_of_Units + "</td>";
    html += "<td>" + rows[i].required_date + "</td>";
    html += "<td>" + datetoshow.toString() + "</td>";

    html += "</tr>";
  }
  html += "</table>";
  document.getElementById("table_div_request").innerHTML = html;
}

async function view_blood_request(blood_group) {
  // eslint-disable-next-line no-array-constructor
  var docs = new Array();
  if (blood_group === "all") {
    const request_A_minus = query(collectionGroup(db, "A-_request"));

    const querySnapshot_A_minus = await getDocs(request_A_minus);

    querySnapshot_A_minus.forEach((doc) => {
      docs.push(doc.data());
    });
    const request_A_plus = query(collectionGroup(db, "A+_request"));

    const querySnapshot_A_plus = await getDocs(request_A_plus);

    querySnapshot_A_plus.forEach((doc) => {
      docs.push(doc.data());
    });
    const request_O_minus = query(collectionGroup(db, "O-_request"));

    const querySnapshot_O_minus = await getDocs(request_O_minus);

    querySnapshot_O_minus.forEach((doc) => {
      docs.push(doc.data());
    });
    const request_O_plus = query(collectionGroup(db, "O+_request"));

    const querySnapshot_O_plus = await getDocs(request_O_plus);

    querySnapshot_O_plus.forEach((doc) => {
      docs.push(doc.data());
    });
    const request_B_minus = query(collectionGroup(db, "B-_request"));

    const querySnapshot_B_minus = await getDocs(request_B_minus);

    querySnapshot_B_minus.forEach((doc) => {
      docs.push(doc.data());
    });
    const request_B_plus = query(collectionGroup(db, "B+_request"));

    const querySnapshot_B_plus = await getDocs(request_B_plus);

    querySnapshot_B_plus.forEach((doc) => {
      docs.push(doc.data());
    });
    const request_AB_minus = query(collectionGroup(db, "AB-_request"));

    const querySnapshot_AB_minus = await getDocs(request_AB_minus);

    querySnapshot_AB_minus.forEach((doc) => {
      docs.push(doc.data());
    });
    const request_AB_plus = query(collectionGroup(db, "AB+_request"));

    const querySnapshot_AB_plus = await getDocs(request_AB_plus);

    querySnapshot_AB_plus.forEach((doc) => {
      docs.push(doc.data());
    });
    const request_Others = query(collectionGroup(db, "Others_request"));

    const querySnapshot_Others = await getDocs(request_Others);

    querySnapshot_Others.forEach((doc) => {
      docs.push(doc.data());
    });
  } else {
    const request = query(collectionGroup(db, blood_group + "_request"));

    const querySnapshot = await getDocs(request);

    querySnapshot.forEach((doc) => {
      docs.push(doc.data());
    });
  }

  docs.sort(function (a, b) {
    var date1 = new Date(a.required_date);
    var date2 = new Date(b.required_date);
    const time = date1 - date2;
    return time / (1000 * 60 * 60 * 24);
  });

  return docs;
}

export {
  change_donate_html,
  change_request_html,
  request_handler,
  donate_handler,
};
