import React from 'react';
import "./css/calendar.css";

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        const today = new Date();
        this.state = {
            year: today.getFullYear(),
            month: today.getMonth() + 1
        };
    }
    
    get_calendar_row_html(first, last, today){
        const cells = [];

        for(let i=0; i < 7; ++i){
            const is_active = (i < first || i > last) ? false : true;
            cells.push(<div key={i} className={`Calendar-cell-${is_active} today-${i==today}`} id={`calendar-cell-${i}`}></div>)
        }

        return cells;
    }

    get_calendar_html(year, month){
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
                (i==0) ? this.get_calendar_row_html(first_day, 7, today_day) :
                (i==4) ? this.get_calendar_row_html(0, last_day, today_day) :
                this.get_calendar_row_html(0, 7, today_day)
            }</div>)
        }

        return rows;
    }

    to_previous_month(){
        this.setState((previous_state) => {
            let { year, month } = previous_state; 

            if(month == 1){
                year -= 1;
                month = 12;
            } else 
                month -= 1;
                
            return { year, month };
        });
    }

    to_next_month(){
        this.setState((previous_state) => {
            let { year, month } = previous_state; 

            if(month == 12){
                year += 1;
                month = 1;
            } else 
                month += 1;
                
            return { year, month };
        });
    }

    render(){
        const { year, month } = this.state;

        const to_previous_month = () => {
            this.to_previous_month();
        };

        const to_next_month = () => {
            this.to_next_month();
        };

        return  <div id="Calendar">
                    <div className='Calendar-headers'>
                        <div className={`Calendar-label-cell`} onClick={to_previous_month} style={{cursor: "pointer"}}>prev</div>
                        <div id="Calendar-title">{month}/{year}</div>
                        <div className={`Calendar-label-cell`} onClick={to_next_month} style={{cursor: "pointer"}}>Next</div>
                    </div>
                    <div className='Calendar-row'>
                        <div className={`Calendar-label-cell`}>Su</div>
                        <div className={`Calendar-label-cell`}>Mo</div>
                        <div className={`Calendar-label-cell`}>Tu</div>
                        <div className={`Calendar-label-cell`}>We</div>
                        <div className={`Calendar-label-cell`}>Th</div>
                        <div className={`Calendar-label-cell`}>Fr</div>
                        <div className={`Calendar-label-cell`}>Sa</div>
                    </div>
                    {this.get_calendar_html(year, month)}
                </div>
    }
}

export default Calendar;