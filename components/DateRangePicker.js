import { useState } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import LocaleUtils from "react-day-picker/moment";
import "react-day-picker/lib/style.css";
import moment from "moment";

const format = "DD MMM yyyy";

const DayRangePicker = ({ datesChanged, bookedDates }) => {
  const today = moment().toDate();
  const tomorrow = moment().add(1, "day").toDate();

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);

  const formatedBookedDates = bookedDates.map((bd) => new Date(bd));

  return (
    <div className="date-range-picker-container">
      <div>
        <label>From:</label>
        <DayPickerInput
          formatDate={LocaleUtils.formatDate}
          parseDate={LocaleUtils.parseDate}
          placeholder={`${LocaleUtils.formatDate(new Date(), format)}`}
          format={format}
          value={startDate}
          dayPickerProps={{
            disabledDays: [
              ...formatedBookedDates,
              { before: moment().toDate() }
            ]
          }}
          onDayChange={(day) => {
            setStartDate(day);

            const momentDay = moment(day);
            const momentEndDay = moment(endDate);
            if (momentEndDay.diff(momentDay, 'days') < 1) {
              const newEndDay = momentDay.add(1, "day").toDate();
              setEndDate(newEndDay);
              datesChanged(day, newEndDay);
              return;
            }
            datesChanged(day, endDate);
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
          value={endDate}
          dayPickerProps={{
            disabledDays: [
              ...formatedBookedDates,
              { before: moment(startDate).add(1, 'day').toDate() }
            ]
          }}
          onDayChange={(day) => {
            setEndDate(day);
            datesChanged(startDate, day);
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