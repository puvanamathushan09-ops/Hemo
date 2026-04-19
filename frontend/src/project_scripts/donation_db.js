import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore/lite";

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

export function get_donation() {
  const donator_name = document.getElementById("Donatorname").value;
  if (donator_name.length === 0) {
    document.getElementById("donator_name_error").innerHTML =
      "Kindly fill the name.";
    document.getElementById("donator_name_error").style.color = "red";
    return false;
  } else {
    document.getElementById("donator_name_error").innerHTML = "";
  }
  if (
    donator_name.includes(1) ||
    donator_name.includes(2) ||
    donator_name.includes(3) ||
    donator_name.includes(4) ||
    donator_name.includes(5) ||
    donator_name.includes(6) ||
    donator_name.includes(7) ||
    donator_name.includes(8) ||
    donator_name.includes(9) ||
    donator_name.includes(0)
  ) {
    document.getElementById("donator_name_error").innerHTML =
      "Enter Valid  name.";
    document.getElementById("donator_name_error").style.color = "red";
    return false;
  } else {
    document.getElementById("donator_name_error").innerHTML = "";
  }
  const donator_blood = document.getElementById("Blood_group").value;

  if (donator_blood === "") {
    document.getElementById("donator_blood_error").innerHTML =
      "Kindly select blood group.";
    document.getElementById("donator_blood_error").style.color = "red";
    return false;
  } else {
    document.getElementById("donator_blood_error").innerHTML = "";
  }

  const donator_email = document.getElementById("Donator_email").value;

  var validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (donator_email !== "") {
    if (!donator_email.match(validRegex)) {
      document.getElementById("donator_email_error").innerHTML =
        "Enter a valid E-mail.";
      document.getElementById("donator_email_error").style.color = "red";
      return false;
    }
    if (
      !(
        (donator_email.includes("@") && donator_email.includes(".in")) ||
        (donator_email.includes("@") && donator_email.includes(".com")) ||
        (donator_email.includes("@") && donator_email.includes(".edu"))
      )
    ) {
      document.getElementById("donator_email_error").innerHTML =
        "Enter a valid E-mail.";
      document.getElementById("donator_email_error").style.color = "red";
      return false;
    } else {
      document.getElementById("donator_email_error").innerHTML = "";
    }
  } else {
    document.getElementById("donator_email_error").innerHTML =
      "Enter a valid E-mail.";
    document.getElementById("donator_email_error").style.color = "red";
    return false;
  }
  const donator_gender = document.getElementById("Gender").value;
  if (donator_gender === "") {
    document.getElementById("donator_gender_error").innerHTML =
      "Select a gender.";
    document.getElementById("donator_gender_error").style.color = "red";
    return false;
  } else {
    document.getElementById("donator_gender_error").innerHTML = "";
  }
  const donator_phone = document.getElementById("Donator_phone").value;
  if (donator_phone.length !== 10) {
    document.getElementById("donator_phone_error").innerHTML =
      "Enter a valid phone number.";
    document.getElementById("donator_phone_error").style.color = "red";
    return false;
  } else if (
    donator_phone[0] === "1" ||
    donator_phone[0] === "2" ||
    donator_phone[0] === "3" ||
    donator_phone[0] === "4" ||
    donator_phone[0] === "5" ||
    donator_phone[0] === "0"
  ) {
    document.getElementById("donator_phone_error").innerHTML =
      "Enter a valid phone number.";
    document.getElementById("donator_phone_error").style.color = "red";
    return false;
  } else {
    document.getElementById("donator_phone_error").innerHTML = "";
  }

  console.log(donator_blood);
  if (!donator_blood === "") {
    document.getElementById("donator_blood_error").innerHTML =
      "Kindly select blood group.";
    document.getElementById("donator_blood_error").style.color = "red";
    return false;
  } else {
    document.getElementById("donator_blood_error").innerHTML = "";
  }

  if (donator_gender === "") {
    document.getElementById("donator_gender_error").innerHTML =
      "Select a gender.";
    document.getElementById("donator_gender_error").style.color = "red";
    return false;
  } else {
    document.getElementById("donator_gender_error").innerHTML = "";
  }
  const donator_dob = new Date(document.getElementById("Donator_dob").value);

  if (isNaN(donator_dob.getTime())) {
    document.getElementById("donator_dob_error").innerHTML = "Invalid DOB.";
    document.getElementById("donator_dob_error").style.color = "red";
    return false;
  } else {
    document.getElementById("donator_dob_error").innerHTML = "";
  }

  const donator_address = document.getElementById("Donator_address").value;
  if (donator_address.length === 0) {
    document.getElementById("donator_address_error").innerHTML =
      "Kindly fill the address.";
    document.getElementById("donator_address_error").style.color = "red";
    return false;
  } else {
    document.getElementById("donator_address_error").innerHTML = "";
  }

  const json = JSON.stringify({
    donator_name: donator_name,
    donator_dob: donator_dob,
    donator_gender: donator_gender,
    donator_email: donator_email,
    donator_blood: donator_blood,
    donator_phone: donator_phone,
    donator_address: donator_address,
  });

  return json;
}

async function check_age(dob) {
  var new_dob = new Date(dob);
  var dob_year = new_dob.getFullYear();
  function getAge(birthYear) {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var age = currentYear - birthYear;
    return age;
  }
  var calculatedAge = getAge(dob_year);
  return calculatedAge;
}

async function add_to_donation() {
  const donation_data = JSON.parse(get_donation());

  if (!donation_data) {
    return 0;
  }
  const time = new Date();

  const dbRef = collection(db, "Donate");

  var age_donor = await check_age(donation_data.donator_dob);
  if (age_donor > 18 && age_donor < 65) {
    await setDoc(
      doc(
        collection(
          dbRef,
          `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()}`,
          donation_data.donator_blood + "_donate"
        ),
        donation_data.donator_name
      ),
      {
        Name: donation_data.donator_name,
        dob: String(donation_data.donator_dob),
        Gender: donation_data.donator_gender,
        Email: donation_data.donator_email,
        Address: donation_data.donator_address,
        age: age_donor,
        Blood_group: donation_data.donator_blood,
        Date_of_creation: time,
        Phone: donation_data.donator_phone,
      }
    )
      .then(async (docRef) => {
        alert("Thank You for the Donation.");

        setTimeout(myURL, 500);
        function myURL() {
          window.location.href = "#";
        }
      })
      .catch((error) => {});
  } else {
    if (age_donor < 18) {
      alert("Sorry! You are not old enough to donate blood.");
    } else {
      alert("Sorry! You are not elligible to donate blood.");
    }
  }
}
export { add_to_donation };
