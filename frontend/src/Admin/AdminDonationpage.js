import React from "react";
import "../project_styles/AdminData.css";
import "../project_scripts/dashboard";
import { donate_handler } from "../project_scripts/dashboard";

export default function AdminDonationPage() {
  return (
    <div className="admindrbody">
      <h1>DONATION DETAILS</h1>
      <p>Select blood group to view details</p>
      <div className="table-donate-request">
        <select id="Blood_group_donate_page" required>
          <option value="">Select the blood group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="Others">Others</option>
          <option value="all">All</option>
        </select>
        <button id="check_donate" onClick={donate_handler}>Show Details</button>
      </div>
      <div id="table_div"></div>
    </div>
  );
}
