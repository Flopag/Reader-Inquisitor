import React from 'react';
import "./css/calendar.css";

class Calendar extends React.Component {
    render(){
        const get_calendar_row_html = (first, last, today) => {
            const cells = [];

            for(let i=0; i < 7; ++i){
                const is_active = (i < first || i > last) ? false : true;
                cells.push(<div key={i} className={`Calendar-cell-${is_active} today-${i==today}`} id={`calendar-cell-${i}`}></div>)
            }

            return cells;
        };
        
        const get_calendar_html = (year, month) => {
            if(month < 1 || month > 12)
                return;

            const first_day = new Date(year, month-1, 1).getDay();
            const last_day = new Date(year, month, 0).getDay();

            const today = new Date();
            let totay_dd = -1;
            if(today.getMonth()+1 == month && today.getFullYear() == year)
                totay_dd = today.getDate();

            const rows = [];

            for(let i=0; i < 5; ++i){
                let today_day = -1;

                if(totay_dd != -1 && totay_dd+first_day <= (i+1)*7 && totay_dd+first_day > i*7)
                    today_day = today.getDay();

                rows.push(<div key={i} className='Calendar-row' id={`calendar-row-${i}`}>{
                    (i==0) ? get_calendar_row_html(first_day, 7, today_day) :
                    (i==4) ? get_calendar_row_html(0, last_day, today_day) :
                    get_calendar_row_html(0, 7, today_day)
                }</div>)
            }

            return rows;
        };

        return  <div id="Calendar">
                    <div className='Calendar-row'>
                        <div className={`Calendar-label-cell`}>Su</div>
                        <div className={`Calendar-label-cell`}>Mo</div>
                        <div className={`Calendar-label-cell`}>Tu</div>
                        <div className={`Calendar-label-cell`}>We</div>
                        <div className={`Calendar-label-cell`}>Th</div>
                        <div className={`Calendar-label-cell`}>Fr</div>
                        <div className={`Calendar-label-cell`}>Sa</div>
                    </div>
                    {get_calendar_html(2025, 9)}
                </div>
    }
}

export default Calendar;