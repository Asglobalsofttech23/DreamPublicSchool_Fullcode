
import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";
import { useNavigate, useParams } from "react-router";
import "./payfees.css";

function FeeCollectionForm() {
  const { stu_id } = useParams();
  const [payfee, setPayfee] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${config.apiURL}/feeAllocation/payfeestud/${stu_id}`)
      .then((res) => {
        setPayfee(res.data);
        console.log("fees data", res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [stu_id]);

  const [formData, setFormData] = useState({
    payingfee: 0,
    discount: 0,
    feedate: new Date().toISOString().slice(0, 10),
    paymentMethod: "Cash", // Default payment method
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "payingfee" || name === "discount" ? parseFloat(value) : value,
    }));
  };

  const calculateTotalFees = (tutionFees, bookingFees) => {
    return tutionFees - bookingFees;
  };

  const calculateRemainingFees = (totalFees, payingFee, discount, payingFees) => {
    return totalFees - (payingFee + discount + payingFees);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { payingfee, discount, feedate, paymentMethod } = formData;

    if (isNaN(payingfee) || payingfee <= 0) {
      alert("Invalid paying amount");
      return;
    }

    try {
      for (const data of payfee) {
        const totalFees = calculateTotalFees(data.tution_fees, data.bookingfees);
        const remainingfee = calculateRemainingFees(totalFees, payingfee, discount, data.payingfees);

        if (remainingfee < 0) {
          alert("Invalid remaining fee calculation");
          return;
        }

        const formDataToSend = {
          stu_id: data.stu_id,
          stu_name: data.stu_name,
          payingfee,
          discount,
          remainingfee,
          feedate,
          paymentMethod,
        };

        console.log(formDataToSend);
        const response = await axios.post(`${config.apiURL}/feeAllocation/feeslogdata`, formDataToSend);

        if (response.status === 201) {
          const { feeslogid } = response.data;
          navigate(`/Invoice/${feeslogid}`);
        } else {
          alert("Failed to submit fees data");
        }
      }
    } catch (err) {
      console.error("Error saving fees data:", err);
      alert("Failed to submit fees data");
    }
  };

  return (
    <div className="fee-collection">
      <h2>Fee Collection</h2>

      {payfee.map((data) => (
        <form onSubmit={handleSubmit} key={data.stu_id}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={data.stu_name} readOnly />
          </div>
          <div className="form-group">
            <label>Class</label>
            <input type="text" value={data.cls_name} readOnly />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="feedate"
              value={formData.feedate}
              onChange={handleChange}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Particulars</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Tuition Fees</td>
                <td><input type="text" value={data.tution_fees} readOnly /></td>
              </tr>
              <tr>
                <td>2</td>
                <td>1st Installment Fees</td>
                <td><input type="text" value={data.firstinstallment} readOnly /></td>
              </tr>
              <tr>
                <td>3</td>
                <td>2nd Installment Fees</td>
                <td><input type="text" value={data.secondinstallment} readOnly /></td>
              </tr>
              <tr>
                <td>4</td>
                <td>Booking Fees</td>
                <td><input type="text" value={data.bookingfees} readOnly /></td>
              </tr>
              <tr>
                <td>5</td>
                <td>Discount</td>
                <td>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder={data.discount ? data.discount : ''}
                  />
                </td>
              </tr>
              <tr>
                <td>6</td>
                <td>Remaining Fees</td>
                <td>
                  <input
                    type="number"
                    value={calculateRemainingFees(calculateTotalFees(data.tution_fees, data.bookingfees), formData.payingfee, formData.discount, data.payingfees)}
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td>7</td>
                <td>Paying Amount</td>
                <td>
                  <input
                    type="number"
                    name="payingfee"
                    value={formData.payingfee}
                    onChange={handleChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="form-group">
            <label>Total</label>
            <input type="text" value={calculateTotalFees(data.tution_fees, data.bookingfees)} readOnly />
          </div>
          
          <div className="form-group">
            <label>Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          <button type="submit">Submit</button>
        </form>
      ))}
    </div>
  );
}

export default FeeCollectionForm;
