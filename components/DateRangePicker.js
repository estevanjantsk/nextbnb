import { useState } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import LocaleUtils from "react-day-picker/moment";
import "react-day-picker/lib/style.css";

const format = "DD MMM yyyy";

const DayRangePicker = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  
  return (
    <div className="date-range-picker-container">
      <div>
        <label>From:</label>
        <DayPickerInput 
          formatDate={LocaleUtils.formatDate}
          parseDate={LocaleUtils.parseDate}
          placeholder={`${LocaleUtils.formatDate(new Date(), format)}`}
          format={format}
          dayPickerProps={{
            disabledDays: {
              before: new Date()
            }
          }}
          onDayChange={(day) => {
            setStartDate(day);
          }}
        />
      </div>
      <div>
        <label>To:</label>
        <DayPickerInput 
          formatDate={LocaleUtils.formatDate}
          parseDate={LocaleUtils.parseDate}
          placeholder={`${LocaleUtils.formatDate(new Date(), format)}`}
          format={format}
          dayPickerProps={{
            disabledDays: {
              before: new Date()
            }
          }}
          onDayChange={(day) => {
            setEndDate(day);
          }}
        />
      </div>
  
      <style jsx>{`
        .date-range-picker-container div {
          display: grid;
          border: 1px solid #ddd;
          grid-template-columns: 30% 70%;
          padding: 10px;
        }
      `}</style>
      <style jsx global>{`
        .DayPickerInput input {
          width: 120px;
          padding: 10px;
          font-size: 16px;
        }
      `}</style>
    </div>
  )
}

export default DayRangePicker;