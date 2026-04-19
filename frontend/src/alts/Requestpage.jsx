import React, { useState } from 'react';
import "../project_styles/DoantePage.css"
const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    twitter: '',
    facebook: '',
    googlePlus: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
  });

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <form id="msform">
      {step === 1 && (
        <fieldset>
          <h2 className="fs-title">Request Page</h2>
          <h3 className="fs-subtitle">This is step 1</h3>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="number"
            name="Phone Number"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
          
          <input
            type="button"
            name="next"
            className="next action-button"
            value="Next"
            onClick={nextStep}
          />
        </fieldset>
      )}
      {step === 2 && (
        <fieldset>
          <h2 className="fs-title">Blood Group</h2>
          <h3 className="fs-subtitle">Your Blood Group</h3>
          <select id="Blood_group">
                    <option>Enter Blood Group</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>O+</option>
                    <option>O-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                    <option>Others</option>    
                    </select>
            <input
            type="number"
            placeholder="Enter No Of Units Required"
            value={formData.phone}
            onChange={handleChange}
          />
           <textarea
            type="text"
            placeholder="Enter the purpose"
            value={formData.address}
            onChange={handleChange}
          ></textarea>
          <input
            type="button"
            name="previous"
            className="previous action-button"
            value="Previous"
            onClick={prevStep}
          />
          <input
            type="button"
            name="next"
            className="next action-button"
            value="Next"
            onClick={nextStep}
          />
        </fieldset>
      )}
      {step === 3 && (
        <fieldset>
          <h2 className="fs-title">Personal Details</h2>
          <h3 className="fs-subtitle">We will never sell it</h3>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
          <input name="DOB" type="date" placeholder="Date of Birth" required onChange={handleChange}/>
          <input name="DOB" type="date" placeholder="REQUIRED DATE" required onChange={handleChange} />
            <select  id="Gender" >
            <option>Enter Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Others</option>    
            onChange={handleChange}
            </select>
          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          ></textarea>
          <input
            type="button"
            name="previous"
            className="previous action-button"
            value="Previous"
            onClick={prevStep}
          />
          <button
            className="submit action-button"
            onClick={handleSubmit}
            target="_top"
          >
            Submit
          </button>
        </fieldset>
      )}
    </form>
  );
};

export default MultiStepForm;
