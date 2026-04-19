import React from "react";
import "../project_scripts/dashboard";
// import "../project_scripts/db_transactions";
import { request_handler } from "../project_scripts/dashboard";
// import { change_request_html } from "../project_scripts/dashboard";

export default function AdminRequestPage() {
  return (
    <div className="admindrbody">
      <h1>REQUEST DETAILS</h1>
      <p>Select blood group to view details</p>
      <div className="table-donate-request">
        <select id="Blood_group_request_page" required>
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
        <button id="check_request" onClick={request_handler}>Show Details</button>
        <div id="table_div_request"></div>
      </div>
    </div>
  );
}
